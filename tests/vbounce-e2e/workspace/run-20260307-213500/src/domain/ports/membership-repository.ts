import type { Membership } from '../entities/membership.js';
import type { MemberRole } from '../enums/member-role.js';

export interface MembershipRepository {
  getMembership(boardId: string, userId: string): Promise<Membership | null>;
  getAccessibleBoardIds(userId: string): Promise<string[]>;
  findByBoardId(boardId: string): Promise<Membership[]>;
  insert(boardId: string, userId: string, role: MemberRole): Promise<Membership>;
  updateRole(boardId: string, userId: string, role: MemberRole): Promise<Membership | null>;
}
