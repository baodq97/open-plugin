# Requirements Analysis: TaskFlow API

## 1. PRD Parse Summary

| Section | Status | Notes |
|---------|--------|-------|
| Background | Present | Clear context: replacing spreadsheet tracking, ~3hrs/week waste |
| Problem Statement | Present | No API for task management, scattered status across tools |
| Proposed Solution | Present | RESTful API with CRUD, boards, webhooks, RBAC |
| Requirements (MVP) | Present | F1: Task CRUD, F2: Board Management, F3: Webhook Notifications |
| Requirements (Must Have) | Present | F4: Search and Filtering |
| Requirements (Nice to Have) | Present | F5: Activity Log |
| Constraints | Present | Tech stack, auth, deployment, API format, rate limiting, DB limits |
| Success Criteria | Present | p95 latency, uptime, data loss, webhook delivery |
| Out of Scope | Present | Frontend, email, attachments, WebSocket, multi-tenancy |

**Stakeholders/Actors Identified:**
- **User** (generic API consumer -- engineers, bot integrations)
- **Admin** (elevated permissions: delete tasks, manage boards)
- **Member** (standard board participant)
- **Viewer** (read-only board access)
- **Task Creator** (the user who created a specific task)
- **Board Owner** (the user who created a specific board)
- **System** (TaskFlow API service itself -- for webhooks, rate limiting)

**System Boundaries:**
- External SSO (JWT issuer) -- not built here
- Webhook consumers -- external systems receiving notifications
- CI/CD pipelines, Slack bots, dashboards -- downstream integrators

---

## 3. Refined PRD Summary

All vague terms have been disambiguated. Assumptions are marked with `[ASSUMPTION]`.

### F1: Task CRUD
- Users authenticated via JWT (issued by external SSO) can create, read, update, and soft-delete tasks.
- Task fields: title (required, 1-200 chars), description (optional, 0-5000 chars), status (enum: todo | in_progress | review | done), priority (enum: P0 | P1 | P2 | P3), assignee (nullable UUID referencing a user), due_date (nullable ISO 8601 date), tags (array of strings, 0-10 items, each tag max 50 chars `[ASSUMPTION]`).
- Each task belongs to exactly one board (board_id required on creation).
- Only the task creator (identified by user ID in JWT) or a user with Admin role on the board can soft-delete a task (sets `deleted_at` to current UTC timestamp).
- Soft-deleted tasks are excluded from default queries but retrievable via explicit filter `[ASSUMPTION]`.

### F2: Board Management
- Users can create, read, update boards.
- Board fields: name (required, 1-100 chars), description (optional, 0-2000 chars `[ASSUMPTION]`), columns (ordered array of status labels, default: ["todo", "in_progress", "review", "done"], minimum 2 columns, maximum 20 columns `[ASSUMPTION]`).
- The creating user becomes the Board Owner.
- Board Owners and Admins can invite users to a board and assign roles: Admin, Member, Viewer.
- Deleting a board is not specified in PRD `[ASSUMPTION: boards can be archived/soft-deleted by Owner or Admin]`.

### F3: Webhook Notifications
- Webhooks are configured per board: URL (valid HTTPS endpoint `[ASSUMPTION]`), secret (string for HMAC-SHA256 signing `[ASSUMPTION]`).
- Supported events: task.created, task.updated, task.status_changed, task.assigned, task.deleted.
- Payload: { event_type, task (full snapshot), actor (user who triggered), timestamp (ISO 8601) }.
- Failed deliveries (HTTP status outside 200-299 `[ASSUMPTION]`) retried exactly 3 times with exponential backoff: 1s, 4s, 16s.
- After 3 failed retries, the delivery is marked as failed and logged `[ASSUMPTION]`.

### F4: Search and Filtering
- Full-text search on task title and description fields across all boards the authenticated user has access to.
- Filters: status (multi-select `[ASSUMPTION]`), priority (multi-select `[ASSUMPTION]`), assignee (UUID), tags (AND/OR logic `[ASSUMPTION: AND by default]`), due_date_from/due_date_to (ISO 8601 date range), board_id (UUID).
- Pagination: default page size 20, max 100, cursor-based `[ASSUMPTION]`.
- Sort fields: created_at, updated_at, due_date, priority. Sort order: asc | desc, default desc `[ASSUMPTION]`.

