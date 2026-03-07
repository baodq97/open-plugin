export const WebhookEventType = {
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_STATUS_CHANGED: 'task.status_changed',
  TASK_ASSIGNED: 'task.assigned',
  TASK_DELETED: 'task.deleted',
} as const;

export type WebhookEventType = (typeof WebhookEventType)[keyof typeof WebhookEventType];

export const WEBHOOK_EVENT_TYPE_VALUES: readonly WebhookEventType[] = Object.values(WebhookEventType);
