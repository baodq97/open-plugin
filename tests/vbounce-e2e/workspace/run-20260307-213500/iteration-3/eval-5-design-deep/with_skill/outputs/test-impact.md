# Test Impact Analysis: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## 1. Component Test Impact Matrix

### 1.1 Domain Layer

#### Task Entity

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-TASK-01 | Task entity creation with valid data |
| Unit | UT-TASK-02 | Task entity validation: title required, max 200 chars |
| Unit | UT-TASK-03 | Task entity validation: description max 5000 chars |
| Unit | UT-TASK-04 | Task entity validation: status enum enforcement |
| Unit | UT-TASK-05 | Task entity validation: priority enum enforcement |
| Unit | UT-TASK-06 | Task entity validation: tags max 10 items |
| Unit | UT-TASK-07 | Task entity: soft-delete sets deleted_at |
| Unit | UT-TASK-08 | Task entity: isSoftDeleted() returns correct boolean |

#### Board Entity

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-BOARD-01 | Board entity creation with valid data |
| Unit | UT-BOARD-02 | Board entity validation: name required, max 100 chars |
| Unit | UT-BOARD-03 | Board entity validation: columns min 2 |
| Unit | UT-BOARD-04 | Board entity: default columns when none provided |

#### Membership Entity

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-MEM-01 | Membership entity creation with valid role |
| Unit | UT-MEM-02 | Membership entity: role enum enforcement |
| Unit | UT-MEM-03 | Membership entity: permission checks (canCreate, canUpdate, canDelete, canManage) |

#### Webhook Entity

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-WH-01 | Webhook entity creation with valid HTTPS URL |
| Unit | UT-WH-02 | Webhook entity validation: URL must be HTTPS |
| Unit | UT-WH-03 | Webhook entity: secret masking |
| Unit | UT-WH-04 | Webhook entity: event type validation |

#### Domain Events

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-EVT-01 | TaskCreated event structure |
| Unit | UT-EVT-02 | TaskUpdated event with before/after |
| Unit | UT-EVT-03 | TaskStatusChanged event with from/to |
| Unit | UT-EVT-04 | TaskDeleted event structure |

### 1.2 Application Layer (Services)

#### TaskService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-TSVC-01 | createTask: validates input, checks membership, creates task |
| Unit | UT-TSVC-02 | createTask: rejects Viewer role |
| Unit | UT-TSVC-03 | createTask: emits domain event and activity log |
| Unit | UT-TSVC-04 | getTask: returns task for valid member |
| Unit | UT-TSVC-05 | getTask: returns null for soft-deleted task |
| Unit | UT-TSVC-06 | listTasks: returns non-deleted tasks for board |
| Unit | UT-TSVC-07 | updateTask: validates updates, checks membership |
| Unit | UT-TSVC-08 | updateTask: rejects Viewer role |
| Unit | UT-TSVC-09 | updateTask: emits status_changed event when status changes |
| Unit | UT-TSVC-10 | deleteTask: allows creator to delete own task |
| Unit | UT-TSVC-11 | deleteTask: allows Admin to delete any task |
| Unit | UT-TSVC-12 | deleteTask: rejects non-creator Member |
| Unit | UT-TSVC-13 | deleteTask: returns not-found for already-deleted task |
| Integration | IT-TSVC-01 | Full create-read-update-delete flow with database |
| Integration | IT-TSVC-02 | Activity log entries created for each mutation |
| Security | ST-TSVC-01 | SQL injection attempt in task title/description |
| Security | ST-TSVC-02 | RBAC bypass attempt (Viewer creating task) |

#### BoardService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-BSVC-01 | createBoard: creates board with defaults, sets owner |
| Unit | UT-BSVC-02 | createBoard: creates board with custom columns |
| Unit | UT-BSVC-03 | createBoard: rejects name > 100 chars |
| Unit | UT-BSVC-04 | createBoard: rejects columns < 2 |
| Unit | UT-BSVC-05 | updateBoard: allows owner to update |
| Unit | UT-BSVC-06 | updateBoard: allows Admin to update |
| Unit | UT-BSVC-07 | updateBoard: rejects Member |
| Integration | IT-BSVC-01 | Board creation auto-creates owner membership |
| Security | ST-BSVC-01 | RBAC bypass attempt (Member modifying board) |

#### MembershipService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-MSVC-01 | inviteMember: creates new membership |
| Unit | UT-MSVC-02 | inviteMember: updates role for existing member |
| Unit | UT-MSVC-03 | inviteMember: rejects invalid role |
| Unit | UT-MSVC-04 | inviteMember: only owner/Admin can invite |
| Integration | IT-MSVC-01 | Invite flow with subsequent board access verification |
| Security | ST-MSVC-01 | Privilege escalation attempt (self-role-change) |

