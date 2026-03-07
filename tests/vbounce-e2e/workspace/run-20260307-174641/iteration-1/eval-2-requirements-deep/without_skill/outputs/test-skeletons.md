# Test Skeletons: TaskFlow API

**Source**: Requirements Specification derived from TaskFlow API PRD v1.0
**Date**: 2026-03-07

---

## Test Type Legend

| Abbreviation | Type | Description |
|---|---|---|
| UT | Unit Test | Tests a single function or module in isolation |
| IT | Integration Test | Tests interaction between components (e.g., service + DB) |
| API | API / Contract Test | Tests HTTP endpoints for correct request/response behavior |
| E2E | End-to-End Test | Tests a full workflow across the system |
| PERF | Performance Test | Tests throughput, latency, or load characteristics |
| SEC | Security Test | Tests authentication, authorization, and data protection |

---

## Epic 1: Task CRUD

### US-001-001: Create a Task

#### T-001-001-01 -- Create task with valid fields [API]

```
TEST: Create task with all valid fields returns 201
COVERS: AC-001-001-01
TYPE: API
PRECONDITIONS:
  - Authenticated user exists with valid JWT
  - User is a member of board "board-1"
STEPS:
  1. POST /boards/board-1/tasks with body:
     { title: "Fix login bug", status: "todo", priority: "P1", assignee: "user-2", tags: ["backend"] }
  2. Assert response status is 201
  3. Assert response body contains task ID, title, status, priority, assignee, tags
  4. Assert task is associated with board "board-1"
  5. GET /tasks/{returned-id} and assert data matches
EXPECTED: Task is created and persisted; 201 returned with full task resource
```

#### T-001-001-02 -- Reject task with title exceeding 200 chars [API]

```
TEST: Create task with title > 200 chars returns 422
COVERS: AC-001-001-02
TYPE: API
PRECONDITIONS:
  - Authenticated user is a member of a board
STEPS:
  1. POST /boards/board-1/tasks with title of 201 characters
  2. Assert response status is 422
  3. Assert error message references title length constraint
EXPECTED: Request rejected with 422 and descriptive validation error
```

#### T-001-001-03 -- Reject task without title [API]

```
TEST: Create task without title returns 422
COVERS: AC-001-001-03
TYPE: API
PRECONDITIONS:
  - Authenticated user is a member of a board
STEPS:
  1. POST /boards/board-1/tasks with body omitting title field
  2. Assert response status is 422
  3. Assert error message indicates title is required
EXPECTED: Request rejected with 422
```

#### T-001-001-04 -- Reject task with description exceeding 5000 chars [API]

```
TEST: Create task with description > 5000 chars returns 422
COVERS: AC-001-001-04
TYPE: API
PRECONDITIONS:
  - Authenticated user is a member of a board
STEPS:
  1. POST /boards/board-1/tasks with description of 5001 characters
  2. Assert response status is 422
EXPECTED: Request rejected with 422
```

#### T-001-001-05 -- Reject task with more than 10 tags [API]

```
TEST: Create task with 11 tags returns 422
COVERS: AC-001-001-05
TYPE: API
PRECONDITIONS:
  - Authenticated user is a member of a board
STEPS:
  1. POST /boards/board-1/tasks with tags array of 11 elements
  2. Assert response status is 422
EXPECTED: Request rejected with 422
```

---

### US-001-002: Read a Task

#### T-001-002-01 -- Read existing task returns full resource [API]

```
TEST: GET task by valid ID returns 200 with full resource
COVERS: AC-001-002-01
TYPE: API
PRECONDITIONS:
  - Task "task-1" exists on a board the user has access to
STEPS:
  1. GET /tasks/task-1
  2. Assert response status is 200
  3. Assert response includes title, description, status, priority, assignee, due_date, tags
EXPECTED: Full task resource returned
```

#### T-001-002-02 -- Read non-existent task returns 404 [API]

```
TEST: GET task with invalid ID returns 404
COVERS: AC-001-002-02
TYPE: API
PRECONDITIONS:
  - No task with ID "nonexistent" exists
STEPS:
  1. GET /tasks/nonexistent
  2. Assert response status is 404
EXPECTED: 404 Not Found
```

#### T-001-002-03 -- Read soft-deleted task returns 404 [IT]

