# Ambiguity Report: TaskFlow API

## First Pass: PRD Ambiguity Detection (Step 2)

Scanned every sentence in the PRD for ambiguous language. Identified the following:

### AMB-001: Vague actor in "Users can create, read, update, and delete tasks" (F1)
- **Location**: F1: Task CRUD, first sentence
- **Category**: Missing user role specification
- **Severity**: 5/10
- **Score**: 15
- **Question**: Which user roles (Admin, Member, Viewer) can perform each CRUD operation? The PRD later specifies delete restrictions but is silent on create/update role restrictions.
- **Impact**: medium
- **Default Assumption**: [ASSUMPTION] Members and Admins can create/update tasks; Viewers cannot. Only task creator or Admin can delete.
- **Resolution**: Disambiguated in user stories by specifying exact roles per operation.

### AMB-002: Vague actor in "Users can organize tasks into boards" (F2)
- **Location**: F2: Board Management, first sentence
- **Category**: Missing user role specification
- **Severity**: 4/10
- **Score**: 15
- **Question**: Can any authenticated user create a board, or only Admins?
- **Impact**: medium
- **Default Assumption**: [ASSUMPTION] Any authenticated user can create a board and becomes its owner.
- **Resolution**: Disambiguated in US-002-001 by specifying "authenticated user."

### AMB-003: "Board owners and Admins can invite members and set their role" (F2)
- **Location**: F2: Board Management, fourth bullet
- **Category**: Conditional ambiguity — unclear what roles are available
- **Severity**: 3/10
- **Score**: 10
- **Question**: What roles can be assigned? Are they the same as the top-level RBAC roles (Admin, Member, Viewer)?
- **Impact**: low
- **Default Assumption**: [ASSUMPTION] Board-level roles are Admin, Member, and Viewer matching the top-level RBAC roles.
- **Resolution**: Explicitly listed in AC-002-002-02 validation.

### AMB-004: "custom column names" without maximum count (F2)
- **Location**: F2: Board Management, last bullet
- **Category**: Missing boundary/limit
- **Severity**: 4/10
- **Score**: 20
- **Question**: Is there a maximum number of columns per board?
- **Impact**: medium
- **Default Assumption**: [ASSUMPTION] Maximum 20 columns per board (reasonable Kanban limit).
- **Resolution**: Noted as assumption; minimum of 2 is enforced per PRD.

### AMB-005: "Webhook payloads include: event type, task snapshot, actor, timestamp" (F3)
- **Location**: F3: Webhook Notifications, last bullet
- **Category**: Implicit assumption — "snapshot" undefined
- **Severity**: 3/10
- **Score**: 10
- **Question**: Does "task snapshot" mean the complete task resource at the time of the event, or just changed fields?
- **Impact**: low
- **Default Assumption**: [ASSUMPTION] "Task snapshot" is the complete task resource (all fields) at the time of the event.
- **Resolution**: Specified as "full task snapshot" in AC-003-002-01 and AC-003-002-04.

### AMB-006: HMAC signing algorithm not specified (F3)
- **Location**: F3: Webhook Notifications, "HMAC signing"
- **Category**: Implicit assumption — missing technical detail
- **Severity**: 4/10
- **Score**: 10
- **Question**: Which HMAC algorithm? SHA-1, SHA-256, SHA-512?
- **Impact**: medium
- **Default Assumption**: [ASSUMPTION] HMAC-SHA256 (industry standard, used by GitHub, Stripe, etc.)
- **Resolution**: Specified as HMAC-SHA256 in AC-003-002-01 and NFR-002-003.

### AMB-007: "Full-text search on title and description" — search behavior unspecified (F4)
- **Location**: F4: Search and Filtering, first bullet
- **Category**: Conditional ambiguity — partial match? Stemming? Exact phrase?
- **Severity**: 4/10
- **Score**: 10
- **Question**: Should search support partial matches, stemming, phrase matching, or just keyword matching?
- **Impact**: medium
- **Default Assumption**: [ASSUMPTION] PostgreSQL `tsvector`/`tsquery` full-text search with English stemming and word-boundary tokenization.
- **Resolution**: Documented as assumption in refined PRD summary.

### AMB-008: "Retained for 90 days" — unclear trigger (F5)
- **Location**: F5: Activity Log, last bullet
- **Category**: Temporal ambiguity
- **Severity**: 3/10
- **Score**: 10
- **Question**: 90 days from creation of the log entry? Is cleanup a batch job or on-read filter?
- **Impact**: low
- **Default Assumption**: [ASSUMPTION] 90 days from log entry creation timestamp; cleanup via daily batch job.
- **Resolution**: Specified in AC-005-001-03 as "daily retention job."

