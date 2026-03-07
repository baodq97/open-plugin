# Test Skeletons: TaskFlow API

Generated during Requirements phase per V-Bounce Continuous Test Creation principle.
All tests are skeletons (no implementation yet). They will be instantiated during Implementation and validated during Testing.

---

## Epic 1: Task CRUD (F1)

### US-001-001: Create a Task

```
Test ID: T-AC-US-001-001-01
Title: Should_CreateTask_When_ValidDataProvided
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user with Member role on board "B1"; board has < 10,000 tasks
Steps:
  1. Send POST /boards/B1/tasks with { title: "Fix login bug", status: "todo", priority: "P1" }
Expected Result: HTTP 201; response body is JSON:API with generated UUID, created_at, and all fields
Test Data: Valid JWT for Member user; board "B1" exists with < 10,000 tasks
Automation Notes: Use supertest with Express app; assert JSON:API format compliance
```

```
Test ID: T-AC-US-001-001-02
Title: Should_RejectTaskCreation_When_TitleMissing
Type: Integration
Priority: P1-High
Preconditions: Authenticated user with Member role on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with { status: "todo", priority: "P1" } (no title field)
Expected Result: HTTP 422; error detail contains "title is required"
Test Data: Valid JWT for Member user
Automation Notes: Use supertest; assert error response structure matches JSON:API errors format
```

```
Test ID: T-AC-US-001-001-03
Title: Should_RejectTaskCreation_When_TitleExceeds200Chars
Type: Integration
Priority: P1-High
Preconditions: Authenticated user with Member role on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with { title: "a".repeat(201), status: "todo" }
Expected Result: HTTP 422; error detail contains "title must not exceed 200 characters"
Test Data: String of 201 characters for title field
Automation Notes: Use supertest; boundary value test
```

```
Test ID: T-AC-US-001-001-04
Title: Should_ForbidTaskCreation_When_UserIsViewer
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user with Viewer role on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with { title: "New task", status: "todo" }
Expected Result: HTTP 403; error detail contains "Viewers cannot create tasks"
Test Data: Valid JWT for Viewer user
Automation Notes: Use supertest; test RBAC enforcement
```

```
Test ID: T-AC-US-001-001-05
Title: Should_RejectTaskCreation_When_BoardTaskLimitReached
Type: Integration
Priority: P1-High
Preconditions: Board "B1" has exactly 10,000 non-deleted tasks
Steps:
  1. Send POST /boards/B1/tasks with valid data
Expected Result: HTTP 409; error detail contains "Board task limit of 10,000 reached"
Test Data: Board pre-populated with 10,000 tasks (may use DB seeding)
Automation Notes: Use supertest; requires database setup with 10,000 task records
```

### US-001-002: Read Tasks

```
Test ID: T-AC-US-001-002-01
Title: Should_ReturnTask_When_ValidTaskIdProvided
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user with any role on board "B1"; task "T1" exists on board "B1"
Steps:
  1. Send GET /tasks/T1
Expected Result: HTTP 200; response contains full task resource in JSON:API format
Test Data: Valid JWT; task "T1" seeded in database
Automation Notes: Use supertest; validate JSON:API resource structure
```

```
Test ID: T-AC-US-001-002-02
Title: Should_ReturnAllTasks_When_ListingBoardTasks
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user with any role on board "B1"; board has 3 non-deleted tasks
Steps:
  1. Send GET /boards/B1/tasks
Expected Result: HTTP 200; response contains array of 3 task resources in JSON:API format
Test Data: 3 tasks seeded on board "B1"
Automation Notes: Use supertest; assert array length and JSON:API collection format
```

```
Test ID: T-AC-US-001-002-03
Title: Should_Return404_When_TaskNotFound
Type: Integration
Priority: P1-High
Preconditions: Authenticated user with Viewer role on board "B1"
Steps:
  1. Send GET /tasks/nonexistent-uuid
Expected Result: HTTP 404; error detail "Task not found"
Test Data: UUID that does not exist in database
Automation Notes: Use supertest
```

