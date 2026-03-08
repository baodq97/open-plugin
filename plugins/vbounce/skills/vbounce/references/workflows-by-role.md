# V-Bounce Workflows by Role

> Quick-reference for who does what at each phase of the V-Bounce SDLC framework.
>
> **Version:** 1.0.0 | **Framework:** V-Bounce v5.0.0

---

## 0. High-Level Workflow

### Pipeline Overview

Eight phases flow left-to-right. Bounce time labels indicate how much iteration each phase expects. Cross-cutting agents (Quality Gate, Traceability, Knowledge) run in PARALLEL at every phase.

```mermaid
flowchart LR
    REQ["<b>1. Requirements</b><br/>DEEP DIVE<br/><i>PO / BA approve</i>"]
    DES["<b>2. Design</b><br/>DEEP DIVE<br/><i>TL / Architect approve</i>"]
    CON["<b>3. Contracts</b><br/>FAST TRACK<br/><i>Orchestrator step</i>"]
    TST["<b>4. Testing</b><br/>DEEP DIVE (TDD-RED)<br/><i>QA Lead approves</i>"]
    IMP["<b>5. Implementation</b><br/>FAST TRACK (TDD-GREEN)<br/><i>SD / TL approve</i>"]
    EXE["<b>6. Execution</b><br/>FAST TRACK<br/><i>Orchestrator step</i>"]
    REV["<b>7. Review</b><br/>DEEP DIVE<br/><i>Requestor accepts verdict</i>"]
    DEP["<b>8. Deployment</b><br/>STANDARD<br/><i>QA 1/1 stg, 2/3 prod</i>"]

    REQ --> DES --> CON --> TST --> IMP --> EXE --> REV --> DEP

    subgraph "Cross-Cutting Agents (every phase, run in PARALLEL)"
        QG["Quality Gate<br/>PASS / WARN / FAIL"]
        TR["Traceability<br/>Live matrix updates"]
        KC["Knowledge<br/>Per-phase capture"]
    end

    style REQ fill:#e8f5e9,stroke:#2e7d32
    style DES fill:#e3f2fd,stroke:#1565c0
    style CON fill:#fffde7,stroke:#f57f17
    style TST fill:#f3e5f5,stroke:#6a1b9a
    style IMP fill:#fff3e0,stroke:#e65100
    style EXE fill:#e8eaf6,stroke:#283593
    style REV fill:#fce4ec,stroke:#c62828
    style DEP fill:#e0f7fa,stroke:#00838f
```

### Phase Anatomy (7-Activity Loop)

Every phase follows the same internal structure. The Quality Gate acts as a gatekeeper between AI generation and human review -- humans never see FAIL-state output.

```mermaid
flowchart TD
    INPUT["<b>1. Input</b><br/>Orchestrator loads context"]
    GEN["<b>2. Generate</b><br/>Phase Agent produces artifacts"]
    QG{"<b>3. Quality Gate</b><br/>Phase-specific criteria"}
    REVIEW["<b>4. Human Review</b><br/>Person reviews + feedback"]
    REFINE["<b>5. Refine</b><br/>Phase Agent revises"]
    APPROVE["<b>6. Approve</b><br/>Person types APPROVED"]
    TRACE["<b>7a. Trace</b><br/>Update traceability matrix<br/>(PARALLEL)"]
    KCAP["<b>7b. Knowledge</b><br/>Capture phase learnings<br/>(PARALLEL)"]

    INPUT --> GEN
    GEN --> QG
    QG -->|"FAIL or WARN > 2"| GEN
    QG -->|"PASS or WARN <= 2"| REVIEW
    REVIEW -->|"CHANGES REQUESTED"| REFINE
    REFINE --> QG
    REVIEW -->|"APPROVED"| APPROVE
    APPROVE --> TRACE
    APPROVE --> KCAP

    style QG fill:#fff9c4,stroke:#f9a825
    style APPROVE fill:#c8e6c9,stroke:#2e7d32
```

---

## 1. Master Swimlane

One-page overview. Rows = phases, columns = roles. Cell = what they do.

