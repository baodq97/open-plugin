# Architecture Decision Records: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## ADR-001: Web Framework Selection

**Status**: Accepted
**Date**: 2026-03-07

### Context

TaskFlow requires a Node.js HTTP framework to implement the REST API. The framework must support middleware patterns, JSON:API response formatting, and be compatible with TypeScript strict mode. Performance requirement: p95 < 200ms at 50 concurrent users.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **Express.js** | Mature ecosystem, extensive middleware, large community, well-documented, minimal learning curve | Callback-based (mitigated by async wrappers), slightly less performant than newer frameworks |
| **Fastify** | Higher raw throughput, schema-based validation, built-in JSON serialization, TypeScript support | Smaller middleware ecosystem, less community familiarity, may be overkill for this use case |
| **Koa** | Modern async/await patterns, lightweight, cleaner middleware (onion model) | Smaller ecosystem, fewer ready-made middlewares for rate limiting and JSON:API |

### Decision

**Express.js** is selected as the web framework.

### Rationale

1. PRD explicitly specifies Express as the framework
2. Mature middleware ecosystem covers all cross-cutting concerns (rate limiting, CORS, body parsing)
3. json:api serialization libraries have first-class Express support
4. Team familiarity reduces onboarding time
5. Performance is sufficient for p95 < 200ms target with proper async handling and connection pooling

### Consequences

- Use `express-async-errors` or manual async wrapper for promise-based route handlers
- Leverage existing middleware: `express-rate-limit`, `helmet`, `cors`
- JSON:API serialization via `jsonapi-serializer`

---

## ADR-002: Authentication Strategy

**Status**: Accepted
**Date**: 2026-03-07

### Context

TaskFlow does not manage user identities directly. Authentication is delegated to the company SSO which issues JWT tokens. The API must verify these tokens to identify users and must handle token validation, expiration, and key rotation.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **JWT verification with JWKS (stateless)** | No session storage, horizontally scalable, standard OpenID Connect pattern, SSO handles user management | Cannot revoke individual tokens before expiration, relies on SSO availability for key rotation |
| **API key authentication** | Simple to implement, easy to rotate per-user | Requires key management, not compatible with SSO, no standard claims |
| **Session-based auth with SSO callback** | Granular session control, immediate revocation | Requires session store (Redis), adds state, not suitable for API-first design |

### Decision

**JWT verification with JWKS** is the authentication strategy.

### Rationale

1. Company SSO already issues JWT tokens; the API only needs to verify them
2. Stateless verification scales horizontally without shared session storage
3. JWKS endpoint provides automatic key rotation support
4. Standard approach for API services in an SSO ecosystem
5. `jwks-rsa` library handles key caching and rotation with configurable TTL

### Consequences

- Auth middleware extracts JWT from `Authorization: Bearer <token>` header
- Verify signature against JWKS public keys (RS256 algorithm only)
- Validate standard claims: `iss` (issuer), `exp` (expiration), `sub` (subject/user ID)
- Cache JWKS keys with 1-hour TTL for resilience against SSO downtime
- No session storage required; each request is independently verified
- Token revocation relies on short expiration times (recommended: 15-30 minutes)

---

## ADR-003: Soft Delete Approach

**Status**: Accepted
**Date**: 2026-03-07

### Context

The PRD requires tasks to be "soft-deleted" so they are hidden from normal views but recoverable. The implementation must efficiently exclude soft-deleted records from queries while maintaining audit trail continuity.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **`deleted_at` timestamp column** | Simple, one column, preserves deletion timestamp, standard pattern, compatible with partial indexes | Requires `WHERE deleted_at IS NULL` on all queries, risk of forgetting the filter |
| **`is_deleted` boolean flag** | Even simpler, clear semantics | Loses the deletion timestamp, no info about when deletion occurred |
| **Separate archive table** | Clean separation, main table stays lean | Complex implementation, requires moving rows between tables, breaks FK references, activity_logs lose FK integrity |
| **Event sourcing with projection** | Complete history, immutable events | Massive complexity overhead for this use case, requires event store infrastructure |

### Decision

**`deleted_at` TIMESTAMPTZ column** with partial indexes.

### Rationale

1. Preserves when the deletion occurred (audit requirement from US-005-001)
2. Partial indexes (`WHERE deleted_at IS NULL`) ensure queries on active records are not degraded by deleted rows
3. Repository layer encapsulates the filter, preventing accidental inclusion of deleted records
4. Simpler than archive tables; no data movement needed
5. Activity logs maintain FK references to soft-deleted tasks
6. Recovery is a simple `UPDATE SET deleted_at = NULL` if ever needed

### Consequences

- All repository `find*` methods default to `WHERE deleted_at IS NULL`
- `TaskRepository.findById()` returns null for soft-deleted tasks (treated as not found)
- Partial indexes on `tasks` table exclude `deleted_at IS NOT NULL` rows
- DELETE endpoint sets `deleted_at = now()` rather than removing the row
- Repeated DELETE on already-deleted task returns 404 (idempotent from user perspective)

---

## ADR-004: Webhook Delivery Strategy