```
Test ID: T-AC-US-001-002-04
Title: Should_ExcludeSoftDeletedTasks_When_ListingWithoutFilter
Type: Integration
Priority: P1-High
Preconditions: Task "T1" on board "B1" has deleted_at set
Steps:
  1. Send GET /boards/B1/tasks without include_deleted parameter
Expected Result: Response does not include task "T1"
Test Data: Soft-deleted task in database
Automation Notes: Use supertest; verify task ID absent from response array
```

### US-001-003: Update a Task

```
Test ID: T-AC-US-001-003-01
Title: Should_UpdateTaskStatus_When_ValidStatusProvided
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Member on board "B1"; task "T1" exists with status "todo"
Steps:
  1. Send PATCH /tasks/T1 with { status: "in_progress" }
Expected Result: HTTP 200; task status is "in_progress"; updated_at is set to current UTC
Test Data: Task "T1" seeded with status "todo"
Automation Notes: Use supertest; verify updated_at changed
```

```
Test ID: T-AC-US-001-003-02
Title: Should_RejectUpdate_When_InvalidStatusProvided
Type: Integration
Priority: P1-High
Preconditions: Authenticated Member on board "B1"; task "T1" exists
Steps:
  1. Send PATCH /tasks/T1 with { status: "invalid_status" }
Expected Result: HTTP 422; error detail "status must be one of: todo, in_progress, review, done"
Test Data: Task "T1" seeded
Automation Notes: Use supertest; enum validation test
```

```
Test ID: T-AC-US-001-003-03
Title: Should_ForbidUpdate_When_UserIsViewer
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Viewer on board "B1"; task "T1" exists
Steps:
  1. Send PATCH /tasks/T1 with { title: "New title" }
Expected Result: HTTP 403; error detail "Viewers cannot update tasks"
Test Data: Valid JWT for Viewer user
Automation Notes: Use supertest; RBAC enforcement test
```

### US-001-004: Soft-Delete a Task

```
Test ID: T-AC-US-001-004-01
Title: Should_SoftDeleteTask_When_CreatorDeletes
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user who created task "T1"
Steps:
  1. Send DELETE /tasks/T1
Expected Result: HTTP 200; task "T1" has deleted_at set to current UTC
Test Data: Task created by the authenticated user
Automation Notes: Use supertest; verify deleted_at in DB after request
```

```
Test ID: T-AC-US-001-004-02
Title: Should_SoftDeleteTask_When_AdminDeletesOthersTask
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Admin on board "B1"; task "T1" created by another user
Steps:
  1. Send DELETE /tasks/T1
Expected Result: HTTP 200; task "T1" has deleted_at set
Test Data: Task created by User A; Admin is User B
Automation Notes: Use supertest; test cross-user admin delete
```

```
Test ID: T-AC-US-001-004-03
Title: Should_ForbidDelete_When_NonCreatorMemberDeletes
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Member who did NOT create task "T1"
Steps:
  1. Send DELETE /tasks/T1
Expected Result: HTTP 403; error detail "Only the task creator or a board Admin can delete tasks"
Test Data: Task created by User A; Member is User B (non-admin)
Automation Notes: Use supertest; RBAC enforcement test
```

### US-001-005: Validate Task Input

```
Test ID: T-AC-US-001-005-01
Title: Should_RejectCreation_When_TagsExceed10Items
Type: Integration
Priority: P1-High
Preconditions: Authenticated Member on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with 11 tags
Expected Result: HTTP 422; error detail "tags must not exceed 10 items"
Test Data: Array of 11 tag strings
Automation Notes: Use supertest; boundary test
```

```
Test ID: T-AC-US-001-005-02
Title: Should_RejectCreation_When_InvalidPriority
Type: Integration
Priority: P1-High
Preconditions: Authenticated Member on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with { title: "Test", priority: "P5" }
Expected Result: HTTP 422; error detail "priority must be one of: P0, P1, P2, P3"
Test Data: Invalid priority value "P5"
Automation Notes: Use supertest; enum validation test
```

```
Test ID: T-AC-US-001-005-03
Title: Should_RejectCreation_When_DescriptionExceeds5000Chars
Type: Integration
Priority: P1-High
Preconditions: Authenticated Member on board "B1"
Steps:
  1. Send POST /boards/B1/tasks with { title: "Test", description: "a".repeat(5001) }
Expected Result: HTTP 422; error detail "description must not exceed 5000 characters"
Test Data: String of 5001 characters
Automation Notes: Use supertest; boundary test
```

