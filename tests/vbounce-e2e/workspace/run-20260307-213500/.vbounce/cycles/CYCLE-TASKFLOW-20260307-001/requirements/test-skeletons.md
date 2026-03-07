# Test Skeletons: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: requirements-analyst

---

## F1: Task CRUD

### T-AC-US-001-001-01: Create task with valid payload

- **AC**: AC-US-001-001-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role; board "B1" exists
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send POST /boards/B1/tasks with `{ title: "Fix login bug", status: "todo", priority: "P1" }`
  3. Assert response status is 201
  4. Assert response body conforms to JSON:API format
  5. Assert response contains server-generated ID, created_at, and all submitted fields
- **Expected Result**: Task created successfully, HTTP 201, valid JSON:API resource returned
- **Test Data**: `{ title: "Fix login bug", status: "todo", priority: "P1" }`
- **Automation Notes**: Use supertest or similar HTTP testing library; verify against JSON:API schema

### T-AC-US-001-001-02: Reject task creation without title

- **AC**: AC-US-001-001-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role; board "B1" exists
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send POST /boards/B1/tasks with payload missing "title"
  3. Assert response status is 422
  4. Assert error source pointer is "/data/attributes/title"
  5. Assert error detail contains "Title is required"
- **Expected Result**: HTTP 422 with appropriate error message
- **Test Data**: `{ status: "todo", priority: "P1" }` (no title)
- **Automation Notes**: Validate JSON:API error format

### T-AC-US-001-001-03: Reject task creation with title exceeding 200 chars

- **AC**: AC-US-001-001-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user with Member role; board "B1" exists
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send POST /boards/B1/tasks with title of 201 characters
  3. Assert response status is 422
  4. Assert error detail contains "Title must not exceed 200 characters"
- **Expected Result**: HTTP 422 with max-length error
- **Test Data**: `{ title: "a".repeat(201), status: "todo" }`
- **Automation Notes**: Boundary value test

### T-AC-US-001-001-04: Reject task creation by Viewer role

- **AC**: AC-US-001-001-04
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Viewer role; board "B1" exists
- **Steps**:
  1. Authenticate as a Viewer of board "B1"
  2. Send POST /boards/B1/tasks with valid payload
  3. Assert response status is 403
  4. Assert error detail contains "Viewers cannot create tasks"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Valid task payload
- **Automation Notes**: RBAC test; verify same payload succeeds for Member

### T-AC-US-001-001-05: Reject task creation with more than 10 tags

- **AC**: AC-US-001-001-05
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user with Member role; board "B1" exists
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send POST /boards/B1/tasks with 11 tags
  3. Assert response status is 422
  4. Assert error detail contains "Maximum 10 tags allowed"
- **Expected Result**: HTTP 422 with tag limit error
- **Test Data**: `{ title: "Test", tags: ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"] }`
- **Automation Notes**: Boundary value test; also test with exactly 10 tags (should succeed)

### T-AC-US-001-002-01: Retrieve a single task by ID

- **AC**: AC-US-001-002-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with any role on board "B1"; task "T1" exists
- **Steps**:
  1. Authenticate as a member of board "B1"
  2. Send GET /boards/B1/tasks/T1
  3. Assert response status is 200
  4. Assert response body contains all task fields in JSON:API format
- **Expected Result**: HTTP 200 with complete task resource
- **Test Data**: Pre-seeded task "T1" with all fields populated
- **Automation Notes**: Verify all fields present: title, description, status, priority, assignee, due_date, tags, created_at, updated_at

### T-AC-US-001-002-02: List all tasks on a board

- **AC**: AC-US-001-002-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with any role on board "B1"; 5 tasks exist
- **Steps**:
  1. Seed 5 tasks on board "B1"
  2. Authenticate as a member of board "B1"
  3. Send GET /boards/B1/tasks
  4. Assert response status is 200
  5. Assert response contains exactly 5 task resources
- **Expected Result**: HTTP 200 with collection of 5 tasks
- **Test Data**: 5 pre-seeded tasks
- **Automation Notes**: Verify JSON:API collection format

### T-AC-US-001-002-03: Return 404 for nonexistent task

- **AC**: AC-US-001-002-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role on board "B1"
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send GET /boards/B1/tasks/nonexistent-id
  3. Assert response status is 404
  4. Assert error detail contains "Task not found"
- **Expected Result**: HTTP 404 with error message
- **Test Data**: Non-existent task ID
- **Automation Notes**: Test with UUID format and non-UUID string

### T-AC-US-001-002-04: Soft-deleted task excluded from list

- **AC**: AC-US-001-002-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user; board "B1" with task "T1" that has been soft-deleted
- **Steps**:
  1. Seed task "T1" on board "B1" and soft-delete it
  2. Authenticate as a Member of board "B1"
  3. Send GET /boards/B1/tasks
  4. Assert task "T1" is not in the response collection