### Person Roles

| Phase | Product Owner | Business Analyst | Tech Lead | Architect | Senior Developer | QA Lead |
|-------|--------------|-----------------|-----------|-----------|-----------------|---------|
| **Requirements** | Reviews PRD, stories, ACs. Approves (quorum 1/2) | Reviews PRD, stories, ACs. Approves (quorum 1/2) | -- | -- | -- | -- |
| **Design** | -- | -- | Reviews architecture, APIs, ADRs. Approves (quorum 1/2) | Reviews architecture, security, data model. Approves (quorum 1/2) | -- | -- |
| **Testing** | -- | -- | -- | -- | -- | Reviews test suite, coverage. Approves (quorum 1/1) |
| **Implementation** | -- | -- | Reviews code, design conformance. Approves (quorum 1/2) | -- | Reviews code, packages. Approves (quorum 1/2) | -- |
| **Review** | -- | -- | -- | -- | -- | -- |
| **Deployment-Staging** | -- | -- | -- | -- | -- | Approves staging (quorum 1/1) |
| **Deployment-Prod** | Approves production (quorum 2/3) | -- | Approves production (quorum 2/3) | -- | -- | Approves production (quorum 2/3) |

### Agent Roles

> **Note:** Contracts (phase 3) and Execution (phase 6) are orchestrator steps, not agent phases. They do not have dedicated agents.

| Phase | Phase Agent | Quality Gate | Traceability | Knowledge |
|-------|------------|-------------|-------------|-----------|
| **Requirements** | Generates PRD, stories, ACs, NFRs, test skeletons | Checks ambiguity < 50, NFR coverage, testability | Initializes REQ-Story-AC-TSK matrix | Captures ambiguity patterns, NFR gaps |
| **Design** | Generates architecture, security (STRIDE), APIs, data model, ADRs | Checks REQ coverage, security completeness, API-story mapping | Updates matrix: Component, API, Entity mappings | Captures architecture decisions, security findings |
| **Testing** | Generates full test suite from contracts (TDD-RED mode). Distribution: 40/20/10/10/10/10 (positive/negative/edge/security/component-integration/system-E2E) | Checks AC coverage 100%, distribution tolerance, naming | Updates matrix: Test case mappings, coverage % per REQ | Captures coverage gaps, edge case discoveries |
| **Implementation** | TDD-GREEN: implements contracts to pass existing tests, verifies packages | Checks 0 hallucinations, contract conformance, file size < 500 lines | Updates matrix: File, Function, Migration mappings | Captures hallucination patterns, package issues |
| **Review** | Runs hallucination detection, security audit, traceability check, contract conformance, execution report review | -- (Review IS the deep check) | Validates matrix completeness, design conformance | Captures common issues, false positive rate |
| **Deployment** | Creates deployment plan, rollback plan, runs checklists | Checks rollback plan, monitoring alerts, breaking changes | -- | Captures environment issues, rollback triggers |

---

## 2. Per-Phase Workflow Tables

Each phase follows the **7-Activity Anatomy**. Steps 7a and 7b are sub-steps of Post-Phase that run in parallel after Approval.

**QG branching rules:**
- **FAIL** --> back to step 2 (agent revises, human never sees it)
- **WARN > 2** --> back to step 2 (revise and recheck)
- **WARN <= 2** --> proceed to step 4 (human review, with warnings noted)
- **PASS** --> proceed to step 4 (human review)

### 2.1 Requirements Phase

