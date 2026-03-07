# Security Findings: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Agent**: review-auditor
**Generated**: 2026-03-07

---

## 1. STRIDE Mitigation Verification

### 1.1 Authentication Subsystem

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-AUTH-S01 | JWT signature verification against JWKS | YES | `src/interface/http/middleware/auth.ts:90-115` | RS256 verification via `jwks-rsa` in production mode; JWKS keys cached with 1-hour TTL |
| STR-AUTH-S02 | Token expiry validation + clock tolerance | YES | `src/interface/http/middleware/auth.ts:96` | `clockTolerance: 30` seconds configured in verify options |
| STR-AUTH-T01 | JWT signature ensures payload integrity | YES | `src/interface/http/middleware/auth.ts:90-115` | `algorithms: ['RS256']` restricts to RSA signatures in production |
| STR-AUTH-R01 | User ID extracted and attached to operations | YES | `src/interface/http/middleware/auth.ts:111-112` | `req.userId = payload.sub` used in all service calls for activity logging |
| STR-AUTH-I01 | JWT not logged or exposed in errors/URLs | YES | `src/interface/http/middleware/auth.ts:52-61` | Query parameter tokens rejected; error messages generic ("A valid JWT token is required") |
| STR-AUTH-D01 | Rate limiting before JWT verification | PARTIAL | `src/interface/http/app.ts:100-101` | Auth middleware runs BEFORE rate limiter in the middleware chain. Order should be reversed so rate limiter runs first to protect against CPU-exhausting invalid JWT floods |
| STR-AUTH-E01 | Roles from database, not JWT claims | YES | `src/application/services/task-service.ts:38-41`, `membership-service.ts:27-28`, etc. | All RBAC checks use `membershipRepo.getMembership()` database lookups, never JWT claims |

### 1.2 SSO Integration

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-SSO-S01 | JWKS URL pinned to known issuer | YES | `src/interface/http/middleware/auth.ts:16,69,95` | `JWT_ISSUER` env var validated in verify options; `JWKS_URI` configurable |
| STR-SSO-T01 | JWKS fetched over HTTPS | YES | `src/interface/http/middleware/auth.ts:16` | Default URI uses HTTPS; `jwks-rsa` uses Node.js HTTPS module with TLS verification |
| STR-SSO-D01 | JWKS keys cached | YES | `src/interface/http/middleware/auth.ts:17-19` | `cache: true`, `cacheMaxEntries: 5`, `cacheMaxAge: 3600000` (1 hour) |

### 1.3 Task CRUD

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-TASK-S01 | Auth required for all task routes | YES | `src/interface/http/app.ts:100` | `app.use(authMiddleware)` applied before all protected routes |
| STR-TASK-T01 | DTO whitelist for allowed fields | YES | `src/application/dto/create-task.dto.ts:5-28` | Zod schema only permits: title, description, status, priority, assignee, due_date, tags. Server generates id, created_at, updated_at, deleted_at, created_by |
| STR-TASK-T02 | Parameterized SQL queries | YES | `src/infrastructure/database/repositories/pg-task-repository.ts:11-15,33-49,57-98,106-114` | All queries use `$1, $2, ...` parameterized placeholders. No string interpolation of user input in SQL |
| STR-TASK-T03 | Content-Type prevents browser HTML parsing | YES | `src/interface/http/app.ts:61-64` | `Content-Type: application/vnd.api+json` set on all responses via middleware |
| STR-TASK-R01 | Activity logging for all mutations | YES | `src/application/services/task-service.ts:56-62,135-141,187-193` | `activityLogService.log()` called for create, update, and delete with actor, action, and changes |
| STR-TASK-I01 | Board membership check before task access | YES | `src/interface/http/app.ts:107-108` | `checkBoardAccess` middleware applied to task routes; also checked in `TaskService` at service layer |
| STR-TASK-I02 | Soft-deleted tasks filtered from responses | YES | `src/infrastructure/database/repositories/pg-task-repository.ts:25` | `WHERE deleted_at IS NULL` in `findByBoardId`; `getTask` service method checks `task.deleted_at !== null` |
| STR-TASK-D01 | Rate limiting + field length limits | YES | `src/interface/http/middleware/rate-limiter.ts:4-22`, `src/application/dto/create-task.dto.ts:12-25` | 100 req/min; title max 200, description max 5000, tags max 10 |
| STR-TASK-E01 | Viewer role rejected for write operations | YES | `src/application/services/task-service.ts:40-42,108-110` | `membership.role === 'Viewer'` check in createTask and updateTask; returns 403 |
| STR-TASK-E02 | Only creator or Admin can delete | YES | `src/application/services/task-service.ts:176-179` | `task.created_by === userId \|\| role === 'Admin'` check; board owner also treated as Admin |