```
TEST: GET soft-deleted task returns 404
COVERS: AC-001-002-03
TYPE: IT
PRECONDITIONS:
  - Task "task-2" exists and has been soft-deleted (deleted_at is set)
STEPS:
  1. GET /tasks/task-2
  2. Assert response status is 404
EXPECTED: Soft-deleted task is invisible via the API
```

---

### US-001-003: Update a Task

#### T-001-003-01 -- Update task fields with PATCH [API]

```
TEST: PATCH task with valid fields returns 200
COVERS: AC-001-003-01
TYPE: API
PRECONDITIONS:
  - Task exists; user has board access
STEPS:
  1. PATCH /tasks/task-1 with { priority: "P0" }
  2. Assert response status is 200
  3. Assert priority is "P0"
  4. Assert other fields are unchanged
EXPECTED: Only specified fields updated
```

#### T-001-003-02 -- Status change triggers webhook [IT]

```
TEST: Changing task status emits task.status_changed webhook event
COVERS: AC-001-003-02
TYPE: IT
PRECONDITIONS:
  - Board has webhook configured
  - Task status is "todo"
STEPS:
  1. PATCH /tasks/task-1 with { status: "in_progress" }
  2. Assert response status is 200
  3. Assert webhook delivery was triggered with event type "task.status_changed"
EXPECTED: Webhook fires with correct event type and task snapshot
```

#### T-001-003-03 -- Reject invalid priority on update [API]

```
TEST: PATCH task with invalid priority returns 422
COVERS: AC-001-003-03
TYPE: API
PRECONDITIONS:
  - Task exists; user has board access
STEPS:
  1. PATCH /tasks/task-1 with { priority: "P5" }
  2. Assert response status is 422
EXPECTED: 422 with validation error
```

---

### US-001-004: Delete a Task (Soft Delete)

#### T-001-004-01 -- Creator can soft-delete a task [API]

```
TEST: Task creator can DELETE task, returns 204
COVERS: AC-001-004-01
TYPE: API
PRECONDITIONS:
  - User "user-1" created "task-1"
STEPS:
  1. DELETE /tasks/task-1 as user-1
  2. Assert response status is 204
  3. Query database: assert task-1 has deleted_at != null
EXPECTED: Soft delete performed; 204 returned
```

#### T-001-004-02 -- Admin can soft-delete any task [SEC]

```
TEST: Admin can DELETE any task on their board, returns 204
COVERS: AC-001-004-02
TYPE: SEC
PRECONDITIONS:
  - User "admin-1" has Admin role on the board
  - Task "task-3" was created by a different user
STEPS:
  1. DELETE /tasks/task-3 as admin-1
  2. Assert response status is 204
  3. Query database: assert task-3 has deleted_at != null
EXPECTED: Admin may delete any task; soft delete performed
```

#### T-001-004-03 -- Non-creator non-admin cannot delete [SEC]

```
TEST: Regular member cannot DELETE another user's task, returns 403
COVERS: AC-001-004-03
TYPE: SEC
PRECONDITIONS:
  - User "member-1" is a Member on the board
  - Task "task-4" was created by a different user
STEPS:
  1. DELETE /tasks/task-4 as member-1
  2. Assert response status is 403
EXPECTED: 403 Forbidden
```

---

### US-001-005: Task Field Constraints

#### T-001-005-01 -- Reject invalid status value [UT]

```
TEST: Validation rejects invalid status enum value
COVERS: AC-001-005-01
TYPE: UT
STEPS:
  1. Call task validation function with status: "blocked"
  2. Assert validation fails with status enum error
EXPECTED: Validation rejects non-enum status values
```

#### T-001-005-02 -- Reject invalid priority value [UT]

```
TEST: Validation rejects invalid priority enum value
COVERS: AC-001-005-02
TYPE: UT
STEPS:
  1. Call task validation function with priority: "P9"
  2. Assert validation fails with priority enum error
EXPECTED: Validation rejects non-enum priority values
```

#### T-001-005-03 -- Task belongs to exactly one board [IT]

```
TEST: Created task is associated with exactly one board
COVERS: AC-001-005-03
TYPE: IT
STEPS:
  1. Create a task on board-1
  2. Query database for task's board associations
  3. Assert exactly one board association exists and it is board-1
EXPECTED: Task-board relationship is 1:1
```

---

## Epic 2: Board Management

### US-002-001: Create a Board