- **Expected Result**: Soft-deleted task excluded from listing
- **Test Data**: Task with non-null deleted_at
- **Automation Notes**: Verify by checking task IDs in response

### T-AC-US-001-003-01: Update task fields successfully

- **AC**: AC-US-001-003-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role; task "T1" exists on board "B1"
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send PATCH /boards/B1/tasks/T1 with `{ status: "in_progress", priority: "P0" }`
  3. Assert response status is 200
  4. Assert response reflects updated status and priority
  5. Assert updated_at is more recent than created_at
- **Expected Result**: HTTP 200 with updated task
- **Test Data**: Existing task with initial status "todo" and priority "P2"
- **Automation Notes**: Verify partial update (other fields unchanged)

### T-AC-US-001-003-02: Reject update with invalid status

- **AC**: AC-US-001-003-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role; task "T1" exists on board "B1"
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send PATCH /boards/B1/tasks/T1 with `{ status: "invalid_status" }`
  3. Assert response status is 422
  4. Assert error detail contains "Status must be one of: todo, in_progress, review, done"
- **Expected Result**: HTTP 422 with validation error
- **Test Data**: Invalid status value
- **Automation Notes**: Test multiple invalid values

### T-AC-US-001-003-03: Reject update by Viewer role

- **AC**: AC-US-001-003-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Viewer role; task "T1" exists on board "B1"
- **Steps**:
  1. Authenticate as a Viewer of board "B1"
  2. Send PATCH /boards/B1/tasks/T1 with any update payload
  3. Assert response status is 403
  4. Assert error detail contains "Viewers cannot modify tasks"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Valid update payload
- **Automation Notes**: RBAC test

### T-AC-US-001-003-04: Accept description at max length (5000 chars)

- **AC**: AC-US-001-003-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user with Member role; task "T1" exists on board "B1"
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send PATCH /boards/B1/tasks/T1 with description of exactly 5000 characters
  3. Assert response status is 200
  4. Assert response description has length 5000
- **Expected Result**: HTTP 200 with full description stored
- **Test Data**: `"a".repeat(5000)`
- **Automation Notes**: Boundary value; also test 5001 chars (should fail)

### T-AC-US-001-004-01: Creator soft-deletes own task

- **AC**: AC-US-001-004-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user who created task "T1" on board "B1"
- **Steps**:
  1. Create task "T1" as user "U1"
  2. Send DELETE /boards/B1/tasks/T1 as user "U1"
  3. Assert response status is 200
  4. Assert task has deleted_at timestamp set
  5. Send GET /boards/B1/tasks and assert "T1" is excluded
- **Expected Result**: Task soft-deleted, excluded from listings
- **Test Data**: Task created by the requesting user
- **Automation Notes**: Verify deleted_at is set, not actual row deletion

### T-AC-US-001-004-02: Admin soft-deletes another user's task

- **AC**: AC-US-001-004-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Task "T1" created by user "U1"; authenticated as Admin "U2" on board "B1"
- **Steps**:
  1. Create task "T1" as user "U1"
  2. Send DELETE /boards/B1/tasks/T1 as Admin "U2"
  3. Assert response status is 200
  4. Assert task has deleted_at timestamp set
- **Expected Result**: Admin can delete others' tasks
- **Test Data**: Task created by a different user
- **Automation Notes**: Cross-user authorization test

### T-AC-US-001-004-03: Non-creator Member cannot delete task

- **AC**: AC-US-001-004-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Task "T1" created by "U1"; authenticated as Member "U2" (not creator)
- **Steps**:
  1. Create task "T1" as user "U1"
  2. Send DELETE /boards/B1/tasks/T1 as Member "U2"
  3. Assert response status is 403
  4. Assert error detail contains "Only the task creator or an Admin can delete this task"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Task not owned by requesting user
- **Automation Notes**: RBAC test

### T-AC-US-001-004-04: Deleting already-deleted task returns 404

- **AC**: AC-US-001-004-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Task "T1" has already been soft-deleted; authenticated as Admin
- **Steps**:
  1. Soft-delete task "T1"
  2. Send DELETE /boards/B1/tasks/T1 again as Admin
  3. Assert response status is 404
  4. Assert error detail contains "Task not found"
- **Expected Result**: HTTP 404 for already-deleted task
- **Test Data**: Task with non-null deleted_at
- **Automation Notes**: Idempotency edge case

---

## F2: Board Management

### T-AC-US-002-001-01: Create board with defaults

- **AC**: AC-US-002-001-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send POST /boards with `{ name: "Sprint Board" }`
  2. Assert response status is 201
  3. Assert response contains 4 default columns
  4. Assert requesting user is set as owner
