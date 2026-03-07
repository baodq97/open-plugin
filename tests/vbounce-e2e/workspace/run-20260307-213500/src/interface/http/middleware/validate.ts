import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(422).json({ errors });
      return;
    }

    // Attach validated data to request
    req.body = result.data;
    next();
  };
}

function formatZodErrors(error: ZodError): Array<{ status: string; title: string; detail: string; source?: { pointer: string } }> {
  return error.errors.map((e) => {
    const path = e.path.join('/');
    const pointer = path ? `/${path}` : '/data';

    return {
      status: '422',
      title: 'Validation Error',
      detail: e.message,
      source: { pointer },
    };
  });
}
