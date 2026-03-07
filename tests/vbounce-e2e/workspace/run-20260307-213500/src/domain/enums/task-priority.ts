export const TaskPriority = {
  P0: 'P0',
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TASK_PRIORITY_VALUES: readonly TaskPriority[] = Object.values(TaskPriority);