- **Expected Result**: Board created with default columns
- **Test Data**: `{ name: "Sprint Board" }`
- **Automation Notes**: Verify default columns: todo, in_progress, review, done

### T-AC-US-002-001-02: Reject board creation without name

- **AC**: AC-US-002-001-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send POST /boards without a name field
  2. Assert response status is 422
  3. Assert error detail contains "Board name is required"
- **Expected Result**: HTTP 422 validation error
- **Test Data**: `{}` (empty payload)
- **Automation Notes**: Validate JSON:API error format

### T-AC-US-002-001-03: Reject board name exceeding 100 chars

- **AC**: AC-US-002-001-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send POST /boards with name of 101 characters
  2. Assert response status is 422
  3. Assert error detail contains "Board name must not exceed 100 characters"
- **Expected Result**: HTTP 422 with max-length error
- **Test Data**: `{ name: "a".repeat(101) }`
- **Automation Notes**: Boundary value test

### T-AC-US-002-001-04: Create board with custom 2-column layout

- **AC**: AC-US-002-001-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send POST /boards with `{ name: "Minimal Board", columns: ["open", "closed"] }`
  2. Assert response status is 201
  3. Assert response contains exactly 2 columns in order
- **Expected Result**: Board created with custom columns
- **Test Data**: 2-column layout
- **Automation Notes**: Verify column ordering preserved

### T-AC-US-002-001-05: Reject board with fewer than 2 columns

- **AC**: AC-US-002-001-05
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send POST /boards with `{ name: "Bad Board", columns: ["only_one"] }`
  2. Assert response status is 422
  3. Assert error detail contains "A board must have at least 2 columns"
- **Expected Result**: HTTP 422 with column count error
- **Test Data**: Single-column array
- **Automation Notes**: Also test with empty columns array

### T-AC-US-002-002-01: Rename board columns

- **AC**: AC-US-002-002-01
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board owner; board "B1" with 3 columns
- **Steps**:
  1. Authenticate as board owner
  2. Send PATCH /boards/B1 with updated column names
  3. Assert response status is 200
  4. Assert column names match the update
- **Expected Result**: Columns renamed successfully
- **Test Data**: `{ columns: ["backlog", "active", "complete"] }`
- **Automation Notes**: Verify ordering preserved

### T-AC-US-002-002-02: Reject reducing columns below minimum

- **AC**: AC-US-002-002-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board owner; board "B1" with 3 columns
- **Steps**:
  1. Authenticate as board owner
  2. Send PATCH /boards/B1 with `{ columns: ["only_one"] }`
  3. Assert response status is 422
  4. Assert error detail contains "A board must have at least 2 columns"
- **Expected Result**: HTTP 422 with column count error
- **Test Data**: Single column
- **Automation Notes**: Constraint enforcement test

### T-AC-US-002-002-03: Non-owner Member cannot modify columns

- **AC**: AC-US-002-002-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role (not owner) on board "B1"
- **Steps**:
  1. Authenticate as a non-owner Member of board "B1"
  2. Send PATCH /boards/B1 with column updates
  3. Assert response status is 403
  4. Assert error detail contains "Only the board owner or an Admin can modify board settings"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Valid column update payload
- **Automation Notes**: RBAC test

### T-AC-US-002-003-01: Invite user to board with role

- **AC**: AC-US-002-003-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board owner of board "B1"; user "U2" exists
- **Steps**:
  1. Authenticate as board owner
  2. Send POST /boards/B1/members with `{ user_id: "U2", role: "Member" }`
  3. Assert response status is 201
  4. Verify user "U2" can now access board "B1"
- **Expected Result**: User invited successfully
- **Test Data**: Valid user ID and role
- **Automation Notes**: Follow up with a GET as "U2" to verify access

### T-AC-US-002-003-02: Reject invalid role on invite

- **AC**: AC-US-002-003-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board owner of board "B1"
- **Steps**:
  1. Authenticate as board owner
  2. Send POST /boards/B1/members with `{ user_id: "U2", role: "SuperAdmin" }`
  3. Assert response status is 422
  4. Assert error detail contains "Role must be one of: Admin, Member, Viewer"
- **Expected Result**: HTTP 422 with invalid role error
- **Test Data**: Invalid role value
- **Automation Notes**: Enum validation test

### T-AC-US-002-003-03: Non-owner Member cannot invite

- **AC**: AC-US-002-003-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role (not owner or Admin) on board "B1"
- **Steps**:
  1. Authenticate as a non-owner Member of board "B1"
  2. Send POST /boards/B1/members with valid invite payload
  3. Assert response status is 403
  4. Assert error detail contains "Only the board owner or an Admin can invite members"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Valid invite payload
- **Automation Notes**: RBAC test

