import { Router } from 'express';
import type { SearchController } from '../controllers/search-controller.js';

export function searchRoutes(controller: SearchController): Router {
  const router = Router();

  // GET /tasks/search
  router.get('/', controller.search);

  return router;
}
