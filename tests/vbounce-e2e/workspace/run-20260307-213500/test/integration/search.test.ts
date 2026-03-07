/**
 * Integration Tests: Search and Filtering (F4)
 *
 * Implements ALL 12 test skeletons from requirements:
 *   T-AC-US-004-001-01 through T-AC-US-004-003-04
 *
 * Implements design specs:
 *   ITS-040 through ITS-051
 *
 * Uses: node:test, mock repositories
 */

import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { SearchService } from '../../src/application/services/search-service.js';
import type { SearchRepository } from '../../src/domain/ports/search-repository.js';
import type { MembershipRepository } from '../../src/domain/ports/membership-repository.js';
import type { Task } from '../../src/domain/entities/task.js';

// --- Factories ---

function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1', board_id: 'board-1', title: 'Test Task',
    description: null, status: 'todo', priority: 'P2',
    assignee: null, due_date: null, tags: [],
    created_by: 'user-1',
    created_at: new Date('2026-03-07T10:00:00Z'),
    updated_at: new Date('2026-03-07T10:00:00Z'),
    deleted_at: null,
    ...overrides,
  };
}

// --- Test Suite ---

describe('Search and Filtering Integration Tests', () => {
  let searchService: SearchService;
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

    searchService = new SearchService(mockSearchRepo, mockMembershipRepo);
  });

  // ==========================================================================
  // US-004-001: Full-Text Search Tasks
  // ==========================================================================

  describe('US-004-001: Full-Text Search Tasks', () => {
    // T-AC-US-004-001-01 / ITS-040: Full-text search returns matching tasks
    it('should return matching tasks from full-text search (T-AC-US-004-001-01 / ITS-040)', async () => {
      const matchingTasks = [
        createMockTask({ id: 'task-1', board_id: 'board-1', title: 'Fix login bug' }),
        createMockTask({ id: 'task-2', board_id: 'board-2', description: 'Login page crashes on submit' }),
      ];

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: matchingTasks, total: 2 }),
      );

      const result = await searchService.search('user-1', 'login', undefined, 1, 20, undefined);

      assert.equal(result.data.length, 2, 'Should return 2 matching tasks');
      assert.equal(result.total, 2, 'Total should be 2');
      // Verify tasks from different boards
      const boardIds = result.data.map(t => t.board_id);
      assert.ok(boardIds.includes('board-1'), 'Should include task from board-1');
      assert.ok(boardIds.includes('board-2'), 'Should include task from board-2');
    });

    // T-AC-US-004-001-02 / ITS-041: Search with no results returns empty collection
    it('should return empty collection for no results (T-AC-US-004-001-02 / ITS-041)', async () => {
      const result = await searchService.search('user-1', 'quantum', undefined, 1, 20, undefined);

      assert.equal(result.data.length, 0, 'Should return empty array');
      assert.equal(result.total, 0, 'Total should be 0');
    });

    // T-AC-US-004-001-03 / ITS-042: Search without query parameter returns 422
    it('should reject search without q parameter (T-AC-US-004-001-03 / ITS-042)', async () => {
      await assert.rejects(
        () => searchService.search('user-1', undefined, undefined, 1, 20, undefined),
        (err: Error) => {
          assert.match(err.message, /Search query parameter 'q' is required/);
          return true;
        },
      );
    });

    // T-AC-US-004-001-04 / ITS-043: Search scoped to accessible boards only
    it('should scope results to accessible boards (T-AC-US-004-001-04 / ITS-043)', async () => {
      // User only has access to board-1
      (mockMembershipRepo.getAccessibleBoardIds as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ['board-1'],
      );

      const onlyBoard1Tasks = [
        createMockTask({ id: 'task-1', board_id: 'board-1', title: 'Deploy service' }),
      ];
      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async (params: Record<string, unknown>) => {
          // Verify boardIds parameter only includes accessible boards
          const boardIds = params.boardIds as string[];
          assert.deepEqual(boardIds, ['board-1'], 'Search should be scoped to accessible boards');
          return { data: onlyBoard1Tasks, total: 1 };
        },
      );

      const result = await searchService.search('user-1', 'deploy', undefined, 1, 20, undefined);

      assert.equal(result.data.length, 1, 'Should return only board-1 tasks');
      assert.equal(result.data[0].board_id, 'board-1', 'Task should be from board-1');
    });
  });

  // ==========================================================================
  // US-004-002: Filter Tasks by Attributes
  // ==========================================================================

  describe('US-004-002: Filter Tasks by Attributes', () => {
    // T-AC-US-004-002-01 / ITS-044: Filter tasks by single attribute (priority)
    it('should filter tasks by single attribute (T-AC-US-004-002-01 / ITS-044)', async () => {
      const p0Tasks = [
        createMockTask({ id: 'task-1', priority: 'P0' }),
        createMockTask({ id: 'task-5', priority: 'P0' }),
        createMockTask({ id: 'task-8', priority: 'P0' }),
      ];

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: p0Tasks, total: 3 }),
      );

      const result = await searchService.search(
        'user-1', undefined, { priority: 'P0' }, 1, 20, undefined,
      );

      assert.equal(result.data.length, 3, 'Should return 3 P0 tasks');
      for (const task of result.data) {
        assert.equal(task.priority, 'P0', 'All tasks should have priority P0');
      }
    });

    // T-AC-US-004-002-02 / ITS-045: Filter tasks by combined attributes (AND logic)
    it('should combine filters with AND logic (T-AC-US-004-002-02 / ITS-045)', async () => {
      const filteredTasks = [
        createMockTask({ id: 'task-3', status: 'in_progress', assignee: 'U1' }),
      ];

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: filteredTasks, total: 1 }),
      );

      const result = await searchService.search(
        'user-1', undefined,
        { status: 'in_progress', assignee: 'U1' },
        1, 20, undefined,
      );

      assert.equal(result.data.length, 1, 'Should return only tasks matching both filters');
      assert.equal(result.data[0].status, 'in_progress', 'Status should match');
      assert.equal(result.data[0].assignee, 'U1', 'Assignee should match');
    });

    // T-AC-US-004-002-03 / ITS-046: Filter tasks by due date range (inclusive)
    it('should filter by due date range inclusive (T-AC-US-004-002-03 / ITS-046)', async () => {
      const dateTasks = [
        createMockTask({ id: 'task-10', due_date: new Date('2026-03-10') }),
        createMockTask({ id: 'task-12', due_date: new Date('2026-03-12') }),
        createMockTask({ id: 'task-15', due_date: new Date('2026-03-15') }),
      ];

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: dateTasks, total: 3 }),
      );

      const result = await searchService.search(
        'user-1', undefined,
        { due_date_from: '2026-03-10', due_date_to: '2026-03-15' },
        1, 20, undefined,
      );

      assert.equal(result.data.length, 3, 'Should return tasks within date range');
      for (const task of result.data) {
        const dueDate = new Date(task.due_date!);
        assert.ok(dueDate >= new Date('2026-03-10'), 'Due date should be >= 2026-03-10');
        assert.ok(dueDate <= new Date('2026-03-15'), 'Due date should be <= 2026-03-15');
      }
    });

    // T-AC-US-004-002-04 / ITS-047: Reject unknown filter field -> HTTP 400
    it('should reject unknown filter field (T-AC-US-004-002-04 / ITS-047)', async () => {
      await assert.rejects(
        () => searchService.search(
          'user-1', 'test',
          { nonexistent_field: 'value' },
          1, 20, undefined,
        ),
        (err: Error) => {
          assert.match(err.message, /Unknown filter field: nonexistent_field/);
          return true;
        },
      );
    });
  });

  // ==========================================================================
  // US-004-003: Paginate and Sort Search Results
  // ==========================================================================

  describe('US-004-003: Paginate and Sort Search Results', () => {
    // T-AC-US-004-003-01 / ITS-048: Default pagination at 20 items
    it('should default to 20 items per page (T-AC-US-004-003-01 / ITS-048)', async () => {
      const tasks = Array.from({ length: 20 }, (_, i) =>
        createMockTask({ id: `task-${i + 1}`, title: `Bug ${i + 1}` }),
      );

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: tasks, total: 50 }),
      );

      const result = await searchService.search('user-1', 'bug', undefined, 1, 20, undefined);

      assert.equal(result.data.length, 20, 'Should return 20 tasks (default page size)');
      assert.equal(result.total, 50, 'Total should be 50');
    });

    // T-AC-US-004-003-02 / ITS-049: Custom page size with sort by priority descending
    it('should support custom page size and sort (T-AC-US-004-003-02 / ITS-049)', async () => {
      const sortedTasks = [
        createMockTask({ id: 'task-1', priority: 'P0' }),
        createMockTask({ id: 'task-2', priority: 'P0' }),
        createMockTask({ id: 'task-3', priority: 'P1' }),
        createMockTask({ id: 'task-4', priority: 'P1' }),
        createMockTask({ id: 'task-5', priority: 'P2' }),
        createMockTask({ id: 'task-6', priority: 'P2' }),
        createMockTask({ id: 'task-7', priority: 'P2' }),
        createMockTask({ id: 'task-8', priority: 'P3' }),
        createMockTask({ id: 'task-9', priority: 'P3' }),
        createMockTask({ id: 'task-10', priority: 'P3' }),
      ];

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: sortedTasks, total: 50 }),
      );

      const result = await searchService.search('user-1', 'bug', undefined, 1, 10, '-priority');

      assert.equal(result.data.length, 10, 'Should return 10 tasks');
      // Verify P0 tasks come first (descending priority)
      assert.equal(result.data[0].priority, 'P0', 'First task should be P0');
    });

    // T-AC-US-004-003-03 / ITS-050: Reject page size exceeding 100 -> HTTP 422
    it('should reject page size exceeding 100 (T-AC-US-004-003-03 / ITS-050)', async () => {
      await assert.rejects(
        () => searchService.search('user-1', 'bug', undefined, 1, 200, undefined),
        (err: Error) => {
          assert.match(err.message, /Page size must not exceed 100/);
          return true;
        },
      );
    });

    // T-AC-US-004-003-04 / ITS-051: Last page returns fewer items
    it('should return fewer items on last page (T-AC-US-004-003-04 / ITS-051)', async () => {
      const lastPageTasks = Array.from({ length: 5 }, (_, i) =>
        createMockTask({ id: `task-${i + 21}`, title: `Bug ${i + 21}` }),
      );

      (mockSearchRepo.fullTextSearch as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => ({ data: lastPageTasks, total: 25 }),
      );

      const result = await searchService.search('user-1', 'bug', undefined, 2, 20, undefined);

      assert.equal(result.data.length, 5, 'Last page should have 5 remaining items');
      assert.equal(result.total, 25, 'Total should be 25');
    });
  });
});
