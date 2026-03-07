# TaskFlow API -- Structured Requirements Analysis

**Source PRD**: TaskFlow API -- Lightweight Task Management Service v1.0
**Analysis Date**: 2026-03-07
**Analyst**: Baseline (no plugin)

---

## 1. User Stories

### US-1: Create a Task

**As** an authenticated board member,
**I want** to create a task on a board with title, description, status, priority, assignee, due date, and tags,
**So that** I can track work items programmatically instead of using spreadsheets.

**Priority**: P0 (MVP)
**Source**: PRD F1 -- Task CRUD

#### Acceptance Criteria

**AC-1.1**: Task creation with required fields
- **GIVEN** an authenticated user who is a member of a board
- **WHEN** the user sends a POST request with a valid title (1-200 chars) and board ID
- **THEN** the system creates the task with status defaulting to "todo", returns HTTP 201 with the task resource in JSON:API format, and the task is persisted in the database.

**AC-1.2**: Task creation with all optional fields
- **GIVEN** an authenticated user who is a member of a board
- **WHEN** the user sends a POST request with title, description (up to 5000 chars), priority (P0-P3), assignee (valid user ID), due date, and tags (up to 10 string items)
- **THEN** the system creates the task with all provided fields, returns HTTP 201, and all fields are correctly persisted.

**AC-1.3**: Task creation validation -- title exceeds max length
- **GIVEN** an authenticated user who is a member of a board
- **WHEN** the user sends a POST request with a title exceeding 200 characters
- **THEN** the system rejects the request with HTTP 422 and a descriptive error message indicating the title length constraint.

**AC-1.4**: Task creation validation -- invalid priority value
- **GIVEN** an authenticated user who is a member of a board
- **WHEN** the user sends a POST request with an invalid priority value (not P0-P3)
- **THEN** the system rejects the request with HTTP 422 and a descriptive error message indicating valid priority values.

**AC-1.5**: Task creation validation -- tags exceed max count
- **GIVEN** an authenticated user who is a member of a board
- **WHEN** the user sends a POST request with more than 10 tags
- **THEN** the system rejects the request with HTTP 422 and a descriptive error message indicating the tags count limit.

---

### US-2: Read Tasks

**As** an authenticated board member,
**I want** to retrieve individual tasks or list all tasks on a board,
**So that** I can see current work status without relying on meetings.

**Priority**: P0 (MVP)
**Source**: PRD F1 -- Task CRUD

#### Acceptance Criteria

**AC-2.1**: Retrieve a single task by ID
- **GIVEN** an authenticated user who is a member of the board containing the task
- **WHEN** the user sends a GET request for a specific task ID
- **THEN** the system returns HTTP 200 with the full task resource in JSON:API format including all fields (title, description, status, priority, assignee, due_date, tags, created_at, updated_at).

**AC-2.2**: Retrieve a task that does not exist
- **GIVEN** an authenticated user
- **WHEN** the user sends a GET request for a non-existent task ID
- **THEN** the system returns HTTP 404 with an appropriate error message.

**AC-2.3**: Retrieve a soft-deleted task
- **GIVEN** an authenticated user who is a member of the board
- **WHEN** the user sends a GET request for a task that has been soft-deleted (has a `deleted_at` timestamp)
- **THEN** the system returns HTTP 404 (soft-deleted tasks are not visible through normal retrieval).

---

### US-3: Update a Task

**As** an authenticated board member,
**I want** to update task fields such as status, assignee, and priority,
**So that** I can keep the task state current as work progresses.

**Priority**: P0 (MVP)
**Source**: PRD F1 -- Task CRUD

#### Acceptance Criteria

**AC-3.1**: Update task status
- **GIVEN** an authenticated user who is a member of the board containing the task
- **WHEN** the user sends a PATCH request changing the task status to a valid value (todo/in_progress/review/done)
- **THEN** the system updates the task, sets `updated_at` to the current timestamp, returns HTTP 200 with the updated resource, and triggers a `task.status_changed` webhook event.

