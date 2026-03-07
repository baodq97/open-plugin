---
name: vbounce
version: "4.0.0"
description: |
  Use this skill when the user wants to run a V-Bounce SDLC cycle, start a
  vbounce workflow, or manage a structured software development lifecycle with
  the V-Bounce framework. Orchestrates 9 specialized agents through phases:
  Requirements, Design, Implementation, Review, Testing, and Deployment with
  state management, contract validation, and quality gates at every transition.
  Triggers: "start vbounce cycle", "run sdlc pipeline", "resume vbounce",
  "APPROVED", "CHANGES REQUESTED", "START BUGFIX", "START CR".
  Do NOT use for general code review, testing, design, or implementation
  tasks outside the V-Bounce framework.
---

# V-Bounce SDLC Orchestrator v4.0

Agent-first SDLC framework with explicit contracts, shared workspace, and state management.

Based on arXiv 2408.03416 (Hymel, 2024): AI handles implementation, humans shift to validators/verifiers.

## Core Principles

1. **Agent-First** — agents are the execution units; orchestrator manages state and contracts
2. **Explicit Contracts** — every agent declares input/output files with validation patterns
3. **Shared Workspace** — all artifacts live in `.vbounce/cycles/{cycle_id}/`
4. **State Machine** — orchestrator reads/writes state.yaml, determines next action
5. **Multi-Layer QA** — input validation, output validation, semantic QG, cross-agent compatibility
6. **6-Activity Phase Anatomy** — see [references/phase-anatomy.md](references/phase-anatomy.md)

## Cycle Initialization

When the user provides a PRD or says "start vbounce cycle":

1. **Generate cycle ID**: `CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. **Create workspace**: `mkdir -p .vbounce/cycles/{cycle_id}/{requirements,design,implementation,review,testing,deployment,knowledge,quality-gates}`
3. **Copy PRD**: Write/copy the user's PRD to `.vbounce/cycles/{cycle_id}/prd.md`
4. **Initialize state**: Write `.vbounce/cycles/{cycle_id}/state.yaml` with all phases set to `not_started`, `current_phase: requirements`, `anatomy_step: input`
5. **Set active cycle**: Write `.vbounce/state.yaml` with just `active_cycle: {cycle_id}` and `workspace: .vbounce/cycles/{cycle_id}`
6. **Proceed**: Begin requirements phase (validate input contract, dispatch requirements-analyst)

The root `.vbounce/state.yaml` only stores which cycle is active. All phase state lives in `{workspace}/state.yaml`.

## Workspace Resolution

Throughout this document and all agent contracts, `{workspace}` is a placeholder. You MUST resolve it to the actual path before any operation:

1. Read `.vbounce/state.yaml` → get `workspace` field (e.g., `.vbounce/cycles/CYCLE-MYAPP-20260307-001`)
2. Replace ALL `{workspace}` references with this concrete path
3. When launching agents via the Agent tool, pass the **resolved** workspace path in the prompt, NOT the placeholder

Example: `{workspace}/requirements/requirements.md` → `.vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/requirements.md`

## Workspace Convention

```
{project}/.vbounce/
├── state.yaml                          # Active cycle pointer only
└── cycles/
    └── CYCLE-{PROJECT}-{DATE}-{SEQ}/
        ├── prd.md                      # User provides
        ├── state.yaml                  # Orchestrator manages
        ├── requirements/               # requirements-analyst writes
        │   ├── requirements.md
        │   ├── test-skeletons.md
        │   ├── traceability.md
        │   └── ambiguity-report.md
        ├── quality-gates/              # quality-gate-validator writes
        │   ├── qg-requirements.yaml
        │   ├── qg-design.yaml
        │   └── ...
        ├── design/                     # design-architect writes
        │   ├── design.md
        │   ├── security-design.md
        │   ├── api-spec.md
        │   ├── database-schema.md
        │   ├── architecture-decisions.md
        │   ├── traceability.md
        │   ├── test-impact.md
        │   └── test-specifications.md
        ├── implementation/             # implementation-engineer writes
        │   ├── summary.md
        │   ├── package-verification.md
        │   └── tests-created.md
        ├── review/                     # review-auditor writes
        │   ├── review-report.md
        │   ├── hallucination-report.md
        │   └── security-findings.md
        ├── testing/                    # testing-engineer writes
        │   ├── test-report.md
        │   ├── coverage-matrix.md
        │   └── test-results.md
        ├── deployment/                 # deployment-engineer writes
        │   ├── deployment-plan.md
        │   ├── acceptance-verification.md
        │   ├── pre-deploy-checklist.md
        │   └── monitoring.md
        ├── knowledge/                  # knowledge-curator writes
        │   ├── requirements-capture.yaml
        │   ├── design-capture.yaml
        │   └── ...
        └── traceability.yaml           # traceability-analyst writes
