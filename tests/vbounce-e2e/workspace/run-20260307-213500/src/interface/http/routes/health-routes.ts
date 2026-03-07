import { Router } from 'express';
import type { HealthController } from '../controllers/health-controller.js';

export function healthRoutes(controller: HealthController): Router {
  const router = Router();

  // GET /healthz
  router.get('/healthz', controller.liveness);

  // GET /readyz
  router.get('/readyz', controller.readiness);

  return router;
}
