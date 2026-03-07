import 'dotenv/config';
import { createPool } from './infrastructure/database/pool.js';
import { runMigrations } from './config/database.js';
import { createApp } from './interface/http/app.js';
import { startServer } from './interface/http/server.js';
import { RetentionService } from './application/services/retention-service.js';
import { RetentionScheduler } from './infrastructure/scheduler/retention-scheduler.js';
import { PgActivityLogRepository } from './infrastructure/database/repositories/pg-activity-log-repository.js';
import { loadConfig } from './config/index.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const pool = createPool();

  // Run database migrations
  console.log('[TaskFlow] Running database migrations...');
  await runMigrations(pool);
  console.log('[TaskFlow] Migrations complete.');

  // Create Express app with all dependencies
  const app = createApp(pool);

  // Start retention scheduler
  const activityLogRepo = new PgActivityLogRepository(pool);
  const retentionService = new RetentionService(activityLogRepo);
  const retentionScheduler = new RetentionScheduler(retentionService);
  retentionScheduler.start();
  console.log('[TaskFlow] Retention scheduler started (daily at 02:00 UTC).');

  // Start HTTP server
  const server = startServer(app, config.port);

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    console.log('[TaskFlow] Shutting down...');
    retentionScheduler.stop();
    server.close();
    await pool.end();
    console.log('[TaskFlow] Shutdown complete.');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error('[TaskFlow] Fatal error:', err);
  process.exit(1);
});