```

## State Management (state.yaml)

```yaml
cycle_id: CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}
workspace: .vbounce/cycles/CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: requirements
anatomy_step: input | generation | quality_gate | review | refinement | approval
phases:
  requirements:
    status: not_started | in_progress | qg_pending | review_pending | approved
    artifacts: []
    qg_verdict: null
    qg_ref: null
    approved_by: null
    kc_captured: false
  design:
    status: not_started
  implementation:
    status: not_started
  review:
    status: not_started
  testing:
    status: not_started
  deployment:
    status: not_started
history:
  - timestamp: "ISO-8601"
    action: "description"
```

### Resume Protocol

On every invocation:
1. Read `.vbounce/state.yaml` → get `active_cycle` and `workspace` path
2. Read `{workspace}/state.yaml` → get `current_phase` and `anatomy_step`
3. Resume from last recorded step — do NOT restart the cycle
4. If `.vbounce/state.yaml` does not exist, this is a new cycle — run Cycle Initialization

## Orchestrator State Machine

### 1. READ STATE
```
Read {workspace}/state.yaml
→ Determine current_phase + anatomy_step
→ Route to appropriate action
```

### 2. VALIDATE INPUT CONTRACT (before launching agent)
Before launching any phase agent, verify its input files exist:

```
For each file in agent.contract.input where required=YES:
  IF file does not exist at {workspace}/{path}:
    BLOCK — report missing input, do not launch agent
```

### 3. DISPATCH AGENT
Launch the phase agent with workspace context:

```
<files_to_read>
- {workspace}/{input_file_1}
- {workspace}/{input_file_2}
- ...
</files_to_read>

Workspace: {workspace}
Phase: {phase}
```

### 4. VALIDATE OUTPUT CONTRACT (after agent returns)
After agent completes, verify output files exist and contain required patterns:

```
For each file in agent.contract.output:
  IF file does not exist at {workspace}/{path}:
    FAIL — output missing
  IF validation pattern specified:
    IF file does not match pattern:
      WARN — output may be incomplete
