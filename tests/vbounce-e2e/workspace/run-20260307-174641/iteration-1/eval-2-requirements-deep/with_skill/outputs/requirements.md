# Requirements Analysis: TaskFlow API — Lightweight Task Management Service

## 1. PRD Parse Summary

**Feature**: TaskFlow API — a RESTful task management service replacing spreadsheet-based tracking.

**Stakeholders/Actors**:
- Engineer (primary user — creates/manages tasks)
- Admin (elevated privileges — delete any task, manage board membership)
- Member (standard board access — CRUD on own tasks)
- Viewer (read-only board access)
- External Systems (CI/CD pipelines, Slack bots, dashboards — consume webhooks and API)
- Company SSO (external auth provider — issues JWTs)

**System Boundaries**:
- IN: RESTful JSON:API endpoints, webhook delivery, JWT auth verification, PostgreSQL persistence
- OUT: Frontend/UI, email notifications, file attachments, WebSocket real-time, multi-tenancy

**Phasing**:
- Phase 1 (MVP, 2 weeks): F1 Task CRUD, F2 Board Management, F3 Webhook Notifications
- Phase 2 (Must Have, +2 weeks): F4 Search and Filtering
- Phase 3 (Nice to Have): F5 Activity Log

**Constraints**: Node.js v20+, Express, PostgreSQL 16, TypeScript, JWT auth from company SSO, Docker/K8s deployment, JSON:API format, 100 req/min rate limit, max 10,000 tasks per board.

**Success Criteria**: p95 response < 200ms under 50 concurrent users, 99.5% uptime, zero data loss on mutations, >99% webhook delivery within retry window.

## 3. Refined PRD Summary

TaskFlow API is an internal RESTful service (JSON:API format) enabling engineers to programmatically create, read, update, and delete tasks organized into Kanban-style boards. The service authenticates users via JWT tokens issued by the company SSO. Three roles (Admin, Member, Viewer) govern access. Webhook notifications are dispatched on task state changes with HMAC-signed payloads and exponential-backoff retry. Phase 2 adds full-text search and filtered querying. Phase 3 adds an immutable 90-day activity log.

[ASSUMPTION] "Member" role can create tasks and edit/delete their own tasks but cannot delete other users' tasks.
[ASSUMPTION] "Viewer" role has read-only access and cannot create, update, or delete tasks.
[ASSUMPTION] Board invitation requires specifying one of the three roles (Admin, Member, Viewer).
[ASSUMPTION] Full-text search uses PostgreSQL built-in tsvector/tsquery capabilities.
[ASSUMPTION] Webhook HMAC signing uses SHA-256.
[ASSUMPTION] Rate limiting returns HTTP 429 with a Retry-After header.
[ASSUMPTION] Soft-deleted tasks are excluded from normal queries but retrievable by Admin.

---

## 4. User Stories

### Phase 1 — MVP: Task CRUD (F1)

#### US-001-001: Create a Task

**As a** board Member,
**I want to** create a task on a board with a title, optional description, status, priority, assignee, due date, and tags,
**So that** I can track work items programmatically instead of using spreadsheets.

- **Priority**: P0
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-001-001-01**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a POST request to `/boards/{boardId}/tasks` with a valid title (1-200 characters), status "todo", and priority "P1"
THEN the API returns HTTP 201 with the created task resource including a server-generated UUID, `created_at` timestamp, and all provided fields

**AC-001-001-02**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a POST request to `/boards/{boardId}/tasks` with a title exceeding 200 characters
THEN the API returns HTTP 422 with an error object containing field "title" and message "Title must not exceed 200 characters"

**AC-001-001-03**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a POST request to `/boards/{boardId}/tasks` without a title field
THEN the API returns HTTP 422 with an error object containing field "title" and message "Title is required"

**AC-001-001-04**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a POST request to `/boards/{boardId}/tasks` with more than 10 tags
THEN the API returns HTTP 422 with an error object containing field "tags" and message "Maximum 10 tags allowed"

**AC-001-001-05**:
GIVEN a user with Viewer role on a board
WHEN the Viewer sends a POST request to `/boards/{boardId}/tasks`
THEN the API returns HTTP 403 with an error message "Insufficient permissions to create tasks"

---

#### US-001-002: Read Tasks

