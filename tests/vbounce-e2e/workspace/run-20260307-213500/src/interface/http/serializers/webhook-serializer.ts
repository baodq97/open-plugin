import type { Webhook } from '../../../domain/entities/webhook.js';

function maskSecret(encrypted: string): string {
  // Always mask the secret in responses
  return '****';
}

export function serializeWebhook(webhook: Webhook, baseUrl: string = '/v1'): Record<string, unknown> {
  return {
    data: {
      type: 'webhooks',
      id: webhook.id,
      attributes: {
        url: webhook.url,
        secret: maskSecret(webhook.secret_encrypted),
        events: webhook.events,
        active: webhook.active,
        created_at: webhook.created_at.toISOString(),
      },
      relationships: {
        board: {
          data: { type: 'boards', id: webhook.board_id },
        },
      },
      links: {
        self: `${baseUrl}/boards/${webhook.board_id}/webhooks/${webhook.id}`,
      },
    },
  };
}
