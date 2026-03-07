# Requirements: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: requirements-analyst
**PRD Version**: 1.0

---

## Refined PRD Summary

TaskFlow is a RESTful API service providing programmatic task management for an engineering team. It replaces spreadsheet-based tracking with a single-source-of-truth API. The system supports CRUD operations on tasks organized into Kanban-style boards, webhook notifications on state changes, role-based access control (Admin, Member, Viewer), full-text search with filtering, and an immutable activity log. Authentication is handled externally via JWT from existing company SSO. The API conforms to JSON:API specification, is deployed as a Docker container on Kubernetes, and is built with Node.js v20+, Express, PostgreSQL 16, and TypeScript.

**Assumptions documented below are marked with `[ASSUMPTION]`.**

---

## User Stories

### Phase 1 -- MVP (F1: Task CRUD)

#### US-001-001: Create a Task

**As a** board member (Member or Admin),
**I want to** create a new task on a board I belong to,
**So that** I can track a unit of work programmatically instead of using spreadsheets.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Independent (yes), Negotiable (yes), Valuable (yes), Estimable (yes), Small (yes), Testable (yes)

#### US-001-002: Read / View a Task

**As a** board member (Member, Admin, or Viewer),
**I want to** retrieve a single task by its ID or list all tasks on a board,
**So that** I can see task details and current status without checking spreadsheets.

- **Priority**: P0
- **Story Points**: 2
- **INVEST**: Compliant

#### US-001-003: Update a Task

**As a** board member (Member or Admin),
**I want to** update a task's title, description, status, priority, assignee, due date, or tags,
**So that** I can keep task information current as work progresses.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

#### US-001-004: Soft-Delete a Task

**As a** task creator or Admin,
**I want to** soft-delete a task (setting a `deleted_at` timestamp) so that the task is hidden from normal views but recoverable if needed.

- **Priority**: P0
- **Story Points**: 2
- **INVEST**: Compliant

### Phase 1 -- MVP (F2: Board Management)

#### US-002-001: Create a Board

**As an** authenticated user,
**I want to** create a new board with a name, optional description, and at least 2 columns,
**So that** I can organize tasks into a Kanban-style workflow.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

#### US-002-002: Manage Board Columns

**As a** board owner or Admin,
**I want to** customize the board's column names and ordering (minimum 2 columns),
**So that** the board reflects my team's actual workflow stages.

- **Priority**: P1
- **Story Points**: 3
- **INVEST**: Compliant

#### US-002-003: Invite Members and Assign Roles

**As a** board owner or Admin,
**I want to** invite users to a board and set their role (Admin, Member, Viewer),
**So that** I can control who can view and modify tasks.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

### Phase 1 -- MVP (F3: Webhook Notifications)

#### US-003-001: Configure Webhooks per Board

**As a** board owner or Admin,
**I want to** configure a webhook URL and HMAC secret for a board,
**So that** external systems (CI/CD, Slack bots, dashboards) receive real-time notifications of task events.

- **Priority**: P0
- **Story Points**: 3
- **INVEST**: Compliant

#### US-003-002: Receive Webhook on Task Events

**As an** external system consuming webhooks,
**I want to** receive an HTTP POST with a signed payload (event type, task snapshot, actor, timestamp) when a task event occurs (created, updated, status_changed, assigned, deleted),
**So that** I can react to task changes automatically.

- **Priority**: P0
- **Story Points**: 5
- **INVEST**: Compliant

#### US-003-003: Webhook Retry on Failure

**As a** system operator,
**I want** failed webhook deliveries to be retried 3 times with exponential backoff (1s, 4s, 16s),
**So that** transient failures do not cause missed notifications.

- **Priority**: P1
- **Story Points**: 3
- **INVEST**: Compliant

### Phase 2 -- Must Have (F4: Search and Filtering)

#### US-004-001: Full-Text Search Tasks

**As a** board member,
**I want to** search tasks by keyword across title and description fields on all boards I have access to,
**So that** I can quickly find specific tasks without manually browsing each board.

