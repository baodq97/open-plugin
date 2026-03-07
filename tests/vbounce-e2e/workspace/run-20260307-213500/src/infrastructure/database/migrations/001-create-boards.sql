-- Migration 001: Create boards table
-- Up
CREATE TABLE IF NOT EXISTS boards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    columns     JSONB NOT NULL DEFAULT '["todo", "in_progress", "review", "done"]'::jsonb,
    owner_id    UUID NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT boards_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT boards_columns_min_2 CHECK (jsonb_array_length(columns) >= 2)
);

CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON boards (owner_id);

-- Reusable trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_boards_updated_at
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