### F5: Activity Log
- Every mutation on a task produces an immutable log entry.
- Entry fields: actor (user ID), action (enum: created | updated | status_changed | assigned | deleted), timestamp (ISO 8601), before (nullable JSON snapshot), after (JSON snapshot).
- Accessible via GET /tasks/{id}/activity and GET /boards/{id}/activity.
- Entries retained for 90 days; older entries are purged by a scheduled job `[ASSUMPTION]`.

### Constraints (Refined)
- Rate limiting: 100 requests per minute per authenticated user, enforced via sliding window `[ASSUMPTION]`.
- Database: Maximum 10,000 non-deleted tasks per board; creation rejected with HTTP 409 `[ASSUMPTION]` when limit reached.

---

## 4. User Stories

### Epic 1: Task CRUD (MVP -- F1)

**US-001-001**: Create a Task
As an authenticated Member or Admin of a board, I want to create a task with title, description, status, priority, assignee, due date, and tags so that I can track work items programmatically.

**US-001-002**: Read Tasks
As an authenticated user with any role on a board, I want to retrieve a single task by ID or list all tasks on a board so that I can view current work status.

**US-001-003**: Update a Task
As an authenticated Member or Admin of a board, I want to update any field on a task so that I can keep task information current.

**US-001-004**: Soft-Delete a Task
As the task creator or a board Admin, I want to soft-delete a task so that it is hidden from default views but recoverable.

**US-001-005**: Validate Task Input
As the system, I want to reject task creation or update requests with invalid data so that data integrity is maintained.

### Epic 2: Board Management (MVP -- F2)

**US-002-001**: Create a Board
As an authenticated user, I want to create a new board with a name, description, and default columns so that I can organize tasks.

**US-002-002**: Manage Board Membership
As a Board Owner or Admin, I want to invite users to my board and assign them a role (Admin, Member, Viewer) so that I can control access.

**US-002-003**: Customize Board Columns
As a Board Owner or Admin, I want to customize the column names and order on my board so that the workflow matches my team's process.

**US-002-004**: Read Board Details
As an authenticated user with any role on a board, I want to view board details including columns and members so that I understand the board's configuration.

### Epic 3: Webhook Notifications (MVP -- F3)

**US-003-001**: Configure Webhooks
As a Board Owner or Admin, I want to register a webhook URL and secret for my board so that external systems receive task event notifications.

**US-003-002**: Deliver Webhook Notifications
As the system, I want to send HMAC-signed webhook payloads to registered URLs when task events occur so that integrations stay synchronized.

**US-003-003**: Retry Failed Webhooks
As the system, I want to retry failed webhook deliveries 3 times with exponential backoff (1s, 4s, 16s) so that transient failures do not cause missed notifications.

### Epic 4: Search and Filtering (Must Have -- F4)

**US-004-001**: Search Tasks
As an authenticated user, I want to perform full-text search on task titles and descriptions across boards I have access to so that I can find relevant tasks quickly.

**US-004-002**: Filter and Sort Tasks
As an authenticated user, I want to filter tasks by status, priority, assignee, tags, due date range, and board, and sort results by created_at, updated_at, due_date, or priority so that I can narrow down results.

**US-004-003**: Paginate Search Results
As an authenticated user, I want search results paginated with configurable page size (default 20, max 100) so that large result sets are manageable.

### Epic 5: Activity Log (Nice to Have -- F5)

**US-005-001**: Record Task Activity
As the system, I want to create an immutable log entry for every task mutation recording actor, action, timestamp, and before/after state so that an audit trail exists.

**US-005-002**: Retrieve Activity Log
As an authenticated user, I want to retrieve the activity log for a specific task or board so that I can review the history of changes.

**US-005-003**: Purge Old Activity Entries
As the system, I want to automatically purge activity log entries older than 90 days so that storage is bounded.

---

## 5. Non-Functional Requirements

