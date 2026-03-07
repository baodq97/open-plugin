# API Specification: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0
**Base URL**: `https://api.taskflow.internal/v1`
**Content-Type**: `application/vnd.api+json`

---

## 1. Common Headers

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <JWT>` from company SSO |
| `Content-Type` | Yes (POST/PATCH) | `application/vnd.api+json` |
| `Accept` | Recommended | `application/vnd.api+json` |
| `X-Request-Id` | Optional | Client-provided request correlation ID |

### Response Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/vnd.api+json` |
| `X-Request-Id` | Echo of client-provided or server-generated request ID |
| `X-RateLimit-Limit` | `100` (requests per minute) |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `Retry-After` | Seconds until rate limit resets (only on 429) |

---

## 2. Common Error Responses

### 401 Unauthorized
```json
{
  "errors": [{
    "status": "401",
    "title": "Unauthorized",
    "detail": "A valid JWT token is required"
  }]
}
```

### 403 Forbidden
```json
{
  "errors": [{
    "status": "403",
    "title": "Forbidden",
    "detail": "<context-specific message>"
  }]
}
```

### 404 Not Found
```json
{
  "errors": [{
    "status": "404",
    "title": "Not Found",
    "detail": "<resource> not found"
  }]
}
```

### 422 Unprocessable Entity
```json
{
  "errors": [{
    "status": "422",
    "title": "Validation Error",
    "detail": "<validation message>",
    "source": { "pointer": "/data/attributes/<field>" }
  }]
}
```

### 429 Too Many Requests
```json
{
  "errors": [{
    "status": "429",
    "title": "Too Many Requests",
    "detail": "Rate limit exceeded. Try again in {n} seconds"
  }]
}
```

---

## 3. F1: Task CRUD Endpoints

### 3.1 POST /boards/:boardId/tasks -- Create a Task

**User Stories**: US-001-001

**Auth**: JWT required; Member or Admin role on board

**Rate Limit**: 100 req/min per user

**Request DTO**:
```json
{
  "data": {
    "type": "tasks",
    "attributes": {
      "title": "Fix login bug",
      "description": "Users cannot log in with SSO on mobile",
      "status": "todo",
      "priority": "P1",
      "assignee": "user-uuid-123",
      "due_date": "2026-03-15",
      "tags": ["bug", "auth", "mobile"]
    }
  }
}
```

**Validation Rules**:
- `title`: required, string, max 200 characters
- `description`: optional, string, max 5000 characters
- `status`: optional, enum `[todo, in_progress, review, done]`, default `todo`
- `priority`: optional, enum `[P0, P1, P2, P3]`, default `P2`
- `assignee`: optional, string (user UUID)
- `due_date`: optional, ISO 8601 date string
- `tags`: optional, array of strings, max 10 items, each max 50 characters

