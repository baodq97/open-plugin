# Test Skeletons: TaskFlow API

Generated during Requirements phase (Continuous Test Creation). Every acceptance criterion has exactly one corresponding test skeleton.

---

## Phase 1 — MVP: Task CRUD (F1)

### US-001-001: Create a Task

**Test ID**: T-AC-001-001-01
**Title**: Should create task with valid fields and return 201 when Member posts to board
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Member user; board exists; user is a member of the board
**Steps**:
  1. Send POST `/boards/{boardId}/tasks` with body `{ title: "Fix login bug", status: "todo", priority: "P1" }`
**Expected Result**: HTTP 201; response contains task resource with server-generated UUID, `created_at` timestamp, title "Fix login bug", status "todo", priority "P1"
**Test Data**: Valid JWT for Member; existing board ID; task payload with title (1-200 chars), status "todo", priority "P1"
**Automation Notes**: Use `node:test` with `supertest` for HTTP assertions against Express app
**Linked AC**: AC-001-001-01

---

**Test ID**: T-AC-001-001-02
**Title**: Should reject task creation with 422 when title exceeds 200 characters
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated Member user; board exists; user is a member of the board
**Steps**:
  1. Send POST `/boards/{boardId}/tasks` with body `{ title: "<201-character string>" }`
**Expected Result**: HTTP 422; error object with field "title" and message "Title must not exceed 200 characters"
**Test Data**: Valid JWT for Member; title string of exactly 201 characters
**Automation Notes**: Use `node:test` with `supertest`; verify JSON:API error format
**Linked AC**: AC-001-001-02

---

**Test ID**: T-AC-001-001-03
**Title**: Should reject task creation with 422 when title is missing
**Type**: Integration
**Priority**: P0-Critical
**Category**: negative
**Preconditions**: Authenticated Member user; board exists; user is a member of the board
**Steps**:
  1. Send POST `/boards/{boardId}/tasks` with body `{ status: "todo" }` (no title field)
**Expected Result**: HTTP 422; error object with field "title" and message "Title is required"
**Test Data**: Valid JWT for Member; task payload missing title
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-001-03

---

**Test ID**: T-AC-001-001-04
**Title**: Should reject task creation with 422 when more than 10 tags are provided
**Type**: Integration
**Priority**: P2-Medium
**Category**: edge
**Preconditions**: Authenticated Member user; board exists; user is a member of the board
**Steps**:
  1. Send POST `/boards/{boardId}/tasks` with body `{ title: "Test", tags: ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"] }`
**Expected Result**: HTTP 422; error object with field "tags" and message "Maximum 10 tags allowed"
**Test Data**: Valid JWT for Member; 11 tag strings
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-001-04

---

**Test ID**: T-AC-001-001-05
**Title**: Should reject task creation with 403 when Viewer attempts to create a task
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Authenticated Viewer user; board exists; user has Viewer role on the board
**Steps**:
  1. Send POST `/boards/{boardId}/tasks` with valid task payload as Viewer
**Expected Result**: HTTP 403; error message "Insufficient permissions to create tasks"
**Test Data**: Valid JWT for Viewer; valid task payload
**Automation Notes**: Use `node:test` with `supertest`; test RBAC middleware
**Linked AC**: AC-001-001-05

---

### US-001-002: Read Tasks

**Test ID**: T-AC-001-002-01
**Title**: Should return all tasks on a board when Member sends GET request
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Member user; board exists with 5 tasks; user is a member
**Steps**:
  1. Send GET `/boards/{boardId}/tasks`
**Expected Result**: HTTP 200; JSON array of 5 task resources each with id, title, status, priority, assignee, due_date, tags, created_at, updated_at
**Test Data**: Valid JWT for Member; board with 5 seeded tasks
**Automation Notes**: Use `node:test` with `supertest`; verify JSON:API collection format
**Linked AC**: AC-001-002-01

---

**Test ID**: T-AC-001-002-02
**Title**: Should return single task when Member sends GET with valid task ID
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Member user; board exists with a known task ID
**Steps**:
  1. Send GET `/boards/{boardId}/tasks/{taskId}`
**Expected Result**: HTTP 200; complete task resource with all fields
**Test Data**: Valid JWT for Member; known task ID
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-002-02

---

**Test ID**: T-AC-001-002-03
**Title**: Should return 404 when task ID does not exist
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated Member user; board exists
**Steps**:
  1. Send GET `/boards/{boardId}/tasks/{nonExistentId}`
