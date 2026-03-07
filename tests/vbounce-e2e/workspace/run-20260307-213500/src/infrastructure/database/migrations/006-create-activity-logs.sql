-- Migration 006: Create activity_logs table
-- Up
CREATE TABLE IF NOT EXISTS activity_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    task_id     UUID REFERENCES tasks(id) ON DELETE SET NULL,
    actor_id    UUID NOT NULL,
    action      VARCHAR(50) NOT NULL
                CHECK (action IN ('task.created', 'task.updated', 'task.status_changed', 'task.assigned', 'task.deleted')),
    changes     JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_board_id ON activity_logs (board_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_task_id ON activity_logs (task_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_board_created ON activity_logs (board_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_task_created ON activity_logs (task_id, created_at DESC);
