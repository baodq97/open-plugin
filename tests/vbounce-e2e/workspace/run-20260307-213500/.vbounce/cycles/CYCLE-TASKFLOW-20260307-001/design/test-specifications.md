# Test Specifications: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## 1. Integration Test Specifications (ITS-*)

### ITS-001: Create Task -- Happy Path

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-001-001
- **AC**: AC-US-001-001-01
- **Preconditions**:
  - Board "B1" exists with default columns
  - User "U1" is a Member of board "B1"
  - JWT token valid for user "U1"
- **Request**:
  ```
  POST /v1/boards/B1/tasks
  Authorization: Bearer <U1-token>
  Content-Type: application/vnd.api+json

  {
    "data": {
      "type": "tasks",
      "attributes": {
        "title": "Fix login bug",
        "status": "todo",
        "priority": "P1"
      }
    }
  }
  ```
- **Expected Response**:
  - Status: 201 Created
  - Body: JSON:API resource with `type: "tasks"`, server-generated `id` (UUID), `created_at` timestamp, all submitted attributes
  - `data.relationships.board.data.id` equals "B1"
- **Assertions**:
  1. Response status is 201
  2. `data.id` is a valid UUID
  3. `data.attributes.title` equals "Fix login bug"
  4. `data.attributes.status` equals "todo"
  5. `data.attributes.priority` equals "P1"
  6. `data.attributes.created_at` is a valid ISO 8601 timestamp
  7. Response conforms to JSON:API schema
- **Error Scenarios**: None (happy path)

---

### ITS-002: Create Task -- Missing Title

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-001-001
- **AC**: AC-US-001-001-02
- **Preconditions**: User "U1" is a Member of board "B1"
- **Request**:
  ```
  POST /v1/boards/B1/tasks
  Authorization: Bearer <U1-token>
  Content-Type: application/vnd.api+json

  {
    "data": {
      "type": "tasks",
      "attributes": {
        "status": "todo",
        "priority": "P1"
      }
    }
  }
  ```
- **Expected Response**:
  - Status: 422
  - Body: JSON:API error with `source.pointer: "/data/attributes/title"`, `detail: "Title is required"`
- **Assertions**:
  1. Response status is 422
  2. `errors[0].source.pointer` equals "/data/attributes/title"
  3. `errors[0].detail` contains "Title is required"

---

### ITS-003: Create Task -- Title Exceeds 200 Characters

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-001-001
- **AC**: AC-US-001-001-03
- **Preconditions**: User "U1" is a Member of board "B1"
- **Request**: POST with title of 201 characters ("a" repeated 201 times)
- **Expected Response**:
  - Status: 422
  - `detail: "Title must not exceed 200 characters"`
- **Assertions**:
  1. Response status is 422
  2. Error detail contains "Title must not exceed 200 characters"

---

### ITS-004: Create Task -- Viewer Role Rejected

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-001-001
- **AC**: AC-US-001-001-04
- **Preconditions**: User "U2" is a Viewer of board "B1"
- **Request**: POST with valid task payload, authenticated as Viewer
- **Expected Response**:
  - Status: 403
  - `detail: "Viewers cannot create tasks"`
- **Assertions**:
  1. Response status is 403
  2. Error detail contains "Viewers cannot create tasks"

---

### ITS-005: Create Task -- Maximum Tags Exceeded

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-001-001
- **AC**: AC-US-001-001-05
- **Preconditions**: User "U1" is a Member of board "B1"
- **Request**: POST with 11 tags
- **Expected Response**:
  - Status: 422
  - `detail: "Maximum 10 tags allowed"`
- **Assertions**:
  1. Response status is 422
  2. Error detail contains "Maximum 10 tags allowed"

---

### ITS-006: Get Single Task -- Happy Path

- **Endpoint**: GET /boards/:boardId/tasks/:taskId
- **User Story**: US-001-002
- **AC**: AC-US-001-002-01
- **Preconditions**: Task "T1" exists on board "B1"; user has any role on "B1"
- **Request**: GET /v1/boards/B1/tasks/T1
- **Expected Response**:
  - Status: 200
  - Body: JSON:API resource with all task fields
- **Assertions**:
  1. Response status is 200
  2. All fields present: title, description, status, priority, assignee, due_date, tags, created_at, updated_at
  3. `data.id` equals "T1"

---

### ITS-007: List Tasks on Board -- Happy Path

- **Endpoint**: GET /boards/:boardId/tasks
- **User Story**: US-001-002
- **AC**: AC-US-001-002-02
- **Preconditions**: 5 non-deleted tasks on board "B1"; user is a member
- **Request**: GET /v1/boards/B1/tasks
- **Expected Response**:
  - Status: 200
  - Body: JSON:API collection with exactly 5 tasks
- **Assertions**:
  1. Response status is 200
  2. `data` array length is 5
  3. `meta.total` equals 5

