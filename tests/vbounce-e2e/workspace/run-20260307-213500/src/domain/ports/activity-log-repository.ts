import type { ActivityLog } from '../entities/activity-log.js';

export interface ActivityLogRepository {
  insert(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog>;
  findByTaskId(taskId: string, page: number, pageSize: number): Promise<{ data: ActivityLog[]; total: number }>;
  findByBoardId(boardId: string, page: number, pageSize: number): Promise<{ data: ActivityLog[]; total: number }>;
  deleteOlderThan(days: number, batchSize: number): Promise<number>;
}
