---
name: design-thinking
version: "1.0.0"
description: |
  Use this skill when the user wants to create a PRD from scratch, explore a
  problem space, run Design Thinking, or transform pain points into structured
  product requirements. Guides users through Empathize, Define, Ideate,
  Prototype, and PRD compilation to produce a vbounce-compatible Product
  Requirements Document.
  Triggers: "design thinking", "create PRD", "explore problem", "pain point",
  "empathize", "user research", "ideation", "from scratch PRD",
  "start from problem", "I have a problem but no PRD".
  Do NOT use for existing PRDs (use vbounce directly), general brainstorming
  outside product development, or UX design/wireframing.
---

# Design Thinking PRD Generator v1.0

Guides users from raw pain points through Design Thinking phases to produce a vbounce-compatible PRD.

**Key insight**: The first 3 phases are collaborative (user is the domain expert), while the last 2 are compilation (agent-driven). This drives a hybrid design: orchestrator-led conversation for Empathize/Define/Ideate, agent-driven for Prototype/PRD.

## Core Principles

1. **User as Domain Expert** — the user knows their problem better than the AI. Ask, don't assume.
2. **Conversation-First** — Empathize/Define/Ideate are structured conversations, not form-filling
3. **Evidence-Grounded** — every artifact traces back to something the user said
4. **Automated Quality** — QG validator runs automatically after every synthesis, with rework loop
5. **Vbounce-Compatible** — final PRD format matches what `/vbounce:start` expects

## Session Initialization

When the user provides a pain point, problem statement, or says "design thinking" / "create PRD from scratch":

1. **Generate session ID**: `DT-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. **Create workspace**: `mkdir -p .design-thinking/sessions/{session_id}/{empathize,define,ideate,prototype,quality-gates}`
3. **Initialize state**: Write `.design-thinking/sessions/{session_id}/state.yaml`:

```yaml
session_id: DT-{PROJECT}-{YYYYMMDD}-{SEQ}
workspace: .design-thinking/sessions/{session_id}
current_phase: empathize
phase_step: engage
phases:
  empathize:
    status: engaging
    conversation_turns: 0
    interview_round: 1
    rework_count: 0
    qg_verdict: null
    qg_history: []
  define:
    status: not_started
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  ideate:
    status: not_started
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  prototype:
    status: not_started
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  prd:
    status: not_started
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
history:
  - timestamp: "{ISO-8601}"
    action: "Session initialized"
```

4. **Set active session**: Write `.design-thinking/state.yaml`:

```yaml
active_session: {session_id}
workspace: .design-thinking/sessions/{session_id}
```

5. **Log initial input**: If user provided a pain point/problem description, write it to `{workspace}/empathize/conversation-log.md` as the first entry
6. **Begin Empathize**: Start Round 1 of the structured interview (see Conversation Guide below)

## Workspace Convention

```
{project}/.design-thinking/
├── state.yaml                           # Active session pointer
└── sessions/DT-{PROJECT}-{DATE}-{SEQ}/
    ├── state.yaml                       # Session state
    ├── empathize/
    │   ├── conversation-log.md
    │   ├── personas.md
    │   ├── empathy-maps.md
    │   ├── pain-points.md
    │   └── journey-maps.md
    ├── define/
    │   ├── conversation-log.md
    │   ├── problem-statement.md
    │   ├── design-principles.md
    │   └── opportunity-map.md
    ├── ideate/
    │   ├── conversation-log.md
    │   ├── solution-concepts.md
    │   ├── evaluation-matrix.md
    │   └── selected-direction.md
    ├── prototype/
    │   ├── feature-specs.md
    │   ├── user-flows.md
    │   ├── constraints.md
    │   ├── success-criteria.md
    │   └── scope-boundaries.md
    ├── quality-gates/
    │   ├── qg-empathize-1.yaml
    │   └── ...
    ├── prd.md
    └── prd-quality-report.md
```

## Workspace Resolution

Throughout this document and all agent contracts, `{workspace}` is a placeholder. You MUST resolve it to the actual path before any operation:

1. Read `.design-thinking/state.yaml` → get `workspace` field
2. Replace ALL `{workspace}` references with this concrete path
3. When launching agents via the Agent tool, pass the **resolved** workspace path in the prompt, NOT the placeholder

## State Management

```yaml
# state.yaml schema
session_id: DT-{PROJECT}-{YYYYMMDD}-{SEQ}
workspace: .design-thinking/sessions/...
current_phase: empathize | define | ideate | prototype | prd
phase_step: engage | synthesize | quality_check | review | advance
phases:
  empathize:
    status: not_started | engaging | synthesizing | qg_pending | review_pending | approved
    conversation_turns: 0
    interview_round: 1          # 1-5 for empathize interview rounds
    rework_count: 0             # 0-3, agent rework attempts
    qg_verdict: null
    qg_history: []              # [{attempt: 1, verdict: "FAIL", report: "qg-empathize-1.yaml"}]
  define:
    status: not_started | engaging | synthesizing | qg_pending | review_pending | approved
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  ideate:
    status: not_started | engaging | synthesizing | qg_pending | review_pending | approved
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  prototype:
    status: not_started | engaging | synthesizing | qg_pending | review_pending | approved
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
  prd:
    status: not_started | synthesizing | qg_pending | review_pending | approved
    conversation_turns: 0
    rework_count: 0
    qg_verdict: null
    qg_history: []
