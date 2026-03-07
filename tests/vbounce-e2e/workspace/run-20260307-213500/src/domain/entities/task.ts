import type { TaskStatus } from '../enums/task-status.js';
import type { TaskPriority } from '../enums/task-priority.js';

export interface Task {
  id: string;
  board_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  due_date: string | null;
  tags: string[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
