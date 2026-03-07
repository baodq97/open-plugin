# Security Design: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## 1. Security Architecture Overview

TaskFlow implements defense-in-depth with multiple security layers:

1. **Network layer**: Kubernetes ingress with TLS termination
2. **Authentication layer**: JWT verification middleware
3. **Authorization layer**: Board-level RBAC at service layer
4. **Input validation layer**: Zod schema validation middleware
5. **Data layer**: Parameterized queries, encrypted secrets at rest
6. **Transport layer**: HTTPS-only webhook delivery, HMAC signing

---

## 2. STRIDE Threat Analysis

### 2.1 Authentication Subsystem

#### 2.1.1 JWT Auth Middleware

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-AUTH-S01 | Attacker forges a JWT token with a valid-looking payload to impersonate another user | Critical | Verify JWT signature against SSO JWKS public keys; reject unsigned or HS256 tokens when RS256 is expected | Use `jwks-rsa` to fetch and cache JWKS keys; validate `alg` header matches expected algorithm (RS256); reject `none` algorithm |
| **Spoofing** | STR-AUTH-S02 | Attacker replays an expired or revoked JWT token | High | Validate `exp` claim; implement clock skew tolerance of 30s max; check `iat` is not in the future | Reject tokens where `exp < now - 30s`; optionally maintain a token blacklist for emergency revocation |
| **Tampering** | STR-AUTH-T01 | Attacker modifies JWT payload (e.g., changes `sub` to another user ID) after issuance | Critical | Signature verification ensures payload integrity; any modification invalidates the HMAC/RSA signature | JWT signature verification is mandatory for every request; reject any token that fails verification |
| **Repudiation** | STR-AUTH-R01 | User denies performing an action; system cannot prove which user initiated a request | Medium | Extract `sub` from verified JWT and attach to all operations; log user ID with every mutation | Store `actor_user_id` in activity_logs; include request ID in structured logs |
| **Information Disclosure** | STR-AUTH-I01 | JWT token leaked via logs, error messages, or URL parameters | High | Never log full JWT tokens; pass tokens only in Authorization header (not URL); mask tokens in error responses | Redact Authorization header in request logs; reject tokens passed as query parameters |
| **Denial of Service** | STR-AUTH-D01 | Attacker floods the API with invalid JWTs to exhaust CPU on signature verification | Medium | Rate limit at network/ingress level before JWT verification; cache JWKS keys to avoid repeated fetches | Apply connection-level rate limiting at ingress; cache JWKS keys with 1-hour TTL; fail fast on malformed tokens before crypto operations |
| **Elevation of Privilege** | STR-AUTH-E01 | Attacker exploits JWT claims to gain unauthorized roles (e.g., injecting admin claims) | Critical | Do NOT trust role claims from JWT; roles are stored in the `board_members` table and checked per-request | JWT provides only user identity (`sub`); all authorization decisions use database-stored membership roles |

#### 2.1.2 SSO Integration

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-SSO-S01 | Attacker stands up a fake JWKS endpoint to issue tokens accepted by TaskFlow | Critical | Pin the JWKS URL to the known SSO issuer; validate `iss` claim matches expected issuer | Configure `JWT_ISSUER` and `JWKS_URI` as environment variables; reject tokens with mismatched `iss` |
| **Tampering** | STR-SSO-T01 | Man-in-the-middle modifies JWKS response to inject attacker's public key | High | Fetch JWKS only over HTTPS; pin TLS certificate if possible | Use HTTPS for JWKS URI; verify TLS certificate chain |
| **Denial of Service** | STR-SSO-D01 | SSO JWKS endpoint becomes unavailable, blocking all authentication | High | Cache JWKS keys locally with TTL; serve from cache when SSO is unreachable | Cache JWKS with 1-hour TTL; stale-while-revalidate pattern; alert on JWKS refresh failures |

### 2.2 Task CRUD Components

