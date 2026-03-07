import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { WebhookRetryQueue } from '../../src/infrastructure/queue/webhook-retry-queue.js';

describe('WebhookRetryQueue', () => {
  let queue: WebhookRetryQueue;

  afterEach(() => {
    if (queue) queue.clear();
  });

  it('should enqueue and execute after delay', async () => {
    queue = new WebhookRetryQueue();
    let executed = false;

    queue.enqueue(async () => {
      executed = true;
    }, 50);

    assert.equal(queue.size, 1);
    assert.equal(executed, false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    assert.equal(executed, true);
  });

  it('should handle multiple queued items', async () => {
    queue = new WebhookRetryQueue();
    const results: number[] = [];

    queue.enqueue(async () => { results.push(1); }, 50);
    queue.enqueue(async () => { results.push(2); }, 100);

    assert.equal(queue.size, 2);

    await new Promise((resolve) => setTimeout(resolve, 150));

    assert.deepEqual(results, [1, 2]);
  });

  it('should clear all timers', () => {
    queue = new WebhookRetryQueue();
    queue.enqueue(async () => {}, 1000);
    queue.enqueue(async () => {}, 2000);

    assert.equal(queue.size, 2);
    queue.clear();
    assert.equal(queue.size, 0);
  });
});