Bounce time: **DEEP DIVE** (multiple refinement cycles expected)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads PRD from `{workspace}/prd.md` | Context ready |
| 2 | Generate | Agent: Requirements | Parses PRD, detects ambiguities, generates stories + ACs + NFRs + test skeletons | YAML artifacts |
| 3 | QG | Agent: Quality Gate | Checks: ambiguity < 50 per REQ, NFR coverage (4 categories), AC testability (GIVEN-WHEN-THEN), story independence, traceability completeness | PASS / WARN / FAIL |
| 4 | Review | Person: PO or BA | Reviews stories, ACs, NFRs. Checks business goals and measurable metrics | Feedback |
| 5 | Refine | Agent: Requirements | Revises per feedback, re-scores ambiguity, updates test skeletons --> back to step 3 | Revised artifacts |
| 6 | Approve | Person: PO or BA | Types `APPROVED` or `APPROVED AS [Role]` (quorum: 1 of 2) | Phase complete |
| 7a | Trace | Agent: Traceability | Initializes matrix: REQ --> Story --> AC --> TestSkeleton | `traceability.yaml` |
| 7b | KC | Agent: Knowledge | Captures ambiguity patterns, clarification effectiveness, NFR gaps | `requirements.yaml` |

**Approval:** 1 of [Product Owner, Business Analyst]

### 2.2 Design Phase

Bounce time: **DEEP DIVE** (architecture decisions require thorough validation)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads approved requirements, knowledge base patterns | Context ready |
| 2 | Generate | Agent: Design | Designs architecture, security (STRIDE), APIs, data model, ADRs. Updates traceability | YAML artifacts |
| 3 | QG | Agent: Quality Gate | Checks: 1:1 REQ coverage, STRIDE + auth + data protection present, 100% story-to-API mapping, data model integrity, ADR presence, diagram accuracy | PASS / WARN / FAIL |
| 4 | Review | Person: TL or Architect | Reviews architecture fit, security model, API design, scalability plan | Feedback |
| 5 | Refine | Agent: Design | Revises architecture, updates ADRs, re-maps traceability --> back to step 3 | Revised artifacts |
| 6 | Approve | Person: TL or Architect | Types `APPROVED` or `APPROVED AS [Role]` (quorum: 1 of 2) | Phase complete |
| 7a | Trace | Agent: Traceability | Updates matrix: REQ --> Component, REQ --> API endpoint, Story --> Data entity | `traceability.yaml` updated |
| 7b | KC | Agent: Knowledge | Captures architecture decisions, security findings, pattern reuse opportunities | `design.yaml` |

**Approval:** 1 of [Tech Lead, Architect]

### 2.3 Contracts Phase

Bounce time: **FAST TRACK** (orchestrator step -- generates shared API contracts from approved design)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads approved design artifacts (APIs, data model, interfaces) | Context ready |
| 2 | Generate | Orchestrator | Generates shared API contracts (TypeScript interfaces, request/response types, error codes, endpoint signatures) from approved design | Contract files |
| 3 | QG | Agent: Quality Gate | Checks: 100% API coverage, type completeness, consistency with design, no orphan types | PASS / WARN / FAIL |
| 4 | Update State | Orchestrator | Sets `phases.contracts.status: generated`, proceeds to Testing | Phase complete |

**Note:** Automated orchestrator step — no human approval gate. The orchestrator generates contracts that become the shared source of truth for both Testing (TDD-RED) and Implementation (TDD-GREEN).

### 2.4 Testing Phase (TDD-RED)

Bounce time: **DEEP DIVE** (full test suite validation from contracts)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads contracts, requirements ACs, design test specs | Context ready |
| 2 | Generate | Agent: Testing | Generates full test suite from contracts (TDD-RED mode). Tests target contract interfaces, not implementation. Distribution: 40/20/10/10/10/10 (positive/negative/edge/security/component-integration/system-E2E) | Test suite |
| 3 | QG | Agent: Quality Gate | Checks: 100% AC coverage, distribution within 5% tolerance, naming convention, test independence, >= 5 edge cases, >= 3 security tests | PASS / WARN / FAIL |
| 4 | Review | Person: QA Lead | Reviews test coverage, edge cases, security scenarios | Feedback |
| 5 | Refine | Agent: Testing | Adds missing tests, rebalances distribution --> back to step 3 | Revised suite |
| 6 | Approve | Person: QA Lead | Types `APPROVED` or `APPROVED AS QA Lead` (quorum: 1 of 1) | Phase complete |
| 7a | Trace | Agent: Traceability | Updates matrix: AC --> Test case, Test --> Contract type, coverage % per REQ | `traceability.yaml` updated |
| 7b | KC | Agent: Knowledge | Captures coverage gaps, edge case discoveries, distribution balance | `testing.yaml` |