### First Pass Summary

| Metric | Value |
|--------|-------|
| Total ambiguities detected | 8 |
| Critical (severity >= 7) | 0 |
| Blocking (requires user input before proceeding) | 0 |
| Resolved via assumptions | 8 |

No severity >= 7 ambiguities found. Proceeding with documented assumptions.

---

## Final Pass: Ambiguity Scoring (Step 9)

Every user story, acceptance criterion, and NFR was re-scored using the rubric:
- +10 per vague quantifier
- +15 per subjective adjective without metric
- +10 per passive voice hiding an actor
- +20 per unbounded scope term
- +15 per missing error/edge case
- +10 per untestable assertion
- +5 per pronoun with ambiguous referent

### User Story Scores

| Story ID | Title | Ambiguity Score | Status | Notes |
|----------|-------|-----------------|--------|-------|
| US-001-001 | Create a Task | 5 | CLEAR | Specific actor, action, measurable fields |
| US-001-002 | Read Tasks | 5 | CLEAR | Specific actor, dual retrieval modes defined |
| US-001-003 | Update a Task | 5 | CLEAR | Specific actor, specific fields, specific validations |
| US-001-004 | Delete a Task (Soft Delete) | 0 | CLEAR | Explicit actor restriction, explicit mechanism |
| US-002-001 | Create a Board | 5 | CLEAR | Minor: "authenticated user" is broad but intentional |
| US-002-002 | Manage Board Membership | 5 | CLEAR | Specific roles, specific actions |
| US-002-003 | Customize Board Columns | 10 | CLEAR | Minor: max column count assumed [ASSUMPTION] |
| US-003-001 | Configure Webhooks | 5 | CLEAR | Specific actor, specific configuration fields |
| US-003-002 | Deliver Webhook Notifications | 10 | CLEAR | HMAC algorithm assumed [ASSUMPTION] |
| US-004-001 | Search Tasks by Text | 10 | CLEAR | Search behavior assumed [ASSUMPTION] |
| US-004-002 | Filter and Sort Tasks | 5 | CLEAR | All filter fields explicitly enumerated |
| US-005-001 | Record Activity Log | 10 | CLEAR | Retention mechanism assumed [ASSUMPTION] |

### Acceptance Criteria Scores

| AC ID | Ambiguity Score | Status |
|-------|-----------------|--------|
| AC-001-001-01 | 0 | CLEAR |
| AC-001-001-02 | 0 | CLEAR |
| AC-001-001-03 | 0 | CLEAR |
| AC-001-001-04 | 0 | CLEAR |
| AC-001-001-05 | 0 | CLEAR |
| AC-001-002-01 | 0 | CLEAR |
| AC-001-002-02 | 0 | CLEAR |
| AC-001-002-03 | 0 | CLEAR |
| AC-001-002-04 | 0 | CLEAR |
| AC-001-003-01 | 0 | CLEAR |
| AC-001-003-02 | 0 | CLEAR |
| AC-001-003-03 | 0 | CLEAR |
| AC-001-003-04 | 0 | CLEAR |
| AC-001-004-01 | 0 | CLEAR |
| AC-001-004-02 | 0 | CLEAR |
| AC-001-004-03 | 0 | CLEAR |
| AC-002-001-01 | 0 | CLEAR |
| AC-002-001-02 | 0 | CLEAR |
| AC-002-001-03 | 0 | CLEAR |
| AC-002-001-04 | 0 | CLEAR |
| AC-002-002-01 | 0 | CLEAR |
| AC-002-002-02 | 0 | CLEAR |
| AC-002-002-03 | 0 | CLEAR |
| AC-002-002-04 | 0 | CLEAR |
| AC-002-003-01 | 0 | CLEAR |
| AC-002-003-02 | 0 | CLEAR |
| AC-002-003-03 | 5 | CLEAR |
| AC-003-001-01 | 0 | CLEAR |
| AC-003-001-02 | 0 | CLEAR |
| AC-003-001-03 | 0 | CLEAR |
| AC-003-002-01 | 5 | CLEAR |
| AC-003-002-02 | 0 | CLEAR |
| AC-003-002-03 | 5 | CLEAR |
| AC-003-002-04 | 0 | CLEAR |
| AC-004-001-01 | 0 | CLEAR |
| AC-004-001-02 | 0 | CLEAR |
| AC-004-001-03 | 0 | CLEAR |
| AC-004-002-01 | 0 | CLEAR |
| AC-004-002-02 | 0 | CLEAR |
| AC-004-002-03 | 0 | CLEAR |
| AC-004-002-04 | 0 | CLEAR |
| AC-005-001-01 | 0 | CLEAR |
| AC-005-001-02 | 5 | CLEAR |
| AC-005-001-03 | 0 | CLEAR |