### T-AC-US-002-003-04: Update role of existing member

- **AC**: AC-US-002-003-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board owner; user "U2" already a Member of board "B1"
- **Steps**:
  1. Authenticate as board owner
  2. Send POST /boards/B1/members with `{ user_id: "U2", role: "Admin" }`
  3. Assert response status is 200
  4. Assert role updated to "Admin"
- **Expected Result**: Role updated for existing member
- **Test Data**: Existing member with new role
- **Automation Notes**: Upsert behavior test

---

## F3: Webhook Notifications

### T-AC-US-003-001-01: Configure webhook for board

- **AC**: AC-US-003-001-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board owner or Admin of board "B1"
- **Steps**:
  1. Authenticate as board owner
  2. Send POST /boards/B1/webhooks with `{ url: "https://example.com/hook", secret: "my-secret-key" }`
  3. Assert response status is 201
  4. Assert response contains the URL and a masked secret
- **Expected Result**: Webhook configured successfully
- **Test Data**: Valid HTTPS URL and secret
- **Automation Notes**: Verify secret is masked in response (e.g., "my-****-key")

### T-AC-US-003-001-02: Reject invalid webhook URL

- **AC**: AC-US-003-001-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board owner of board "B1"
- **Steps**:
  1. Authenticate as board owner
  2. Send POST /boards/B1/webhooks with `{ url: "not-a-valid-url", secret: "key" }`
  3. Assert response status is 422
  4. Assert error detail contains "Webhook URL must be a valid HTTPS URL"
- **Expected Result**: HTTP 422 with URL validation error
- **Test Data**: Invalid URL string
- **Automation Notes**: Also test HTTP (non-HTTPS) URL [ASSUMPTION]

### T-AC-US-003-001-03: Non-owner/non-Admin cannot configure webhook

- **AC**: AC-US-003-001-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user with Member role on board "B1"
- **Steps**:
  1. Authenticate as a Member of board "B1"
  2. Send POST /boards/B1/webhooks with valid payload
  3. Assert response status is 403
  4. Assert error detail contains "Only the board owner or an Admin can configure webhooks"
- **Expected Result**: HTTP 403 authorization error
- **Test Data**: Valid webhook payload
- **Automation Notes**: RBAC test

### T-AC-US-003-002-01: Webhook fires on task creation

- **AC**: AC-US-003-002-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" has webhook configured; mock HTTP server listening
- **Steps**:
  1. Set up a mock webhook receiver
  2. Create a task on board "B1"
  3. Wait up to 5 seconds for webhook delivery
  4. Assert webhook received with event "task.created"
  5. Assert payload contains task snapshot, actor user ID, and ISO 8601 timestamp
  6. Verify HMAC-SHA256 signature in X-Signature-256 header
- **Expected Result**: Webhook delivered with correct payload and signature
- **Test Data**: New task + webhook config
- **Automation Notes**: Use nock or a test HTTP server to capture webhook

### T-AC-US-003-002-02: Webhook fires on status change with before/after

- **AC**: AC-US-003-002-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" has webhook; task "T1" with status "todo"
- **Steps**:
  1. Set up mock webhook receiver
  2. Update task "T1" status to "in_progress"
  3. Assert webhook received with event "task.status_changed"
  4. Assert payload includes previous status "todo" and new status "in_progress"
- **Expected Result**: Status change event with before/after values
- **Test Data**: Task status transition
- **Automation Notes**: Verify both old and new values in payload

### T-AC-US-003-002-03: No webhook when none configured

- **AC**: AC-US-003-002-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" has no webhook configured
- **Steps**:
  1. Ensure no webhook is configured on board "B1"
  2. Create a task on board "B1"
  3. Assert no outbound HTTP request is made
  4. Assert task creation succeeds normally
- **Expected Result**: Task operation succeeds; no webhook attempted
- **Test Data**: Board without webhook config
- **Automation Notes**: Verify via network monitoring or mock that no request is sent

### T-AC-US-003-002-04: Multiple rapid events generate separate webhooks

- **AC**: AC-US-003-002-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" has webhook configured
- **Steps**:
  1. Set up mock webhook receiver
  2. Fire 3 task events within 1 second
  3. Assert 3 separate webhook deliveries received
  4. Assert each has the correct event type and distinct task snapshot
- **Expected Result**: 3 separate, correctly ordered webhooks
- **Test Data**: 3 rapid task operations
- **Automation Notes**: Race condition test; verify ordering

### T-AC-US-003-003-01: Webhook retried successfully after initial failure

- **AC**: AC-US-003-003-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" has webhook configured; endpoint fails first attempt
- **Steps**:
  1. Set up mock webhook receiver to return 500 on first request, 200 on second
  2. Trigger a task event on board "B1"
  3. Wait for retry (approximately 1 second)
  4. Assert webhook delivered successfully on second attempt
  5. Assert delivery marked as successful
