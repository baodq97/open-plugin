# Design Traceability Matrix: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## 1. Full Traceability Matrix

### F1: Task CRUD

| Requirement | User Story | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-------------|-----------|-----------------|------------|--------------|-------------------|--------|------------|
| F1: Create tasks | US-001-001 | POST /boards/:boardId/tasks | tasks, activity_logs | TaskController, TaskService, TaskRepository, ActivityLogService | STR-TASK-S01, STR-TASK-T01, STR-TASK-T02, STR-TASK-D01, STR-TASK-E01, STR-AUTH-S01, STR-AUTH-T01 | ADR-001, ADR-002, ADR-003, ADR-006 | ITS-001, ITS-002, ITS-003, ITS-004, ITS-005, SECTS-001, SECTS-002 |
| F1: Read single task | US-001-002 | GET /boards/:boardId/tasks/:taskId | tasks | TaskController, TaskService, TaskRepository | STR-TASK-I01, STR-TASK-I02, STR-AUTH-S01 | ADR-001, ADR-002, ADR-003, ADR-006 | ITS-006, ITS-008, STS-001 |
| F1: List tasks | US-001-002 | GET /boards/:boardId/tasks | tasks | TaskController, TaskService, TaskRepository | STR-TASK-I01, STR-TASK-I02, STR-AUTH-S01 | ADR-001, ADR-002, ADR-003, ADR-006 | ITS-007, ITS-009 |
| F1: Update tasks | US-001-003 | PATCH /boards/:boardId/tasks/:taskId | tasks, activity_logs | TaskController, TaskService, TaskRepository, ActivityLogService, WebhookService | STR-TASK-T01, STR-TASK-T02, STR-TASK-R01, STR-TASK-E01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-003, ADR-004, ADR-006 | ITS-010, ITS-011, ITS-012, ITS-013, STS-002 |
| F1: Soft-delete tasks | US-001-004 | DELETE /boards/:boardId/tasks/:taskId | tasks, activity_logs | TaskController, TaskService, TaskRepository, ActivityLogService, WebhookService | STR-TASK-T02, STR-TASK-R01, STR-TASK-E02, STR-AUTH-S01 | ADR-001, ADR-002, ADR-003, ADR-004, ADR-006 | ITS-014, ITS-015, ITS-016, ITS-017, SECTS-003 |

### F2: Board Management

| Requirement | User Story | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-------------|-----------|-----------------|------------|--------------|-------------------|--------|------------|
| F2: Create boards | US-002-001 | POST /boards | boards, board_members | BoardController, BoardService, BoardRepository, MembershipRepository | STR-BOARD-S01, STR-BOARD-T01, STR-BOARD-T02, STR-BOARD-D01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-006 | ITS-018, ITS-019, ITS-020, ITS-021, ITS-022 |
| F2: Manage columns | US-002-002 | PATCH /boards/:boardId | boards | BoardController, BoardService, BoardRepository | STR-BOARD-T01, STR-BOARD-E01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-006 | ITS-023, ITS-024, ITS-025, SECTS-004 |
| F2: Invite/manage members | US-002-003 | POST /boards/:boardId/members | board_members | MemberController, MembershipService, MembershipRepository | STR-MEM-S01, STR-MEM-T01, STR-MEM-E01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-006 | ITS-026, ITS-027, ITS-028, ITS-029, SECTS-005 |

### F3: Webhook Notifications

| Requirement | User Story | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-------------|-----------|-----------------|------------|--------------|-------------------|--------|------------|
| F3: Configure webhooks | US-003-001 | POST /boards/:boardId/webhooks | webhooks | WebhookController, WebhookService, WebhookRepository | STR-WH-S01, STR-WH-I01, STR-WH-E01, STR-WHD-D01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-004, ADR-006 | ITS-030, ITS-031, ITS-032, SECTS-006, SECTS-007 |
| F3: Webhook delivery | US-003-002 | Outbound POST (async) | webhook_deliveries | WebhookService, WebhookDeliveryDriver, WebhookDeliveryRepository | STR-WH-T01, STR-WH-T02, STR-WH-D01, STR-WHD-T01, STR-WHD-D01, STR-WHD-E01 | ADR-004, ADR-006 | ITS-033, ITS-034, ITS-035, ITS-036, STS-003, SECTS-008 |
| F3: Webhook retry | US-003-003 | Internal retry queue | webhook_deliveries | WebhookService, WebhookRetryQueue, WebhookDeliveryRepository | STR-WH-D02, STR-WH-R01, STR-WHD-D01 | ADR-004, ADR-006 | ITS-037, ITS-038, ITS-039, STS-004 |

