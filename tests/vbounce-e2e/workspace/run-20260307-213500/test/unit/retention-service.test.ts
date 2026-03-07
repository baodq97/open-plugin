import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { RetentionService } from '../../src/application/services/retention-service.js';
import type { ActivityLogRepository } from '../../src/domain/ports/activity-log-repository.js';

describe('RetentionService', () => {
  let service: RetentionService;
  let mockRepo: ActivityLogRepository;

  beforeEach(() => {
    mockRepo = {
      insert: mock.fn(async () => ({
        id: 'log-1', board_id: 'b', task_id: 't',
        actor_id: 'a', action: 'task.created', changes: {},
        created_at: new Date(),
      })),
      findByTaskId: mock.fn(async () => ({ data: [], total: 0 })),
      findByBoardId: mock.fn(async () => ({ data: [], total: 0 })),
      deleteOlderThan: mock.fn(async () => 0),
    };

    service = new RetentionService(mockRepo);
  });

  // T-AC-US-005-003-03: Purge job succeeds with no old entries
  it('should complete without error when nothing to purge', async () => {
    const deleted = await service.purge();
    assert.equal(deleted, 0);
  });

  // T-AC-US-005-003-01: Entries older than 90 days are purged
  it('should purge old entries in batches', async () => {
    let callCount = 0;
    (mockRepo.deleteOlderThan as ReturnType<typeof mock.fn>).mock.mockImplementation(
      async () => {
        callCount++;
        return callCount === 1 ? 1000 : 500;
      },
    );

    const deleted = await service.purge();
    assert.equal(deleted, 1500);
  });
});