#### 2.2.1 TaskController + TaskService

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-TASK-S01 | Unauthenticated user creates/modifies/deletes tasks | Critical | Auth middleware rejects unauthenticated requests before reaching controller | All task routes registered behind `authMiddleware`; return HTTP 401 |
| **Tampering** | STR-TASK-T01 | Attacker submits task with manipulated fields (e.g., injecting `created_at`, `id`, or `deleted_at` via request body) | High | Whitelist allowed fields in DTO; ignore server-managed fields from request body | Zod schemas for CreateTaskDTO and UpdateTaskDTO include only permitted fields; server generates id, created_at, updated_at, deleted_at |
| **Tampering** | STR-TASK-T02 | SQL injection via task title, description, or tags | Critical | Use parameterized queries for all database operations; never interpolate user input into SQL | All repository methods use `$1, $2, ...` parameterized placeholders via `pg` library |
| **Tampering** | STR-TASK-T03 | XSS payload stored in task title or description | Medium | Sanitize output (JSON:API serializer does not render HTML); store raw, sanitize on read if needed; Content-Type: application/vnd.api+json prevents browser HTML parsing | Set `Content-Type: application/vnd.api+json` on all responses; API-only (no HTML rendering) |
| **Repudiation** | STR-TASK-R01 | User modifies a task and denies the change | Medium | Record every mutation in activity_logs with actor, timestamp, before/after values | ActivityLogService.log() called for every create, update, and delete operation |
| **Information Disclosure** | STR-TASK-I01 | User accesses tasks on a board they are not a member of | High | Check board membership before every task operation | MembershipRepository.getMembership() check at start of every service method; return 403 for non-members |
| **Information Disclosure** | STR-TASK-I02 | Soft-deleted tasks returned in API responses, leaking data that should be hidden | Medium | Filter `WHERE deleted_at IS NULL` on all list and search queries | Default repository query condition excludes soft-deleted records |
| **Denial of Service** | STR-TASK-D01 | Attacker creates thousands of tasks to exhaust storage or degrade performance | Medium | Rate limiting (100 req/min); maximum title length (200); maximum description length (5000); maximum tags (10) | Validation in CreateTaskDTO; rate limiter at middleware level |
| **Elevation of Privilege** | STR-TASK-E01 | Viewer role creates, updates, or deletes tasks | High | RBAC check at service layer: reject Viewer for write operations | TaskService checks role before any mutation; returns HTTP 403 for Viewers |
| **Elevation of Privilege** | STR-TASK-E02 | Non-creator Member deletes another user's task | Medium | Only task creator or Admin can delete | TaskService.deleteTask() verifies `task.created_by === userId || role === 'Admin'` |

#### 2.2.2 TaskRepository (Data Layer)

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-TREPO-S01 | Application connects to a rogue database | High | Authenticate database connection with username/password; use TLS for DB connections | Configure `ssl: true` in pg pool options; use environment variables for credentials |
| **Tampering** | STR-TREPO-T01 | Database records modified outside of application (e.g., direct DB access) | Medium | Restrict direct DB access via network policies; use database-level audit triggers as secondary control | Kubernetes NetworkPolicy limits DB access to TaskFlow pods only |
| **Information Disclosure** | STR-TREPO-I01 | Database credentials exposed in logs, environment, or code | Critical | Store credentials in Kubernetes Secrets; never log connection strings | Use K8s secrets mounted as env vars; redact `DATABASE_URL` from log output |
| **Denial of Service** | STR-TREPO-D01 | Slow queries or connection pool exhaustion | High | Connection pool limits; query timeouts; database connection monitoring | pg Pool with max 20 connections; query timeout 5000ms; health check validates pool availability |
| **Elevation of Privilege** | STR-TREPO-E01 | Application DB user has excessive privileges (DROP TABLE, etc.) | Medium | Use a least-privilege database user for the application | Application DB user: SELECT, INSERT, UPDATE, DELETE on application tables only; migration user separate |

### 2.3 Board Management Components