**NFR-001-001: API Response Time**
The API must respond within 200ms at the 95th percentile under 50 concurrent authenticated users performing a mix of CRUD, search, and webhook operations.
- Measurement: p95 latency measured via load test with k6 or similar tool.
- Threshold: p95 < 200ms.

**NFR-001-002: Service Availability**
The TaskFlow API must maintain 99.5% uptime over any rolling 30-day period.
- Measurement: Health check endpoint monitored every 60 seconds.
- Threshold: >= 99.5% availability (max ~3.6 hours downtime/month).

**NFR-001-003: Data Integrity**
Zero data loss on task mutations -- every successful API response (HTTP 2xx) must correspond to a committed database transaction.
- Measurement: Compare API success count vs. database record count in load test.
- Threshold: 0 discrepancies.

**NFR-001-004: Webhook Delivery Reliability**
Webhook delivery success rate must exceed 99% within the retry window (initial attempt + 3 retries).
- Measurement: (successful deliveries / total events) * 100 over a 24-hour test period.
- Threshold: > 99%.

**NFR-001-005: Rate Limiting**
The API must enforce a rate limit of 100 requests per minute per authenticated user using a sliding window algorithm `[PROPOSED DEFAULT]`.
- Measurement: Send 101 requests in 60 seconds from a single user; the 101st must receive HTTP 429.
- Threshold: 100% enforcement accuracy.

**NFR-001-006: Database Capacity**
Each board must support a maximum of 10,000 non-deleted tasks. Task creation must be rejected with an appropriate error when the limit is reached.
- Measurement: Create tasks until limit; verify rejection on task 10,001.
- Threshold: Rejection occurs at exactly 10,001.

**NFR-001-007: Security -- Authentication**
All API endpoints (except health check `[PROPOSED DEFAULT]`) must require a valid JWT token issued by the company SSO. Invalid or expired tokens must receive HTTP 401.
- Measurement: Request without token, with invalid token, with expired token.
- Threshold: 100% rejection of invalid auth.

**NFR-001-008: Security -- Authorization**
Role-based access control must enforce that Viewers cannot create/update/delete tasks, Members cannot delete others' tasks, and only Owners/Admins can manage board membership.
- Measurement: Attempt forbidden actions with each role.
- Threshold: 100% enforcement.

**NFR-001-009: Scalability -- Concurrent Users**
The system must handle 50 concurrent authenticated users without degradation below the p95 latency target.
- Measurement: Load test with 50 concurrent users for 10 minutes.
- Threshold: p95 < 200ms sustained. `[PROPOSED DEFAULT]`

**NFR-001-010: Maintainability -- Code Coverage**
All production code must have >= 80% line coverage from automated tests. `[PROPOSED DEFAULT]`
- Measurement: Coverage report from c8 / istanbul.
- Threshold: >= 80%.

---

## 6. Acceptance Criteria

### US-001-001: Create a Task

**AC-US-001-001-01** (Happy Path):
GIVEN an authenticated user with Member or Admin role on board "B1" and board "B1" has fewer than 10,000 non-deleted tasks
WHEN the user sends POST /boards/B1/tasks with body { title: "Fix login bug", status: "todo", priority: "P1" }
THEN the system creates the task, returns HTTP 201 with the task resource in JSON:API format including a generated UUID, created_at timestamp, and all provided fields

**AC-US-001-001-02** (Validation -- Missing Title):
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { status: "todo", priority: "P1" } (no title)
THEN the system returns HTTP 422 with error detail "title is required"

**AC-US-001-001-03** (Validation -- Title Too Long):
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { title: "[201-character string]", status: "todo" }
THEN the system returns HTTP 422 with error detail "title must not exceed 200 characters"

**AC-US-001-001-04** (Authorization -- Viewer Cannot Create):
GIVEN an authenticated user with Viewer role on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { title: "New task", status: "todo" }
THEN the system returns HTTP 403 with error detail "Viewers cannot create tasks"

