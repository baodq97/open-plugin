# V-Bounce Workflows by Role

> Quick-reference for who does what at each phase of the V-Bounce SDLC framework.
>
> **Version:** 1.0.0 | **Framework:** V-Bounce v2.0.0

---

## 0. High-Level Workflow

### Pipeline Overview

Seven phases flow left-to-right. Bounce time labels indicate how much iteration each phase expects. Cross-cutting agents (Quality Gate, Traceability, Knowledge) run at every phase.

```mermaid
flowchart LR
    REQ["<b>1. Requirements</b><br/>DEEP DIVE<br/><i>PO / BA approve</i>"]
    DES["<b>2. Design</b><br/>DEEP DIVE<br/><i>TL / Architect approve</i>"]
    IMP["<b>3. Implementation</b><br/>FAST TRACK<br/><i>SD / TL approve</i>"]
    REV["<b>4. Review</b><br/>DEEP DIVE<br/><i>Requestor accepts verdict</i>"]
    TST["<b>5. Testing</b><br/>DEEP DIVE<br/><i>QA Lead approves</i>"]
    DEP["<b>6. Deployment</b><br/>STANDARD<br/><i>QA 1/1 stg, 2/3 prod</i>"]
    KNO["<b>7. Knowledge</b><br/>END-OF-CYCLE<br/><i>Retrospective</i>"]

    REQ --> DES --> IMP --> REV --> TST --> DEP --> KNO

    subgraph "Cross-Cutting Agents (every phase)"
        QG["Quality Gate<br/>PASS / WARN / FAIL"]
        TR["Traceability<br/>Live matrix updates"]
        KC["Knowledge<br/>Per-phase capture"]
    end

    style REQ fill:#e8f5e9,stroke:#2e7d32
    style DES fill:#e3f2fd,stroke:#1565c0
    style IMP fill:#fff3e0,stroke:#e65100
    style REV fill:#fce4ec,stroke:#c62828
    style TST fill:#f3e5f5,stroke:#6a1b9a
    style DEP fill:#e0f7fa,stroke:#00838f
    style KNO fill:#f5f5f5,stroke:#424242
```

### Phase Anatomy (6-Activity Loop)

Every phase follows the same internal structure. The Quality Gate acts as a gatekeeper between AI generation and human review -- humans never see FAIL-state output.

