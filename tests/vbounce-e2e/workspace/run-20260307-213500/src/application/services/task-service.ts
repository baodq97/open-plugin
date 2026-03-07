import type { Task } from '../../domain/entities/task.js';
import type { TaskRepository } from '../../domain/ports/task-repository.js';
import type { MembershipRepository } from '../../domain/ports/membership-repository.js';
import type { BoardRepository } from '../../domain/ports/board-repository.js';
import type { TaskStatus } from '../../domain/enums/task-status.js';
import type { TaskPriority } from '../../domain/enums/task-priority.js';
import { domainEvents } from '../../domain/events/domain-events.js';
import { WebhookEventType } from '../../domain/enums/webhook-event-type.js';
import { AppError } from '../../interface/http/middleware/error-handler.js';
import type { ActivityLogService } from './activity-log-service.js';

export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly membershipRepo: MembershipRepository,
    private readonly boardRepo: BoardRepository,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async createTask(
    boardId: string,
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assignee?: string | null;
      due_date?: string | null;
      tags?: string[];
    },
  ): Promise<Task> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    const membership = await this.membershipRepo.getMembership(boardId, userId);
    const isOwner = board.owner_id === userId;
    if (!isOwner && (!membership || membership.role === 'Viewer')) {
      throw new AppError(403, 'Viewers cannot create tasks');
    }

    const task = await this.taskRepo.insert({
      board_id: boardId,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'todo',
      priority: data.priority ?? 'P2',
      assignee: data.assignee ?? null,
      due_date: data.due_date ?? null,
      tags: data.tags ?? [],
      created_by: userId,
    });

    await this.activityLogService.log({
      board_id: boardId,
      task_id: task.id,
      actor_id: userId,
      action: 'task.created',
      changes: { task: { from: null, to: { title: task.title, status: task.status } } },
    });

    domainEvents.emit({
      type: WebhookEventType.TASK_CREATED,
      boardId,
      actorId: userId,
      task,
      timestamp: new Date(),
    }).catch(() => {});

    return task;
  }

  async getTask(boardId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepo.findById(taskId);
    if (!task || task.board_id !== boardId || task.deleted_at !== null) {
      throw new AppError(404, 'Task not found');
    }
    return task;
  }

  async listTasks(boardId: string): Promise<Task[]> {
    return this.taskRepo.findByBoardId(boardId);
  }

  async updateTask(
    boardId: string,
    taskId: string,
    userId: string,
    data: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      assignee?: string | null;
      due_date?: string | null;
      tags?: string[];
    },
  ): Promise<Task> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    const membership = await this.membershipRepo.getMembership(boardId, userId);
    const isOwner = board.owner_id === userId;
    if (!isOwner && (!membership || membership.role === 'Viewer')) {
      throw new AppError(403, 'Viewers cannot modify tasks');
    }

    const before = await this.taskRepo.findById(taskId);
    if (!before || before.board_id !== boardId || before.deleted_at !== null) {
      throw new AppError(404, 'Task not found');
    }

    const updated = await this.taskRepo.update(taskId, data);
    if (!updated) {
      throw new AppError(404, 'Task not found');
    }

    // Build changes map
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const key of Object.keys(data) as (keyof typeof data)[]) {
      if (data[key] !== undefined) {
        changes[key] = { from: (before as Record<string, unknown>)[key], to: (updated as Record<string, unknown>)[key] };
      }
    }

    let action = 'task.updated';
    if (data.status && data.status !== before.status) {
      action = 'task.status_changed';
    }

    await this.activityLogService.log({
      board_id: boardId,
      task_id: taskId,
      actor_id: userId,
      action,
      changes,
    });

    const eventType =
      data.status && data.status !== before.status
        ? WebhookEventType.TASK_STATUS_CHANGED
        : data.assignee !== undefined && data.assignee !== before.assignee
          ? WebhookEventType.TASK_ASSIGNED
          : WebhookEventType.TASK_UPDATED;

    domainEvents.emit({
      type: eventType,
      boardId,
      actorId: userId,
      task: updated,
      changes,
      timestamp: new Date(),
    }).catch(() => {});

    return updated;
  }

  async deleteTask(boardId: string, taskId: string, userId: string): Promise<Task> {
    const board = await this.boardRepo.findById(boardId);
    if (!board) {
      throw new AppError(404, 'Board not found');
    }

    const task = await this.taskRepo.findById(taskId);
    if (!task || task.board_id !== boardId || task.deleted_at !== null) {
      throw new AppError(404, 'Task not found');
    }

    const isOwner = board.owner_id === userId;
    const membership = await this.membershipRepo.getMembership(boardId, userId);
    const isAdmin = isOwner || (membership && membership.role === 'Admin');
    const isCreator = task.created_by === userId;

    if (!isCreator && !isAdmin) {
      throw new AppError(403, 'Only the task creator or an Admin can delete this task');
    }

    const deleted = await this.taskRepo.softDelete(taskId);
    if (!deleted) {
      throw new AppError(404, 'Task not found');
    }

    await this.activityLogService.log({
      board_id: boardId,
      task_id: taskId,
      actor_id: userId,
      action: 'task.deleted',
      changes: { task: { from: { title: task.title, status: task.status }, to: null } },
    });

    domainEvents.emit({
      type: WebhookEventType.TASK_DELETED,
      boardId,
      actorId: userId,
      task: deleted,
      timestamp: new Date(),
    }).catch(() => {});

    return deleted;
  }
}
