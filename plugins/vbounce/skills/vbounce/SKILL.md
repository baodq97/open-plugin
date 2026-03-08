---
name: vbounce
version: "5.1.0"
description: |
  Use this skill when the user wants to run a V-Bounce SDLC cycle, start a
  vbounce workflow, or manage a structured software development lifecycle with
  the V-Bounce framework. Orchestrates 12 specialized agents through phases:
  Requirements, Design, Contracts, Implementation (unified TDD), Review,
  and Deployment with mixed-model assignment, per-phase specialized QG agents,
  unified TDD flow, tech-aware context injection, state management, contract
  validation, and quality gates at every transition.
  Triggers: "start vbounce cycle", "run sdlc pipeline", "resume vbounce",
  "APPROVED", "CHANGES REQUESTED", "START BUGFIX", "START CR", "tech-aware",
  "TDD flow".
  Do NOT use for general code review, testing, design, or implementation
  tasks outside the V-Bounce framework.
---

# V-Bounce SDLC Orchestrator v5.1

Agent-first SDLC framework with explicit contracts, shared workspace, state management, unified TDD, and per-phase specialized QG agents.

Based on arXiv 2408.03416 (Hymel, 2024): AI handles implementation, humans shift to validators/verifiers.

## Core Principles

1. **Agent-First** — agents are the execution units; orchestrator manages state and contracts
2. **Explicit Contracts** — every agent declares input/output files with validation patterns
3. **Shared Workspace** — all artifacts live in `.vbounce/cycles/{cycle_id}/`
4. **State Machine** — orchestrator reads/writes state.yaml, determines next action
5. **Multi-Layer QA** — input validation, output validation, semantic QG, cross-agent compatibility
6. **7-Activity Phase Anatomy** — see [references/phase-anatomy.md](references/phase-anatomy.md)
7. **Technology-Aware** — detect project tech stack and inject framework context into all agent dispatches

## Cycle Initialization

When the user provides a PRD or says "start vbounce cycle":

