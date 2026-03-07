import type { Pool } from 'pg';
import type { Membership } from '../../../domain/entities/membership.js';
import type { MembershipRepository } from '../../../domain/ports/membership-repository.js';
import type { MemberRole } from '../../../domain/enums/member-role.js';

export class PgMembershipRepository implements MembershipRepository {
  constructor(private readonly pool: Pool) {}

  async getMembership(boardId: string, userId: string): Promise<Membership | null> {
    const result = await this.pool.query(
      'SELECT id, board_id, user_id, role, joined_at, updated_at FROM board_members WHERE board_id = $1 AND user_id = $2',
      [boardId, userId],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async getAccessibleBoardIds(userId: string): Promise<string[]> {
    const result = await this.pool.query(
      `SELECT DISTINCT board_id FROM board_members WHERE user_id = $1
       UNION
       SELECT id FROM boards WHERE owner_id = $1`,
      [userId],
    );
    return result.rows.map((r: Record<string, unknown>) => (r.board_id ?? r.id) as string);
  }

  async findByBoardId(boardId: string): Promise<Membership[]> {
    const result = await this.pool.query(
      'SELECT id, board_id, user_id, role, joined_at, updated_at FROM board_members WHERE board_id = $1 ORDER BY joined_at',
      [boardId],
    );
    return result.rows.map(this.mapRow);
  }

  async insert(boardId: string, userId: string, role: MemberRole): Promise<Membership> {
    const result = await this.pool.query(
      `INSERT INTO board_members (board_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING id, board_id, user_id, role, joined_at, updated_at`,
      [boardId, userId, role],
    );
    return this.mapRow(result.rows[0]);
  }

  async updateRole(boardId: string, userId: string, role: MemberRole): Promise<Membership | null> {
    const result = await this.pool.query(
      `UPDATE board_members SET role = $1 WHERE board_id = $2 AND user_id = $3
       RETURNING id, board_id, user_id, role, joined_at, updated_at`,
      [role, boardId, userId],
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: Record<string, unknown>): Membership {
    return {
      id: row.id as string,
      board_id: row.board_id as string,
      user_id: row.user_id as string,
      role: row.role as MemberRole,
      joined_at: new Date(row.joined_at as string),
      updated_at: new Date(row.updated_at as string),
    };
  }
}
