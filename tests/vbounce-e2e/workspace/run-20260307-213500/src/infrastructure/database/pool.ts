import pg from 'pg';

const { Pool } = pg;

export function createPool(): pg.Pool {
  return new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    database: process.env.DB_NAME ?? 'taskflow',
    user: process.env.DB_USER ?? 'taskflow',
    password: process.env.DB_PASSWORD ?? 'taskflow',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

export type { Pool } from 'pg';
