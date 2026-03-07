# TaskFlow API -- Traceability Matrix

**Source PRD**: TaskFlow API -- Lightweight Task Management Service v1.0
**Analysis Date**: 2026-03-07

---

## PRD Feature -> User Story -> Acceptance Criteria -> Test Skeleton

| PRD Ref | PRD Feature | User Story | Acceptance Criterion | Test Skeleton | Priority |
|---------|-------------|------------|---------------------|---------------|----------|
| F1 | Task CRUD | US-1: Create a Task | AC-1.1: Task creation with required fields | TEST-1.1 | P0 (MVP) |
| F1 | Task CRUD | US-1: Create a Task | AC-1.2: Task creation with all optional fields | TEST-1.2 | P0 (MVP) |
| F1 | Task CRUD | US-1: Create a Task | AC-1.3: Title exceeds max length | TEST-1.3 | P0 (MVP) |
| F1 | Task CRUD | US-1: Create a Task | AC-1.4: Invalid priority value | TEST-1.4 | P0 (MVP) |
| F1 | Task CRUD | US-1: Create a Task | AC-1.5: Tags exceed max count | TEST-1.5 | P0 (MVP) |
| F1 | Task CRUD | US-2: Read Tasks | AC-2.1: Retrieve single task by ID | TEST-2.1 | P0 (MVP) |
| F1 | Task CRUD | US-2: Read Tasks | AC-2.2: Non-existent task returns 404 | TEST-2.2 | P0 (MVP) |
| F1 | Task CRUD | US-2: Read Tasks | AC-2.3: Soft-deleted task returns 404 | TEST-2.3 | P0 (MVP) |
| F1 | Task CRUD | US-3: Update a Task | AC-3.1: Update task status | TEST-3.1 | P0 (MVP) |
| F1 | Task CRUD | US-3: Update a Task | AC-3.2: Invalid status rejected | TEST-3.2 | P0 (MVP) |
| F1 | Task CRUD | US-3: Update a Task | AC-3.3: Update assignee | TEST-3.3 | P0 (MVP) |
| F1 | Task CRUD | US-4: Delete a Task | AC-4.1: Soft delete by creator | TEST-4.1 | P0 (MVP) |
| F1 | Task CRUD | US-4: Delete a Task | AC-4.2: Soft delete by Admin | TEST-4.2 | P0 (MVP) |
| F1 | Task CRUD | US-4: Delete a Task | AC-4.3: Delete denied for non-creator | TEST-4.3 | P0 (MVP) |
| F2 | Board Management | US-5: Create/Manage Boards | AC-5.1: Default columns | TEST-5.1 | P0 (MVP) |
| F2 | Board Management | US-5: Create/Manage Boards | AC-5.2: Custom columns | TEST-5.2 | P0 (MVP) |
| F2 | Board Management | US-5: Create/Manage Boards | AC-5.3: < 2 columns rejected | TEST-5.3 | P0 (MVP) |
| F2 | Board Management | US-5: Create/Manage Boards | AC-5.4: Name > 100 chars rejected | TEST-5.4 | P0 (MVP) |
| F2 | Board Management | US-6: Board Membership/Roles | AC-6.1: Owner invites member | TEST-6.1 | P0 (MVP) |
| F2 | Board Management | US-6: Board Membership/Roles | AC-6.2: Admin invites member | TEST-6.2 | P0 (MVP) |
| F2 | Board Management | US-6: Board Membership/Roles | AC-6.3: Non-admin invite denied | TEST-6.3 | P0 (MVP) |
| F3 | Webhook Notifications | US-7: Configure Webhooks | AC-7.1: Register webhook | TEST-7.1 | P0 (MVP) |
| F3 | Webhook Notifications | US-7: Configure Webhooks | AC-7.2: Webhook fires on creation | TEST-7.2 | P0 (MVP) |
| F3 | Webhook Notifications | US-7: Configure Webhooks | AC-7.3: Webhook retry on failure | TEST-7.3 | P0 (MVP) |
| F4 | Search and Filtering | US-8: Search/Filter Tasks | AC-8.1: Full-text search | TEST-8.1 | P1 (Phase 2) |
| F4 | Search and Filtering | US-8: Search/Filter Tasks | AC-8.2: Multi-criteria filter | TEST-8.2 | P1 (Phase 2) |
| F4 | Search and Filtering | US-8: Search/Filter Tasks | AC-8.3: Pagination cap at 100 | TEST-8.3 | P1 (Phase 2) |
| F4 | Search and Filtering | US-8: Search/Filter Tasks | AC-8.4: Sort results | TEST-8.4 | P1 (Phase 2) |
| F5 | Activity Log | US-9: Activity Log | AC-9.1: Log entry on mutation | TEST-9.1 | P2 (Phase 3) |
| F5 | Activity Log | US-9: Activity Log | AC-9.2: Retrieve log per task | TEST-9.2 | P2 (Phase 3) |
| F5 | Activity Log | US-9: Activity Log | AC-9.3: 90-day retention | TEST-9.3 | P2 (Phase 3) |

---

## Non-Functional Requirements Traceability

| PRD Source | NFR | Test Skeleton | Threshold |
|------------|-----|---------------|-----------|
| Success Criteria | NFR-1: API Response Time | TEST-NFR-1 | p95 < 200ms @ 50 concurrent users |
| Success Criteria | NFR-2: Uptime | (monitoring, not unit-testable) | >= 99.5% over 30 days |
| Success Criteria | NFR-3: Data Integrity | (covered by all mutation tests verifying DB state) | 0 lost mutations |
| Success Criteria | NFR-4: Webhook Delivery | TEST-7.3 (retry logic) | > 99% success within retry window |
| Constraints | NFR-5: Rate Limiting | TEST-NFR-5 | 100 req/min/user |
| Constraints | NFR-6: Board Capacity | TEST-NFR-6 | Max 10,000 tasks/board |

---

## Coverage Summary

| Metric | Count |
|--------|-------|
| PRD Features | 5 (F1-F5) |
| User Stories | 9 (US-1 through US-9) |
| Acceptance Criteria | 30 (functional) |
| Non-Functional Requirements | 6 (NFR-1 through NFR-6) |
| Test Skeletons | 33 (30 functional + 3 NFR) |
| Orphan PRD Requirements | 0 |
| Untested Acceptance Criteria | 0 |

---

## Reverse Traceability (Test -> PRD)

Every test skeleton traces back to at least one PRD requirement. No test exists without a corresponding PRD source. This confirms bidirectional traceability.

### Tests without PRD coverage (should be zero):
- None identified.

### PRD requirements without test coverage (should be zero):
- None identified.

### Notes on coverage gaps:
1. **NFR-2 (Uptime)**: Cannot be tested via unit/integration tests. Requires production monitoring infrastructure. Marked as operational requirement.
2. **NFR-3 (Data Integrity)**: Indirectly covered by all mutation tests that verify database state after operations. No separate test skeleton created as coverage is distributed.
3. **Webhook event types**: Tests explicitly cover `task.created`, `task.status_changed`, `task.assigned`, and `task.deleted`. The `task.updated` event (for non-status, non-assignment updates) is implicitly testable via AC-3.1/AC-3.3 patterns but not explicitly skeletoned. Consider adding a dedicated test for general `task.updated` events.
