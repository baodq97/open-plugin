import type { Server } from 'node:http';
import type { Application } from 'express';

export function startServer(app: Application, port: number): Server {
  return app.listen(port, () => {
    console.log(`[TaskFlow] API server listening on port ${port}`);
  });
}
