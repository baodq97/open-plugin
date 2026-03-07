import type { Membership } from '../../domain/entities/membership.js';
import type { MembershipRepository } from '../../domain/ports/membership-repository.js';
import type { BoardRepository } from '../../domain/ports/board-repository.js';
import type { MemberRole } from '../../domain/enums/member-role.js';
import { AppError } from '../../interface/http/middleware/error-handler.js';

export class MembershipService {
  constructor(
    private readonly membershipRepo: MembershipRepository,
    private readonly boardRepo: BoardRepository,
  ) {}

  async inviteMember(
    boardId: string,
    actorId: string,
    userId: string,
    role: MemberRole,
  ): Promise<{ membership: Membership; isNew: boolean }> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    // Check actor authorization
    const isOwner = board.owner_id === actorId;
    if (!isOwner) {
      const actorMembership = await this.membershipRepo.getMembership(boardId, actorId);
      if (!actorMembership || actorMembership.role !== 'Admin') {
        throw new AppError(403, 'Only the board owner or an Admin can invite members');
      }
    }

    // Check if user is already a member
    const existing = await this.membershipRepo.getMembership(boardId, userId);
    if (existing) {
      const updated = await this.membershipRepo.updateRole(boardId, userId, role);
      return { membership: updated!, isNew: false };
    }

    const membership = await this.membershipRepo.insert(boardId, userId, role);
    return { membership, isNew: true };
  }

  async getMembership(boardId: string, userId: string): Promise<Membership | null> {
    return this.membershipRepo.getMembership(boardId, userId);
  }

  async checkBoardAccess(boardId: string, userId: string): Promise<Membership> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    // Owner always has implicit access
    if (board.owner_id === userId) {
      const membership = await this.membershipRepo.getMembership(boardId, userId);
      if (membership) return membership;
      // Owner may not have explicit membership row; synthesize one
      return {
        id: 'owner',
        board_id: boardId,
        user_id: userId,
        role: 'Admin',
        joined_at: board.created_at,
        updated_at: board.updated_at,
      };
    }

    const membership = await this.membershipRepo.getMembership(boardId, userId);
    if (!membership) {
      throw new AppError(403, 'You do not have access to this board');
    }
    return membership;
  }
}
