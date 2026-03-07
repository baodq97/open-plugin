---
name: vbounce-requirements
version: "3.0.0"
description: |
  V-Bounce Requirements Agent - Transforms natural language into structured
  requirements. Generates: PRD, user stories (As a/I want/So that), acceptance
  criteria (GIVEN-WHEN-THEN), NFRs (performance, security, scalability),
  test skeletons (continuous test creation), traceability matrix.
  Includes real-time ambiguity scoring (0-100), adaptive test hooks,
  and iteration decomposition for large features.
  Triggers: requirement, user story, PRD, acceptance criteria, feature request, NFR.
---

# V-Bounce Requirements Agent v3.0

Transform natural language requirements into structured, testable artifacts — with continuous test creation and real-time ambiguity scoring.

## Process

1. **Parse** - Extract entities, actions, constraints
2. **Detect Ambiguities** - Flag vague terms, score each requirement (0-100)
3. **Generate PRD** - Title, summary, goals, metrics
4. **Create User Stories** - As a/I want/So that format
5. **Define NFRs** - Performance, security, scalability, availability
6. **Write Acceptance Criteria** - GIVEN-WHEN-THEN
7. **Generate Test Skeletons** - For each AC (continuous test creation)
8. **Build Traceability Matrix** - REQ → Story → AC → TestSkeleton
9. **Score Ambiguity** - Quantitative score per requirement (must be < 50)
10. **Decompose into Iterations** - Break large features into incremental delivery slices (NEW in v3.0)

## Continuous Test Creation

**NEW in v2.0**: Test skeletons are generated alongside requirements, not deferred to the testing phase. For each acceptance criterion:

```yaml
test_skeletons:
  - skeleton_id: TSK-001
    linked_ac: AC-001
    name: "Should_[AC outcome]_When_[AC condition]"
    type: unit | integration | e2e
    category: positive | negative | edge | security
    status: skeleton  # Will be instantiated during implementation/testing
    rationale: "[Why this test type was chosen]"
```

**Rules**:
- Every AC MUST have at least one test skeleton
- Positive path AC → positive test skeleton
- Error/failure AC → negative test skeleton
- Boundary AC → edge case test skeleton
- Security AC → security test skeleton
- Test skeletons include name + type + linked AC only (no implementation code)

## Real-Time Ambiguity Scoring

**NEW in v2.0**: Each requirement gets a quantitative ambiguity score (0-100).

### Scoring Formula

Each indicator adds points:

| Indicator | Points | Example |
|-----------|--------|---------|
| Vague adjective (fast, easy, many) | +15 | "The system should be fast" |
| Missing boundary/limit | +20 | "Support many users" |
| Unstated error handling | +10 | No failure scenario defined |
| Missing user role specification | +15 | "Users can access..." (which users?) |
| Implicit assumption | +10 | Assumes specific tech without stating |
| No measurable outcome in AC | +25 | "System works correctly" |

### Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 0-25 | Clear | Proceed |
| 26-50 | Minor ambiguity | Note for reviewer, proceed |
| 51-75 | Significant | MUST clarify before proceeding |
| 76-100 | Critical | BLOCK — rewrite requirement |

**Quality Gate will FAIL if any requirement scores > 50.**

## Adaptive Test Hook

**NEW in v2.0**: When a requirement changes during refinement:

1. Identify affected test skeletons via traceability matrix
2. Flag each affected skeleton with `status: needs_update`
3. Suggest updated test name/type if the AC changed
4. Log the change for knowledge capture

```yaml
adaptive_test_update:
  changed_requirement: REQ-001
  affected_test_skeletons:
    - skeleton_id: TSK-001
      previous_ac: "AC-001 (original)"
      updated_ac: "AC-001 (revised)"
      status: needs_update
      suggested_change: "[What should change in the test]"
```

## Iteration Decomposition (NEW in v3.0)

For large features (>= 13 total story points OR >= 8 user stories), decompose into incremental delivery slices. Each slice runs its own mini V-cycle (Design → Implement → Test → Deploy).

### When to Decompose

| Condition | Action |
|-----------|--------|
| Total story points < 13 AND stories < 8 | Single V-cycle (no decomposition) |
| Total story points >= 13 OR stories >= 8 | Decompose into iterations |
| Any story is 13 points (epic) | Must split that story first |

### Decomposition Rules

1. Each iteration must deliver **standalone user value** (no half-finished features)
2. Order iterations by **dependency** (foundational stories first) then **priority** (P0 before P1)
3. Each iteration should be **5-13 story points** (roughly 1-3 days of AI + human work)
4. Test skeletons and traceability carry forward across iterations
5. Later iterations can reference artifacts from earlier ones

### Output Format

```yaml
iteration_decomposition:
  total_story_points: [sum]
  total_stories: [count]
  decomposed: true | false
  iterations:
    - iteration_id: ITER-001
      title: "[What this iteration delivers]"
      stories: [US-001, US-002]
      story_points: [sum for iteration]
      dependencies: []  # No prior iterations needed
      delivers: "[User-visible value]"
    - iteration_id: ITER-002
      title: "[What this iteration delivers]"
      stories: [US-003, US-004]
      story_points: [sum for iteration]
      dependencies: [ITER-001]
      delivers: "[User-visible value]"
```

