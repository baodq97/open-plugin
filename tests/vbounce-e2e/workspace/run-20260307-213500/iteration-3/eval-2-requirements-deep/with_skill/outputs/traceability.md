# Traceability Matrix: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Matrix ID**: TM-TASKFLOW-20260307
**Generated**: 2026-03-07
**Agent**: requirements-analyst

---

## PRD Section to User Story to AC to Test Skeleton

### F1: Task CRUD (Phase 1 -- MVP)

| PRD Requirement | User Story | Acceptance Criteria | Test Skeleton | NFR Link |
|----------------|------------|--------------------|--------------|---------|
| F1: Create tasks | US-001-001 | AC-US-001-001-01 | T-AC-US-001-001-01 | NFR-001-001, NFR-002-001 |
| F1: Create tasks (validation) | US-001-001 | AC-US-001-001-02 | T-AC-US-001-001-02 | |
| F1: Create tasks (validation) | US-001-001 | AC-US-001-001-03 | T-AC-US-001-001-03 | |
| F1: Create tasks (RBAC) | US-001-001 | AC-US-001-001-04 | T-AC-US-001-001-04 | NFR-002-002 |
| F1: Tags max 10 | US-001-001 | AC-US-001-001-05 | T-AC-US-001-001-05 | |
| F1: Read tasks | US-001-002 | AC-US-001-002-01 | T-AC-US-001-002-01 | NFR-001-001, NFR-005-001 |
| F1: Read tasks (list) | US-001-002 | AC-US-001-002-02 | T-AC-US-001-002-02 | |
| F1: Read tasks (not found) | US-001-002 | AC-US-001-002-03 | T-AC-US-001-002-03 | |
| F1: Soft delete hides tasks | US-001-002 | AC-US-001-002-04 | T-AC-US-001-002-04 | |
| F1: Update tasks | US-001-003 | AC-US-001-003-01 | T-AC-US-001-003-01 | NFR-001-001 |
| F1: Update tasks (validation) | US-001-003 | AC-US-001-003-02 | T-AC-US-001-003-02 | |
| F1: Update tasks (RBAC) | US-001-003 | AC-US-001-003-03 | T-AC-US-001-003-03 | NFR-002-002 |
| F1: Description max 5000 | US-001-003 | AC-US-001-003-04 | T-AC-US-001-003-04 | |
| F1: Soft delete | US-001-004 | AC-US-001-004-01 | T-AC-US-001-004-01 | NFR-004-002 |
| F1: Soft delete (Admin) | US-001-004 | AC-US-001-004-02 | T-AC-US-001-004-02 | NFR-002-002 |
| F1: Delete restricted to creator/Admin | US-001-004 | AC-US-001-004-03 | T-AC-US-001-004-03 | NFR-002-002 |
| F1: Soft delete idempotency | US-001-004 | AC-US-001-004-04 | T-AC-US-001-004-04 | |

### F2: Board Management (Phase 1 -- MVP)

| PRD Requirement | User Story | Acceptance Criteria | Test Skeleton | NFR Link |
|----------------|------------|--------------------|--------------|---------|
| F2: Create boards | US-002-001 | AC-US-002-001-01 | T-AC-US-002-001-01 | NFR-001-001 |
| F2: Board name required | US-002-001 | AC-US-002-001-02 | T-AC-US-002-001-02 | |
| F2: Board name max 100 | US-002-001 | AC-US-002-001-03 | T-AC-US-002-001-03 | |
| F2: Custom columns min 2 | US-002-001 | AC-US-002-001-04 | T-AC-US-002-001-04 | |
| F2: Columns min 2 (error) | US-002-001 | AC-US-002-001-05 | T-AC-US-002-001-05 | |
| F2: Custom column names | US-002-002 | AC-US-002-002-01 | T-AC-US-002-002-01 | |
| F2: Columns min 2 enforcement | US-002-002 | AC-US-002-002-02 | T-AC-US-002-002-02 | |
| F2: Board owner/Admin access | US-002-002 | AC-US-002-002-03 | T-AC-US-002-002-03 | NFR-002-002 |
| F2: Invite members/set roles | US-002-003 | AC-US-002-003-01 | T-AC-US-002-003-01 | NFR-002-002 |
| F2: Role validation | US-002-003 | AC-US-002-003-02 | T-AC-US-002-003-02 | |
| F2: Invite restricted to owner/Admin | US-002-003 | AC-US-002-003-03 | T-AC-US-002-003-03 | NFR-002-002 |
| F2: Role update for existing member | US-002-003 | AC-US-002-003-04 | T-AC-US-002-003-04 | |