- **Priority**: P1
- **Story Points**: 5
- **INVEST**: Compliant

#### US-004-002: Filter Tasks by Attributes

**As a** board member,
**I want to** filter tasks by status, priority, assignee, tags, due date range, and board,
**So that** I can narrow results to exactly what I need.

- **Priority**: P1
- **Story Points**: 5
- **INVEST**: Compliant

#### US-004-003: Paginate and Sort Search Results

**As a** board member,
**I want** search and filter results to be paginated (default 20, max 100 per page) and sortable by created_at, updated_at, due_date, or priority,
**So that** I can handle large result sets efficiently.

- **Priority**: P1
- **Story Points**: 3
- **INVEST**: Compliant

### Phase 3 -- Nice to Have (F5: Activity Log)

#### US-005-001: Record Activity Log Entries

**As a** system,
**I want to** immutably record every action on a task (who, what, when, before/after values),
**So that** there is a full audit trail for compliance and debugging.

- **Priority**: P2
- **Story Points**: 5
- **INVEST**: Compliant

#### US-005-002: Retrieve Activity Log via API

**As a** board member,
**I want to** retrieve the activity log for a specific task or an entire board via API,
**So that** I can review change history without database access.

- **Priority**: P2
- **Story Points**: 3
- **INVEST**: Compliant

#### US-005-003: Activity Log Retention Policy

**As a** system operator,
**I want** activity log entries to be automatically purged after 90 days,
**So that** storage costs remain bounded and data retention policies are met.

- **Priority**: P2
- **Story Points**: 2
- **INVEST**: Compliant

---

## Acceptance Criteria

### US-001-001: Create a Task

**AC-US-001-001-01** (Happy Path)
```gherkin
GIVEN an authenticated user with Member or Admin role on board "B1"
WHEN the user sends a POST request to /boards/B1/tasks with a valid payload containing title "Fix login bug", status "todo", and priority "P1"
THEN the system returns HTTP 201 with the created task resource in JSON:API format including a server-generated task ID, created_at timestamp, and all provided fields
```

**AC-US-001-001-02** (Validation Error -- Missing Title)
```gherkin
GIVEN an authenticated user with Member or Admin role on board "B1"
WHEN the user sends a POST request to /boards/B1/tasks with a payload missing the required "title" field
THEN the system returns HTTP 422 with a JSON:API error object containing source pointer "/data/attributes/title" and detail "Title is required"
```

**AC-US-001-001-03** (Validation Error -- Title Exceeds Max Length)
```gherkin
GIVEN an authenticated user with Member or Admin role on board "B1"
WHEN the user sends a POST request to /boards/B1/tasks with a title longer than 200 characters
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Title must not exceed 200 characters"
```

**AC-US-001-001-04** (Authorization Error -- Viewer Role)
```gherkin
GIVEN an authenticated user with Viewer role on board "B1"
WHEN the user sends a POST request to /boards/B1/tasks with a valid payload
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Viewers cannot create tasks"
```

**AC-US-001-001-05** (Edge Case -- Maximum Tags)
```gherkin
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends a POST request with a valid payload containing exactly 11 tags
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Maximum 10 tags allowed"
```

### US-001-002: Read / View a Task

**AC-US-001-002-01** (Happy Path -- Single Task)
```gherkin
GIVEN an authenticated user with any role on board "B1" and a task "T1" exists on board "B1"
WHEN the user sends a GET request to /boards/B1/tasks/T1
THEN the system returns HTTP 200 with the task resource in JSON:API format including all fields (title, description, status, priority, assignee, due_date, tags, created_at, updated_at)
```

**AC-US-001-002-02** (Happy Path -- List Tasks)
```gherkin
GIVEN an authenticated user with any role on board "B1" and 5 tasks exist on board "B1"
WHEN the user sends a GET request to /boards/B1/tasks
THEN the system returns HTTP 200 with a JSON:API collection containing all 5 non-deleted tasks
```

