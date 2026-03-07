import type { Pool } from 'pg';
import type { ActivityLog } from '../../../domain/entities/activity-log.js';
import type { ActivityLogRepository } from '../../../domain/ports/activity-log-repository.js';

export class PgActivityLogRepository implements ActivityLogRepository {
  constructor(private readonly pool: Pool) {}

  async insert(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
    const result = await this.pool.query(
      `INSERT INTO activity_logs (board_id, task_id, actor_id, action, changes)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id, board_id, task_id, actor_id, action, changes, created_at`,
      [log.board_id, log.task_id, log.actor_id, log.action, JSON.stringify(log.changes)],
    );
    return this.mapRow(result.rows[0]);
  }

  async findByTaskId(
    taskId: string,
    page: number,
    pageSize: number,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    const countResult = await this.pool.query(
      'SELECT COUNT(*)::int AS total FROM activity_logs WHERE task_id = $1',
      [taskId],
    );
    const total = countResult.rows[0].total as number;

    const offset = (page - 1) * pageSize;
    const result = await this.pool.query(
      `SELECT id, board_id, task_id, actor_id, action, changes, created_at
       FROM activity_logs WHERE task_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [taskId, pageSize, offset],
    );

    return { data: result.rows.map(this.mapRow), total };
  }

  async findByBoardId(
    boardId: string,
    page: number,
    pageSize: number,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    const countResult = await this.pool.query(
      'SELECT COUNT(*)::int AS total FROM activity_logs WHERE board_id = $1',
      [boardId],
    );
    const total = countResult.rows[0].total as number;

    const offset = (page - 1) * pageSize;
    const result = await this.pool.query(
      `SELECT id, board_id, task_id, actor_id, action, changes, created_at
       FROM activity_logs WHERE board_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [boardId, pageSize, offset],
    );

    return { data: result.rows.map(this.mapRow), total };
  }

  async deleteOlderThan(days: number, batchSize: number): Promise<number> {
    const result = await this.pool.query(
      `DELETE FROM activity_logs
       WHERE id IN (
         SELECT id FROM activity_logs
         WHERE created_at < now() - ($1 || ' days')::interval
         LIMIT $2
       )`,
      [days.toString(), batchSize],
    );
    return result.rowCount ?? 0;
  }

  private mapRow(row: Record<string, unknown>): ActivityLog {
    return {
      id: row.id as string,
      board_id: row.board_id as string,
      task_id: row.task_id as string | null,
      actor_id: row.actor_id as string,
      action: row.action as string,
      changes: (typeof row.changes === 'string' ? JSON.parse(row.changes) : row.changes) as Record<string, unknown>,
      created_at: new Date(row.created_at as string),
    };
  }
}
