import { Router } from 'express';
import type { WebhookController } from '../controllers/webhook-controller.js';
import { validate } from '../middleware/validate.js';
import { CreateWebhookSchema } from '../../../application/dto/create-webhook.dto.js';

export function webhookRoutes(controller: WebhookController): Router {
  const router = Router({ mergeParams: true });

  // POST /boards/:boardId/webhooks
  router.post('/', validate(CreateWebhookSchema), controller.create);

  return router;
}
