import type { Task } from '../../../domain/entities/task.js';

export function serializeTask(task: Task, baseUrl: string = '/v1'): Record<string, unknown> {
  return {
    data: {
      type: 'tasks',
      id: task.id,
      attributes: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        due_date: task.due_date,
        tags: task.tags,
        created_at: task.created_at.toISOString(),
        updated_at: task.updated_at.toISOString(),
        ...(task.deleted_at ? { deleted_at: task.deleted_at.toISOString() } : {}),
      },
      relationships: {
        board: {
          data: { type: 'boards', id: task.board_id },
        },
      },
      links: {
        self: `${baseUrl}/boards/${task.board_id}/tasks/${task.id}`,
      },
    },
  };
}

export function serializeTaskCollection(
  tasks: Task[],
  meta: { total: number; page?: number; page_size?: number; total_pages?: number },
  links: Record<string, string>,
  baseUrl: string = '/v1',
): Record<string, unknown> {
  return {
    data: tasks.map((task) => ({
      type: 'tasks',
      id: task.id,
      attributes: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        due_date: task.due_date,
        tags: task.tags,
        created_at: task.created_at.toISOString(),
        updated_at: task.updated_at.toISOString(),
      },
      relationships: {
        board: {
          data: { type: 'boards', id: task.board_id },
        },
      },
      links: {
        self: `${baseUrl}/boards/${task.board_id}/tasks/${task.id}`,
      },
    })),
    meta,
    links,
  };
}