**Approval:** 1 of [QA Lead]
**Test distribution:** 40% positive / 20% negative / 10% edge / 10% security / 10% component-integration / 10% system-E2E
**Test distribution tolerance:** within 5% = PASS, within 10% = WARN, beyond 10% = FAIL

### 2.5 Implementation Phase (TDD-GREEN)

Bounce time: **FAST TRACK** (TDD-GREEN: implement contracts to make tests pass)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads approved design, contracts, existing tests, knowledge base (past hallucinations, code patterns) | Context ready |
| 2 | Generate | Agent: Implementation | Reads contracts + existing tests. Implements code to satisfy contracts and make tests pass (TDD-GREEN). Verifies all packages | Code files |
| 3 | QG | Agent: Quality Gate | Checks: 0 hallucinated packages, 100% packages verified, contract conformance, design conformance, no hardcoded secrets, files < 500 lines | PASS / WARN / FAIL |
| 4 | Review | Person: SD or TL | Reviews code quality, design conformance, package choices | Feedback |
| 5 | Refine | Agent: Implementation | Fixes issues, re-verifies packages --> back to step 3 | Revised code |
| 6 | Approve | Person: SD or TL | Types `APPROVED` or `APPROVED AS [Role]` (quorum: 1 of 2) | Phase complete |
| 7a | Trace | Agent: Traceability | Updates matrix: Component --> File, API --> Route handler, Entity --> Migration | `traceability.yaml` updated |
| 7b | KC | Agent: Knowledge | Captures hallucination patterns, package issues, code quality insights | `implementation.yaml` |

**Prerequisite:** `auto_review: required` -- must pass before human review.
**Approval:** 1 of [Senior Developer, Tech Lead]

### 2.6 Execution Phase

Bounce time: **FAST TRACK** (orchestrator step -- runs install, compile, test)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads implementation code, test suite, package manifest | Context ready |
| 2 | Execute | Orchestrator | Runs `npm install` (or equivalent), compiles TypeScript / builds project, runs full test suite (`npm test`) | Execution report |
| 3 | Fix Loop | Orchestrator + Agent: Implementation | On failure: categorize error, re-dispatch implementation/testing agent, re-run (max 3 iterations) | Revised code |
| 4 | Update State | Orchestrator | Writes `execution-report.md`, sets `execution.status` (passed/failed), proceeds to Review or escalates | Phase complete |

**Note:** Automated orchestrator step — no human approval gate. The orchestrator runs actual commands (install, compile, test) and produces an execution report. If tests fail, the Implementation Agent is called back to fix issues (up to 3 iterations). If still failing after 3 iterations, escalates to user.

### 2.7 Review Phase

Bounce time: **DEEP DIVE** (full hallucination check, security audit)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads implementation artifacts, QG results, traceability matrix, contracts, execution report | Context ready |
| 2 | Generate | Agent: Review | Runs 5-category review: hallucination (30%), security (25%), code quality (20%), logic (15%), performance (10%). Checks traceability conformance, contract conformance, and execution report | Review report |
| 3 | QG | Agent: Quality Gate | Validates review completeness (all categories checked, no skipped files) | PASS / WARN / FAIL |
| 4 | Review | Person: (Requestor) | Reviews findings, confirms or disputes issues | Feedback |
| 5 | Refine | Agent: Review | Re-evaluates disputed findings, adjusts scores --> back to step 3 | Revised report |
| 6 | Approve | Person: (Requestor) | Accepts review verdict: APPROVE (>= 80), COMMENT (>= 60), or REQUEST_CHANGES (< 60) | Phase complete |
| 7a | Trace | Agent: Traceability | Validates: unmapped files, unimplemented requirements, design conformance | Validation report |
| 7b | KC | Agent: Knowledge | Captures common issues, false positive rate, review effectiveness | `review.yaml` |

