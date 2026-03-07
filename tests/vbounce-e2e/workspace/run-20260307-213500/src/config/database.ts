import fs from 'node:fs';
import path from 'node:path';
import type { Pool } from 'pg';

const MIGRATIONS_DIR = new URL('../infrastructure/database/migrations', import.meta.url).pathname;

export async function runMigrations(pool: Pool): Promise<void> {
  // Create migrations tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Get already-applied migrations
  const result = await pool.query('SELECT name FROM _migrations ORDER BY name');
  const applied = new Set(result.rows.map((r: Record<string, unknown>) => r.name as string));

  // Read and sort migration files
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f: string) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    console.log(`[Migration] Applying: ${file}`);

    await pool.query(sql);
    await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);

    console.log(`[Migration] Applied: ${file}`);
  }
}