---

### ITS-008: Get Task -- Not Found

- **Endpoint**: GET /boards/:boardId/tasks/:taskId
- **User Story**: US-001-002
- **AC**: AC-US-001-002-03
- **Preconditions**: User is a member of "B1"; task ID does not exist
- **Request**: GET /v1/boards/B1/tasks/nonexistent-id
- **Expected Response**:
  - Status: 404
  - `detail: "Task not found"`
- **Assertions**:
  1. Response status is 404
  2. Error detail contains "Task not found"

---

### ITS-009: List Tasks -- Soft-Deleted Task Excluded

- **Endpoint**: GET /boards/:boardId/tasks
- **User Story**: US-001-002
- **AC**: AC-US-001-002-04
- **Preconditions**: Task "T1" is soft-deleted on board "B1"; 2 other active tasks exist
- **Request**: GET /v1/boards/B1/tasks
- **Expected Response**:
  - Status: 200
  - Collection does not include task "T1"
- **Assertions**:
  1. Response status is 200
  2. No item in `data` has `id` equal to "T1"
  3. `data` length is 2

---

### ITS-010: Update Task -- Happy Path

- **Endpoint**: PATCH /boards/:boardId/tasks/:taskId
- **User Story**: US-001-003
- **AC**: AC-US-001-003-01
- **Preconditions**: Task "T1" on "B1" with status "todo", priority "P2"; user is Member
- **Request**: PATCH with `{ status: "in_progress", priority: "P0" }`
- **Expected Response**:
  - Status: 200
  - Updated status and priority; updated_at refreshed
- **Assertions**:
  1. Response status is 200
  2. `data.attributes.status` equals "in_progress"
  3. `data.attributes.priority` equals "P0"
  4. `data.attributes.updated_at` is more recent than `created_at`

---

### ITS-011: Update Task -- Invalid Status

- **Endpoint**: PATCH /boards/:boardId/tasks/:taskId
- **User Story**: US-001-003
- **AC**: AC-US-001-003-02
- **Preconditions**: Task "T1" exists; user is Member
- **Request**: PATCH with `{ status: "invalid_status" }`
- **Expected Response**:
  - Status: 422
  - `detail: "Status must be one of: todo, in_progress, review, done"`
- **Assertions**:
  1. Response status is 422
  2. Error detail contains expected message

---

### ITS-012: Update Task -- Viewer Rejected

- **Endpoint**: PATCH /boards/:boardId/tasks/:taskId
- **User Story**: US-001-003
- **AC**: AC-US-001-003-03
- **Preconditions**: User is Viewer on "B1"; task "T1" exists
- **Request**: PATCH with any update
- **Expected Response**:
  - Status: 403
  - `detail: "Viewers cannot modify tasks"`
- **Assertions**:
  1. Response status is 403
  2. Error detail contains "Viewers cannot modify tasks"

---

### ITS-013: Update Task -- Description at Max Length

- **Endpoint**: PATCH /boards/:boardId/tasks/:taskId
- **User Story**: US-001-003
- **AC**: AC-US-001-003-04
- **Preconditions**: Task "T1" exists; user is Member
- **Request**: PATCH with description of exactly 5000 characters
- **Expected Response**:
  - Status: 200
  - Description preserved at 5000 chars
- **Assertions**:
  1. Response status is 200
  2. `data.attributes.description.length` equals 5000

---

### ITS-014: Soft-Delete -- Creator Deletes Own Task

- **Endpoint**: DELETE /boards/:boardId/tasks/:taskId
- **User Story**: US-001-004
- **AC**: AC-US-001-004-01
- **Preconditions**: User "U1" created task "T1" on "B1"
- **Request**: DELETE /v1/boards/B1/tasks/T1 as "U1"
- **Expected Response**:
  - Status: 200
  - `deleted_at` timestamp set
- **Assertions**:
  1. Response status is 200
  2. `data.attributes.deleted_at` is a valid timestamp
  3. Subsequent GET /boards/B1/tasks excludes "T1"

---

### ITS-015: Soft-Delete -- Admin Deletes Another's Task

- **Endpoint**: DELETE /boards/:boardId/tasks/:taskId
- **User Story**: US-001-004
- **AC**: AC-US-001-004-02
- **Preconditions**: Task "T1" created by "U1"; user "U2" is Admin on "B1"
- **Request**: DELETE /v1/boards/B1/tasks/T1 as Admin "U2"
- **Expected Response**:
  - Status: 200
  - `deleted_at` set
- **Assertions**:
  1. Response status is 200
  2. `deleted_at` is set

---

### ITS-016: Soft-Delete -- Non-Creator Member Rejected