**Verdict thresholds:**
- `hallucination_score < 80` --> REQUEST_CHANGES (critical)
- `security_score < 70` --> REQUEST_CHANGES
- `traceability_check = fail` --> REQUEST_CHANGES
- `contract_conformance = fail` --> REQUEST_CHANGES
- `overall_score >= 80 AND no critical` --> APPROVE
- `overall_score >= 60` --> COMMENT (minor fixes)

### 2.8 Deployment Phase

Bounce time: **STANDARD** (checklist-driven)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads test results, execution report, deployment config, rollback templates | Context ready |
| 2 | Generate | Agent: Deployment | Creates deployment plan, rollback plan (with trigger conditions), pre-deployment checklist | Deployment artifacts |
| 3 | QG | Agent: Quality Gate | Checks: checklist 100% complete, rollback plan present + tested, monitoring alerts configured (>= 2), breaking changes documented, env vars documented | PASS / WARN / FAIL |
| 4a | Review-Staging | Person: QA Lead | Reviews staging deployment, runs smoke tests | `APPROVED FOR STAGING` |
| 4b | Review-Prod | Person: TL + PO + QA | Reviews production readiness (quorum 2 of 3) | `APPROVED FOR PRODUCTION` |
| 5 | Refine | Agent: Deployment | Updates plan per feedback --> back to step 3 | Revised plan |
| 6 | Approve | Person: TL + PO + QA | Types `APPROVED FOR PRODUCTION` (quorum: 2 of 3) | Deployment executed |
| 7a | Monitor | Agent: Deployment | Post-deploy health checks, 24h monitoring. Rollback if: error rate > 1%, p95 latency > 500ms, health check failures > 3 | Monitoring report |
| 7b | KC | Agent: Knowledge | Captures environment issues, configuration surprises, rollback triggers | `deployment.yaml` |

**Staging approval:** 1 of [QA Lead]
**Production approval:** 2 of 3 [Tech Lead, Product Owner, QA Lead]

---

## 3. Role Quick-Reference Cards

### Person Roles

#### Product Owner (PO)

- **Active in:** Requirements (reviewer + approver), Deployment-Prod (approver)
- **Reviews:** PRD, user stories, acceptance criteria, NFRs, success metrics
- **Approves:** Requirements phase (quorum 1/2), Production deployment (quorum 2/3)
- **Commands:** `APPROVED`, `APPROVED AS Product Owner`, `CHANGES REQUESTED`, `APPROVED FOR PRODUCTION`
- **Key check:** Are business goals met? Are success metrics measurable? Do ACs reflect user value?

#### Business Analyst (BA)

- **Active in:** Requirements (reviewer + approver)
- **Reviews:** PRD completeness, user stories, acceptance criteria, NFR categories
- **Approves:** Requirements phase (quorum 1/2)
- **Commands:** `APPROVED`, `APPROVED AS Business Analyst`, `CHANGES REQUESTED`
- **Key check:** Are requirements unambiguous? Are edge cases captured? Is scope well-bounded?

#### Tech Lead (TL)

- **Active in:** Design (reviewer + approver), Implementation (reviewer + approver), Deployment-Prod (approver)
- **Reviews:** Architecture decisions, API design, code quality, design conformance
- **Approves:** Design phase (quorum 1/2), Implementation phase (quorum 1/2), Production deployment (quorum 2/3)
- **Commands:** `APPROVED`, `APPROVED AS Tech Lead`, `CHANGES REQUESTED`, `APPROVED FOR PRODUCTION`
- **Key check:** Does design fit the system? Is code maintainable? Are there security gaps?

#### Architect (ARC)

- **Active in:** Design (reviewer + approver)
- **Reviews:** Architecture style, component boundaries, security model (STRIDE), scalability plan, data model
- **Approves:** Design phase (quorum 1/2)
- **Commands:** `APPROVED`, `APPROVED AS Architect`, `CHANGES REQUESTED`
- **Key check:** Is architecture consistent with existing system? Are trade-offs documented in ADRs?

#### Senior Developer (SD)

