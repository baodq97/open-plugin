import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per user
  standardHeaders: true, // X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Rate limit by authenticated user ID
    return req.userId ?? req.ip ?? 'unknown';
  },
  handler: (_req, res) => {
    res.status(429).json({
      errors: [{
        status: '429',
        title: 'Too Many Requests',
        detail: `Rate limit exceeded. Try again in ${Math.ceil(60)} seconds`,
      }],
    });
  },
});
