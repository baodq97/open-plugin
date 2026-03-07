import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { BoardService } from '../../src/application/services/board-service.js';
import type { BoardRepository } from '../../src/domain/ports/board-repository.js';
import type { MembershipRepository } from '../../src/domain/ports/membership-repository.js';
import type { Board } from '../../src/domain/entities/board.js';

function createMockBoard(overrides: Partial<Board> = {}): Board {
  return {
    id: 'board-1',
    name: 'Test Board',
    description: null,
    columns: ['todo', 'in_progress', 'review', 'done'],
    owner_id: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

describe('BoardService', () => {
  let boardService: BoardService;
  let mockBoardRepo: BoardRepository;
  let mockMembershipRepo: MembershipRepository;

  beforeEach(() => {
    mockBoardRepo = {
      findById: mock.fn(async () => createMockBoard()),
      findByOwnerId: mock.fn(async () => [createMockBoard()]),
      insert: mock.fn(async () => createMockBoard()),
      update: mock.fn(async () => createMockBoard({ name: 'Updated Board' })),
    };

    mockMembershipRepo = {
      getMembership: mock.fn(async () => null),
      getAccessibleBoardIds: mock.fn(async () => ['board-1']),
      findByBoardId: mock.fn(async () => []),
      insert: mock.fn(async () => ({
        id: 'mem-1', board_id: 'board-1', user_id: 'user-1',
        role: 'Admin' as const, joined_at: new Date(), updated_at: new Date(),
      })),
      updateRole: mock.fn(async () => null),
    };

    boardService = new BoardService(mockBoardRepo, mockMembershipRepo);
  });

  // T-AC-US-002-001-01: Create board with defaults
  it('should create board with default columns', async () => {
    const board = await boardService.createBoard('user-1', 'Sprint Board');

    assert.equal(board.name, 'Test Board');
    assert.deepEqual(board.columns, ['todo', 'in_progress', 'review', 'done']);
  });

  // T-AC-US-002-002-03: Non-owner Member cannot modify columns
  it('should reject non-owner non-Admin from updating board', async () => {
    (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => createMockBoard({ owner_id: 'other-user' }),
    );
    (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => ({
        id: 'mem-1', board_id: 'board-1', user_id: 'user-1',
        role: 'Member' as const, joined_at: new Date(), updated_at: new Date(),
      }),
    );

    await assert.rejects(
      () => boardService.updateBoard('board-1', 'user-1', { name: 'New Name' }),
      (err: Error) => {
        assert.match(err.message, /Only the board owner or an Admin can modify board settings/);
        return true;
      },
    );
  });

  it('should return 404 for non-existent board on update', async () => {
    (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(async () => null);

    await assert.rejects(
      () => boardService.updateBoard('board-999', 'user-1', { name: 'New' }),
      (err: Error) => {
        assert.match(err.message, /Board not found/);
        return true;
      },
    );
  });
});
