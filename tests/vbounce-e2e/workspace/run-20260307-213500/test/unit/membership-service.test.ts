import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { MembershipService } from '../../src/application/services/membership-service.js';
import type { MembershipRepository } from '../../src/domain/ports/membership-repository.js';
import type { BoardRepository } from '../../src/domain/ports/board-repository.js';
import type { Board } from '../../src/domain/entities/board.js';
import type { Membership } from '../../src/domain/entities/membership.js';

function createMockBoard(overrides: Partial<Board> = {}): Board {
  return {
    id: 'board-1', name: 'Test', description: null,
    columns: ['todo', 'done'], owner_id: 'owner-1',
    created_at: new Date(), updated_at: new Date(),
    ...overrides,
  };
}

function createMockMembership(overrides: Partial<Membership> = {}): Membership {
  return {
    id: 'mem-1', board_id: 'board-1', user_id: 'user-2',
    role: 'Member', joined_at: new Date(), updated_at: new Date(),
    ...overrides,
  };
}

describe('MembershipService', () => {
  let service: MembershipService;
  let mockMembershipRepo: MembershipRepository;
  let mockBoardRepo: BoardRepository;

  beforeEach(() => {
    mockBoardRepo = {
      findById: mock.fn(async () => createMockBoard()),
      findByOwnerId: mock.fn(async () => []),
      insert: mock.fn(async () => createMockBoard()),
      update: mock.fn(async () => createMockBoard()),
    };

    mockMembershipRepo = {
      getMembership: mock.fn(async () => null),
      getAccessibleBoardIds: mock.fn(async () => ['board-1']),
      findByBoardId: mock.fn(async () => []),
      insert: mock.fn(async () => createMockMembership()),
      updateRole: mock.fn(async () => createMockMembership({ role: 'Admin' })),
    };

    service = new MembershipService(mockMembershipRepo, mockBoardRepo);
  });

  // T-AC-US-002-003-01: Invite user to board with role
  it('should invite a new member', async () => {
    const { membership, isNew } = await service.inviteMember('board-1', 'owner-1', 'user-2', 'Member');

    assert.equal(isNew, true);
    assert.equal(membership.role, 'Member');
  });

  // T-AC-US-002-003-04: Update role of existing member
  it('should update role of existing member', async () => {
    // First call returns existing membership (for actorId check)
    let callCount = 0;
    (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => {
        callCount++;
        if (callCount === 2) return createMockMembership(); // existing user
        return null; // actor is owner (not found as member, but is owner)
      },
    );

    const { membership, isNew } = await service.inviteMember('board-1', 'owner-1', 'user-2', 'Admin');

    assert.equal(isNew, false);
    assert.equal(membership.role, 'Admin');
  });

  // T-AC-US-002-003-03: Non-owner Member cannot invite
  it('should reject invite from non-owner Member', async () => {
    (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => createMockBoard({ owner_id: 'other-user' }),
    );
    (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => createMockMembership({ user_id: 'actor-1', role: 'Member' }),
    );

    await assert.rejects(
      () => service.inviteMember('board-1', 'actor-1', 'user-3', 'Member'),
      (err: Error) => {
        assert.match(err.message, /Only the board owner or an Admin can invite members/);
        return true;
      },
    );
  });
});
