import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

const jwksClient = jwksRsa({
  jwksUri: process.env.JWKS_URI ?? 'https://sso.example.com/.well-known/jwks.json',
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 3600000, // 1 hour TTL
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

function getSigningKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      errors: [{
        status: '401',
        title: 'Unauthorized',
        detail: 'A valid JWT token is required',
      }],
    });
    return;
  }

  const token = authHeader.slice(7);

  // Reject tokens passed as query parameters (SEC-AUTH-04)
  if (req.query.token || req.query.access_token) {
    res.status(401).json({
      errors: [{
        status: '401',
        title: 'Unauthorized',
        detail: 'Tokens must be passed in the Authorization header',
      }],
    });
    return;
  }

  // For testing/development: allow HS256 with a secret
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256', 'RS256'],
        issuer: process.env.JWT_ISSUER,
        clockTolerance: 30,
      }) as jwt.JwtPayload;

      req.userId = decoded.sub;
      req.userEmail = decoded.email as string | undefined;
      next();
      return;
    } catch {
      res.status(401).json({
        errors: [{
          status: '401',
          title: 'Unauthorized',
          detail: 'A valid JWT token is required',
        }],
      });
      return;
    }
  }

  // Production: RS256 with JWKS
  jwt.verify(
    token,
    getSigningKey,
    {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER,
      clockTolerance: 30,
    },
    (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({
          errors: [{
            status: '401',
            title: 'Unauthorized',
            detail: 'A valid JWT token is required',
          }],
        });
        return;
      }

      const payload = decoded as jwt.JwtPayload;
      req.userId = payload.sub;
      req.userEmail = payload.email as string | undefined;
      next();
    },
  );
}