- **Endpoint**: DELETE /boards/:boardId/tasks/:taskId
- **User Story**: US-001-004
- **AC**: AC-US-001-004-03
- **Preconditions**: Task "T1" created by "U1"; user "U2" is Member (not Admin)
- **Request**: DELETE as Member "U2"
- **Expected Response**:
  - Status: 403
  - `detail: "Only the task creator or an Admin can delete this task"`
- **Assertions**:
  1. Response status is 403
  2. Error detail matches expected message

---

### ITS-017: Soft-Delete -- Already Deleted Returns 404

- **Endpoint**: DELETE /boards/:boardId/tasks/:taskId
- **User Story**: US-001-004
- **AC**: AC-US-001-004-04
- **Preconditions**: Task "T1" already soft-deleted; user is Admin
- **Request**: DELETE /v1/boards/B1/tasks/T1
- **Expected Response**:
  - Status: 404
  - `detail: "Task not found"`
- **Assertions**:
  1. Response status is 404

---

### ITS-018: Create Board -- Happy Path with Defaults

- **Endpoint**: POST /boards
- **User Story**: US-002-001
- **AC**: AC-US-002-001-01
- **Preconditions**: Authenticated user
- **Request**: POST with `{ name: "Sprint Board" }` (no columns)
- **Expected Response**:
  - Status: 201
  - Board with 4 default columns: todo, in_progress, review, done
  - Owner set to requesting user
- **Assertions**:
  1. Response status is 201
  2. `data.attributes.columns` equals `["todo", "in_progress", "review", "done"]`
  3. `data.attributes.owner_id` equals requesting user's ID

---

### ITS-019: Create Board -- Missing Name

- **Endpoint**: POST /boards
- **User Story**: US-002-001
- **AC**: AC-US-002-001-02
- **Request**: POST with empty body
- **Expected Response**: 422, `detail: "Board name is required"`

---

### ITS-020: Create Board -- Name Exceeds 100 Characters

- **Endpoint**: POST /boards
- **User Story**: US-002-001
- **AC**: AC-US-002-001-03
- **Request**: POST with name of 101 characters
- **Expected Response**: 422, `detail: "Board name must not exceed 100 characters"`

---

### ITS-021: Create Board -- Custom 2-Column Layout

- **Endpoint**: POST /boards
- **User Story**: US-002-001
- **AC**: AC-US-002-001-04
- **Request**: POST with `{ name: "Minimal Board", columns: ["open", "closed"] }`
- **Expected Response**: 201, exactly 2 columns in order

---

### ITS-022: Create Board -- Fewer Than 2 Columns

- **Endpoint**: POST /boards
- **User Story**: US-002-001
- **AC**: AC-US-002-001-05
- **Request**: POST with `{ name: "Bad Board", columns: ["only_one"] }`
- **Expected Response**: 422, `detail: "A board must have at least 2 columns"`

---

### ITS-023: Update Board Columns -- Rename

- **Endpoint**: PATCH /boards/:boardId
- **User Story**: US-002-002
- **AC**: AC-US-002-002-01
- **Preconditions**: Board owner; board with 3 columns
- **Request**: PATCH with renamed columns
- **Expected Response**: 200, updated column names in order

---

### ITS-024: Update Board -- Reduce Below Minimum Columns

- **Endpoint**: PATCH /boards/:boardId
- **User Story**: US-002-002
- **AC**: AC-US-002-002-02
- **Request**: PATCH with `{ columns: ["only_one"] }`
- **Expected Response**: 422, "A board must have at least 2 columns"

---

### ITS-025: Update Board -- Non-Owner Member Rejected

- **Endpoint**: PATCH /boards/:boardId
- **User Story**: US-002-002
- **AC**: AC-US-002-002-03
- **Preconditions**: User is Member (not owner, not Admin)
- **Request**: PATCH with column updates
- **Expected Response**: 403, "Only the board owner or an Admin can modify board settings"

---

### ITS-026: Invite Member -- Happy Path

- **Endpoint**: POST /boards/:boardId/members
- **User Story**: US-002-003
- **AC**: AC-US-002-003-01
- **Preconditions**: Board owner of "B1"; user "U2" not yet a member
- **Request**: POST with `{ user_id: "U2", role: "Member" }`
- **Expected Response**: 201, membership resource
- **Assertions**:
  1. Status 201
  2. Role is "Member"
  3. User "U2" can subsequently access board "B1"

---

### ITS-027: Invite Member -- Invalid Role

- **Endpoint**: POST /boards/:boardId/members
- **User Story**: US-002-003
- **AC**: AC-US-002-003-02
- **Request**: POST with `{ user_id: "U2", role: "SuperAdmin" }`
- **Expected Response**: 422, "Role must be one of: Admin, Member, Viewer"

---

### ITS-028: Invite Member -- Non-Owner Member Rejected

