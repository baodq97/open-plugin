import type { Request, Response, NextFunction } from 'express';
import type { WebhookService } from '../../../application/services/webhook-service.js';
import { serializeWebhook } from '../serializers/webhook-serializer.js';

export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const userId = req.userId!;
      const { attributes } = req.body.data;

      const webhook = await this.webhookService.createWebhook(boardId, userId, {
        url: attributes.url,
        secret: attributes.secret,
        events: attributes.events,
      });

      res.status(201).json(serializeWebhook(webhook));
    } catch (err) {
      next(err);
    }
  };
}
