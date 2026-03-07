import type { Pool } from 'pg';
import type { Webhook } from '../../../domain/entities/webhook.js';
import type { WebhookRepository } from '../../../domain/ports/webhook-repository.js';
import type { WebhookEventType } from '../../../domain/enums/webhook-event-type.js';

export class PgWebhookRepository implements WebhookRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Webhook | null> {
    const result = await this.pool.query(
      'SELECT id, board_id, url, secret_encrypted, events, active, created_at, updated_at FROM webhooks WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findActiveByBoardId(boardId: string): Promise<Webhook[]> {
    const result = await this.pool.query(
      'SELECT id, board_id, url, secret_encrypted, events, active, created_at, updated_at FROM webhooks WHERE board_id = $1 AND active = true',
      [boardId],
    );
    return result.rows.map(this.mapRow);
  }

  async insert(webhook: Omit<Webhook, 'id' | 'created_at' | 'updated_at'>): Promise<Webhook> {
    const result = await this.pool.query(
      `INSERT INTO webhooks (board_id, url, secret_encrypted, events, active)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       RETURNING id, board_id, url, secret_encrypted, events, active, created_at, updated_at`,
      [webhook.board_id, webhook.url, webhook.secret_encrypted, JSON.stringify(webhook.events), webhook.active],
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id: string, data: Partial<Pick<Webhook, 'url' | 'events' | 'active'>>): Promise<Webhook | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (data.url !== undefined) {
      setClauses.push(`url = $${paramIdx++}`);
      values.push(data.url);
    }
    if (data.events !== undefined) {
      setClauses.push(`events = $${paramIdx++}::jsonb`);
      values.push(JSON.stringify(data.events));
    }
    if (data.active !== undefined) {
      setClauses.push(`active = $${paramIdx++}`);
      values.push(data.active);
    }

    if (setClauses.length === 0) return this.findById(id);

    values.push(id);
    const result = await this.pool.query(
      `UPDATE webhooks SET ${setClauses.join(', ')} WHERE id = $${paramIdx}
       RETURNING id, board_id, url, secret_encrypted, events, active, created_at, updated_at`,
      values,
    );

    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: Record<string, unknown>): Webhook {
    return {
      id: row.id as string,
      board_id: row.board_id as string,
      url: row.url as string,
      secret_encrypted: row.secret_encrypted as string,
      events: (typeof row.events === 'string' ? JSON.parse(row.events) : row.events) as WebhookEventType[],
      active: row.active as boolean,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
    };
  }
}
