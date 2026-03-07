# Ambiguity Report: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: requirements-analyst

---

## First Pass: PRD Ambiguity Detection

The PRD was scanned sentence-by-sentence for ambiguous language. Items are categorized and scored for severity (1-10).

### Detected Ambiguities

| # | Location | Text | Category | Severity | Resolution |
|---|----------|------|----------|----------|------------|
| 1 | Background | "Teams waste ~3 hours/week" | Vague quantifier (approximate) | 2 | Acceptable -- context-setting metric, not a requirement. No action needed. |
| 2 | Problem Statement | "Task status is scattered across Google Sheets, Slack messages, and email threads" | Implicit scope | 2 | Acceptable -- problem statement, not a requirement. Used to justify solution. |
| 3 | F1: Task CRUD | "description (optional, max 5000 chars)" | Potential ambiguity: character counting method | 3 | Clarified: UTF-16 code units [ASSUMPTION]. Documented in AC-US-001-003-04. |
| 4 | F2: Board Management | "columns (ordered list of status labels)" | Missing constraint: max columns? | 5 | No max column count specified. [ASSUMPTION: No upper limit beyond database constraints.] |
| 5 | F2: Board Management | "Board owners and Admins can invite members and set their role" | Pronoun ambiguity: "their role" -- the invitee's role or the owner's? | 4 | Resolved: "their" refers to the invited user's role. Clarified in US-002-003. |
| 6 | F3: Webhooks | "Webhook payloads include: event type, task snapshot, actor, timestamp" | Missing detail: full task snapshot or partial? | 4 | [ASSUMPTION: Full task snapshot at time of event, including all fields.] |
| 7 | F3: Webhooks | "Failed webhook deliveries are retried 3 times with exponential backoff (1s, 4s, 16s)" | Ambiguity: Is this 3 retries after initial, or 3 total attempts? | 5 | Resolved: 3 retries after initial attempt = 4 total attempts. The intervals 1s, 4s, 16s clearly indicate 3 retries. Documented in AC-US-003-003-02. |
| 8 | F4: Search | "Full-text search on title and description" | Missing detail: search operator (AND/OR for multi-word queries) | 4 | [ASSUMPTION: OR semantics for multi-word queries, matching PostgreSQL ts_query default behavior.] |
| 9 | F4: Search | "Sort by: created_at, updated_at, due_date, priority" | Missing detail: default sort order (asc/desc) and default sort field | 3 | [ASSUMPTION: Default sort by created_at descending. Ascending/descending controlled by +/- prefix per JSON:API convention.] |
| 10 | F5: Activity Log | "Retained for 90 days" | Boundary ambiguity: inclusive or exclusive of the 90th day? | 3 | [ASSUMPTION: Inclusive -- entries at exactly 90 days are retained.] |
| 11 | Constraints | "JWT-based, issued by existing company SSO (external -- not built here)" | Missing detail: JWT validation (audience, issuer, algorithm) | 5 | [ASSUMPTION: Standard RS256 JWT validation with configurable issuer and audience claims.] |
| 12 | Constraints | "API format: JSON:API specification" | Missing detail: which version? | 3 | [ASSUMPTION: JSON:API v1.1 (current stable).] |
| 13 | Success Criteria | "Zero data loss on task mutations" | Missing detail: scope of "zero data loss" (just DB persistence or also network?) | 4 | Resolved: Refers to database transactional integrity. If a mutation returns a success response, the data must be persisted. Documented in NFR-004-002. |
| 14 | F3: Webhooks | "Webhooks are configured per board (URL + secret for HMAC signing)" | Missing detail: HMAC algorithm, header name for signature | 4 | [ASSUMPTION: HMAC-SHA256, signature in X-Signature-256 header.] |

### First Pass Summary

- **Total ambiguities detected**: 14
- **Severity >= 7**: 0 (no blocking ambiguities requiring user clarification before proceeding)
- **Severity 5-6**: 4 (resolved via documented assumptions)
- **Severity 1-4**: 10 (minor, resolved inline)

---

## Final Pass: Artifact Ambiguity Scores

Every requirement artifact has been scored on a 0-100 ambiguity scale using the following rubric:
- +10 per vague quantifier
- +15 per subjective adjective without metric
- +10 per passive voice hiding actor
- +20 per unbounded scope
- +15 per missing error/edge case
- +10 per untestable assertion
- +5 per ambiguous pronoun

### User Story Scores