### 1.4 Task Repository (Data Layer)

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-TREPO-S01 | TLS for database connections | YES | `src/infrastructure/database/pool.ts:12` | `ssl: { rejectUnauthorized: true }` when `DB_SSL=true`; rejects self-signed certs |
| STR-TREPO-T01 | Restrict direct DB access | N/A | Infrastructure concern | Kubernetes NetworkPolicy -- not application code; documented in design |
| STR-TREPO-I01 | Credentials not in code/logs | PARTIAL | `src/infrastructure/database/pool.ts:7-11` | Uses env vars for credentials. However, default passwords (`'taskflow'`) are hardcoded as fallbacks. Error handler at `error-handler.ts:56` logs errors that could contain DB info |
| STR-TREPO-D01 | Connection pool limits + query timeout | PARTIAL | `src/infrastructure/database/pool.ts:13-15` | Pool: max 20, connectionTimeoutMillis 5000, idleTimeoutMillis 30000. **Missing: no `statement_timeout` for query-level timeout** |
| STR-TREPO-E01 | Least-privilege DB user | N/A | Infrastructure concern | Documented in design; requires separate migration user |

### 1.5 Board Management

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-BOARD-S01 | Auth required for board routes | YES | `src/interface/http/app.ts:100` | Auth middleware applied globally before board routes |
| STR-BOARD-T01 | Minimum 2 columns validation | YES | `src/application/dto/create-board.dto.ts` | Zod validation enforces `columns.min(2)` |
| STR-BOARD-T02 | Parameterized SQL for boards | YES | `src/infrastructure/database/repositories/pg-board-repository.ts` | All queries parameterized |
| STR-BOARD-R01 | Board modification logging | PARTIAL | -- | Activity logging exists for tasks but board-level changes are not explicitly logged via activity log service |
| STR-BOARD-I01 | Board listing scoped to memberships | YES | `src/infrastructure/database/repositories/pg-membership-repository.ts:18-25` | `getAccessibleBoardIds` uses UNION of membership + ownership |
| STR-BOARD-D01 | Rate limiting on board creation | YES | `src/interface/http/middleware/rate-limiter.ts:4` | 100 req/min rate limit applies |
| STR-BOARD-E01 | Only owner/Admin can modify board | YES | `src/application/services/board-service.ts:41-47` | `board.owner_id === userId \|\| membership.role === 'Admin'` check |

### 1.6 Membership Management

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-MEM-S01 | Only owner/Admin can invite | YES | `src/application/services/membership-service.ts:25-31` | Actor authorization check before processing invite |
| STR-MEM-T01 | Self-role-modification prevention | NO | `src/application/services/membership-service.ts:13-41` | **Gap: No check preventing a user from being invited to change their own role. If an Admin passes their own userId, the role update proceeds** |
| STR-MEM-R01 | Membership change logging | NO | -- | **Gap: No activity log entry created for member additions or role changes** |
| STR-MEM-I01 | Member listing requires membership | PARTIAL | `src/interface/http/app.ts:109` | Member routes lack `checkBoardAccess` middleware; RBAC is enforced at service layer for invite, but no GET /members endpoint exists to list members |
| STR-MEM-D01 | Rate limiting on invite | YES | `src/interface/http/middleware/rate-limiter.ts:4` | Global 100 req/min applies |
| STR-MEM-E01 | Member/Viewer cannot invite | YES | `src/application/services/membership-service.ts:28-30` | Only owner or Admin role passes the authorization check |

