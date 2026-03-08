# vbounce — AI-Native SDLC Orchestrator v5.0

V-Bounce orchestrates a complete software development lifecycle with 9 specialized agents, mixed-model assignment, TDD flow, tech-aware context injection, explicit contracts, shared workspace, state management, and multi-layer quality assurance. Based on arXiv 2408.03416 (Hymel, 2024).

## Install

```bash
claude plugin install --from <marketplace-url> vbounce
```

## Architecture

Agent-first design: agents are self-contained execution units with explicit input/output contracts. The orchestrator skill manages state and validates contracts at every transition.

### Orchestrator Skill

| Skill | Triggers |
|-------|----------|
| **vbounce** | "start vbounce cycle", "run sdlc pipeline", "resume vbounce", "APPROVED", "START BUGFIX", "START CR", "TDD flow", "tech-aware" |

### Agents (9)

| Agent | Role | Color | Model |
|-------|------|-------|-------|
| requirements-analyst | Structured requirements + test skeletons | red | opus |
| design-architect | Technical design + STRIDE threat model | blue | opus |
| implementation-engineer | TDD-GREEN: implement contracts to pass tests | green | sonnet |
| review-auditor | Hallucination detection + contract conformance + security audit | orange | sonnet |
| testing-engineer | TDD-RED: generate tests from contracts (40/20/10/10/10/10) | magenta | sonnet |
| deployment-engineer | Deployment plans + rollback strategies | cyan | haiku |
| knowledge-curator | Per-phase + end-of-cycle knowledge capture | purple | haiku |
| quality-gate-validator | Per-phase PASS/WARN/FAIL validation | yellow | haiku |
| traceability-analyst | Live traceability matrix (incremental + finalize) | white | haiku |

### Commands (8)

| Command | Description |
|---------|-------------|
| `/vbounce:start` | Initialize a new feature cycle from a PRD |
| `/vbounce:status` | Show current cycle state (read-only) |
| `/vbounce:approve` | Approve current phase and advance |
| `/vbounce:bugfix` | Start bugfix cycle (P2/P3) |
| `/vbounce:hotfix` | Start hotfix cycle (P0/P1 emergency) |
| `/vbounce:cr` | Start change request cycle |
| `/vbounce:skip` | Skip forward to a specific phase |
| `/vbounce:rollback` | Rollback to a previous phase |

### Shared References (16)

All reference files live in `skills/vbounce/references/` and are accessible to all agents:
phase-anatomy, id-conventions, approval-matrix, quality-criteria, acceptance-criteria, ambiguity-checklist, user-story-patterns, architecture-patterns, coding-standards, hallucination-patterns, edge-cases, tech-stack-commands, and 4 workflow track definitions.

## Workflow

Every phase follows the 7-activity anatomy:

1. **Input** - Load context from previous phase
2. **AI Generation** - Phase agent produces output
3. **Quality Gate** - quality-gate-validator validates (PASS/WARN/FAIL)
4. **Human Review** - User reviews (only if QG passes)
5. **Refinement** - Iterate if changes requested
6. **Approval** - User approves phase
7. **Post-Phase** - traceability + knowledge capture (parallel)

### Phase Order (v5.0 TDD Flow)

Requirements → Design → Contracts → Testing (TDD-RED) → Implementation (TDD-GREEN) → Execution → Review → Deployment

- **Contracts**: Orchestrator generates shared API surface from design (not an agent phase)
- **Execution**: Orchestrator runs install → compile → test via Bash, up to 3 re-dispatch iterations (not an agent phase)

## Shared Workspace

All cycle artifacts live in `.vbounce/cycles/CYCLE-{PROJECT}-{DATE}-{SEQ}/` with subdirectories per phase. State is tracked in `state.yaml`. Tech stack is auto-detected into `tech-context.yaml`.

## Workflow Tracks

- **Feature** (8 phases) - Standard development cycle with TDD flow
- **Bugfix** (6 phases) - P2/P3 bug resolution
- **Hotfix** (5 phases) - P0/P1 emergency fixes
- **Change Request** (4 phases) - Mid-cycle scope changes

## License

MIT