#### WebhookService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-WSVC-01 | configureWebhook: creates webhook with HTTPS URL |
| Unit | UT-WSVC-02 | configureWebhook: rejects non-HTTPS URL |
| Unit | UT-WSVC-03 | configureWebhook: only owner/Admin can configure |
| Unit | UT-WSVC-04 | emit: creates delivery record and dispatches async |
| Unit | UT-WSVC-05 | emit: no-op when no webhook configured |
| Unit | UT-WSVC-06 | emit: handles multiple webhooks per board |
| Integration | IT-WSVC-01 | End-to-end webhook delivery on task creation |
| Integration | IT-WSVC-02 | Retry with exponential backoff |
| Integration | IT-WSVC-03 | Permanent failure after 4 attempts |
| Security | ST-WSVC-01 | HMAC signature verification |
| Security | ST-WSVC-02 | SSRF prevention (internal IP rejection) |

#### SearchService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-SSVC-01 | search: scopes results to accessible boards |
| Unit | UT-SSVC-02 | search: applies full-text query |
| Unit | UT-SSVC-03 | search: applies attribute filters |
| Unit | UT-SSVC-04 | search: applies combined filters (AND logic) |
| Unit | UT-SSVC-05 | search: applies pagination defaults |
| Unit | UT-SSVC-06 | search: applies sorting |
| Unit | UT-SSVC-07 | search: rejects unknown filter fields |
| Unit | UT-SSVC-08 | search: rejects page size > 100 |
| Integration | IT-SSVC-01 | Full-text search with PostgreSQL tsvector |
| Integration | IT-SSVC-02 | Combined search + filter + sort + pagination |
| Security | ST-SSVC-01 | Search scoping: no cross-board data leakage |
| Security | ST-SSVC-02 | SQL injection via search query parameter |

#### ActivityLogService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-ASVC-01 | logActivity: creates immutable log entry |
| Unit | UT-ASVC-02 | logActivity: captures before/after for updates |
| Unit | UT-ASVC-03 | logActivity: captures full state for creates |
| Unit | UT-ASVC-04 | getTaskActivity: returns entries in reverse chronological order |
| Unit | UT-ASVC-05 | getBoardActivity: returns paginated entries |
| Unit | UT-ASVC-06 | getTaskActivity: checks board membership |
| Integration | IT-ASVC-01 | Activity log created within same transaction as mutation |
| Security | ST-ASVC-01 | Unauthorized access to activity log (non-member) |

#### RetentionService

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-RSVC-01 | purge: deletes entries older than 90 days |
| Unit | UT-RSVC-02 | purge: retains entries at exactly 90 days |
| Unit | UT-RSVC-03 | purge: no-op when no old entries |
| Unit | UT-RSVC-04 | purge: batch deletion (1000 at a time) |
| Integration | IT-RSVC-01 | Retention purge with real database timestamps |

### 1.3 Interface Layer

#### Auth Middleware

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-AUTH-01 | Accepts valid JWT with correct issuer |
| Unit | UT-AUTH-02 | Rejects missing Authorization header |
| Unit | UT-AUTH-03 | Rejects expired JWT |
| Unit | UT-AUTH-04 | Rejects tampered JWT |
| Unit | UT-AUTH-05 | Rejects JWT with wrong algorithm (HS256 vs RS256) |
| Unit | UT-AUTH-06 | Rejects JWT with wrong issuer |
| Unit | UT-AUTH-07 | Extracts user ID from `sub` claim |
| Security | ST-AUTH-01 | JWT forgery with none algorithm |
| Security | ST-AUTH-02 | JWT replay with expired token |
| Security | ST-AUTH-03 | JWT with manipulated claims |

#### Rate Limiter Middleware

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-RL-01 | Allows requests under limit (100/min) |
| Unit | UT-RL-02 | Returns 429 when limit exceeded |
| Unit | UT-RL-03 | Includes X-RateLimit-* headers |
| Unit | UT-RL-04 | Includes Retry-After header on 429 |
| Unit | UT-RL-05 | Keys rate limit on user ID (not IP) |
| Security | ST-RL-01 | Rate limit bypass via header injection |

#### Validation Middleware

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-VAL-01 | Validates request body against Zod schema |
| Unit | UT-VAL-02 | Returns JSON:API error format for validation failures |
| Unit | UT-VAL-03 | Rejects oversized request body |
| Unit | UT-VAL-04 | Handles malformed JSON gracefully |

#### Controllers (per controller)

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-CTRL-01 | Route registration and HTTP method mapping |
| Unit | UT-CTRL-02 | Correct status codes for success responses |
| Unit | UT-CTRL-03 | JSON:API serialization of response bodies |
| Unit | UT-CTRL-04 | Error propagation to error handler |
| Integration | IT-CTRL-01 | Full HTTP request/response cycle (per endpoint) |