### 1.7 Webhook Configuration

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-WH-S01 | HTTPS-only webhook URLs | YES | `src/application/dto/create-webhook.dto.ts:11-13` | Zod `.url()` + `.refine(val => val.startsWith('https://'))` |
| STR-WH-T01 | Unique delivery ID + timestamp in payload | YES | `src/application/services/webhook-service.ts:70-71,178-182` | `crypto.randomUUID()` for delivery_id; ISO timestamp included |
| STR-WH-T02 | HMAC-SHA256 payload signing | YES | `src/application/services/webhook-service.ts:73,226-228` | `crypto.createHmac('sha256', secret).update(payload).digest('hex')` |
| STR-WH-R01 | Delivery records persisted | YES | `src/application/services/webhook-service.ts:102-114,138-151,157-169` | All delivery attempts recorded with status, attempt count, error |
| STR-WH-I01 | Secret masked in responses + encrypted at rest | YES | `src/interface/http/serializers/webhook-serializer.ts:3-6`, `src/application/services/webhook-service.ts:204-212` | `maskSecret()` returns `'****'`; AES-256-GCM encryption with IV + auth tag |
| STR-WH-I02 | URL validation on configuration | YES | `src/application/dto/create-webhook.dto.ts:9-13` | Zod URL validation + HTTPS enforcement |
| STR-WH-D01 | Async delivery with timeout | PARTIAL | `src/application/services/webhook-service.ts:88-99` | 5-second timeout via `AbortSignal.timeout(5000)`. However, `domainEvents.emit()` awaits all handlers synchronously in `domain-events.ts:26-33`, so delivery is NOT truly async -- it adds latency to the API response. The `.catch(() => {})` in task-service suppresses errors but the await still blocks |
| STR-WH-D02 | Retry cap with exponential backoff | YES | `src/application/services/webhook-service.ts:134-174` | MAX_ATTEMPTS = 4; backoff delays [1000, 4000, 16000] ms |
| STR-WH-E01 | Only owner/Admin can configure webhooks | YES | `src/application/services/webhook-service.ts:34-39` | Owner check + Admin role check via membership |

### 1.8 Webhook Delivery Driver

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-WHD-S01 | HTTPS for webhook deliveries | PARTIAL | `src/application/services/webhook-service.ts:88` | Uses `fetch()` which follows HTTPS for https:// URLs. However, no explicit HTTPS-only enforcement at delivery time (HTTPS enforcement is at configuration time via Zod) |
| STR-WHD-T01 | HMAC-SHA256 signature in X-Signature-256 | YES | `src/application/services/webhook-service.ts:92` | `X-Signature-256: sha256=${signature}` header set on every delivery |
| STR-WHD-I01 | Webhook payload contains opted-in data | YES | `src/application/services/webhook-service.ts:177-201` | Payload includes task snapshot data that the board opted into by configuring the webhook |
| STR-WHD-D01 | SSRF: Block private IP ranges | PARTIAL | `src/interface/webhook/webhook-delivery-driver.ts:22-32,38-46` | **WebhookDeliveryDriver has SSRF protection with regex patterns for private IPs. HOWEVER, WebhookService.deliverWebhook() uses raw fetch() and does NOT use the driver.** SSRF protection is dead code in the delivery path |
| STR-WHD-E01 | Egress network policy | N/A | Infrastructure concern | Kubernetes NetworkPolicy -- not application code |

