---
name: vbounce-traceability
version: "2.0.0"
description: |
  V-Bounce Traceability Agent - Maintains live traceability matrix across all
  SDLC phases. Tracks REQ→Story→AC→Component→API→File→Test mappings with
  V-Model test-level classification (acceptance/system/integration/unit/security).
  Detects orphaned requirements and tests. Enables impact analysis.
  Triggers: traceability, trace matrix, impact analysis, coverage map, orphan detection.
---

# V-Bounce Traceability Agent v2.0

Maintain a live traceability matrix that evolves across every SDLC phase.

## Purpose

The V-Bounce paper mandates "Traceability by Design" — automatic requirement-to-test-to-code linking maintained throughout the lifecycle, not generated as an afterthought. This agent is invoked at every phase transition to update the matrix.

## When Invoked

Invoked by the orchestrator at each phase transition:

```
Requirements → [UPDATE TRACE] → Design → [UPDATE TRACE] → Implementation → [UPDATE TRACE] → Testing → [UPDATE TRACE] → Deployment
```

Also invoked on-demand for impact analysis when requirements change.

## Modes

### 1. Initialize (Requirements Phase)

Creates the initial matrix from requirements output.

```yaml
mode: initialize
input:
  requirement_id: "REQ-[###]"
  user_stories: "[Stories from requirements phase]"
  acceptance_criteria: "[ACs from requirements phase]"
  test_skeletons: "[If generated during requirements]"
```

**Output**: Initial matrix with REQ→Story→AC→TestSkeleton mappings.

### 2. Update (Design, Implementation, Testing Phases)

Extends the matrix with phase-specific artifacts.

```yaml
mode: update
phase: design | implementation | testing
input:
  trace_matrix: "[Current matrix]"
  new_artifacts: "[Phase output to integrate]"
```

**Phase-specific updates**:

| Phase | Adds to Matrix |
|-------|---------------|
| Design | REQ→Component, REQ→API endpoint, Story→Data entity |
| Implementation | Component→File, API→Route handler, Entity→Migration |
| Testing | AC→Test case, Test→File:Line, Coverage % per REQ |

### 3. Validate (Any Phase)

Checks the matrix for completeness and orphans.

```yaml
mode: validate
input:
  trace_matrix: "[Current matrix]"
```

### 4. Impact Analysis (On Requirement Change)

When a requirement changes, shows all affected artifacts.

```yaml
mode: impact_analysis
input:
  trace_matrix: "[Current matrix]"
  changed_requirements: ["REQ-001", "REQ-003"]
  change_description: "[What changed]"
```

## Matrix Format

```yaml
traceability_matrix:
  meta:
    matrix_id: TM-[PROJECT]-[YYYYMMDD]
    cycle_ref: "[CYCLE-ID]"
    last_updated: "[ISO datetime]"
    last_phase: requirements | design | implementation | testing | deployment

  entries:
    - requirement_id: REQ-001
      title: "[Requirement title]"
      stories:
        - story_id: US-001
          title: "[Story title]"
          acceptance_criteria:
            - ac_id: AC-001
              description: "[AC summary]"
              # Added during design
              components: ["UserService", "AuthMiddleware"]
              api_endpoints: ["POST /api/v1/users"]
              data_entities: ["User", "UserRole"]
              # Added during implementation
              source_files:
                - path: "src/services/user-service.ts"
                  functions: ["createUser", "validateEmail"]
                - path: "src/middleware/auth.ts"
                  functions: ["authenticate"]
              migrations: ["001_create_users_table"]
              # Added during testing
              tests:
                - test_id: TC-001
                  name: "Should_CreateUser_When_ValidData"
                  type: unit
                  v_level: unit           # V-Model test level (NEW in v2.0)
                  file: "src/services/__tests__/user-service.test.ts"
                  status: skeleton | implemented | passing | failing
                  traces_to_design: null  # Design artifact this validates (NEW in v2.0)

  # V-Model test-level symmetry (NEW in v2.0)
  v_model_coverage:
    acceptance:
      traces_to: "User Stories / Acceptance Criteria"
      tests: []           # Tests validating AC directly (e.g., e2e scenarios)
      coverage: "[X/Y] ([%])"
    system:
      traces_to: "Architecture / System flows"
      tests: []           # Full workflow E2E tests
      coverage: "[X/Y] ([%])"
    integration:
      traces_to: "API Contracts / Component interactions from Design"
      tests: []           # Cross-component integration tests
      coverage: "[X/Y] ([%])"
    unit:
      traces_to: "Functions / Files from Implementation"
      tests: []           # Unit-level tests
      coverage: "[X/Y] ([%])"
    security:
      traces_to: "STRIDE findings from Design"
      tests: []           # Security-specific tests
      coverage: "[X/Y] ([%])"

  # Orphan detection
  orphans:
    requirements_without_tests: []
    tests_without_requirements: []
    components_without_requirements: []
    requirements_without_components: []
    acceptance_criteria_without_tests: []
    # NEW in v2.0: V-Model level orphans
    ac_without_acceptance_tests: []
    api_contracts_without_integration_tests: []
    stride_threats_without_security_tests: []

  # Coverage summary
  coverage:
    requirements_covered: "[X/Y] ([%])"
    stories_covered: "[X/Y] ([%])"
    ac_covered: "[X/Y] ([%])"
    target: "100% AC coverage"
```