- **Endpoint**: POST /boards/:boardId/members
- **User Story**: US-002-003
- **AC**: AC-US-002-003-03
- **Preconditions**: User is Member (not owner/Admin)
- **Request**: POST with valid invite payload
- **Expected Response**: 403, "Only the board owner or an Admin can invite members"

---

### ITS-029: Invite Member -- Update Existing Member Role

- **Endpoint**: POST /boards/:boardId/members
- **User Story**: US-002-003
- **AC**: AC-US-002-003-04
- **Preconditions**: User "U2" is already a Member; requesting as owner
- **Request**: POST with `{ user_id: "U2", role: "Admin" }`
- **Expected Response**: 200, role updated to "Admin"

---

### ITS-030: Configure Webhook -- Happy Path

- **Endpoint**: POST /boards/:boardId/webhooks
- **User Story**: US-003-001
- **AC**: AC-US-003-001-01
- **Preconditions**: Board owner or Admin of "B1"
- **Request**: POST with `{ url: "https://example.com/hook", secret: "my-secret-key-1234" }`
- **Expected Response**: 201, webhook resource with masked secret
- **Assertions**:
  1. Status 201
  2. URL matches
  3. Secret is masked (not plaintext)

---

### ITS-031: Configure Webhook -- Invalid URL

- **Endpoint**: POST /boards/:boardId/webhooks
- **User Story**: US-003-001
- **AC**: AC-US-003-001-02
- **Request**: POST with `{ url: "not-a-valid-url", secret: "key" }`
- **Expected Response**: 422, "Webhook URL must be a valid HTTPS URL"

---

### ITS-032: Configure Webhook -- Non-Owner/Non-Admin Rejected

- **Endpoint**: POST /boards/:boardId/webhooks
- **User Story**: US-003-001
- **AC**: AC-US-003-001-03
- **Preconditions**: User is Member (not owner/Admin)
- **Request**: POST with valid webhook payload
- **Expected Response**: 403, "Only the board owner or an Admin can configure webhooks"

---

### ITS-033: Webhook Fires on Task Creation

- **Endpoint**: POST /boards/:boardId/tasks (triggers webhook)
- **User Story**: US-003-002
- **AC**: AC-US-003-002-01
- **Preconditions**: Board "B1" has webhook at mock server; mock server listening
- **Request**: Create a task on "B1"
- **Expected Response**: Task created (201); webhook received within 5s
- **Assertions**:
  1. Mock server receives POST
  2. Payload `event` equals "task.created"
  3. Payload contains full task snapshot
  4. `X-Signature-256` header present and valid HMAC
  5. Payload contains actor user_id and ISO 8601 timestamp

---

### ITS-034: Webhook Fires on Status Change

- **Endpoint**: PATCH /boards/:boardId/tasks/:taskId (triggers webhook)
- **User Story**: US-003-002
- **AC**: AC-US-003-002-02
- **Preconditions**: Webhook configured; task "T1" with status "todo"
- **Request**: PATCH status to "in_progress"
- **Expected Response**: Webhook with event "task.status_changed", previous "todo", new "in_progress"

---

### ITS-035: No Webhook When None Configured

- **Endpoint**: POST /boards/:boardId/tasks
- **User Story**: US-003-002
- **AC**: AC-US-003-002-03
- **Preconditions**: Board "B1" has no webhook
- **Request**: Create a task
- **Expected Response**: 201; no outbound HTTP request made
- **Assertions**:
  1. Task created successfully
  2. Network monitor confirms no outbound webhook call

---

### ITS-036: Multiple Rapid Events Generate Separate Webhooks

- **Endpoint**: Multiple task operations
- **User Story**: US-003-002
- **AC**: AC-US-003-002-04
- **Preconditions**: Webhook configured on "B1"
- **Request**: 3 task operations within 1 second
- **Expected Response**: 3 separate webhook deliveries
- **Assertions**:
  1. Mock server receives exactly 3 requests
  2. Each has correct event type
  3. Each has distinct task snapshot

---

### ITS-037: Webhook Retry -- Successful on Second Attempt

- **Endpoint**: Webhook delivery system
- **User Story**: US-003-003
- **AC**: AC-US-003-003-01
- **Preconditions**: Mock server returns 500 on first request, 200 on second
- **Request**: Trigger task event
- **Expected Response**: Delivery succeeds on attempt 2
- **Assertions**:
  1. Mock server receives 2 requests
  2. First response 500, second 200
  3. Delivery marked as "success"

---

### ITS-038: Webhook Retry -- All Retries Exhausted

- **Endpoint**: Webhook delivery system
- **User Story**: US-003-003
- **AC**: AC-US-003-003-02
- **Preconditions**: Mock server always returns 500
- **Request**: Trigger task event
- **Expected Response**: 4 total attempts; delivery marked "permanently_failed"
- **Assertions**:
  1. Mock server receives exactly 4 requests
  2. Delivery record status is "permanently_failed"
  3. No further retries attempted

