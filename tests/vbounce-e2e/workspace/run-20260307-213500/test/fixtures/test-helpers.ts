import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const JWT_SECRET = 'test-secret-key-for-testing-only';

export function createTestJwt(userId: string, overrides: Record<string, unknown> = {}): string {
  return jwt.sign(
    {
      sub: userId,
      email: `${userId}@test.com`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...overrides,
    },
    JWT_SECRET,
  );
}

export function createExpiredJwt(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      email: `${userId}@test.com`,
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) - 3600,
    },
    JWT_SECRET,
  );
}

export function createTamperedJwt(userId: string): string {
  const token = createTestJwt(userId);
  const parts = token.split('.');
  // Tamper with the payload
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  payload.sub = 'tampered-user';
  parts[1] = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return parts.join('.');
}

export function createAlgNoneJwt(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    email: `${userId}@test.com`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64url');
  return `${header}.${payload}.`;
}

export function createWrongKeyJwt(userId: string): string {
  return jwt.sign(
    { sub: userId, email: `${userId}@test.com` },
    'completely-wrong-secret-key',
  );
}

export function authHeader(userId: string): { Authorization: string } {
  return { Authorization: `Bearer ${createTestJwt(userId)}` };
}

export const TEST_JWT_SECRET = JWT_SECRET;

/**
 * Creates a valid JSON:API task creation payload.
 */
export function taskPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    data: {
      type: 'tasks',
      attributes: {
        title: 'Fix login bug',
        status: 'todo',
        priority: 'P1',
        ...overrides,
      },
    },
  };
}

/**
 * Creates a valid JSON:API task update payload.
 */
export function taskUpdatePayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    data: {
      type: 'tasks',
      attributes: {
        ...overrides,
      },
    },
  };
}

/**
 * Creates a valid JSON:API board creation payload.
 */
export function boardPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    data: {
      type: 'boards',
      attributes: {
        name: 'Sprint Board',
        ...overrides,
      },
    },
  };
}

/**
 * Creates a valid JSON:API member invite payload.
 */
export function memberPayload(userId: string, role: string = 'Member'): Record<string, unknown> {
  return {
    data: {
      type: 'board-members',
      attributes: {
        user_id: userId,
        role,
      },
    },
  };
}

/**
 * Creates a valid JSON:API webhook creation payload.
 */
export function webhookPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    data: {
      type: 'webhooks',
      attributes: {
        url: 'https://example.com/hook',
        secret: 'my-secret-key-is-long-enough',
        ...overrides,
      },
    },
  };
}

/**
 * Compute HMAC-SHA256 signature for webhook verification.
 */
export function computeHmacSignature(secret: string, payload: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Validate JSON:API response structure.
 */
export function assertJsonApi(body: Record<string, unknown>): void {
  if (body.data !== undefined) {
    // Success response
    if (Array.isArray(body.data)) {
      for (const item of body.data) {
        if (typeof item !== 'object' || item === null) throw new Error('Invalid JSON:API collection item');
        const obj = item as Record<string, unknown>;
        if (!obj.type || !obj.id) throw new Error('JSON:API resource missing type or id');
      }
    } else if (body.data !== null) {
      const data = body.data as Record<string, unknown>;
      if (!data.type || !data.id) throw new Error('JSON:API resource missing type or id');
    }
  } else if (body.errors !== undefined) {
    // Error response
    if (!Array.isArray(body.errors)) throw new Error('JSON:API errors must be array');
    for (const err of body.errors) {
      if (typeof err !== 'object' || err === null) throw new Error('Invalid JSON:API error');
    }
  } else {
    throw new Error('JSON:API response must have "data" or "errors"');
  }
}

/**
 * UUID v4 regex pattern for validation.
 */
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ISO 8601 timestamp pattern.
 */
export const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/**
 * Mock data factories for test seeding.
 */
export const MOCK_USERS = {
  owner: 'user-owner-001',
  admin: 'user-admin-001',
  member: 'user-member-001',
  viewer: 'user-viewer-001',
  outsider: 'user-outsider-001',
};

export const MOCK_BOARDS = {
  B1: 'board-test-001',
  B2: 'board-test-002',
};