#### 2.3.1 BoardController + BoardService

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-BOARD-S01 | Unauthenticated user creates or modifies boards | Critical | Auth middleware on all board routes | All board routes behind authMiddleware |
| **Tampering** | STR-BOARD-T01 | Attacker modifies board columns to bypass workflow (e.g., remove required status columns) | Medium | Enforce minimum 2 columns; validate column names are non-empty strings | Zod validation: `columns.min(2)`; each column name must be non-empty, max 50 chars |
| **Tampering** | STR-BOARD-T02 | SQL injection via board name or column names | Critical | Parameterized queries | All queries use parameterized placeholders |
| **Repudiation** | STR-BOARD-R01 | Board owner denies modifying board settings | Low | Log board modifications in activity log | Extend activity logging to board-level changes |
| **Information Disclosure** | STR-BOARD-I01 | User lists boards they have no membership in | High | Board listing scoped to user's memberships | GET /boards returns only boards where user has a membership record |
| **Denial of Service** | STR-BOARD-D01 | Attacker creates excessive boards | Medium | Rate limiting; optional board creation limit per user | Rate limiter at 100 req/min; consider per-user board count limit (configurable) |
| **Elevation of Privilege** | STR-BOARD-E01 | Member modifies board settings (columns, name) | High | Only owner or Admin can modify board settings | BoardService checks `role === 'Admin' || isOwner` for update operations |

#### 2.3.2 MemberController + MembershipService

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-MEM-S01 | Attacker invites themselves with Admin role to gain privileged access | Critical | Only owner or Admin can invite; invitation requires existing privileged membership | MembershipService verifies actor is owner or Admin before processing invite |
| **Tampering** | STR-MEM-T01 | Attacker escalates their own role by manipulating the invite request | High | Role update requires owner/Admin; user cannot modify their own role | Service rejects self-role-modification; only owner/Admin can change roles |
| **Repudiation** | STR-MEM-R01 | Admin denies inviting a user | Low | Log membership changes | Activity log captures member additions and role changes |
| **Information Disclosure** | STR-MEM-I01 | User enumerates board members they shouldn't see | Medium | Member listing requires board membership | GET /boards/:id/members returns 403 for non-members |
| **Denial of Service** | STR-MEM-D01 | Attacker floods invite endpoint to create excessive memberships | Low | Rate limiting; optional maximum members per board | Rate limiter; configurable max members per board (default: 100) |
| **Elevation of Privilege** | STR-MEM-E01 | Member invites another user, bypassing owner/Admin restriction | High | RBAC check: only owner or Admin can invite | MembershipService rejects invite from Member or Viewer role |

### 2.4 Webhook Subsystem

#### 2.4.1 WebhookController + WebhookService

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-WH-S01 | Attacker configures a webhook to redirect event data to a malicious URL | High | Only owner/Admin can configure webhooks; enforce HTTPS-only URLs | Validate URL scheme is `https://`; RBAC check for webhook configuration |
| **Tampering** | STR-WH-T01 | Attacker replays a webhook delivery to the consumer to trigger duplicate actions | Medium | Include unique delivery ID and timestamp in payload; consumer should implement idempotency | Include `delivery_id` (UUID) and `timestamp` in every webhook payload |
| **Tampering** | STR-WH-T02 | Man-in-the-middle modifies webhook payload in transit | High | HMAC-SHA256 signature allows consumer to verify payload integrity | Sign payload with HMAC-SHA256 using board secret; include signature in `X-Signature-256` header |
| **Repudiation** | STR-WH-R01 | Webhook consumer claims they never received the delivery | Medium | Record all delivery attempts with timestamps, status codes, and response bodies in webhook_deliveries table | Persist delivery_id, attempt_count, status_code, response_body (truncated), timestamps |
| **Information Disclosure** | STR-WH-I01 | Webhook secret exposed in API responses | High | Mask webhook secret in all API responses; never return plaintext secret after creation | Serialize secret as masked value (e.g., `"****-key"`); store secret hashed or encrypted at rest |
| **Information Disclosure** | STR-WH-I02 | Webhook payloads sent to wrong endpoint after URL misconfiguration | Medium | Validate URL on configuration; allow owner to view/update webhook URL | URL validation on create/update; audit log for webhook config changes |
| **Denial of Service** | STR-WH-D01 | Webhook delivery to slow/unresponsive endpoint blocks task operations | High | Deliver webhooks asynchronously; set delivery timeout | Async delivery with 5-second timeout per attempt; do not block task API response on webhook delivery |
| **Denial of Service** | STR-WH-D02 | Infinite retry loop exhausts system resources | Medium | Cap retries at 3 with exponential backoff; mark as permanently failed after exhaustion | Max 4 total attempts (1 initial + 3 retries); exponential backoff 1s, 4s, 16s |
| **Elevation of Privilege** | STR-WH-E01 | Member configures webhook, gaining ability to exfiltrate all task events | High | Only owner or Admin can configure webhooks | WebhookService RBAC check; Members and Viewers cannot create/modify webhooks |