---

### ITS-039: Webhook Retry -- Exponential Backoff Timing

- **Endpoint**: Webhook delivery system
- **User Story**: US-003-003
- **AC**: AC-US-003-003-03
- **Preconditions**: Mock server always returns 500, records timestamps
- **Request**: Trigger task event at time T
- **Expected Response**: Retries at T+1s, T+5s, T+21s (with 500ms tolerance)
- **Assertions**:
  1. Retry 1 at approximately T+1s (+/- 500ms)
  2. Retry 2 at approximately T+5s (+/- 500ms)
  3. Retry 3 at approximately T+21s (+/- 500ms)

---

### ITS-040: Full-Text Search -- Happy Path

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-001
- **AC**: AC-US-004-001-01
- **Preconditions**: User has access to "B1" and "B2"; task on "B1" titled "Fix login bug"; task on "B2" with description containing "Login page crashes"
- **Request**: GET /tasks/search?q=login
- **Expected Response**: 200, both tasks returned
- **Assertions**:
  1. Response contains 2 tasks
  2. Tasks from both boards included

---

### ITS-041: Full-Text Search -- No Results

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-001
- **AC**: AC-US-004-001-02
- **Request**: GET /tasks/search?q=quantum
- **Expected Response**: 200, empty collection, `meta.total: 0`

---

### ITS-042: Full-Text Search -- Missing Query Parameter

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-001
- **AC**: AC-US-004-001-03
- **Request**: GET /tasks/search (no `q`)
- **Expected Response**: 422, "Search query parameter 'q' is required"

---

### ITS-043: Full-Text Search -- Access Scoping

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-001
- **AC**: AC-US-004-001-04
- **Preconditions**: User has access to "B1" only; matching task exists on "B2"
- **Request**: GET /tasks/search?q=deploy
- **Expected Response**: 200, results only from "B1"; no tasks from "B2"

---

### ITS-044: Filter -- Single Attribute (Priority)

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-002
- **AC**: AC-US-004-002-01
- **Preconditions**: 10 tasks on "B1", 3 with priority "P0"
- **Request**: GET /tasks/search?filter[priority]=P0
- **Expected Response**: 200, exactly 3 tasks, all with priority "P0"

---

### ITS-045: Filter -- Combined Attributes

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-002
- **AC**: AC-US-004-002-02
- **Request**: GET /tasks/search?filter[status]=in_progress&filter[assignee]=U1
- **Expected Response**: 200, only tasks that are both in_progress AND assigned to U1

---

### ITS-046: Filter -- Due Date Range

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-002
- **AC**: AC-US-004-002-03
- **Preconditions**: Tasks with due dates across March 2026
- **Request**: GET /tasks/search?filter[due_date_from]=2026-03-10&filter[due_date_to]=2026-03-15
- **Expected Response**: 200, only tasks with due_date in [2026-03-10, 2026-03-15]

---

### ITS-047: Filter -- Unknown Field Rejected

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-002
- **AC**: AC-US-004-002-04
- **Request**: GET /tasks/search?filter[nonexistent_field]=value
- **Expected Response**: 400, "Unknown filter field: nonexistent_field"

---

### ITS-048: Pagination -- Default 20 Items

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-003
- **AC**: AC-US-004-003-01
- **Preconditions**: 50 matching tasks
- **Request**: GET /tasks/search?q=bug (no pagination params)
- **Expected Response**: 200, 20 tasks, `meta.total: 50`, `links.next` present

---

### ITS-049: Pagination -- Custom Size and Sort

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-003
- **AC**: AC-US-004-003-02
- **Request**: GET /tasks/search?q=bug&page[size]=10&sort=-priority
- **Expected Response**: 200, 10 tasks sorted by priority descending

---

### ITS-050: Pagination -- Page Size Exceeds Max

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-003
- **AC**: AC-US-004-003-03
- **Request**: GET /tasks/search?q=bug&page[size]=200
- **Expected Response**: 422, "Page size must not exceed 100"

---

### ITS-051: Pagination -- Last Page Partial

- **Endpoint**: GET /tasks/search
- **User Story**: US-004-003
- **AC**: AC-US-004-003-04
- **Preconditions**: 25 matching tasks
- **Request**: GET /tasks/search?q=bug&page[number]=2&page[size]=20
- **Expected Response**: 200, 5 tasks, no `links.next`

---

### ITS-052: Activity Log -- Task Update Logged

- **Endpoint**: GET /boards/:boardId/tasks/:taskId/activity (after PATCH)
- **User Story**: US-005-001
- **AC**: AC-US-005-001-01
- **Preconditions**: Task "T1" with status "todo"; update status to "in_progress"
- **Expected Response**: Activity log entry with action "task.updated", before/after for status

---

### ITS-053: Activity Log -- Task Creation Logged

