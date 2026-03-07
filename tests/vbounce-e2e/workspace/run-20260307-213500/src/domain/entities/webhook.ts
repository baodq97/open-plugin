import type { WebhookEventType } from '../enums/webhook-event-type.js';

export interface Webhook {
  id: string;
  board_id: string;
  url: string;
  secret_encrypted: string;
  events: WebhookEventType[];
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