1. **Generate cycle ID**: `CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. **Create workspace**: `mkdir -p .vbounce/cycles/{cycle_id}/{requirements,design,contracts,implementation,review,deployment,knowledge,quality-gates}`
3. **Copy PRD**: Write/copy the user's PRD to `.vbounce/cycles/{cycle_id}/prd.md`
4. **Tech Stack Detection**: Scan the project for manifest files to detect the tech stack:
   - Check in order: `package.json` (JS/TS), `pyproject.toml` / `requirements.txt` (Python), `*.csproj` (C#), `go.mod` (Go), `Cargo.toml` (Rust), `pom.xml` / `build.gradle` (Java/Kotlin)
   - Read `CLAUDE.md` for explicit tech stack declarations (overrides auto-detection)
   - If no manifest found, scan top 5 source files for import patterns and file extensions
   - Write `{workspace}/tech-context.yaml` with: `language`, `runtime`, `package_manager`, `frameworks` (list of {name, version, role}), `build_tool`, `install_command`, `compile_command`, `test_command`, `source_dirs`, `test_dirs`, `detected_from`
   - Resolve install/compile/test commands per language + package manager — see [references/tech-stack-commands.md](references/tech-stack-commands.md)
5. **Framework Context Loading**: Based on `tech-context.yaml`, check for relevant installed skills:
   - For each detected framework, search installed skills for matching trigger phrases (skill descriptions contain framework names)
   - If match found, read that skill's SKILL.md + key reference files
   - Extract: framework patterns, testing conventions, security considerations, known anti-patterns
   - Always check: `hallucination-patterns.md` for entries matching detected ecosystem, `coding-standards.md` for detected language, `CLAUDE.md` for project-specific conventions
   - If no skill matches any detected framework, graceful degradation: agents work without framework context (tech-context-prompt.md will only contain language + framework names + versions)
   - Write `{workspace}/tech-context-prompt.md` with: primary stack info, key patterns, known hallucination risks, testing conventions
6. **Initialize state**: Write `.vbounce/cycles/{cycle_id}/state.yaml` with v5.1 state schema (all phases including contracts set to `not_started`, `current_phase: requirements`, `anatomy_step: input`, `tech_context` populated from detection)
7. **Set active cycle**: Write `.vbounce/state.yaml` with just `active_cycle: {cycle_id}` and `workspace: .vbounce/cycles/{cycle_id}`
8. **Proceed**: Begin requirements phase (validate input contract, dispatch requirements-analyst)

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
        ├── tech-context.yaml           # Orchestrator detects (tech stack)
        ├── tech-context-prompt.md      # Orchestrator generates (framework context for agents)
        ├── requirements/               # requirements-analyst writes
        │   ├── requirements.md
        │   ├── test-skeletons.md
        │   ├── traceability.yaml
        │   └── ambiguity-report.md
        ├── quality-gates/              # per-phase QG agents write
        │   ├── qg-requirements.yaml
        │   ├── qg-design.yaml
        │   ├── qg-implementation.yaml
        │   └── qg-deployment.yaml
        ├── design/                     # design-architect writes
        │   ├── design.md
        │   ├── security-design.md
        │   ├── api-spec.md
        │   ├── database-schema.md
        │   ├── architecture-decisions.md
        │   ├── traceability.yaml
        │   ├── test-impact.md
        │   └── test-specifications.md
        ├── contracts/                  # Orchestrator generates (shared API contracts)
        │   ├── contracts.{ext}         # .ts/.py/.cs/.go/.md based on language
        │   ├── api-surface.yaml
        │   └── test-plan.yaml
        ├── implementation/             # implementation-engineer writes (unified TDD)
        │   ├── summary.md
        │   ├── package-verification.md
        │   ├── test-report.md          # Distribution stats, V-Model levels
        │   ├── coverage-matrix.md      # AC → test mapping
        │   └── execution-report.md     # Compile + test results per iteration
        ├── review/                     # review-auditor writes
        │   ├── review-report.md
        │   ├── hallucination-report.md
        │   └── security-findings.md
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
anatomy_step: input | generation | quality_gate | review | refinement | approval | post_phase
tech_context:
  detected: false                   # true after tech stack detection runs
  # Full details in {workspace}/tech-context.yaml (language, runtime, frameworks, commands, dirs)
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
  contracts:
    status: not_started | generated
  implementation:
    status: not_started | in_progress | qg_pending | review_pending | approved
    execution_status: not_started | running | passed | failed
    execution_iterations: 0
    task_groups: []  # for parallel agent teams [{group_id, modules, status, agent_id}]
    artifacts: []
    qg_verdict: null
    approved_by: null
  review:
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
Dispatch the appropriate per-phase QG agent:
- **Requirements** → `qg-requirements`
- **Design** → `qg-design`
- **Implementation** → `qg-implementation`
- **Deployment** → `qg-deployment`
- **Review** → NO QG (review IS the deep check)

Then route on verdict:
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
   - .vbounce/cycles/CYCLE-XXX/requirements/traceability.yaml (full matrix)
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
  2. Dispatch PARALLEL (two Agent tool calls in same response):
     - traceability-analyst (mode=update) — **Special case:** After deployment, use mode=finalize instead of mode=update
     - knowledge-curator (mode=per-phase)
  3. Update state: `current_phase: {next_phase}`, `anatomy_step: input`
  4. Proceed to next phase (back to step 1)

- `CHANGES REQUESTED`:
  1. Update state: `anatomy_step: refinement`
  2. Re-dispatch phase agent with user's feedback + previous output
  3. After revision → back to step 5 (QG re-run)

### Hook Enforcement

The `hooks/hooks.json` file provides automated contract validation:
- **PreToolUse (Agent)**: Blocks agent launch if prompt contains unresolved `{workspace}` placeholders or missing input file list
- **SubagentStop**: After agent completes, verifies output files exist at expected paths

These hooks transform convention-based contracts into enforced contracts.

## Contract Generation (Orchestrator Step — after Design approval)

After Design approval and post-phase agents (trace+KC) complete:

1. Read `{workspace}/design/*.md` + `{workspace}/requirements/*.md` + `{workspace}/tech-context.yaml`
2. Generate contracts in the detected language format:
   - TypeScript → `.ts` interfaces (`export interface ...`)
   - Python → `.py` Protocol/ABC classes (`class ...Protocol: ...`)
   - C# → `.cs` interface definitions (`public interface I... { ... }`)
   - Go → `.go` interface types (`type ... interface { ... }`)
   - Java/Kotlin → `.java`/`.kt` interface files
   - Unknown → `.md` language-agnostic pseudocode with method signatures table
3. Generate `{workspace}/contracts/api-surface.yaml` — every public method: name, params, return type, throws
4. Generate `{workspace}/contracts/test-plan.yaml` — positive/negative/edge test cases per method, mapped to ACs
5. Update state: `phases.contracts.status: generated`

## Execution Verification

Execution verification is handled internally by `implementation-engineer` (Steps 7-10 of its process). The agent runs install → compile → test with up to 3 fix iterations and writes the results to `{workspace}/implementation/execution-report.md`. The orchestrator no longer runs execution as a separate step.

## Agent Dispatch Table

| Phase | Agent | Model | Input Contract | Output Contract |
|-------|-------|-------|---------------|-----------------|
| **Requirements** | requirements-analyst | opus | `prd.md`, `state.yaml` | `requirements/*.md` (4 files) |
| **Design** | design-architect | opus | `requirements/*.md` (3 files), `state.yaml` | `design/*.md` (8 files) |
| *(contracts)* | orchestrator direct | — | `design/*.md`, `requirements/*.md`, `tech-context.yaml` | `contracts/` (3 files) |
| **Implementation** | implementation-engineer | sonnet | `contracts/`, `requirements/*.md`, `design/*.md`, `tech-context.yaml`, `state.yaml` | `implementation/*.md` (5 files) + source code + test code |
| **Review** | review-auditor | sonnet | `contracts/`, `implementation/*.md`, source code, test code, `design/`, `state.yaml` | `review/*.md` (3 files) |
| **Deployment** | deployment-engineer | haiku | `implementation/test-report.md`, `implementation/coverage-matrix.md`, `requirements/requirements.md`, `implementation/summary.md`, `state.yaml` | `deployment/*.md` (4 files) |

Note: `tech-context-prompt.md` is injected into every phase agent dispatch prompt by the orchestrator (see Agent-to-Agent Context Passing). It is not listed as a file input because agents receive it inline in the prompt text.

### Cross-Cutting Agents (invoked by orchestrator, not by phase)

| Agent | Model | When Invoked | Input | Output |
|-------|-------|-------------|-------|--------|
| **qg-requirements** | sonnet | After requirements generation (anatomy step 3) | `requirements/` artifacts, `state.yaml` | `quality-gates/qg-requirements.yaml` |
| **qg-design** | sonnet | After design generation (anatomy step 3) | `design/` artifacts, `requirements/requirements.md`, `state.yaml` | `quality-gates/qg-design.yaml` |
| **qg-implementation** | sonnet | After implementation generation (anatomy step 3) | `implementation/` artifacts, `contracts/`, source + test code, `state.yaml` | `quality-gates/qg-implementation.yaml` |
| **qg-deployment** | sonnet | After deployment generation (anatomy step 3) | `deployment/` artifacts, `implementation/test-report.md`, `requirements/requirements.md`, `state.yaml` | `quality-gates/qg-deployment.yaml` |
| **traceability-analyst** | haiku | PARALLEL after phase approval (mode=update); after deployment (mode=finalize) | Phase artifacts, existing matrix | `traceability.yaml` |
| **knowledge-curator** | haiku | PARALLEL after phase approval; after QG failure | Phase artifacts, QG report | `knowledge/{phase}-capture.yaml`, learned rules |

## Task Breakdown for Parallel Implementation

When `api-surface.yaml` contains >= 3 independent modules (no cross-module method calls or shared types), the orchestrator MAY parallelize the Implementation phase:

1. **Identify independent modules**: Group endpoints/interfaces by module from `api-surface.yaml`
2. **Verify no cross-dependencies**: Module A must not import types from Module B
3. **Launch N agents**: Each `implementation-engineer` gets scoped contracts + `Scope: [module-list]` in its prompt
4. **Each agent runs full TDD loop**: Tests + code + execution for its scoped modules only
5. **After all complete**: Orchestrator runs combined execution verification (`install_command` + `compile_command` + `test_command`) to catch cross-module integration issues
6. **If cross-module failures**: Re-dispatch a SINGLE `implementation-engineer` with ALL modules and the error output (max 2 integration-fix iterations)
7. **State tracking**: `implementation.task_groups: [{group_id: "auth", modules: ["auth-service", "auth-middleware"], status: "completed", agent_id: "..."}]`

**When NOT to parallelize**: < 3 modules, shared base types across modules, or modules with circular imports.

## Quality Assurance: 4 Layers

1. **Input Contract** (orchestrator validates before launch): Required files exist at expected paths
2. **Output Contract** (orchestrator validates after return): Files written with required patterns
3. **Semantic QG** (per-phase QG agent — sonnet): Domain-specific criteria (ambiguity, coverage, etc.)
4. **Cross-Agent Compatibility** (next agent Step 1): "I parsed previous output successfully" acknowledgment

## Agent-to-Agent Context Passing

When launching an agent via the Agent tool, construct the prompt with **resolved paths** (not placeholders). This is a convention — the agent reads your prompt text and follows the instructions.

**Example prompt for launching design-architect:**
```
Read these files BEFORE any work:
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/requirements.md
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/test-skeletons.md
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/requirements/traceability.yaml
- .vbounce/cycles/CYCLE-MYAPP-20260307-001/state.yaml

Workspace: .vbounce/cycles/CYCLE-MYAPP-20260307-001
Phase: design

## Technology Context
{contents of .vbounce/cycles/CYCLE-MYAPP-20260307-001/tech-context-prompt.md}

Write all output files to: .vbounce/cycles/CYCLE-MYAPP-20260307-001/design/
```

**Tech context injection**: Include `## Technology Context\n{contents of tech-context-prompt.md}` in every agent dispatch prompt. This gives every agent framework-specific knowledge without needing to load skills themselves.

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

## TDD Flow: Unified Contract-Driven Development

During the Requirements phase, test skeletons are generated alongside stories. After Design approval, the orchestrator generates `contracts/` — a shared API surface defining every interface, method signature, and type.

The unified TDD flow runs in a single agent (`implementation-engineer`):
1. **Contracts** define the shared API surface (generated by orchestrator from design + requirements + tech context)
2. **TDD-RED**: Implementation-engineer writes tests from contracts — tests reference exact method names and parameter types from `api-surface.yaml`
3. **TDD-GREEN**: Implementation-engineer implements contracts to make those tests pass — signatures MUST match exactly
4. **Execution**: Implementation-engineer runs install → compile → test internally, with up to 3 fix iterations

This eliminates the agent-to-agent contract mismatch problem from v5.0 by having ONE agent own tests + code + execution.

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
| [phase-anatomy.md](references/phase-anatomy.md) | 7-Activity cycle definition | All agents |
| [id-conventions.md](references/id-conventions.md) | US-XXX, AC-XXX, NFR-XXX formats | All agents |
| [approval-matrix.md](references/approval-matrix.md) | Who approves each phase | Orchestrator |
| [quality-criteria.md](references/quality-criteria.md) | Phase-specific QG criteria index | qg-requirements, qg-design, qg-implementation, qg-deployment |
| [acceptance-criteria.md](references/acceptance-criteria.md) | GIVEN-WHEN-THEN patterns | requirements-analyst |
| [ambiguity-checklist.md](references/ambiguity-checklist.md) | Ambiguity detection guide | requirements-analyst |
| [user-story-patterns.md](references/user-story-patterns.md) | Story templates and sizing | requirements-analyst |
| [architecture-patterns.md](references/architecture-patterns.md) | Architecture styles | design-architect |
| [coding-standards.md](references/coding-standards.md) | Naming and structure | implementation-engineer |
| [hallucination-patterns.md](references/hallucination-patterns.md) | Known fake packages | implementation-engineer, review-auditor |
| [edge-cases.md](references/edge-cases.md) | Edge case checklist | implementation-engineer |
| [tech-stack-commands.md](references/tech-stack-commands.md) | Tech stack command resolution | Orchestrator |
| [workflows-bugfix-track.md](references/workflows-bugfix-track.md) | Bugfix workflow (P2/P3) | Orchestrator |
| [workflows-hotfix-track.md](references/workflows-hotfix-track.md) | Hotfix workflow (P0/P1) | Orchestrator |
| [workflows-change-request-track.md](references/workflows-change-request-track.md) | Change request workflow | Orchestrator |
| [workflows-by-role.md](references/workflows-by-role.md) | Role-specific quick reference | All agents |
