import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly detail: string,
    public readonly source?: { pointer: string },
  ) {
    super(detail);
    this.name = 'AppError';
  }
}

const STATUS_TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      errors: [{
        status: String(err.statusCode),
        title: STATUS_TITLES[err.statusCode] ?? 'Error',
        detail: err.detail,
        ...(err.source ? { source: err.source } : {}),
      }],
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      errors: [{
        status: '400',
        title: 'Bad Request',
        detail: 'Malformed JSON',
      }],
    });
    return;
  }

  console.error('[ErrorHandler]', err);
  res.status(500).json({
    errors: [{
      status: '500',
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred',
    }],
  });
}