**As a** board Member or Viewer,
**I want to** retrieve a single task by ID or list all tasks on a board,
**So that** I can view current task status and details programmatically.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-001-002-01**:
GIVEN a Member is authenticated and belongs to a board with 5 existing tasks
WHEN the Member sends a GET request to `/boards/{boardId}/tasks`
THEN the API returns HTTP 200 with an array of 5 task resources, each containing id, title, status, priority, assignee, due_date, tags, created_at, and updated_at

**AC-001-002-02**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a GET request to `/boards/{boardId}/tasks/{taskId}` with a valid task ID
THEN the API returns HTTP 200 with the complete task resource

**AC-001-002-03**:
GIVEN a Member is authenticated and belongs to a board
WHEN the Member sends a GET request to `/boards/{boardId}/tasks/{taskId}` with a non-existent task ID
THEN the API returns HTTP 404 with an error message "Task not found"

**AC-001-002-04**:
GIVEN a task has been soft-deleted (has a `deleted_at` timestamp)
WHEN a Member sends a GET request to `/boards/{boardId}/tasks`
THEN the soft-deleted task is excluded from the results

---

#### US-001-003: Update a Task

**As a** board Member,
**I want to** update task fields (title, description, status, priority, assignee, due date, tags),
**So that** I can keep task information current as work progresses.

- **Priority**: P0
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-001-003-01**:
GIVEN a Member is authenticated and a task exists on their board with status "todo"
WHEN the Member sends a PATCH request to `/boards/{boardId}/tasks/{taskId}` with `{"status": "in_progress"}`
THEN the API returns HTTP 200 with the updated task resource showing status "in_progress" and an updated `updated_at` timestamp

**AC-001-003-02**:
GIVEN a Member is authenticated and a task exists on their board
WHEN the Member sends a PATCH request with a title exceeding 200 characters
THEN the API returns HTTP 422 with an error object containing field "title" and message "Title must not exceed 200 characters"

**AC-001-003-03**:
GIVEN a Member is authenticated and a task exists on their board
WHEN the Member sends a PATCH request with an invalid priority value "P5"
THEN the API returns HTTP 422 with an error object containing field "priority" and message "Priority must be one of: P0, P1, P2, P3"

**AC-001-003-04**:
GIVEN a Viewer is authenticated and a task exists on the board
WHEN the Viewer sends a PATCH request to update the task
THEN the API returns HTTP 403 with an error message "Insufficient permissions to update tasks"

---

#### US-001-004: Delete a Task (Soft Delete)

**As a** task creator or Admin,
**I want to** soft-delete a task by setting a `deleted_at` timestamp,
**So that** deleted tasks can be recovered if needed while being hidden from normal views.

- **Priority**: P1
- **Story Points**: 3
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-001-004-01**:
GIVEN a Member is authenticated and is the creator of a task
WHEN the Member sends a DELETE request to `/boards/{boardId}/tasks/{taskId}`
THEN the API returns HTTP 200, the task's `deleted_at` field is set to the current UTC timestamp, and the task no longer appears in GET listing queries

**AC-001-004-02**:
GIVEN an Admin is authenticated and a task exists on the board created by another user
WHEN the Admin sends a DELETE request to `/boards/{boardId}/tasks/{taskId}`
THEN the API returns HTTP 200, the task's `deleted_at` field is set, and the task no longer appears in GET listing queries

**AC-001-004-03**:
GIVEN a Member is authenticated and is NOT the creator of the task and does NOT have Admin role
WHEN the Member sends a DELETE request to `/boards/{boardId}/tasks/{taskId}`
THEN the API returns HTTP 403 with an error message "Only the task creator or an Admin can delete tasks"

---

### Phase 1 — MVP: Board Management (F2)

#### US-002-001: Create a Board

**As an** authenticated user,
**I want to** create a new board with a name, optional description, and default columns,
**So that** I can organize tasks into logical groupings.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-002-001-01**:
GIVEN an authenticated user
WHEN the user sends a POST request to `/boards` with name "Sprint 42" and no columns specified
THEN the API returns HTTP 201 with a board resource containing the name "Sprint 42", default columns ["todo", "in_progress", "review", "done"], and the requesting user set as owner

**AC-002-001-02**:
GIVEN an authenticated user
WHEN the user sends a POST request to `/boards` with name exceeding 100 characters
THEN the API returns HTTP 422 with an error object containing field "name" and message "Board name must not exceed 100 characters"

**AC-002-001-03**:
GIVEN an authenticated user
WHEN the user sends a POST request to `/boards` with custom columns containing only 1 column
THEN the API returns HTTP 422 with an error message "A board must have at least 2 columns"