#### JSON:API Serializers

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-SER-01 | Task serialization includes all attributes |
| Unit | UT-SER-02 | Board serialization includes columns |
| Unit | UT-SER-03 | Membership serialization includes role |
| Unit | UT-SER-04 | Webhook serialization masks secret |
| Unit | UT-SER-05 | Activity log serialization includes changes |
| Unit | UT-SER-06 | Error serialization matches JSON:API spec |
| Unit | UT-SER-07 | Collection serialization includes meta and links |

#### Health Controller

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-HC-01 | /healthz returns 200 |
| Unit | UT-HC-02 | /readyz returns 200 when DB connected |
| Unit | UT-HC-03 | /readyz returns 503 when DB unavailable |
| Integration | IT-HC-01 | Health check with real database connection |

### 1.4 Infrastructure Layer

#### PostgreSQL Repositories

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Integration | IT-REPO-01 | TaskRepository CRUD operations |
| Integration | IT-REPO-02 | TaskRepository soft-delete and exclusion |
| Integration | IT-REPO-03 | BoardRepository CRUD with JSONB columns |
| Integration | IT-REPO-04 | MembershipRepository upsert behavior |
| Integration | IT-REPO-05 | WebhookRepository with encrypted secret |
| Integration | IT-REPO-06 | WebhookDeliveryRepository retry status tracking |
| Integration | IT-REPO-07 | SearchRepository full-text search with tsvector |
| Integration | IT-REPO-08 | SearchRepository attribute filtering |
| Integration | IT-REPO-09 | SearchRepository pagination and sorting |
| Integration | IT-REPO-10 | ActivityLogRepository insert and query |
| Integration | IT-REPO-11 | ActivityLogRepository retention purge |
| Security | ST-REPO-01 | Parameterized query verification (no SQL injection) |

#### Webhook Retry Queue

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-QUEUE-01 | Enqueue and dequeue with delay |
| Unit | UT-QUEUE-02 | Exponential backoff timing (1s, 4s, 16s) |
| Unit | UT-QUEUE-03 | Max retry limit enforcement |
| Integration | IT-QUEUE-01 | Retry recovery after process restart |

#### Webhook Delivery Driver

| Test Type | Tests Needed | Description |
|-----------|-------------|-------------|
| Unit | UT-WDD-01 | Successful delivery with HMAC signature |
| Unit | UT-WDD-02 | Timeout handling (5s) |
| Unit | UT-WDD-03 | SSRF check: reject private IP ranges |
| Unit | UT-WDD-04 | Record delivery status and response code |
| Security | ST-WDD-01 | SSRF prevention: localhost, 10.x, 172.16.x, 169.254.x |
| Security | ST-WDD-02 | HMAC-SHA256 signature correctness |

---

## 2. Test Count Summary

| Category | Unit Tests | Integration Tests | Security Tests | Total |
|----------|-----------|-------------------|----------------|-------|
| Domain Entities | 17 | 0 | 0 | 17 |
| Domain Events | 4 | 0 | 0 | 4 |
| Application Services | 36 | 11 | 11 | 58 |
| Interface Middleware | 16 | 0 | 4 | 20 |
| Interface Controllers | 4 | 1 | 0 | 5 |
| Interface Serializers | 7 | 0 | 0 | 7 |
| Interface Health | 3 | 1 | 0 | 4 |
| Infrastructure Repos | 0 | 11 | 1 | 12 |
| Infrastructure Queue | 3 | 1 | 0 | 4 |
| Infrastructure Driver | 4 | 0 | 2 | 6 |
| **TOTAL** | **94** | **25** | **18** | **137** |

---

## 3. Critical Path Tests

The following test chains represent critical user flows and must all pass:

### CP-01: Task CRUD Happy Path
```
UT-AUTH-01 -> UT-RL-01 -> UT-VAL-01 -> UT-TSVC-01 -> IT-REPO-01 -> UT-SER-01
```

### CP-02: RBAC Enforcement
```
UT-AUTH-01 -> UT-MEM-03 -> UT-TSVC-02 -> ST-TSVC-02 -> ST-BSVC-01 -> ST-MSVC-01
```

### CP-03: Webhook Delivery
```
UT-WSVC-04 -> UT-WDD-01 -> IT-WSVC-01 -> IT-WSVC-02 -> ST-WSVC-01
```

### CP-04: Search Pipeline
```
UT-SSVC-01 -> UT-SSVC-02 -> UT-SSVC-03 -> IT-SSVC-01 -> ST-SSVC-01
```

### CP-05: Activity Log Integrity
```
UT-ASVC-01 -> UT-ASVC-02 -> IT-ASVC-01 -> UT-RSVC-01 -> IT-RSVC-01
```