- **Active in:** Implementation (reviewer + approver)
- **Reviews:** Code quality, package choices, test coverage, coding standards compliance
- **Approves:** Implementation phase (quorum 1/2)
- **Commands:** `APPROVED`, `APPROVED AS Senior Developer`, `CHANGES REQUESTED`
- **Key check:** Is code clean? Are all packages verified (no hallucinations)? Do tests pass?

#### QA Lead (QA)

- **Active in:** Testing (reviewer + approver), Deployment-Staging (approver), Deployment-Prod (approver)
- **Reviews:** Test suite completeness, AC coverage, edge cases, security tests, distribution balance
- **Approves:** Testing phase (quorum 1/1), Staging deployment (quorum 1/1), Production deployment (quorum 2/3)
- **Commands:** `APPROVED`, `APPROVED AS QA Lead`, `CHANGES REQUESTED`, `APPROVED FOR STAGING`, `APPROVED FOR PRODUCTION`
- **Key check:** Does every AC have a test? Are edge cases and security scenarios covered? Is test distribution balanced?

### Agent Roles

#### Requirements Agent

- **Active in:** Requirements (step 2 + 5)
- **Input:** PRD from `{workspace}/prd.md`
- **Output:** Structured requirements (stories, ACs, NFRs, test skeletons, ambiguity scores)
- **Key rule:** Every AC must be GIVEN-WHEN-THEN. Every requirement scored for ambiguity (must be < 50). Test skeletons generated alongside requirements (continuous test creation).
- **Process:** Parse --> Detect Ambiguities --> Generate PRD --> Create Stories --> Define NFRs --> Write ACs --> Generate Test Skeletons --> Build Traceability --> Score Ambiguity

#### Design Agent

- **Active in:** Design (step 2 + 5)
- **Input:** Approved requirements + knowledge base patterns
- **Output:** Architecture, security design (STRIDE), APIs, data model, ADRs, traceability update
- **Key rule:** Must consult knowledge base first (lessons learned, code patterns). Every story must map to API endpoint(s). STRIDE threat model mandatory.
- **Process:** Consult KB --> Analyze REQs --> Design Architecture --> Design Security --> Design APIs --> Create Data Model --> Plan Scalability --> Document ADRs --> Update Traceability --> Preview Test Impact

#### Implementation Agent

- **Active in:** Implementation (step 2 + 5)
- **Input:** Approved design + contracts + existing tests + knowledge base (past hallucinations)
- **Output:** Code files implementing contracts, verified dependencies, traceability update
- **Key rule:** TDD-GREEN mode. Implement contracts to make existing tests pass, verify packages, done. No gold-plating. Do NOT create test files. All packages must be verified against registries (`npm view` / `pip index` / `dotnet package search`).
- **Process:** Consult KB --> Load Design --> Load Contracts --> Load Existing Tests --> Generate Code to Pass Tests --> Verify Packages --> Update Traceability --> Auto-Review --> Document

#### Review Agent

- **Active in:** Review (step 2 + 5)
- **Input:** Implementation artifacts, QG results, traceability matrix, contracts, execution report
- **Output:** Review report with scores (hallucination 30%, security 25%, code quality 20%, logic 15%, performance 10%)
- **Key rule:** Primary mission is catching AI hallucinations. Skips what QG already checked (package verification, file size). Checks hallucination detection, security vulnerabilities, logic correctness, performance patterns, contract conformance, and execution report results.
- **Verdict:** APPROVE (>= 80, no critical) / COMMENT (>= 60) / REQUEST_CHANGES (< 60 or critical failures)

#### Testing Agent

- **Active in:** Testing (step 2 + 5), Requirements (Early Test Mode), On-change (Adaptive Update Mode)
- **Input:** Contracts, requirements ACs, design test specs
- **Output:** Full test suite with 40/20/10/10/10/10 distribution, coverage report
- **Key rule:** TDD-RED mode: generates tests from contracts before implementation exists. Three modes: Full (TDD-RED, from contracts), Early Test (skeletons only, during requirements), Adaptive Update (on requirement change). Every AC must have >= 1 test. Naming: `Should_[Behavior]_When_[Condition]`.
- **Distribution:** 40% positive, 20% negative, 10% edge, 10% security, 10% component-integration, 10% system-E2E (5% tolerance)