**Expected Result**: HTTP 404; error message "Task not found"
**Test Data**: Valid JWT for Member; non-existent UUID
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-002-03

---

**Test ID**: T-AC-001-002-04
**Title**: Should exclude soft-deleted tasks from listing results
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated Member user; board exists; one task has been soft-deleted (deleted_at is set)
**Steps**:
  1. Send GET `/boards/{boardId}/tasks`
**Expected Result**: HTTP 200; soft-deleted task is not included in the response array
**Test Data**: Valid JWT for Member; board with a mix of active and soft-deleted tasks
**Automation Notes**: Use `node:test` with `supertest`; seed a soft-deleted task in test setup
**Linked AC**: AC-001-002-04

---

### US-001-003: Update a Task

**Test ID**: T-AC-001-003-01
**Title**: Should update task status and return 200 when Member sends valid PATCH
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Member user; task exists on the board with status "todo"
**Steps**:
  1. Send PATCH `/boards/{boardId}/tasks/{taskId}` with `{ status: "in_progress" }`
**Expected Result**: HTTP 200; task resource shows status "in_progress" and updated `updated_at` timestamp
**Test Data**: Valid JWT for Member; task ID with status "todo"
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-003-01

---

**Test ID**: T-AC-001-003-02
**Title**: Should reject update with 422 when title exceeds 200 characters
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated Member user; task exists on the board
**Steps**:
  1. Send PATCH `/boards/{boardId}/tasks/{taskId}` with `{ title: "<201-char string>" }`
**Expected Result**: HTTP 422; error object with field "title" and message "Title must not exceed 200 characters"
**Test Data**: Valid JWT for Member; 201-character title string
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-003-02

---

**Test ID**: T-AC-001-003-03
**Title**: Should reject update with 422 when priority value is invalid
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated Member user; task exists on the board
**Steps**:
  1. Send PATCH `/boards/{boardId}/tasks/{taskId}` with `{ priority: "P5" }`
**Expected Result**: HTTP 422; error object with field "priority" and message "Priority must be one of: P0, P1, P2, P3"
**Test Data**: Valid JWT for Member; invalid priority "P5"
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-003-03

---

**Test ID**: T-AC-001-003-04
**Title**: Should reject update with 403 when Viewer attempts to update a task
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Authenticated Viewer user; task exists on the board
**Steps**:
  1. Send PATCH `/boards/{boardId}/tasks/{taskId}` with `{ status: "done" }` as Viewer
**Expected Result**: HTTP 403; error message "Insufficient permissions to update tasks"
**Test Data**: Valid JWT for Viewer
**Automation Notes**: Use `node:test` with `supertest`; test RBAC middleware
**Linked AC**: AC-001-003-04

---

### US-001-004: Delete a Task (Soft Delete)

**Test ID**: T-AC-001-004-01
**Title**: Should soft-delete task when creator sends DELETE request
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Member user who created the task; task exists
**Steps**:
  1. Send DELETE `/boards/{boardId}/tasks/{taskId}` as the task creator
  2. Send GET `/boards/{boardId}/tasks` to verify exclusion
**Expected Result**: HTTP 200 on DELETE; task's `deleted_at` is set; task excluded from subsequent GET listing
**Test Data**: Valid JWT for task creator; task ID
**Automation Notes**: Use `node:test` with `supertest`; verify DB record has `deleted_at` set
**Linked AC**: AC-001-004-01

---

**Test ID**: T-AC-001-004-02
**Title**: Should allow Admin to soft-delete any task regardless of creator
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated Admin user; task exists created by a different user
**Steps**:
  1. Send DELETE `/boards/{boardId}/tasks/{taskId}` as Admin
**Expected Result**: HTTP 200; task's `deleted_at` is set; task excluded from GET listing
**Test Data**: Valid JWT for Admin; task created by another user
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-004-02

---

**Test ID**: T-AC-001-004-03
**Title**: Should reject delete with 403 when non-creator Member attempts deletion
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Authenticated Member user who is NOT the task creator and does NOT have Admin role
**Steps**:
  1. Send DELETE `/boards/{boardId}/tasks/{taskId}` as non-creator Member
**Expected Result**: HTTP 403; error message "Only the task creator or an Admin can delete tasks"
**Test Data**: Valid JWT for Member (non-creator); task created by another user
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-001-004-03

