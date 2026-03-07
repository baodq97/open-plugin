# Coverage Matrix: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: testing-engineer
**AC Coverage**: 100% (56/56 ACs covered by >= 1 test)

---

## AC-to-Test Mapping

### F1: Task CRUD (US-001-001 through US-001-004)

| AC ID | Test File | Test Name | Status |
|-------|-----------|-----------|--------|
| AC-US-001-001-01 | test/unit/validation.test.ts | should accept valid task payload | PASS |
| AC-US-001-001-01 | test/integration/task-crud.test.ts | should create task with valid payload (T-AC-US-001-001-01 / ITS-001) | PASS |
| AC-US-001-001-02 | test/unit/validation.test.ts | should reject payload without title | PASS |
| AC-US-001-001-02 | test/integration/task-crud.test.ts | should reject task creation without title (T-AC-US-001-001-02 / ITS-002) | PASS |
| AC-US-001-001-03 | test/unit/validation.test.ts | should reject title exceeding 200 characters | PASS |
| AC-US-001-001-03 | test/integration/task-crud.test.ts | should reject task with title exceeding 200 characters (T-AC-US-001-001-03 / ITS-003) | PASS |
| AC-US-001-001-04 | test/unit/task-service.test.ts | should reject Viewer from creating tasks | PASS |
| AC-US-001-001-04 | test/integration/task-crud.test.ts | should reject Viewer from creating tasks (T-AC-US-001-001-04 / ITS-004) | PASS |
| AC-US-001-001-05 | test/unit/validation.test.ts | should reject more than 10 tags | PASS |
| AC-US-001-001-05 | test/unit/validation.test.ts | should accept exactly 10 tags | PASS |
| AC-US-001-001-05 | test/integration/task-crud.test.ts | should reject task creation with more than 10 tags (T-AC-US-001-001-05 / ITS-005) | PASS |
| AC-US-001-002-01 | test/integration/task-crud.test.ts | should retrieve a single task by ID (T-AC-US-001-002-01 / ITS-006) | PASS |
| AC-US-001-002-02 | test/integration/task-crud.test.ts | should list all tasks on a board (T-AC-US-001-002-02 / ITS-007) | PASS |
| AC-US-001-002-03 | test/unit/task-service.test.ts | should reject when board does not exist | PASS |
| AC-US-001-002-03 | test/integration/task-crud.test.ts | should return 404 for nonexistent task (T-AC-US-001-002-03 / ITS-008) | PASS |
| AC-US-001-002-04 | test/integration/task-crud.test.ts | should exclude soft-deleted tasks from list (T-AC-US-001-002-04 / ITS-009) | PASS |
| AC-US-001-003-01 | test/integration/task-crud.test.ts | should update task fields (T-AC-US-001-003-01 / ITS-010) | PASS |
| AC-US-001-003-02 | test/unit/validation.test.ts | should reject invalid status enum | PASS |
| AC-US-001-003-02 | test/integration/task-crud.test.ts | should reject update with invalid status (T-AC-US-001-003-02 / ITS-011) | PASS |
| AC-US-001-003-03 | test/integration/task-crud.test.ts | should reject Viewer from updating tasks (T-AC-US-001-003-03 / ITS-012) | PASS |
| AC-US-001-003-04 | test/unit/validation.test.ts | should accept description at exactly 5000 characters | PASS |
| AC-US-001-003-04 | test/unit/validation.test.ts | should reject description exceeding 5000 characters | PASS |
| AC-US-001-003-04 | test/integration/task-crud.test.ts | should accept description at max length 5000 chars (T-AC-US-001-003-04 / ITS-013) | PASS |
| AC-US-001-004-01 | test/unit/task-service.test.ts | should allow creator to delete their own task | PASS |
| AC-US-001-004-01 | test/integration/task-crud.test.ts | should allow creator to soft-delete own task (T-AC-US-001-004-01 / ITS-014) | PASS |
| AC-US-001-004-02 | test/unit/task-service.test.ts | should allow Admin to delete another user's task | PASS |
| AC-US-001-004-02 | test/integration/task-crud.test.ts | should allow Admin to delete another user's task (T-AC-US-001-004-02 / ITS-015) | PASS |
| AC-US-001-004-03 | test/unit/task-service.test.ts | should reject non-creator Member from deleting task | PASS |
| AC-US-001-004-03 | test/integration/task-crud.test.ts | should reject non-creator Member from deleting task (T-AC-US-001-004-03 / ITS-016) | PASS |
| AC-US-001-004-04 | test/integration/task-crud.test.ts | should return 404 for already-deleted task (T-AC-US-001-004-04 / ITS-017) | PASS |

### F2: Board Management (US-002-001 through US-002-003)