**AC-US-001-002-03** (Error -- Task Not Found)
```gherkin
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends a GET request to /boards/B1/tasks/nonexistent-id
THEN the system returns HTTP 404 with a JSON:API error object containing detail "Task not found"
```

**AC-US-001-002-04** (Edge Case -- Soft-Deleted Task Hidden)
```gherkin
GIVEN an authenticated user with Member role on board "B1" and task "T1" has been soft-deleted
WHEN the user sends a GET request to /boards/B1/tasks
THEN the system returns HTTP 200 with a collection that does not include task "T1"
```

### US-001-003: Update a Task

**AC-US-001-003-01** (Happy Path)
```gherkin
GIVEN an authenticated user with Member or Admin role on board "B1" and task "T1" exists
WHEN the user sends a PATCH request to /boards/B1/tasks/T1 with payload updating status to "in_progress" and priority to "P0"
THEN the system returns HTTP 200 with the updated task resource reflecting the new status and priority, and updated_at is set to the current timestamp
```

**AC-US-001-003-02** (Error -- Invalid Status Value)
```gherkin
GIVEN an authenticated user with Member role on board "B1" and task "T1" exists
WHEN the user sends a PATCH request with status set to "invalid_status"
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Status must be one of: todo, in_progress, review, done"
```

**AC-US-001-003-03** (Error -- Viewer Cannot Update)
```gherkin
GIVEN an authenticated user with Viewer role on board "B1" and task "T1" exists
WHEN the user sends a PATCH request to /boards/B1/tasks/T1 with any field update
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Viewers cannot modify tasks"
```

**AC-US-001-003-04** (Edge Case -- Description at Max Length)
```gherkin
GIVEN an authenticated user with Member role on board "B1" and task "T1" exists
WHEN the user sends a PATCH request with description set to exactly 5000 characters
THEN the system returns HTTP 200 with the updated task containing the full 5000-character description
```

### US-001-004: Soft-Delete a Task

**AC-US-001-004-01** (Happy Path -- Creator Deletes)
```gherkin
GIVEN an authenticated user who is the creator of task "T1" on board "B1"
WHEN the user sends a DELETE request to /boards/B1/tasks/T1
THEN the system returns HTTP 200, sets the task's deleted_at to the current timestamp, and the task no longer appears in GET /boards/B1/tasks listings
```

**AC-US-001-004-02** (Happy Path -- Admin Deletes)
```gherkin
GIVEN an authenticated user with Admin role on board "B1" who is not the creator of task "T1"
WHEN the user sends a DELETE request to /boards/B1/tasks/T1
THEN the system returns HTTP 200 and sets the task's deleted_at to the current timestamp
```

**AC-US-001-004-03** (Error -- Non-Creator Member Cannot Delete)
```gherkin
GIVEN an authenticated user with Member role on board "B1" who is not the creator of task "T1"
WHEN the user sends a DELETE request to /boards/B1/tasks/T1
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Only the task creator or an Admin can delete this task"
```

**AC-US-001-004-04** (Edge Case -- Delete Already-Deleted Task)
```gherkin
GIVEN an authenticated Admin user on board "B1" and task "T1" already has a non-null deleted_at
WHEN the user sends a DELETE request to /boards/B1/tasks/T1
THEN the system returns HTTP 404 with a JSON:API error object containing detail "Task not found"
```

### US-002-001: Create a Board

**AC-US-002-001-01** (Happy Path)
```gherkin
GIVEN an authenticated user
WHEN the user sends a POST request to /boards with name "Sprint Board" and default columns
THEN the system returns HTTP 201 with the board resource including server-generated ID, the 4 default columns (todo, in_progress, review, done), and the requesting user set as owner
```

**AC-US-002-001-02** (Error -- Missing Name)
```gherkin
GIVEN an authenticated user
WHEN the user sends a POST request to /boards without a name field
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Board name is required"
```

