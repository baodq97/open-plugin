# TaskFlow API -- Test Skeletons

**Linked to**: requirements.md (acceptance criteria)
**Test Runner**: node:test (Node.js built-in)
**Language**: TypeScript

---

## US-1: Create a Task

### TEST-1.1: Create task with required fields only (AC-1.1)

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('POST /api/tasks', () => {
  it('should create a task with only required fields and default status', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Have a valid board ID

    // ACT
    // - POST /api/tasks with { title: "Valid task title", board_id: boardId }

    // ASSERT
    // - Response status is 201
    // - Response body follows JSON:API format (has data.type, data.id, data.attributes)
    // - data.attributes.title equals "Valid task title"
    // - data.attributes.status equals "todo" (default)
    // - data.attributes.created_at is a valid ISO timestamp
    // - Task exists in database when queried directly
  });
});
```

### TEST-1.2: Create task with all optional fields (AC-1.2)

```typescript
describe('POST /api/tasks', () => {
  it('should create a task with all optional fields populated', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Prepare payload with: title, description (5000 chars), priority "P1",
    //   assignee (valid user ID), due_date, tags (10 items)

    // ACT
    // - POST /api/tasks with full payload

    // ASSERT
    // - Response status is 201
    // - All provided fields are present in response and match input
    // - description length is 5000
    // - tags array has exactly 10 items
  });
});
```

### TEST-1.3: Reject task creation with title > 200 chars (AC-1.3)

```typescript
describe('POST /api/tasks - validation', () => {
  it('should reject title exceeding 200 characters', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Prepare payload with title of 201 characters

    // ACT
    // - POST /api/tasks

    // ASSERT
    // - Response status is 422
    // - Response body contains error referencing title length constraint
    // - No task created in database
  });
});
```

### TEST-1.4: Reject task creation with invalid priority (AC-1.4)

```typescript
describe('POST /api/tasks - validation', () => {
  it('should reject invalid priority value', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Prepare payload with priority "P5" (invalid)

    // ACT
    // - POST /api/tasks

    // ASSERT
    // - Response status is 422
    // - Response body contains error referencing valid priority values (P0-P3)
  });
});
```

### TEST-1.5: Reject task creation with > 10 tags (AC-1.5)

```typescript
describe('POST /api/tasks - validation', () => {
  it('should reject more than 10 tags', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Prepare payload with 11 tags

    // ACT
    // - POST /api/tasks

    // ASSERT
    // - Response status is 422
    // - Response body contains error referencing tags count limit
  });
});
```

---

## US-2: Read Tasks

### TEST-2.1: Retrieve a single task by ID (AC-2.1)

```typescript
describe('GET /api/tasks/:id', () => {
  it('should return the full task resource for a valid task ID', async () => {
    // ARRANGE
    // - Create a task with all fields populated
    // - Authenticate as a board member

    // ACT
    // - GET /api/tasks/:taskId

    // ASSERT
    // - Response status is 200
    // - JSON:API format with data.type === "tasks"
    // - All fields present: title, description, status, priority, assignee, due_date, tags, created_at, updated_at
  });
});
```

### TEST-2.2: Return 404 for non-existent task (AC-2.2)

```typescript
describe('GET /api/tasks/:id', () => {
  it('should return 404 for a non-existent task ID', async () => {
    // ARRANGE
    // - Authenticate as a board member
    // - Use a UUID that does not correspond to any task

    // ACT
    // - GET /api/tasks/:nonExistentId

    // ASSERT
    // - Response status is 404
    // - Response body contains error message
  });
});
```

### TEST-2.3: Return 404 for soft-deleted task (AC-2.3)

```typescript
describe('GET /api/tasks/:id', () => {
  it('should return 404 for a soft-deleted task', async () => {
    // ARRANGE
    // - Create a task, then soft-delete it
    // - Authenticate as a board member

    // ACT
    // - GET /api/tasks/:deletedTaskId

    // ASSERT
    // - Response status is 404
  });
});
```

---

## US-3: Update a Task

### TEST-3.1: Update task status (AC-3.1)

```typescript
describe('PATCH /api/tasks/:id', () => {
  it('should update task status and trigger status_changed webhook', async () => {
    // ARRANGE
    // - Create a task with status "todo"
    // - Register a webhook on the board
    // - Set up webhook listener (mock server)

    // ACT
    // - PATCH /api/tasks/:id with { status: "in_progress" }

    // ASSERT
    // - Response status is 200
    // - data.attributes.status === "in_progress"
    // - data.attributes.updated_at is more recent than created_at
    // - Webhook received event with type "task.status_changed"
  });
});
```

### TEST-3.2: Reject invalid status value (AC-3.2)

```typescript
describe('PATCH /api/tasks/:id - validation', () => {
  it('should reject invalid status value', async () => {
    // ARRANGE
    // - Create a task

    // ACT
    // - PATCH /api/tasks/:id with { status: "invalid_status" }

    // ASSERT
    // - Response status is 422
    // - Error message references valid status values
  });
});
```

### TEST-3.3: Update task assignee triggers assigned event (AC-3.3)

```typescript
describe('PATCH /api/tasks/:id', () => {
  it('should update assignee and trigger task.assigned webhook', async () => {
    // ARRANGE
    // - Create a task
    // - Register a webhook
    // - Set up webhook listener

    // ACT
    // - PATCH /api/tasks/:id with { assignee: newUserId }

    // ASSERT
    // - Response status is 200
    // - data.attributes.assignee === newUserId
    // - Webhook received event with type "task.assigned"
  });
});
```

---

## US-4: Delete a Task

### TEST-4.1: Soft delete by task creator (AC-4.1)

```typescript
describe('DELETE /api/tasks/:id', () => {
  it('should soft-delete when requested by the task creator', async () => {
    // ARRANGE
    // - Create a task as userA
    // - Register a webhook on the board

    // ACT
    // - DELETE /api/tasks/:id as userA

    // ASSERT
    // - Response status is 200 or 204
    // - Task record in DB has deleted_at set (not null)
    // - Task record still exists in DB (not hard deleted)
    // - Webhook received event with type "task.deleted"
  });
});
```

### TEST-4.2: Soft delete by Admin (AC-4.2)

```typescript
describe('DELETE /api/tasks/:id', () => {
  it('should allow Admin to soft-delete any task on the board', async () => {
    // ARRANGE
    // - Create a task as userA (Member)
    // - Authenticate as userB (Admin)

    // ACT
    // - DELETE /api/tasks/:id as userB (Admin)

    // ASSERT
    // - Response status is 200 or 204
    // - Task record has deleted_at set
  });
});
```

### TEST-4.3: Deny delete for non-creator Member (AC-4.3)

```typescript
describe('DELETE /api/tasks/:id', () => {
  it('should deny delete for a Member who is not the task creator', async () => {
    // ARRANGE
    // - Create a task as userA (Member)
    // - Authenticate as userB (Member, not creator)

    // ACT
    // - DELETE /api/tasks/:id as userB

    // ASSERT
    // - Response status is 403
    // - Error message indicates insufficient permissions
    // - Task record has no deleted_at (unchanged)
  });
});
```

---

## US-5: Create and Manage Boards

### TEST-5.1: Create board with default columns (AC-5.1)

```typescript
describe('POST /api/boards', () => {
  it('should create a board with default columns when none specified', async () => {
    // ARRANGE
    // - Authenticate as a user

    // ACT
    // - POST /api/boards with { name: "Sprint Board" }

    // ASSERT
    // - Response status is 201
    // - data.attributes.columns equals ["todo", "in_progress", "review", "done"]
    // - Board owner is the creating user
  });
});
```

### TEST-5.2: Create board with custom columns (AC-5.2)

```typescript
describe('POST /api/boards', () => {
  it('should create a board with custom columns', async () => {
    // ARRANGE
    // - Authenticate as a user
    // - Prepare custom columns: ["backlog", "wip", "testing", "shipped"]

    // ACT
    // - POST /api/boards with { name: "Custom Board", columns: ["backlog", "wip", "testing", "shipped"] }

    // ASSERT
    // - Response status is 201
    // - data.attributes.columns matches the provided list in order
  });
});
```

### TEST-5.3: Reject board with fewer than 2 columns (AC-5.3)

```typescript
describe('POST /api/boards - validation', () => {
  it('should reject a board with fewer than 2 columns', async () => {
    // ARRANGE
    // - Authenticate as a user

    // ACT
    // - POST /api/boards with { name: "Bad Board", columns: ["only_one"] }

    // ASSERT
    // - Response status is 422
    // - Error message indicates minimum 2 columns required
  });
});
```

### TEST-5.4: Reject board name exceeding 100 chars (AC-5.4)

```typescript
describe('POST /api/boards - validation', () => {
  it('should reject a board name exceeding 100 characters', async () => {
    // ARRANGE
    // - Authenticate as a user
    // - Prepare a name with 101 characters

    // ACT
    // - POST /api/boards with { name: longName }

    // ASSERT
    // - Response status is 422
    // - Error message references name length constraint
  });
});
```

---

## US-6: Board Membership and Roles

### TEST-6.1: Owner invites a member (AC-6.1)

```typescript
describe('POST /api/boards/:id/members', () => {
  it('should allow the board owner to invite a user as Member', async () => {
    // ARRANGE
    // - Create a board as userA (owner)
    // - Authenticate as userA

    // ACT
    // - POST /api/boards/:id/members with { user_id: userB, role: "member" }

    // ASSERT
    // - Response status is 201
    // - userB can now access the board (GET /api/boards/:id returns 200 for userB)
  });
});
```

### TEST-6.2: Admin invites a member (AC-6.2)

```typescript
describe('POST /api/boards/:id/members', () => {
  it('should allow an Admin to invite a user with a specified role', async () => {
    // ARRANGE
    // - Create a board, add userB as Admin
    // - Authenticate as userB (Admin)

    // ACT
    // - POST /api/boards/:id/members with { user_id: userC, role: "viewer" }

    // ASSERT
    // - Response status is 201
    // - userC has Viewer access to the board
  });
});
```

### TEST-6.3: Non-owner non-Admin cannot invite (AC-6.3)

```typescript
describe('POST /api/boards/:id/members', () => {
  it('should deny invite from a Member or Viewer', async () => {
    // ARRANGE
    // - Create a board, add userB as Member
    // - Authenticate as userB (Member)

    // ACT
    // - POST /api/boards/:id/members with { user_id: userC, role: "member" }

    // ASSERT
    // - Response status is 403
    // - Error indicates insufficient permissions
  });
});
```

---

## US-7: Configure Webhooks

### TEST-7.1: Register a webhook endpoint (AC-7.1)

```typescript
describe('POST /api/boards/:id/webhooks', () => {
  it('should register a webhook with URL and HMAC secret', async () => {
    // ARRANGE
    // - Create a board
    // - Authenticate as board owner or Admin

    // ACT
    // - POST /api/boards/:id/webhooks with { url: "https://example.com/hook", secret: "mysecret" }

    // ASSERT
    // - Response status is 201
    // - Webhook is persisted and associated with the board
  });
});
```

### TEST-7.2: Webhook fires on task creation (AC-7.2)

```typescript
describe('Webhook delivery - task.created', () => {
  it('should deliver task.created event to registered webhook with HMAC signature', async () => {
    // ARRANGE
    // - Create a board, register webhook with known secret
    // - Start a mock HTTP server to capture webhook deliveries

    // ACT
    // - Create a task on the board

    // ASSERT
    // - Mock server receives a POST request
    // - Payload contains: event === "task.created", task snapshot with all fields, actor ID, ISO timestamp
    // - Request has HMAC signature header that validates with the secret
  });
});
```

### TEST-7.3: Webhook retries on failure (AC-7.3)

```typescript
describe('Webhook delivery - retry logic', () => {
  it('should retry 3 times with exponential backoff on delivery failure', async () => {
    // ARRANGE
    // - Create a board, register webhook pointing to a mock server
    // - Configure mock server to return 500 for first 3 attempts, then 200

    // ACT
    // - Create a task (triggers webhook)
    // - Wait for retry window (~21 seconds total: 1s + 4s + 16s)

    // ASSERT
    // - Mock server received exactly 4 requests (1 initial + 3 retries)
    // - Timing between attempts follows exponential backoff pattern (approx 1s, 4s, 16s gaps)
    // - Final delivery marked as successful
  });
});
```

---

## US-8: Search and Filter Tasks

### TEST-8.1: Full-text search (AC-8.1)

```typescript
describe('GET /api/tasks/search', () => {
  it('should return tasks matching full-text search on title and description', async () => {
    // ARRANGE
    // - Create multiple tasks, some with "deployment" in title/description
    // - Authenticate as board member

    // ACT
    // - GET /api/tasks/search?q=deployment

    // ASSERT
    // - Response status is 200
    // - Only tasks containing "deployment" in title or description are returned
    // - Results are paginated with default page size of 20
    // - Response includes pagination meta (total_count, page, per_page)
  });
});
```

### TEST-8.2: Filter by multiple criteria (AC-8.2)

```typescript
describe('GET /api/tasks/search - filters', () => {
  it('should filter by status, priority, assignee, and due date range', async () => {
    // ARRANGE
    // - Create tasks with various statuses, priorities, assignees, due dates

    // ACT
    // - GET /api/tasks/search?status=in_progress&priority=P1&assignee=user123&due_before=2026-04-01&due_after=2026-03-01

    // ASSERT
    // - All returned tasks match ALL filter criteria
    // - No tasks outside the filter criteria are returned
  });
});
```

### TEST-8.3: Pagination cap at 100 (AC-8.3)

```typescript
describe('GET /api/tasks/search - pagination', () => {
  it('should cap page size at 100 even if more is requested', async () => {
    // ARRANGE
    // - Create > 100 tasks

    // ACT
    // - GET /api/tasks/search?per_page=200

    // ASSERT
    // - At most 100 tasks returned
    // - Pagination meta shows per_page capped at 100
  });
});
```

### TEST-8.4: Sort results by specified field (AC-8.4)

```typescript
describe('GET /api/tasks/search - sorting', () => {
  it('should sort results by the specified field and direction', async () => {
    // ARRANGE
    // - Create tasks with different due dates

    // ACT
    // - GET /api/tasks/search?sort=due_date&direction=asc

    // ASSERT
    // - Results are ordered by due_date ascending
    // - Each result's due_date is >= the previous result's due_date
  });
});
```

---

## US-9: Activity Log

### TEST-9.1: Log entry created on mutation (AC-9.1)

```typescript
describe('Activity Log - creation', () => {
  it('should create an immutable log entry on task mutation', async () => {
    // ARRANGE
    // - Create a task with status "todo"

    // ACT
    // - Update the task status to "in_progress"

    // ASSERT
    // - Activity log for the task contains an entry with:
    //   - actor: the user who made the change
    //   - action: "status_changed"
    //   - before: { status: "todo" }
    //   - after: { status: "in_progress" }
    //   - timestamp: valid ISO timestamp
  });
});
```

### TEST-9.2: Retrieve activity log per task (AC-9.2)

```typescript
describe('GET /api/tasks/:id/activity', () => {
  it('should return activity log entries in reverse chronological order', async () => {
    // ARRANGE
    // - Create a task, then make 3 updates

    // ACT
    // - GET /api/tasks/:id/activity

    // ASSERT
    // - Response status is 200
    // - At least 4 entries (1 create + 3 updates)
    // - Entries ordered by timestamp descending (most recent first)
  });
});
```

### TEST-9.3: Activity log retention (AC-9.3)

```typescript
describe('Activity Log - retention', () => {
  it('should purge log entries older than 90 days', async () => {
    // ARRANGE
    // - Insert log entries with timestamps 91 days ago and 89 days ago (direct DB setup)

    // ACT
    // - Trigger retention cleanup process (cron job or manual invocation)

    // ASSERT
    // - Entries older than 90 days are deleted
    // - Entries within 90 days are preserved
  });
});
```

---

## NFR Test Skeletons

### TEST-NFR-1: API Response Time Under Load

```typescript
// k6 load test script (separate from unit tests)
// - Simulate 50 concurrent virtual users
// - Each VU performs: create task, read task, update task, list tasks
// - Duration: 2 minutes
// - Assert: p95 response time < 200ms for all endpoints
```

### TEST-NFR-5: Rate Limiting

```typescript
describe('Rate Limiting', () => {
  it('should return 429 after 100 requests in a 60-second window', async () => {
    // ARRANGE
    // - Authenticate as a user

    // ACT
    // - Send 101 GET requests to /api/tasks within 60 seconds

    // ASSERT
    // - First 100 requests return 200
    // - 101st request returns 429 (Too Many Requests)
    // - Response includes Retry-After header
  });
});
```

### TEST-NFR-6: Board Capacity Limit

```typescript
describe('Board Capacity', () => {
  it('should reject task creation when board has 10,000 tasks', async () => {
    // ARRANGE
    // - Create a board with 10,000 tasks (bulk insert via DB)

    // ACT
    // - POST /api/tasks to create task #10,001

    // ASSERT
    // - Response status is 422
    // - Error message indicates board capacity limit reached
  });
});
```