---

## Epic 2: Board Management (F2)

### US-002-001: Create a Board

```
Test ID: T-AC-US-002-001-01
Title: Should_CreateBoardWithDefaultColumns_When_NoColumnsSpecified
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user
Steps:
  1. Send POST /boards with { name: "Sprint 42", description: "Q2 sprint board" }
Expected Result: HTTP 201; board has columns ["todo", "in_progress", "review", "done"]; user is Board Owner
Test Data: Valid JWT
Automation Notes: Use supertest; verify default columns and ownership
```

```
Test ID: T-AC-US-002-001-02
Title: Should_CreateBoardWithCustomColumns_When_ColumnsProvided
Type: Integration
Priority: P1-High
Preconditions: Authenticated user
Steps:
  1. Send POST /boards with { name: "Custom", columns: ["backlog", "doing", "done"] }
Expected Result: HTTP 201; board has exactly 3 specified columns
Test Data: Valid JWT; custom columns array
Automation Notes: Use supertest; verify column order preserved
```

```
Test ID: T-AC-US-002-001-03
Title: Should_RejectBoardCreation_When_FewerThan2Columns
Type: Integration
Priority: P1-High
Preconditions: Authenticated user
Steps:
  1. Send POST /boards with { name: "Bad Board", columns: ["only_one"] }
Expected Result: HTTP 422; error detail "boards must have at least 2 columns"
Test Data: Single-element columns array
Automation Notes: Use supertest; boundary test
```

### US-002-002: Manage Board Membership

```
Test ID: T-AC-US-002-002-01
Title: Should_AddMember_When_OwnerInvites
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Board Owner of "B1"; user "U2" not a member
Steps:
  1. Send POST /boards/B1/members with { user_id: "U2", role: "Member" }
Expected Result: HTTP 201; user "U2" is now a Member of "B1"
Test Data: Valid JWT for Board Owner; valid user ID for "U2"
Automation Notes: Use supertest; verify membership in DB
```

```
Test ID: T-AC-US-002-002-02
Title: Should_ForbidInvite_When_ViewerAttempts
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Viewer on board "B1"
Steps:
  1. Send POST /boards/B1/members with { user_id: "U3", role: "Member" }
Expected Result: HTTP 403; error detail "Only Board Owners and Admins can manage membership"
Test Data: Valid JWT for Viewer
Automation Notes: Use supertest; RBAC test
```

```
Test ID: T-AC-US-002-002-03
Title: Should_UpdateMemberRole_When_AdminChangesRole
Type: Integration
Priority: P1-High
Preconditions: Authenticated Admin on board "B1"; user "U2" has Member role
Steps:
  1. Send PATCH /boards/B1/members/U2 with { role: "Admin" }
Expected Result: HTTP 200; user "U2" role updated to Admin
Test Data: User "U2" seeded as Member
Automation Notes: Use supertest; verify role change in DB
```

### US-002-003: Customize Board Columns

```
Test ID: T-AC-US-002-003-01
Title: Should_UpdateColumns_When_OwnerModifies
Type: Integration
Priority: P1-High
Preconditions: Authenticated Board Owner of "B1"
Steps:
  1. Send PATCH /boards/B1 with { columns: ["backlog", "in_progress", "review", "done"] }
Expected Result: HTTP 200; columns updated to specified list in order
Test Data: Valid JWT for Board Owner
Automation Notes: Use supertest; verify column order in response
```

```
Test ID: T-AC-US-002-003-02
Title: Should_RejectColumnUpdate_When_BelowMinimum
Type: Integration
Priority: P1-High
Preconditions: Authenticated Board Owner of "B1"
Steps:
  1. Send PATCH /boards/B1 with { columns: ["only_one"] }
Expected Result: HTTP 422; error detail "boards must have at least 2 columns"
Test Data: Single-element columns array
Automation Notes: Use supertest; boundary test
```