- **Endpoint**: GET /boards/:boardId/tasks/:taskId/activity (after POST)
- **User Story**: US-005-001
- **AC**: AC-US-005-001-02
- **Preconditions**: Create a new task
- **Expected Response**: Activity log entry with action "task.created", after-state

---

### ITS-054: Activity Log -- Multi-Field Update Single Entry

- **Endpoint**: PATCH (then GET activity)
- **User Story**: US-005-001
- **AC**: AC-US-005-001-03
- **Request**: PATCH both status and priority in one request
- **Expected Response**: Exactly one new activity log entry with both fields in changes

---

### ITS-055: Retrieve Task Activity Log

- **Endpoint**: GET /boards/:boardId/tasks/:taskId/activity
- **User Story**: US-005-002
- **AC**: AC-US-005-002-01
- **Preconditions**: Task "T1" has 5 activity entries
- **Expected Response**: 200, 5 entries in reverse chronological order

---

### ITS-056: Retrieve Board Activity Log

- **Endpoint**: GET /boards/:boardId/activity
- **User Story**: US-005-002
- **AC**: AC-US-005-002-02
- **Preconditions**: Board "B1" has 20 activity entries
- **Expected Response**: 200, paginated collection

---

### ITS-057: Activity Log -- Unauthorized Access

- **Endpoint**: GET /boards/:boardId/activity
- **User Story**: US-005-002
- **AC**: AC-US-005-002-03
- **Preconditions**: User not a member of "B1"
- **Expected Response**: 403, "You do not have access to this board"

---

### ITS-058: Retention Purge -- Entries Older Than 90 Days

- **Endpoint**: Internal retention job
- **User Story**: US-005-003
- **AC**: AC-US-005-003-01
- **Preconditions**: Entries at 30, 60, 90, and 120 days ago
- **Expected Response**: 120-day entry deleted; 30, 60, 90-day entries retained

---

### ITS-059: Retention Purge -- Boundary at 90 Days

- **Endpoint**: Internal retention job
- **User Story**: US-005-003
- **AC**: AC-US-005-003-02
- **Preconditions**: Entry at exactly 90 days ago
- **Expected Response**: Entry retained (inclusive boundary)

---

### ITS-060: Retention Purge -- No Entries to Purge

- **Endpoint**: Internal retention job
- **User Story**: US-005-003
- **AC**: AC-US-005-003-03
- **Preconditions**: All entries less than 90 days old
- **Expected Response**: No entries deleted; job completes without error

---

## 2. System Test Specifications (STS-*)

### STS-001: End-to-End Task Lifecycle

- **Flow**: Create Board -> Invite Members -> Create Task -> Read Task -> Update Task -> Search Task -> Soft-Delete Task -> Verify Deletion
- **Steps**:
  1. POST /boards to create "Sprint Board" -- verify 201
  2. POST /boards/:id/members to add Member "U2" -- verify 201
  3. POST /boards/:id/members to add Viewer "U3" -- verify 201
  4. POST /boards/:id/tasks as "U2" (Member) -- verify 201
  5. GET /boards/:id/tasks/:taskId as "U3" (Viewer) -- verify 200 with all fields
  6. PATCH /boards/:id/tasks/:taskId as "U2" to change status -- verify 200
  7. GET /tasks/search?q=<task-title> as "U2" -- verify task found
  8. DELETE /boards/:id/tasks/:taskId as "U2" (creator) -- verify 200
  9. GET /boards/:id/tasks as "U2" -- verify task excluded
  10. GET /tasks/search?q=<task-title> as "U2" -- verify task excluded from search
- **Expected Outcome**: Complete lifecycle succeeds; all HTTP statuses correct

---

### STS-002: Task Update with Activity Log and Webhook

- **Flow**: Configure Webhook -> Create Task -> Update Task -> Verify Activity Log -> Verify Webhook
- **Steps**:
  1. POST /boards/:id/webhooks with mock server URL
  2. POST /boards/:id/tasks to create task
  3. Verify webhook received for "task.created"
  4. PATCH /boards/:id/tasks/:taskId to change status
  5. Verify webhook received for "task.status_changed" with before/after
  6. GET /boards/:id/tasks/:taskId/activity -- verify 2 entries (created + updated)
  7. Verify activity log entries have correct before/after values
- **Expected Outcome**: Webhook delivery and activity logging both triggered correctly

---

### STS-003: Webhook Delivery with Multiple Events

- **Flow**: Configure Webhook -> Create 3 Tasks Rapidly -> Verify 3 Webhooks
- **Steps**:
  1. POST /boards/:id/webhooks with mock server
  2. Rapidly POST 3 tasks within 1 second
  3. Wait up to 10 seconds
  4. Verify mock server received exactly 3 webhooks
  5. Each webhook has unique delivery_id and correct task snapshot