- **Expected Result**: Successful delivery after retry
- **Test Data**: Task event + failing endpoint
- **Automation Notes**: Mock endpoint behavior per request count

### T-AC-US-003-003-02: Webhook marked failed after all retries exhausted

- **AC**: AC-US-003-003-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" has webhook configured; endpoint always returns 500
- **Steps**:
  1. Set up mock webhook receiver to always return 500
  2. Trigger a task event on board "B1"
  3. Wait for all retries to complete (approximately 21 seconds total)
  4. Assert 4 total attempts made (1 initial + 3 retries)
  5. Assert delivery marked as permanently failed
- **Expected Result**: Delivery fails permanently after 4 attempts
- **Test Data**: Always-failing endpoint
- **Automation Notes**: May need increased test timeout (30+ seconds)

### T-AC-US-003-003-03: Webhook retry timing follows exponential backoff

- **AC**: AC-US-003-003-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" has webhook configured; endpoint always fails
- **Steps**:
  1. Set up mock webhook receiver to always return 500, recording timestamps
  2. Trigger a task event at time T
  3. Assert retry 1 arrives at approximately T+1s (tolerance 500ms)
  4. Assert retry 2 arrives at approximately T+5s (tolerance 500ms)
  5. Assert retry 3 arrives at approximately T+21s (tolerance 500ms)
- **Expected Result**: Retries follow 1s, 4s, 16s exponential backoff schedule
- **Test Data**: Always-failing endpoint with timestamp recording
- **Automation Notes**: Record wall-clock times; use tolerance for assertion

---

## F4: Search and Filtering

### T-AC-US-004-001-01: Full-text search returns matching tasks

- **AC**: AC-US-004-001-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: User has access to boards "B1" and "B2" with tasks containing "login"
- **Steps**:
  1. Seed task on "B1" with title "Fix login bug"
  2. Seed task on "B2" with description "Login page crashes on submit"
  3. Send GET /tasks/search?q=login
  4. Assert response contains both tasks
- **Expected Result**: Both matching tasks returned
- **Test Data**: Tasks with "login" in title and description
- **Automation Notes**: Verify case-insensitive matching

### T-AC-US-004-001-02: Search with no results returns empty collection

- **AC**: AC-US-004-001-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: User has access to board "B1" with 3 tasks, none mentioning "quantum"
- **Steps**:
  1. Send GET /tasks/search?q=quantum
  2. Assert response status is 200
  3. Assert response is empty JSON:API collection
  4. Assert meta.total is 0
- **Expected Result**: HTTP 200 with empty collection
- **Test Data**: Search term not present in any task
- **Automation Notes**: Verify meta.total field exists and equals 0

### T-AC-US-004-001-03: Search without query parameter returns 422

- **AC**: AC-US-004-001-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send GET /tasks/search without "q" parameter
  2. Assert response status is 422
  3. Assert error detail contains "Search query parameter 'q' is required"
- **Expected Result**: HTTP 422 with missing parameter error
- **Test Data**: No query parameter
- **Automation Notes**: Also test with empty q= (should also fail)

### T-AC-US-004-001-04: Search scoped to accessible boards only

- **AC**: AC-US-004-001-04
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: User has access to "B1" only; matching task exists on "B2"
- **Steps**:
  1. Seed matching task on "B2" (inaccessible board)
  2. Send GET /tasks/search?q=deploy as user with access only to "B1"
  3. Assert response does not include tasks from "B2"
- **Expected Result**: Results scoped to user's accessible boards
- **Test Data**: Task on inaccessible board
- **Automation Notes**: Security/authorization test

### T-AC-US-004-002-01: Filter tasks by single attribute

- **AC**: AC-US-004-002-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" with 10 tasks, 3 with priority "P0"
- **Steps**:
  1. Send GET /tasks/search?filter[priority]=P0
  2. Assert response contains exactly 3 tasks
  3. Assert all returned tasks have priority "P0"
- **Expected Result**: Only P0 tasks returned
- **Test Data**: 10 tasks with mixed priorities
- **Automation Notes**: Test each filter field individually

### T-AC-US-004-002-02: Filter tasks by combined attributes

- **AC**: AC-US-004-002-02
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Board "B1" with tasks of various statuses and assignees
- **Steps**:
  1. Send GET /tasks/search?filter[status]=in_progress&filter[assignee]=U1
  2. Assert all returned tasks are both in_progress AND assigned to U1
- **Expected Result**: AND-combined filter results
- **Test Data**: Tasks with mixed status/assignee combinations
- **Automation Notes**: Verify AND logic (not OR)

### T-AC-US-004-002-03: Filter tasks by due date range