## V-Model Test-Level Classification (NEW in v2.0)

Each test in the matrix is classified by its V-Model level, establishing formal symmetry between design activities (left side) and test activities (right side):

```
Requirements    <-->  Acceptance Tests   (validate AC outcomes)
System Design   <-->  System Tests       (validate complete workflows)
Architecture    <-->  Integration Tests  (validate component interactions)
Implementation  <-->  Unit Tests         (validate individual functions)
Security Design <-->  Security Tests     (validate STRIDE mitigations)
```

### Classification Rules

| V-Model Level | Test Validates | Traces To (Design Artifact) | Example |
|---------------|----------------|---------------------------|---------|
| `acceptance` | AC outcome from user perspective | User Story / AC | E2E test: "User can register and receive confirmation email" |
| `system` | Complete system workflow end-to-end | Architecture flow diagram | Full workflow: "Order → Payment → Fulfillment → Notification" |
| `integration` | Component interaction via API contract | API endpoint / Component interface | API test: "POST /users returns 201 with valid JWT" |
| `unit` | Individual function/method behavior | Source file / Function | Unit test: "validateEmail rejects malformed addresses" |
| `security` | STRIDE threat mitigation effectiveness | STRIDE finding / Threat model | Security test: "JWT with expired token returns 401" |

### Assignment During Testing Phase

When tests are added to the matrix (during Testing phase update), classify each test:

1. **Acceptance tests** → linked to User Stories / ACs — validates the AC outcome from user perspective
2. **System tests** → linked to architecture flow diagrams — validates complete multi-component workflows
3. **Integration tests** → linked to API contracts / component interfaces from Design — validates inter-component communication
4. **Unit tests** → linked to functions / files from Implementation — validates isolated behavior
5. **Security tests** → linked to STRIDE findings from Design — validates threat mitigations

## Orphan Detection Rules

| Orphan Type | Severity | Action |
|-------------|----------|--------|
| REQ without any Story | FAIL | Must create stories |
| Story without any AC | FAIL | Must define acceptance criteria |
| AC without any Test | WARN (requirements), FAIL (testing) | Generate test skeleton |
| Test without linked AC | WARN | Link to AC or remove |
| Component without REQ | WARN | Justify or remove from design |
| File without Component | WARN | Map to component |
| AC without acceptance-level test | WARN (testing), FAIL (deployment) | Add acceptance or system test for AC |
| API contract without integration test | WARN (testing), FAIL (deployment) | Add integration test per contract |
| STRIDE threat without security test | WARN (testing), FAIL (deployment) | Add security test per finding |

## Impact Analysis Output

```yaml
impact_analysis:
  changed_requirements: ["REQ-001"]
  change_description: "[What changed]"
  timestamp: "[ISO datetime]"

  affected_artifacts:
    stories: ["US-001", "US-003"]
    acceptance_criteria: ["AC-001", "AC-002", "AC-005"]
    components: ["UserService", "AuthMiddleware"]
    api_endpoints: ["POST /api/v1/users", "PUT /api/v1/users/{id}"]
    source_files:
      - path: "src/services/user-service.ts"
        functions: ["createUser", "updateUser"]
    tests:
      - test_id: TC-001
        status: needs_review
      - test_id: TC-005
        status: needs_review
    migrations: ["001_create_users_table"]

  recommended_actions:
    - action: "Update AC-001 to reflect new validation rules"
      priority: high
    - action: "Review TC-001 test assertions"
      priority: high
    - action: "Check if migration needs amendment"
      priority: medium
```

## Output Location

The traceability matrix is committed to the feature documentation:

```
[project-docs]/features/[feature-name]/trd/traceability.md
```

The matrix can also be generated from existing specification artifacts (e.g., spec.md, plan.md, tasks.md) if available in the project.

## Integration with Other Agents

| Agent | Traceability Role |
|-------|------------------|
| Requirements | Initializes matrix (REQ→Story→AC→TestSkeleton) |
| Design | Adds component/API/entity mappings |
| Implementation | Adds file/function/migration mappings |
| Testing | Adds test case mappings, validates coverage |
| Quality Gate | Uses matrix to check completeness per phase |
| Review | Uses matrix to verify all code traces to requirements |
| Knowledge | Records traceability gaps as lessons learned |

## Script: trace-matrix.py

The `scripts/trace-matrix.py` utility can generate or update the traceability matrix from YAML artifacts. See the script for usage.