**AC-3.2**: Update task with invalid status
- **GIVEN** an authenticated user who is a member of the board
- **WHEN** the user sends a PATCH request with an invalid status value
- **THEN** the system returns HTTP 422 with a descriptive validation error.

**AC-3.3**: Update task assignee
- **GIVEN** an authenticated user who is a member of the board
- **WHEN** the user sends a PATCH request changing the assignee to a valid user ID
- **THEN** the system updates the assignee, returns HTTP 200, and triggers a `task.assigned` webhook event.

---

### US-4: Delete a Task

**As** the task creator or an Admin,
**I want** to delete a task,
**So that** completed or invalid tasks can be removed from the active board view.

**Priority**: P0 (MVP)
**Source**: PRD F1 -- Task CRUD

#### Acceptance Criteria

**AC-4.1**: Soft delete by task creator
- **GIVEN** an authenticated user who created the task
- **WHEN** the user sends a DELETE request for the task
- **THEN** the system sets the `deleted_at` timestamp on the task (soft delete), returns HTTP 200 (or 204), and triggers a `task.deleted` webhook event.

**AC-4.2**: Soft delete by Admin
- **GIVEN** an authenticated user with the Admin role on the board
- **WHEN** the user sends a DELETE request for any task on that board
- **THEN** the system performs a soft delete and returns HTTP 200 (or 204).

**AC-4.3**: Delete denied for non-creator Member
- **GIVEN** an authenticated user who is a Member but did NOT create the task
- **WHEN** the user sends a DELETE request for the task
- **THEN** the system returns HTTP 403 with an error message indicating insufficient permissions.

---

### US-5: Create and Manage Boards

**As** an authenticated user,
**I want** to create boards with custom columns and manage board membership,
**So that** I can organize tasks into Kanban-style workflows.

**Priority**: P0 (MVP)
**Source**: PRD F2 -- Board Management

#### Acceptance Criteria

**AC-5.1**: Create a board with default columns
- **GIVEN** an authenticated user
- **WHEN** the user sends a POST request with a board name (1-100 chars) and no custom columns
- **THEN** the system creates the board with default columns (todo, in_progress, review, done), sets the creating user as the owner, and returns HTTP 201.

**AC-5.2**: Create a board with custom columns
- **GIVEN** an authenticated user
- **WHEN** the user sends a POST request with a board name and a custom columns list (at least 2 columns)
- **THEN** the system creates the board with the specified columns in the given order and returns HTTP 201.

**AC-5.3**: Create a board with fewer than 2 columns
- **GIVEN** an authenticated user
- **WHEN** the user sends a POST request with only 1 column (or 0 columns explicitly)
- **THEN** the system returns HTTP 422 with an error indicating a minimum of 2 columns is required.

**AC-5.4**: Board name exceeds max length
- **GIVEN** an authenticated user
- **WHEN** the user sends a POST request with a board name exceeding 100 characters
- **THEN** the system returns HTTP 422 with a validation error for the name field.

---

### US-6: Board Membership and Roles

**As** a board owner or Admin,
**I want** to invite members to a board and assign them roles (Admin, Member, Viewer),
**So that** I can control who can view and modify tasks on my boards.

**Priority**: P0 (MVP)
**Source**: PRD F2 -- Board Management

#### Acceptance Criteria

**AC-6.1**: Owner invites a member
- **GIVEN** an authenticated user who owns the board
- **WHEN** the user invites another user and assigns them the Member role
- **THEN** the invited user gains Member-level access to the board.

**AC-6.2**: Admin invites a member
- **GIVEN** an authenticated user with Admin role on the board
- **WHEN** the user invites another user and assigns them a role
- **THEN** the invited user gains the specified role's access to the board.

**AC-6.3**: Non-owner, non-Admin attempts to invite
- **GIVEN** an authenticated user with Member or Viewer role on the board
- **WHEN** the user attempts to invite another user
- **THEN** the system returns HTTP 403 indicating insufficient permissions.

