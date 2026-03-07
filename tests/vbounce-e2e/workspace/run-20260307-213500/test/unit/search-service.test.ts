import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { SearchService } from '../../src/application/services/search-service.js';
import type { SearchRepository } from '../../src/domain/ports/search-repository.js';
import type { MembershipRepository } from '../../src/domain/ports/membership-repository.js';

describe('SearchService', () => {
  let service: SearchService;
  let mockSearchRepo: SearchRepository;
  let mockMembershipRepo: MembershipRepository;

  beforeEach(() => {
    mockSearchRepo = {
      fullTextSearch: mock.fn(async () => ({ data: [], total: 0 })),
    };

    mockMembershipRepo = {
      getMembership: mock.fn(async () => null),
      getAccessibleBoardIds: mock.fn(async () => ['board-1', 'board-2']),
      findByBoardId: mock.fn(async () => []),
      insert: mock.fn(async () => ({
        id: 'mem-1', board_id: 'board-1', user_id: 'user-1',
        role: 'Member' as const, joined_at: new Date(), updated_at: new Date(),
      })),
      updateRole: mock.fn(async () => null),
    };

    service = new SearchService(mockSearchRepo, mockMembershipRepo);
  });

  // T-AC-US-004-001-03: Search without query parameter returns 422
  it('should reject search without q and without filters', async () => {
    await assert.rejects(
      () => service.search('user-1', undefined, undefined, 1, 20, undefined),
      (err: Error) => {
        assert.match(err.message, /Search query parameter 'q' is required/);
        return true;
      },
    );
  });

  // T-AC-US-004-002-04: Reject unknown filter field
  it('should reject unknown filter field', async () => {
    await assert.rejects(
      () => service.search('user-1', 'test', { nonexistent_field: 'value' }, 1, 20, undefined),
      (err: Error) => {
        assert.match(err.message, /Unknown filter field: nonexistent_field/);
        return true;
      },
    );
  });

  // T-AC-US-004-001-04: Search scoped to accessible boards only
  it('should return empty if user has no accessible boards', async () => {
    (mockMembershipRepo.getAccessibleBoardIds as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => [],
    );

    const result = await service.search('user-1', 'test', undefined, 1, 20, undefined);

    assert.equal(result.data.length, 0);
    assert.equal(result.total, 0);
  });
});