| AC ID | Test File | Test Name | Status |
|-------|-----------|-----------|--------|
| AC-US-002-001-01 | test/unit/board-service.test.ts | should create board with default columns | PASS |
| AC-US-002-001-01 | test/integration/board-management.test.ts | should create board with default columns (T-AC-US-002-001-01 / ITS-018) | PASS |
| AC-US-002-001-02 | test/unit/validation.test.ts | should reject payload without name | PASS |
| AC-US-002-001-02 | test/integration/board-management.test.ts | should reject board creation without name (T-AC-US-002-001-02 / ITS-019) | PASS |
| AC-US-002-001-03 | test/unit/validation.test.ts | should reject name exceeding 100 characters | PASS |
| AC-US-002-001-03 | test/integration/board-management.test.ts | should reject board name exceeding 100 chars (T-AC-US-002-001-03 / ITS-020) | PASS |
| AC-US-002-001-04 | test/unit/validation.test.ts | should accept 2-column layout | PASS |
| AC-US-002-001-04 | test/integration/board-management.test.ts | should create board with custom 2-column layout (T-AC-US-002-001-04 / ITS-021) | PASS |
| AC-US-002-001-05 | test/unit/validation.test.ts | should reject fewer than 2 columns | PASS |
| AC-US-002-001-05 | test/integration/board-management.test.ts | should reject board with fewer than 2 columns (T-AC-US-002-001-05 / ITS-022) | PASS |
| AC-US-002-002-01 | test/integration/board-management.test.ts | should rename board columns (T-AC-US-002-002-01 / ITS-023) | PASS |
| AC-US-002-002-02 | test/integration/board-management.test.ts | should reject reducing columns below minimum (T-AC-US-002-002-02 / ITS-024) | PASS |
| AC-US-002-002-03 | test/unit/board-service.test.ts | should reject non-owner non-Admin from updating board | PASS |
| AC-US-002-002-03 | test/integration/board-management.test.ts | should reject non-owner Member from modifying columns (T-AC-US-002-002-03 / ITS-025) | PASS |
| AC-US-002-003-01 | test/unit/membership-service.test.ts | should invite a new member | PASS |
| AC-US-002-003-01 | test/integration/board-management.test.ts | should invite user to board (T-AC-US-002-003-01 / ITS-026) | PASS |
| AC-US-002-003-02 | test/unit/validation.test.ts | should reject invalid role | PASS |
| AC-US-002-003-02 | test/integration/board-management.test.ts | should reject invalid role on invite (T-AC-US-002-003-02 / ITS-027) | PASS |
| AC-US-002-003-03 | test/unit/membership-service.test.ts | should reject invite from non-owner Member | PASS |
| AC-US-002-003-03 | test/integration/board-management.test.ts | should reject invite from non-owner Member (T-AC-US-002-003-03 / ITS-028) | PASS |
| AC-US-002-003-04 | test/unit/membership-service.test.ts | should update role of existing member | PASS |
| AC-US-002-003-04 | test/integration/board-management.test.ts | should update role of existing member (T-AC-US-002-003-04 / ITS-029) | PASS |

### F3: Webhook Notifications (US-003-001 through US-003-003)

| AC ID | Test File | Test Name | Status |
|-------|-----------|-----------|--------|
| AC-US-003-001-01 | test/integration/webhook.test.ts | should configure webhook for board (T-AC-US-003-001-01 / ITS-030) | PASS |
| AC-US-003-001-02 | test/unit/validation.test.ts | should reject non-HTTPS URL | PASS |
| AC-US-003-001-02 | test/unit/validation.test.ts | should reject invalid URL | PASS |
| AC-US-003-001-02 | test/integration/webhook.test.ts | should reject invalid webhook URL (T-AC-US-003-001-02 / ITS-031) | PASS |
| AC-US-003-001-03 | test/integration/webhook.test.ts | should reject webhook config from non-owner/non-Admin (T-AC-US-003-001-03 / ITS-032) | PASS |
| AC-US-003-002-01 | test/integration/webhook.test.ts | should fire webhook on task creation (T-AC-US-003-002-01 / ITS-033) | PASS |
| AC-US-003-002-02 | test/integration/webhook.test.ts | should fire webhook on status change with before/after (T-AC-US-003-002-02 / ITS-034) | PASS |
| AC-US-003-002-03 | test/integration/webhook.test.ts | should not fire webhook when none configured (T-AC-US-003-002-03 / ITS-035) | PASS |
| AC-US-003-002-04 | test/integration/webhook.test.ts | should fire separate webhooks for multiple rapid events (T-AC-US-003-002-04 / ITS-036) | PASS |
| AC-US-003-003-01 | test/integration/webhook.test.ts | should retry and succeed after initial failure (T-AC-US-003-003-01 / ITS-037) | PASS |
| AC-US-003-003-02 | test/integration/webhook.test.ts | should mark delivery as permanently failed after 4 attempts (T-AC-US-003-003-02 / ITS-038) | PASS |
| AC-US-003-003-03 | test/integration/webhook.test.ts | should follow exponential backoff timing (T-AC-US-003-003-03 / ITS-039) | PASS |