---

## Phase 1 — MVP: Board Management (F2)

### US-002-001: Create a Board

**Test ID**: T-AC-002-001-01
**Title**: Should create board with default columns when no columns specified
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated user
**Steps**:
  1. Send POST `/boards` with `{ name: "Sprint 42" }`
**Expected Result**: HTTP 201; board resource with name "Sprint 42", columns ["todo", "in_progress", "review", "done"], requesting user set as owner
**Test Data**: Valid JWT; board name "Sprint 42"
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-001-01

---

**Test ID**: T-AC-002-001-02
**Title**: Should reject board creation with 422 when name exceeds 100 characters
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated user
**Steps**:
  1. Send POST `/boards` with `{ name: "<101-char string>" }`
**Expected Result**: HTTP 422; error object with field "name" and message "Board name must not exceed 100 characters"
**Test Data**: Valid JWT; 101-character board name
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-001-02

---

**Test ID**: T-AC-002-001-03
**Title**: Should reject board creation with 422 when fewer than 2 columns specified
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated user
**Steps**:
  1. Send POST `/boards` with `{ name: "Test", columns: ["only_one"] }`
**Expected Result**: HTTP 422; error message "A board must have at least 2 columns"
**Test Data**: Valid JWT; single-column array
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-001-03

---

**Test ID**: T-AC-002-001-04
**Title**: Should reject board creation with 401 when JWT is missing or invalid
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: No JWT or invalid/expired JWT in request
**Steps**:
  1. Send POST `/boards` without Authorization header
**Expected Result**: HTTP 401; error message "Authentication required"
**Test Data**: No JWT or expired JWT string
**Automation Notes**: Use `node:test` with `supertest`; test auth middleware
**Linked AC**: AC-002-001-04

---

### US-002-002: Manage Board Membership

**Test ID**: T-AC-002-002-01
**Title**: Should add member with specified role when board owner invites user
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated board owner; target user exists and is not a member
**Steps**:
  1. Send POST `/boards/{boardId}/members` with `{ userId: "<targetId>", role: "Member" }`
**Expected Result**: HTTP 201; membership resource showing user ID and role "Member"
**Test Data**: Valid JWT for owner; target user ID; role "Member"
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-002-01

---

**Test ID**: T-AC-002-002-02
**Title**: Should reject membership with 422 when invalid role is specified
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated board owner
**Steps**:
  1. Send POST `/boards/{boardId}/members` with `{ userId: "<targetId>", role: "SuperAdmin" }`
**Expected Result**: HTTP 422; error message "Role must be one of: Admin, Member, Viewer"
**Test Data**: Valid JWT for owner; invalid role "SuperAdmin"
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-002-02

---

**Test ID**: T-AC-002-002-03
**Title**: Should reject membership invite with 403 when non-owner Member attempts it
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Authenticated Member (non-owner, non-Admin) on the board
**Steps**:
  1. Send POST `/boards/{boardId}/members` as non-owner Member
**Expected Result**: HTTP 403; error message "Only board owners and Admins can manage membership"
**Test Data**: Valid JWT for Member (non-owner)
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-002-03

---

**Test ID**: T-AC-002-002-04
**Title**: Should reject duplicate membership with 409 when user is already a member
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated board owner; target user is already a member of the board
**Steps**:
  1. Send POST `/boards/{boardId}/members` with `{ userId: "<existingMemberId>", role: "Member" }`
**Expected Result**: HTTP 409; error message "User is already a member of this board"
**Test Data**: Valid JWT for owner; user ID that already exists in board membership
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-002-04

---

### US-002-003: Customize Board Columns

**Test ID**: T-AC-002-003-01
**Title**: Should update board columns when owner sends valid PATCH
**Type**: Integration
**Priority**: P1-High
**Category**: positive
**Preconditions**: Authenticated board owner; board has default columns
**Steps**:
  1. Send PATCH `/boards/{boardId}` with `{ columns: ["backlog", "in_progress", "testing", "deployed"] }`
**Expected Result**: HTTP 200; board resource shows new column names in specified order
**Test Data**: Valid JWT for owner; new column array
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-003-01

---

**Test ID**: T-AC-002-003-02
**Title**: Should reject column update with 422 when fewer than 2 columns
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated board owner
**Steps**:
  1. Send PATCH `/boards/{boardId}` with `{ columns: ["only_one"] }`