#### T-002-001-01 -- Create board with defaults [API]

```
TEST: Create board with name returns 201 with default columns
COVERS: AC-002-001-01
TYPE: API
PRECONDITIONS:
  - Authenticated user
STEPS:
  1. POST /boards with { name: "Sprint 42" }
  2. Assert response status is 201
  3. Assert columns are ["todo", "in_progress", "review", "done"]
  4. Assert owner is the requesting user
EXPECTED: Board created with default columns; creator is owner
```

#### T-002-001-02 -- Reject board name exceeding 100 chars [API]

```
TEST: Create board with name > 100 chars returns 422
COVERS: AC-002-001-02
TYPE: API
STEPS:
  1. POST /boards with name of 101 characters
  2. Assert response status is 422
EXPECTED: 422 with validation error
```

#### T-002-001-03 -- Reject board with fewer than 2 columns [API]

```
TEST: Create board with 1 custom column returns 422
COVERS: AC-002-001-03
TYPE: API
STEPS:
  1. POST /boards with { name: "Test", columns: ["single"] }
  2. Assert response status is 422
EXPECTED: 422 with validation error about minimum columns
```

---

### US-002-002: Configure Board Columns

#### T-002-002-01 -- Owner updates columns [API]

```
TEST: Board owner can update columns to valid list
COVERS: AC-002-002-01
TYPE: API
PRECONDITIONS:
  - Board exists; user is owner
STEPS:
  1. PATCH /boards/board-1 with { columns: ["backlog", "doing", "done"] }
  2. Assert response status is 200
  3. Assert columns match updated list in order
EXPECTED: Columns updated successfully
```

#### T-002-002-02 -- Reject fewer than 2 columns on update [API]

```
TEST: Updating board to fewer than 2 columns returns 422
COVERS: AC-002-002-02
TYPE: API
STEPS:
  1. PATCH /boards/board-1 with { columns: ["only-one"] }
  2. Assert response status is 422
EXPECTED: 422 validation error
```

#### T-002-002-03 -- Non-owner non-admin cannot modify columns [SEC]

```
TEST: Member cannot update board columns, returns 403
COVERS: AC-002-002-03
TYPE: SEC
PRECONDITIONS:
  - User is a Member (not owner or Admin)
STEPS:
  1. PATCH /boards/board-1 with { columns: ["a", "b"] } as Member
  2. Assert response status is 403
EXPECTED: 403 Forbidden
```

---

### US-002-003: Invite Members and Set Roles

#### T-002-003-01 -- Owner invites a member [API]

```
TEST: Board owner can invite user with a role
COVERS: AC-002-003-01
TYPE: API
PRECONDITIONS:
  - Board exists; user is owner
STEPS:
  1. POST /boards/board-1/members with { user_id: "user-5", role: "Member" }
  2. Assert response status is 201
  3. GET /boards/board-1/members and assert user-5 is listed with role Member
EXPECTED: User added to board with correct role
```

#### T-002-003-02 -- Admin invites a member [API]

```
TEST: Admin on board can invite user with a role
COVERS: AC-002-003-02
TYPE: API
PRECONDITIONS:
  - User has Admin role on the board
STEPS:
  1. POST /boards/board-1/members with { user_id: "user-6", role: "Viewer" } as Admin
  2. Assert response status is 201
EXPECTED: User added to board
```

#### T-002-003-03 -- Member/Viewer cannot invite [SEC]

```
TEST: Member or Viewer cannot invite users, returns 403
COVERS: AC-002-003-03
TYPE: SEC
PRECONDITIONS:
  - User has Member role on the board
STEPS:
  1. POST /boards/board-1/members with { user_id: "user-7", role: "Member" } as Member
  2. Assert response status is 403
EXPECTED: 403 Forbidden
```

---

## Epic 3: Webhook Notifications

### US-003-001: Configure Webhooks per Board

#### T-003-001-01 -- Register a webhook [API]

```
TEST: Board owner registers webhook, returns 201
COVERS: AC-003-001-01
TYPE: API
PRECONDITIONS:
  - User is board owner
STEPS:
  1. POST /boards/board-1/webhooks with { url: "https://example.com/hook", secret: "s3cret" }
  2. Assert response status is 201
  3. Assert webhook configuration is persisted
EXPECTED: Webhook registered
```