- **AC**: AC-US-004-002-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" with tasks spanning 2026-03-01 to 2026-03-31
- **Steps**:
  1. Send GET /tasks/search?filter[due_date_from]=2026-03-10&filter[due_date_to]=2026-03-15
  2. Assert all returned tasks have due_date between 2026-03-10 and 2026-03-15 inclusive
- **Expected Result**: Only tasks within date range returned
- **Test Data**: Tasks with due dates spread across March 2026
- **Automation Notes**: Test boundary dates (10th and 15th should be included)

### T-AC-US-004-002-04: Reject unknown filter field

- **AC**: AC-US-004-002-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send GET /tasks/search?filter[nonexistent_field]=value
  2. Assert response status is 400
  3. Assert error detail contains "Unknown filter field: nonexistent_field"
- **Expected Result**: HTTP 400 with unknown field error
- **Test Data**: Invalid filter field name
- **Automation Notes**: Error handling test

### T-AC-US-004-003-01: Default pagination at 20 items

- **AC**: AC-US-004-003-01
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: 50 tasks matching search query
- **Steps**:
  1. Seed 50 matching tasks
  2. Send GET /tasks/search?q=bug without pagination parameters
  3. Assert response contains 20 tasks
  4. Assert meta.total is 50
  5. Assert links.next is present
- **Expected Result**: 20 tasks with pagination metadata
- **Test Data**: 50 matching tasks
- **Automation Notes**: Verify JSON:API pagination links

### T-AC-US-004-003-02: Custom page size with sort by priority descending

- **AC**: AC-US-004-003-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: 50 tasks matching search query with mixed priorities
- **Steps**:
  1. Send GET /tasks/search?q=bug&page[size]=10&sort=-priority
  2. Assert response contains 10 tasks
  3. Assert tasks are sorted by priority descending (P0 before P1, etc.)
- **Expected Result**: 10 tasks sorted by priority desc
- **Test Data**: Tasks with P0-P3 priorities
- **Automation Notes**: Verify sort order of returned items

### T-AC-US-004-003-03: Reject page size exceeding 100

- **AC**: AC-US-004-003-03
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send GET /tasks/search?q=bug&page[size]=200
  2. Assert response status is 422
  3. Assert error detail contains "Page size must not exceed 100"
- **Expected Result**: HTTP 422 with page size error
- **Test Data**: Page size 200
- **Automation Notes**: Boundary value: test 100 (should succeed), 101 (should fail)

### T-AC-US-004-003-04: Last page returns fewer items

- **AC**: AC-US-004-003-04
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: 25 matching tasks, page size 20
- **Steps**:
  1. Send GET /tasks/search?q=bug&page[number]=2&page[size]=20
  2. Assert response contains 5 tasks
  3. Assert links.next is absent (last page)
- **Expected Result**: 5 remaining tasks on last page
- **Test Data**: 25 matching tasks
- **Automation Notes**: Verify no next link on last page

---

## F5: Activity Log

### T-AC-US-005-001-01: Task update creates activity log entry

- **AC**: AC-US-005-001-01
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Task "T1" exists with status "todo"
- **Steps**:
  1. Update task "T1" status to "in_progress"
  2. Query activity log for task "T1"
  3. Assert log entry contains actor, action "task.updated", timestamp, and before/after for status
- **Expected Result**: Immutable log entry with change details
- **Test Data**: Status change from "todo" to "in_progress"
- **Automation Notes**: Verify immutability (no update/delete endpoint for logs)

### T-AC-US-005-001-02: Task creation creates activity log entry

- **AC**: AC-US-005-001-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" exists
- **Steps**:
  1. Create a new task on board "B1"
  2. Query activity log for the new task
  3. Assert log entry contains actor, action "task.created", timestamp, and after-state
- **Expected Result**: Creation event logged
- **Test Data**: New task
- **Automation Notes**: Verify after-state matches created task

### T-AC-US-005-001-03: Multi-field update creates single log entry

- **AC**: AC-US-005-001-03
- **Type**: Integration
- **Priority**: P2
- **Preconditions**: Task "T1" exists on board "B1"
- **Steps**:
  1. Update both status and priority of task "T1" in one PATCH request
  2. Query activity log for task "T1"
  3. Assert exactly one new log entry with before/after for both fields
- **Expected Result**: Single log entry for multi-field update
- **Test Data**: Combined status + priority update
- **Automation Notes**: Verify both fields present in the single entry

### T-AC-US-005-002-01: Retrieve activity log for a task

- **AC**: AC-US-005-002-01
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Task "T1" has 5 activity log entries
- **Steps**:
  1. Send GET /boards/B1/tasks/T1/activity
  2. Assert response status is 200
  3. Assert 5 log entries returned in reverse chronological order