#### Deployment Agent

- **Active in:** Deployment (step 2 + 5 + 7a)
- **Input:** Test results, execution report, deployment config
- **Output:** Deployment plan, rollback plan, post-deployment monitoring (24h)
- **Key rule:** Rollback plan mandatory with quantitative trigger conditions (error rate > 1%, p95 > 500ms, health check failures > 3). Strategies: Blue-Green, Canary, Rolling, Recreate.
- **Environments:** Dev (auto-deploy), Staging (QA approval), Production (2/3 quorum)

#### Knowledge Agent

- **Active in:** Every phase (step 7b, per-phase capture), end-of-cycle retrospective (post-phase agent)
- **Input:** Phase output artifacts
- **Output:** Per-phase: `[phase].yaml` capture. End-of-cycle: lessons (LL-*), code patterns (PAT-CODE-*), prompt patterns (PAT-PROMPT-*), AI effectiveness metrics
- **Key rule:** Two modes: per-phase capture (lightweight, after each approval) and end-of-cycle retrospective (full, after all phases). Tracks AI acceptance rate, hallucination rate, cycle time, test coverage, bounce ratio.

#### Quality Gate Agent

- **Active in:** All phases (step 3, automatic)
- **Input:** Phase artifacts + context references
- **Output:** Verdict (PASS / WARN / FAIL) with detailed per-criterion results
- **Key rule:** Only checks, never generates. If FAIL --> phase agent revises (human never sees it). If WARN > 2 --> revise. If WARN <= 2 or PASS --> proceed to human review. Phase-specific criteria (see per-phase tables above).
- **ID format:** `QG-[PHASE]-[YYYYMMDD]-[###]`

#### Traceability Agent

- **Active in:** Requirements (step 7a, initialize), Design + Implementation + Testing (step 7a, update), Review (step 7a, validate), On-change (impact analysis)
- **Input:** Phase artifacts + existing matrix
- **Output:** Updated `traceability.yaml` with live REQ-to-Test-to-Code linking
- **Four modes:** Initialize (REQ phase), Update (DES/IMP/TST phases), Validate (any phase), Impact Analysis (on change)
- **Orphan detection:** REQ without Story = FAIL, Story without AC = FAIL, AC without Test = WARN (REQ phase) / FAIL (TST phase), Test without AC = WARN, Component without REQ = WARN, File without Component = WARN

---

## 4. Anti-Patterns

| DON'T | DO | Why |
|-------|-----|-----|
| Skip Quality Gate to save time | Always let QG run before human review | Catches issues before a human wastes time reviewing flawed output |
| Let humans review after a QG FAIL | Agent revises until QG passes, THEN human reviews | Human time is the bottleneck -- don't waste it on known-bad output |
| Gold-plate during Implementation | TDD-GREEN: implement contracts to pass tests, verify packages, done | Bounce pattern allocates time to requirements and validation, not implementation |
| Write full tests during Requirements | Generate test SKELETONS only (status: skeleton); full tests come from contracts in TDD-RED phase | Full test bodies come during Testing (TDD-RED from contracts) and are validated during Execution |
| Skip ambiguity scoring | Score every requirement 0-100, block if >= 51 | Ambiguous requirements cascade into design/code/test defects |
| Approve without role declaration | Always type `APPROVED AS [Role]` | Traceability needs to know WHO approved for audit trail |
| Manually track requirement-to-code links | Let Traceability Agent maintain the live matrix | Manual tracking drifts; agent updates at every phase transition |
| Skip per-phase Knowledge Capture | Let KC agent run after every phase approval | End-of-cycle retrospective alone misses phase-specific context |
| Invent package names in Implementation | Verify every dependency: `npm view`, `pip index`, `dotnet package search` | Hallucinated packages are the #1 AI code generation failure mode |
| Deploy without a rollback plan | Rollback plan with quantitative triggers is mandatory | "We'll figure it out" is not a rollback plan |
| Approve production with 1 person | Require 2 of 3 quorum (TL + PO + QA Lead) | Production risk requires cross-functional sign-off |
| Re-run Review checks that QG already passed | Review agent skips QG-covered checks (package verification, file size) | Avoid duplicate work; Review focuses on hallucination, security, logic, performance, contract conformance |
| Treat WARN as PASS | WARN > 2 loops back to revision; WARN <= 2 proceeds with warnings noted | Accumulated warnings indicate systemic issues that compound across phases |
| Write tests after implementation | TDD-RED: write tests from contracts BEFORE implementation | Tests validate contracts, not implementation details; prevents coupling |
| Skip Execution phase | Always run install, compile, test before Review | Without execution verification, Review operates on unvalidated code |