### NFR Scores

| NFR ID | Ambiguity Score | Status | Notes |
|--------|-----------------|--------|-------|
| NFR-001-001 | 0 | CLEAR | Measurable: < 200ms p95 under 50 concurrent users |
| NFR-001-002 | 5 | CLEAR | Rate limit clearly defined; aggregate throughput is proposed default |
| NFR-002-001 | 5 | CLEAR | Algorithm assumed (RS256) [ASSUMPTION] |
| NFR-002-002 | 0 | CLEAR | Specific: 100% enforcement, zero escalation paths |
| NFR-002-003 | 0 | CLEAR | Algorithm specified (HMAC-SHA256) |
| NFR-002-004 | 10 | CLEAR | TDE vs disk encryption is proposed default |
| NFR-003-001 | 0 | CLEAR | Measurable: 10,000 tasks with < 200ms p95 |
| NFR-003-002 | 0 | CLEAR | Measurable: 50 concurrent users |
| NFR-004-001 | 0 | CLEAR | Measurable: 99.5% over 30 days |
| NFR-004-002 | 0 | CLEAR | Measurable: zero data loss, ACID guarantees |
| NFR-004-003 | 0 | CLEAR | Measurable: > 99% within retry window |
| NFR-005-001 | 0 | CLEAR | Measurable: 100 req/min, HTTP 429, Retry-After |
| NFR-006-001 | 0 | CLEAR | Measurable: >= 80% line coverage |
| NFR-006-002 | 0 | CLEAR | Measurable: 100% endpoint coverage |

---

## Ambiguity Summary

```
Total Items Scored: 70
  - User Stories: 12
  - Acceptance Criteria: 44
  - NFRs: 14

Items Passing (< 50): 70
Items Failing (>= 50): 0

Average Ambiguity Score: 2.1
Highest Scoring Item: US-002-003, US-003-002, US-004-001, US-005-001 at 10

QUALITY GATE: PASS (all scores < 50)
```

---

## Assumptions Register

All assumptions made during disambiguation:

| ID | Assumption | Impact | Applies To |
|----|-----------|--------|------------|
| A-001 | Members and Admins can create/update tasks; Viewers have read-only access | Medium | US-001-001, US-001-003 |
| A-002 | Any authenticated user can create a board and becomes its owner | Medium | US-002-001 |
| A-003 | Board-level roles match top-level RBAC roles (Admin, Member, Viewer) | Low | US-002-002 |
| A-004 | Maximum 20 columns per board | Medium | US-002-003 |
| A-005 | "Task snapshot" means complete task resource at time of event | Low | US-003-002 |
| A-006 | HMAC signing uses SHA-256 algorithm | Medium | US-003-001, US-003-002 |
| A-007 | Full-text search uses PostgreSQL tsvector/tsquery with English stemming | Medium | US-004-001 |
| A-008 | Activity log retention is 90 days from entry creation; cleanup via daily batch job | Low | US-005-001 |
| A-009 | JWT verification uses RS256 with company SSO public key | Medium | NFR-002-001 |
| A-010 | Rate limit returns HTTP 429 with Retry-After header | Low | NFR-005-001 |
| A-011 | Rate limiting uses sliding window algorithm | Low | NFR-005-001 |
| A-012 | Webhook URL must use HTTPS protocol | Medium | US-003-001 |
| A-013 | Removing a board column that contains tasks is blocked with HTTP 409 | Medium | US-002-003 |
| A-014 | Failed webhook delivery logs are truncated to 1KB | Low | US-003-002 |
| A-015 | Data at rest encryption via PostgreSQL TDE or disk-level encryption | Medium | NFR-002-004 |

---

## Quality Gate Self-Verification Checklist

- [x] Every AC uses GIVEN-WHEN-THEN format (zero exceptions) -- 44/44
- [x] Every user story has >= 3 acceptance criteria -- 12/12 stories (minimum 3 ACs each)
- [x] Every AC has exactly one corresponding test skeleton -- 44/44
- [x] Every PRD requirement (F1-F5) traces to at least one user story -- 5/5
- [x] Every ambiguity score is < 50 -- 70/70 items pass
- [x] Every NFR has a measurable threshold -- 14/14
- [x] Every assumption is explicitly marked with [ASSUMPTION] -- 15 assumptions documented
- [x] Every proposed default is marked with [PROPOSED DEFAULT] -- 5 defaults documented
- [x] No orphaned items in traceability matrix -- 0 orphans
- [x] Negative/error scenarios covered for every story -- 12/12

**OVERALL QUALITY GATE: PASS**