history:
  - timestamp: "ISO-8601"
    action: "description"
```

### Resume Protocol

On every invocation:
1. Read `.design-thinking/state.yaml` → get `active_session` and `workspace` path
2. Read `{workspace}/state.yaml` → get `current_phase` and `phase_step`
3. Resume from last recorded step — do NOT restart the session
4. If `.design-thinking/state.yaml` does not exist, this is a new session — run Session Initialization

## Orchestrator State Machine

### 1. READ STATE
```
Read {workspace}/state.yaml
→ Determine current_phase + phase_step
→ Route to appropriate action
```

### 2. ENGAGE (Conversation)
Conduct structured conversation with user based on the conversation guide for the current phase:
- **Empathize**: Deep structured interview — 5 rounds, 10-15+ turns. See [references/conversation-guides.md](references/conversation-guides.md)
- **Define**: AI-present → user-react — 2-3 turns
- **Ideate**: AI-present → user-react — 2-3 turns
- **Prototype**: Brief constraints input — 1-2 turns
- **PRD**: No engage — skip directly to SYNTHESIZE

Log all exchanges to `{workspace}/{phase}/conversation-log.md`.

Update state after each turn:
```yaml
phases.{phase}.conversation_turns: +1
phases.{phase}.interview_round: {current_round}  # empathize only
```

**Minimum turn enforcement**: Do NOT proceed to SYNTHESIZE until minimum turns are met:
- Empathize: 10 turns
- Define: 2 turns
- Ideate: 2 turns
- Prototype: 1 turn
- PRD: 0 turns

When minimum turns are met, ask the user: "I think we have enough to work with. Ready to move on, or is there more to discuss?"

### 3. SYNTHESIZE (Dispatch Agent)
Launch the phase-specific synthesis agent:

| Phase | Agent | Model |
|-------|-------|-------|
| Empathize | empathy-synthesizer | sonnet |
| Define | problem-definer | sonnet |
| Ideate | ideation-evaluator | sonnet |
| Prototype | prototype-architect | opus |
| PRD | prd-compiler | opus |

Construct the agent prompt with **resolved paths**:
```
Read these files BEFORE any work:
- {resolved_workspace}/{phase}/conversation-log.md
- {resolved_workspace}/state.yaml
- {any additional input files from agent contract}

Workspace: {resolved_workspace}
Phase: {phase}