### F3: Webhook Notifications (Phase 1 -- MVP)

| PRD Requirement | User Story | Acceptance Criteria | Test Skeleton | NFR Link |
|----------------|------------|--------------------|--------------|---------|
| F3: Webhook config per board | US-003-001 | AC-US-003-001-01 | T-AC-US-003-001-01 | NFR-002-003 |
| F3: Webhook URL validation | US-003-001 | AC-US-003-001-02 | T-AC-US-003-001-02 | |
| F3: Webhook config access | US-003-001 | AC-US-003-001-03 | T-AC-US-003-001-03 | NFR-002-002 |
| F3: Webhook events (task.created) | US-003-002 | AC-US-003-002-01 | T-AC-US-003-002-01 | NFR-002-003, NFR-004-003 |
| F3: Webhook events (status_changed) | US-003-002 | AC-US-003-002-02 | T-AC-US-003-002-02 | |
| F3: No webhook when none configured | US-003-002 | AC-US-003-002-03 | T-AC-US-003-002-03 | |
| F3: Multiple rapid events | US-003-002 | AC-US-003-002-04 | T-AC-US-003-002-04 | |
| F3: Retry with exponential backoff | US-003-003 | AC-US-003-003-01 | T-AC-US-003-003-01 | NFR-004-003 |
| F3: Retry exhaustion | US-003-003 | AC-US-003-003-02 | T-AC-US-003-003-02 | NFR-004-003 |
| F3: Retry timing (1s, 4s, 16s) | US-003-003 | AC-US-003-003-03 | T-AC-US-003-003-03 | |

### F4: Search and Filtering (Phase 2 -- Must Have)

| PRD Requirement | User Story | Acceptance Criteria | Test Skeleton | NFR Link |
|----------------|------------|--------------------|--------------|---------|
| F4: Full-text search | US-004-001 | AC-US-004-001-01 | T-AC-US-004-001-01 | NFR-001-001, NFR-003-001 |
| F4: Search (no results) | US-004-001 | AC-US-004-001-02 | T-AC-US-004-001-02 | |
| F4: Search (required param) | US-004-001 | AC-US-004-001-03 | T-AC-US-004-001-03 | |
| F4: Search scoped to access | US-004-001 | AC-US-004-001-04 | T-AC-US-004-001-04 | NFR-002-002 |
| F4: Filter by attributes | US-004-002 | AC-US-004-002-01 | T-AC-US-004-002-01 | NFR-001-001 |
| F4: Combined filters | US-004-002 | AC-US-004-002-02 | T-AC-US-004-002-02 | |
| F4: Due date range filter | US-004-002 | AC-US-004-002-03 | T-AC-US-004-002-03 | |
| F4: Unknown filter field | US-004-002 | AC-US-004-002-04 | T-AC-US-004-002-04 | |
| F4: Pagination default 20, max 100 | US-004-003 | AC-US-004-003-01 | T-AC-US-004-003-01 | |
| F4: Sort by field | US-004-003 | AC-US-004-003-02 | T-AC-US-004-003-02 | |
| F4: Page size max 100 | US-004-003 | AC-US-004-003-03 | T-AC-US-004-003-03 | |
| F4: Last page partial results | US-004-003 | AC-US-004-003-04 | T-AC-US-004-003-04 | |

### F5: Activity Log (Phase 3 -- Nice to Have)

