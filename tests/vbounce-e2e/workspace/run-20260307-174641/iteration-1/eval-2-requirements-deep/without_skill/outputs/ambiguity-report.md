# Ambiguity Analysis Report: TaskFlow API PRD

**Source**: TaskFlow API PRD v1.0
**Date**: 2026-03-07
**Analyst**: Requirements Agent (without skill)

---

## Scoring System

Each identified ambiguity is scored on two dimensions:

- **Severity** (1-5): How much impact the ambiguity could have on implementation correctness.
  - 1 = Cosmetic / negligible
  - 2 = Minor / easily resolved by convention
  - 3 = Moderate / could lead to different implementations
  - 4 = Significant / likely to cause rework
  - 5 = Critical / blocks correct implementation

- **Likelihood** (1-5): How likely it is that different engineers would interpret this differently.
  - 1 = Very unlikely
  - 2 = Unlikely
  - 3 = Possible
  - 4 = Likely
  - 5 = Very likely

- **Risk Score** = Severity x Likelihood (max 25)

---

## Ambiguity Register

### AMB-001: Viewer role permissions not fully defined

| Attribute | Value |
|---|---|
| PRD Section | F2: Board Management / Constraints (RBAC) |
| Description | The PRD defines three roles (Admin, Member, Viewer) but only specifies that "Board owners and Admins can invite members." It does not specify what Viewers can and cannot do beyond the implicit read access. Can Viewers create tasks? Can Viewers update tasks? Can Members delete boards? The full permission matrix is undefined. |
| Severity | 5 |
| Likelihood | 5 |
| Risk Score | **25** |
| Recommendation | Define a complete RBAC permission matrix mapping each role to each operation (create task, update task, delete task, manage board, configure webhooks, view activity log, etc.). |

---

### AMB-002: Board membership model unclear

| Attribute | Value |
|---|---|
| PRD Section | F1: Task CRUD / F2: Board Management |
| Description | The PRD states tasks belong to "exactly one board" and that board owners can "invite members," but it does not specify whether a user must be a board member to create tasks on that board. It also does not clarify whether the task creator must be explicitly invited or if any authenticated user can create tasks on any board. |
| Severity | 4 |
| Likelihood | 4 |
| Risk Score | **16** |
| Recommendation | Clarify: "Only users who are members (any role) of a board may create, view, or interact with tasks on that board." |

---

### AMB-003: Task status values vs. board custom columns

| Attribute | Value |
|---|---|
| PRD Section | F1 (status: todo/in_progress/review/done) vs. F2 (custom column names) |
| Description | F1 defines task status as an enum: `todo`, `in_progress`, `review`, `done`. F2 says boards can have "custom column names." It is unclear whether custom column names replace the task status enum, or whether columns and status are independent concepts. If a board has columns ["backlog", "doing", "shipped"], can tasks have status "backlog"? Or are tasks still constrained to the four fixed statuses? |
| Severity | 5 |
| Likelihood | 5 |
| Risk Score | **25** |
| Recommendation | Explicitly state whether: (a) custom columns override the status enum and tasks on a board use the board's columns as valid statuses, or (b) columns are a display-only grouping and task status remains a fixed enum. |

---

### AMB-004: Webhook configuration cardinality

| Attribute | Value |
|---|---|
| PRD Section | F3: Webhook Notifications |
| Description | The PRD says "Webhooks are configured per board (URL + secret for HMAC signing)." It is unclear whether a board can have multiple webhooks or exactly one. The singular "URL + secret" phrasing suggests one, but typical webhook systems allow multiple endpoints. |
| Severity | 3 |
| Likelihood | 4 |
| Risk Score | **12** |
| Recommendation | Clarify whether each board supports one webhook endpoint or multiple. If multiple, specify any limit. |

---

### AMB-005: Webhook failure definition

| Attribute | Value |
|---|---|
| PRD Section | F3: Webhook Notifications |
| Description | The PRD says "Failed webhook deliveries are retried" but does not define what constitutes a failure. Does a 3xx redirect count as failure? Does a timeout count? What is the timeout duration? Does a connection refused count? Only "non-2xx" is implied but not stated. |
| Severity | 3 |
| Likelihood | 3 |
| Risk Score | **9** |
| Recommendation | Define failure explicitly: "A webhook delivery is considered failed if the HTTP response status is not in the 2xx range, or if the connection times out after N seconds, or if the connection cannot be established." |