**Response DTO** (201 Created):
```json
{
  "data": {
    "type": "tasks",
    "id": "task-uuid-456",
    "attributes": {
      "title": "Fix login bug",
      "description": "Users cannot log in with SSO on mobile",
      "status": "todo",
      "priority": "P1",
      "assignee": "user-uuid-123",
      "due_date": "2026-03-15",
      "tags": ["bug", "auth", "mobile"],
      "created_at": "2026-03-07T21:50:00Z",
      "updated_at": "2026-03-07T21:50:00Z"
    },
    "relationships": {
      "board": {
        "data": { "type": "boards", "id": "board-uuid-789" }
      }
    },
    "links": {
      "self": "/v1/boards/board-uuid-789/tasks/task-uuid-456"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Viewers cannot create tasks | User has Viewer role |
| 404 | Board not found | Board does not exist |
| 422 | Title is required | Missing title |
| 422 | Title must not exceed 200 characters | Title > 200 chars |
| 422 | Maximum 10 tags allowed | Tags array > 10 items |
| 422 | Status must be one of: todo, in_progress, review, done | Invalid status |
| 429 | Rate limit exceeded | > 100 req/min |

---

### 3.2 GET /boards/:boardId/tasks -- List Tasks on a Board

**User Stories**: US-001-002

**Auth**: JWT required; any role on board (Admin, Member, Viewer)

**Rate Limit**: 100 req/min per user

**Query Parameters**:
- None (returns all non-deleted tasks on the board)

**Response DTO** (200 OK):
```json
{
  "data": [
    {
      "type": "tasks",
      "id": "task-uuid-456",
      "attributes": {
        "title": "Fix login bug",
        "description": "...",
        "status": "todo",
        "priority": "P1",
        "assignee": "user-uuid-123",
        "due_date": "2026-03-15",
        "tags": ["bug", "auth"],
        "created_at": "2026-03-07T21:50:00Z",
        "updated_at": "2026-03-07T21:50:00Z"
      },
      "relationships": {
        "board": {
          "data": { "type": "boards", "id": "board-uuid-789" }
        }
      },
      "links": {
        "self": "/v1/boards/board-uuid-789/tasks/task-uuid-456"
      }
    }
  ],
  "meta": {
    "total": 5
  },
  "links": {
    "self": "/v1/boards/board-uuid-789/tasks"
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | You do not have access to this board | Not a board member |
| 404 | Board not found | Board does not exist |

---

### 3.3 GET /boards/:boardId/tasks/:taskId -- Get a Single Task

**User Stories**: US-001-002

**Auth**: JWT required; any role on board

**Rate Limit**: 100 req/min per user

**Response DTO** (200 OK):
```json
{
  "data": {
    "type": "tasks",
    "id": "task-uuid-456",
    "attributes": {
      "title": "Fix login bug",
      "description": "Users cannot log in with SSO on mobile",
      "status": "todo",
      "priority": "P1",
      "assignee": "user-uuid-123",
      "due_date": "2026-03-15",
      "tags": ["bug", "auth", "mobile"],
      "created_at": "2026-03-07T21:50:00Z",
      "updated_at": "2026-03-07T21:50:00Z"
    },
    "relationships": {
      "board": {
        "data": { "type": "boards", "id": "board-uuid-789" }
      }
    },
    "links": {
      "self": "/v1/boards/board-uuid-789/tasks/task-uuid-456"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | You do not have access to this board | Not a board member |
| 404 | Task not found | Task does not exist or is soft-deleted |

---

### 3.4 PATCH /boards/:boardId/tasks/:taskId -- Update a Task

**User Stories**: US-001-003

**Auth**: JWT required; Member or Admin role on board

**Rate Limit**: 100 req/min per user

**Request DTO** (partial update):
```json
{
  "data": {
    "type": "tasks",
    "id": "task-uuid-456",
    "attributes": {
      "status": "in_progress",
      "priority": "P0"
    }
  }
}
```

**Validation Rules**:
- `title`: optional, string, max 200 characters
- `description`: optional, string, max 5000 characters
- `status`: optional, enum `[todo, in_progress, review, done]`
- `priority`: optional, enum `[P0, P1, P2, P3]`
- `assignee`: optional, string (user UUID) or null (unassign)
- `due_date`: optional, ISO 8601 date string or null (remove)
- `tags`: optional, array of strings, max 10

**Response DTO** (200 OK): Same structure as GET single task, with updated fields and `updated_at` refreshed.

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Viewers cannot modify tasks | User has Viewer role |
| 404 | Task not found | Task does not exist or is soft-deleted |
| 422 | Title must not exceed 200 characters | Title > 200 chars |
| 422 | Description must not exceed 5000 characters | Description > 5000 chars |
| 422 | Status must be one of: todo, in_progress, review, done | Invalid status |

---

### 3.5 DELETE /boards/:boardId/tasks/:taskId -- Soft-Delete a Task

**User Stories**: US-001-004

**Auth**: JWT required; task creator or Admin role on board

**Rate Limit**: 100 req/min per user

**Request DTO**: None (no body required)

**Response DTO** (200 OK):
```json
{
  "data": {
    "type": "tasks",
    "id": "task-uuid-456",
    "attributes": {
      "title": "Fix login bug",
      "status": "todo",
      "deleted_at": "2026-03-07T22:00:00Z"
    },
    "links": {
      "self": "/v1/boards/board-uuid-789/tasks/task-uuid-456"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Only the task creator or an Admin can delete this task | Non-creator Member or Viewer |
| 404 | Task not found | Task does not exist or already soft-deleted |

---

## 4. F2: Board Management Endpoints

### 4.1 POST /boards -- Create a Board

**User Stories**: US-002-001

**Auth**: JWT required; any authenticated user

**Rate Limit**: 100 req/min per user

**Request DTO**:
```json
{
  "data": {
    "type": "boards",
    "attributes": {
      "name": "Sprint Board",
      "description": "Q1 sprint tracking",
      "columns": ["todo", "in_progress", "review", "done"]
    }
  }
}
```

**Validation Rules**:
- `name`: required, string, max 100 characters
- `description`: optional, string, max 500 characters
- `columns`: optional, array of strings, min 2; default `["todo", "in_progress", "review", "done"]`

**Response DTO** (201 Created):
```json
{
  "data": {
    "type": "boards",
    "id": "board-uuid-789",
    "attributes": {
      "name": "Sprint Board",
      "description": "Q1 sprint tracking",
      "columns": ["todo", "in_progress", "review", "done"],
      "owner_id": "user-uuid-001",
      "created_at": "2026-03-07T21:50:00Z",
      "updated_at": "2026-03-07T21:50:00Z"
    },
    "links": {
      "self": "/v1/boards/board-uuid-789"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 422 | Board name is required | Missing name |
| 422 | Board name must not exceed 100 characters | Name > 100 chars |
| 422 | A board must have at least 2 columns | Columns array < 2 items |

---

### 4.2 PATCH /boards/:boardId -- Update Board Settings

**User Stories**: US-002-002

**Auth**: JWT required; board owner or Admin role

**Rate Limit**: 100 req/min per user

**Request DTO**:
```json
{
  "data": {
    "type": "boards",
    "id": "board-uuid-789",
    "attributes": {
      "name": "Updated Board Name",
      "columns": ["backlog", "active", "complete"]
    }
  }
}
```

**Validation Rules**:
- `name`: optional, string, max 100 characters
- `description`: optional, string, max 500 characters
- `columns`: optional, array of strings, min 2

**Response DTO** (200 OK): Same structure as POST response, with updated fields.

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Only the board owner or an Admin can modify board settings | Non-owner Member or Viewer |
| 404 | Board not found | Board does not exist |
| 422 | A board must have at least 2 columns | Columns array < 2 items |

---

### 4.3 POST /boards/:boardId/members -- Invite Member / Update Role

**User Stories**: US-002-003

**Auth**: JWT required; board owner or Admin role

**Rate Limit**: 100 req/min per user

**Request DTO**:
```json
{
  "data": {
    "type": "board-members",
    "attributes": {
      "user_id": "user-uuid-002",
      "role": "Member"
    }
  }
}
```

**Validation Rules**:
- `user_id`: required, string (UUID)
- `role`: required, enum `[Admin, Member, Viewer]`

**Response DTO** (201 Created for new member, 200 OK for role update):
```json
{
  "data": {
    "type": "board-members",
    "id": "membership-uuid-321",
    "attributes": {
      "user_id": "user-uuid-002",
      "role": "Member",
      "joined_at": "2026-03-07T22:00:00Z"
    },
    "relationships": {
      "board": {
        "data": { "type": "boards", "id": "board-uuid-789" }
      }
    },
    "links": {
      "self": "/v1/boards/board-uuid-789/members/membership-uuid-321"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Only the board owner or an Admin can invite members | Non-owner Member or Viewer |
| 422 | Role must be one of: Admin, Member, Viewer | Invalid role value |

---

## 5. F3: Webhook Endpoints

### 5.1 POST /boards/:boardId/webhooks -- Configure Webhook

**User Stories**: US-003-001

**Auth**: JWT required; board owner or Admin role

**Rate Limit**: 100 req/min per user

**Request DTO**:
```json
{
  "data": {
    "type": "webhooks",
    "attributes": {
      "url": "https://example.com/hook",
      "secret": "my-secret-key",
      "events": ["task.created", "task.updated", "task.status_changed", "task.assigned", "task.deleted"]
    }
  }
}
```

**Validation Rules**:
- `url`: required, valid HTTPS URL
- `secret`: required, string, min 16 characters
- `events`: optional, array of event type enums; default: all events

**Response DTO** (201 Created):
```json
{
  "data": {
    "type": "webhooks",
    "id": "webhook-uuid-654",
    "attributes": {
      "url": "https://example.com/hook",
      "secret": "****-key",
      "events": ["task.created", "task.updated", "task.status_changed", "task.assigned", "task.deleted"],
      "active": true,
      "created_at": "2026-03-07T22:00:00Z"
    },
    "relationships": {
      "board": {
        "data": { "type": "boards", "id": "board-uuid-789" }
      }
    },
    "links": {
      "self": "/v1/boards/board-uuid-789/webhooks/webhook-uuid-654"
    }
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | Only the board owner or an Admin can configure webhooks | Non-owner Member or Viewer |
| 422 | Webhook URL must be a valid HTTPS URL | Invalid or non-HTTPS URL |

---

### 5.2 Webhook Delivery Payload (Outbound -- not an API endpoint)

**User Stories**: US-003-002, US-003-003

**Delivery**: HTTP POST to configured webhook URL

**Headers**:
```
Content-Type: application/json
X-Signature-256: sha256=<hex-encoded HMAC-SHA256>
X-Delivery-Id: <uuid>
X-Event-Type: task.created
User-Agent: TaskFlow-Webhook/1.0
```

**Payload**:
```json
{
  "delivery_id": "delivery-uuid-001",
  "event": "task.created",
  "timestamp": "2026-03-07T22:01:00Z",
  "actor": {
    "user_id": "user-uuid-001"
  },
  "data": {
    "task": {
      "id": "task-uuid-456",
      "board_id": "board-uuid-789",
      "title": "Fix login bug",
      "status": "todo",
      "priority": "P1",
      "assignee": null,
      "tags": ["bug"],
      "created_at": "2026-03-07T22:01:00Z"
    }
  }
}
```

**Status Change Event** includes previous values:
```json
{
  "delivery_id": "delivery-uuid-002",
  "event": "task.status_changed",
  "timestamp": "2026-03-07T22:05:00Z",
  "actor": { "user_id": "user-uuid-001" },
  "data": {
    "task": { "id": "task-uuid-456", "status": "in_progress" },
    "changes": {
      "status": { "from": "todo", "to": "in_progress" }
    }
  }
}
```

**Retry Policy**: 1s, 4s, 16s exponential backoff; 3 retries max (4 total attempts)

---

## 6. F4: Search and Filtering Endpoints

### 6.1 GET /tasks/search -- Search and Filter Tasks

**User Stories**: US-004-001, US-004-002, US-004-003

**Auth**: JWT required; results scoped to user's accessible boards

**Rate Limit**: 100 req/min per user

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes (for text search) | Full-text search query (max 200 chars) |
| `filter[status]` | string | No | Enum: todo, in_progress, review, done |
| `filter[priority]` | string | No | Enum: P0, P1, P2, P3 |
| `filter[assignee]` | string | No | User UUID |
| `filter[tags]` | string | No | Comma-separated tag values |
| `filter[board]` | string | No | Board UUID |
| `filter[due_date_from]` | string | No | ISO 8601 date (inclusive lower bound) |
| `filter[due_date_to]` | string | No | ISO 8601 date (inclusive upper bound) |
| `sort` | string | No | Field name; prefix `-` for descending. Allowed: `created_at`, `updated_at`, `due_date`, `priority`. Default: `-created_at` |
| `page[number]` | integer | No | Page number (1-based). Default: 1 |
| `page[size]` | integer | No | Items per page. Default: 20, max: 100 |

**Response DTO** (200 OK):
```json
{
  "data": [
    {
      "type": "tasks",
      "id": "task-uuid-456",
      "attributes": {
        "title": "Fix login bug",
        "description": "...",
        "status": "todo",
        "priority": "P1",
        "assignee": "user-uuid-123",
        "due_date": "2026-03-15",
        "tags": ["bug", "auth"],
        "created_at": "2026-03-07T21:50:00Z",
        "updated_at": "2026-03-07T21:50:00Z"
      },
      "relationships": {
        "board": {
          "data": { "type": "boards", "id": "board-uuid-789" }
        }
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
  },
  "links": {
    "self": "/v1/tasks/search?q=login&page[number]=1&page[size]=20",
    "next": "/v1/tasks/search?q=login&page[number]=2&page[size]=20",
    "last": "/v1/tasks/search?q=login&page[number]=3&page[size]=20"
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 400 | Unknown filter field: nonexistent_field | Invalid filter parameter |
| 422 | Search query parameter 'q' is required | Missing `q` when no filters provided |
| 422 | Page size must not exceed 100 | page[size] > 100 |

---

## 7. F5: Activity Log Endpoints

### 7.1 GET /boards/:boardId/tasks/:taskId/activity -- Task Activity Log

**User Stories**: US-005-002

**Auth**: JWT required; any role on board

**Rate Limit**: 100 req/min per user

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page[number]` | integer | No | Default: 1 |
| `page[size]` | integer | No | Default: 20, max: 100 |

**Response DTO** (200 OK):
```json
{
  "data": [
    {
      "type": "activity-logs",
      "id": "log-uuid-001",
      "attributes": {
        "action": "task.updated",
        "actor_id": "user-uuid-001",
        "timestamp": "2026-03-07T22:05:00Z",
        "changes": {
          "status": { "from": "todo", "to": "in_progress" },
          "priority": { "from": "P2", "to": "P0" }
        }
      },
      "relationships": {
        "task": {
          "data": { "type": "tasks", "id": "task-uuid-456" }
        }
      }
    }
  ],
  "meta": {
    "total": 5
  },
  "links": {
    "self": "/v1/boards/board-uuid-789/tasks/task-uuid-456/activity"
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | You do not have access to this board | Not a board member |
| 404 | Task not found | Task does not exist |

---

### 7.2 GET /boards/:boardId/activity -- Board Activity Log

**User Stories**: US-005-002

**Auth**: JWT required; any role on board

**Rate Limit**: 100 req/min per user

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page[number]` | integer | No | Default: 1 |
| `page[size]` | integer | No | Default: 20, max: 100 |

**Response DTO** (200 OK):
```json
{
  "data": [
    {
      "type": "activity-logs",
      "id": "log-uuid-001",
      "attributes": {
        "action": "task.created",
        "actor_id": "user-uuid-001",
        "timestamp": "2026-03-07T22:01:00Z",
        "changes": {
          "task": { "from": null, "to": { "title": "Fix login bug", "status": "todo" } }
        }
      },
      "relationships": {
        "task": {
          "data": { "type": "tasks", "id": "task-uuid-456" }
        },
        "board": {
          "data": { "type": "boards", "id": "board-uuid-789" }
        }
      }
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  },
  "links": {
    "self": "/v1/boards/board-uuid-789/activity"
  }
}
```

**Error Responses**:
| Status | Detail | Condition |
|--------|--------|-----------|
| 401 | A valid JWT token is required | Missing/invalid JWT |
| 403 | You do not have access to this board | Not a board member |
| 404 | Board not found | Board does not exist |

---

## 8. Health Check Endpoints

### 8.1 GET /healthz -- Liveness Probe

**Auth**: None (public)

**Response** (200 OK):
```json
{ "status": "ok" }
```

### 8.2 GET /readyz -- Readiness Probe

**Auth**: None (public)

**Response** (200 OK):
```json
{ "status": "ready", "checks": { "database": "ok" } }
```

**Response** (503 Service Unavailable):
```json
{ "status": "not ready", "checks": { "database": "error" } }
```

---

## 9. Endpoint Summary

| # | Method | Path | User Story | Description |
|---|--------|------|------------|-------------|
| 1 | POST | /boards/:boardId/tasks | US-001-001 | Create task |
| 2 | GET | /boards/:boardId/tasks | US-001-002 | List tasks on board |
| 3 | GET | /boards/:boardId/tasks/:taskId | US-001-002 | Get single task |
| 4 | PATCH | /boards/:boardId/tasks/:taskId | US-001-003 | Update task |
| 5 | DELETE | /boards/:boardId/tasks/:taskId | US-001-004 | Soft-delete task |
| 6 | POST | /boards | US-002-001 | Create board |
| 7 | PATCH | /boards/:boardId | US-002-002 | Update board settings |
| 8 | POST | /boards/:boardId/members | US-002-003 | Invite member / update role |
| 9 | POST | /boards/:boardId/webhooks | US-003-001 | Configure webhook |
| 10 | -- | Outbound POST to webhook URL | US-003-002, US-003-003 | Webhook delivery (async) |
| 11 | GET | /tasks/search | US-004-001, US-004-002, US-004-003 | Search and filter tasks |
| 12 | GET | /boards/:boardId/tasks/:taskId/activity | US-005-002 | Task activity log |
| 13 | GET | /boards/:boardId/activity | US-005-002 | Board activity log |
| 14 | -- | Internal scheduler | US-005-001 | Record activity log (internal) |
| 15 | -- | Internal cron job | US-005-003 | Retention purge (internal) |
| 16 | GET | /healthz | -- | Liveness probe |
| 17 | GET | /readyz | -- | Readiness probe |
