import crypto from 'node:crypto';
import type { Webhook } from '../../domain/entities/webhook.js';
import type { WebhookRepository } from '../../domain/ports/webhook-repository.js';
import type { WebhookDeliveryRepository } from '../../domain/ports/webhook-delivery-repository.js';
import type { MembershipRepository } from '../../domain/ports/membership-repository.js';
import type { BoardRepository } from '../../domain/ports/board-repository.js';
import type { DomainEvent } from '../../domain/events/domain-events.js';
import { domainEvents } from '../../domain/events/domain-events.js';
import type { WebhookRetryQueue } from '../../infrastructure/queue/webhook-retry-queue.js';
import { AppError } from '../../interface/http/middleware/error-handler.js';

export class WebhookService {
  constructor(
    private readonly webhookRepo: WebhookRepository,
    private readonly deliveryRepo: WebhookDeliveryRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly boardRepo: BoardRepository,
    private readonly retryQueue: WebhookRetryQueue,
  ) {
    // Register for domain events
    domainEvents.on(this.handleEvent.bind(this));
  }

  async createWebhook(
    boardId: string,
    userId: string,
    data: { url: string; secret: string; events?: string[] },
  ): Promise<Webhook> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    const isOwner = board.owner_id === userId;
    if (!isOwner) {
      const membership = await this.membershipRepo.getMembership(boardId, userId);
      if (!membership || membership.role !== 'Admin') {
        throw new AppError(403, 'Only the board owner or an Admin can configure webhooks');
      }
    }

    // Encrypt secret (AES-256-GCM)
    const encryptedSecret = this.encryptSecret(data.secret);

    const defaultEvents = [
      'task.created',
      'task.updated',
      'task.status_changed',
      'task.assigned',
      'task.deleted',
    ];

    const webhook = await this.webhookRepo.insert({
      board_id: boardId,
      url: data.url,
      secret_encrypted: encryptedSecret,
      events: (data.events ?? defaultEvents) as Webhook['events'],
      active: true,
    });

    return webhook;
  }

  private async handleEvent(event: DomainEvent): Promise<void> {
    const webhooks = await this.webhookRepo.findActiveByBoardId(event.boardId);

    for (const webhook of webhooks) {
      if (!webhook.events.includes(event.type)) continue;

      const deliveryId = crypto.randomUUID();
      const payload = this.buildPayload(deliveryId, event);
      const secret = this.decryptSecret(webhook.secret_encrypted);
      const signature = this.computeSignature(secret, JSON.stringify(payload));

      await this.deliverWebhook(webhook, deliveryId, event, payload, signature);
    }
  }

  private async deliverWebhook(
    webhook: Webhook,
    deliveryId: string,
    event: DomainEvent,
    payload: Record<string, unknown>,
    signature: string,
    attempt = 1,
  ): Promise<void> {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature-256': `sha256=${signature}`,
          'X-Delivery-Id': deliveryId,
          'X-Event-Type': event.type,
          'User-Agent': 'TaskFlow-Webhook/1.0',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        await this.deliveryRepo.insert({
          webhook_id: webhook.id,
          task_id: event.task.id,
          event_type: event.type,
          payload,
          attempt_count: attempt,
          status: 'success',
          last_status_code: response.status,
          last_error: null,
          first_attempted_at: new Date(),
          last_attempted_at: new Date(),
          next_retry_at: null,
        });
      } else {
        await this.handleFailedDelivery(webhook, deliveryId, event, payload, signature, attempt, response.status, `HTTP ${response.status}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      await this.handleFailedDelivery(webhook, deliveryId, event, payload, signature, attempt, null, errorMsg);
    }
  }

  private async handleFailedDelivery(
    webhook: Webhook,
    deliveryId: string,
    event: DomainEvent,
    payload: Record<string, unknown>,
    signature: string,
    attempt: number,
    statusCode: number | null,
    error: string,
  ): Promise<void> {
    const MAX_ATTEMPTS = 4;
    const BACKOFF_DELAYS = [1000, 4000, 16000]; // ms

    if (attempt >= MAX_ATTEMPTS) {
      await this.deliveryRepo.insert({
        webhook_id: webhook.id,
        task_id: event.task.id,
        event_type: event.type,
        payload,
        attempt_count: attempt,
        status: 'permanently_failed',
        last_status_code: statusCode,
        last_error: error,
        first_attempted_at: new Date(),
        last_attempted_at: new Date(),
        next_retry_at: null,
      });
      return;
    }

    const delay = BACKOFF_DELAYS[attempt - 1] ?? 16000;
    const nextRetry = new Date(Date.now() + delay);

    await this.deliveryRepo.insert({
      webhook_id: webhook.id,
      task_id: event.task.id,
      event_type: event.type,
      payload,
      attempt_count: attempt,
      status: 'failed',
      last_status_code: statusCode,
      last_error: error,
      first_attempted_at: new Date(),
      last_attempted_at: new Date(),
      next_retry_at: nextRetry,
    });

    // Schedule retry
    this.retryQueue.enqueue(() => {
      return this.deliverWebhook(webhook, deliveryId, event, payload, signature, attempt + 1);
    }, delay);
  }

  private buildPayload(deliveryId: string, event: DomainEvent): Record<string, unknown> {
    const base: Record<string, unknown> = {
      delivery_id: deliveryId,
      event: event.type,
      timestamp: event.timestamp.toISOString(),
      actor: { user_id: event.actorId },
      data: {
        task: {
          id: event.task.id,
          board_id: event.task.board_id,
          title: event.task.title,
          status: event.task.status,
          priority: event.task.priority,
          assignee: event.task.assignee,
          tags: event.task.tags,
          created_at: event.task.created_at,
        },
      },
    };

    if (event.changes) {
      (base.data as Record<string, unknown>).changes = event.changes;
    }

    return base;
  }

  private encryptSecret(secret: string): string {
    const key = process.env.WEBHOOK_ENCRYPTION_KEY ?? 'default-encryption-key-32bytes!!';
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'utf8').subarray(0, 32), iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }

  private decryptSecret(encrypted: string): string {
    const key = process.env.WEBHOOK_ENCRYPTION_KEY ?? 'default-encryption-key-32bytes!!';
    const [ivHex, data, authTagHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'utf8').subarray(0, 32), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private computeSignature(secret: string, payload: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
}
