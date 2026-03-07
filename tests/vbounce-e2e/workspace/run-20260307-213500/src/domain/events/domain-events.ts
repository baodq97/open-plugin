import type { Task } from '../entities/task.js';
import type { WebhookEventType } from '../enums/webhook-event-type.js';

export interface DomainEvent {
  type: WebhookEventType;
  boardId: string;
  actorId: string;
  task: Task;
  changes?: Record<string, { from: unknown; to: unknown }>;
  timestamp: Date;
}

type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

class DomainEventEmitter {
  private handlers: DomainEventHandler[] = [];

  on(handler: DomainEventHandler): void {
    this.handlers.push(handler);
  }

  off(handler: DomainEventHandler): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  async emit(event: DomainEvent): Promise<void> {
    for (const handler of this.handlers) {
      try {
        await handler(event);
      } catch {
        // Webhook delivery failures should not block the caller
      }
    }
  }
}

export const domainEvents = new DomainEventEmitter();