## Output Format

```yaml
requirement_id: REQ-[PROJECT]-[YYYYMM]-[###]
version: "1.0"
status: pending_review

prd:
  title: "[Feature title]"
  summary: "[2-3 sentences]"
  business_goal: "[Objective]"
  success_metrics:
    - metric: "[Name]"
      target: "[Value]"

nfr:
  performance:
    - metric: "Response time"
      target: "< 200ms (p95)"
      measurement: "APM monitoring"
    - metric: "Throughput"
      target: "1000 req/sec"
  security:
    - requirement: "Authentication"
      standard: "JWT with refresh tokens"
    - requirement: "Data protection"
      standard: "AES-256 at rest, TLS 1.3 in transit"
  scalability:
    - metric: "Concurrent users"
      current: "[Current capacity]"
      target: "[Target capacity]"
  availability:
    - target: "99.9%"
    - maintenance_window: "[When]"

ambiguities:
  - id: AMB-001
    description: "[What's unclear]"
    question: "[Clarifying question]"
    impact: high | medium | low
    default_assumption: "[If not clarified]"
    ambiguity_score: [0-100]  # NEW in v2.0

user_stories:
  - id: US-001
    as_a: "[User type]"
    i_want: "[Action]"
    so_that: "[Benefit]"
    priority: P0 | P1 | P2 | P3
    story_points: 1 | 2 | 3 | 5 | 8 | 13
    ambiguity_score: [0-100]  # NEW in v2.0
    acceptance_criteria:
      - id: AC-001
        given: "[Context]"
        when: "[Action]"
        then: "[Result]"

# NEW in v2.0: Continuous Test Creation
test_skeletons:
  - skeleton_id: TSK-001
    linked_ac: AC-001
    linked_story: US-001
    name: "Should_[Behavior]_When_[Condition]"
    type: unit | integration | e2e
    category: positive | negative | edge | security
    status: skeleton
    rationale: "[Why this test type]"

# NEW in v2.0: Initial Traceability
traceability:
  - requirement: REQ-001
    stories: [US-001, US-002]
    nfrs: [NFR-PERF-001, NFR-SEC-001]
    acceptance_criteria: [AC-001, AC-002]
    test_skeletons: [TSK-001, TSK-002]

approval_gate:
  phase: requirements
  status: pending_review
  next_phase: design
  approvers: ["Product Owner", "Business Analyst"]
  quorum: 1
  quality_gate: pending  # NEW in v2.0 — QG runs before human review
  command: "Type 'APPROVED' to proceed to Design"
```

## Ambiguity Detection

Flag these vague terms:

| Term | Question | Example Clarification |
|------|----------|----------------------|
| "fast" | Target response time? | < 200ms API, < 2s page |
| "quick" | Acceptable latency? | < 100ms perceived |
| "easy" | How many steps? | < 5 clicks |
| "many" | Exact count? | Up to 100 items |
| "several" | What range? | 3-10 items |
| "secure" | What standards? | OWASP Top 10 |
| "scalable" | Target load? | 10K concurrent |
| "user-friendly" | What criteria? | 90% task completion |

### Implicit Requirements (Often Unstated)

**Security:** Authentication method? Authorization rules? Data encryption? Audit logging?

**Performance:** Response time targets? Concurrent users? Data volume?

**Error Handling:** Error message format? Retry logic? Timeout handling?

### Question Templates

```
"For [feature], what are the limits?
- Minimum: ___
- Maximum: ___
- Default: ___"

"When [condition] occurs, what should happen?
- Success: ___
- Failure: ___
- Edge case: ___"
```

### Default Assumptions (When Clarification Unavailable)

```yaml
defaults:
  file_upload:
    max_size: "5MB"
    types: ["jpg", "png", "pdf"]
  pagination:
    page_size: 20
    max_size: 100
  session:
    timeout: "30 minutes"
```

## NFR Categories

| Category | Questions to Ask |
|----------|------------------|
| Performance | Response time? Throughput? |
| Security | Auth method? Data classification? |
| Scalability | Users? Data volume? Growth? |
| Availability | Uptime SLA? Maintenance window? |
| Compliance | GDPR? HIPAA? PCI-DSS? |

## User Story Patterns

### Format
```
As a [user type],
I want [action],
So that [benefit].
```

### Story Points

| Points | Complexity | Time |
|--------|------------|------|
| 1 | Trivial | < 2h |
| 2 | Simple | 2-4h |
| 3 | Moderate | 4-8h |
| 5 | Complex | 1-2d |
| 8 | Very Complex | 2-3d |
| 13 | Epic | Split it |

### Priority

- **P0**: Blocks release
- **P1**: MVP requirement
- **P2**: Enhances value
- **P3**: Nice to have

## Acceptance Criteria Patterns

### GIVEN-WHEN-THEN Format
```gherkin
GIVEN [precondition/context]
WHEN [action/trigger]
THEN [expected outcome]
```

### AC Rules

Good AC: specific/measurable, testable (pass/fail), user perspective, one scenario per AC.

Bad AC: vague ("should be fast"), implementation details, multiple scenarios mixed, untestable.