```
Test ID: T-AC-US-002-003-03
Title: Should_ForbidColumnUpdate_When_MemberAttempts
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Member on board "B1"
Steps:
  1. Send PATCH /boards/B1 with { columns: ["a", "b", "c"] }
Expected Result: HTTP 403; error detail "Only Board Owners and Admins can modify board settings"
Test Data: Valid JWT for Member
Automation Notes: Use supertest; RBAC test
```

### US-002-004: Read Board Details

```
Test ID: T-AC-US-002-004-01
Title: Should_ReturnBoardDetails_When_MemberRequests
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user with any role on board "B1"
Steps:
  1. Send GET /boards/B1
Expected Result: HTTP 200; response includes name, description, columns, member list
Test Data: Board "B1" seeded with members
Automation Notes: Use supertest; validate JSON:API resource
```

```
Test ID: T-AC-US-002-004-02
Title: Should_Forbid_When_NonMemberRequestsBoardDetails
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user not a member of board "B1"
Steps:
  1. Send GET /boards/B1
Expected Result: HTTP 403; error detail "You are not a member of this board"
Test Data: Valid JWT for non-member user
Automation Notes: Use supertest; access control test
```

```
Test ID: T-AC-US-002-004-03
Title: Should_Return404_When_BoardNotFound
Type: Integration
Priority: P1-High
Preconditions: Authenticated user
Steps:
  1. Send GET /boards/nonexistent-uuid
Expected Result: HTTP 404; error detail "Board not found"
Test Data: UUID not in database
Automation Notes: Use supertest
```

---

## Epic 3: Webhook Notifications (F3)

### US-003-001: Configure Webhooks

```
Test ID: T-AC-US-003-001-01
Title: Should_RegisterWebhook_When_OwnerConfigures
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Board Owner or Admin on board "B1"
Steps:
  1. Send POST /boards/B1/webhooks with { url: "https://example.com/hook", secret: "mysecret" }
Expected Result: HTTP 201; webhook resource returned with ID
Test Data: Valid JWT for Board Owner
Automation Notes: Use supertest; verify webhook stored in DB
```

```
Test ID: T-AC-US-003-001-02
Title: Should_RejectWebhook_When_InvalidURL
Type: Integration
Priority: P1-High
Preconditions: Authenticated Board Owner on board "B1"
Steps:
  1. Send POST /boards/B1/webhooks with { url: "not-a-url", secret: "mysecret" }
Expected Result: HTTP 422; error detail "url must be a valid HTTPS URL"
Test Data: Invalid URL string
Automation Notes: Use supertest; URL validation test
```

```
Test ID: T-AC-US-003-001-03
Title: Should_ForbidWebhookConfig_When_MemberAttempts
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated Member on board "B1"
Steps:
  1. Send POST /boards/B1/webhooks with valid data
Expected Result: HTTP 403; error detail "Only Board Owners and Admins can configure webhooks"
Test Data: Valid JWT for Member
Automation Notes: Use supertest; RBAC test
```

### US-003-002: Deliver Webhook Notifications

```
Test ID: T-AC-US-003-002-01
Title: Should_SendWebhook_When_TaskCreated
Type: Integration
Priority: P0-Critical
Preconditions: Board "B1" has registered webhook at "https://example.com/hook" with secret "s1"
Steps:
  1. Create a task on board "B1"
  2. Capture outgoing HTTP request to webhook URL
Expected Result: POST to webhook URL with event "task.created", task snapshot, actor, timestamp; X-Signature header with HMAC-SHA256
Test Data: Webhook registered; mock HTTP server to capture request
Automation Notes: Use nock or msw to intercept outgoing requests; verify HMAC signature
```

```
Test ID: T-AC-US-003-002-02
Title: Should_SendWebhook_When_TaskStatusChanged
Type: Integration
Priority: P0-Critical
Preconditions: Board "B1" has registered webhook; task "T1" exists with status "todo"
Steps:
  1. Update task "T1" status to "in_progress"
  2. Capture outgoing webhook request
Expected Result: Webhook event is "task.status_changed" with updated snapshot
Test Data: Task "T1" seeded; mock HTTP server
Automation Notes: Use nock or msw
```

