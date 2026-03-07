import type { Pool } from 'pg';
import type { Task } from '../../../domain/entities/task.js';
import type {
  SearchRepository,
  SearchFilters,
  SearchPagination,
  SearchSort,
  SearchResult,
} from '../../../domain/ports/search-repository.js';
import type { TaskStatus } from '../../../domain/enums/task-status.js';
import type { TaskPriority } from '../../../domain/enums/task-priority.js';

export class PgSearchRepository implements SearchRepository {
  constructor(private readonly pool: Pool) {}

  async fullTextSearch(
    boardIds: string[],
    query: string,
    filters: SearchFilters,
    pagination: SearchPagination,
    sort: SearchSort,
  ): Promise<SearchResult> {
    const conditions: string[] = ['deleted_at IS NULL'];
    const values: unknown[] = [];
    let paramIdx = 1;

    // Board access scoping
    if (boardIds.length > 0) {
      conditions.push(`board_id = ANY($${paramIdx++})`);
      values.push(boardIds);
    } else {
      return { data: [], total: 0 };
    }

    // Full-text search
    if (query && query.trim().length > 0) {
      conditions.push(`search_vector @@ plainto_tsquery('english', $${paramIdx++})`);
      values.push(query);
    }

    // Filters
    if (filters.status) {
      conditions.push(`status = $${paramIdx++}`);
      values.push(filters.status);
    }
    if (filters.priority) {
      conditions.push(`priority = $${paramIdx++}`);
      values.push(filters.priority);
    }
    if (filters.assignee) {
      conditions.push(`assignee = $${paramIdx++}::uuid`);
      values.push(filters.assignee);
    }
    if (filters.board) {
      conditions.push(`board_id = $${paramIdx++}::uuid`);
      values.push(filters.board);
    }
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(`tags ?| $${paramIdx++}`);
      values.push(filters.tags);
    }
    if (filters.due_date_from) {
      conditions.push(`due_date >= $${paramIdx++}::date`);
      values.push(filters.due_date_from);
    }
    if (filters.due_date_to) {
      conditions.push(`due_date <= $${paramIdx++}::date`);
      values.push(filters.due_date_to);
    }

    const whereClause = conditions.join(' AND ');

    // Validate sort field to prevent SQL injection
    const allowedFields = ['created_at', 'updated_at', 'due_date', 'priority'];
    const sortField = allowedFields.includes(sort.field) ? sort.field : 'created_at';
    const sortDir = sort.direction === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countResult = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM tasks WHERE ${whereClause}`,
      values,
    );
    const total = countResult.rows[0].total as number;

    // Data query
    const offset = (pagination.page - 1) * pagination.pageSize;
    const dataResult = await this.pool.query(
      `SELECT id, board_id, title, description, status, priority, assignee,
              due_date, tags, created_by, created_at, updated_at, deleted_at
       FROM tasks
       WHERE ${whereClause}
       ORDER BY ${sortField} ${sortDir}
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...values, pagination.pageSize, offset],
    );

    return {
      data: dataResult.rows.map(this.mapRow),
      total,
    };
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
      tags: (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) as string[] ?? [],
      created_by: row.created_by as string,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
      deleted_at: row.deleted_at ? new Date(row.deleted_at as string) : null,
    };
  }
}