### F4: Search and Filtering (US-004-001 through US-004-003)

| AC ID | Test File | Test Name | Status |
|-------|-----------|-----------|--------|
| AC-US-004-001-01 | test/integration/search.test.ts | should return matching tasks from full-text search (T-AC-US-004-001-01 / ITS-040) | PASS |
| AC-US-004-001-02 | test/integration/search.test.ts | should return empty collection for no results (T-AC-US-004-001-02 / ITS-041) | PASS |
| AC-US-004-001-03 | test/unit/search-service.test.ts | should reject search without q and without filters | PASS |
| AC-US-004-001-03 | test/integration/search.test.ts | should reject search without q parameter (T-AC-US-004-001-03 / ITS-042) | PASS |
| AC-US-004-001-04 | test/unit/search-service.test.ts | should return empty if user has no accessible boards | PASS |
| AC-US-004-001-04 | test/integration/search.test.ts | should scope results to accessible boards (T-AC-US-004-001-04 / ITS-043) | PASS |
| AC-US-004-002-01 | test/integration/search.test.ts | should filter tasks by single attribute (T-AC-US-004-002-01 / ITS-044) | PASS |
| AC-US-004-002-02 | test/integration/search.test.ts | should combine filters with AND logic (T-AC-US-004-002-02 / ITS-045) | PASS |
| AC-US-004-002-03 | test/integration/search.test.ts | should filter by due date range inclusive (T-AC-US-004-002-03 / ITS-046) | PASS |
| AC-US-004-002-04 | test/unit/search-service.test.ts | should reject unknown filter field | PASS |
| AC-US-004-002-04 | test/integration/search.test.ts | should reject unknown filter field (T-AC-US-004-002-04 / ITS-047) | PASS |
| AC-US-004-003-01 | test/integration/search.test.ts | should default to 20 items per page (T-AC-US-004-003-01 / ITS-048) | PASS |
| AC-US-004-003-02 | test/integration/search.test.ts | should support custom page size and sort (T-AC-US-004-003-02 / ITS-049) | PASS |
| AC-US-004-003-03 | test/integration/search.test.ts | should reject page size exceeding 100 (T-AC-US-004-003-03 / ITS-050) | PASS |
| AC-US-004-003-04 | test/integration/search.test.ts | should return fewer items on last page (T-AC-US-004-003-04 / ITS-051) | PASS |

### F5: Activity Log (US-005-001 through US-005-003)

| AC ID | Test File | Test Name | Status |
|-------|-----------|-----------|--------|
| AC-US-005-001-01 | test/integration/activity-log.test.ts | should create log entry on task update (T-AC-US-005-001-01 / ITS-052) | PASS |
| AC-US-005-001-02 | test/integration/activity-log.test.ts | should create log entry on task creation (T-AC-US-005-001-02 / ITS-053) | PASS |
| AC-US-005-001-03 | test/integration/activity-log.test.ts | should create single log for multi-field update (T-AC-US-005-001-03 / ITS-054) | PASS |
| AC-US-005-002-01 | test/integration/activity-log.test.ts | should retrieve task activity log in reverse chronological order (T-AC-US-005-002-01 / ITS-055) | PASS |
| AC-US-005-002-02 | test/integration/activity-log.test.ts | should retrieve paginated board activity log (T-AC-US-005-002-02 / ITS-056) | PASS |
| AC-US-005-002-03 | test/integration/activity-log.test.ts | should reject unauthorized user from viewing board activity (T-AC-US-005-002-03 / ITS-057) | PASS |
| AC-US-005-003-01 | test/unit/retention-service.test.ts | should purge old entries in batches | PASS |
| AC-US-005-003-01 | test/integration/activity-log.test.ts | should purge entries older than 90 days (T-AC-US-005-003-01 / ITS-058) | PASS |
| AC-US-005-003-02 | test/integration/activity-log.test.ts | should retain entries at exactly 90 days (T-AC-US-005-003-02 / ITS-059) | PASS |
| AC-US-005-003-03 | test/unit/retention-service.test.ts | should complete without error when nothing to purge | PASS |
| AC-US-005-003-03 | test/integration/activity-log.test.ts | should succeed with no old entries (T-AC-US-005-003-03 / ITS-060) | PASS |

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total ACs | 56 |
| ACs with >= 1 test | 56 |
| AC Coverage | **100%** |
| Total test skeletons (T-AC-US-* + T-NFR-*) | 74 |
| Test skeletons implemented | 74 |
| Skeleton coverage | **100%** |
| Total ITS-* specs | 60 |
| ITS-* implemented | 60 |
| ITS coverage | **100%** |
| Total STS-* specs | 8 |
| STS-* implemented | 8 |
| STS coverage | **100%** |
| Total SECTS-* specs | 10 |
| SECTS-* implemented | 10 |
| SECTS coverage | **100%** |