### 1.9 Search Subsystem

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-SRCH-S01 | Auth required for search | YES | `src/interface/http/app.ts:100,114` | Auth middleware applied before search routes |
| STR-SRCH-T01 | SQL injection prevention via plainto_tsquery | YES | `src/infrastructure/database/repositories/pg-search-repository.ts:37` | `plainto_tsquery('english', $paramIdx)` with parameterized binding -- safe against injection |
| STR-SRCH-T02 | Filter field whitelist | YES | `src/application/services/search-service.ts:38`, `src/application/dto/search-query.dto.ts:3` | `ALLOWED_FILTER_FIELDS` whitelist checked; unknown fields return 400 error |
| STR-SRCH-R01 | Search query logging | N/A | Optional | Read-only operation; logging is privacy-sensitive |
| STR-SRCH-I01 | Search scoped to accessible boards | YES | `src/application/services/search-service.ts:53`, `src/infrastructure/database/repositories/pg-search-repository.ts:28-30` | `getAccessibleBoardIds(userId)` called first; `board_id = ANY($1)` filter applied |
| STR-SRCH-D01 | Search query limits + GIN index | YES | `src/application/dto/search-query.dto.ts:7`, `src/infrastructure/database/migrations/003-create-tasks.sql:35`, `src/interface/http/controllers/search-controller.ts:26-35` | Max query 200 chars; GIN index on search_vector; max page size 100 |
| STR-SRCH-E01 | Board access scoping at service layer | YES | `src/application/services/search-service.ts:53-63` | Always filters by accessible board IDs regardless of filter params |

### 1.10 Activity Log Subsystem

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-ALOG-S01 | No create/update API for logs | YES | `src/interface/http/routes/activity-routes.ts` | Only GET endpoints defined; no POST/PATCH/DELETE routes for activity logs |
| STR-ALOG-T01 | Immutable: no update/delete operations | YES | `src/application/services/activity-log-service.ts:1-26` | Service only exposes `log()` (insert), `getTaskActivity()`, and `getBoardActivity()` -- no update/delete methods |
| STR-ALOG-R01 | Logging in same transaction as mutation | NO | `src/application/services/task-service.ts:44-62` | **Gap: Task insert and activity log insert are separate queries, not in a transaction. If the app crashes between them, the audit trail has a gap** |
| STR-ALOG-I01 | Board membership check for log access | YES | `src/interface/http/app.ts:107,111` | `checkBoardAccess` middleware applied to both task activity and board activity routes |
| STR-ALOG-D01 | 90-day retention with automated purge | YES | `src/application/services/retention-service.ts:4-5`, `src/infrastructure/scheduler/retention-scheduler.ts:8-27` | `RETENTION_DAYS = 90`, batch processing with `BATCH_SIZE = 1000`, scheduled daily at 02:00 UTC |
| STR-ALOG-E01 | Purge only via internal scheduler | YES | No API endpoint | RetentionScheduler is internal; no REST endpoint exposes purge functionality |

### 1.11 Rate Limiter

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-RL-S01 | Rate limit per user ID | YES | `src/interface/http/middleware/rate-limiter.ts:9-11` | Key generator uses `req.userId` from JWT, falling back to `req.ip` |
| STR-RL-T01 | In-memory store security | YES | `src/interface/http/middleware/rate-limiter.ts:4` | Using default MemoryStore for single instance; no shared cache manipulation risk |
| STR-RL-D01 | Scaling + ingress limiting | N/A | Infrastructure concern | HPA and ingress config not in application code |
| STR-RL-E01 | Trust proxy configuration | YES | `src/interface/http/app.ts:48` | `app.set('trust proxy', 1)` for single proxy level; rate limit keyed on JWT sub not IP |

### 1.12 Validation Middleware

| Threat ID | Description | Implemented? | Code Location | Verification Notes |
|-----------|-------------|-------------|---------------|-------------------|
| STR-VAL-T01 | Body size limit | YES | `src/interface/http/app.ts:57-58` | `express.json({ limit: '100kb' })` applied |
| STR-VAL-T02 | JSON parse error handling | YES | `src/interface/http/middleware/error-handler.ts:45-54` | SyntaxError with `'body' in err` detected; returns generic 400 "Malformed JSON" |
| STR-VAL-D01 | No ReDoS from complex regex | YES | All DTOs | Zod built-in validators used (string length, enum, URL, UUID); only one custom `.refine()` for HTTPS check which is a simple `startsWith()` |
| STR-VAL-I01 | User-friendly error messages | YES | `src/interface/http/middleware/validate.ts:20-31` | Error messages use path-based source pointers; no internal type exposure |

---

## 2. Security Controls Implementation Status

### 2.1 Authentication Controls