| Story ID | Title | Ambiguity Score | Notes |
|----------|-------|----------------|-------|
| US-001-001 | Create a Task | 5 | Minor: "programmatically" in benefit is contextual, not vague |
| US-001-002 | Read / View a Task | 5 | Minor: "details" in benefit clarified by AC field list |
| US-001-003 | Update a Task | 5 | Minor: long field list but fully enumerated |
| US-001-004 | Soft-Delete a Task | 0 | Fully specific |
| US-002-001 | Create a Board | 0 | Fully specific |
| US-002-002 | Manage Board Columns | 5 | Minor: "reflects" is slightly subjective but constrained by AC |
| US-002-003 | Invite Members / Assign Roles | 0 | Fully specific |
| US-003-001 | Configure Webhooks | 5 | Minor: "real-time" qualified by 5s delivery assumption |
| US-003-002 | Receive Webhook on Events | 5 | Minor: "react automatically" is benefit-level, not requirement |
| US-003-003 | Webhook Retry | 0 | Fully specific with exact timing |
| US-004-001 | Full-Text Search | 5 | Minor: "quickly" in benefit is acceptable goal language |
| US-004-002 | Filter by Attributes | 0 | Fully specific |
| US-004-003 | Paginate and Sort | 0 | Fully specific |
| US-005-001 | Record Activity Log | 5 | Minor: "every action" scoped to task mutations in ACs |
| US-005-002 | Retrieve Activity Log | 0 | Fully specific |
| US-005-003 | Activity Log Retention | 5 | Minor: boundary clarified via assumption |

### Acceptance Criteria Scores

| AC ID | Ambiguity Score | Notes |
|-------|----------------|-------|
| AC-US-001-001-01 | 0 | Specific precondition, action, outcome |
| AC-US-001-001-02 | 0 | Specific error scenario |
| AC-US-001-001-03 | 0 | Boundary value, specific |
| AC-US-001-001-04 | 0 | RBAC scenario, specific |
| AC-US-001-001-05 | 0 | Boundary value, specific |
| AC-US-001-002-01 | 0 | Specific with field enumeration |
| AC-US-001-002-02 | 0 | Specific count assertion |
| AC-US-001-002-03 | 0 | Specific error response |
| AC-US-001-002-04 | 0 | Soft-delete edge case |
| AC-US-001-003-01 | 0 | Partial update, specific |
| AC-US-001-003-02 | 0 | Validation with enum |
| AC-US-001-003-03 | 0 | RBAC error scenario |
| AC-US-001-003-04 | 0 | Boundary value |
| AC-US-001-004-01 | 0 | Specific delete + verify |
| AC-US-001-004-02 | 0 | Admin cross-user delete |
| AC-US-001-004-03 | 0 | Authorization error, specific |
| AC-US-001-004-04 | 0 | Idempotency edge case |
| AC-US-002-001-01 | 0 | Default columns, specific |
| AC-US-002-001-02 | 0 | Validation error |
| AC-US-002-001-03 | 0 | Boundary value |
| AC-US-002-001-04 | 0 | Custom columns, specific |
| AC-US-002-001-05 | 0 | Minimum columns enforcement |
| AC-US-002-002-01 | 0 | Column rename, specific |
| AC-US-002-002-02 | 0 | Minimum constraint |
| AC-US-002-002-03 | 0 | RBAC error |
| AC-US-002-003-01 | 0 | Invite with verification |
| AC-US-002-003-02 | 0 | Enum validation |
| AC-US-002-003-03 | 0 | RBAC error |
| AC-US-002-003-04 | 0 | Upsert behavior |
| AC-US-003-001-01 | 0 | Webhook config, specific |
| AC-US-003-001-02 | 5 | [ASSUMPTION] HTTPS requirement noted |
| AC-US-003-001-03 | 0 | RBAC error |
| AC-US-003-002-01 | 5 | [ASSUMPTION] 5s delivery window, HMAC header name |
| AC-US-003-002-02 | 0 | Before/after in payload |
| AC-US-003-002-03 | 0 | No-op scenario |
| AC-US-003-002-04 | 0 | Concurrent events |
| AC-US-003-003-01 | 0 | Retry success scenario |
| AC-US-003-003-02 | 0 | All retries exhausted |
| AC-US-003-003-03 | 5 | [ASSUMPTION] 500ms tolerance |
| AC-US-004-001-01 | 0 | Cross-board search |
| AC-US-004-001-02 | 0 | Empty result |
| AC-US-004-001-03 | 0 | Missing parameter validation |
| AC-US-004-001-04 | 0 | Access scoping |
| AC-US-004-002-01 | 0 | Single filter |
| AC-US-004-002-02 | 0 | Combined AND filters |
| AC-US-004-002-03 | 0 | Date range inclusive |
| AC-US-004-002-04 | 0 | Unknown field error |
| AC-US-004-003-01 | 0 | Default pagination |
| AC-US-004-003-02 | 0 | Custom sort/size |
| AC-US-004-003-03 | 0 | Max page size error |
| AC-US-004-003-04 | 0 | Last page partial |
| AC-US-005-001-01 | 0 | Update logged |
| AC-US-005-001-02 | 0 | Creation logged |
| AC-US-005-001-03 | 0 | Multi-field single entry |
| AC-US-005-002-01 | 0 | Task activity retrieval |
| AC-US-005-002-02 | 0 | Board activity retrieval |
| AC-US-005-002-03 | 0 | Authorization |
| AC-US-005-003-01 | 0 | Purge after 90 days |
| AC-US-005-003-02 | 5 | [ASSUMPTION] Inclusive boundary |
| AC-US-005-003-03 | 0 | No-op purge |

