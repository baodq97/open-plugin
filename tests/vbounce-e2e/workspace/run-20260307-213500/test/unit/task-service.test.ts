import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { TaskService } from '../../src/application/services/task-service.js';
import { ActivityLogService } from '../../src/application/services/activity-log-service.js';
import type { TaskRepository } from '../../src/domain/ports/task-repository.js';
import type { MembershipRepository } from '../../src/domain/ports/membership-repository.js';
import type { BoardRepository } from '../../src/domain/ports/board-repository.js';
import type { ActivityLogRepository } from '../../src/domain/ports/activity-log-repository.js';
import type { Task } from '../../src/domain/entities/task.js';
import type { Board } from '../../src/domain/entities/board.js';
import type { Membership } from '../../src/domain/entities/membership.js';

function createMockBoard(overrides: Partial<Board> = {}): Board {
  return {
    id: 'board-1',
    name: 'Test Board',
    description: null,
    columns: ['todo', 'in_progress', 'review', 'done'],
    owner_id: 'owner-1',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    board_id: 'board-1',
    title: 'Test Task',
    description: null,
    status: 'todo',
    priority: 'P2',
    assignee: null,
    due_date: null,
    tags: [],
    created_by: 'user-1',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    ...overrides,
  };
}

function createMockMembership(overrides: Partial<Membership> = {}): Membership {
  return {
    id: 'membership-1',
    board_id: 'board-1',
    user_id: 'user-1',
    role: 'Member',
    joined_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepo: TaskRepository;
  let mockMembershipRepo: MembershipRepository;
  let mockBoardRepo: BoardRepository;
  let mockActivityLogRepo: ActivityLogRepository;

  beforeEach(() => {
    mockTaskRepo = {
      findById: mock.fn(async () => createMockTask()),
      findByBoardId: mock.fn(async () => [createMockTask()]),
      insert: mock.fn(async () => createMockTask()),
      update: mock.fn(async () => createMockTask({ status: 'in_progress' })),
      softDelete: mock.fn(async () => createMockTask({ deleted_at: new Date() })),
    };

    mockBoardRepo = {
      findById: mock.fn(async () => createMockBoard()),
      findByOwnerId: mock.fn(async () => [createMockBoard()]),
      insert: mock.fn(async () => createMockBoard()),
      update: mock.fn(async () => createMockBoard()),
    };

    mockMembershipRepo = {
      getMembership: mock.fn(async () => createMockMembership()),
      getAccessibleBoardIds: mock.fn(async () => ['board-1']),
      findByBoardId: mock.fn(async () => [createMockMembership()]),
      insert: mock.fn(async () => createMockMembership()),
      updateRole: mock.fn(async () => createMockMembership()),
    };

    mockActivityLogRepo = {
      insert: mock.fn(async () => ({
        id: 'log-1', board_id: 'board-1', task_id: 'task-1',
        actor_id: 'user-1', action: 'task.created', changes: {},
        created_at: new Date(),
      })),
      findByTaskId: mock.fn(async () => ({ data: [], total: 0 })),
      findByBoardId: mock.fn(async () => ({ data: [], total: 0 })),
      deleteOlderThan: mock.fn(async () => 0),
    };

    const activityLogService = new ActivityLogService(mockActivityLogRepo);
    taskService = new TaskService(mockTaskRepo, mockMembershipRepo, mockBoardRepo, activityLogService);
  });

  describe('createTask', () => {
    it('should create a task for a Member', async () => {
      const task = await taskService.createTask('board-1', 'user-1', {
        title: 'Fix login bug',
        status: 'todo',
        priority: 'P1',
      });

      assert.equal(task.id, 'task-1');
      assert.equal(task.title, 'Test Task');
    });

    it('should reject Viewer from creating tasks', async () => {
      (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => createMockMembership({ role: 'Viewer' }),
      );
      (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => createMockBoard({ owner_id: 'other-user' }),
      );

      await assert.rejects(
        () => taskService.createTask('board-1', 'user-1', { title: 'Test' }),
        (err: Error) => {
          assert.match(err.message, /Viewers cannot create tasks/);
          return true;
        },
      );
    });

    it('should reject when board does not exist', async () => {
      (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(async () => null);

      await assert.rejects(
        () => taskService.createTask('board-1', 'user-1', { title: 'Test' }),
        (err: Error) => {
          assert.match(err.message, /Board not found/);
          return true;
        },
      );
    });
  });

  describe('deleteTask', () => {
    it('should allow creator to delete their own task', async () => {
      const task = await taskService.deleteTask('board-1', 'task-1', 'user-1');
      assert.notEqual(task.deleted_at, null);
    });

    it('should allow Admin to delete another user\'s task', async () => {
      (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => createMockMembership({ user_id: 'admin-1', role: 'Admin' }),
      );

      const task = await taskService.deleteTask('board-1', 'task-1', 'admin-1');
      assert.notEqual(task.deleted_at, null);
    });

    it('should reject non-creator Member from deleting task', async () => {
      (mockMembershipRepo.getMembership as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => createMockMembership({ user_id: 'user-2', role: 'Member' }),
      );
      (mockBoardRepo.findById as ReturnType<typeof mock.fn>).mock.mockImplementation(
        async () => createMockBoard({ owner_id: 'other-user' }),
      );

      await assert.rejects(
        () => taskService.deleteTask('board-1', 'task-1', 'user-2'),
        (err: Error) => {
          assert.match(err.message, /Only the task creator or an Admin can delete this task/);
          return true;
        },
      );
    });
  });
});
