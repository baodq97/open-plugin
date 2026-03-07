import type { ActivityLog } from '../../../domain/entities/activity-log.js';

export function serializeActivity(log: ActivityLog): Record<string, unknown> {
  return {
    type: 'activity-logs',
    id: log.id,
    attributes: {
      action: log.action,
      actor_id: log.actor_id,
      timestamp: log.created_at.toISOString(),
      changes: log.changes,
    },
    relationships: {
      ...(log.task_id
        ? { task: { data: { type: 'tasks', id: log.task_id } } }
        : {}),
      board: {
        data: { type: 'boards', id: log.board_id },
      },
    },
  };
}

export function serializeActivityCollection(
  logs: ActivityLog[],
  meta: { total: number; page?: number; page_size?: number; total_pages?: number },
  links: Record<string, string>,
): Record<string, unknown> {
  return {
    data: logs.map(serializeActivity),
    meta,
    links,
  };
}
