import type { Pool } from 'pg';
import type { Task } from '../../../domain/entities/task.js';
import type { TaskRepository } from '../../../domain/ports/task-repository.js';
import type { TaskStatus } from '../../../domain/enums/task-status.js';
import type { TaskPriority } from '../../../domain/enums/task-priority.js';

export class PgTaskRepository implements TaskRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Task | null> {
    const result = await this.pool.query(
      `SELECT id, board_id, title, description, status, priority, assignee,
              due_date, tags, created_by, created_at, updated_at, deleted_at
       FROM tasks WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findByBoardId(boardId: string): Promise<Task[]> {
    const result = await this.pool.query(
      `SELECT id, board_id, title, description, status, priority, assignee,
              due_date, tags, created_by, created_at, updated_at, deleted_at
       FROM tasks WHERE board_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [boardId],
    );
    return result.rows.map(this.mapRow);
  }

  async insert(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Task> {
    const result = await this.pool.query(
      `INSERT INTO tasks (board_id, title, description, status, priority, assignee, due_date, tags, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
       RETURNING id, board_id, title, description, status, priority, assignee,
                 due_date, tags, created_by, created_at, updated_at, deleted_at`,
      [
        task.board_id,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.assignee,
        task.due_date,
        JSON.stringify(task.tags),
        task.created_by,
      ],
    );
    return this.mapRow(result.rows[0]);
  }

  async update(
    id: string,
    data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee' | 'due_date' | 'tags'>>,
  ): Promise<Task | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (data.title !== undefined) {
      setClauses.push(`title = $${paramIdx++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      setClauses.push(`description = $${paramIdx++}`);
      values.push(data.description);
    }
    if (data.status !== undefined) {
      setClauses.push(`status = $${paramIdx++}`);
      values.push(data.status);
    }
    if (data.priority !== undefined) {
      setClauses.push(`priority = $${paramIdx++}`);
      values.push(data.priority);
    }
    if (data.assignee !== undefined) {
      setClauses.push(`assignee = $${paramIdx++}`);
      values.push(data.assignee);
    }
    if (data.due_date !== undefined) {
      setClauses.push(`due_date = $${paramIdx++}`);
      values.push(data.due_date);
    }
    if (data.tags !== undefined) {
      setClauses.push(`tags = $${paramIdx++}::jsonb`);
      values.push(JSON.stringify(data.tags));
    }

    if (setClauses.length === 0) return this.findById(id);

    values.push(id);
    const result = await this.pool.query(
      `UPDATE tasks SET ${setClauses.join(', ')}
       WHERE id = $${paramIdx} AND deleted_at IS NULL
       RETURNING id, board_id, title, description, status, priority, assignee,
                 due_date, tags, created_by, created_at, updated_at, deleted_at`,
      values,
    );

    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async softDelete(id: string): Promise<Task | null> {
    const result = await this.pool.query(
      `UPDATE tasks SET deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, board_id, title, description, status, priority, assignee,
                 due_date, tags, created_by, created_at, updated_at, deleted_at`,
      [id],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: Record<string, unknown>): Task {
    return {
      id: row.id as string,
      board_id: row.board_id as string,
      title: row.title as string,
      description: row.description as string | null,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      assignee: row.assignee as string | null,
      due_date: row.due_date ? String(row.due_date) : null,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags as string[]) ?? [],
      created_by: row.created_by as string,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
      deleted_at: row.deleted_at ? new Date(row.deleted_at as string) : null,
    };
  }
}
