import type { Task } from '../entities/task.js';

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findByBoardId(boardId: string): Promise<Task[]>;
  insert(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Task>;
  update(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee' | 'due_date' | 'tags'>>): Promise<Task | null>;
  softDelete(id: string): Promise<Task | null>;
}
