import type { RetentionService } from '../../application/services/retention-service.js';

export class RetentionScheduler {
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly retentionService: RetentionService) {}

  start(): void {
    // Calculate ms until next 02:00 UTC
    const now = new Date();
    const next0200 = new Date(now);
    next0200.setUTCHours(2, 0, 0, 0);
    if (next0200 <= now) {
      next0200.setUTCDate(next0200.getUTCDate() + 1);
    }

    const msUntilFirstRun = next0200.getTime() - now.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Schedule first run
    setTimeout(() => {
      this.runPurge();
      // Then run daily
      this.timer = setInterval(() => {
        this.runPurge();
      }, oneDayMs);
    }, msUntilFirstRun);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async runPurge(): Promise<number> {
    try {
      const deleted = await this.retentionService.purge();
      console.log(`[RetentionScheduler] Purged ${deleted} activity log entries older than 90 days`);
      return deleted;
    } catch (err) {
      console.error('[RetentionScheduler] Purge failed:', err);
      return 0;
    }
  }
}
