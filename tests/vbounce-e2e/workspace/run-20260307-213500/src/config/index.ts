export interface AppConfig {
  port: number;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  jwt: {
    issuer: string;
    jwksUri: string;
    secret?: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  webhook: {
    encryptionKey: string;
    deliveryTimeoutMs: number;
    maxRetries: number;
  };
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      name: process.env.DB_NAME ?? 'taskflow',
      user: process.env.DB_USER ?? 'taskflow',
      password: process.env.DB_PASSWORD ?? 'taskflow',
      ssl: process.env.DB_SSL === 'true',
    },
    jwt: {
      issuer: process.env.JWT_ISSUER ?? 'https://sso.example.com',
      jwksUri: process.env.JWKS_URI ?? 'https://sso.example.com/.well-known/jwks.json',
      secret: process.env.JWT_SECRET,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
      max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
    },
    webhook: {
      encryptionKey: process.env.WEBHOOK_ENCRYPTION_KEY ?? 'default-encryption-key-32bytes!!',
      deliveryTimeoutMs: parseInt(process.env.WEBHOOK_TIMEOUT_MS ?? '5000', 10),
      maxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES ?? '3', 10),
    },
  };
}