### NFR Scores

| NFR ID | Ambiguity Score | Notes |
|--------|----------------|-------|
| NFR-001-001 | 0 | Specific: p95 <= 200ms, 50 users, 10 min |
| NFR-001-002 | 0 | Specific: 100 req/min/user, HTTP 429 |
| NFR-002-001 | 0 | Specific: HTTP 401 for all unauthenticated |
| NFR-002-002 | 0 | Specific: 0 bypass incidents, all role/endpoint combos |
| NFR-002-003 | 5 | [ASSUMPTION] Header name X-Signature-256 |
| NFR-003-001 | 0 | Specific: 10K tasks, p95 < 200ms |
| NFR-003-002 | 0 | Specific: 50 users, 0% error, 10 min |
| NFR-004-001 | 0 | Specific: 99.5%, 30-day rolling |
| NFR-004-002 | 0 | Specific: 0 data loss, transactional |
| NFR-004-003 | 0 | Specific: 99% with 2% failure rate |
| NFR-005-001 | 0 | Specific: 100% JSON:API v1.1 compliance |
| NFR-006-001 | 0 | Specific: tsc --noEmit exit 0 |
| NFR-006-002 | 5 | [PROPOSED DEFAULT] 80% coverage threshold |
| NFR-007-001 | 10 | [PROPOSED DEFAULT] 30s startup, [ASSUMPTION] endpoint names |

---

## Final Pass Summary

| Category | Total Items | Max Score | Items >= 50 | Status |
|----------|-------------|-----------|-------------|--------|
| User Stories | 16 | 5 | 0 | PASS |
| Acceptance Criteria | 55 | 5 | 0 | PASS |
| NFRs | 14 | 10 | 0 | PASS |
| **Overall** | **85** | **10** | **0** | **PASS** |

**All ambiguity scores are below the threshold of 50. No items require rewriting.**

---

## Documented Assumptions

All assumptions made during requirements analysis are listed here for stakeholder review:

| # | Assumption | Artifact | Rationale |
|---|-----------|----------|-----------|
| 1 | Character counting uses UTF-16 code units | AC-US-001-003-04 | JavaScript/TypeScript String.length uses UTF-16 |
| 2 | No upper limit on board columns beyond DB constraints | US-002-002 | PRD specifies minimum 2 but no maximum |
| 3 | Full task snapshot in webhook payload (all fields) | AC-US-003-002-01 | PRD says "task snapshot" without qualification |
| 4 | 3 retries after initial attempt = 4 total attempts | AC-US-003-003-02 | PRD says "retried 3 times" with 3 intervals listed |
| 5 | OR semantics for multi-word search queries | AC-US-004-001-01 | PostgreSQL ts_query default behavior |
| 6 | Default sort: created_at descending | AC-US-004-003-01 | Common API convention |
| 7 | 90-day retention is inclusive (entries at 90 days retained) | AC-US-005-003-02 | Conservative interpretation |
| 8 | JWT validation: RS256 with configurable issuer/audience | NFR-002-001 | Standard enterprise SSO pattern |
| 9 | JSON:API version 1.1 | NFR-005-001 | Current stable version |
| 10 | HMAC-SHA256 with X-Signature-256 header | NFR-002-003 | Industry standard (GitHub webhooks pattern) |
| 11 | Webhook delivery within 5 seconds | AC-US-003-002-01 | Reasonable SLA for async event |
| 12 | Retry timing tolerance of 500ms | AC-US-003-003-03 | Account for processing/scheduling variance |
| 13 | Webhook URLs must be HTTPS | AC-US-003-001-02 | Security best practice |
| 14 | Test coverage threshold: 80% line coverage | NFR-006-002 | Industry standard default |
| 15 | Container health check: /healthz and /readyz within 30s | NFR-007-001 | Kubernetes standard pattern |