**AC-US-002-001-03** (Error -- Name Exceeds Max Length)
```gherkin
GIVEN an authenticated user
WHEN the user sends a POST request to /boards with a name longer than 100 characters
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Board name must not exceed 100 characters"
```

**AC-US-002-001-04** (Edge Case -- Custom Columns with Minimum 2)
```gherkin
GIVEN an authenticated user
WHEN the user sends a POST request to /boards with name "Minimal Board" and columns ["open", "closed"]
THEN the system returns HTTP 201 with the board resource containing exactly the 2 specified columns in order
```

**AC-US-002-001-05** (Error -- Fewer Than 2 Columns)
```gherkin
GIVEN an authenticated user
WHEN the user sends a POST request to /boards with name "Bad Board" and columns ["only_one"]
THEN the system returns HTTP 422 with a JSON:API error object containing detail "A board must have at least 2 columns"
```

### US-002-002: Manage Board Columns

**AC-US-002-002-01** (Happy Path -- Rename Columns)
```gherkin
GIVEN an authenticated board owner of board "B1" with columns ["todo", "in_progress", "done"]
WHEN the owner sends a PATCH request to /boards/B1 with columns renamed to ["backlog", "active", "complete"]
THEN the system returns HTTP 200 with the board resource reflecting the updated column names in order
```

**AC-US-002-002-02** (Error -- Reduce Below Minimum)
```gherkin
GIVEN an authenticated board owner of board "B1" with 3 columns
WHEN the owner sends a PATCH request to /boards/B1 with columns set to ["only_one"]
THEN the system returns HTTP 422 with a JSON:API error object containing detail "A board must have at least 2 columns"
```

**AC-US-002-002-03** (Error -- Non-Owner Member Cannot Edit Columns)
```gherkin
GIVEN an authenticated user with Member role on board "B1" who is not the board owner
WHEN the user sends a PATCH request to /boards/B1 to modify columns
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Only the board owner or an Admin can modify board settings"
```

### US-002-003: Invite Members and Assign Roles

**AC-US-002-003-01** (Happy Path)
```gherkin
GIVEN an authenticated board owner of board "B1"
WHEN the owner sends a POST request to /boards/B1/members with user_id "U2" and role "Member"
THEN the system returns HTTP 201 with the membership resource and user "U2" can now access board "B1" with Member permissions
```

**AC-US-002-003-02** (Error -- Invalid Role)
```gherkin
GIVEN an authenticated board owner of board "B1"
WHEN the owner sends a POST request to /boards/B1/members with user_id "U2" and role "SuperAdmin"
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Role must be one of: Admin, Member, Viewer"
```

**AC-US-002-003-03** (Error -- Non-Owner Member Cannot Invite)
```gherkin
GIVEN an authenticated user with Member role on board "B1" who is not the board owner
WHEN the user sends a POST request to /boards/B1/members with user_id "U3" and role "Viewer"
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Only the board owner or an Admin can invite members"
```

**AC-US-002-003-04** (Edge Case -- Invite Already Existing Member)
```gherkin
GIVEN an authenticated board owner of board "B1" and user "U2" is already a Member
WHEN the owner sends a POST request to /boards/B1/members with user_id "U2" and role "Admin"
THEN the system returns HTTP 200 with the updated membership resource reflecting the new role "Admin"
```

### US-003-001: Configure Webhooks per Board

**AC-US-003-001-01** (Happy Path)
```gherkin
GIVEN an authenticated board owner or Admin of board "B1"
WHEN the user sends a POST request to /boards/B1/webhooks with url "https://example.com/hook" and secret "my-secret-key"
THEN the system returns HTTP 201 with the webhook configuration resource including the URL and a masked secret
```

**AC-US-003-001-02** (Error -- Invalid URL)
```gherkin
GIVEN an authenticated board owner of board "B1"
WHEN the user sends a POST request to /boards/B1/webhooks with url "not-a-valid-url" and a secret
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Webhook URL must be a valid HTTPS URL" [ASSUMPTION: HTTPS required]
```