```

### 5. UPDATE STATE
```yaml
phases.{phase}.status: qg_pending
phases.{phase}.artifacts: [list of output files]
anatomy_step: quality_gate
history: + {timestamp, action}
```

### 6. ROUTE ON QG VERDICT
- QG PASS/WARN(<=2) → go to step 7 (Present for Review)
- QG FAIL → knowledge-curator captures failure → phase agent revises → QG re-run
- **QG Retry Limit**: Max 3 failure→revise cycles. After 3 failures, escalate to user with QG report.

### 7. PRESENT FOR REVIEW (MANDATORY — do NOT skip)

After QG passes, you MUST present the phase results to the user before proceeding. This is the human review gate.

**What to show:**

1. **Phase summary** — which phase just completed, what the agent produced
2. **Artifacts list** — list every output file with its path, so the user knows what was created:
   ```
   Artifacts produced:
   - .vbounce/cycles/CYCLE-XXX/requirements/requirements.md (12 user stories, 47 ACs)
   - .vbounce/cycles/CYCLE-XXX/requirements/test-skeletons.md (47 test skeletons)
   - .vbounce/cycles/CYCLE-XXX/requirements/traceability.md (full matrix)
   - .vbounce/cycles/CYCLE-XXX/requirements/ambiguity-report.md (avg score: 23)
   ```
3. **QG verdict** — PASS or WARN with details:
   ```
   Quality Gate: PASS (6/6 criteria passed)
   ```
   If WARN, list the specific warnings.
4. **Key highlights** — read the output files and extract the most important items for the user to review:
   - Requirements: show the user story list with IDs and titles
   - Design: show the architecture overview and key ADRs
   - Implementation: show files created and package verification result
   - Testing: show test distribution and coverage percentage
   - Deployment: show rollback triggers and acceptance verification result
5. **Approval prompt** — explicitly ask the user:
   ```
   Ready for your review. Please respond with:
   - APPROVED (or APPROVED AS [Role]) — proceed to next phase
   - CHANGES REQUESTED — describe what needs revision

   Approvers for this phase: [from approval-matrix.md]
   ```

**What to do after user responds:**

- `APPROVED` / `APPROVED AS [Role]`:
  1. Update state: `phases.{phase}.status: approved`, `phases.{phase}.approved_by: [role]`
  2. Launch traceability-analyst (Update mode)
  3. Launch knowledge-curator (Per-Phase capture)
  4. Update state: `current_phase: {next_phase}`, `anatomy_step: input`
  5. Proceed to next phase (back to step 1)

- `CHANGES REQUESTED`:
  1. Update state: `anatomy_step: refinement`
  2. Re-dispatch phase agent with user's feedback + previous output
  3. After revision → back to step 5 (QG re-run)

### Hook Enforcement

The `hooks/hooks.json` file provides automated contract validation:
- **PreToolUse (Agent)**: Blocks agent launch if prompt contains unresolved `{workspace}` placeholders or missing input file list
- **SubagentStop**: After agent completes, verifies output files exist at expected paths

These hooks transform convention-based contracts into enforced contracts.

## Agent Dispatch Table

| Phase | Agent | Input Contract | Output Contract |
|-------|-------|---------------|-----------------|
| **Requirements** | requirements-analyst | `prd.md`, `state.yaml` | `requirements/*.md` (4 files) |
| **Design** | design-architect | `requirements/*.md` (3 files), `state.yaml` | `design/*.md` (8 files) |
| **Implementation** | implementation-engineer | `design/*.md` (3 files), `requirements/test-skeletons.md`, `state.yaml` | `implementation/*.md` (3 files) + source code |
| **Review** | review-auditor | `implementation/*.md`, source code, `design/`, `state.yaml` | `review/*.md` (3 files) |
| **Testing** | testing-engineer | `requirements/*.md`, `design/test-specifications.md`, `implementation/summary.md`, `state.yaml` | `testing/*.md` (3 files) + test code |
| **Deployment** | deployment-engineer | `testing/*.md` (2 files), `requirements/requirements.md`, `implementation/summary.md`, `state.yaml` | `deployment/*.md` (4 files) |

### Cross-Cutting Agents (invoked by orchestrator, not by phase)

| Agent | When Invoked | Input | Output |
|-------|-------------|-------|--------|
| **quality-gate-validator** | After every generation (anatomy step 3) | `{phase}/` artifacts, `state.yaml` | `quality-gates/qg-{phase}.yaml` |
| **traceability-analyst** | After every phase approval (anatomy step 6) | Phase artifacts, existing matrix | `traceability.yaml` |
| **knowledge-curator** | After QG failure OR after phase approval | Phase artifacts, QG report | `knowledge/{phase}-capture.yaml`, learned rules |

## Quality Assurance: 4 Layers

1. **Input Contract** (orchestrator validates before launch): Required files exist at expected paths
2. **Output Contract** (orchestrator validates after return): Files written with required patterns
3. **Semantic QG** (quality-gate-validator agent): Domain-specific criteria (ambiguity, coverage, etc.)
4. **Cross-Agent Compatibility** (next agent Step 1): "I parsed previous output successfully" acknowledgment

## Agent-to-Agent Context Passing

When launching an agent via the Agent tool, construct the prompt with **resolved paths** (not placeholders). This is a convention — the agent reads your prompt text and follows the instructions.

**Example prompt for launching design-architect:**
```
Read these files BEFORE any work:
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/requirements.md
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/test-skeletons.md
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/traceability.md
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/state.yaml

Workspace: .vbounce/cycles/CYCLE-MYAPP-20260307-001
Phase: design

Write all output files to: .vbounce/cycles/CYCLE-MYAPP-20260307-001/design/
```

Each agent's CONTRACT section lists what files it needs — use that as the checklist when constructing the prompt.

**Reference files**: Agent contracts list references like `references/acceptance-criteria.md`. These are relative to the plugin's skill directory. Agents access them via their `memory: project` setting and the plugin's auto-loaded context. Agents do NOT need explicit paths to reference files — they are loaded as part of the skill context.

## Commands

| Command | Effect |
|---------|--------|
| `APPROVED` | Proceed to next phase (triggers KC + traceability update) |
| `APPROVED AS [ROLE]` | Approve with specific role |
| `CHANGES REQUESTED` | Revise current output (loops to refinement) |
| `SKIP TO [phase]` | Jump to phase (if prerequisites met) |
| `ROLLBACK TO [phase]` | Return to previous phase |
| `START CR [description]` | Pause feature cycle, start CR assessment |
| `START BUGFIX [ticket-id]` | Start bugfix workflow |

## Continuous Test Creation

During the Requirements phase, test skeletons are generated alongside stories (not deferred). These skeletons carry through the entire pipeline — instantiated during Implementation, completed during Testing.

## Self-Learning Memory

All knowledge is stored following Claude Code conventions:

```
~/.claude/projects/<project>/memory/
├── MEMORY.md
└── agents/
    ├── requirements-analyst/MEMORY.md
    ├── design-architect/MEMORY.md
    └── ...

.claude/
├── vbounce.local.md                   # Per-project config overrides
└── rules/
    └── vbounce-learned-rules.md       # Auto-generated prevention rules
```

### Three Learning Loops

1. **Consult Before Acting** — every agent reads learned rules before generating output
2. **Capture on QG Failure** — knowledge-curator writes prevention rule, phase agent re-reads and revises
3. **Skill Update on Cycle End** — knowledge-curator writes actionable rules from retrospective

## Additional Tracks

- [Bugfix Workflow](references/workflows-bugfix-track.md) (6-phase, P2/P3)
- [Hotfix Workflow](references/workflows-hotfix-track.md) (5-phase, P0/P1)
- [Change Request Workflow](references/workflows-change-request-track.md) (4-phase, mid-cycle scope changes)
- [Workflows by Role](references/workflows-by-role.md)

## Shared References

All agents can consult these reference files:

| Reference | Description | Used By |
|-----------|-------------|---------|
| [phase-anatomy.md](references/phase-anatomy.md) | 6-Activity cycle definition | All agents |
| [id-conventions.md](references/id-conventions.md) | US-XXX, AC-XXX, NFR-XXX formats | All agents |
| [approval-matrix.md](references/approval-matrix.md) | Who approves each phase | Orchestrator |
| [quality-criteria.md](references/quality-criteria.md) | Phase-specific QG criteria | quality-gate-validator |
| [acceptance-criteria.md](references/acceptance-criteria.md) | GIVEN-WHEN-THEN patterns | requirements-analyst |
| [ambiguity-checklist.md](references/ambiguity-checklist.md) | Ambiguity detection guide | requirements-analyst |
| [user-story-patterns.md](references/user-story-patterns.md) | Story templates and sizing | requirements-analyst |
| [architecture-patterns.md](references/architecture-patterns.md) | Architecture styles | design-architect |
| [coding-standards.md](references/coding-standards.md) | Naming and structure | implementation-engineer |
| [hallucination-patterns.md](references/hallucination-patterns.md) | Known fake packages | implementation-engineer, review-auditor |
| [edge-cases.md](references/edge-cases.md) | Edge case checklist | testing-engineer |
| [workflows-bugfix-track.md](references/workflows-bugfix-track.md) | Bugfix workflow (P2/P3) | Orchestrator |
| [workflows-hotfix-track.md](references/workflows-hotfix-track.md) | Hotfix workflow (P0/P1) | Orchestrator |
| [workflows-change-request-track.md](references/workflows-change-request-track.md) | Change request workflow | Orchestrator |
| [workflows-by-role.md](references/workflows-by-role.md) | Role-specific quick reference | All agents |