### F4: Search and Filtering

| Requirement | User Story | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-------------|-----------|-----------------|------------|--------------|-------------------|--------|------------|
| F4: Full-text search | US-004-001 | GET /tasks/search | tasks (search_vector) | SearchController, SearchService, SearchRepository | STR-SRCH-S01, STR-SRCH-T01, STR-SRCH-I01, STR-SRCH-D01, STR-SRCH-E01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-005, ADR-006 | ITS-040, ITS-041, ITS-042, ITS-043, STS-005, SECTS-009 |
| F4: Filter by attributes | US-004-002 | GET /tasks/search | tasks | SearchController, SearchService, SearchRepository | STR-SRCH-T02, STR-SRCH-I01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-005, ADR-006 | ITS-044, ITS-045, ITS-046, ITS-047 |
| F4: Pagination and sort | US-004-003 | GET /tasks/search | tasks | SearchController, SearchService, SearchRepository | STR-SRCH-D01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-005, ADR-006 | ITS-048, ITS-049, ITS-050, ITS-051, STS-006 |

### F5: Activity Log

| Requirement | User Story | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-------------|-----------|-----------------|------------|--------------|-------------------|--------|------------|
| F5: Record activity | US-005-001 | Internal (service layer) | activity_logs | ActivityLogService, ActivityLogRepository | STR-ALOG-S01, STR-ALOG-T01, STR-ALOG-R01 | ADR-006, ADR-007 | ITS-052, ITS-053, ITS-054, STS-007, SECTS-010 |
| F5: Retrieve activity (task) | US-005-002 | GET /boards/:boardId/tasks/:taskId/activity | activity_logs | ActivityController, ActivityLogService, ActivityLogRepository | STR-ALOG-I01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-006 | ITS-055, ITS-056, ITS-057 |
| F5: Retrieve activity (board) | US-005-002 | GET /boards/:boardId/activity | activity_logs | ActivityController, ActivityLogService, ActivityLogRepository | STR-ALOG-I01, STR-AUTH-S01 | ADR-001, ADR-002, ADR-006 | ITS-056, ITS-057 |
| F5: Retention purge | US-005-003 | Internal cron job | activity_logs | RetentionService, ActivityLogRepository | STR-ALOG-D01, STR-ALOG-E01 | ADR-007 | ITS-058, ITS-059, ITS-060, STS-008 |

---

## 2. NFR Traceability

| NFR | API Endpoint(s) | Data Model | Component(s) | STRIDE Threat(s) | ADR(s) | Test Scope |
|-----|-----------------|------------|--------------|-------------------|--------|------------|
| NFR-001-001 (p95 < 200ms) | All endpoints | All tables (indexes) | All controllers, services, repositories | STR-TREPO-D01, STR-SRCH-D01 | ADR-001, ADR-005, ADR-006 | T-NFR-001-001 |
| NFR-001-002 (Rate limit 100/min) | All endpoints | N/A | RateLimiterMiddleware | STR-RL-S01, STR-RL-D01, STR-RL-E01 | ADR-008 | T-NFR-001-002 |
| NFR-002-001 (JWT Auth) | All endpoints | N/A | AuthMiddleware | STR-AUTH-S01, STR-AUTH-S02, STR-AUTH-T01, STR-AUTH-I01, STR-AUTH-D01, STR-AUTH-E01 | ADR-002 | T-NFR-002-001 |
| NFR-002-002 (RBAC) | All mutation endpoints | board_members | MembershipService, all service layers | STR-TASK-E01, STR-TASK-E02, STR-BOARD-E01, STR-MEM-E01, STR-WH-E01, STR-SRCH-E01 | ADR-002 | T-NFR-002-002 |
| NFR-002-003 (Webhook HMAC) | Outbound webhook | webhooks | WebhookDeliveryDriver | STR-WH-T02, STR-WHD-T01 | ADR-004 | T-NFR-002-003 |
| NFR-003-001 (10K tasks) | GET /boards/:boardId/tasks, GET /tasks/search | tasks (indexes) | TaskRepository, SearchRepository | STR-TREPO-D01, STR-SRCH-D01 | ADR-005, ADR-006 | T-NFR-003-001 |
| NFR-003-002 (50 concurrent) | All endpoints | All tables | All components | STR-TREPO-D01, STR-RL-D01 | ADR-001, ADR-006, ADR-008 | T-NFR-003-002 |
| NFR-004-001 (99.5% uptime) | GET /healthz, GET /readyz | N/A | HealthController | STR-SSO-D01, STR-TREPO-D01 | ADR-001 | T-NFR-004-001 |
| NFR-004-002 (Zero data loss) | All mutation endpoints | All tables | All repositories (transactions) | STR-ALOG-R01, STR-TREPO-T01 | ADR-006 | T-NFR-004-002 |
| NFR-004-003 (Webhook 99%) | Outbound webhook | webhook_deliveries | WebhookService, WebhookRetryQueue | STR-WH-D01, STR-WH-D02 | ADR-004 | T-NFR-004-003 |
| NFR-005-001 (JSON:API) | All endpoints | N/A | JSON:API Serializers | STR-VAL-I01 | ADR-001 | T-NFR-005-001 |
| NFR-006-001 (TS strict) | N/A | N/A | All source files | N/A | ADR-001, ADR-006 | T-NFR-006-001 |
| NFR-006-002 (80% coverage) | N/A | N/A | All source files | N/A | ADR-001 | T-NFR-006-002 |
| NFR-007-001 (Docker/K8s) | GET /healthz, GET /readyz | N/A | HealthController, Dockerfile | N/A | ADR-001 | T-NFR-007-001 |