**AC-002-001-04**:
GIVEN an unauthenticated request (missing or invalid JWT)
WHEN the request sends a POST to `/boards`
THEN the API returns HTTP 401 with an error message "Authentication required"

---

#### US-002-002: Manage Board Membership

**As a** board owner or Admin,
**I want to** invite users to a board and assign them a role (Admin, Member, or Viewer),
**So that** I can control who has access to the board and what they can do.

- **Priority**: P0
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-002-002-01**:
GIVEN a board owner is authenticated
WHEN the owner sends a POST request to `/boards/{boardId}/members` with a valid user ID and role "Member"
THEN the API returns HTTP 201 with the membership resource showing the user ID and role "Member"

**AC-002-002-02**:
GIVEN a board owner is authenticated
WHEN the owner sends a POST request to `/boards/{boardId}/members` with an invalid role "SuperAdmin"
THEN the API returns HTTP 422 with an error message "Role must be one of: Admin, Member, Viewer"

**AC-002-002-03**:
GIVEN a Member (non-owner, non-Admin) is authenticated on a board
WHEN the Member sends a POST request to `/boards/{boardId}/members` to invite another user
THEN the API returns HTTP 403 with an error message "Only board owners and Admins can manage membership"

**AC-002-002-04**:
GIVEN a board owner is authenticated
WHEN the owner sends a POST request to invite a user who is already a member of the board
THEN the API returns HTTP 409 with an error message "User is already a member of this board"

---

#### US-002-003: Customize Board Columns

**As a** board owner or Admin,
**I want to** rename, add, remove, or reorder the columns on a board,
**So that** the board workflow matches my team's process.

- **Priority**: P1
- **Story Points**: 3
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-002-003-01**:
GIVEN a board owner is authenticated and the board has columns ["todo", "in_progress", "review", "done"]
WHEN the owner sends a PATCH request to `/boards/{boardId}` with columns ["backlog", "in_progress", "testing", "deployed"]
THEN the API returns HTTP 200 with the updated board showing the new column names in the specified order

**AC-002-003-02**:
GIVEN a board owner is authenticated
WHEN the owner sends a PATCH request with columns containing only 1 column
THEN the API returns HTTP 422 with an error message "A board must have at least 2 columns"

**AC-002-003-03**:
GIVEN a board owner is authenticated and tasks exist in the "review" column
WHEN the owner sends a PATCH request removing the "review" column
THEN the API returns HTTP 409 with an error message "Cannot remove column 'review' -- 1 or more tasks are assigned to it" [ASSUMPTION]

---

### Phase 1 — MVP: Webhook Notifications (F3)

#### US-003-001: Configure Webhooks

**As a** board owner or Admin,
**I want to** register a webhook URL with an HMAC secret for a board,
**So that** external systems can receive notifications when tasks change.

- **Priority**: P0
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-003-001-01**:
GIVEN a board owner is authenticated
WHEN the owner sends a POST request to `/boards/{boardId}/webhooks` with a valid HTTPS URL and a secret string
THEN the API returns HTTP 201 with the webhook resource containing the URL, a masked secret, and the list of subscribed events (default: all events)

**AC-003-001-02**:
GIVEN a board owner is authenticated
WHEN the owner sends a POST request to `/boards/{boardId}/webhooks` with an invalid URL format
THEN the API returns HTTP 422 with an error message "Webhook URL must be a valid HTTPS URL" [ASSUMPTION]

**AC-003-001-03**:
GIVEN a Member (non-owner, non-Admin) is authenticated
WHEN the Member sends a POST request to `/boards/{boardId}/webhooks`
THEN the API returns HTTP 403 with an error message "Only board owners and Admins can configure webhooks"

---

#### US-003-002: Deliver Webhook Notifications

**As an** external system consumer,
**I want to** receive HMAC-signed webhook payloads when task events occur,
**So that** I can react to task changes in CI/CD pipelines, Slack bots, or dashboards.

- **Priority**: P0
- **Story Points**: 8
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-003-002-01**:
GIVEN a webhook is configured for a board with URL "https://example.com/hook" and secret "s3cret"
WHEN a task on the board transitions from status "todo" to "in_progress"
THEN the system sends an HTTP POST to "https://example.com/hook" with a JSON payload containing event type "task.status_changed", a snapshot of the task, the actor's user ID, and an ISO 8601 timestamp, with an `X-Signature-256` header containing the HMAC-SHA256 digest of the payload [ASSUMPTION: SHA-256]