- **Expected Result**: Task activity log retrieved successfully
- **Test Data**: Task with 5 logged actions
- **Automation Notes**: Verify ordering by timestamp desc

### T-AC-US-005-002-02: Retrieve activity log for a board

- **AC**: AC-US-005-002-02
- **Type**: Integration
- **Priority**: P1
- **Preconditions**: Board "B1" has 20 activity log entries
- **Steps**:
  1. Send GET /boards/B1/activity
  2. Assert response status is 200
  3. Assert paginated response with log entries
- **Expected Result**: Board-level activity log retrieved
- **Test Data**: 20 activity entries across tasks
- **Automation Notes**: Verify pagination metadata

### T-AC-US-005-002-03: Unauthorized user cannot view board activity

- **AC**: AC-US-005-002-03
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: User is not a member of board "B1"
- **Steps**:
  1. Authenticate as a user not on board "B1"
  2. Send GET /boards/B1/activity
  3. Assert response status is 403
- **Expected Result**: HTTP 403 access denied
- **Test Data**: Non-member user
- **Automation Notes**: Authorization test

### T-AC-US-005-003-01: Entries older than 90 days are purged

- **AC**: AC-US-005-003-01
- **Type**: Integration
- **Priority**: P2
- **Preconditions**: Activity log entries exist from 30 to 120 days ago
- **Steps**:
  1. Seed entries with timestamps at 30, 60, 90, and 120 days ago
  2. Trigger retention purge job
  3. Assert entries at 120 days ago are deleted
  4. Assert entries at 30, 60, and 90 days are retained
- **Expected Result**: Only entries older than 90 days are purged
- **Test Data**: Entries with various ages
- **Automation Notes**: May need to manipulate timestamps directly in DB

### T-AC-US-005-003-02: Entry at exactly 90 days is retained

- **AC**: AC-US-005-003-02
- **Type**: Integration
- **Priority**: P2
- **Preconditions**: Entry exists at exactly 90 days old
- **Steps**:
  1. Seed entry at exactly 90 days ago (00:00:00 UTC)
  2. Trigger retention purge job
  3. Assert entry is still present
- **Expected Result**: Entry at boundary is retained
- **Test Data**: Entry with timestamp exactly 90 days ago
- **Automation Notes**: Boundary value test [ASSUMPTION: inclusive 90-day retention]

### T-AC-US-005-003-03: Purge job succeeds with no old entries

- **AC**: AC-US-005-003-03
- **Type**: Integration
- **Priority**: P2
- **Preconditions**: All entries are less than 90 days old
- **Steps**:
  1. Ensure all entries are recent
  2. Trigger retention purge job
  3. Assert no entries deleted
  4. Assert job completes without error
- **Expected Result**: Purge job is a no-op, no errors
- **Test Data**: Only recent entries
- **Automation Notes**: Verify idempotent behavior

---

## NFR Test Skeletons

### T-NFR-001-001: API response time under load

- **NFR**: NFR-001-001
- **Type**: Performance
- **Priority**: P0
- **Preconditions**: Application deployed; database seeded with representative data
- **Steps**:
  1. Configure k6 or artillery with 50 virtual concurrent users
  2. Run mixed read/write workload for 10 minutes
  3. Collect p95 latency metric
  4. Assert p95 latency <= 200ms
- **Expected Result**: p95 response time under 200ms
- **Automation Notes**: Run against staging environment; include task CRUD, search, and board operations

### T-NFR-001-002: Rate limiting enforcement

- **NFR**: NFR-001-002
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Authenticated user
- **Steps**:
  1. Send 100 requests within 60 seconds from a single user
  2. Assert all 100 return 200
  3. Send request 101 within the same minute
  4. Assert request 101 returns HTTP 429
- **Expected Result**: 101st request rate-limited
- **Automation Notes**: Verify 429 response includes Retry-After header [ASSUMPTION]

### T-NFR-002-001: Unauthenticated requests rejected

- **NFR**: NFR-002-001
- **Type**: Security
- **Priority**: P0
- **Preconditions**: Application running
- **Steps**:
  1. Send request without Authorization header
  2. Assert HTTP 401
  3. Send request with expired JWT
  4. Assert HTTP 401
  5. Send request with tampered JWT
  6. Assert HTTP 401
- **Expected Result**: All unauthenticated requests rejected
- **Automation Notes**: Test all critical endpoints

### T-NFR-002-002: RBAC matrix validation

- **NFR**: NFR-002-002
- **Type**: Security
- **Priority**: P0
- **Preconditions**: Users with Admin, Member, and Viewer roles
- **Steps**:
  1. For each endpoint, test with each role
  2. Assert Admin can perform all operations
  3. Assert Member can CRUD tasks but not manage board settings
  4. Assert Viewer can only read