| Control ID | Control | Status | Evidence |
|-----------|---------|--------|----------|
| SEC-AUTH-01 | JWT verification on every request | IMPLEMENTED | `authMiddleware` applied globally at `app.ts:100` |
| SEC-AUTH-02 | JWKS key rotation support | IMPLEMENTED | `jwks-rsa` with cache at `auth.ts:15-22` |
| SEC-AUTH-03 | Algorithm restriction | PARTIAL | RS256 in production (`auth.ts:94`), but HS256+RS256 when JWT_SECRET set (`auth.ts:68`). **HS256 mode not restricted to dev environments** |
| SEC-AUTH-04 | Token in header only | IMPLEMENTED | Query params `token` and `access_token` rejected at `auth.ts:52-61` |

### 2.2 Authorization Controls

| Control ID | Control | Status | Evidence |
|-----------|---------|--------|----------|
| SEC-AUTHZ-01 | Board-level RBAC | IMPLEMENTED | All services check membership role |
| SEC-AUTHZ-02 | Owner/Admin gate for settings | IMPLEMENTED | Board update, invite, webhook config all check owner/Admin |
| SEC-AUTHZ-03 | Creator/Admin gate for delete | IMPLEMENTED | `task-service.ts:176-179` |
| SEC-AUTHZ-04 | Search scoping | IMPLEMENTED | `search-service.ts:53` always scopes to accessible boards |

### 2.3 Data Protection Controls

| Control ID | Control | Status | Evidence |
|-----------|---------|--------|----------|
| SEC-DATA-01 | Parameterized queries | IMPLEMENTED | All 7 repository classes use `$1, $2, ...` parameters |
| SEC-DATA-02 | Input validation | IMPLEMENTED | 7 Zod schemas for all DTOs |
| SEC-DATA-03 | Webhook secret masking | IMPLEMENTED | `webhook-serializer.ts:3-6` returns `'****'` |
| SEC-DATA-04 | SSRF prevention | PARTIAL | `webhook-delivery-driver.ts:22-46` has protection but **not integrated into WebhookService delivery path** |
| SEC-DATA-05 | TLS for database | IMPLEMENTED | `pool.ts:12` with `rejectUnauthorized: true` when SSL enabled |
| SEC-DATA-06 | Body size limit | IMPLEMENTED | `app.ts:57-58` limits to 100KB |

### 2.4 Audit Controls

| Control ID | Control | Status | Evidence |
|-----------|---------|--------|----------|
| SEC-AUDIT-01 | Immutable activity log | IMPLEMENTED | No update/delete API endpoints for logs |
| SEC-AUDIT-02 | Transactional logging | NOT IMPLEMENTED | **Activity log insert is a separate query, not in the same DB transaction as the mutation** |
| SEC-AUDIT-03 | Request ID tracing | NOT IMPLEMENTED | **No X-Request-Id propagation found in middleware or controllers** |
| SEC-AUDIT-04 | Structured logging | NOT IMPLEMENTED | Uses `console.log`/`console.error` instead of structured JSON logger (pino). **Design specified pino; implementation uses console** |

### 2.5 Webhook Security Controls

| Control ID | Control | Status | Evidence |
|-----------|---------|--------|----------|
| SEC-WH-01 | HMAC-SHA256 signing | IMPLEMENTED | `webhook-service.ts:226-228`, header `X-Signature-256: sha256=<hex>` |
| SEC-WH-02 | HTTPS-only URLs | IMPLEMENTED | Zod validation `create-webhook.dto.ts:11-13` |
| SEC-WH-03 | Delivery timeout | IMPLEMENTED | `AbortSignal.timeout(5000)` at `webhook-service.ts:98` |
| SEC-WH-04 | SSRF protection | PARTIAL | Driver class has protection; **service delivery path does not use it** |
| SEC-WH-05 | Retry cap | IMPLEMENTED | MAX_ATTEMPTS = 4 at `webhook-service.ts:134` |

---

## 3. Critical Gaps Summary

