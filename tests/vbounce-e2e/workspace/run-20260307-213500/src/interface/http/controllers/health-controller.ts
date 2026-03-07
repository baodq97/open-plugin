import type { Request, Response } from 'express';
import type { Pool } from 'pg';

export class HealthController {
  constructor(private readonly pool: Pool) {}

  liveness = (_req: Request, res: Response): void => {
    res.status(200).json({ status: 'ok' });
  };

  readiness = async (_req: Request, res: Response): Promise<void> => {
    try {
      await this.pool.query('SELECT 1');
      res.status(200).json({
        status: 'ready',
        checks: { database: 'ok' },
      });
    } catch {
      res.status(503).json({
        status: 'not ready',
        checks: { database: 'error' },
      });
    }
  };
}