**AC-US-003-001-03** (Error -- Non-Owner/Non-Admin Cannot Configure)
```gherkin
GIVEN an authenticated user with Member role on board "B1"
WHEN the user sends a POST request to /boards/B1/webhooks with a valid URL and secret
THEN the system returns HTTP 403 with a JSON:API error object containing detail "Only the board owner or an Admin can configure webhooks"
```

### US-003-002: Receive Webhook on Task Events

**AC-US-003-002-01** (Happy Path -- task.created Event)
```gherkin
GIVEN board "B1" has a webhook configured at "https://example.com/hook" with secret "s3cret"
WHEN a new task is created on board "B1"
THEN the system sends an HTTP POST to "https://example.com/hook" within 5 seconds [ASSUMPTION] with a JSON payload containing event "task.created", the full task snapshot, the actor's user ID, and an ISO 8601 timestamp, signed with an HMAC-SHA256 header using the secret
```

**AC-US-003-002-02** (Happy Path -- task.status_changed Event)
```gherkin
GIVEN board "B1" has a webhook configured and task "T1" exists with status "todo"
WHEN the task's status is updated to "in_progress"
THEN the system sends a webhook with event "task.status_changed" and the payload includes both the previous status "todo" and new status "in_progress"
```

**AC-US-003-002-03** (Edge Case -- No Webhook Configured)
```gherkin
GIVEN board "B1" has no webhook configured
WHEN a task event occurs on board "B1"
THEN no webhook delivery is attempted and the task operation completes successfully
```

**AC-US-003-002-04** (Edge Case -- Multiple Events in Rapid Succession)
```gherkin
GIVEN board "B1" has a webhook configured
WHEN 3 task events occur within 1 second on board "B1"
THEN the system sends 3 separate webhook deliveries, each with the correct event type and task snapshot at the time of that event
```

### US-003-003: Webhook Retry on Failure

**AC-US-003-003-01** (Happy Path -- Successful Retry)
```gherkin
GIVEN board "B1" has a webhook configured and the webhook endpoint returns HTTP 500 on the first delivery attempt
WHEN the system retries after 1 second
THEN the webhook is delivered successfully on the second attempt and the delivery is recorded as successful
```

**AC-US-003-003-02** (Error -- All Retries Exhausted)
```gherkin
GIVEN board "B1" has a webhook configured and the webhook endpoint returns HTTP 500 on all attempts
WHEN the system has retried 3 times (at 1s, 4s, and 16s intervals after the initial failure)
THEN the delivery is marked as permanently failed and no further retries are attempted for that event
```

**AC-US-003-003-03** (Edge Case -- Retry Timing)
```gherkin
GIVEN board "B1" has a webhook configured and the first delivery attempt fails at time T
WHEN the system executes the retry schedule
THEN retry 1 occurs at approximately T+1s, retry 2 at approximately T+5s (1+4), and retry 3 at approximately T+21s (1+4+16), each with a tolerance of 500ms [ASSUMPTION]
```

### US-004-001: Full-Text Search Tasks

**AC-US-004-001-01** (Happy Path)
```gherkin
GIVEN an authenticated user with access to boards "B1" and "B2", and task "T1" on "B1" has title "Fix login bug" and task "T2" on "B2" has description "Login page crashes on submit"
WHEN the user sends a GET request to /tasks/search?q=login
THEN the system returns HTTP 200 with a JSON:API collection containing both "T1" and "T2"
```

**AC-US-004-001-02** (Edge Case -- No Results)
```gherkin
GIVEN an authenticated user with access to board "B1" containing 3 tasks none of which mention "quantum"
WHEN the user sends a GET request to /tasks/search?q=quantum
THEN the system returns HTTP 200 with an empty JSON:API collection and meta.total of 0
```

**AC-US-004-001-03** (Error -- Empty Query)
```gherkin
GIVEN an authenticated user
WHEN the user sends a GET request to /tasks/search without a "q" parameter
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Search query parameter 'q' is required"
```