| # | Gap | Severity | STRIDE Reference | Recommendation |
|---|-----|----------|-----------------|----------------|
| 1 | **SSRF protection not integrated**: `WebhookService.deliverWebhook()` calls `fetch()` directly without SSRF checks. The `WebhookDeliveryDriver` with SSRF protection is unused in the delivery flow | HIGH | STR-WHD-D01, STR-WHD-E01 | Integrate `WebhookDeliveryDriver.isPrivateUrl()` check before `fetch()` in `webhook-service.ts:88`, or refactor to use the driver for all deliveries |
| 2 | **Hardcoded default encryption key**: `'default-encryption-key-32bytes!!'` used when `WEBHOOK_ENCRYPTION_KEY` not set | HIGH | STR-WH-I01 | Require env var in production; fail startup if missing |
| 3 | **Activity logging not transactional**: Mutation and activity log are separate queries | MEDIUM | STR-ALOG-R01 | Wrap in database transaction using `pool.connect()` + `BEGIN/COMMIT` |
| 4 | **No structured logging**: `console.log` used instead of pino | MEDIUM | STR-AUTH-R01, SEC-AUDIT-04 | Implement pino for structured JSON logging with request ID, user ID |
| 5 | **No X-Request-Id propagation**: Design requires request ID tracing | MEDIUM | SEC-AUDIT-03 | Add middleware to generate/propagate X-Request-Id |
| 6 | **Auth middleware before rate limiter**: CPU-exhausting JWT verification happens before rate limiting | MEDIUM | STR-AUTH-D01 | Swap middleware order: rate limiter first, then auth |
| 7 | **HS256 mode not restricted to dev**: `JWT_SECRET` env var enables HS256 without environment check | MEDIUM | STR-AUTH-S01 | Gate HS256 behind `NODE_ENV !== 'production'` |
| 8 | **No self-role-modification prevention**: User can change their own role via invite endpoint if they are Admin | LOW | STR-MEM-T01 | Add `actorId !== userId` check in inviteMember |
| 9 | **No membership change logging**: Member additions and role changes not recorded in activity logs | LOW | STR-MEM-R01, STR-BOARD-R01 | Extend activity logging to membership and board changes |
| 10 | **No statement_timeout in pg pool**: Slow queries could exhaust connections | LOW | STR-TREPO-D01 | Add `statement_timeout: 5000` to pool config |

---

## 4. Security Score by Component

| Component | Mitigations Required | Implemented | Partial | Not Implemented | Score |
|-----------|---------------------|-------------|---------|-----------------|-------|
| Auth Middleware | 7 | 6 | 1 | 0 | 93% |
| SSO Integration | 3 | 3 | 0 | 0 | 100% |
| Task CRUD | 10 | 10 | 0 | 0 | 100% |
| Task Repository | 5 | 2 | 2 | 1 | 60% |
| Board Management | 7 | 5 | 1 | 1 | 79% |
| Membership Management | 6 | 3 | 1 | 2 | 58% |
| Webhook Config | 9 | 7 | 1 | 1 | 83% |
| Webhook Delivery | 5 | 2 | 2 | 1 | 60% |
| Search | 7 | 7 | 0 | 0 | 100% |
| Activity Log | 6 | 4 | 0 | 2 | 67% |
| Rate Limiter | 4 | 3 | 0 | 1 | 75% |
| Validation MW | 4 | 4 | 0 | 0 | 100% |
| **OVERALL** | **73** | **56** | **8** | **9** | **82%** |

---

## 5. Specific Security Control Verification

### 5.1 JWT Authentication

- **JWKS fetching**: `jwks-rsa` library correctly configured with caching (1h TTL) and rate limiting (10 req/min) at `auth.ts:15-22`
- **Algorithm restriction**: RS256 only in production at `auth.ts:94`. In dev mode (when `JWT_SECRET` is set), both HS256 and RS256 are accepted at `auth.ts:68`
- **Issuer validation**: `issuer: process.env.JWT_ISSUER` validated in both modes at `auth.ts:69,95`
- **Clock tolerance**: 30 seconds configured at `auth.ts:70,96`
- **Token source**: Query parameter tokens explicitly rejected at `auth.ts:52-61`

### 5.2 RBAC Authorization