#### 2.4.2 Webhook Delivery Driver

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-WHD-S01 | TaskFlow's outbound request could be impersonated if DNS is compromised | Low | Use HTTPS for all webhook deliveries; validate TLS certificates | Node.js `https` module with default CA verification; reject self-signed certs |
| **Tampering** | STR-WHD-T01 | Outbound webhook payload modified in transit | High | HMAC-SHA256 signature enables consumer verification of payload integrity | Compute `HMAC-SHA256(secret, JSON.stringify(payload))`; set `X-Signature-256: sha256=<hex>` header |
| **Information Disclosure** | STR-WHD-I01 | Sensitive task data included in webhook payload sent to external systems | Medium | Webhook payload includes task snapshot data that the board has opted into sharing | Document that webhook payloads contain full task data; board owner accepts this on webhook creation |
| **Denial of Service** | STR-WHD-D01 | SSRF: webhook URL points to internal infrastructure (localhost, 10.x, 169.254.x) | Critical | Block webhook URLs resolving to private IP ranges, loopback, link-local, and metadata endpoints | URL validation rejects: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, ::1, fc00::/7; resolve DNS and check IP before delivery |
| **Elevation of Privilege** | STR-WHD-E01 | Webhook endpoint exploits SSRF to access internal services via TaskFlow's network identity | Critical | Block internal IPs (as above); use a dedicated egress network policy for webhook delivery | Kubernetes NetworkPolicy: webhook egress only to external IPs; no access to internal cluster services |

### 2.5 Search Subsystem

#### 2.5.1 SearchController + SearchService

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-SRCH-S01 | Unauthenticated user performs search | Critical | Auth middleware on search routes | Search routes behind authMiddleware |
| **Tampering** | STR-SRCH-T01 | SQL injection via search query `q` parameter | Critical | Use PostgreSQL `plainto_tsquery()` which sanitizes input; parameterized queries | Never concatenate `q` into SQL; use `plainto_tsquery($1)` with parameterized binding |
| **Tampering** | STR-SRCH-T02 | Manipulated filter values to bypass query logic | Medium | Validate filter field names against whitelist; validate filter values with Zod | Whitelist: status, priority, assignee, tags, due_date_from, due_date_to, board; reject unknown fields with 400 |
| **Repudiation** | STR-SRCH-R01 | User denies searching for specific terms | Low | Search queries are read-only; logging is optional | Access logs capture search queries (optional, consider privacy) |
| **Information Disclosure** | STR-SRCH-I01 | Search returns tasks from boards the user has no access to | Critical | Scope search to user's accessible board IDs | SearchService fetches accessible board IDs first; appends `WHERE board_id IN (...)` to all search queries |
| **Denial of Service** | STR-SRCH-D01 | Expensive full-text search queries degrade performance | High | Limit query length; use GIN index on tsvector; enforce page size maximum 100 | Max search query length: 200 chars; GIN index on `search_vector`; pagination enforced |
| **Elevation of Privilege** | STR-SRCH-E01 | User manipulates search to access cross-board data | High | Board access scoping at service layer (not controller) | SearchService always filters by accessible board IDs regardless of request parameters |

### 2.6 Activity Log Subsystem

#### 2.6.1 ActivityLogService + ActivityLogRepository

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-ALOG-S01 | Attacker forges activity log entries | High | Activity log is write-only from service layer; no create/update API endpoint for logs | No POST/PATCH/DELETE endpoints for activity_logs; entries created only by internal service calls |
| **Tampering** | STR-ALOG-T01 | Attacker modifies or deletes activity log entries to cover tracks | High | Immutable design: no UPDATE or DELETE API; database-level protection | No update/delete operations exposed; database user has INSERT-only on activity_logs (except for retention purge) |
| **Repudiation** | STR-ALOG-R01 | System fails to record an action, leaving a gap in audit trail | High | Activity logging within the same transaction as the mutation it records | Use database transactions: task mutation and activity log INSERT in the same transaction |
| **Information Disclosure** | STR-ALOG-I01 | User views activity log for a board they are not a member of | High | Board membership check before returning activity log entries | ActivityLogService checks membership; returns 403 for non-members |
| **Denial of Service** | STR-ALOG-D01 | Activity log table grows unboundedly, degrading query performance | Medium | 90-day retention policy with automated purge job | RetentionService runs daily at 02:00 UTC; deletes entries older than 90 days |
| **Elevation of Privilege** | STR-ALOG-E01 | Attacker triggers retention purge to destroy audit trail | Medium | Retention purge runs only via internal scheduler, not exposed as API | No API endpoint for purge; only internal cron job can trigger it |