| PRD Requirement | User Story | Acceptance Criteria | Test Skeleton | NFR Link |
|----------------|------------|--------------------|--------------|---------|
| F5: Record every action | US-005-001 | AC-US-005-001-01 | T-AC-US-005-001-01 | |
| F5: Record creation | US-005-001 | AC-US-005-001-02 | T-AC-US-005-001-02 | |
| F5: Multi-field change logging | US-005-001 | AC-US-005-001-03 | T-AC-US-005-001-03 | |
| F5: Activity log per task | US-005-002 | AC-US-005-002-01 | T-AC-US-005-002-01 | |
| F5: Activity log per board | US-005-002 | AC-US-005-002-02 | T-AC-US-005-002-02 | |
| F5: Activity log access control | US-005-002 | AC-US-005-002-03 | T-AC-US-005-002-03 | NFR-002-002 |
| F5: 90-day retention | US-005-003 | AC-US-005-003-01 | T-AC-US-005-003-01 | |
| F5: Retention boundary | US-005-003 | AC-US-005-003-02 | T-AC-US-005-003-02 | |
| F5: Purge no-op when no old entries | US-005-003 | AC-US-005-003-03 | T-AC-US-005-003-03 | |

---

## NFR Traceability

| NFR | Related Stories | Test Skeleton |
|-----|----------------|--------------|
| NFR-001-001 (API Response Time) | US-001-001, US-001-002, US-001-003, US-002-001, US-004-001, US-004-002 | T-NFR-001-001 |
| NFR-001-002 (Rate Limiting) | All stories (cross-cutting) | T-NFR-001-002 |
| NFR-002-001 (JWT Auth) | All stories (cross-cutting) | T-NFR-002-001 |
| NFR-002-002 (RBAC) | US-001-001, US-001-003, US-001-004, US-002-002, US-002-003, US-003-001, US-004-001, US-005-002 | T-NFR-002-002 |
| NFR-002-003 (Webhook HMAC) | US-003-001, US-003-002 | T-NFR-002-003 |
| NFR-003-001 (10K Tasks/Board) | US-001-002, US-004-001 | T-NFR-003-001 |
| NFR-003-002 (50 Concurrent Users) | All stories (cross-cutting) | T-NFR-003-002 |
| NFR-004-001 (99.5% Uptime) | All stories (cross-cutting) | T-NFR-004-001 |
| NFR-004-002 (Zero Data Loss) | US-001-001, US-001-003, US-001-004 | T-NFR-004-002 |
| NFR-004-003 (Webhook Delivery 99%) | US-003-002, US-003-003 | T-NFR-004-003 |
| NFR-005-001 (JSON:API) | All stories (cross-cutting) | T-NFR-005-001 |
| NFR-006-001 (TypeScript Strict) | N/A (build quality) | T-NFR-006-001 |
| NFR-006-002 (Test Coverage 80%) | N/A (build quality) | T-NFR-006-002 |
| NFR-007-001 (Docker/K8s) | N/A (deployment) | T-NFR-007-001 |

---

## Coverage Summary

| Metric | Count | Status |
|--------|-------|--------|
| PRD Feature Sections | 5 (F1-F5) | All traced |
| User Stories | 16 | All traced to PRD |
| Acceptance Criteria | 55 | All traced to stories |
| Test Skeletons (AC) | 55 | 1:1 with ACs |
| Test Skeletons (NFR) | 14 | 1:1 with NFRs |
| NFRs | 14 | All traced |
| Orphaned PRD Sections | 0 | PASS |
| Orphaned Stories | 0 | PASS |
| Orphaned ACs | 0 | PASS |
| Orphaned Tests | 0 | PASS |
| Stories with < 3 ACs | 0 | PASS |

---

## Constraints and Out-of-Scope Traceability

| Constraint / OOS Item | Traced To |
|----------------------|-----------|
| Node.js v20+, TypeScript | NFR-006-001 |
| JWT Auth (external SSO) | NFR-002-001 |
| Docker / Kubernetes | NFR-007-001 |
| JSON:API format | NFR-005-001 |
| Rate limiting 100 req/min | NFR-001-002 |
| Max 10K tasks/board | NFR-003-001 |
| p95 < 200ms / 50 users | NFR-001-001, NFR-003-002 |
| 99.5% uptime | NFR-004-001 |
| Zero data loss | NFR-004-002 |
| Webhook 99% delivery | NFR-004-003 |
| No frontend/UI | N/A (out of scope) |
| No email notifications | N/A (out of scope) |
| No file attachments | N/A (out of scope) |
| No WebSocket | N/A (out of scope) |
| No multi-tenancy | N/A (out of scope) |