**AC-US-001-001-05** (Board Task Limit):
GIVEN board "B1" already has 10,000 non-deleted tasks
WHEN an authenticated Member sends POST /boards/B1/tasks with valid data
THEN the system returns HTTP 409 with error detail "Board task limit of 10,000 reached"

### US-001-002: Read Tasks

**AC-US-001-002-01** (Get Single Task):
GIVEN an authenticated user with any role on board "B1" and task "T1" exists on board "B1"
WHEN the user sends GET /tasks/T1
THEN the system returns HTTP 200 with the full task resource in JSON:API format

**AC-US-001-002-02** (List Board Tasks):
GIVEN an authenticated user with any role on board "B1" and board "B1" has 3 non-deleted tasks
WHEN the user sends GET /boards/B1/tasks
THEN the system returns HTTP 200 with an array of 3 task resources in JSON:API format

**AC-US-001-002-03** (Task Not Found):
GIVEN an authenticated user with Viewer role on board "B1"
WHEN the user sends GET /tasks/nonexistent-uuid
THEN the system returns HTTP 404 with error detail "Task not found"

**AC-US-001-002-04** (Soft-Deleted Task Excluded):
GIVEN task "T1" on board "B1" has been soft-deleted (deleted_at is set)
WHEN an authenticated user sends GET /boards/B1/tasks without include_deleted filter
THEN the response does not include task "T1"

### US-001-003: Update a Task

**AC-US-001-003-01** (Happy Path):
GIVEN an authenticated user with Member role on board "B1" and task "T1" exists
WHEN the user sends PATCH /tasks/T1 with body { status: "in_progress" }
THEN the system updates the task status to "in_progress", sets updated_at to current UTC timestamp, and returns HTTP 200 with the updated task resource

**AC-US-001-003-02** (Invalid Status):
GIVEN an authenticated user with Member role on board "B1" and task "T1" exists
WHEN the user sends PATCH /tasks/T1 with body { status: "invalid_status" }
THEN the system returns HTTP 422 with error detail "status must be one of: todo, in_progress, review, done"

**AC-US-001-003-03** (Viewer Cannot Update):
GIVEN an authenticated user with Viewer role on board "B1" and task "T1" exists
WHEN the user sends PATCH /tasks/T1 with body { title: "New title" }
THEN the system returns HTTP 403 with error detail "Viewers cannot update tasks"

### US-001-004: Soft-Delete a Task

**AC-US-001-004-01** (Creator Deletes Own Task):
GIVEN an authenticated user who created task "T1" on board "B1"
WHEN the user sends DELETE /tasks/T1
THEN the system sets deleted_at to current UTC timestamp and returns HTTP 200 with confirmation

**AC-US-001-004-02** (Admin Deletes Any Task):
GIVEN an authenticated user with Admin role on board "B1" and task "T1" was created by another user
WHEN the user sends DELETE /tasks/T1
THEN the system sets deleted_at to current UTC timestamp and returns HTTP 200 with confirmation

**AC-US-001-004-03** (Non-Creator Member Cannot Delete):
GIVEN an authenticated user with Member role on board "B1" who did NOT create task "T1"
WHEN the user sends DELETE /tasks/T1
THEN the system returns HTTP 403 with error detail "Only the task creator or a board Admin can delete tasks"

### US-001-005: Validate Task Input