- **Expected Outcome**: All events delivered separately and correctly

---

### STS-004: Webhook Retry Full Lifecycle

- **Flow**: Configure Webhook -> Trigger Event -> Mock Failure -> Verify Retries -> Verify Final Status
- **Steps**:
  1. Configure webhook with mock server programmed to: fail 3 times, succeed on 4th attempt
  2. Create a task to trigger webhook
  3. Mock server returns 500 on attempts 1-3
  4. Mock server returns 200 on attempt 4
  5. Verify 4 total requests received
  6. Verify exponential backoff timing (1s, 4s, 16s between retries)
  7. Verify delivery status is "success" with attempt_count = 4
- **Expected Outcome**: Retry mechanism works correctly with backoff schedule

---

### STS-005: Cross-Board Search Scoping

- **Flow**: Create 2 Boards -> Add Different Members -> Create Tasks -> Search -> Verify Scoping
- **Steps**:
  1. User "U1" creates Board "B1" and Board "B2"
  2. Invite "U2" as Member of "B1" only
  3. Create task titled "Deploy service" on both "B1" and "B2"
  4. Search as "U2": GET /tasks/search?q=deploy
  5. Verify only task from "B1" returned
  6. Search as "U1": GET /tasks/search?q=deploy
  7. Verify tasks from both boards returned
- **Expected Outcome**: Search results scoped correctly per user's board access

---

### STS-006: Pagination Through Full Result Set

- **Flow**: Seed Data -> Page Through All Results -> Verify Completeness
- **Steps**:
  1. Seed 55 tasks across accessible boards, all containing "test" in title
  2. GET /tasks/search?q=test&page[size]=20&page[number]=1 -- 20 tasks, links.next present
  3. GET page 2 -- 20 tasks, links.next present
  4. GET page 3 -- 15 tasks, links.next absent
  5. Collect all task IDs from all pages
  6. Verify 55 unique task IDs total (no duplicates, no omissions)
- **Expected Outcome**: Pagination returns all results without duplicates

---

### STS-007: Activity Log Integrity Under Concurrent Operations

- **Flow**: Multiple Users Updating Same Task -> Verify Log Entries
- **Steps**:
  1. Create task "T1" on board "B1"
  2. User "U1" updates status to "in_progress"
  3. User "U2" updates priority to "P0"
  4. User "U1" updates assignee to "U3"
  5. GET /boards/B1/tasks/T1/activity
  6. Verify 4 activity entries (1 create + 3 updates)
  7. Verify each entry has correct actor and correct before/after values
  8. Verify entries are in reverse chronological order
- **Expected Outcome**: All concurrent mutations correctly logged

---

### STS-008: Retention Purge Does Not Affect Active Data

- **Flow**: Seed Old + New Entries -> Run Purge -> Verify Correct Entries Remain
- **Steps**:
  1. Seed activity entries at: 120 days, 91 days, 90 days, 30 days, 1 day ago
  2. Run retention purge
  3. Query activity log
  4. Verify: 120-day and 91-day entries deleted
  5. Verify: 90-day, 30-day, and 1-day entries retained
  6. Verify task and board data unaffected
- **Expected Outcome**: Purge correctly respects 90-day boundary

---

## 3. Security Test Specifications (SECTS-*)

### SECTS-001: JWT Authentication Bypass Attempts

- **STRIDE Threats**: STR-AUTH-S01, STR-AUTH-S02, STR-AUTH-T01
- **Attack Vectors**:
  1. Request without Authorization header -> expected 401
  2. Request with `Authorization: Bearer invalid-token` -> expected 401
  3. Request with expired JWT (exp in the past) -> expected 401
  4. Request with JWT signed by wrong key -> expected 401
  5. Request with JWT using `alg: none` -> expected 401
  6. Request with JWT using HS256 when RS256 expected -> expected 401
  7. Request with modified JWT payload (changed `sub`) -> expected 401
- **Expected Defense**: All 7 vectors return HTTP 401 with JSON:API error

---

### SECTS-002: SQL Injection in Task Fields

- **STRIDE Threats**: STR-TASK-T02, STR-BOARD-T02
- **Attack Vectors**:
  1. Task title: `"'; DROP TABLE tasks; --"` -> expected 201 (title stored as literal string) or 422 (validation)
  2. Task description: `"1; SELECT * FROM board_members"` -> expected 200 (stored literally)
  3. Board name: `"test'; DELETE FROM boards; --"` -> expected 201 (stored literally)
  4. Search query: `"' OR 1=1 --"` -> expected 200 with correct search results (not all records)
  5. Filter value: `"'; DROP TABLE tasks; --"` -> expected no SQL injection effect
- **Expected Defense**: Parameterized queries prevent all SQL injection; data stored literally

---

### SECTS-003: RBAC Privilege Escalation

