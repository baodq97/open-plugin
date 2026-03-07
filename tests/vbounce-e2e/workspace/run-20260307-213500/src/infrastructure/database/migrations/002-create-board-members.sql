-- Migration 002: Create board_members table
-- Up
CREATE TABLE IF NOT EXISTS board_members (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL,
    role        VARCHAR(10) NOT NULL CHECK (role IN ('Admin', 'Member', 'Viewer')),
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_board_members_board_user UNIQUE (board_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members (board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members (user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_board ON board_members (user_id, board_id);

CREATE TRIGGER trg_board_members_updated_at
    BEFORE UPDATE ON board_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
