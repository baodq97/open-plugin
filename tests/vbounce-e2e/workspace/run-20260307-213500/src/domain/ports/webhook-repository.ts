import type { Webhook } from '../entities/webhook.js';

export interface WebhookRepository {
  findById(id: string): Promise<Webhook | null>;
  findActiveByBoardId(boardId: string): Promise<Webhook[]>;
  insert(webhook: Omit<Webhook, 'id' | 'created_at' | 'updated_at'>): Promise<Webhook>;
  update(id: string, data: Partial<Pick<Webhook, 'url' | 'events' | 'active'>>): Promise<Webhook | null>;
}