**Status**: Accepted
**Date**: 2026-03-07

### Context

Webhook notifications must be sent asynchronously when task events occur. Failed deliveries must be retried with exponential backoff (1s, 4s, 16s). The delivery mechanism must not block API responses and must handle up to 3 retries per failed delivery.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **In-process async queue with database-backed state** | Simple deployment (no external queue), delivery state persisted in `webhook_deliveries` table, retry scheduling via polling or setTimeout | Limited throughput at very high scale, retry accuracy depends on process uptime |
| **External message queue (RabbitMQ / Redis Streams)** | Durable, scalable, guaranteed delivery, built-in retry mechanisms | Additional infrastructure to deploy and manage, operational complexity, overkill for initial scale |
| **Synchronous delivery in request path** | Simplest implementation | Blocks API response, violates p95 < 200ms requirement, poor user experience |

### Decision

**In-process async queue with database-backed state** for webhook delivery.

### Rationale

1. TaskFlow's initial scale (50 concurrent users) does not justify external queue infrastructure
2. Database-backed `webhook_deliveries` table ensures delivery state survives process restarts
3. On startup, the service rescans `webhook_deliveries` for `status = 'failed'` with `next_retry_at <= now()` to resume pending retries
4. `setTimeout` handles retry scheduling within the process; for multi-replica deployments, a simple polling loop (every 5s) picks up retries from the database
5. Easy migration path to external queue if scale demands it later

### Consequences

- `WebhookService.emit()` returns immediately after persisting the delivery record
- Delivery driver runs in background, does not block API responses
- Retry schedule: attempt 1 immediate, retry at +1s, +5s (1+4), +21s (1+4+16)
- After 4 total attempts, delivery marked as `permanently_failed`
- On process restart: poll `webhook_deliveries` for `status = 'failed' AND next_retry_at <= now()`
- Future: swap in-process queue for RabbitMQ/Redis without changing service interfaces (port/adapter pattern)

---

## ADR-005: Search Implementation

**Status**: Accepted
**Date**: 2026-03-07

### Context

TaskFlow requires full-text search across task titles and descriptions, combined with attribute filtering (status, priority, assignee, tags, due date), pagination, and sorting. Search results must be scoped to the user's accessible boards. Performance must meet p95 < 200ms with up to 10,000 tasks per board.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **PostgreSQL built-in full-text search (tsvector + GIN)** | No additional infrastructure, ACID-consistent, combined with SQL filters in single query, mature and well-understood | Less sophisticated ranking than dedicated search engines, not ideal for very large datasets (millions) |
| **Elasticsearch / OpenSearch** | Superior full-text search quality, faceted search, relevance tuning, horizontal scaling | Additional infrastructure, data synchronization complexity, eventual consistency with primary DB, operational overhead |
| **Application-level LIKE/ILIKE queries** | Simplest implementation | Cannot use indexes effectively, poor performance at scale, no ranking |

### Decision

**PostgreSQL built-in full-text search** using `tsvector`, `tsquery`, and GIN indexes.

### Rationale

1. Scale target (10,000 tasks per board, ~50 boards) is well within PostgreSQL FTS performance range
2. No additional infrastructure to deploy and maintain
3. Search results are always consistent with the latest data (no synchronization lag)
4. Combined full-text search and attribute filtering in a single SQL query
5. `tsvector` with weighted ranking: title (weight A) > description (weight B)
6. GIN index provides efficient lookup
7. Easy migration to Elasticsearch later if needed (search is behind a repository interface)

### Consequences

- `search_vector` column of type `TSVECTOR` on `tasks` table
- Automatic update via database trigger on INSERT/UPDATE of title or description
- GIN index on `search_vector` for fast lookups
- Search query uses `plainto_tsquery()` to sanitize user input
- Ranking via `ts_rank()` for relevance-ordered results
- Attribute filters applied as additional `WHERE` clauses in the same query
- Pagination via `LIMIT`/`OFFSET` (adequate for expected scale; keyset pagination as future optimization)

---

## ADR-006: Database Connection and ORM Strategy

**Status**: Accepted
**Date**: 2026-03-07

### Context

TaskFlow uses PostgreSQL 16 as its primary data store. The application needs a strategy for database access that balances developer productivity, type safety, query performance, and maintainability.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **Raw SQL with `pg` (node-postgres)** | Full control over queries, optimal performance, no abstraction leaks, direct use of PostgreSQL features (tsvector, JSONB, partial indexes) | More boilerplate, manual result mapping, no automatic migrations |
| **Prisma ORM** | Excellent TypeScript integration, auto-generated types, migrations, query builder | May not support all PostgreSQL features (tsvector triggers, partial indexes), query abstraction can hide performance issues |
| **TypeORM** | Decorator-based entity definition, migration support, wide feature set | Complex configuration, known performance pitfalls, inconsistent TypeScript support in some areas |
| **Knex.js (query builder)** | SQL-like query builder, migrations, no heavy ORM overhead | Less type safety than Prisma, still an abstraction layer |

### Decision

**Raw SQL with `pg` (node-postgres)** and a thin repository layer.

### Rationale

