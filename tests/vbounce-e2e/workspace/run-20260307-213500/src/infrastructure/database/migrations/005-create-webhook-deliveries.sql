-- Migration 005: Create webhook_deliveries table
-- Up
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id          UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    task_id             UUID,
    event_type          VARCHAR(50) NOT NULL,
    payload             JSONB NOT NULL,
    attempt_count       INTEGER NOT NULL DEFAULT 1,
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'success', 'failed', 'permanently_failed')),
    last_status_code    INTEGER,
    last_error          VARCHAR(1000),
    first_attempted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_attempted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_retry_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries (webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries (status) WHERE status IN ('pending', 'failed');
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_retry ON webhook_deliveries (next_retry_at) WHERE status = 'failed' AND next_retry_at IS NOT NULL;