**AC-US-001-005-01** (Tags Limit):
GIVEN an authenticated Member on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { title: "Test", tags: ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"] } (11 tags)
THEN the system returns HTTP 422 with error detail "tags must not exceed 10 items"

**AC-US-001-005-02** (Invalid Priority):
GIVEN an authenticated Member on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { title: "Test", priority: "P5" }
THEN the system returns HTTP 422 with error detail "priority must be one of: P0, P1, P2, P3"

**AC-US-001-005-03** (Description Too Long):
GIVEN an authenticated Member on board "B1"
WHEN the user sends POST /boards/B1/tasks with body { title: "Test", description: "[5001-character string]" }
THEN the system returns HTTP 422 with error detail "description must not exceed 5000 characters"

### US-002-001: Create a Board

**AC-US-002-001-01** (Happy Path):
GIVEN an authenticated user
WHEN the user sends POST /boards with body { name: "Sprint 42", description: "Q2 sprint board" }
THEN the system creates the board with default columns ["todo", "in_progress", "review", "done"], assigns the user as Board Owner, and returns HTTP 201 with the board resource

**AC-US-002-001-02** (Custom Columns):
GIVEN an authenticated user
WHEN the user sends POST /boards with body { name: "Custom", columns: ["backlog", "doing", "done"] }
THEN the system creates the board with the 3 specified columns and returns HTTP 201

**AC-US-002-001-03** (Too Few Columns):
GIVEN an authenticated user
WHEN the user sends POST /boards with body { name: "Bad Board", columns: ["only_one"] }
THEN the system returns HTTP 422 with error detail "boards must have at least 2 columns"

### US-002-002: Manage Board Membership

**AC-US-002-002-01** (Invite Member):
GIVEN an authenticated Board Owner of board "B1" and user "U2" is not a member
WHEN the Owner sends POST /boards/B1/members with body { user_id: "U2", role: "Member" }
THEN user "U2" is added to board "B1" with Member role and the system returns HTTP 201

**AC-US-002-002-02** (Viewer Cannot Invite):
GIVEN an authenticated user with Viewer role on board "B1"
WHEN the user sends POST /boards/B1/members with body { user_id: "U3", role: "Member" }
THEN the system returns HTTP 403 with error detail "Only Board Owners and Admins can manage membership"

**AC-US-002-002-03** (Change Member Role):
GIVEN an authenticated Admin on board "B1" and user "U2" has Member role
WHEN the Admin sends PATCH /boards/B1/members/U2 with body { role: "Admin" }
THEN user "U2" role is updated to Admin and the system returns HTTP 200

### US-002-003: Customize Board Columns

**AC-US-002-003-01** (Update Columns):
GIVEN an authenticated Board Owner of board "B1"
WHEN the Owner sends PATCH /boards/B1 with body { columns: ["backlog", "in_progress", "review", "done"] }
THEN the board columns are updated to the specified list in order and the system returns HTTP 200

**AC-US-002-003-02** (Below Minimum Columns):
GIVEN an authenticated Board Owner of board "B1"
WHEN the Owner sends PATCH /boards/B1 with body { columns: ["only_one"] }
THEN the system returns HTTP 422 with error detail "boards must have at least 2 columns"

**AC-US-002-003-03** (Member Cannot Customize):
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends PATCH /boards/B1 with body { columns: ["a", "b", "c"] }
THEN the system returns HTTP 403 with error detail "Only Board Owners and Admins can modify board settings"

### US-002-004: Read Board Details

**AC-US-002-004-01** (Happy Path):
GIVEN an authenticated user with any role on board "B1"
WHEN the user sends GET /boards/B1
THEN the system returns HTTP 200 with board details including name, description, columns, and member list

**AC-US-002-004-02** (Not a Member):
GIVEN an authenticated user who is not a member of board "B1"
WHEN the user sends GET /boards/B1
THEN the system returns HTTP 403 with error detail "You are not a member of this board"

**AC-US-002-004-03** (Board Not Found):
GIVEN an authenticated user
WHEN the user sends GET /boards/nonexistent-uuid
THEN the system returns HTTP 404 with error detail "Board not found"

### US-003-001: Configure Webhooks

**AC-US-003-001-01** (Register Webhook):
GIVEN an authenticated Board Owner or Admin on board "B1"
WHEN the user sends POST /boards/B1/webhooks with body { url: "https://example.com/hook", secret: "mysecret" }
THEN the system registers the webhook and returns HTTP 201 with the webhook resource

**AC-US-003-001-02** (Invalid URL):
GIVEN an authenticated Board Owner on board "B1"
WHEN the user sends POST /boards/B1/webhooks with body { url: "not-a-url", secret: "mysecret" }
THEN the system returns HTTP 422 with error detail "url must be a valid HTTPS URL"

**AC-US-003-001-03** (Member Cannot Configure):
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends POST /boards/B1/webhooks with body { url: "https://example.com/hook", secret: "s" }
THEN the system returns HTTP 403 with error detail "Only Board Owners and Admins can configure webhooks"

### US-003-002: Deliver Webhook Notifications

**AC-US-003-002-01** (Task Created Event):
GIVEN board "B1" has a registered webhook at "https://example.com/hook" with secret "s1"
WHEN a task is created on board "B1"
THEN the system sends a POST request to "https://example.com/hook" with JSON body { event: "task.created", task: {snapshot}, actor: {user}, timestamp: "ISO8601" } and an X-Signature header containing HMAC-SHA256 of the body using "s1"

**AC-US-003-002-02** (Status Changed Event):
GIVEN board "B1" has a registered webhook and task "T1" status changes from "todo" to "in_progress"
WHEN the status update is committed
THEN the system sends a webhook with event "task.status_changed" including the updated task snapshot

**AC-US-003-002-03** (No Webhook Configured):
GIVEN board "B1" has no registered webhooks
WHEN a task is created on board "B1"
THEN no webhook delivery is attempted and no error is raised

### US-003-003: Retry Failed Webhooks

**AC-US-003-003-01** (Retry on Failure):
GIVEN a webhook delivery to "https://example.com/hook" returns HTTP 500
WHEN the initial delivery fails
THEN the system retries after 1 second, then after 4 seconds, then after 16 seconds (3 total retries)

**AC-US-003-003-02** (Success on Retry):
GIVEN a webhook delivery fails on the first attempt but succeeds on the second retry
WHEN the second retry returns HTTP 200
THEN the delivery is marked as successful and no further retries occur

**AC-US-003-003-03** (All Retries Exhausted):
GIVEN a webhook delivery fails on all 4 attempts (initial + 3 retries)
WHEN the final retry fails
THEN the delivery is marked as permanently failed and logged for monitoring

### US-004-001: Search Tasks

**AC-US-004-001-01** (Full-Text Match):
GIVEN the user has access to boards with tasks titled "Fix login bug" and "Update dashboard"
WHEN the user sends GET /tasks/search?q=login
THEN the system returns tasks with "login" in title or description, paginated, HTTP 200

**AC-US-004-001-02** (No Results):
GIVEN the user has access to boards with 5 tasks, none containing "xyz123"
WHEN the user sends GET /tasks/search?q=xyz123
THEN the system returns HTTP 200 with an empty data array and pagination metadata showing total_count: 0

**AC-US-004-001-03** (Cross-Board Search):
GIVEN the user is a Member of board "B1" and "B2" but not "B3"
WHEN the user sends GET /tasks/search?q=deploy
THEN results include matching tasks from B1 and B2 only, not B3

### US-004-002: Filter and Sort Tasks

**AC-US-004-002-01** (Filter by Status):
GIVEN boards with tasks in various statuses
WHEN the user sends GET /tasks/search?status=in_progress
THEN only tasks with status "in_progress" are returned

**AC-US-004-002-02** (Sort by Priority):
GIVEN multiple tasks with different priorities
WHEN the user sends GET /tasks/search?sort=priority&order=asc
THEN tasks are returned sorted by priority P0 first, P3 last

**AC-US-004-002-03** (Combined Filters):
GIVEN multiple tasks across boards
WHEN the user sends GET /tasks/search?status=todo&priority=P0&assignee=U1&sort=due_date
THEN only tasks matching ALL filter criteria are returned, sorted by due_date

### US-004-003: Paginate Search Results

**AC-US-004-003-01** (Default Page Size):
GIVEN 50 tasks matching the search query
WHEN the user sends GET /tasks/search?q=test without a page_size parameter
THEN the system returns the first 20 results with pagination metadata including total_count: 50

**AC-US-004-003-02** (Custom Page Size):
GIVEN 50 tasks matching the search query
WHEN the user sends GET /tasks/search?q=test&page_size=10
THEN the system returns 10 results per page

**AC-US-004-003-03** (Max Page Size Enforcement):
GIVEN tasks matching a search query
WHEN the user sends GET /tasks/search?q=test&page_size=200
THEN the system caps the page size at 100 and returns at most 100 results

### US-005-001: Record Task Activity

**AC-US-005-001-01** (Log on Create):
GIVEN an authenticated user creates task "T1"
WHEN the creation succeeds
THEN an activity log entry is recorded with action "created", actor as the user ID, timestamp, before: null, after: task snapshot

**AC-US-005-001-02** (Log on Update):
GIVEN task "T1" has status "todo"
WHEN an authenticated user updates status to "in_progress"
THEN an activity log entry is recorded with action "status_changed", before: { status: "todo" }, after: { status: "in_progress" }

**AC-US-005-001-03** (Immutability):
GIVEN an activity log entry exists for task "T1"
WHEN any user sends a request to modify or delete the log entry
THEN the system returns HTTP 405 with error detail "Activity log entries are immutable"

### US-005-002: Retrieve Activity Log

**AC-US-005-002-01** (Per-Task Log):
GIVEN task "T1" has 5 activity log entries
WHEN an authenticated user sends GET /tasks/T1/activity
THEN the system returns HTTP 200 with all 5 entries sorted by timestamp descending

**AC-US-005-002-02** (Per-Board Log):
GIVEN board "B1" has tasks with a combined 20 activity log entries
WHEN an authenticated user sends GET /boards/B1/activity
THEN the system returns HTTP 200 with all 20 entries sorted by timestamp descending

**AC-US-005-002-03** (Unauthorized Access):
GIVEN an authenticated user is not a member of board "B1"
WHEN the user sends GET /boards/B1/activity
THEN the system returns HTTP 403

### US-005-003: Purge Old Activity Entries

**AC-US-005-003-01** (Auto-Purge After 90 Days):
GIVEN activity log entries exist with timestamps older than 90 days
WHEN the scheduled purge job runs
THEN all entries older than 90 days are permanently deleted

**AC-US-005-003-02** (Recent Entries Preserved):
GIVEN activity log entries exist with timestamps within the last 90 days
WHEN the scheduled purge job runs
THEN all entries within 90 days are preserved

**AC-US-005-003-03** (Purge Boundary):
GIVEN an activity log entry has a timestamp exactly 90 days ago
WHEN the scheduled purge job runs
THEN the entry is preserved (purge applies to entries strictly older than 90 days) `[ASSUMPTION]`

---

## 10. Assumptions & Open Questions

### Assumptions Made

| ID | Assumption | Location | Impact |
|----|-----------|----------|--------|
| A1 | Each tag has a maximum length of 50 characters | F1: Task CRUD | Low -- standard string limit |
| A2 | Board description has max 2000 characters | F2: Board Management | Low |
| A3 | Maximum 20 columns per board | F2: Board Management | Low |
| A4 | Boards can be archived/soft-deleted by Owner or Admin | F2: Board Management | Medium -- not in PRD |
| A5 | Webhook URLs must use HTTPS | F3: Webhooks | Medium -- security concern |
| A6 | HMAC uses SHA-256 algorithm | F3: Webhooks | Low -- standard choice |
| A7 | Failed delivery = HTTP status outside 200-299 | F3: Webhooks | Low |
| A8 | After 3 failed retries, delivery is logged as failed | F3: Webhooks | Low |
| A9 | Filter tags use AND logic by default | F4: Search | Medium |
| A10 | Cursor-based pagination | F4: Search | Medium -- affects API design |
| A11 | Default sort order is descending | F4: Search | Low |
| A12 | Rate limiting uses sliding window algorithm | Constraints | Low |
| A13 | Task limit rejection returns HTTP 409 | Constraints | Low |
| A14 | Soft-deleted tasks retrievable via explicit filter | F1: Task CRUD | Medium |
| A15 | Purge boundary is strictly older than 90 days | F5: Activity Log | Low |

### Open Questions

1. Should board deletion cascade-delete all tasks, or only allow deletion when the board is empty?
2. Can a Board Owner transfer ownership to another user?
3. Should webhook configuration support event filtering (subscribe to specific event types)?
4. What is the maximum number of webhooks per board?
5. Should search support advanced operators (AND, OR, NOT, exact phrase)?
6. What happens to tasks when their assignee is removed from the board?
