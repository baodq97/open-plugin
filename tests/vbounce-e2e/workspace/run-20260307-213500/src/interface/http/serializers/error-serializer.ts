export interface JsonApiError {
  status: string;
  title: string;
  detail: string;
  source?: { pointer: string };
}

export function serializeError(statusCode: number, detail: string, source?: { pointer: string }): { errors: JsonApiError[] } {
  const titles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };

  return {
    errors: [{
      status: String(statusCode),
      title: titles[statusCode] ?? 'Error',
      detail,
      ...(source ? { source } : {}),
    }],
  };
}