- **STRIDE Threats**: STR-TASK-E01, STR-TASK-E02
- **Attack Vectors**:
  1. Viewer creates task -> expected 403
  2. Viewer updates task -> expected 403
  3. Viewer deletes task -> expected 403
  4. Non-creator Member deletes another's task -> expected 403
  5. Non-member accesses board tasks -> expected 403
  6. Member modifies board settings -> expected 403
  7. Member configures webhook -> expected 403
  8. Member invites users -> expected 403
- **Expected Defense**: All 8 vectors return HTTP 403 with appropriate error message

---

### SECTS-004: Board Management Authorization

- **STRIDE Threats**: STR-BOARD-E01, STR-BOARD-I01
- **Attack Vectors**:
  1. Non-owner Member sends PATCH /boards/:id to modify columns -> expected 403
  2. Viewer sends PATCH /boards/:id -> expected 403
  3. Non-member sends GET /boards/:id/tasks -> expected 403
  4. Non-member sends GET /boards/:id/activity -> expected 403
  5. User lists boards (GET /boards) -> expected only their boards returned
- **Expected Defense**: All unauthorized access blocked; listings scoped to membership

---

### SECTS-005: Membership Manipulation

- **STRIDE Threats**: STR-MEM-S01, STR-MEM-T01, STR-MEM-E01
- **Attack Vectors**:
  1. Member invites themselves as Admin -> expected 403 (Member cannot invite)
  2. Viewer invites users -> expected 403
  3. Non-member attempts to join via POST /boards/:id/members -> expected 403
  4. Member attempts to change own role to Admin via invite endpoint -> expected 403 (cannot invite)
- **Expected Defense**: Only owner/Admin can manage memberships

---

### SECTS-006: SSRF via Webhook URL

- **STRIDE Threats**: STR-WHD-D01, STR-WHD-E01
- **Attack Vectors**:
  1. Webhook URL: `http://localhost:8080/admin` -> expected 422 (non-HTTPS or rejected)
  2. Webhook URL: `https://127.0.0.1/internal` -> expected 422 (loopback blocked)
  3. Webhook URL: `https://10.0.0.1/internal` -> expected 422 (private range blocked)
  4. Webhook URL: `https://172.16.0.1/internal` -> expected 422 (private range blocked)
  5. Webhook URL: `https://192.168.1.1/internal` -> expected 422 (private range blocked)
  6. Webhook URL: `https://169.254.169.254/latest/meta-data/` -> expected 422 (link-local/metadata blocked)
  7. Webhook URL: `https://[::1]/internal` -> expected 422 (IPv6 loopback blocked)
- **Expected Defense**: All internal/private/metadata URLs rejected at configuration time or delivery time

---

### SECTS-007: Webhook Secret Exposure

- **STRIDE Threats**: STR-WH-I01
- **Attack Vectors**:
  1. POST /boards/:id/webhooks returns secret in response -> expected masked (e.g., "****")
  2. GET /boards/:id/webhooks returns secret -> expected masked
  3. Error response after webhook config fails includes secret -> expected not present
  4. Activity log includes webhook secret -> expected not present
- **Expected Defense**: Secret never exposed in any API response

---

### SECTS-008: Webhook HMAC Signature Verification

- **STRIDE Threats**: STR-WH-T02, STR-WHD-T01
- **Attack Vectors**:
  1. Receive webhook, recompute HMAC-SHA256(secret, payload) -> must match X-Signature-256 header
  2. Modify webhook payload body slightly -> recomputed HMAC must NOT match original signature
  3. Use wrong secret to compute HMAC -> must NOT match
  4. Verify signature format: `sha256=<hex-encoded hash>`
- **Expected Defense**: Valid HMAC on every delivery; any modification detectable

---

### SECTS-009: Search Access Control

- **STRIDE Threats**: STR-SRCH-I01, STR-SRCH-E01
- **Attack Vectors**:
  1. User searches for tasks; verify no results from inaccessible boards
  2. User adds `filter[board]=<inaccessible-board-id>` -> expected results empty or 403
  3. User manipulates board_id in filter to access other boards -> expected scoping override
  4. Unauthenticated search -> expected 401
- **Expected Defense**: Search always scoped to user's accessible boards regardless of filter parameters

---

### SECTS-010: Activity Log Immutability

- **STRIDE Threats**: STR-ALOG-S01, STR-ALOG-T01
- **Attack Vectors**:
  1. Attempt PATCH /boards/:id/tasks/:taskId/activity/:logId -> expected 404 or 405 (no such endpoint)
  2. Attempt DELETE /boards/:id/tasks/:taskId/activity/:logId -> expected 404 or 405
  3. Attempt POST /boards/:id/tasks/:taskId/activity with fabricated entry -> expected 404 or 405
- **Expected Defense**: No create/update/delete API for activity logs; entries are immutable
