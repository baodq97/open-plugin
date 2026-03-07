import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import type { Pool } from 'pg';

import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rate-limiter.js';
import { errorHandler } from './middleware/error-handler.js';
import { boardAccessMiddleware } from './middleware/board-access.js';

import { TaskController } from './controllers/task-controller.js';
import { BoardController } from './controllers/board-controller.js';
import { MemberController } from './controllers/member-controller.js';
import { WebhookController } from './controllers/webhook-controller.js';
import { SearchController } from './controllers/search-controller.js';
import { ActivityController } from './controllers/activity-controller.js';
import { HealthController } from './controllers/health-controller.js';

import { taskRoutes } from './routes/task-routes.js';
import { boardRoutes } from './routes/board-routes.js';
import { memberRoutes } from './routes/member-routes.js';
import { webhookRoutes } from './routes/webhook-routes.js';
import { searchRoutes } from './routes/search-routes.js';
import { taskActivityRoutes, boardActivityRoutes } from './routes/activity-routes.js';
import { healthRoutes } from './routes/health-routes.js';

import { TaskService } from '../../application/services/task-service.js';
import { BoardService } from '../../application/services/board-service.js';
import { MembershipService } from '../../application/services/membership-service.js';
import { WebhookService } from '../../application/services/webhook-service.js';
import { SearchService } from '../../application/services/search-service.js';
import { ActivityLogService } from '../../application/services/activity-log-service.js';

import { PgTaskRepository } from '../../infrastructure/database/repositories/pg-task-repository.js';
import { PgBoardRepository } from '../../infrastructure/database/repositories/pg-board-repository.js';
import { PgMembershipRepository } from '../../infrastructure/database/repositories/pg-membership-repository.js';
import { PgWebhookRepository } from '../../infrastructure/database/repositories/pg-webhook-repository.js';
import { PgWebhookDeliveryRepository } from '../../infrastructure/database/repositories/pg-webhook-delivery-repository.js';
import { PgSearchRepository } from '../../infrastructure/database/repositories/pg-search-repository.js';
import { PgActivityLogRepository } from '../../infrastructure/database/repositories/pg-activity-log-repository.js';

import { WebhookRetryQueue } from '../../infrastructure/queue/webhook-retry-queue.js';

export function createApp(pool: Pool): express.Application {
  const app = express();

  // Trust proxy for rate limiting
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors());

  // Body parsing (limit to 100KB per SEC-DATA-06)
  app.use(express.json({ limit: '100kb', type: 'application/vnd.api+json' }));
  app.use(express.json({ limit: '100kb' }));

  // Content-Type header on all responses
  app.use((_req, res, next) => {
    res.setHeader('Content-Type', 'application/vnd.api+json');
    next();
  });

  // --- Repositories ---
  const taskRepo = new PgTaskRepository(pool);
  const boardRepo = new PgBoardRepository(pool);
  const membershipRepo = new PgMembershipRepository(pool);
  const webhookRepo = new PgWebhookRepository(pool);
  const webhookDeliveryRepo = new PgWebhookDeliveryRepository(pool);
  const searchRepo = new PgSearchRepository(pool);
  const activityLogRepo = new PgActivityLogRepository(pool);

  // --- Services ---
  const activityLogService = new ActivityLogService(activityLogRepo);
  const taskService = new TaskService(taskRepo, membershipRepo, boardRepo, activityLogService);
  const boardService = new BoardService(boardRepo, membershipRepo);
  const membershipService = new MembershipService(membershipRepo, boardRepo);
  const retryQueue = new WebhookRetryQueue();
  const webhookService = new WebhookService(webhookRepo, webhookDeliveryRepo, membershipRepo, boardRepo, retryQueue);
  const searchService = new SearchService(searchRepo, membershipRepo);

  // --- Controllers ---
  const taskController = new TaskController(taskService);
  const boardController = new BoardController(boardService);
  const memberController = new MemberController(membershipService);
  const webhookController = new WebhookController(webhookService);
  const searchController = new SearchController(searchService);
  const activityController = new ActivityController(activityLogService);
  const healthController = new HealthController(pool);

  // --- Board access middleware ---
  const checkBoardAccess = boardAccessMiddleware(membershipService);

  // --- Health routes (public, no auth) ---
  app.use('/', healthRoutes(healthController));

  // --- Protected routes ---
  app.use(authMiddleware);
  app.use(rateLimiter);

  // Board routes
  app.use('/v1/boards', boardRoutes(boardController));

  // Board-scoped routes (require board access check)
  app.use('/v1/boards/:boardId/tasks/:taskId/activity', checkBoardAccess, taskActivityRoutes(activityController));
  app.use('/v1/boards/:boardId/tasks', checkBoardAccess, taskRoutes(taskController));
  app.use('/v1/boards/:boardId/members', memberRoutes(memberController));
  app.use('/v1/boards/:boardId/webhooks', webhookRoutes(webhookController));
  app.use('/v1/boards/:boardId/activity', checkBoardAccess, boardActivityRoutes(activityController));

  // Search routes (cross-board, scoped in service layer)
  app.use('/v1/tasks/search', searchRoutes(searchController));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
