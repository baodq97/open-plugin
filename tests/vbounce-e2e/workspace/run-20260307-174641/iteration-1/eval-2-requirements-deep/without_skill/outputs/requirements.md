# Requirements Specification: TaskFlow API

**Source PRD**: TaskFlow API -- Lightweight Task Management Service v1.0
**Date**: 2026-03-07
**Status**: Derived from PRD Draft

---

## 1. Epics and User Stories

### Epic 1: Task CRUD (PRD Section F1)

#### US-001-001: Create a Task

**As a** board member,
**I want to** create a task on a board,
**so that** I can track a unit of work programmatically.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-001-001-01 | **GIVEN** an authenticated user who is a member of a board, **WHEN** they send a POST request with a valid title (1-200 chars), status, and priority, **THEN** the system creates the task, associates it with the specified board, and returns a 201 response with the task resource. |
| AC-001-001-02 | **GIVEN** an authenticated user, **WHEN** they send a POST request with a title exceeding 200 characters, **THEN** the system rejects the request with a 422 response and a validation error message. |
| AC-001-001-03 | **GIVEN** an authenticated user, **WHEN** they send a POST request without a title, **THEN** the system rejects the request with a 422 response indicating title is required. |
| AC-001-001-04 | **GIVEN** an authenticated user, **WHEN** they send a POST request with a description exceeding 5000 characters, **THEN** the system rejects the request with a 422 response. |
| AC-001-001-05 | **GIVEN** an authenticated user, **WHEN** they send a POST request with more than 10 tags, **THEN** the system rejects the request with a 422 response. |

---

#### US-001-002: Read a Task

**As a** board member,
**I want to** retrieve a task by its ID,
**so that** I can view its current state.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-001-002-01 | **GIVEN** an authenticated user with access to a board, **WHEN** they send a GET request with a valid task ID, **THEN** the system returns a 200 response with the full task resource including title, description, status, priority, assignee, due date, and tags. |
| AC-001-002-02 | **GIVEN** an authenticated user, **WHEN** they request a task ID that does not exist, **THEN** the system returns a 404 response. |
| AC-001-002-03 | **GIVEN** an authenticated user, **WHEN** they request a soft-deleted task, **THEN** the system returns a 404 response (soft-deleted tasks are not visible). |

---

#### US-001-003: Update a Task

**As a** board member,
**I want to** update a task's fields,
**so that** I can reflect progress or re-prioritize work.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-001-003-01 | **GIVEN** an authenticated user with access to the task's board, **WHEN** they send a PATCH request with valid field updates, **THEN** the system updates only the specified fields and returns a 200 response with the updated task. |
| AC-001-003-02 | **GIVEN** an authenticated user, **WHEN** they send a PATCH request changing the status field, **THEN** the system updates the status and a `task.status_changed` webhook event is emitted. |
| AC-001-003-03 | **GIVEN** an authenticated user, **WHEN** they send a PATCH request with an invalid priority value (not P0-P3), **THEN** the system rejects the request with a 422 response. |

---

#### US-001-004: Delete a Task (Soft Delete)

**As a** task creator or Admin,
**I want to** delete a task,
**so that** completed or invalid tasks are removed from view.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-001-004-01 | **GIVEN** an authenticated user who is the task creator, **WHEN** they send a DELETE request for the task, **THEN** the system sets the `deleted_at` timestamp and returns a 204 response. |
| AC-001-004-02 | **GIVEN** an authenticated user with the Admin role, **WHEN** they send a DELETE request for any task on a board they administer, **THEN** the system soft-deletes the task and returns a 204 response. |
| AC-001-004-03 | **GIVEN** an authenticated user who is neither the task creator nor an Admin, **WHEN** they send a DELETE request, **THEN** the system returns a 403 Forbidden response. |

---

#### US-001-005: Task Field Constraints

**As a** system operator,
**I want** tasks to enforce field-level constraints,
**so that** data integrity is maintained.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-001-005-01 | **GIVEN** a task creation or update request, **WHEN** the status value is not one of `todo`, `in_progress`, `review`, or `done`, **THEN** the system rejects the request with a 422 response. |
| AC-001-005-02 | **GIVEN** a task creation or update request, **WHEN** the priority value is not one of `P0`, `P1`, `P2`, or `P3`, **THEN** the system rejects the request with a 422 response. |
| AC-001-005-03 | **GIVEN** a task creation request, **WHEN** all required fields are provided and valid, **THEN** the task belongs to exactly one board and is persisted. |

---

### Epic 2: Board Management (PRD Section F2)

#### US-002-001: Create a Board