---

## 3. Component-to-Data Model Mapping

| Component | Primary Table(s) | Read Tables | Write Tables |
|-----------|-----------------|-------------|-------------|
| TaskController | tasks | tasks | N/A |
| TaskService | tasks, activity_logs | tasks, board_members | tasks, activity_logs |
| TaskRepository | tasks | tasks | tasks |
| BoardController | boards | boards | N/A |
| BoardService | boards, board_members | boards, board_members | boards, board_members |
| BoardRepository | boards | boards | boards |
| MemberController | board_members | board_members | N/A |
| MembershipService | board_members | board_members | board_members |
| MembershipRepository | board_members | board_members | board_members |
| WebhookController | webhooks | webhooks | N/A |
| WebhookService | webhooks, webhook_deliveries | webhooks | webhook_deliveries |
| WebhookRepository | webhooks | webhooks | webhooks |
| WebhookDeliveryRepository | webhook_deliveries | webhook_deliveries | webhook_deliveries |
| WebhookDeliveryDriver | webhook_deliveries | webhook_deliveries | webhook_deliveries |
| SearchController | tasks | tasks | N/A |
| SearchService | tasks, board_members | tasks, board_members | N/A |
| SearchRepository | tasks | tasks | N/A |
| ActivityController | activity_logs | activity_logs | N/A |
| ActivityLogService | activity_logs | activity_logs | activity_logs |
| ActivityLogRepository | activity_logs | activity_logs | activity_logs |
| RetentionService | activity_logs | activity_logs | activity_logs |
| AuthMiddleware | N/A | N/A (JWT verification) | N/A |
| RateLimiterMiddleware | N/A | N/A (in-memory store) | N/A |
| HealthController | N/A | pg pool (connection check) | N/A |

---

## 4. ADR Impact Matrix

| ADR | Affected Components | Affected Endpoints | Affected Tables |
|-----|--------------------|--------------------|-----------------|
| ADR-001 (Express) | All controllers, middleware | All endpoints | N/A |
| ADR-002 (JWT/JWKS) | AuthMiddleware, all services | All endpoints | board_members |
| ADR-003 (Soft delete) | TaskService, TaskRepository | DELETE, GET, search | tasks |
| ADR-004 (Webhook delivery) | WebhookService, DeliveryDriver, RetryQueue | Outbound webhook | webhook_deliveries |
| ADR-005 (PostgreSQL FTS) | SearchService, SearchRepository | GET /tasks/search | tasks (search_vector) |
| ADR-006 (Raw SQL + pg) | All repositories | All endpoints | All tables |
| ADR-007 (Retention) | RetentionService, ActivityLogRepo | Internal cron | activity_logs |
| ADR-008 (Rate limiting) | RateLimiterMiddleware | All endpoints | N/A |

---

## 5. Coverage Verification

| Metric | Count | Status |
|--------|-------|--------|
| User Stories traced to endpoints | 16/16 | PASS |
| API endpoints with request/response DTOs | 13/13 (excl. health) | PASS |
| Tables with STRIDE analysis | 6/6 | PASS |
| STRIDE categories per component | All 6 per component | PASS |
| ADRs with >= 2 alternatives | 8/8 | PASS |
| NFRs traced to components | 14/14 | PASS |
| Test scope assigned to all rows | All rows | PASS |
| Empty cells in matrix | 0 | PASS |
