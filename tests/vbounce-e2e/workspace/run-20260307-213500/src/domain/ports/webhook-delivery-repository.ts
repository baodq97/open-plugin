import type { WebhookDelivery, DeliveryStatus } from '../entities/webhook-delivery.js';

export interface WebhookDeliveryRepository {
  insert(delivery: Omit<WebhookDelivery, 'id'>): Promise<WebhookDelivery>;
  updateStatus(
    id: string,
    status: DeliveryStatus,
    attemptCount: number,
    lastStatusCode: number | null,
    lastError: string | null,
    nextRetryAt: Date | null,
  ): Promise<WebhookDelivery | null>;
  findPendingRetries(): Promise<WebhookDelivery[]>;
}
