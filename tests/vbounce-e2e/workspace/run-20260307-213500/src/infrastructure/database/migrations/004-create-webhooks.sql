-- Migration 004: Create webhooks table
-- Up
CREATE TABLE IF NOT EXISTS webhooks (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id          UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    url               VARCHAR(2048) NOT NULL,
    secret_encrypted  VARCHAR(512) NOT NULL,
    events            JSONB NOT NULL DEFAULT '["task.created","task.updated","task.status_changed","task.assigned","task.deleted"]'::jsonb,
    active            BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_board_id ON webhooks (board_id) WHERE active = true;

CREATE TRIGGER trg_webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