**AC-003-002-02**:
GIVEN a webhook is configured for a board and the webhook endpoint returns HTTP 500
WHEN the initial delivery attempt fails
THEN the system retries delivery 3 times with exponential backoff delays of 1 second, 4 seconds, and 16 seconds

**AC-003-002-03**:
GIVEN a webhook is configured for a board and all 4 delivery attempts (1 initial + 3 retries) fail
WHEN the final retry returns a non-2xx status code
THEN the system marks the delivery as "failed" and logs the failure with the HTTP status code and response body (truncated to 1KB) [ASSUMPTION]

**AC-003-002-04**:
GIVEN a webhook is configured and a task is created on the board
WHEN the task creation is persisted
THEN the system dispatches a webhook event with event type "task.created" containing the full task snapshot

---

### Phase 2 — Must Have: Search and Filtering (F4)

#### US-004-001: Search Tasks by Text

**As a** board Member or Viewer,
**I want to** perform full-text search on task titles and descriptions across boards I have access to,
**So that** I can quickly find relevant tasks without browsing each board manually.

- **Priority**: P1
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-004-001-01**:
GIVEN a Member has access to 2 boards containing 10 tasks, 3 of which have the word "migration" in their title or description
WHEN the Member sends a GET request to `/tasks/search?q=migration`
THEN the API returns HTTP 200 with exactly 3 task resources from the boards the Member has access to

**AC-004-001-02**:
GIVEN a Member has access to boards
WHEN the Member sends a GET request to `/tasks/search?q=xyznonexistent`
THEN the API returns HTTP 200 with an empty results array and total count of 0

**AC-004-001-03**:
GIVEN a Member has access to Board A but NOT Board B, and Board B contains a task with title "secret-migration"
WHEN the Member sends a GET request to `/tasks/search?q=secret-migration`
THEN the API returns HTTP 200 with an empty results array (the task on Board B is excluded)

---

#### US-004-002: Filter and Sort Tasks

**As a** board Member or Viewer,
**I want to** filter tasks by status, priority, assignee, tags, due date range, and board, and sort results by created_at, updated_at, due_date, or priority,
**So that** I can narrow down task lists to the information I need.

- **Priority**: P1
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-004-002-01**:
GIVEN a Member has access to a board with 20 tasks, 5 of which have priority "P0"
WHEN the Member sends a GET request to `/tasks/search?priority=P0`
THEN the API returns HTTP 200 with exactly 5 task resources all having priority "P0"

**AC-004-002-02**:
GIVEN a Member has access to a board with 50 tasks
WHEN the Member sends a GET request to `/tasks/search?page[size]=20&page[number]=1`
THEN the API returns HTTP 200 with 20 task resources and pagination metadata showing total count 50, page size 20, current page 1, and total pages 3

**AC-004-002-03**:
GIVEN a Member has access to a board with tasks
WHEN the Member sends a GET request to `/tasks/search?page[size]=200`
THEN the API returns HTTP 422 with an error message "Page size must not exceed 100"

**AC-004-002-04**:
GIVEN a Member has access to a board with tasks having due dates ranging from 2026-03-01 to 2026-03-31
WHEN the Member sends a GET request to `/tasks/search?due_date_from=2026-03-10&due_date_to=2026-03-20&sort=due_date`
THEN the API returns HTTP 200 with only tasks having due dates between 2026-03-10 and 2026-03-20, sorted by due_date ascending

---

### Phase 3 — Nice to Have: Activity Log (F5)

#### US-005-001: Record Activity Log

**As a** board Member or Viewer,
**I want to** retrieve an immutable activity log for a task or board showing who did what and when, including before/after values,
**So that** I can audit changes and understand the history of a task.

- **Priority**: P2
- **Story Points**: 5
- **INVEST**: Compliant

**Acceptance Criteria:**

**AC-005-001-01**:
GIVEN a task exists and has been updated 3 times (status changed twice, assignee changed once)
WHEN a Member sends a GET request to `/boards/{boardId}/tasks/{taskId}/activity`
THEN the API returns HTTP 200 with 4 activity entries (1 creation + 3 updates) each containing actor user ID, action type, timestamp, and before/after values for changed fields, ordered by timestamp descending