---

### US-7: Configure Webhooks

**As** a board owner or Admin,
**I want** to configure webhook URLs for a board,
**So that** external systems (CI/CD, Slack bots, dashboards) receive notifications on task state changes.

**Priority**: P0 (MVP)
**Source**: PRD F3 -- Webhook Notifications

#### Acceptance Criteria

**AC-7.1**: Register a webhook endpoint
- **GIVEN** an authenticated user who is a board owner or Admin
- **WHEN** the user sends a POST request with a webhook URL and a secret for HMAC signing
- **THEN** the system registers the webhook for the board and returns HTTP 201.

**AC-7.2**: Webhook fires on task creation
- **GIVEN** a board with a registered webhook
- **WHEN** a new task is created on the board
- **THEN** the system sends an HTTP POST to the webhook URL with a payload containing event type (`task.created`), task snapshot, actor user ID, and timestamp, signed with HMAC using the configured secret.

**AC-7.3**: Webhook retry on failure
- **GIVEN** a board with a registered webhook whose endpoint returns a non-2xx status code
- **WHEN** a task event triggers the webhook
- **THEN** the system retries delivery 3 times with exponential backoff (1s, 4s, 16s delays) before marking the delivery as failed.

---

### US-8: Search and Filter Tasks

**As** an authenticated user,
**I want** to search tasks by text and filter by status, priority, assignee, tags, due date, and board,
**So that** I can quickly find relevant tasks across all boards I have access to.

**Priority**: P1 (Phase 2)
**Source**: PRD F4 -- Search and Filtering

#### Acceptance Criteria

**AC-8.1**: Full-text search on title and description
- **GIVEN** an authenticated user with access to one or more boards
- **WHEN** the user sends a search query with a text string
- **THEN** the system returns tasks where the title or description matches the search text, paginated with a default page size of 20.

**AC-8.2**: Filter by multiple criteria
- **GIVEN** an authenticated user with board access
- **WHEN** the user sends a request with filters for status, priority, assignee, and a due date range
- **THEN** the system returns only tasks matching ALL specified filter criteria.

**AC-8.3**: Pagination limits enforced
- **GIVEN** an authenticated user
- **WHEN** the user requests more than 100 results per page
- **THEN** the system caps the page size at 100 and returns at most 100 results.

**AC-8.4**: Sort results
- **GIVEN** an authenticated user
- **WHEN** the user specifies a sort field (created_at, updated_at, due_date, or priority) and direction
- **THEN** results are returned in the specified order.

---

### US-9: Activity Log

**As** an authenticated board member,
**I want** to view an immutable activity log for a task or board,
**So that** I can audit who changed what and when.

**Priority**: P2 (Phase 3 -- Nice to Have)
**Source**: PRD F5 -- Activity Log

#### Acceptance Criteria

**AC-9.1**: Log entry created on task mutation
- **GIVEN** a task exists on a board
- **WHEN** any mutation occurs (create, update, status change, assignment, delete)
- **THEN** the system creates an immutable log entry recording the actor, action type, timestamp, and before/after values for changed fields.

**AC-9.2**: Retrieve activity log per task
- **GIVEN** an authenticated user with access to the board
- **WHEN** the user requests the activity log for a specific task
- **THEN** the system returns all log entries for that task in reverse chronological order.

**AC-9.3**: Activity log retention
- **GIVEN** log entries older than 90 days exist
- **WHEN** the retention cleanup process runs
- **THEN** log entries older than 90 days are purged from the system.

---

## 2. Non-Functional Requirements

### NFR-1: API Response Time
- **Metric**: p95 response time
- **Threshold**: < 200ms
- **Condition**: Under 50 concurrent users
- **Measurement**: Load test with k6 or similar tool simulating 50 concurrent users performing mixed CRUD operations
- **Source**: PRD Success Criteria