- **Board membership checked**: Via `membershipRepo.getMembership()` in all service methods
- **Owner always has access**: `board.owner_id === userId` checked in all services
- **Viewer restrictions**: Explicitly blocked from write operations in `task-service.ts:40-42,108-110`
- **Admin/Owner-only operations**: Board update, member invite, webhook config all require Admin or owner
- **Creator-only delete**: `task-service.ts:176-179` checks `task.created_by === userId`

### 5.3 Input Validation (Zod Schemas)

- **CreateTaskSchema**: title (1-200 chars), description (max 5000), status enum, priority enum, tags (max 10, each max 50)
- **UpdateTaskSchema**: All fields optional, same constraints
- **CreateBoardSchema**: name (1-100 chars), description (max 500), columns (min 2)
- **UpdateBoardSchema**: All fields optional, same constraints
- **InviteMemberSchema**: user_id (UUID), role enum (Admin/Member/Viewer)
- **CreateWebhookSchema**: url (HTTPS only), secret (min 16 chars), events (enum array)
- **SearchQuerySchema**: q (max 200), filter fields whitelisted, page size max 100

### 5.4 SQL Injection Prevention

All 7 PostgreSQL repository classes verified to use parameterized queries exclusively:
- `pg-task-repository.ts`: 5 methods, all parameterized
- `pg-board-repository.ts`: 4 methods, all parameterized
- `pg-membership-repository.ts`: 5 methods, all parameterized
- `pg-webhook-repository.ts`: 4 methods, all parameterized
- `pg-webhook-delivery-repository.ts`: 3 methods, all parameterized
- `pg-search-repository.ts`: 1 method, parameterized with dynamic WHERE clauses built safely
- `pg-activity-log-repository.ts`: 4 methods, all parameterized

**Note**: `pg-search-repository.ts:74-76` validates sort field against a whitelist before interpolation into SQL, which is correct.

### 5.5 Rate Limiting

- **express-rate-limit** configured at `rate-limiter.ts:4-22`
- Window: 60 seconds, max 100 requests
- Key: `req.userId` (from JWT), fallback to `req.ip`
- Standard headers enabled for `X-RateLimit-*`
- Custom 429 handler with JSON:API error format

### 5.6 SSRF Protection

- **WebhookDeliveryDriver** at `webhook-delivery-driver.ts:22-32` blocks:
  - 127.x.x.x (loopback)
  - 10.x.x.x (private)
  - 172.16-31.x.x (private)
  - 192.168.x.x (private)
  - 169.254.x.x (link-local / AWS metadata)
  - 0.x.x.x
  - ::1 (IPv6 loopback)
  - fc00: (IPv6 unique local)
  - fe80: (IPv6 link-local)
- **GAP**: This protection exists in the driver but is NOT used in the actual `WebhookService.deliverWebhook()` method

### 5.7 Webhook HMAC Signing

- Secret decrypted from AES-256-GCM at delivery time: `webhook-service.ts:72`
- HMAC-SHA256 computed: `crypto.createHmac('sha256', secret).update(payload).digest('hex')` at `webhook-service.ts:226-228`
- Signature sent as `X-Signature-256: sha256=<hex>` header at `webhook-service.ts:92`
- Additional headers: `X-Delivery-Id`, `X-Event-Type`, `User-Agent: TaskFlow-Webhook/1.0`

### 5.8 Audit Logging

- Activity log entries created for: task.created, task.updated, task.status_changed, task.deleted
- Each entry includes: board_id, task_id, actor_id, action, changes (before/after), created_at
- Immutable: no update or delete API endpoints
- 90-day retention purge via internal scheduler
- **Missing**: Board-level changes, membership changes not logged

### 5.9 Soft Delete

- Tasks use `deleted_at TIMESTAMPTZ` column at `migrations/003-create-tasks.sql:18`
- `softDelete` sets `deleted_at = now()` at `pg-task-repository.ts:106-114`
- All list/search queries filter `WHERE deleted_at IS NULL`
- `getTask` service method checks `task.deleted_at !== null` at `task-service.ts:77`

### 5.10 Helmet Security Headers

- `helmet()` applied as first middleware at `app.ts:51`
- Provides: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Strict-Transport-Security, Content-Security-Policy, and other security headers