#### T-003-001-02 -- Non-owner non-admin cannot configure webhook [SEC]

```
TEST: Member cannot register webhook, returns 403
COVERS: AC-003-001-02
TYPE: SEC
PRECONDITIONS:
  - User is a Member on the board
STEPS:
  1. POST /boards/board-1/webhooks with valid body as Member
  2. Assert response status is 403
EXPECTED: 403 Forbidden
```

#### T-003-001-03 -- Webhook payload is HMAC-signed [IT]

```
TEST: Delivered webhook payloads are signed with HMAC using configured secret
COVERS: AC-003-001-03
TYPE: IT
PRECONDITIONS:
  - Webhook configured with secret "s3cret"
  - Mock HTTP server captures incoming requests
STEPS:
  1. Trigger a task.created event on the board
  2. Capture the webhook request at mock server
  3. Verify the HMAC signature header matches the payload signed with "s3cret"
EXPECTED: HMAC signature is valid
```

---

### US-003-002: Webhook Event Delivery

#### T-003-002-01 -- task.created event delivery [IT]

```
TEST: Creating a task triggers task.created webhook delivery
COVERS: AC-003-002-01
TYPE: IT
PRECONDITIONS:
  - Board has webhook configured; mock server ready
STEPS:
  1. POST /boards/board-1/tasks with valid body
  2. Assert mock server receives payload
  3. Assert payload contains: event="task.created", task snapshot, actor, timestamp
EXPECTED: Correct payload delivered
```

#### T-003-002-02 -- task.status_changed event delivery [IT]

```
TEST: Changing task status triggers task.status_changed webhook delivery
COVERS: AC-003-002-02
TYPE: IT
PRECONDITIONS:
  - Board has webhook; task exists
STEPS:
  1. PATCH /tasks/task-1 with { status: "done" }
  2. Assert mock server receives webhook with event "task.status_changed"
EXPECTED: Webhook delivered to configured URL
```

#### T-003-002-03 -- All supported events trigger webhooks [E2E]

```
TEST: Each of the 5 supported event types triggers a webhook
COVERS: AC-003-002-03
TYPE: E2E
PRECONDITIONS:
  - Board with webhook; mock server
STEPS:
  1. Create a task -> assert "task.created" event received
  2. Update the task title -> assert "task.updated" event received
  3. Change task status -> assert "task.status_changed" event received
  4. Assign the task -> assert "task.assigned" event received
  5. Delete the task -> assert "task.deleted" event received
EXPECTED: All 5 event types delivered
```

---

### US-003-003: Webhook Retry on Failure

#### T-003-003-01 -- First retry after ~1 second [IT]

```
TEST: First retry occurs approximately 1 second after initial failure
COVERS: AC-003-003-01
TYPE: IT
PRECONDITIONS:
  - Mock server configured to return 500 on first request
STEPS:
  1. Trigger a webhook event
  2. Assert initial delivery fails
  3. Assert first retry arrives approximately 1s (+/- 500ms) after failure
EXPECTED: Retry delay ~1s
```

#### T-003-003-02 -- Second retry after ~4 seconds [IT]

```
TEST: Second retry occurs approximately 4 seconds after first retry failure
COVERS: AC-003-003-02
TYPE: IT
PRECONDITIONS:
  - Mock server configured to return 500 on first two requests
STEPS:
  1. Trigger a webhook event
  2. Assert second retry arrives approximately 4s after first retry
EXPECTED: Retry delay ~4s
```

#### T-003-003-03 -- Third retry after ~16 seconds [IT]

```
TEST: Third retry occurs approximately 16 seconds after second retry failure
COVERS: AC-003-003-03
TYPE: IT
PRECONDITIONS:
  - Mock server configured to return 500 on first three requests
STEPS:
  1. Trigger a webhook event
  2. Assert third retry arrives approximately 16s after second retry
EXPECTED: Retry delay ~16s
```

#### T-003-003-04 -- No further retries after 3 failures [IT]

```
TEST: After 3 failed retries, no further delivery attempts are made
COVERS: AC-003-003-04
TYPE: IT
PRECONDITIONS:
  - Mock server configured to always return 500
STEPS:
  1. Trigger a webhook event
  2. Wait for all retries to exhaust (1 initial + 3 retries = 4 total attempts)
  3. Wait an additional 30 seconds
  4. Assert no further requests received by mock server
  5. Assert delivery status is marked as "failed" in the database
EXPECTED: Exactly 4 attempts total; delivery marked failed
```

