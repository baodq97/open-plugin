import type { Pool } from 'pg';
import type { WebhookDelivery, DeliveryStatus } from '../../../domain/entities/webhook-delivery.js';
import type { WebhookDeliveryRepository } from '../../../domain/ports/webhook-delivery-repository.js';

export class PgWebhookDeliveryRepository implements WebhookDeliveryRepository {
  constructor(private readonly pool: Pool) {}

  async insert(delivery: Omit<WebhookDelivery, 'id'>): Promise<WebhookDelivery> {
    const result = await this.pool.query(
      `INSERT INTO webhook_deliveries
         (webhook_id, task_id, event_type, payload, attempt_count, status, last_status_code, last_error, first_attempted_at, last_attempted_at, next_retry_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        delivery.webhook_id,
        delivery.task_id,
        delivery.event_type,
        JSON.stringify(delivery.payload),
        delivery.attempt_count,
        delivery.status,
        delivery.last_status_code,
        delivery.last_error,
        delivery.first_attempted_at,
        delivery.last_attempted_at,
        delivery.next_retry_at,
      ],
    );
    return this.mapRow(result.rows[0]);
  }

  async updateStatus(
    id: string,
    status: DeliveryStatus,
    attemptCount: number,
    lastStatusCode: number | null,
    lastError: string | null,
    nextRetryAt: Date | null,
  ): Promise<WebhookDelivery | null> {
    const result = await this.pool.query(
      `UPDATE webhook_deliveries
       SET status = $1, attempt_count = $2, last_status_code = $3, last_error = $4, last_attempted_at = now(), next_retry_at = $5
       WHERE id = $6
       RETURNING *`,
      [status, attemptCount, lastStatusCode, lastError, nextRetryAt, id],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findPendingRetries(): Promise<WebhookDelivery[]> {
    const result = await this.pool.query(
      `SELECT * FROM webhook_deliveries
       WHERE status = 'failed' AND next_retry_at IS NOT NULL AND next_retry_at <= now()
       ORDER BY next_retry_at ASC
       LIMIT 100`,
    );
    return result.rows.map(this.mapRow);
  }

  private mapRow(row: Record<string, unknown>): WebhookDelivery {
    return {
      id: row.id as string,
      webhook_id: row.webhook_id as string,
      task_id: row.task_id as string | null,
      event_type: row.event_type as string,
      payload: (typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload) as Record<string, unknown>,
      attempt_count: row.attempt_count as number,
      status: row.status as DeliveryStatus,
      last_status_code: row.last_status_code as number | null,
      last_error: row.last_error as string | null,
      first_attempted_at: new Date(row.first_attempted_at as string),
      last_attempted_at: new Date(row.last_attempted_at as string),
      next_retry_at: row.next_retry_at ? new Date(row.next_retry_at as string) : null,
    };
  }
}
