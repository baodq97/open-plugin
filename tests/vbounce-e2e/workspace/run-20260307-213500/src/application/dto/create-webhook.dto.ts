import { z } from 'zod';
import { WEBHOOK_EVENT_TYPE_VALUES } from '../../domain/enums/webhook-event-type.js';

export const CreateWebhookSchema = z.object({
  data: z.object({
    type: z.literal('webhooks'),
    attributes: z.object({
      url: z
        .string({ required_error: 'Webhook URL is required' })
        .url('Webhook URL must be a valid URL')
        .refine((val) => val.startsWith('https://'), {
          message: 'Webhook URL must be a valid HTTPS URL',
        }),
      secret: z
        .string({ required_error: 'Secret is required' })
        .min(16, 'Secret must be at least 16 characters'),
      events: z
        .array(
          z.enum(WEBHOOK_EVENT_TYPE_VALUES as [string, ...string[]], {
            errorMap: () => ({ message: 'Invalid webhook event type' }),
          }),
        )
        .optional(),
    }),
  }),
});

export type CreateWebhookDTO = z.infer<typeof CreateWebhookSchema>;