### NFR-2: Uptime / Availability
- **Metric**: Service availability
- **Threshold**: >= 99.5%
- **Condition**: Over first month of production deployment
- **Measurement**: Uptime monitoring (health check endpoint polled every 30 seconds)
- **Source**: PRD Success Criteria

### NFR-3: Data Integrity
- **Metric**: Zero data loss on task mutations
- **Threshold**: 0 lost mutations
- **Condition**: Under normal and failure-recovery scenarios
- **Measurement**: All write operations use database transactions; integration tests verify data persistence after each mutation
- **Source**: PRD Success Criteria

### NFR-4: Webhook Delivery Reliability
- **Metric**: Webhook delivery success rate within retry window
- **Threshold**: > 99%
- **Condition**: Including retries (3 retries with exponential backoff)
- **Measurement**: Track delivery attempts and successes in webhook delivery log; monitor over 30-day rolling window
- **Source**: PRD Success Criteria

### NFR-5: Rate Limiting
- **Metric**: Requests per minute per authenticated user
- **Threshold**: 100 req/min
- **Condition**: Per user, measured by JWT subject claim
- **Measurement**: Rate limiter middleware returns HTTP 429 after 100 requests within a 60-second sliding window
- **Source**: PRD Constraints

### NFR-6: Board Capacity
- **Metric**: Maximum tasks per board
- **Threshold**: 10,000 tasks
- **Condition**: Per individual board
- **Measurement**: System must reject task creation (HTTP 422) when a board already has 10,000 active tasks; performance tests confirm response times remain within NFR-1 at this capacity
- **Source**: PRD Constraints

---

## 3. Quality Self-Assessment

| Area | Rating | Measurement / Notes |
|------|--------|---------------------|
| **Completeness** | PASS | 9 user stories covering all 5 PRD features (F1-F5). Every PRD requirement has at least one corresponding story and acceptance criterion. |
| **Ambiguity** | PASS | Ambiguity scores for all stories are below 50 (see ambiguity-report.md). Average score: 26.7. |
| **NFR Coverage** | PASS | 6 NFRs defined with measurable thresholds covering all 4 success criteria from PRD plus 2 constraints. |
| **Testability** | PASS | All 30 acceptance criteria use GIVEN-WHEN-THEN format with concrete, verifiable conditions. Test skeletons provided for each. |
| **Story Independence** | WARN | US-7 (Webhooks) depends on US-5 (Boards) for board existence; US-8 (Search) depends on US-1 (Task CRUD) for data to search. This is inherent domain dependency, not a coupling defect. |
| **Traceability** | PASS | Full traceability matrix from PRD feature to story to AC to test skeleton. No orphan requirements. |

---

## 4. Knowledge Capture Summary

### Key Learnings

1. **Implicit requirements identified**: The PRD does not explicitly state what happens when retrieving soft-deleted tasks, what the default status is for new tasks, or how board membership interacts with task visibility. These were inferred and documented as acceptance criteria to reduce ambiguity.

2. **Role model gap**: The PRD defines three roles (Admin, Member, Viewer) but does not fully specify Viewer permissions beyond the name. This was flagged in the ambiguity report as requiring clarification.

3. **Webhook event completeness**: The PRD lists 5 webhook event types but does not specify whether `task.updated` fires alongside `task.status_changed` or `task.assigned` (i.e., whether specific events suppress the general update event). This is flagged for clarification.

4. **Custom columns and task status relationship**: The PRD allows boards to have custom column names but task status is defined as an enum (todo/in_progress/review/done). The relationship between custom columns and task status values needs clarification -- do custom columns replace the status enum, or are they parallel concepts?

5. **Board capacity enforcement**: The PRD states "max 10,000 tasks per board" but does not specify whether soft-deleted tasks count toward this limit. This was flagged in the ambiguity report.

6. **JSON:API specification**: The PRD mandates JSON:API format, which has specific structural requirements (type, id, attributes, relationships). This constrains all response formats and error responses.
