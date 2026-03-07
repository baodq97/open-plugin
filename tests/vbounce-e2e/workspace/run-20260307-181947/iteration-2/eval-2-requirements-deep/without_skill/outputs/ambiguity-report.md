# TaskFlow API -- Ambiguity Report

**Source PRD**: TaskFlow API -- Lightweight Task Management Service v1.0
**Analysis Date**: 2026-03-07
**Scoring Method**: Each user story scored 0-100 where 0 = perfectly unambiguous, 100 = highly ambiguous. Target: all scores < 50.

---

## Ambiguity Scores by User Story

| Story | Title | Score | Rationale |
|-------|-------|-------|-----------|
| US-1 | Create a Task | 20 | Well-defined field constraints (types, lengths, enums). Minor ambiguity: default status not explicitly stated (inferred as "todo"). |
| US-2 | Read Tasks | 25 | Single task retrieval is clear. Ambiguity: bulk listing endpoint not explicitly described in PRD (list all tasks on a board). Soft-delete visibility behavior inferred. |
| US-3 | Update a Task | 30 | Status update is clear. Ambiguity: which fields are updatable is not explicitly enumerated (can you update board_id to move a task?). Partial update semantics (PATCH vs PUT) not stated. |
| US-4 | Delete a Task | 15 | Clear permission model (creator or Admin). Soft delete behavior explicit. Low ambiguity. |
| US-5 | Create/Manage Boards | 35 | Custom columns are defined but relationship to task status enum is ambiguous (see AMB-4 below). Board update/delete not described. |
| US-6 | Board Membership/Roles | 40 | Role permissions beyond invite capability are underspecified. Viewer permissions unclear. No role change or member removal described. |
| US-7 | Configure Webhooks | 25 | Webhook config is clear. Minor ambiguity: webhook management (update/delete webhooks) not described. Whether task.updated fires alongside specific events is unclear. |
| US-8 | Search/Filter Tasks | 20 | Well-specified search/filter/sort/pagination. Minor ambiguity: full-text search implementation (exact match vs fuzzy vs prefix). |
| US-9 | Activity Log | 30 | Core concept is clear. Ambiguity: access control for log (same as board access?). Retention trigger mechanism not specified. |

**Average Score: 26.7** (all scores < 50 -- PASS)

---

## Identified Ambiguities

### AMB-1: Default Task Status (Score Impact: Low)

**PRD Text**: "Each task has: ... status (todo/in_progress/review/done)"
**Ambiguity**: The PRD does not explicitly state the default status when a task is created without specifying one.
**Assumption Made**: Default status is "todo" (the first value in the list and the conventional default for task management systems).
**Recommendation**: Add "default: todo" to the status field specification.
**Severity**: Low

### AMB-2: Viewer Role Permissions (Score Impact: Medium)

**PRD Text**: "Role-based access control (Admin, Member, Viewer)"
**Ambiguity**: The PRD mentions three roles but only specifies that "Board owners and Admins can invite members" and "Only the task creator or an Admin can delete a task." Viewer permissions are never explicitly defined. Can Viewers create tasks? Update tasks? Or only read?
**Assumption Made**: Viewers can only read tasks and board information. They cannot create, update, or delete tasks.
**Recommendation**: Add a role-permission matrix to the PRD specifying what each role can do.
**Severity**: Medium

### AMB-3: Task.updated vs Specific Events (Score Impact: Medium)

**PRD Text**: "Supported events: task.created, task.updated, task.status_changed, task.assigned, task.deleted"
**Ambiguity**: When a task's status is changed, does the system fire both `task.updated` AND `task.status_changed`? Or only the more specific event? Same question for `task.assigned`.
**Assumption Made**: Specific events (`task.status_changed`, `task.assigned`) fire instead of `task.updated` for those specific field changes. `task.updated` fires for other field changes (title, description, priority, tags, due_date).
**Recommendation**: Clarify whether events are mutually exclusive or cumulative.
**Severity**: Medium

### AMB-4: Custom Columns vs Task Status Enum (Score Impact: High)

**PRD Text**: Board has "columns (ordered list of status labels, default: todo/in_progress/review/done)" and task has "status (todo/in_progress/review/done)"
**Ambiguity**: If a board has custom columns like ["backlog", "wip", "qa", "released"], are these the valid status values for tasks on that board? Or does the task status remain fixed as the 4 defaults regardless of column configuration?
**Assumption Made**: Custom columns define the valid status values for tasks on that board. The 4 default values are only defaults when no custom columns are specified.
**Recommendation**: Explicitly state whether task status values are derived from board columns or are a fixed enum.
**Severity**: High -- this fundamentally affects validation logic and data model.

### AMB-5: Board Update and Delete Operations (Score Impact: Medium)

**PRD Text**: "Users can organize tasks into boards" (only creation described)
**Ambiguity**: Can boards be updated (rename, add/remove columns)? Can boards be deleted? What happens to tasks if a board is deleted?
**Assumption Made**: Board update and delete are implied CRUD operations but are not MVP-critical. Not included in acceptance criteria for Phase 1.
**Recommendation**: Clarify board lifecycle operations.
**Severity**: Medium

### AMB-6: Soft Delete and Board Capacity (Score Impact: Low)

**PRD Text**: "Max 10,000 tasks per board" and "Deleting a task is a soft delete"
**Ambiguity**: Do soft-deleted tasks count toward the 10,000 task limit per board?
**Assumption Made**: Only active (non-deleted) tasks count toward the limit, since soft-deleted tasks are not visible to users.
**Recommendation**: Clarify whether the 10,000 limit applies to active tasks only or all tasks including soft-deleted.
**Severity**: Low

### AMB-7: Webhook Management Lifecycle (Score Impact: Low)

**PRD Text**: "Webhooks are configured per board (URL + secret for HMAC signing)"
**Ambiguity**: Can webhooks be updated or deleted after creation? Can multiple webhooks be registered per board? Is there a limit?
**Assumption Made**: Webhooks can be created and presumably deleted. Multiple webhooks per board are allowed. No explicit limit.
**Recommendation**: Specify webhook CRUD operations and any limits.
**Severity**: Low

### AMB-8: Authentication Boundary (Score Impact: Low)

**PRD Text**: "JWT-based, issued by existing company SSO (external -- not built here)"
**Ambiguity**: This is well-defined as out of scope. However, the JWT token structure (claims, expiry handling) is not specified. What claim identifies the user? What claim identifies the role?
**Assumption Made**: JWT `sub` claim identifies the user. Role is determined per-board from the membership table, not from the JWT.
**Recommendation**: Document expected JWT claims structure.
**Severity**: Low

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total ambiguities identified | 8 |
| High severity | 1 (AMB-4) |
| Medium severity | 3 (AMB-2, AMB-3, AMB-5) |
| Low severity | 4 (AMB-1, AMB-6, AMB-7, AMB-8) |
| Average ambiguity score | 26.7 |
| Maximum ambiguity score | 40 (US-6) |
| All scores < 50 | YES |
