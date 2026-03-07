import type { ActivityLog } from '../../domain/entities/activity-log.js';
import type { ActivityLogRepository } from '../../domain/ports/activity-log-repository.js';

export class ActivityLogService {
  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async log(entry: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
    return this.activityLogRepo.insert(entry);
  }

  async getTaskActivity(
    taskId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    return this.activityLogRepo.findByTaskId(taskId, page, pageSize);
  }

  async getBoardActivity(
    boardId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ data: ActivityLog[]; total: number }> {
    return this.activityLogRepo.findByBoardId(boardId, page, pageSize);
  }
}
