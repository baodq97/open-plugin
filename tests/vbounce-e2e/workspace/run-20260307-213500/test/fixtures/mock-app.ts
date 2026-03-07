/**
 * Mock application factory for integration tests.
 * Creates an in-memory Express app with mock repositories for testing
 * without requiring a real database connection.
 */

import type { Board } from '../../src/domain/entities/board.js';
import type { Task } from '../../src/domain/entities/task.js';
import type { Membership } from '../../src/domain/entities/membership.js';
import type { ActivityLog } from '../../src/domain/entities/activity-log.js';
import type { Webhook } from '../../src/domain/entities/webhook.js';
import type { WebhookDelivery } from '../../src/domain/entities/webhook-delivery.js';

/**
 * In-memory store for test data.
 */
export interface TestStore {
  boards: Map<string, Board>;
  tasks: Map<string, Task>;
  memberships: Map<string, Membership>;
  activityLogs: ActivityLog[];
  webhooks: Map<string, Webhook>;
  webhookDeliveries: WebhookDelivery[];
}

export function createTestStore(): TestStore {
  return {
    boards: new Map(),
    tasks: new Map(),
    memberships: new Map(),
    activityLogs: [],
    webhooks: new Map(),
    webhookDeliveries: [],
  };
}

/**
 * Seed a board with default columns.
 */
export function seedBoard(store: TestStore, id: string, ownerId: string, overrides: Partial<Board> = {}): Board {
  const board: Board = {
    id,
    name: `Board ${id}`,
    description: null,
    columns: ['todo', 'in_progress', 'review', 'done'],
    owner_id: ownerId,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
  store.boards.set(id, board);
  return board;
}

/**
 * Seed a membership.
 */
export function seedMembership(
  store: TestStore,
  boardId: string,
  userId: string,
  role: 'Admin' | 'Member' | 'Viewer',
): Membership {
  const key = `${boardId}:${userId}`;
  const membership: Membership = {
    id: `mem-${key}`,
    board_id: boardId,
    user_id: userId,
    role,
    joined_at: new Date(),
    updated_at: new Date(),
  };
  store.memberships.set(key, membership);
  return membership;
}

/**
 * Seed a task.
 */
export function seedTask(
  store: TestStore,
  id: string,
  boardId: string,
  createdBy: string,
  overrides: Partial<Task> = {},
): Task {
  const task: Task = {
    id,
    board_id: boardId,
    title: `Task ${id}`,
    description: null,
    status: 'todo',
    priority: 'P2',
    assignee: null,
    due_date: null,
    tags: [],
    created_by: createdBy,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    ...overrides,
  };
  store.tasks.set(id, task);
  return task;
}

/**
 * Seed an activity log entry.
 */
export function seedActivityLog(
  store: TestStore,
  boardId: string,
  taskId: string,
  actorId: string,
  action: string,
  changes: Record<string, unknown>,
  createdAt?: Date,
): ActivityLog {
  const log: ActivityLog = {
    id: `log-${store.activityLogs.length + 1}`,
    board_id: boardId,
    task_id: taskId,
    actor_id: actorId,
    action,
    changes,
    created_at: createdAt ?? new Date(),
  };
  store.activityLogs.push(log);
  return log;
}

/**
 * Seed a webhook configuration.
 */
export function seedWebhook(
  store: TestStore,
  id: string,
  boardId: string,
  url: string = 'https://example.com/hook',
  secret: string = 'test-webhook-secret',
): Webhook {
  const webhook: Webhook = {
    id,
    board_id: boardId,
    url,
    secret_encrypted: secret,
    created_at: new Date(),
    updated_at: new Date(),
  };
  store.webhooks.set(id, webhook);
  return webhook;
}

/**
 * Mock webhook receiver for capturing webhook deliveries during tests.
 */
export class MockWebhookReceiver {
  public deliveries: Array<{
    timestamp: Date;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    statusCode: number;
  }> = [];

  private failCount: number;
  private maxFails: number;

  constructor(failFirstN: number = 0) {
    this.failCount = 0;
    this.maxFails = failFirstN;
  }

  receive(headers: Record<string, string>, body: Record<string, unknown>): number {
    this.failCount++;
    const statusCode = this.failCount <= this.maxFails ? 500 : 200;
    this.deliveries.push({
      timestamp: new Date(),
      headers,
      body,
      statusCode,
    });
    return statusCode;
  }

  reset(): void {
    this.deliveries = [];
    this.failCount = 0;
  }
}
