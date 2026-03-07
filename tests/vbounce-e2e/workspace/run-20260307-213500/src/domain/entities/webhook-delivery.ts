export type DeliveryStatus = 'pending' | 'success' | 'failed' | 'permanently_failed';

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  task_id: string | null;
  event_type: string;
  payload: Record<string, unknown>;
  attempt_count: number;
  status: DeliveryStatus;
  last_status_code: number | null;
  last_error: string | null;
  first_attempted_at: Date;
  last_attempted_at: Date;
  next_retry_at: Date | null;
}