**Expected Result**: HTTP 422; error message "A board must have at least 2 columns"
**Test Data**: Valid JWT for owner; single-column array
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-002-003-02

---

**Test ID**: T-AC-002-003-03
**Title**: Should reject column removal with 409 when tasks exist in the column
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated board owner; board has a "review" column; at least 1 task has status "review"
**Steps**:
  1. Send PATCH `/boards/{boardId}` with columns array that excludes "review"
**Expected Result**: HTTP 409; error message "Cannot remove column 'review' -- 1 or more tasks are assigned to it"
**Test Data**: Valid JWT for owner; board with tasks in "review" column; new columns without "review"
**Automation Notes**: Use `node:test` with `supertest`; seed task with status matching removed column
**Linked AC**: AC-002-003-03

---

## Phase 1 — MVP: Webhook Notifications (F3)

### US-003-001: Configure Webhooks

**Test ID**: T-AC-003-001-01
**Title**: Should create webhook configuration when board owner registers valid URL and secret
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Authenticated board owner
**Steps**:
  1. Send POST `/boards/{boardId}/webhooks` with `{ url: "https://example.com/hook", secret: "s3cret" }`
**Expected Result**: HTTP 201; webhook resource with URL, masked secret, and default subscribed events
**Test Data**: Valid JWT for owner; HTTPS URL; secret string
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-003-001-01

---

**Test ID**: T-AC-003-001-02
**Title**: Should reject webhook creation with 422 when URL format is invalid
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Authenticated board owner
**Steps**:
  1. Send POST `/boards/{boardId}/webhooks` with `{ url: "not-a-url", secret: "s3cret" }`
**Expected Result**: HTTP 422; error message "Webhook URL must be a valid HTTPS URL"
**Test Data**: Valid JWT for owner; malformed URL
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-003-001-02

---

**Test ID**: T-AC-003-001-03
**Title**: Should reject webhook creation with 403 when non-owner Member attempts it
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Authenticated Member (non-owner, non-Admin)
**Steps**:
  1. Send POST `/boards/{boardId}/webhooks` as non-owner Member
**Expected Result**: HTTP 403; error message "Only board owners and Admins can configure webhooks"
**Test Data**: Valid JWT for Member (non-owner)
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-003-001-03

---

### US-003-002: Deliver Webhook Notifications

**Test ID**: T-AC-003-002-01
**Title**: Should deliver HMAC-signed webhook payload when task status changes
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Board has a configured webhook (URL + secret); task exists on the board
**Steps**:
  1. Update task status from "todo" to "in_progress" via PATCH
  2. Capture outbound HTTP POST to webhook URL
**Expected Result**: Webhook POST sent with JSON payload containing event "task.status_changed", task snapshot, actor user ID, ISO 8601 timestamp; `X-Signature-256` header contains valid HMAC-SHA256 of payload body using secret
**Test Data**: Webhook URL (use mock HTTP server); secret "s3cret"; task with status "todo"
**Automation Notes**: Use `node:test` with a mock HTTP server (e.g., `nock` or custom `http.createServer`); verify HMAC signature
**Linked AC**: AC-003-002-01

---

**Test ID**: T-AC-003-002-02
**Title**: Should retry webhook delivery 3 times with exponential backoff on failure
**Type**: Integration
**Priority**: P0-Critical
**Category**: negative
**Preconditions**: Board has a configured webhook; webhook endpoint returns HTTP 500
**Steps**:
  1. Trigger a task event
  2. Mock webhook endpoint to return HTTP 500 for all attempts
  3. Verify retry schedule
**Expected Result**: System makes 4 total attempts (1 initial + 3 retries) with delays of approximately 1s, 4s, and 16s between attempts
**Test Data**: Webhook URL (mock server returning 500); timestamp recording on each attempt
**Automation Notes**: Use `node:test` with mock HTTP server; verify timing within acceptable tolerance (+-500ms)
**Linked AC**: AC-003-002-02

---

**Test ID**: T-AC-003-002-03
**Title**: Should mark delivery as failed and log after all retry attempts are exhausted
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Board has a configured webhook; all 4 delivery attempts fail
**Steps**:
  1. Trigger a task event
  2. Mock webhook endpoint to return non-2xx for all 4 attempts
  3. Query delivery status
