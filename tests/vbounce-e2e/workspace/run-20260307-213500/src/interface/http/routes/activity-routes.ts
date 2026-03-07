import { Router } from 'express';
import type { ActivityController } from '../controllers/activity-controller.js';

export function activityRoutes(controller: ActivityController): Router {
  const router = Router({ mergeParams: true });

  return router;
}

// These routes are mounted at different paths:
// GET /boards/:boardId/tasks/:taskId/activity  -> taskActivityRoutes
// GET /boards/:boardId/activity                -> boardActivityRoutes

export function taskActivityRoutes(controller: ActivityController): Router {
  const router = Router({ mergeParams: true });
  router.get('/', controller.getTaskActivity);
  return router;
}

export function boardActivityRoutes(controller: ActivityController): Router {
  const router = Router({ mergeParams: true });
  router.get('/', controller.getBoardActivity);
  return router;
}