---

### AMB-006: Exponential backoff tolerance

| Attribute | Value |
|---|---|
| PRD Section | F3: Webhook Notifications |
| Description | Retry intervals are listed as "1s, 4s, 16s" which suggests a base-4 exponential backoff (4^0, 4^1, 4^2), but jitter is not mentioned. Production systems typically add jitter to avoid thundering herd. It is unclear whether exact timing or approximate timing is expected. |
| Severity | 2 |
| Likelihood | 3 |
| Risk Score | **6** |
| Recommendation | Specify whether jitter should be applied and what tolerance is acceptable (e.g., "1s +/- 500ms"). |

---

### AMB-007: Soft delete visibility in search and filtering

| Attribute | Value |
|---|---|
| PRD Section | F1 (soft delete) / F4 (search and filtering) |
| Description | F1 specifies soft delete with `deleted_at` timestamp, and we infer that soft-deleted tasks should not appear in GET by ID. However, F4 does not explicitly state whether soft-deleted tasks are excluded from search and filter results. |
| Severity | 3 |
| Likelihood | 3 |
| Risk Score | **9** |
| Recommendation | Add explicit statement: "Soft-deleted tasks MUST be excluded from all search, filter, and listing results." |

---

### AMB-008: Default sort order not specified

| Attribute | Value |
|---|---|
| PRD Section | F4: Search and Filtering |
| Description | The PRD lists sortable fields (created_at, updated_at, due_date, priority) but does not specify the default sort order when no sort parameter is provided, nor does it specify whether sort is ascending or descending by default. |
| Severity | 2 |
| Likelihood | 4 |
| Risk Score | **8** |
| Recommendation | Define default: "When no sort is specified, results are sorted by `created_at` descending. Sort direction defaults to ascending unless prefixed with `-` (e.g., `-created_at` for descending)." |

---

### AMB-009: Full-text search implementation details

| Attribute | Value |
|---|---|
| PRD Section | F4: Search and Filtering |
| Description | "Full-text search on title and description" does not specify whether this means substring matching, tokenized search, stemming, or PostgreSQL `tsvector`-based search. This significantly affects implementation complexity and result quality. |
| Severity | 3 |
| Likelihood | 4 |
| Risk Score | **12** |
| Recommendation | Specify search approach: "Use PostgreSQL full-text search with `tsvector` and `tsquery` for English language tokenization and stemming." |

---

### AMB-010: Activity log scope of "every action"

| Attribute | Value |
|---|---|
| PRD Section | F5: Activity Log |
| Description | "Every action on a task" is vague. Does this include read operations (GET)? Does it include failed operations? Does it include webhook-triggered actions or only user-initiated actions? Does board-level operations (adding members, changing columns) count if they affect tasks indirectly? |
| Severity | 3 |
| Likelihood | 4 |
| Risk Score | **12** |
| Recommendation | Enumerate logged actions explicitly: "Log entries are created for: task.created, task.updated (field changes), task.status_changed, task.assigned, task.deleted. Read-only operations and failed requests are not logged." |

---

### AMB-011: Rate limiting scope and reset behavior

| Attribute | Value |
|---|---|
| PRD Section | Constraints |
| Description | "100 requests/minute per user" does not specify whether this is a sliding window or a fixed window, and does not specify what happens when the limit is hit (429 status code? Retry-After header?). |
| Severity | 2 |
| Likelihood | 3 |
| Risk Score | **6** |
| Recommendation | Specify: "Rate limiting uses a sliding window of 60 seconds. When exceeded, the API returns 429 Too Many Requests with a `Retry-After` header indicating seconds until the next available slot." |

---

### AMB-012: Task assignee validation

| Attribute | Value |
|---|---|
| PRD Section | F1: Task CRUD |
| Description | The PRD says assignee is a "user ID" but does not specify whether the assignee must be a member of the board the task belongs to, or whether any valid user ID in the system is acceptable. It also does not specify whether a task can have multiple assignees or only one. |
| Severity | 3 |
| Likelihood | 4 |
| Risk Score | **12** |
| Recommendation | Clarify: "Assignee must be a user who is a member of the task's board. Each task has exactly one assignee (or none if unassigned)." |