**Expected Result**: Delivery record marked as "failed"; log entry contains HTTP status code and truncated response body (max 1KB)
**Test Data**: Webhook URL (mock server returning 503); response body > 1KB to verify truncation
**Automation Notes**: Use `node:test` with mock HTTP server; check delivery record in database
**Linked AC**: AC-003-002-03

---

**Test ID**: T-AC-003-002-04
**Title**: Should dispatch task.created event when a new task is persisted
**Type**: Integration
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Board has a configured webhook; webhook endpoint returns HTTP 200
**Steps**:
  1. Create a new task via POST `/boards/{boardId}/tasks`
  2. Capture webhook payload
**Expected Result**: Webhook POST with event type "task.created" and full task snapshot in payload
**Test Data**: Webhook URL (mock server); valid task creation payload
**Automation Notes**: Use `node:test` with mock HTTP server
**Linked AC**: AC-003-002-04

---

## Phase 2 — Must Have: Search and Filtering (F4)

### US-004-001: Search Tasks by Text

**Test ID**: T-AC-004-001-01
**Title**: Should return matching tasks from accessible boards when searching by keyword
**Type**: Integration
**Priority**: P1-High
**Category**: positive
**Preconditions**: Member has access to 2 boards with 10 total tasks; 3 tasks contain "migration" in title/description
**Steps**:
  1. Send GET `/tasks/search?q=migration`
**Expected Result**: HTTP 200; exactly 3 task resources returned
**Test Data**: Valid JWT for Member; seeded boards with specific task data
**Automation Notes**: Use `node:test` with `supertest`; seed test data with known search terms
**Linked AC**: AC-004-001-01

---

**Test ID**: T-AC-004-001-02
**Title**: Should return empty results when search term matches no tasks
**Type**: Integration
**Priority**: P1-High
**Category**: negative
**Preconditions**: Member has access to boards with tasks
**Steps**:
  1. Send GET `/tasks/search?q=xyznonexistent`
**Expected Result**: HTTP 200; empty results array; total count 0
**Test Data**: Valid JWT for Member; search term that matches nothing
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-004-001-02

---

**Test ID**: T-AC-004-001-03
**Title**: Should exclude tasks from boards the user does not have access to
**Type**: Integration
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Member has access to Board A; Board B exists with a task matching the search term; Member does NOT have access to Board B
**Steps**:
  1. Send GET `/tasks/search?q=secret-migration`
**Expected Result**: HTTP 200; empty results array (Board B task is excluded)
**Test Data**: Valid JWT for Member; Board B with task "secret-migration" accessible only to other users
**Automation Notes**: Use `node:test` with `supertest`; verify access control on search
**Linked AC**: AC-004-001-03

---

### US-004-002: Filter and Sort Tasks

**Test ID**: T-AC-004-002-01
**Title**: Should filter tasks by priority when priority filter is applied
**Type**: Integration
**Priority**: P1-High
**Category**: positive
**Preconditions**: Member has access to a board with 20 tasks; 5 have priority "P0"
**Steps**:
  1. Send GET `/tasks/search?priority=P0`
**Expected Result**: HTTP 200; exactly 5 task resources all with priority "P0"
**Test Data**: Valid JWT for Member; board with known priority distribution
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-004-002-01

---

**Test ID**: T-AC-004-002-02
**Title**: Should return paginated results with correct metadata
**Type**: Integration
**Priority**: P1-High
**Category**: positive
**Preconditions**: Member has access to a board with 50 tasks
**Steps**:
  1. Send GET `/tasks/search?page[size]=20&page[number]=1`
**Expected Result**: HTTP 200; 20 task resources; pagination metadata: total 50, page size 20, current page 1, total pages 3
**Test Data**: Valid JWT for Member; board with 50 seeded tasks
**Automation Notes**: Use `node:test` with `supertest`; verify JSON:API pagination links
**Linked AC**: AC-004-002-02

---

**Test ID**: T-AC-004-002-03
**Title**: Should reject request with 422 when page size exceeds maximum of 100
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Member has access to boards
**Steps**:
  1. Send GET `/tasks/search?page[size]=200`
**Expected Result**: HTTP 422; error message "Page size must not exceed 100"
**Test Data**: Valid JWT for Member; page size 200
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-004-002-03

---

