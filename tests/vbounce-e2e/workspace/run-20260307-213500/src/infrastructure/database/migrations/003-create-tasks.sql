-- Migration 003: Create tasks table with full-text search
-- Up
CREATE TABLE IF NOT EXISTS tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id        UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     VARCHAR(5000),
    status          VARCHAR(20) NOT NULL DEFAULT 'todo'
                    CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority        VARCHAR(5) NOT NULL DEFAULT 'P2'
                    CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
    assignee        UUID,
    due_date        DATE,
    tags            JSONB DEFAULT '[]'::jsonb,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    search_vector   TSVECTOR,

    CONSTRAINT tasks_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT tasks_tags_max_10 CHECK (jsonb_array_length(tags) <= 10)
);

-- Performance indexes (partial: exclude soft-deleted)
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks (board_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_board_status ON tasks (board_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_board_priority ON tasks (board_id, priority) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_board_assignee ON tasks (board_id, assignee) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_board_due_date ON tasks (board_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks (created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks (deleted_at) WHERE deleted_at IS NOT NULL;

-- Full-text search GIN index
CREATE INDEX IF NOT EXISTS idx_tasks_search_vector ON tasks USING GIN (search_vector);

-- Trigger to auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION tasks_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_search_vector
    BEFORE INSERT OR UPDATE OF title, description
    ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION tasks_search_vector_update();

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
