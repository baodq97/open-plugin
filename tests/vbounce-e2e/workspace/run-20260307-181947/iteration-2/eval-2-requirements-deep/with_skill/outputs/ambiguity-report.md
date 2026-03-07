# Ambiguity Report: TaskFlow API

---

## Section 2: Ambiguity Detection (First Pass)

### Ambiguities Found in PRD

| # | Location | Category | Severity | Text | Suggested Clarification |
|---|----------|----------|----------|------|------------------------|
| 1 | F1: Task CRUD, tags field | Missing constraint | 3 | "tags (array of strings, max 10)" -- max length per tag not specified | What is the maximum length of each tag string? (Assumed 50 chars) |
| 2 | F2: Board Management, columns | Missing constraint | 3 | "columns (ordered list of status labels)" -- no maximum count specified | What is the maximum number of columns per board? (Assumed 20) |
| 3 | F2: Board Management, description | Missing constraint | 2 | "description (optional)" -- max length not specified for board description | What is the max length? (Assumed 2000 chars) |
| 4 | F2: Board Management | Missing negative | 4 | No mention of board deletion or archival | Can boards be deleted? What happens to tasks when a board is deleted? |
| 5 | F3: Webhooks, HMAC | Temporal ambiguity | 2 | "secret for HMAC signing" -- algorithm not specified | Which HMAC algorithm? SHA-256, SHA-512? (Assumed SHA-256) |
| 6 | F3: Webhooks, failure | Conditional ambiguity | 3 | "Failed webhook deliveries" -- definition of "failed" not explicit | What HTTP status codes constitute failure? (Assumed: outside 200-299) |
| 7 | F3: Webhooks, retry exhaustion | Missing negative | 4 | No specification of behavior after all retries fail | Is the delivery logged? Is an alert sent? (Assumed: logged, no alert) |
| 8 | F4: Search, tags filter | Conditional ambiguity | 4 | "Filter by: tags" -- AND or OR logic not specified | When filtering by multiple tags, is it AND or OR? (Assumed AND) |
| 9 | F4: Search, pagination | Temporal ambiguity | 3 | "paginated (default 20, max 100)" -- cursor vs offset not specified | Cursor-based or offset-based pagination? (Assumed cursor-based) |
| 10 | F4: Search, sort order | Missing constraint | 2 | Sort order (asc/desc) not specified | Default ascending or descending? (Assumed descending) |
| 11 | F5: Activity Log, retention | Conditional ambiguity | 3 | "Retained for 90 days" -- boundary behavior unclear | Is the 90-day boundary inclusive or exclusive? (Assumed exclusive -- strictly older) |
| 12 | F5: Activity Log, purge | Missing negative | 3 | No mention of purge mechanism (scheduled job, TTL, etc.) | How is purging implemented? (Assumed scheduled job) |
| 13 | Constraints, rate limiting | Temporal ambiguity | 2 | "100 requests/minute per user" -- algorithm not specified | Sliding window, fixed window, token bucket? (Assumed sliding window) |
| 14 | Constraints, task limit | Conditional ambiguity | 3 | "Max 10,000 tasks per board" -- includes soft-deleted or not? | Does the limit count soft-deleted tasks? (Assumed non-deleted only) |
| 15 | Success Criteria | Missing constraint | 2 | "50 concurrent users" -- workload mix not specified | What mix of operations defines the load test scenario? |
| 16 | F1: Task CRUD, soft delete | Missing negative | 3 | No mention of recovering soft-deleted tasks | Can soft-deleted tasks be restored? How? |
| 17 | F2: Board Management | Missing negative | 3 | No specification of what happens when Board Owner leaves | Can ownership be transferred? |
| 18 | F3: Webhooks | Missing constraint | 3 | Maximum number of webhooks per board not specified | Is there a limit? (No assumption made -- open question) |

**First Pass Summary:**
- Total ambiguities found: 18
- Severity >= 7: 0 (no blocking ambiguities -- all resolvable with reasonable assumptions)
- Average severity: 2.9
- All ambiguities resolved via assumptions or flagged as open questions

---

