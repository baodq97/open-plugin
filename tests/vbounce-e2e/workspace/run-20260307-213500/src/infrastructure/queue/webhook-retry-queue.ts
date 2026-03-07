type RetryTask = () => Promise<void>;

interface QueuedItem {
  task: RetryTask;
  executeAt: number;
  timer: ReturnType<typeof setTimeout>;
}

export class WebhookRetryQueue {
  private queue: QueuedItem[] = [];

  enqueue(task: RetryTask, delayMs: number): void {
    const executeAt = Date.now() + delayMs;
    const timer = setTimeout(async () => {
      this.removeFromQueue(executeAt);
      try {
        await task();
      } catch {
        // Retry failures are handled within the task itself
      }
    }, delayMs);

    this.queue.push({ task, executeAt, timer });
  }

  private removeFromQueue(executeAt: number): void {
    this.queue = this.queue.filter((item) => item.executeAt !== executeAt);
  }

  get size(): number {
    return this.queue.length;
  }

  clear(): void {
    for (const item of this.queue) {
      clearTimeout(item.timer);
    }
    this.queue = [];
  }
}