---

## Epic 4: Search and Filtering

### US-004-001: Full-Text Search

#### T-004-001-01 -- Full-text search returns matching tasks [API]

```
TEST: Search by keyword returns matching tasks across accessible boards
COVERS: AC-004-001-01
TYPE: API
PRECONDITIONS:
  - User has access to boards with tasks containing "deployment" in title/description
STEPS:
  1. GET /tasks?q=deployment
  2. Assert response status is 200
  3. Assert all returned tasks contain "deployment" in title or description
  4. Assert no tasks from inaccessible boards are returned
EXPECTED: Matching tasks returned, scoped to user's accessible boards
```

#### T-004-001-02 -- Default pagination is 20 per page [API]

```
TEST: Search results default to 20 items per page
COVERS: AC-004-001-02
TYPE: API
PRECONDITIONS:
  - User has access to 50+ tasks matching the query
STEPS:
  1. GET /tasks?q=test (no page[size] parameter)
  2. Assert response contains at most 20 results
  3. Assert pagination metadata is present
EXPECTED: Default page size is 20
```

#### T-004-001-03 -- Page size capped at 100 [API]

```
TEST: Requesting page size > 100 returns at most 100
COVERS: AC-004-001-03
TYPE: API
STEPS:
  1. GET /tasks?q=test&page[size]=200
  2. Assert response contains at most 100 results
EXPECTED: Page size capped at 100
```

---

### US-004-002: Filter Tasks

#### T-004-002-01 -- Filter by status [API]

```
TEST: Filter tasks by status returns only matching tasks
COVERS: AC-004-002-01
TYPE: API
STEPS:
  1. GET /tasks?filter[status]=in_progress
  2. Assert all returned tasks have status "in_progress"
EXPECTED: Only in_progress tasks returned
```

#### T-004-002-02 -- Multiple filters use AND logic [API]

```
TEST: Combining filters returns intersection of criteria
COVERS: AC-004-002-02
TYPE: API
STEPS:
  1. GET /tasks?filter[status]=todo&filter[priority]=P0&filter[assignee]=user-1
  2. Assert all returned tasks match ALL three criteria
EXPECTED: AND logic applied to multiple filters
```

#### T-004-002-03 -- Filter by due date range [API]

```
TEST: Filter by due date range returns tasks within range
COVERS: AC-004-002-03
TYPE: API
STEPS:
  1. GET /tasks?filter[due_date_from]=2026-03-01&filter[due_date_to]=2026-03-31
  2. Assert all returned tasks have due_date between 2026-03-01 and 2026-03-31 inclusive
EXPECTED: Only tasks within date range returned
```

---

### US-004-003: Sort Results

#### T-004-003-01 -- Sort by created_at [API]

```
TEST: Sort by created_at orders results by creation date
COVERS: AC-004-003-01
TYPE: API
STEPS:
  1. GET /tasks?sort=created_at
  2. Assert results are ordered by created_at ascending
EXPECTED: Correct sort order
```

#### T-004-003-02 -- Sort by priority [API]

```
TEST: Sort by priority orders P0 first
COVERS: AC-004-003-02
TYPE: API
STEPS:
  1. GET /tasks?sort=priority
  2. Assert results are ordered P0, P1, P2, P3
EXPECTED: P0 tasks appear first
```

#### T-004-003-03 -- Default sort order [API]

```
TEST: No sort parameter uses default order (created_at descending)
COVERS: AC-004-003-03
TYPE: API
STEPS:
  1. GET /tasks (no sort parameter)
  2. Assert results are ordered by created_at descending
EXPECTED: Sensible default sort applied
```

---

## Epic 5: Activity Log

### US-005-001: Record Activity

#### T-005-001-01 -- Log entry created on task mutation [IT]

```
TEST: Creating/updating/deleting a task generates an activity log entry
COVERS: AC-005-001-01
TYPE: IT
STEPS:
  1. Create a task
  2. Query activity log for that task
  3. Assert log entry exists with actor, action type "created", timestamp
  4. Update the task title from "A" to "B"
  5. Assert log entry exists with before="A", after="B" for title
EXPECTED: Mutation actions are logged with full context
```

#### T-005-001-02 -- Activity log is immutable [IT]