**AC-005-001-02**:
GIVEN activity log entries exist for a board
WHEN a Member sends a GET request to `/boards/{boardId}/activity`
THEN the API returns HTTP 200 with paginated activity entries across all tasks on the board

**AC-005-001-03**:
GIVEN an activity log entry was created 91 days ago
WHEN the system's daily retention job runs
THEN the activity log entry older than 90 days is permanently deleted from the database

---

## 5. Non-Functional Requirements

### Performance

**NFR-001-001**: API Response Time
- **Metric**: p95 response time for all API endpoints
- **Target**: < 200ms under 50 concurrent users
- **Measurement**: Application Performance Monitoring (APM) via structured logging of request duration

**NFR-001-002**: Throughput
- **Metric**: Sustained request throughput
- **Target**: 100 requests/minute per user without HTTP 429 responses [PROPOSED DEFAULT: aggregate throughput of 500 req/s across all users]
- **Measurement**: Load test with locust simulating 50 concurrent users

### Security

**NFR-002-001**: Authentication
- **Requirement**: All API endpoints (except health check) require a valid JWT token issued by company SSO
- **Standard**: JWT verification using RS256 algorithm with SSO's public key [ASSUMPTION]
- **Threshold**: 100% of unauthenticated requests receive HTTP 401 within 10ms

**NFR-002-002**: Authorization
- **Requirement**: Role-based access control enforced at every endpoint -- Admin, Member, Viewer
- **Standard**: Middleware-level RBAC check before controller logic
- **Threshold**: 100% of unauthorized requests receive HTTP 403; zero privilege escalation paths

**NFR-002-003**: Webhook Security
- **Requirement**: All webhook payloads are signed using HMAC-SHA256 with the board's webhook secret
- **Standard**: Signature transmitted in `X-Signature-256` header [ASSUMPTION]
- **Threshold**: 100% of webhook deliveries include a valid HMAC signature

**NFR-002-004**: Data Protection
- **Requirement**: Data encrypted in transit and at rest
- **Standard**: TLS 1.3 for API traffic; PostgreSQL transparent data encryption (TDE) or disk-level encryption for data at rest [PROPOSED DEFAULT]
- **Threshold**: Zero plaintext data transmitted over the network; all database storage encrypted

### Scalability

**NFR-003-001**: Task Volume
- **Metric**: Maximum tasks per board
- **Target**: 10,000 tasks per board with < 200ms p95 response time on list operations
- **Measurement**: Load test with a board containing 10,000 tasks

**NFR-003-002**: Concurrent Users
- **Metric**: Simultaneous authenticated users
- **Current**: 0 (new system)
- **Target**: 50 concurrent users with acceptable performance (NFR-001-001)
- **Measurement**: Load test simulating 50 concurrent users

### Reliability

**NFR-004-001**: Uptime
- **Metric**: Service availability
- **Target**: 99.5% uptime over any rolling 30-day period
- **Measurement**: Health check endpoint monitored at 30-second intervals

**NFR-004-002**: Data Integrity
- **Metric**: Data loss incidents on task mutations
- **Target**: Zero data loss -- all successful API responses correspond to persisted database state
- **Measurement**: Transactional writes with PostgreSQL ACID guarantees; write-ahead logging enabled

**NFR-004-003**: Webhook Delivery
- **Metric**: Webhook delivery success rate within the retry window (initial + 3 retries)
- **Target**: > 99% successful delivery
- **Measurement**: Webhook delivery status tracking with success/failure metrics

### Rate Limiting

**NFR-005-001**: Per-User Rate Limit
- **Metric**: Maximum API requests per user per minute
- **Target**: 100 requests/minute per authenticated user
- **Threshold**: Requests exceeding the limit receive HTTP 429 with `Retry-After` header [ASSUMPTION]; zero impact on other users' request processing
- **Measurement**: Rate limit counter per user ID using sliding window algorithm [PROPOSED DEFAULT]

### Maintainability

**NFR-006-001**: Code Coverage
- **Metric**: Automated test code coverage
- **Target**: >= 80% line coverage [PROPOSED DEFAULT]
- **Measurement**: Coverage report from `node:test` runner with c8 coverage tool

**NFR-006-002**: API Documentation
- **Metric**: Endpoint documentation completeness
- **Target**: 100% of endpoints documented in OpenAPI 3.1 specification [PROPOSED DEFAULT]
- **Measurement**: Automated OpenAPI spec validation
