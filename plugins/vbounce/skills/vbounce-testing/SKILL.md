---
name: vbounce-testing
version: "3.0.0"
description: |
  V-Bounce Testing Agent - Generates comprehensive test suites from code and
  requirements. Supports 3 modes: Full (standard), Early (skeleton generation
  during requirements), Adaptive (update tests when requirements change).
  Test distribution: 40% positive, 20% negative, 10% edge, 10% security,
  10% system/E2E, 10% component integration.
  V-Model test-level classification for formal design-test symmetry.
  Triggers: test, generate tests, coverage, edge cases, QA, quality.
---

# V-Bounce Testing Agent v3.0

Generate comprehensive test suites with support for continuous test creation and adaptive updates.

## Modes

### 1. Full Mode (Standard — after implementation)

Standard test generation from code and requirements.

**Prerequisites**: Implementation phase must be APPROVED and pass auto-review.

### 2. Early Test Mode (During requirements phase)

**Since v2.0**: Invoked by the orchestrator during the requirements phase to generate test skeletons alongside requirements.

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
      v_level: unit | integration | system | acceptance | security  # NEW in v3.0
      category: positive | negative | edge | security | component_integration | system_e2e
      status: skeleton
      rationale: "[Why this test type and v_level were chosen]"
```

**Rules for Early Mode**:
- Generate at least 1 skeleton per AC
- Positive-path ACs → positive test skeleton
- Error/failure ACs → negative test skeleton
- Boundary ACs → edge case skeleton
- Auth/data ACs → security test skeleton
- NO test implementation code — just structure

### 3. Adaptive Update Mode (On requirement change)

**Since v2.0**: Invoked when requirements change after initial test skeletons were generated.

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

**Since v2.0**: In all modes, validate traceability:

```yaml
traceability_validation:
  total_ac: [count]
  ac_with_tests: [count]
  ac_without_tests: [count]  # Must be 0 in Full mode
  orphaned_tests: [count]    # Tests with no linked AC
  coverage_percentage: "[%]"
```

## Test Distribution (v3.0 — V-Model Aligned)

| Category | % | Focus | V-Model Level |
|----------|---|-------|---------------|
| Positive | 40% | Happy path, valid inputs | unit, integration |
| Negative | 20% | Invalid inputs, errors | unit, integration |
| Edge | 10% | Boundaries, limits | unit |
| Security | 10% | Injection, auth bypass, STRIDE mitigations | security |
| Component Integration | 10% | Cross-module interactions, API contracts | integration |
| System/E2E | 10% | Full workflow end-to-end, acceptance criteria | system, acceptance |

### V-Model Test-Level Classification (NEW in v3.0)

Every test MUST be classified with a `v_level` that maps it to its corresponding V-Model design artifact:

| V-Model Level | Validates Against | Design Artifact |
|---------------|-------------------|-----------------|
| `acceptance` | User Story / AC outcome | Requirements |
| `system` | Complete system workflow | Architecture flow |
| `integration` | Component interaction | API contract / interface |
| `unit` | Individual function behavior | Source file / function |
| `security` | STRIDE threat mitigation | Threat model finding |

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
    component_integration: [count]  # NEW in v3.0
    system_e2e: [count]             # NEW in v3.0
  by_v_level:                       # NEW in v3.0 — V-Model classification
    acceptance: [count]
    system: [count]
    integration: [count]
    unit: [count]
    security: [count]
  estimated_coverage: "[%]"

tests:
  - id: TC-001
    from_skeleton: TSK-001  # Links to skeleton if applicable
    type: unit | integration | e2e
    v_level: unit | integration | system | acceptance | security  # NEW in v3.0
    traces_to_design: "[Design artifact this test validates]"     # NEW in v3.0
    category: positive | negative | edge | security | component_integration | system_e2e
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

# NEW in v3.0 — V-Model level coverage
v_model_coverage:
  acceptance_tests:
    total: [count]
    ac_covered: "[X/Y] ([%])"
    gaps: ["AC without acceptance-level test"]
  system_tests:
    total: [count]
    workflows_covered: "[X/Y] ([%])"
  integration_tests:
    total: [count]
    api_contracts_covered: "[X/Y] ([%])"
  unit_tests:
    total: [count]
    functions_covered: "[X/Y] ([%])"
  security_tests:
    total: [count]
    stride_threats_covered: "[X/Y] ([%])"

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

For the complete edge cases checklist, see [`references/edge-cases.md`](references/edge-cases.md).

## Test Naming

```
Should_[ExpectedBehavior]_When_[Condition]

Examples:
- Should_ReturnUser_When_ValidId
- Should_ThrowError_When_InvalidEmail
- Should_ReturnEmpty_When_NoResults
```