```
Test ID: T-AC-US-003-002-03
Title: Should_NotSendWebhook_When_NoneConfigured
Type: Integration
Priority: P1-High
Preconditions: Board "B1" has no registered webhooks
Steps:
  1. Create a task on board "B1"
Expected Result: No outgoing HTTP request is made; no error raised
Test Data: Board with no webhooks
Automation Notes: Use nock; verify no unexpected HTTP calls
```

### US-003-003: Retry Failed Webhooks

```
Test ID: T-AC-US-003-003-01
Title: Should_RetryWithExponentialBackoff_When_WebhookFails
Type: Integration
Priority: P0-Critical
Preconditions: Webhook delivery returns HTTP 500
Steps:
  1. Trigger a task event that fires webhook
  2. Mock webhook endpoint to return 500
  3. Observe retry timing
Expected Result: Retries at ~1s, ~4s, ~16s intervals (3 retries total)
Test Data: Mock server returning 500
Automation Notes: Use nock with timing assertions; may need fake timers
```

```
Test ID: T-AC-US-003-003-02
Title: Should_StopRetrying_When_RetrySucceeds
Type: Integration
Priority: P1-High
Preconditions: First webhook attempt fails, second succeeds
Steps:
  1. Mock webhook to fail once then return 200
  2. Trigger task event
Expected Result: Delivery marked as successful after 2nd attempt; no 3rd retry
Test Data: Mock server with sequential response control
Automation Notes: Use nock with response queue
```

```
Test ID: T-AC-US-003-003-03
Title: Should_MarkAsFailed_When_AllRetriesExhausted
Type: Integration
Priority: P1-High
Preconditions: Webhook endpoint consistently returns 500
Steps:
  1. Mock webhook to return 500 on all 4 attempts
  2. Trigger task event
Expected Result: After initial + 3 retries, delivery marked permanently failed; logged
Test Data: Mock server returning 500 on all requests
Automation Notes: Use nock; verify failure logged in DB/monitoring
```

---

## Epic 4: Search and Filtering (F4)

### US-004-001: Search Tasks

```
Test ID: T-AC-US-004-001-01
Title: Should_ReturnMatchingTasks_When_FullTextSearch
Type: Integration
Priority: P0-Critical
Preconditions: User has access to boards with tasks titled "Fix login bug" and "Update dashboard"
Steps:
  1. Send GET /tasks/search?q=login
Expected Result: HTTP 200; results include tasks with "login" in title or description
Test Data: Tasks seeded with specific titles
Automation Notes: Use supertest; verify search relevance
```

```
Test ID: T-AC-US-004-001-02
Title: Should_ReturnEmptyArray_When_NoSearchResults
Type: Integration
Priority: P1-High
Preconditions: User has access to boards with 5 tasks, none containing "xyz123"
Steps:
  1. Send GET /tasks/search?q=xyz123
Expected Result: HTTP 200; empty data array; pagination shows total_count: 0
Test Data: Tasks seeded without "xyz123"
Automation Notes: Use supertest
```

```
Test ID: T-AC-US-004-001-03
Title: Should_OnlySearchAccessibleBoards_When_CrossBoardSearch
Type: Integration
Priority: P0-Critical
Preconditions: User is Member of "B1" and "B2" but not "B3"; all have matching tasks
Steps:
  1. Send GET /tasks/search?q=deploy
Expected Result: Results include tasks from B1 and B2 only, not B3
Test Data: Tasks with "deploy" seeded on B1, B2, B3
Automation Notes: Use supertest; verify board-level access control in search
```

### US-004-002: Filter and Sort Tasks

```
Test ID: T-AC-US-004-002-01
Title: Should_FilterByStatus_When_StatusParamProvided
Type: Integration
Priority: P1-High
Preconditions: Tasks in various statuses on accessible boards
Steps:
  1. Send GET /tasks/search?status=in_progress
Expected Result: Only tasks with status "in_progress" returned
Test Data: Tasks with mixed statuses
Automation Notes: Use supertest; assert all results have correct status
```

```
Test ID: T-AC-US-004-002-02
Title: Should_SortByPriority_When_SortParamProvided
Type: Integration
Priority: P1-High
Preconditions: Tasks with different priorities
Steps:
  1. Send GET /tasks/search?sort=priority&order=asc
Expected Result: Tasks sorted P0 first, P3 last
Test Data: Tasks with P0, P1, P2, P3 priorities
Automation Notes: Use supertest; assert ordering
```

