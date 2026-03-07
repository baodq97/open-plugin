import type { ActivityLogRepository } from '../../domain/ports/activity-log-repository.js';

export class RetentionService {
  private readonly RETENTION_DAYS = 90;
  private readonly BATCH_SIZE = 1000;

  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async purge(): Promise<number> {
    let totalDeleted = 0;
    let batchDeleted: number;

    do {
      batchDeleted = await this.activityLogRepo.deleteOlderThan(
        this.RETENTION_DAYS,
        this.BATCH_SIZE,
      );
      totalDeleted += batchDeleted;
    } while (batchDeleted >= this.BATCH_SIZE);

    return totalDeleted;
  }
}