**Test ID**: T-AC-004-002-04
**Title**: Should filter by due date range and sort by due_date
**Type**: Integration
**Priority**: P1-High
**Category**: positive
**Preconditions**: Member has access to a board with tasks having due dates from 2026-03-01 to 2026-03-31
**Steps**:
  1. Send GET `/tasks/search?due_date_from=2026-03-10&due_date_to=2026-03-20&sort=due_date`
**Expected Result**: HTTP 200; only tasks with due dates between 2026-03-10 and 2026-03-20 inclusive; sorted by due_date ascending
**Test Data**: Valid JWT for Member; tasks with specific due dates
**Automation Notes**: Use `node:test` with `supertest`; verify ordering and date range filtering
**Linked AC**: AC-004-002-04

---

## Phase 3 — Nice to Have: Activity Log (F5)

### US-005-001: Record Activity Log

**Test ID**: T-AC-005-001-01
**Title**: Should return complete activity history for a task with before/after values
**Type**: Integration
**Priority**: P2-Medium
**Category**: positive
**Preconditions**: Task exists with 3 updates (2 status changes, 1 assignee change)
**Steps**:
  1. Send GET `/boards/{boardId}/tasks/{taskId}/activity`
**Expected Result**: HTTP 200; 4 activity entries (1 creation + 3 updates); each entry contains actor user ID, action type, timestamp, before/after values; ordered by timestamp descending
**Test Data**: Valid JWT for Member; task ID with known update history
**Automation Notes**: Use `node:test` with `supertest`; seed task with known mutations
**Linked AC**: AC-005-001-01

---

**Test ID**: T-AC-005-001-02
**Title**: Should return paginated board-level activity log
**Type**: Integration
**Priority**: P2-Medium
**Category**: positive
**Preconditions**: Board exists with activity log entries across multiple tasks
**Steps**:
  1. Send GET `/boards/{boardId}/activity`
**Expected Result**: HTTP 200; paginated activity entries across all tasks on the board
**Test Data**: Valid JWT for Member; board with multiple tasks and mutations
**Automation Notes**: Use `node:test` with `supertest`
**Linked AC**: AC-005-001-02

---

**Test ID**: T-AC-005-001-03
**Title**: Should delete activity log entries older than 90 days during retention job
**Type**: Unit
**Priority**: P2-Medium
**Category**: edge
**Preconditions**: Activity log entries exist with timestamps ranging from 30 days ago to 120 days ago
**Steps**:
  1. Execute the daily retention cleanup function
  2. Query activity log entries
**Expected Result**: Entries older than 90 days are permanently deleted; entries 90 days old or newer remain
**Test Data**: Seeded activity log entries with specific timestamps
**Automation Notes**: Use `node:test`; mock current date; call retention function directly; verify database state
**Linked AC**: AC-005-001-03

---

## NFR Test Skeletons

**Test ID**: T-NFR-001-001
**Title**: Should respond within 200ms at p95 under 50 concurrent users
**Type**: Performance
**Priority**: P0-Critical
**Category**: positive
**Preconditions**: Application deployed; database seeded with representative data (1000 tasks across 10 boards)
**Steps**:
  1. Run load test with 50 concurrent users performing mixed read/write operations for 5 minutes
**Expected Result**: p95 response time < 200ms for all endpoints
**Test Data**: 50 simulated users; realistic task payloads
**Automation Notes**: Use locust or k6 for load testing
**Linked NFR**: NFR-001-001

---

**Test ID**: T-NFR-002-001
**Title**: Should reject unauthenticated requests with 401 within 10ms
**Type**: Security
**Priority**: P0-Critical
**Category**: security
**Preconditions**: Application running; no JWT provided
**Steps**:
  1. Send requests to all protected endpoints without Authorization header
**Expected Result**: All return HTTP 401 within 10ms
**Test Data**: No JWT; list of all protected endpoint paths
**Automation Notes**: Use `node:test` with `supertest`; measure response time
**Linked NFR**: NFR-002-001

---

**Test ID**: T-NFR-005-001
**Title**: Should return 429 with Retry-After header when rate limit exceeded
**Type**: Integration
**Priority**: P1-High
**Category**: edge
**Preconditions**: Authenticated user
**Steps**:
  1. Send 101 requests within 1 minute as the same user
**Expected Result**: Request 101 returns HTTP 429 with `Retry-After` header; first 100 succeed
**Test Data**: Valid JWT; rapid request loop
**Automation Notes**: Use `node:test` with `supertest`; verify rate limit counter resets
**Linked NFR**: NFR-005-001