```
Test ID: T-AC-US-004-002-03
Title: Should_ApplyAllFilters_When_CombinedFilterProvided
Type: Integration
Priority: P1-High
Preconditions: Multiple tasks across boards
Steps:
  1. Send GET /tasks/search?status=todo&priority=P0&assignee=U1&sort=due_date
Expected Result: Only tasks matching ALL criteria returned, sorted by due_date
Test Data: Mixed tasks; some matching all filters, some matching partial
Automation Notes: Use supertest; verify AND logic
```

### US-004-003: Paginate Search Results

```
Test ID: T-AC-US-004-003-01
Title: Should_Return20Results_When_DefaultPagination
Type: Integration
Priority: P1-High
Preconditions: 50 tasks matching query
Steps:
  1. Send GET /tasks/search?q=test (no page_size)
Expected Result: 20 results returned; pagination metadata shows total_count: 50
Test Data: 50 matching tasks seeded
Automation Notes: Use supertest; verify default page size
```

```
Test ID: T-AC-US-004-003-02
Title: Should_ReturnCustomPageSize_When_PageSizeProvided
Type: Integration
Priority: P1-High
Preconditions: 50 tasks matching query
Steps:
  1. Send GET /tasks/search?q=test&page_size=10
Expected Result: 10 results per page
Test Data: 50 matching tasks
Automation Notes: Use supertest; verify result count
```

```
Test ID: T-AC-US-004-003-03
Title: Should_CapAt100_When_PageSizeExceedsMax
Type: Integration
Priority: P1-High
Preconditions: Tasks matching query
Steps:
  1. Send GET /tasks/search?q=test&page_size=200
Expected Result: Page size capped at 100; at most 100 results returned
Test Data: > 100 matching tasks
Automation Notes: Use supertest; boundary test
```

---

## Epic 5: Activity Log (F5)

### US-005-001: Record Task Activity

```
Test ID: T-AC-US-005-001-01
Title: Should_RecordActivityLog_When_TaskCreated
Type: Integration
Priority: P1-High
Preconditions: Authenticated user
Steps:
  1. Create a task "T1"
  2. Query activity log for task "T1"
Expected Result: Log entry with action "created", actor = user ID, before: null, after: task snapshot
Test Data: Valid JWT
Automation Notes: Use supertest; verify log entry in DB
```

```
Test ID: T-AC-US-005-001-02
Title: Should_RecordActivityLog_When_TaskStatusChanged
Type: Integration
Priority: P1-High
Preconditions: Task "T1" exists with status "todo"
Steps:
  1. Update task "T1" status to "in_progress"
  2. Query activity log
Expected Result: Log entry with action "status_changed", before: { status: "todo" }, after: { status: "in_progress" }
Test Data: Task "T1" seeded
Automation Notes: Use supertest
```

```
Test ID: T-AC-US-005-001-03
Title: Should_RejectModification_When_AttemptToAlterActivityLog
Type: Integration
Priority: P0-Critical
Preconditions: Activity log entry exists for task "T1"
Steps:
  1. Send PUT or DELETE to activity log entry endpoint
Expected Result: HTTP 405; error detail "Activity log entries are immutable"
Test Data: Existing log entry
Automation Notes: Use supertest; test both PUT and DELETE
```

### US-005-002: Retrieve Activity Log

```
Test ID: T-AC-US-005-002-01
Title: Should_ReturnTaskActivity_When_PerTaskLogRequested
Type: Integration
Priority: P1-High
Preconditions: Task "T1" has 5 activity log entries
Steps:
  1. Send GET /tasks/T1/activity
Expected Result: HTTP 200; 5 entries sorted by timestamp descending
Test Data: 5 log entries for task "T1"
Automation Notes: Use supertest; verify ordering
```

```
Test ID: T-AC-US-005-002-02
Title: Should_ReturnBoardActivity_When_PerBoardLogRequested
Type: Integration
Priority: P1-High
Preconditions: Board "B1" has tasks with 20 combined activity entries
Steps:
  1. Send GET /boards/B1/activity
Expected Result: HTTP 200; 20 entries sorted by timestamp descending
Test Data: Multiple tasks with logged activity
Automation Notes: Use supertest; verify aggregation and ordering
```