1. Full control over PostgreSQL-specific features: `tsvector`, GIN indexes, partial indexes, JSONB operators, `plainto_tsquery()`
2. No ORM abstraction leaks; queries are exactly what's intended
3. Repository interfaces (ports) provide a clean abstraction for testing and future replacement
4. Parameterized queries for SQL injection prevention
5. Connection pooling via `pg.Pool`
6. Type safety achieved through TypeScript interfaces for entities and manual result mapping
7. Migrations via `node-pg-migrate` (SQL-based, version-controlled)

### Consequences

- Repository implementations contain raw SQL with parameterized placeholders
- Entity types defined as TypeScript interfaces, manually mapped from query results
- `node-pg-migrate` for database migration management
- Integration tests run against a real PostgreSQL instance (not mocked)
- Slightly more code than ORM-based approach, but no magic or hidden behavior

---

## ADR-007: Activity Log Retention Strategy

**Status**: Accepted
**Date**: 2026-03-07

### Context

Activity logs grow unboundedly as task mutations occur. The PRD requires a 90-day retention policy to control storage costs. The purge mechanism must be reliable, not disrupt normal operations, and correctly handle the 90-day boundary.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **Scheduled DELETE with `node-cron`** | Simple, runs within the application, no additional infrastructure | Runs in application process; if no instance is running, purge is missed; long-running DELETE can affect performance |
| **PostgreSQL table partitioning by month** | Efficient partition drops instead of row-by-row DELETE, no application-side scheduling | More complex schema setup, partition management, may over-delete (monthly granularity vs. 90-day) |
| **External cron job (Kubernetes CronJob)** | Independent of application lifecycle, reliable scheduling | Additional infrastructure configuration, separate deployment artifact |

### Decision

**Scheduled DELETE with `node-cron`** in the application process, with batched deletion.

### Rationale

1. Simplest implementation for initial deployment
2. `node-cron` runs daily at 02:00 UTC (low-traffic window)
3. Batched deletion (1000 rows per batch with short pauses) prevents long lock times
4. 90-day boundary: `WHERE created_at < now() - INTERVAL '90 days'` (entries at exactly 90 days are retained)
5. Future migration to Kubernetes CronJob or partitioning is straightforward
6. Application logs the number of purged rows for monitoring

### Consequences

- RetentionService scheduled via `node-cron` at `0 2 * * *` (daily 02:00 UTC)
- Deletes in batches of 1000 rows to limit transaction duration
- Exactly-90-days entries retained (strictly older than 90 days are purged)
- If multiple replicas run, use PostgreSQL advisory locks to prevent concurrent purge
- Monitor: log row count per purge execution; alert if purge fails

---

## ADR-008: Rate Limiting Strategy

**Status**: Accepted
**Date**: 2026-03-07

### Context

The API must enforce a rate limit of 100 requests per minute per authenticated user. The rate limiter must identify users by their JWT `sub` claim and return HTTP 429 with appropriate headers when the limit is exceeded.

### Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| **express-rate-limit with MemoryStore** | Simple, no external dependencies, fast | Per-process state (not shared across replicas), resets on restart |
| **express-rate-limit with Redis store** | Shared state across replicas, survives restarts, accurate across the cluster | Requires Redis infrastructure, additional latency for Redis roundtrip |
| **Ingress-level rate limiting (nginx/Istio)** | Offloads from application, handles before reaching Node.js | Cannot key on JWT `sub` claim (only IP or header), less granular |

### Decision

**express-rate-limit with MemoryStore** for initial deployment; migrate to Redis store when scaling to multiple replicas.

### Rationale

1. Initial deployment target is 2 replicas; MemoryStore provides per-replica limits that are conservative (each replica enforces 100/min independently)
2. No Redis dependency for MVP
3. Key extraction: `req.user.sub` from verified JWT (rate limiter runs after auth middleware)
4. Standard `X-RateLimit-*` and `Retry-After` headers included in responses
5. Easy upgrade path: swap `MemoryStore` for `rate-limit-redis` when needed

### Consequences

- Rate limiter middleware runs after auth middleware (needs user identity)
- MemoryStore means effective per-user limit is 100/min per replica (200/min across 2 replicas in worst case)
- For strict enforcement across replicas, upgrade to Redis store
- HTTP 429 response includes `Retry-After` header with seconds until reset

---

## ADR Summary

| ADR | Decision | Key Alternatives Rejected |
|-----|----------|--------------------------|
| ADR-001 | Express.js | Fastify, Koa |
| ADR-002 | JWT with JWKS | API keys, Session-based |
| ADR-003 | `deleted_at` timestamp | Boolean flag, Archive table, Event sourcing |
| ADR-004 | In-process queue + DB state | RabbitMQ, Synchronous delivery |
| ADR-005 | PostgreSQL FTS (tsvector/GIN) | Elasticsearch, LIKE queries |
| ADR-006 | Raw SQL with `pg` | Prisma, TypeORM, Knex |
| ADR-007 | Scheduled DELETE (node-cron) | Table partitioning, K8s CronJob |
| ADR-008 | express-rate-limit MemoryStore | Redis store, Ingress-level |