**AC-US-004-001-04** (Edge Case -- Access Scoping)
```gherkin
GIVEN an authenticated user with access only to board "B1", and a task matching "deploy" exists on board "B2" which the user cannot access
WHEN the user sends a GET request to /tasks/search?q=deploy
THEN the system returns HTTP 200 with results only from board "B1" and does not include tasks from "B2"
```

### US-004-002: Filter Tasks by Attributes

**AC-US-004-002-01** (Happy Path -- Single Filter)
```gherkin
GIVEN an authenticated user with access to board "B1" containing 10 tasks, 3 of which have priority "P0"
WHEN the user sends a GET request to /tasks/search?filter[priority]=P0
THEN the system returns HTTP 200 with a JSON:API collection containing exactly the 3 P0 tasks
```

**AC-US-004-002-02** (Happy Path -- Combined Filters)
```gherkin
GIVEN an authenticated user with access to board "B1" containing tasks with various statuses and assignees
WHEN the user sends a GET request to /tasks/search?filter[status]=in_progress&filter[assignee]=U1
THEN the system returns HTTP 200 with only tasks that are both in_progress AND assigned to U1
```

**AC-US-004-002-03** (Edge Case -- Due Date Range Filter)
```gherkin
GIVEN an authenticated user with access to board "B1" containing tasks with due dates spanning 2026-03-01 to 2026-03-31
WHEN the user sends a GET request to /tasks/search?filter[due_date_from]=2026-03-10&filter[due_date_to]=2026-03-15
THEN the system returns HTTP 200 with only tasks whose due_date falls within the inclusive range 2026-03-10 to 2026-03-15
```

**AC-US-004-002-04** (Error -- Invalid Filter Field)
```gherkin
GIVEN an authenticated user
WHEN the user sends a GET request to /tasks/search?filter[nonexistent_field]=value
THEN the system returns HTTP 400 with a JSON:API error object containing detail "Unknown filter field: nonexistent_field"
```

### US-004-003: Paginate and Sort Search Results

**AC-US-004-003-01** (Happy Path -- Default Pagination)
```gherkin
GIVEN an authenticated user with access to 50 matching tasks
WHEN the user sends a GET request to /tasks/search?q=bug without pagination parameters
THEN the system returns HTTP 200 with the first 20 tasks, and meta includes total count 50, page 1, and links to the next page
```

**AC-US-004-003-02** (Happy Path -- Custom Page Size and Sort)
```gherkin
GIVEN an authenticated user with access to 50 matching tasks
WHEN the user sends a GET request to /tasks/search?q=bug&page[size]=10&sort=-priority
THEN the system returns HTTP 200 with 10 tasks sorted by priority descending (P0 first)
```

**AC-US-004-003-03** (Error -- Page Size Exceeds Maximum)
```gherkin
GIVEN an authenticated user
WHEN the user sends a GET request to /tasks/search?q=bug&page[size]=200
THEN the system returns HTTP 422 with a JSON:API error object containing detail "Page size must not exceed 100"
```

**AC-US-004-003-04** (Edge Case -- Last Page with Fewer Items)
```gherkin
GIVEN an authenticated user with access to 25 matching tasks and page size 20
WHEN the user sends a GET request to /tasks/search?q=bug&page[number]=2&page[size]=20
THEN the system returns HTTP 200 with 5 tasks and meta indicates this is the last page with no next link
```

### US-005-001: Record Activity Log Entries

**AC-US-005-001-01** (Happy Path -- Task Update Logged)
```gherkin
GIVEN task "T1" exists on board "B1" with status "todo"
WHEN an authenticated user updates task "T1" status to "in_progress"
THEN an immutable activity log entry is created containing the actor's user ID, action "task.updated", timestamp, and before value "todo" / after value "in_progress" for the status field
```

**AC-US-005-001-02** (Happy Path -- Task Creation Logged)
```gherkin
GIVEN board "B1" exists
WHEN an authenticated user creates a new task on board "B1"
THEN an immutable activity log entry is created containing the actor's user ID, action "task.created", timestamp, and the full after-state of the task
```