**As an** authenticated user,
**I want to** create a new board,
**so that** I can organize tasks into logical groupings.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-002-001-01 | **GIVEN** an authenticated user, **WHEN** they send a POST request with a valid board name (1-100 chars), **THEN** the system creates the board with default columns (`todo`, `in_progress`, `review`, `done`) and sets the creator as the owner, returning a 201 response. |
| AC-002-001-02 | **GIVEN** an authenticated user, **WHEN** they send a POST request with a name exceeding 100 characters, **THEN** the system rejects the request with a 422 response. |
| AC-002-001-03 | **GIVEN** an authenticated user, **WHEN** they send a POST request with custom columns containing fewer than 2 entries, **THEN** the system rejects the request with a 422 response. |

---

#### US-002-002: Configure Board Columns

**As a** board owner or Admin,
**I want to** customize column names,
**so that** the board reflects my team's workflow.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-002-002-01 | **GIVEN** a board owner, **WHEN** they update the board columns to a new ordered list of at least 2 column names, **THEN** the system persists the change and returns the updated board. |
| AC-002-002-02 | **GIVEN** a board owner, **WHEN** they attempt to set fewer than 2 columns, **THEN** the system rejects the request with a 422 response. |
| AC-002-002-03 | **GIVEN** a board member who is not the owner or an Admin, **WHEN** they attempt to modify columns, **THEN** the system returns a 403 Forbidden response. |

---

#### US-002-003: Invite Members and Set Roles

**As a** board owner or Admin,
**I want to** invite users to a board and assign them a role (Admin, Member, Viewer),
**so that** collaboration is controlled.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-002-003-01 | **GIVEN** a board owner, **WHEN** they invite a user by user ID and assign a role, **THEN** the invited user gains access to the board with the specified role. |
| AC-002-003-02 | **GIVEN** a user with the Admin role on a board, **WHEN** they invite a new member, **THEN** the system adds the user with the specified role. |
| AC-002-003-03 | **GIVEN** a user with the Member or Viewer role, **WHEN** they attempt to invite a user, **THEN** the system returns a 403 Forbidden response. |

---

### Epic 3: Webhook Notifications (PRD Section F3)

#### US-003-001: Configure Webhooks per Board

**As a** board owner or Admin,
**I want to** configure a webhook URL and secret for my board,
**so that** external systems receive notifications of task changes.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-003-001-01 | **GIVEN** a board owner, **WHEN** they register a webhook with a valid URL and HMAC secret, **THEN** the system persists the webhook configuration and returns a 201 response. |
| AC-003-001-02 | **GIVEN** a board member who is not an owner or Admin, **WHEN** they attempt to configure a webhook, **THEN** the system returns a 403 Forbidden response. |
| AC-003-001-03 | **GIVEN** a configured webhook, **WHEN** the system delivers a payload, **THEN** the payload is signed using HMAC with the configured secret. |

---

#### US-003-002: Webhook Event Delivery

**As an** external system,
**I want to** receive webhook payloads when task events occur,
**so that** I can react to changes in real time.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-003-002-01 | **GIVEN** a board with a configured webhook, **WHEN** a `task.created` event occurs, **THEN** the system delivers a webhook payload containing: event type, task snapshot, actor, and timestamp. |
| AC-003-002-02 | **GIVEN** a board with a configured webhook, **WHEN** a `task.status_changed` event occurs, **THEN** the system delivers the webhook payload to the configured URL. |
| AC-003-002-03 | **GIVEN** a board with a configured webhook, **WHEN** any of the supported events (`task.created`, `task.updated`, `task.status_changed`, `task.assigned`, `task.deleted`) occur, **THEN** the corresponding webhook is delivered. |

---

#### US-003-003: Webhook Retry on Failure

**As a** system operator,
**I want** failed webhook deliveries to be retried with exponential backoff,
**so that** transient failures do not cause lost notifications.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-003-003-01 | **GIVEN** a webhook delivery that fails (non-2xx response), **WHEN** the first retry occurs, **THEN** it happens after approximately 1 second. |
| AC-003-003-02 | **GIVEN** a webhook delivery that fails on the first retry, **WHEN** the second retry occurs, **THEN** it happens after approximately 4 seconds. |
| AC-003-003-03 | **GIVEN** a webhook delivery that fails on the second retry, **WHEN** the third and final retry occurs, **THEN** it happens after approximately 16 seconds. |
| AC-003-003-04 | **GIVEN** a webhook delivery that fails all 3 retries, **WHEN** all retries are exhausted, **THEN** the delivery is marked as failed and no further retries occur. |

---

### Epic 4: Search and Filtering (PRD Section F4)

#### US-004-001: Full-Text Search