---

## 5. Command Reference

| Command | When to Use | Effect |
|---------|------------|--------|
| `APPROVED` | Any phase, generic approval | Proceeds to next phase; triggers KC + Traceability |
| `APPROVED AS [Role]` | Any phase, role-specific approval | Same as APPROVED but records approver role for audit trail |
| `CHANGES REQUESTED` | Any phase, during review | Loops to step 5 (Refinement), agent revises per feedback |
| `SKIP TO [phase]` | When prerequisites are already met | Jumps to named phase (validates prerequisites first) |
| `ROLLBACK TO [phase]` | When a later phase reveals earlier issues | Returns to named phase, preserving work done so far |
| `APPROVED FOR STAGING` | Deployment phase | Approves staging deployment (QA Lead, quorum 1/1) |
| `APPROVED FOR PRODUCTION` | Deployment phase | Approves production deployment (quorum 2/3: TL + PO + QA Lead) |
| `START CR [description]` | Scope change during active feature cycle | Pauses feature cycle, creates CR cycle, enters Assess phase |
| `APPROVED CR AS [L1-L4]` | CR Assess phase | Accepts CR classification and proceeds to Replan (L1-L3) or new cycle (L4) |
| `CR REJECTED` | CR Assess phase | CR denied, feature cycle resumes unchanged |
| `CR DEFERRED` | CR Assess phase | CR queued for future cycle, feature cycle resumes |
| `CR SPLIT` | CR Assess phase | CR split into smaller CRs, each assessed independently |
| `OVERRIDE CLASSIFICATION [L1-L4]` | CR Assess or Re-execute phase | Human overrides CR classification (must provide justification) |
| `CR RECONCILED` | CR Reconcile phase | CR complete, overlay merged into traceability, feature resumes |
| `ABORT CR` | Any CR phase | Abandons CR, reverts to pre-CR state, feature cycle resumes |

---

## 6. Change Request Integration

When a scope change arrives **during an active feature cycle** (after requirements are approved, phases 3-8), the [Change Request Workflow](workflows-change-request-track.md) applies.

### When CRs Apply

- Feature cycle must be in phases 3-8 (Contracts through Deployment)
- The change is externally sourced (stakeholder, customer, market shift)
- The change is not a bug (use [Bugfix](workflows-bugfix-track.md) or [Hotfix](workflows-hotfix-track.md))
- Changes during phases 1-2 (before requirements approval) are handled by normal revision -- no CR track needed

### CR Flow Summary

The CR track has **4 phases**: Assess --> Replan --> Re-execute --> Reconcile. CRs are classified L1-L4 based on impact scoring across 4 dimensions (requirement_impact, design_impact, test_invalidation, work_preservation).

| Level | Name | Re-entry Point | Governance |
|-------|------|----------------|------------|
| L1 | COSMETIC | Resume at current phase | SD or TL (1/2) |
| L2 | MINOR | Re-enter at Implementation | TL (1/1) |
| L3 | SIGNIFICANT | Re-enter at Design | TL + Architect (2/2) |
| L4 | ARCHITECTURAL | New feature cycle | PO + TL + Architect (2/3) |

For full details, see [Change Request Workflow](workflows-change-request-track.md).