**AC-US-005-001-03** (Edge Case -- Multiple Field Changes in Single Update)
```gherkin
GIVEN task "T1" exists on board "B1"
WHEN an authenticated user updates both the status and priority of task "T1" in a single PATCH request
THEN a single activity log entry is created capturing before/after values for both the status and priority fields
```

### US-005-002: Retrieve Activity Log via API

**AC-US-005-002-01** (Happy Path -- Task Activity Log)
```gherkin
GIVEN task "T1" on board "B1" has 5 activity log entries
WHEN an authenticated user with access to board "B1" sends a GET request to /boards/B1/tasks/T1/activity
THEN the system returns HTTP 200 with a JSON:API collection of 5 log entries in reverse chronological order
```

**AC-US-005-002-02** (Happy Path -- Board Activity Log)
```gherkin
GIVEN board "B1" has 20 activity log entries across all tasks
WHEN an authenticated user with access to board "B1" sends a GET request to /boards/B1/activity
THEN the system returns HTTP 200 with a paginated JSON:API collection of activity log entries for the board
```

**AC-US-005-002-03** (Error -- Unauthorized Access)
```gherkin
GIVEN an authenticated user who is not a member of board "B1"
WHEN the user sends a GET request to /boards/B1/activity
THEN the system returns HTTP 403 with a JSON:API error object containing detail "You do not have access to this board"
```

### US-005-003: Activity Log Retention Policy

**AC-US-005-003-01** (Happy Path -- Entries Purged After 90 Days)
```gherkin
GIVEN activity log entries exist for board "B1" with timestamps ranging from 30 to 120 days ago
WHEN the retention purge job executes
THEN all entries older than 90 days are permanently deleted and entries 90 days old or newer are retained
```

**AC-US-005-003-02** (Edge Case -- Boundary at Exactly 90 Days)
```gherkin
GIVEN an activity log entry was created exactly 90 days ago at 00:00:00 UTC
WHEN the retention purge job executes
THEN the entry is retained (90 days inclusive) [ASSUMPTION: 90-day retention is inclusive]
```

**AC-US-005-003-03** (Edge Case -- No Entries to Purge)
```gherkin
GIVEN all activity log entries in the system are less than 90 days old
WHEN the retention purge job executes
THEN no entries are deleted and the job completes successfully without errors
```

---

## Non-Functional Requirements

### Performance

#### NFR-001-001: API Response Time

The API must respond within **200ms at p95** under a load of 50 concurrent users performing mixed read/write operations.

- **Measurable Threshold**: p95 latency <= 200ms with 50 concurrent users
- **Measurement Method**: Load test with k6 or similar tool simulating 50 concurrent users for 10 minutes
- **Source**: PRD Success Criteria

#### NFR-001-002: Rate Limiting

The API must enforce a rate limit of **100 requests per minute per authenticated user**.

- **Measurable Threshold**: Requests beyond 100/min/user receive HTTP 429 within 100ms
- **Measurement Method**: Send 101 requests in 60 seconds from a single user; verify 101st returns 429
- **Source**: PRD Constraints

### Security

#### NFR-002-001: JWT Authentication

All API endpoints must require a valid JWT token issued by the company SSO. Requests without a valid token must receive HTTP 401.

- **Measurable Threshold**: 100% of unauthenticated requests return HTTP 401 within 50ms
- **Measurement Method**: Send requests without token, with expired token, and with tampered token
- **Source**: PRD Constraints

#### NFR-002-002: RBAC Enforcement

All endpoints must enforce role-based access control. Users must not be able to perform actions beyond their assigned role (Admin, Member, Viewer).

- **Measurable Threshold**: 0 authorization bypass incidents in penetration testing covering all role/endpoint combinations
- **Measurement Method**: Matrix test of all endpoints x all roles, verify correct 403 responses
- **Source**: PRD F2 (Board Management)