### 2.7 API Gateway (Express Middleware)

#### 2.7.1 Rate Limiter

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Spoofing** | STR-RL-S01 | Attacker uses multiple stolen tokens to bypass per-user rate limit | Medium | Rate limiting per user ID (from JWT `sub`); additional IP-level rate limiting at ingress | Per-user rate limit (100/min) + ingress-level IP rate limit (1000/min per IP) |
| **Tampering** | STR-RL-T01 | Attacker manipulates rate limit counter (if stored in shared cache) | Low | Use in-memory rate limiter for single instance; Redis with authentication for multi-instance | express-rate-limit with MemoryStore (single instance) or Redis with TLS and AUTH |
| **Denial of Service** | STR-RL-D01 | Distributed DDoS overwhelms even rate-limited API | High | Kubernetes HPA for scaling; ingress-level connection limiting; WAF if available | HPA scales from 2 to 5 replicas; ingress rate limiting; consider cloud WAF |
| **Elevation of Privilege** | STR-RL-E01 | Attacker bypasses rate limit by exploiting header injection (X-Forwarded-For) | Medium | Trust proxy only at known reverse proxy level; validate X-Forwarded-For chain | `app.set('trust proxy', 1)` for single proxy; rate limit keyed on JWT `sub` not IP |

#### 2.7.2 Validation Middleware

| STRIDE Category | Threat ID | Threat Description | Severity | Mitigation Strategy | Implementation Requirements |
|----------------|-----------|-------------------|----------|--------------------|-----------------------------|
| **Tampering** | STR-VAL-T01 | Oversized request body causes memory exhaustion | Medium | Limit request body size | `express.json({ limit: '100kb' })` |
| **Tampering** | STR-VAL-T02 | Malformed JSON causes parsing errors that leak stack traces | Medium | Global error handler catches JSON parse errors; returns generic 400 | Error handler returns `{ errors: [{ status: "400", detail: "Malformed JSON" }] }` |
| **Denial of Service** | STR-VAL-D01 | ReDoS via complex regex in validation rules | Low | Use Zod with simple validation rules; avoid custom regex where possible | Zod built-in validators (string length, enum, URL) instead of custom regex |
| **Information Disclosure** | STR-VAL-I01 | Validation errors reveal internal schema details | Low | Return user-friendly error messages; do not expose internal field names or types | Error messages reference JSON:API source pointers (e.g., `/data/attributes/title`) |

---

## 3. Security Controls Summary

### 3.1 Authentication Controls

| Control ID | Control | Implementation |
|-----------|---------|---------------|
| SEC-AUTH-01 | JWT verification on every request | `authMiddleware` validates signature, expiry, issuer |
| SEC-AUTH-02 | JWKS key rotation support | `jwks-rsa` with caching and automatic rotation |
| SEC-AUTH-03 | Algorithm restriction | Accept only RS256; reject none, HS256 |
| SEC-AUTH-04 | Token in header only | Reject tokens in query parameters or cookies |

### 3.2 Authorization Controls

| Control ID | Control | Implementation |
|-----------|---------|---------------|
| SEC-AUTHZ-01 | Board-level RBAC | MembershipService checks role per operation |
| SEC-AUTHZ-02 | Owner/Admin gate for settings | Board config, invites, webhooks restricted |
| SEC-AUTHZ-03 | Creator/Admin gate for delete | Task deletion only by creator or Admin |
| SEC-AUTHZ-04 | Search scoping | Search results filtered by accessible boards |

### 3.3 Data Protection Controls

