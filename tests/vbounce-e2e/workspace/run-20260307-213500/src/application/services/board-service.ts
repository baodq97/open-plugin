import type { Board } from '../../domain/entities/board.js';
import type { BoardRepository } from '../../domain/ports/board-repository.js';
import type { MembershipRepository } from '../../domain/ports/membership-repository.js';
import { AppError } from '../../interface/http/middleware/error-handler.js';

export class BoardService {
  constructor(
    private readonly boardRepo: BoardRepository,
    private readonly membershipRepo: MembershipRepository,
  ) {}

  async createBoard(
    userId: string,
    name: string,
    description?: string,
    columns?: string[],
  ): Promise<Board> {
    const board = await this.boardRepo.insert({
      name,
      description: description ?? null,
      columns: columns ?? ['todo', 'in_progress', 'review', 'done'],
      owner_id: userId,
    });

    // Auto-add creator as Admin member
    await this.membershipRepo.insert(board.id, userId, 'Admin');

    return board;
  }

  async updateBoard(
    boardId: string,
    userId: string,
    data: { name?: string; description?: string | null; columns?: string[] },
  ): Promise<Board> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    const isOwner = board.owner_id === userId;
    if (!isOwner) {
      const membership = await this.membershipRepo.getMembership(boardId, userId);
      if (!membership || membership.role !== 'Admin') {
        throw new AppError(403, 'Only the board owner or an Admin can modify board settings');
      }
    }

    const updated = await this.boardRepo.update(boardId, data);
    if (!updated) {
      throw new AppError(404, 'Board not found');
    }

    return updated;
  }

  async getBoard(boardId: string): Promise<Board> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }
    return board;
  }
}