```
Test ID: T-AC-US-005-002-03
Title: Should_ForbidActivityAccess_When_NonMemberRequests
Type: Integration
Priority: P0-Critical
Preconditions: User is not a member of board "B1"
Steps:
  1. Send GET /boards/B1/activity
Expected Result: HTTP 403
Test Data: Valid JWT for non-member user
Automation Notes: Use supertest; access control test
```

### US-005-003: Purge Old Activity Entries

```
Test ID: T-AC-US-005-003-01
Title: Should_DeleteOldEntries_When_PurgeJobRuns
Type: Unit
Priority: P1-High
Preconditions: Activity log entries exist with timestamps > 90 days old
Steps:
  1. Run the scheduled purge job
Expected Result: All entries older than 90 days are deleted
Test Data: Entries with timestamps 91+ days ago
Automation Notes: Test purge logic directly; use fake timestamps
```

```
Test ID: T-AC-US-005-003-02
Title: Should_PreserveRecentEntries_When_PurgeJobRuns
Type: Unit
Priority: P1-High
Preconditions: Activity log entries exist within the last 90 days
Steps:
  1. Run the scheduled purge job
Expected Result: All entries within 90 days are preserved
Test Data: Entries with timestamps 1-89 days ago
Automation Notes: Test purge logic directly
```

```
Test ID: T-AC-US-005-003-03
Title: Should_PreserveBoundaryEntry_When_ExactlyAt90Days
Type: Unit
Priority: P2-Medium
Preconditions: Activity log entry with timestamp exactly 90 days ago
Steps:
  1. Run the scheduled purge job
Expected Result: The entry is preserved (strictly older than 90 days)
Test Data: Entry with exact 90-day-old timestamp
Automation Notes: Boundary test; use fake timestamps
```

---

## NFR Test Skeletons

```
Test ID: T-NFR-001-001
Title: Should_MeetP95Latency_When_50ConcurrentUsers
Type: Performance
Priority: P0-Critical
Preconditions: API deployed; database seeded with representative data
Steps:
  1. Run load test with 50 concurrent virtual users for 10 minutes
  2. Mix of CRUD, search, and webhook-triggering operations
Expected Result: p95 response time < 200ms
Test Data: k6 or artillery load test script
Automation Notes: Use k6 with custom scenario; measure p95 from results
```

```
Test ID: T-NFR-001-005
Title: Should_EnforceRateLimit_When_UserExceeds100RequestsPerMinute
Type: Integration
Priority: P0-Critical
Preconditions: Authenticated user
Steps:
  1. Send 101 requests within 60 seconds from a single user
Expected Result: The 101st request receives HTTP 429 Too Many Requests
Test Data: Valid JWT; rapid-fire requests
Automation Notes: Use supertest with timing control
```

```
Test ID: T-NFR-001-007
Title: Should_Reject_When_InvalidJWTProvided
Type: Security
Priority: P0-Critical
Preconditions: API running
Steps:
  1. Send request with no Authorization header
  2. Send request with invalid JWT
  3. Send request with expired JWT
Expected Result: All 3 requests receive HTTP 401
Test Data: No token, malformed token, expired token
Automation Notes: Use supertest; test auth middleware
```

```
Test ID: T-NFR-001-008
Title: Should_EnforceRBAC_When_UnauthorizedActionAttempted
Type: Security
Priority: P0-Critical
Preconditions: Users with Viewer, Member, Admin roles
Steps:
  1. Viewer attempts POST /boards/B1/tasks
  2. Member attempts DELETE /tasks/T1 (not their task)
  3. Viewer attempts POST /boards/B1/members
Expected Result: All requests return HTTP 403
Test Data: Users with each role seeded
Automation Notes: Use supertest; systematic RBAC matrix test
```

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Test Skeletons | 57 |
| Integration Tests | 51 |
| Unit Tests | 3 |
| Performance Tests | 1 |
| Security Tests | 2 |
| P0-Critical | 26 |
| P1-High | 25 |
| P2-Medium | 1 |
| Status | All skeleton (no implementation) |