```mermaid
flowchart TD
    INPUT["<b>1. Input</b><br/>Orchestrator loads context"]
    GEN["<b>2. Generate</b><br/>Phase Agent produces artifacts"]
    QG{"<b>3. Quality Gate</b><br/>Phase-specific criteria"}
    REVIEW["<b>4. Human Review</b><br/>Person reviews + feedback"]
    REFINE["<b>5. Refine</b><br/>Phase Agent revises"]
    APPROVE["<b>6. Approve</b><br/>Person types APPROVED"]
    TRACE["<b>6a. Trace</b><br/>Update traceability matrix"]
    KCAP["<b>6b. Knowledge</b><br/>Capture phase learnings"]

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
| **Implementation** | -- | -- | Reviews code, design conformance. Approves (quorum 1/2) | -- | Reviews code, packages. Approves (quorum 1/2) | -- |
| **Review** | -- | -- | -- | -- | -- | -- |
| **Testing** | -- | -- | -- | -- | -- | Reviews test suite, coverage. Approves (quorum 1/1) |
| **Deployment-Staging** | -- | -- | -- | -- | -- | Approves staging (quorum 1/1) |
| **Deployment-Prod** | Approves production (quorum 2/3) | -- | Approves production (quorum 2/3) | -- | -- | Approves production (quorum 2/3) |
| **Knowledge** | -- | -- | -- | -- | -- | -- |

### Agent Roles

| Phase | Phase Agent | Quality Gate | Traceability | Knowledge |
|-------|------------|-------------|-------------|-----------|
| **Requirements** | Generates PRD, stories, ACs, NFRs, test skeletons | Checks ambiguity < 50, NFR coverage, testability | Initializes REQ-Story-AC-TSK matrix | Captures ambiguity patterns, NFR gaps |
| **Design** | Generates architecture, security (STRIDE), APIs, data model, ADRs | Checks REQ coverage, security completeness, API-story mapping | Updates matrix: Component, API, Entity mappings | Captures architecture decisions, security findings |
| **Implementation** | Generates code, instantiates test skeletons, verifies packages | Checks 0 hallucinations, test presence, file size < 500 lines | Updates matrix: File, Function, Migration mappings | Captures hallucination patterns, package issues |
| **Review** | Runs hallucination detection, security audit, traceability check | -- (Review IS the deep check) | Validates matrix completeness, design conformance | Captures common issues, false positive rate |
| **Testing** | Generates full test suite (40/30/20/10 distribution) | Checks AC coverage 100%, distribution tolerance, naming | Updates matrix: Test case mappings, coverage % per REQ | Captures coverage gaps, edge case discoveries |
| **Deployment** | Creates deployment plan, rollback plan, runs checklists | Checks rollback plan, monitoring alerts, breaking changes | -- | Captures environment issues, rollback triggers |
| **Knowledge** | Runs end-of-cycle retrospective, generates LL/PAT artifacts | -- | -- | (IS the Knowledge agent) |

---

## 2. Per-Phase Workflow Tables

Each phase follows the **6-Activity Anatomy**. Steps 6a and 6b are sub-steps of Approval that run in parallel.

**QG branching rules:**
- **FAIL** --> back to step 2 (agent revises, human never sees it)
- **WARN > 2** --> back to step 2 (revise and recheck)
- **WARN <= 2** --> proceed to step 4 (human review, with warnings noted)
- **PASS** --> proceed to step 4 (human review)

### 2.1 Requirements Phase

Bounce time: **DEEP DIVE** (multiple refinement cycles expected)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads PRD from `docs/features/` | Context ready |
| 2 | Generate | Agent: Requirements | Parses PRD, detects ambiguities, generates stories + ACs + NFRs + test skeletons | YAML artifacts |
| 3 | QG | Agent: Quality Gate | Checks: ambiguity < 50 per REQ, NFR coverage (4 categories), AC testability (GIVEN-WHEN-THEN), story independence, traceability completeness | PASS / WARN / FAIL |
| 4 | Review | Person: PO or BA | Reviews stories, ACs, NFRs. Checks business goals and measurable metrics | Feedback |
| 5 | Refine | Agent: Requirements | Revises per feedback, re-scores ambiguity, updates test skeletons --> back to step 3 | Revised artifacts |
| 6 | Approve | Person: PO or BA | Types `APPROVED` or `APPROVED AS [Role]` (quorum: 1 of 2) | Phase complete |
| 6a | Trace | Agent: Traceability | Initializes matrix: REQ --> Story --> AC --> TestSkeleton | `traceability.md` |
| 6b | KC | Agent: Knowledge | Captures ambiguity patterns, clarification effectiveness, NFR gaps | `requirements.yaml` |

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
| 6a | Trace | Agent: Traceability | Updates matrix: REQ --> Component, REQ --> API endpoint, Story --> Data entity | `traceability.md` updated |
| 6b | KC | Agent: Knowledge | Captures architecture decisions, security findings, pattern reuse opportunities | `design.yaml` |

**Approval:** 1 of [Tech Lead, Architect]

### 2.3 Implementation Phase

Bounce time: **FAST TRACK** (generate, verify, done -- no gold-plating)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads approved design, knowledge base (past hallucinations, code patterns) | Context ready |
| 2 | Generate | Agent: Implementation | Generates code per approved design, instantiates test skeletons, verifies all packages | Code files + tests |
| 3 | QG | Agent: Quality Gate | Checks: 0 hallucinated packages, 100% packages verified, test presence per file, design conformance, no hardcoded secrets, files < 500 lines | PASS / WARN / FAIL |
| 4 | Review | Person: SD or TL | Reviews code quality, design conformance, package choices | Feedback |
| 5 | Refine | Agent: Implementation | Fixes issues, re-verifies packages --> back to step 3 | Revised code |
| 6 | Approve | Person: SD or TL | Types `APPROVED` or `APPROVED AS [Role]` (quorum: 1 of 2) | Phase complete |
| 6a | Trace | Agent: Traceability | Updates matrix: Component --> File, API --> Route handler, Entity --> Migration | `traceability.md` updated |
| 6b | KC | Agent: Knowledge | Captures hallucination patterns, package issues, code quality insights | `implementation.yaml` |

**Prerequisite:** `auto_review: required` -- must pass before human review.
**Approval:** 1 of [Senior Developer, Tech Lead]

### 2.4 Review Phase

Bounce time: **DEEP DIVE** (full hallucination check, security audit)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads implementation artifacts, QG results, traceability matrix | Context ready |
| 2 | Generate | Agent: Review | Runs 5-category review: hallucination (25%), security (25%), code quality (20%), logic (20%), performance (10%). Checks traceability conformance | Review report |
| 3 | QG | Agent: Quality Gate | Validates review completeness (all categories checked, no skipped files) | PASS / WARN / FAIL |
| 4 | Review | Person: (Requestor) | Reviews findings, confirms or disputes issues | Feedback |
| 5 | Refine | Agent: Review | Re-evaluates disputed findings, adjusts scores --> back to step 3 | Revised report |
| 6 | Approve | Person: (Requestor) | Accepts review verdict: APPROVE (>= 80), COMMENT (>= 60), or REQUEST_CHANGES (< 60) | Phase complete |
| 6a | Trace | Agent: Traceability | Validates: unmapped files, unimplemented requirements, design conformance | Validation report |
| 6b | KC | Agent: Knowledge | Captures common issues, false positive rate, review effectiveness | `review.yaml` |

**Verdict thresholds:**
- `hallucination_score < 80` --> REQUEST_CHANGES (critical)
- `security_score < 70` --> REQUEST_CHANGES
- `traceability_check = fail` --> REQUEST_CHANGES
- `overall_score >= 80 AND no critical` --> APPROVE
- `overall_score >= 60` --> COMMENT (minor fixes)

### 2.5 Testing Phase

Bounce time: **DEEP DIVE** (full test suite validation)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads implementation code, test skeletons, requirements ACs | Context ready |
| 2 | Generate | Agent: Testing | Instantiates skeletons, generates additional tests (edge, integration, security). Target: 40/30/20/10 distribution | Test suite |
| 3 | QG | Agent: Quality Gate | Checks: 100% AC coverage, distribution within 5% tolerance, naming convention, test independence, >= 5 edge cases, >= 3 security tests | PASS / WARN / FAIL |
| 4 | Review | Person: QA Lead | Reviews test coverage, edge cases, security scenarios | Feedback |
| 5 | Refine | Agent: Testing | Adds missing tests, rebalances distribution --> back to step 3 | Revised suite |
| 6 | Approve | Person: QA Lead | Types `APPROVED` or `APPROVED AS QA Lead` (quorum: 1 of 1) | Phase complete |
| 6a | Trace | Agent: Traceability | Updates matrix: AC --> Test case, Test --> File:Line, coverage % per REQ | `traceability.md` updated |
| 6b | KC | Agent: Knowledge | Captures coverage gaps, edge case discoveries, distribution balance | `testing.yaml` |

**Approval:** 1 of [QA Lead]
**Test distribution tolerance:** within 5% = PASS, within 10% = WARN, beyond 10% = FAIL

### 2.6 Deployment Phase

Bounce time: **STANDARD** (checklist-driven)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads test results, deployment config, rollback templates | Context ready |
| 2 | Generate | Agent: Deployment | Creates deployment plan, rollback plan (with trigger conditions), pre-deployment checklist | Deployment artifacts |
| 3 | QG | Agent: Quality Gate | Checks: checklist 100% complete, rollback plan present + tested, monitoring alerts configured (>= 2), breaking changes documented, env vars documented | PASS / WARN / FAIL |
| 4a | Review-Staging | Person: QA Lead | Reviews staging deployment, runs smoke tests | `APPROVED FOR STAGING` |
| 4b | Review-Prod | Person: TL + PO + QA | Reviews production readiness (quorum 2 of 3) | `APPROVED FOR PRODUCTION` |
| 5 | Refine | Agent: Deployment | Updates plan per feedback --> back to step 3 | Revised plan |
| 6 | Approve | Person: TL + PO + QA | Types `APPROVED FOR PRODUCTION` (quorum: 2 of 3) | Deployment executed |
| 6a | Monitor | Agent: Deployment | Post-deploy health checks, 24h monitoring. Rollback if: error rate > 1%, p95 latency > 500ms, health check failures > 3 | Monitoring report |
| 6b | KC | Agent: Knowledge | Captures environment issues, configuration surprises, rollback triggers | `deployment.yaml` |

**Staging approval:** 1 of [QA Lead]
**Production approval:** 2 of 3 [Tech Lead, Product Owner, QA Lead]

### 2.7 Knowledge Phase

Bounce time: **END-OF-CYCLE** (retrospective after all phases complete)

| Step | Activity | Who | Does What | Output |
|------|----------|-----|-----------|--------|
| 1 | Input | Orchestrator | Loads all phase captures (`requirements.yaml` through `deployment.yaml`) | All phase data |
| 2 | Generate | Agent: Knowledge | Aggregates phase captures, generates lessons learned (LL-*), code patterns (PAT-CODE-*), prompt patterns (PAT-PROMPT-*), AI effectiveness metrics | Retrospective report |
| 3 | QG | Agent: Quality Gate | Validates: all 6 phase captures present, metrics calculated, patterns categorized | PASS / WARN / FAIL |
| 4 | Review | Person: (Any) | Reviews lessons, patterns, metrics. Validates AI effectiveness targets | Feedback |
| 5 | Refine | Agent: Knowledge | Updates lessons, adds missed patterns --> back to step 3 | Revised report |
| 6 | Approve | Person: (Any) | Types `APPROVED` | Cycle complete |

**Effectiveness targets:**

| Metric | Target |
|--------|--------|
| AI Acceptance Rate | > 80% |
| Hallucination Rate | < 5% |
| Cycle Time | < 5 days |
| Test Coverage | > 80% |
| Bounce Ratio (REQ + Validation time) | > 60% of total time |

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
- **Input:** PRD from `docs/features/`
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
- **Input:** Approved design + knowledge base (past hallucinations)
- **Output:** Code files, instantiated tests, verified dependencies, traceability update
- **Key rule:** FAST-TRACK mode. Generate code, verify packages, instantiate test skeletons, done. No gold-plating. All packages must be verified against registries (`npm view` / `pip index` / `dotnet package search`).
- **Process:** Consult KB --> Load Design --> Generate Code --> Instantiate Test Skeletons --> Verify Packages --> Update Traceability --> Auto-Review --> Document

#### Review Agent

- **Active in:** Review (step 2 + 5)
- **Input:** Implementation artifacts, QG results, traceability matrix
- **Output:** Review report with scores (hallucination 25%, security 25%, code quality 20%, logic 20%, performance 10%)
- **Key rule:** Primary mission is catching AI hallucinations. Skips what QG already checked (package verification, file size, test presence). Always checks hallucination detection, security vulnerabilities, logic correctness, performance patterns.
- **Verdict:** APPROVE (>= 80, no critical) / COMMENT (>= 60) / REQUEST_CHANGES (< 60 or critical failures)

#### Testing Agent

- **Active in:** Testing (step 2 + 5), Requirements (Early Test Mode), On-change (Adaptive Update Mode)
- **Input:** Implementation code, requirements ACs, test skeletons
- **Output:** Full test suite with 40/30/20/10 distribution, coverage report
- **Key rule:** Three modes: Full (after implementation), Early Test (skeletons only, during requirements), Adaptive Update (on requirement change). Every AC must have >= 1 test. Naming: `Should_[Behavior]_When_[Condition]`.
- **Distribution:** 40% positive, 30% negative, 20% edge, 10% security (5% tolerance)

#### Deployment Agent

- **Active in:** Deployment (step 2 + 5 + 6a)
- **Input:** Test results, deployment config
- **Output:** Deployment plan, rollback plan, post-deployment monitoring (24h)
- **Key rule:** Rollback plan mandatory with quantitative trigger conditions (error rate > 1%, p95 > 500ms, health check failures > 3). Strategies: Blue-Green, Canary, Rolling, Recreate.
- **Environments:** Dev (auto-deploy), Staging (QA approval), Production (2/3 quorum)

#### Knowledge Agent

- **Active in:** Every phase (step 6b, per-phase capture), Knowledge phase (end-of-cycle retrospective)
- **Input:** Phase output artifacts
- **Output:** Per-phase: `[phase].yaml` capture. End-of-cycle: lessons (LL-*), code patterns (PAT-CODE-*), prompt patterns (PAT-PROMPT-*), AI effectiveness metrics
- **Key rule:** Two modes: per-phase capture (lightweight, after each approval) and end-of-cycle retrospective (full, after all phases). Tracks AI acceptance rate, hallucination rate, cycle time, test coverage, bounce ratio.

#### Quality Gate Agent

- **Active in:** Every phase (step 3, automatic)
- **Input:** Phase artifacts + context references
- **Output:** Verdict (PASS / WARN / FAIL) with detailed per-criterion results
- **Key rule:** Only checks, never generates. If FAIL --> phase agent revises (human never sees it). If WARN > 2 --> revise. If WARN <= 2 or PASS --> proceed to human review. Phase-specific criteria (see per-phase tables above).
- **ID format:** `QG-[PHASE]-[YYYYMMDD]-[###]`

#### Traceability Agent

- **Active in:** Requirements (step 6a, initialize), Design + Implementation + Testing (step 6a, update), Review (step 6a, validate), On-change (impact analysis)
- **Input:** Phase artifacts + existing matrix
- **Output:** Updated `traceability.md` with live REQ-to-Test-to-Code linking
- **Four modes:** Initialize (REQ phase), Update (DES/IMP/TST phases), Validate (any phase), Impact Analysis (on change)
- **Orphan detection:** REQ without Story = FAIL, Story without AC = FAIL, AC without Test = WARN (REQ phase) / FAIL (TST phase), Test without AC = WARN, Component without REQ = WARN, File without Component = WARN

---

## 4. Anti-Patterns

| DON'T | DO | Why |
|-------|-----|-----|
| Skip Quality Gate to save time | Always let QG run before human review | Catches issues before a human wastes time reviewing flawed output |
| Let humans review after a QG FAIL | Agent revises until QG passes, THEN human reviews | Human time is the bottleneck -- don't waste it on known-bad output |
| Gold-plate during Implementation | FAST-TRACK: generate code, verify packages, instantiate tests, done | Bounce pattern allocates time to requirements and validation, not implementation |
| Write full tests during Requirements | Generate test SKELETONS only (status: skeleton) | Full test bodies come during Implementation (instantiate) and Testing (complete suite) |
| Skip ambiguity scoring | Score every requirement 0-100, block if >= 51 | Ambiguous requirements cascade into design/code/test defects |
| Approve without role declaration | Always type `APPROVED AS [Role]` | Traceability needs to know WHO approved for audit trail |
| Manually track requirement-to-code links | Let Traceability Agent maintain the live matrix | Manual tracking drifts; agent updates at every phase transition |
| Skip per-phase Knowledge Capture | Let KC agent run after every phase approval | End-of-cycle retrospective alone misses phase-specific context |
| Invent package names in Implementation | Verify every dependency: `npm view`, `pip index`, `dotnet package search` | Hallucinated packages are the #1 AI code generation failure mode |
| Deploy without a rollback plan | Rollback plan with quantitative triggers is mandatory | "We'll figure it out" is not a rollback plan |
| Approve production with 1 person | Require 2 of 3 quorum (TL + PO + QA Lead) | Production risk requires cross-functional sign-off |
| Re-run Review checks that QG already passed | Review agent skips QG-covered checks (package verification, file size, test presence) | Avoid duplicate work; Review focuses on hallucination, security, logic, performance |
| Treat WARN as PASS | WARN > 2 loops back to revision; WARN <= 2 proceeds with warnings noted | Accumulated warnings indicate systemic issues that compound across phases |

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

When a scope change arrives **during an active feature cycle** (after requirements are approved, phases 3-7), the [Change Request Workflow](workflows-change-request-track.md) applies.

### When CRs Apply

- Feature cycle must be in phases 3-7 (Implementation through Knowledge)
- The change is externally sourced (stakeholder, customer, market shift)
- The change is not a bug (use [Bugfix](workflows-bugfix-track.md) or [Hotfix](workflows-hotfix-track.md))
- Changes during phases 1-2 (before requirements approval) are handled by normal revision — no CR track needed

### CR Flow Summary

The CR track has **4 phases**: Assess → Replan → Re-execute → Reconcile. CRs are classified L1-L4 based on impact scoring across 4 dimensions (requirement_impact, design_impact, test_invalidation, work_preservation).

| Level | Name | Re-entry Point | Governance |
|-------|------|----------------|------------|
| L1 | COSMETIC | Resume at current phase | SD or TL (1/2) |
| L2 | MINOR | Re-enter at Implementation | TL (1/1) |
| L3 | SIGNIFICANT | Re-enter at Design | TL + Architect (2/2) |
| L4 | ARCHITECTURAL | New feature cycle | PO + TL + Architect (2/3) |

For full details, see [Change Request Workflow](workflows-change-request-track.md).