- **Expected Result**: No authorization bypass
- **Automation Notes**: Matrix of all endpoints x all roles

### T-NFR-002-003: Webhook HMAC signature verification

- **NFR**: NFR-002-003
- **Type**: Security
- **Priority**: P0
- **Preconditions**: Webhook configured with known secret
- **Steps**:
  1. Trigger a task event
  2. Capture webhook delivery
  3. Recompute HMAC-SHA256 of payload using the secret
  4. Assert X-Signature-256 header matches
- **Expected Result**: Valid HMAC signature on every webhook
- **Automation Notes**: Verify signature algorithm and header format

### T-NFR-003-001: Performance with 10,000 tasks per board

- **NFR**: NFR-003-001
- **Type**: Performance
- **Priority**: P0
- **Preconditions**: Board seeded with 10,000 tasks
- **Steps**:
  1. Seed a board with 10,000 tasks
  2. Run standard CRUD and list operations
  3. Assert p95 latency remains under 200ms
- **Expected Result**: No performance degradation at scale
- **Automation Notes**: Include list, search, and filter operations

### T-NFR-003-002: 50 concurrent users without errors

- **NFR**: NFR-003-002
- **Type**: Performance
- **Priority**: P0
- **Preconditions**: Application deployed
- **Steps**:
  1. Configure load test with 50 concurrent virtual users
  2. Run for 10 minutes with mixed operations
  3. Assert 0% error rate
- **Expected Result**: Zero errors under 50 concurrent users
- **Automation Notes**: Monitor HTTP 5xx responses

### T-NFR-004-001: Uptime monitoring

- **NFR**: NFR-004-001
- **Type**: Reliability
- **Priority**: P0
- **Preconditions**: Application deployed with health check endpoint
- **Steps**:
  1. Configure monitoring to poll /healthz every 30 seconds
  2. Run for 30-day period
  3. Calculate uptime percentage
  4. Assert >= 99.5%
- **Expected Result**: 99.5% uptime achieved
- **Automation Notes**: Long-running monitoring; integrate with alerting

### T-NFR-004-002: Zero data loss on mutations

- **NFR**: NFR-004-002
- **Type**: Reliability
- **Priority**: P0
- **Preconditions**: Application deployed with database
- **Steps**:
  1. Execute 1,000 task mutations (create/update/delete)
  2. Verify all mutations persisted in database
  3. Simulate database failover during writes
  4. Verify committed transactions survive failover
- **Expected Result**: Zero data loss
- **Automation Notes**: Use pg_stat_activity to verify transactions

### T-NFR-004-003: Webhook delivery rate exceeds 99%

- **NFR**: NFR-004-003
- **Type**: Reliability
- **Priority**: P0
- **Preconditions**: Webhook configured; endpoint fails 2% of time randomly
- **Steps**:
  1. Send 10,000 task events
  2. Mock endpoint to fail 2% randomly
  3. Wait for all retries to complete
  4. Calculate delivery success rate
  5. Assert >= 99%
- **Expected Result**: >= 99% delivery rate with retries
- **Automation Notes**: Statistical test; run multiple times

### T-NFR-005-001: JSON:API response format validation

- **NFR**: NFR-005-001
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Application running
- **Steps**:
  1. Send requests to all API endpoints
  2. Validate each response against JSON:API v1.1 schema
  3. Assert 100% compliance
- **Expected Result**: All responses are valid JSON:API
- **Automation Notes**: Use json-api-validator or similar schema checker

### T-NFR-006-001: TypeScript strict mode compilation

- **NFR**: NFR-006-001
- **Type**: Unit
- **Priority**: P0
- **Preconditions**: Source code complete
- **Steps**:
  1. Run `tsc --noEmit` with strict mode enabled
  2. Assert exit code 0
- **Expected Result**: Zero type errors
- **Automation Notes**: Include in CI pipeline

### T-NFR-006-002: Test coverage meets 80% threshold

- **NFR**: NFR-006-002
- **Type**: Unit
- **Priority**: P1
- **Preconditions**: Test suite exists
- **Steps**:
  1. Run tests with coverage reporting
  2. Assert line coverage >= 80%
- **Expected Result**: 80%+ line coverage
- **Automation Notes**: Use c8 for Node.js native coverage [PROPOSED DEFAULT]

### T-NFR-007-001: Docker container starts and passes health checks

- **NFR**: NFR-007-001
- **Type**: Integration
- **Priority**: P0
- **Preconditions**: Docker image built
- **Steps**:
  1. Start container
  2. Wait up to 30 seconds
  3. Assert /healthz returns 200
  4. Assert /readyz returns 200
- **Expected Result**: Container healthy within 30 seconds
- **Automation Notes**: Include in CI/CD pipeline [PROPOSED DEFAULT]