| Control ID | Control | Implementation |
|-----------|---------|---------------|
| SEC-DATA-01 | Parameterized queries | All SQL via pg parameterized placeholders |
| SEC-DATA-02 | Input validation | Zod schemas for all DTOs |
| SEC-DATA-03 | Webhook secret masking | Secret masked in all API responses |
| SEC-DATA-04 | SSRF prevention | Block private IP ranges for webhook URLs |
| SEC-DATA-05 | TLS for database | `ssl: true` in pg connection config |
| SEC-DATA-06 | Body size limit | Express body parser limited to 100KB |

### 3.4 Audit Controls

| Control ID | Control | Implementation |
|-----------|---------|---------------|
| SEC-AUDIT-01 | Immutable activity log | INSERT-only; no update/delete API |
| SEC-AUDIT-02 | Transactional logging | Activity log in same TX as mutation |
| SEC-AUDIT-03 | Request ID tracing | X-Request-Id propagated through all layers |
| SEC-AUDIT-04 | Structured logging | JSON format with pino; includes userId, requestId |

### 3.5 Webhook Security Controls

| Control ID | Control | Implementation |
|-----------|---------|---------------|
| SEC-WH-01 | HMAC-SHA256 signing | `X-Signature-256: sha256=<hex>` on every delivery |
| SEC-WH-02 | HTTPS-only URLs | URL validation rejects non-HTTPS |
| SEC-WH-03 | Delivery timeout | 5-second timeout per attempt |
| SEC-WH-04 | SSRF protection | DNS resolution check against private ranges |
| SEC-WH-05 | Retry cap | Max 4 attempts; permanently fails after exhaustion |

---

## 4. STRIDE Threat Count Summary

| Component | S | T | R | I | D | E | Total |
|-----------|---|---|---|---|---|---|-------|
| Auth Middleware | 2 | 1 | 1 | 1 | 1 | 1 | 7 |
| SSO Integration | 1 | 1 | 0 | 0 | 1 | 0 | 3 |
| Task CRUD | 1 | 3 | 1 | 2 | 1 | 2 | 10 |
| Task Repository | 1 | 1 | 0 | 1 | 1 | 1 | 5 |
| Board Management | 1 | 2 | 1 | 1 | 1 | 1 | 7 |
| Membership Management | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Webhook Config | 1 | 2 | 1 | 2 | 2 | 1 | 9 |
| Webhook Delivery | 1 | 1 | 0 | 1 | 1 | 1 | 5 |
| Search | 1 | 2 | 1 | 1 | 1 | 1 | 7 |
| Activity Log | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| Rate Limiter | 1 | 1 | 0 | 0 | 1 | 1 | 4 |
| Validation MW | 0 | 2 | 0 | 1 | 1 | 0 | 4 |
| **TOTAL** | **12** | **18** | **7** | **12** | **13** | **11** | **73** |

---

## 5. Critical and High Severity Threat Summary

| Severity | Count | Threat IDs |
|----------|-------|-----------|
| Critical | 12 | STR-AUTH-S01, STR-AUTH-T01, STR-AUTH-E01, STR-SSO-S01, STR-TASK-S01, STR-TASK-T02, STR-TREPO-I01, STR-BOARD-S01, STR-MEM-S01, STR-SRCH-S01, STR-SRCH-I01, STR-WHD-D01, STR-WHD-E01 |
| High | 18 | STR-AUTH-S02, STR-AUTH-I01, STR-SSO-T01, STR-SSO-D01, STR-TASK-T01, STR-TASK-I01, STR-TASK-E01, STR-TREPO-S01, STR-TREPO-D01, STR-BOARD-I01, STR-BOARD-E01, STR-MEM-T01, STR-MEM-E01, STR-WH-S01, STR-WH-T02, STR-WH-D01, STR-WH-E01, STR-ALOG-S01, STR-ALOG-T01, STR-ALOG-R01, STR-ALOG-I01, STR-SRCH-D01, STR-SRCH-E01, STR-RL-D01 |
| Medium | 24 | Remaining threats |
| Low | 8 | STR-BOARD-R01, STR-MEM-R01, STR-SRCH-R01, STR-WHD-S01, STR-RL-T01, STR-VAL-D01, STR-VAL-I01, STR-MEM-D01 |