---

### AMB-013: Board deletion not addressed

| Attribute | Value |
|---|---|
| PRD Section | F2: Board Management |
| Description | The PRD describes creating boards and managing members but never mentions deleting a board. Can boards be deleted? If so, what happens to tasks on the board? What happens to webhook configurations? Is it a soft delete like tasks? |
| Severity | 4 |
| Likelihood | 4 |
| Risk Score | **16** |
| Recommendation | Add a requirement for board deletion: specify whether it is supported, who can do it, and what cascade behavior applies to child entities (tasks, webhooks, members). |

---

### AMB-014: JWT validation details

| Attribute | Value |
|---|---|
| PRD Section | Constraints |
| Description | "JWT-based, issued by existing company SSO (external -- not built here)" leaves unclear: what claims must be in the JWT? How is the user ID extracted? What is the signing algorithm? Where is the public key / JWKS endpoint? How are expired tokens handled? |
| Severity | 3 |
| Likelihood | 3 |
| Risk Score | **9** |
| Recommendation | Provide a JWT contract: required claims (sub, exp, iat, roles), signing algorithm (e.g., RS256), JWKS endpoint URL, and behavior on expired/invalid tokens (401 Unauthorized). |

---

### AMB-015: "Max 10,000 tasks per board" enforcement mechanism

| Attribute | Value |
|---|---|
| PRD Section | Constraints |
| Description | The constraint "Max 10,000 tasks per board" is unclear about whether this is a hard limit enforced by the API (reject creation of the 10,001st task) or a performance design target (the system must perform well up to 10,000 tasks but does not reject beyond that). |
| Severity | 3 |
| Likelihood | 4 |
| Risk Score | **12** |
| Recommendation | Clarify: "The API MUST reject task creation on a board that already has 10,000 active tasks, returning a 422 response" OR "The system must maintain performance SLAs with up to 10,000 tasks per board; no hard limit is enforced." |

---

### AMB-016: Pagination metadata format

| Attribute | Value |
|---|---|
| PRD Section | F4: Search and Filtering / Constraints (JSON:API) |
| Description | While JSON:API is specified, the PRD does not clarify whether cursor-based or offset-based pagination should be used. JSON:API supports both patterns. This affects API contract and client implementation. |
| Severity | 2 |
| Likelihood | 3 |
| Risk Score | **6** |
| Recommendation | Specify pagination strategy: "Use offset-based pagination with `page[number]` and `page[size]` parameters, returning `meta.total` and `links.next`/`links.prev` per JSON:API." |

---

### AMB-017: Webhook payload schema not defined

| Attribute | Value |
|---|---|
| PRD Section | F3: Webhook Notifications |
| Description | The PRD says payloads include "event type, task snapshot, actor, timestamp" but does not define the exact JSON schema. What fields are in the task snapshot? Is it the full task resource or a subset? Is the actor a user ID or a full user object? |
| Severity | 3 |
| Likelihood | 3 |
| Risk Score | **9** |
| Recommendation | Define a webhook payload schema, e.g.: `{ event: string, task: TaskResource, actor: { id: string, name: string }, timestamp: ISO8601 }`. |

---

## Risk Summary

| Risk Level | Score Range | Count | IDs |
|---|---|---|---|
| Critical | 20-25 | 2 | AMB-001, AMB-003 |
| High | 12-19 | 5 | AMB-002, AMB-004, AMB-009, AMB-010, AMB-012, AMB-013, AMB-015 |
| Medium | 6-11 | 6 | AMB-005, AMB-006, AMB-007, AMB-008, AMB-011, AMB-014, AMB-016, AMB-017 |
| Low | 1-5 | 0 | -- |

**Total ambiguities identified**: 17

---

## Top 5 Ambiguities Requiring Immediate Resolution

| Priority | ID | Risk Score | Summary |
|---|---|---|---|
| 1 | AMB-003 | 25 | Task status enum vs. board custom columns -- contradictory requirements |
| 2 | AMB-001 | 25 | RBAC permission matrix undefined for all three roles |
| 3 | AMB-013 | 16 | Board deletion behavior unspecified |
| 4 | AMB-002 | 16 | Board membership requirement for task operations unspecified |
| 5 | AMB-015 | 12 | 10,000 task limit: hard cap or performance target |
