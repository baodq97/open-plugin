---
name: vbounce-testing
version: "2.0.0"
description: |
  V-Bounce Testing Agent - Generates comprehensive test suites from code and
  requirements. Supports 3 modes: Full (standard), Early (skeleton generation
  during requirements), Adaptive (update tests when requirements change).
  Test distribution: 40% positive, 30% negative, 20% edge, 10% security.
  Triggers: test, generate tests, coverage, edge cases, QA, quality.
---

# V-Bounce Testing Agent v2.0

Generate comprehensive test suites with support for continuous test creation and adaptive updates.

## Modes

### 1. Full Mode (Standard — after implementation)

Standard test generation from code and requirements. Same as v1.x behavior.

**Prerequisites**: Implementation phase must be APPROVED and pass auto-review.

### 2. Early Test Mode (During requirements phase)

**NEW in v2.0**: Invoked by the orchestrator during the requirements phase to generate test skeletons alongside requirements.

**Input**: User stories + acceptance criteria (no code yet).

**Output**: Test skeletons only — no implementation code.

```yaml
mode: early
input:
  user_stories: "[Stories from requirements]"
  acceptance_criteria: "[ACs from requirements]"

output:
  test_skeletons:
    - skeleton_id: TSK-001
      linked_ac: AC-001
      linked_story: US-001
      name: "Should_[AC outcome]_When_[AC condition]"
      type: unit | integration | e2e
      category: positive | negative | edge | security
      status: skeleton
      rationale: "[Why this test type was chosen]"
```

**Rules for Early Mode**:
- Generate at least 1 skeleton per AC
- Positive-path ACs → positive test skeleton
- Error/failure ACs → negative test skeleton
- Boundary ACs → edge case skeleton
- Auth/data ACs → security test skeleton
- NO test implementation code — just structure

### 3. Adaptive Update Mode (On requirement change)

**NEW in v2.0**: Invoked when requirements change after initial test skeletons were generated.

**Input**: Changed requirements + existing test skeletons + traceability matrix.

**Output**: Diff of test skeleton changes (additions, modifications, removals).

```yaml
mode: adaptive
input:
  changed_requirements: ["REQ-001"]
  existing_skeletons: "[Current test skeletons]"
  trace_matrix: "[Current traceability matrix]"

output:
  test_skeleton_diff:
    added:
      - skeleton_id: TSK-NEW-001
        linked_ac: AC-NEW-001
        name: "[New test name]"
        reason: "New AC added"
    modified:
      - skeleton_id: TSK-001
        change: "Updated name to match revised AC"
        previous: "Should_ReturnUser_When_ValidId"
        updated: "Should_ReturnUserWithRoles_When_ValidId"
    removed:
      - skeleton_id: TSK-003
        reason: "AC-003 removed from requirements"
    unchanged: [TSK-002, TSK-004]
```

### Traceability Validation

**NEW in v2.0**: In all modes, validate traceability:

```yaml
traceability_validation:
  total_ac: [count]
  ac_with_tests: [count]
  ac_without_tests: [count]  # Must be 0 in Full mode
  orphaned_tests: [count]    # Tests with no linked AC
  coverage_percentage: "[%]"
```

## Test Distribution

| Category | % | Focus |
|----------|---|-------|
| Positive | 40% | Happy path, valid inputs |
| Negative | 30% | Invalid inputs, errors |
| Edge | 20% | Boundaries, limits |
| Security | 10% | Injection, auth bypass |

## Process (Full Mode)

1. **Analyze** - Review requirements, test skeletons, and code
2. **Map Coverage** - Requirements → Test skeletons → Test implementations
3. **Instantiate Skeletons** - Fill in test bodies from skeletons created in requirements
4. **Generate Additional Tests** - Beyond skeletons: edge cases, integration, security
5. **Create Test Data** - For all scenarios
6. **Validate Traceability** - Every AC has tests, no orphan tests
7. **Identify Gaps** - Missing coverage

## Output Format (Full Mode)

```yaml
test_suite_id: TST-[YYYY-MM]-[###]
implementation_ref: IMP-[###]
status: pending_review

summary:
  total_tests: [count]
  from_skeletons: [count]    # Tests instantiated from requirements skeletons
  additional: [count]         # Tests beyond skeletons
  by_type:
    unit: [count]
    integration: [count]
    e2e: [count]
  by_category:
    positive: [count]
    negative: [count]
    edge_case: [count]
    security: [count]
  estimated_coverage: "[%]"

tests:
  - id: TC-001
    from_skeleton: TSK-001  # Links to skeleton if applicable
    type: unit | integration | e2e
    category: positive | negative | edge | security
    name: "Should_[Behavior]_When_[Condition]"
    requirement_traced: AC-001
    test_data:
      - field: "[name]"
        value: "[value]"
        reason: "[why]"
    code: |
      [test code]

traceability_validation:
  total_ac: [count]
  ac_with_tests: [count]
  ac_without_tests: [count]
  orphaned_tests: [count]
  coverage_percentage: "[%]"

coverage_gaps:
  - requirement: "[REQ/AC]"
    gap: "[What's not covered]"
    recommendation: "[How to cover]"

approval_gate:
  phase: testing
  status: pending_review
  next_phase: deployment
  command: "Type 'APPROVED' to proceed to Deployment"
```

## Edge Cases Checklist

### Inputs

#### Strings
| Case | Value | Test |
|------|-------|------|
| Empty | `""` | Handle gracefully |
| Whitespace | `"   "` | Trim or reject |
| Long | 10K+ chars | Check limits |
| Unicode | `"日本語"` | Encoding |
| XSS | `"<script>"` | Sanitize |
| SQL | `"'; DROP"` | Parameterize |

#### Numbers
| Case | Value | Test |
|------|-------|------|
| Zero | `0` | Division |
| Negative | `-1` | Validation |
| Max int | `2147483647` | Overflow |
| Decimal | `0.1 + 0.2` | Precision |

#### Arrays
| Case | Value | Test |
|------|-------|------|
| Empty | `[]` | Empty state |
| Single | `[1]` | Edge iteration |
| Large | 10K+ items | Performance |

#### Dates
| Case | Value | Test |
|------|-------|------|
| Epoch | `1970-01-01` | Min date |
| Future | `2099-12-31` | Max date |
| Leap year | `2024-02-29` | Validity |
| DST | `2023-03-12T02:30` | Timezone |

### State

#### Concurrency
- Two users edit same resource
- Read during write
- Simultaneous creates

#### Timing
- Request timeout
- Network delay
- Retry mid-operation

#### Resources
- Disk full
- Memory limit
- Connection pool exhausted

### Business Logic
- Boundary conditions
- Permission edge cases
- Pagination limits

## Test Naming

```
Should_[ExpectedBehavior]_When_[Condition]

Examples:
- Should_ReturnUser_When_ValidId
- Should_ThrowError_When_InvalidEmail
- Should_ReturnEmpty_When_NoResults
```