```
TEST: Attempting to modify or delete a log entry is rejected
COVERS: AC-005-001-02
TYPE: IT
STEPS:
  1. Retrieve a log entry ID
  2. Attempt PATCH /activity-log/{id} -> assert 405 or 403
  3. Attempt DELETE /activity-log/{id} -> assert 405 or 403
EXPECTED: Log entries cannot be modified or deleted via API
```

#### T-005-001-03 -- 90-day retention purge [IT]

```
TEST: Log entries older than 90 days are purged
COVERS: AC-005-001-03
TYPE: IT
PRECONDITIONS:
  - Log entry exists with timestamp 91 days ago (test seeded)
STEPS:
  1. Trigger retention job (or simulate time passage)
  2. Query for the 91-day-old log entry
  3. Assert it no longer exists
  4. Query for a 89-day-old entry and assert it still exists
EXPECTED: Only entries > 90 days old are purged
```

---

### US-005-002: Query Activity Log

#### T-005-002-01 -- Get activity log per task [API]

```
TEST: GET activity log for a task returns entries in chronological order
COVERS: AC-005-002-01
TYPE: API
PRECONDITIONS:
  - Task has multiple log entries
STEPS:
  1. GET /tasks/task-1/activity
  2. Assert response status is 200
  3. Assert entries are in chronological order (oldest first)
EXPECTED: Chronologically ordered log entries returned
```

#### T-005-002-02 -- Get activity log per board [API]

```
TEST: GET activity log for a board returns all task entries
COVERS: AC-005-002-02
TYPE: API
PRECONDITIONS:
  - Board has multiple tasks with log entries
STEPS:
  1. GET /boards/board-1/activity
  2. Assert response status is 200
  3. Assert entries from multiple tasks on the board are included
EXPECTED: Board-level activity log returned
```

#### T-005-002-03 -- Unauthorized board access returns 403 [SEC]

```
TEST: User without board access cannot view activity log
COVERS: AC-005-002-03
TYPE: SEC
PRECONDITIONS:
  - User has no role on board-2
STEPS:
  1. GET /boards/board-2/activity as unauthorized user
  2. Assert response status is 403
EXPECTED: 403 Forbidden
```

---

## Non-Functional Requirement Tests

#### T-NFR-001 -- p95 response time under load [PERF]

```
TEST: API p95 response time < 200ms with 50 concurrent users
COVERS: NFR-001
TYPE: PERF
STEPS:
  1. Configure load test with 50 concurrent users
  2. Mix of CRUD operations over 5-minute duration
  3. Collect response time percentiles
  4. Assert p95 < 200ms
EXPECTED: p95 latency under threshold
```

#### T-NFR-005 -- Rate limiting enforcement [API]

```
TEST: User exceeding 100 req/min receives 429
COVERS: NFR-005
TYPE: API
STEPS:
  1. Send 101 requests within 60 seconds as a single user
  2. Assert the 101st request returns 429 Too Many Requests
EXPECTED: Rate limit enforced at 100 req/min
```

#### T-NFR-006 -- Board supports 10,000 tasks [PERF]

```
TEST: Board with 10,000 tasks responds within acceptable latency
COVERS: NFR-006
TYPE: PERF
PRECONDITIONS:
  - Board seeded with 10,000 tasks
STEPS:
  1. GET /boards/board-1/tasks
  2. Assert response status is 200
  3. Assert response time < 200ms at p95
EXPECTED: No degradation at max capacity
```

#### T-NFR-008 -- JSON:API format compliance [API]

```
TEST: All API responses conform to JSON:API specification
COVERS: NFR-008
TYPE: API
STEPS:
  1. Issue GET, POST, PATCH, DELETE requests to various endpoints
  2. Validate each response body against JSON:API schema
  3. Assert top-level members (data, errors, meta) are present as appropriate
EXPECTED: Full JSON:API compliance
```

#### T-NFR-012 -- RBAC enforcement across endpoints [SEC]

```
TEST: Endpoints enforce role-based access control
COVERS: NFR-012
TYPE: SEC
STEPS:
  1. As Viewer: attempt POST /tasks -> assert 403
  2. As Member: attempt DELETE /boards/board-1 -> assert 403
  3. As Admin: attempt all operations -> assert 2xx where permitted
EXPECTED: Each role has correct permissions enforced
```