**As a** board member,
**I want to** search tasks by keyword across title and description,
**so that** I can quickly find relevant tasks.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-004-001-01 | **GIVEN** an authenticated user, **WHEN** they submit a search query, **THEN** the system returns tasks where the title or description matches the query across all boards the user has access to. |
| AC-004-001-02 | **GIVEN** a search query, **WHEN** results exceed the page size, **THEN** the results are paginated with a default of 20 items per page. |
| AC-004-001-03 | **GIVEN** a search query, **WHEN** the user requests more than 100 results per page, **THEN** the system caps the page size at 100. |

---

#### US-004-002: Filter Tasks

**As a** board member,
**I want to** filter tasks by status, priority, assignee, tags, due date range, and board,
**so that** I can narrow down results to what I need.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-004-002-01 | **GIVEN** an authenticated user, **WHEN** they filter by status `in_progress`, **THEN** the system returns only tasks with that status across accessible boards. |
| AC-004-002-02 | **GIVEN** an authenticated user, **WHEN** they apply multiple filters simultaneously (e.g., status + priority + assignee), **THEN** the system returns only tasks matching all filter criteria (AND logic). |
| AC-004-002-03 | **GIVEN** an authenticated user, **WHEN** they filter by a due date range, **THEN** the system returns only tasks with due dates within the specified range. |

---

#### US-004-003: Sort Results

**As a** board member,
**I want to** sort search/filter results,
**so that** the most relevant tasks appear first.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-004-003-01 | **GIVEN** search results, **WHEN** the user specifies `sort=created_at`, **THEN** the results are ordered by creation date. |
| AC-004-003-02 | **GIVEN** search results, **WHEN** the user specifies `sort=priority`, **THEN** the results are ordered by priority (P0 first by default). |
| AC-004-003-03 | **GIVEN** search results, **WHEN** no sort parameter is provided, **THEN** the system uses a sensible default sort order (e.g., `created_at` descending). |

---

### Epic 5: Activity Log (PRD Section F5)

#### US-005-001: Record Activity

**As a** system operator,
**I want** every task action to be recorded in an immutable log,
**so that** there is a complete audit trail.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-005-001-01 | **GIVEN** a task is created, updated, or deleted, **WHEN** the action completes, **THEN** a log entry is written containing: actor, action type, timestamp, and before/after values for changed fields. |
| AC-005-001-02 | **GIVEN** an activity log entry, **WHEN** any user or system attempts to modify or delete it, **THEN** the system rejects the operation (log is immutable). |
| AC-005-001-03 | **GIVEN** an activity log entry older than 90 days, **WHEN** the retention job runs, **THEN** the entry is purged from the system. |

---

#### US-005-002: Query Activity Log

**As a** board member,
**I want to** retrieve activity log entries per task or per board,
**so that** I can review the history of changes.

**Acceptance Criteria:**

| AC ID | Criterion |
|-------|-----------|
| AC-005-002-01 | **GIVEN** an authenticated user with access to a board, **WHEN** they request the activity log for a specific task, **THEN** the system returns all log entries for that task in chronological order. |
| AC-005-002-02 | **GIVEN** an authenticated user, **WHEN** they request the activity log for a board, **THEN** the system returns all log entries for all tasks on that board. |
| AC-005-002-03 | **GIVEN** an authenticated user without access to a board, **WHEN** they request its activity log, **THEN** the system returns a 403 Forbidden response. |

---

## 2. Non-Functional Requirements

| NFR ID | Category | Requirement | Measurable Threshold | PRD Source |
|--------|----------|-------------|---------------------|------------|
| NFR-001 | Performance | API response time at p95 under load | < 200ms at p95 with 50 concurrent users | Success Criteria |
| NFR-002 | Availability | System uptime | >= 99.5% over any rolling 30-day period | Success Criteria |
| NFR-003 | Reliability | Zero data loss on task mutations | 0 lost writes; all mutations are durable before acknowledgement | Success Criteria |
| NFR-004 | Reliability | Webhook delivery success rate | > 99% within the retry window (initial + 3 retries) | Success Criteria |
| NFR-005 | Rate Limiting | Per-user request throttling | <= 100 requests/minute per authenticated user; 429 response when exceeded | Constraints |
| NFR-006 | Scalability | Task capacity per board | Support up to 10,000 tasks per board without degradation | Constraints |
| NFR-007 | Security | Authentication mechanism | JWT-based authentication via company SSO; all endpoints require valid JWT | Constraints |
| NFR-008 | Interoperability | API response format | All responses conform to JSON:API specification | Constraints |
| NFR-009 | Deployment | Containerization | Application packaged as a Docker container deployable to Kubernetes | Constraints |
| NFR-010 | Compatibility | Runtime environment | Node.js v20+ with TypeScript; PostgreSQL 16 | Constraints |
| NFR-011 | Data Retention | Activity log retention | Activity log entries retained for exactly 90 days, then purged | F5 |
| NFR-012 | Security | RBAC enforcement | All endpoints enforce role-based access control (Admin, Member, Viewer) | F2 |