Write all output files to: {resolved_workspace}/{phase}/
```

Update state:
```yaml
phases.{phase}.status: synthesizing
phase_step: synthesize
```

### 4. QUALITY CHECK (Automated Rework Loop)
After synthesis agent returns, dispatch QG validator:

```
Read these files BEFORE any work:
- {resolved_workspace}/{phase}/* (all phase artifacts)
- {resolved_workspace}/state.yaml

Workspace: {resolved_workspace}
Phase: {phase}

Write QG report to: {resolved_workspace}/quality-gates/qg-{phase}-{attempt}.yaml
```

Route on verdict:
- **PASS**: Update state → proceed to REVIEW
- **WARN (<=2)**: Update state → proceed to REVIEW with warnings noted
- **FAIL**: Increment `rework_count`, re-dispatch synthesis agent with QG feedback

```yaml
# On FAIL
phases.{phase}.rework_count: +1
phases.{phase}.qg_history:
  - attempt: {N}
    verdict: "FAIL"
    report: "qg-{phase}-{N}.yaml"
```

**Max 3 retries**: If `rework_count >= 3` and still FAIL, escalate to user:
> "The quality gate has failed 3 times for the {phase} phase. Here's the latest report: [summary]. Would you like to review the artifacts and provide guidance?"

### 5. REVIEW (Present to User)
Present synthesized artifacts to user:

1. **Phase summary** — what was produced
2. **Artifacts list** — every output file with its path
3. **QG verdict** — PASS or WARN with details
4. **Key highlights** — extract the most important items for quick review
5. **Approval prompt**:
```
Ready for your review. Please respond with:
- APPROVED — proceed to next phase
- CHANGES REQUESTED — describe what needs revision
```

### 6. ADVANCE (On Approval)
When user approves:
1. Update state: `phases.{phase}.status: approved`
2. Add history entry
3. Advance: `current_phase: {next_phase}`, `phase_step: engage`
4. Begin next phase

Phase order: empathize → define → ideate → prototype → prd

When user requests changes:
1. Update state: `phase_step: engage` (for conversation phases) or `phase_step: synthesize` (for compilation phases)
2. Incorporate feedback
3. Re-run synthesis + QG loop

## Agent Dispatch Table

| Phase | Agent | Model | Input | Output |
|-------|-------|-------|-------|--------|
| **Empathize** | empathy-synthesizer | sonnet | conversation-log.md | personas.md, empathy-maps.md, pain-points.md, journey-maps.md |
| **Define** | problem-definer | sonnet | conversation-log.md + empathize/* | problem-statement.md, design-principles.md, opportunity-map.md |
| **Ideate** | ideation-evaluator | sonnet | conversation-log.md + define/* + empathize/personas.md | solution-concepts.md, evaluation-matrix.md, selected-direction.md |
| **Prototype** | prototype-architect | opus | ideate/* + define/* + empathize/* | feature-specs.md, user-flows.md, constraints.md, success-criteria.md, scope-boundaries.md |
| **PRD** | prd-compiler | opus | prototype/* + define/* + empathize/* + prd-template.md | prd.md, prd-quality-report.md |
| **(QG)** | qg-validator | sonnet | {phase}/* + quality-criteria.md | qg-{phase}-{attempt}.yaml |

## Conversation Guide (Quick Reference)

### Empathize — 5 Interview Rounds

| Round | Focus | Key Questions |
|-------|-------|--------------|
| 1 | Context & Users | Who are the users? Roles, demographics, technical level, environment |
| 2 | Current Workflow | Step-by-step how they work today, tools, handoffs |
| 3 | Pain Points | Per step: what hurts? why? frequency? severity? quantified impact |
| 4 | Emotions & Workarounds | How do they feel? Hacks used? What's been tried? |
| 5 | Priorities & Vision | Magic wand question, what matters most, stakeholder needs |

Orchestrator behavior:
- Log every exchange to `conversation-log.md` with round labels
- Probe with "why?" — follow the 5 Whys technique
- Follow unexpected threads immediately, then return to round structure
- Summarize what you've heard at the end of each round

### Define — AI-Present, User-React
1. Present synthesized personas + pain points → user validates/corrects
2. Draft POV statements + HMW questions → user adjusts
3. (Optional) Propose design principles → user confirms

### Ideate — AI-Present, User-React
1. Present problem + brainstorm solutions → user adds ideas
2. Evaluate together using scoring matrix → user adjusts scores
3. Select direction → user confirms

### Prototype — Constraints Input
1. Ask about technical constraints, timeline, budget, deployment, compliance

### PRD — No Conversation
Skip directly to synthesis.

## Commands

| Command | Effect |
|---------|--------|
| `/design-thinking:start` | Initialize new DT session from pain point/problem |
| `/design-thinking:status` | Show session state (read-only) |
| `/design-thinking:approve` | Approve current phase, advance to next |
| `/design-thinking:revisit` | Go back to earlier phase for iteration |
| `/design-thinking:export` | Generate PRD from current artifacts (after Prototype approved) |
| `/design-thinking:handoff` | Copy PRD + suggest `/vbounce:start` |

## Revisit Protocol

When user wants to revisit an earlier phase:
1. Reset target phase to `engaging` (conversation phases) or `synthesizing` (PRD)
2. Reset all later phases to `not_started`
3. Preserve existing artifact files (for reference — agents produce new versions)
4. Update `current_phase` and `phase_step`
5. Begin the target phase conversation/synthesis

## Shared References

All agents can consult these reference files:

| Reference | Description | Used By |
|-----------|-------------|---------|
| [phase-anatomy.md](references/phase-anatomy.md) | 5-step phase cycle | All agents |
| [id-conventions.md](references/id-conventions.md) | ID format standards | All agents |
| [persona-template.md](references/persona-template.md) | Persona structure | empathy-synthesizer |
| [empathy-map-template.md](references/empathy-map-template.md) | Empathy map structure | empathy-synthesizer |
| [hmw-patterns.md](references/hmw-patterns.md) | HMW question patterns | problem-definer |
| [ideation-techniques.md](references/ideation-techniques.md) | Ideation + scoring | ideation-evaluator |
| [moscow-guide.md](references/moscow-guide.md) | MoSCoW prioritization | prototype-architect |
| [prd-template.md](references/prd-template.md) | Vbounce-compatible PRD format | prd-compiler |
| [quality-criteria.md](references/quality-criteria.md) | Phase-specific QG criteria | qg-validator |
| [conversation-guides.md](references/conversation-guides.md) | Interview/conversation scripts | Orchestrator |