#### NFR-002-003: Webhook HMAC Signing

All webhook payloads must be signed using HMAC-SHA256 with the board's configured secret. The signature must be included in the `X-Signature-256` HTTP header. [ASSUMPTION: Header name `X-Signature-256`]

- **Measurable Threshold**: 100% of webhook deliveries include a valid HMAC signature verifiable by the consumer
- **Measurement Method**: Configure a test webhook endpoint that validates HMAC; verify all deliveries pass
- **Source**: PRD F3

### Scalability

#### NFR-003-001: Task Volume per Board

The system must support up to **10,000 tasks per board** without degradation in response time.

- **Measurable Threshold**: API response time remains under 200ms at p95 with a board containing 10,000 tasks
- **Measurement Method**: Seed a board with 10,000 tasks and run standard API operations; measure latency
- **Source**: PRD Constraints

#### NFR-003-002: Concurrent User Support

The system must handle **50 concurrent users** performing mixed operations without errors.

- **Measurable Threshold**: 0% error rate under 50 concurrent users for 10-minute sustained load
- **Measurement Method**: Load test with 50 concurrent virtual users
- **Source**: PRD Success Criteria

### Reliability

#### NFR-004-001: Uptime

The system must maintain **99.5% uptime** measured over a rolling 30-day window.

- **Measurable Threshold**: Downtime <= 3.6 hours per 30-day period
- **Measurement Method**: Uptime monitoring with health check endpoint polled every 30 seconds
- **Source**: PRD Success Criteria

#### NFR-004-002: Zero Data Loss

All task mutation operations must be persisted to the database with transactional integrity. No data loss is acceptable on task create, update, or delete operations.

- **Measurable Threshold**: 0 data loss incidents across all mutation operations under normal and failover conditions
- **Measurement Method**: Chaos testing with database failover during write operations; verify all committed transactions are persisted
- **Source**: PRD Success Criteria

#### NFR-004-003: Webhook Delivery Rate

Webhook delivery success rate must exceed **99%** within the retry window (initial attempt + 3 retries).

- **Measurable Threshold**: >= 99% successful delivery rate over a 24-hour period with a simulated 2% endpoint failure rate
- **Measurement Method**: Send 10,000 webhooks to an endpoint that randomly fails 2% of the time; measure final delivery rate after retries
- **Source**: PRD Success Criteria

### Usability

#### NFR-005-001: JSON:API Compliance

All API responses must conform to the **JSON:API v1.1 specification** including proper resource objects, relationships, links, and error objects.

- **Measurable Threshold**: 100% of responses pass JSON:API schema validation
- **Measurement Method**: Automated schema validation on all API responses in integration tests
- **Source**: PRD Constraints

### Maintainability

#### NFR-006-001: TypeScript Strict Mode

All source code must compile under **TypeScript strict mode** with zero type errors.

- **Measurable Threshold**: `tsc --noEmit` exits with code 0
- **Measurement Method**: CI pipeline runs TypeScript compiler in strict mode on every commit
- **Source**: PRD Constraints, Project CLAUDE.md

#### NFR-006-002: Test Coverage

The codebase must maintain a minimum **80% line coverage** across unit and integration tests. [PROPOSED DEFAULT]

- **Measurable Threshold**: >= 80% line coverage as reported by c8 or istanbul
- **Measurement Method**: CI pipeline runs tests with coverage reporting
- **Source**: [PROPOSED DEFAULT] -- not specified in PRD

### Compatibility

#### NFR-007-001: Container Deployment

The application must be deployable as a **Docker container** on the company Kubernetes cluster with standard health check endpoints (`/healthz` for liveness, `/readyz` for readiness). [ASSUMPTION: Standard K8s health endpoints]

- **Measurable Threshold**: Container starts and passes health checks within 30 seconds [PROPOSED DEFAULT]
- **Measurement Method**: Deploy to staging K8s cluster and verify health endpoints
- **Source**: PRD Constraints
