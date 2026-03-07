import type { Pool } from 'pg';
import type { Board } from '../../../domain/entities/board.js';
import type { BoardRepository } from '../../../domain/ports/board-repository.js';

export class PgBoardRepository implements BoardRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Board | null> {
    const result = await this.pool.query(
      'SELECT id, name, description, columns, owner_id, created_at, updated_at FROM boards WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findByOwnerId(ownerId: string): Promise<Board[]> {
    const result = await this.pool.query(
      'SELECT id, name, description, columns, owner_id, created_at, updated_at FROM boards WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId],
    );
    return result.rows.map(this.mapRow);
  }

  async insert(board: Omit<Board, 'id' | 'created_at' | 'updated_at'>): Promise<Board> {
    const result = await this.pool.query(
      `INSERT INTO boards (name, description, columns, owner_id)
       VALUES ($1, $2, $3::jsonb, $4)
       RETURNING id, name, description, columns, owner_id, created_at, updated_at`,
      [board.name, board.description, JSON.stringify(board.columns), board.owner_id],
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id: string, data: Partial<Pick<Board, 'name' | 'description' | 'columns'>>): Promise<Board | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (data.name !== undefined) {
      setClauses.push(`name = $${paramIdx++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      setClauses.push(`description = $${paramIdx++}`);
      values.push(data.description);
    }
    if (data.columns !== undefined) {
      setClauses.push(`columns = $${paramIdx++}::jsonb`);
      values.push(JSON.stringify(data.columns));
    }

    if (setClauses.length === 0) return this.findById(id);

    values.push(id);
    const result = await this.pool.query(
      `UPDATE boards SET ${setClauses.join(', ')} WHERE id = $${paramIdx}
       RETURNING id, name, description, columns, owner_id, created_at, updated_at`,
      values,
    );

    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: Record<string, unknown>): Board {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      columns: typeof row.columns === 'string' ? JSON.parse(row.columns) : row.columns as string[],
      owner_id: row.owner_id as string,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
    };
  }
}