## Section 9: Ambiguity Score Report (Final Pass)

All requirements artifacts have been scored after disambiguation. Scoring rubric applied per the requirements-analyst agent specification.

### Per-Story Ambiguity Scores

| Item ID | Item Type | Score | Rationale |
|---------|-----------|-------|-----------|
| US-001-001 | User Story | 8 | Clear actor, action, value. All fields specified with constraints. |
| US-001-002 | User Story | 5 | Clear. Single/list retrieval specified. |
| US-001-003 | User Story | 7 | Clear. Field update semantics specified. |
| US-001-004 | User Story | 10 | Clear. Soft-delete mechanism defined. Permission rules explicit. |
| US-001-005 | User Story | 5 | Clear. Validation rules enumerated. |
| US-002-001 | User Story | 8 | Clear. Default columns defined. Ownership explicit. |
| US-002-002 | User Story | 10 | Clear. Roles enumerated. Permission rules explicit. |
| US-002-003 | User Story | 8 | Clear. Column constraints specified. |
| US-002-004 | User Story | 5 | Clear. Simple read operation. |
| US-003-001 | User Story | 12 | Minor: HMAC algorithm assumed. URL validation assumed HTTPS-only. |
| US-003-002 | User Story | 10 | Clear. Event types enumerated. Payload structure defined. |
| US-003-003 | User Story | 10 | Clear. Retry timing explicit (1s, 4s, 16s). Terminal state defined. |
| US-004-001 | User Story | 12 | Minor: full-text search implementation unspecified (PostgreSQL tsvector assumed). |
| US-004-002 | User Story | 15 | Tag filter logic assumed AND. Sort order assumed desc. Both marked as assumptions. |
| US-004-003 | User Story | 8 | Clear. Default/max page sizes specified. |
| US-005-001 | User Story | 8 | Clear. Log entry fields defined. Immutability explicit. |
| US-005-002 | User Story | 5 | Clear. Simple retrieval with sorting. |
| US-005-003 | User Story | 10 | Purge boundary assumed (strictly > 90 days). Mechanism assumed (scheduled job). |

### Per-NFR Ambiguity Scores

| Item ID | Item Type | Score | Rationale |
|---------|-----------|-------|-----------|
| NFR-001-001 | NFR | 5 | Measurable: p95 < 200ms, 50 concurrent users. Explicit. |
| NFR-001-002 | NFR | 5 | Measurable: 99.5% uptime, 30-day rolling. Explicit. |
| NFR-001-003 | NFR | 5 | Measurable: 0 discrepancies. Explicit. |
| NFR-001-004 | NFR | 5 | Measurable: > 99% within retry window. Explicit. |
| NFR-001-005 | NFR | 8 | Algorithm assumed (sliding window). Threshold explicit. |
| NFR-001-006 | NFR | 5 | Measurable: 10,000 limit, rejection at 10,001. Explicit. |
| NFR-001-007 | NFR | 5 | Measurable: 100% rejection of invalid auth. Explicit. |
| NFR-001-008 | NFR | 5 | Measurable: 100% RBAC enforcement. Explicit. |
| NFR-001-009 | NFR | 8 | Measurable. Load test duration assumed (10 min). |
| NFR-001-010 | NFR | 10 | Proposed default. Coverage tool assumed (c8). |

### Summary

```
Total Items Scored: 28 (17 stories + 10 NFRs + 1 placeholder)
Items Passing (< 50): 28
Items Failing (>= 50): 0
Average Ambiguity Score: 7.9
Highest Scoring Item: US-004-002 at 15
Lowest Scoring Item: US-001-002, US-001-005, US-002-004, US-005-002 at 5
```

**RESULT: ALL items score below 50. Quality gate threshold met.**

---

## Ambiguity Reduction Summary

| Metric | Value |
|--------|-------|
| PRD Ambiguities Found (First Pass) | 18 |
| Resolved via Assumptions | 15 |
| Flagged as Open Questions | 3 |
| Severity >= 7 (blocking) | 0 |
| Final Pass Max Score | 15 (well below 50 threshold) |
| Final Pass Average Score | 7.9 |
