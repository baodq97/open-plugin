# vbounce — AI-Native SDLC Orchestrator v5.1

V-Bounce orchestrates a complete software development lifecycle with 12 specialized agents, unified TDD flow, per-phase specialized QG agents, mixed-model assignment, tech-aware context injection, explicit contracts, shared workspace, state management, and multi-layer quality assurance. Based on arXiv 2408.03416 (Hymel, 2024).

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

### Agents (12)

| Agent | Role | Color | Model |
|-------|------|-------|-------|
| requirements-analyst | Structured requirements + test skeletons | red | opus |
| design-architect | Technical design + STRIDE threat model | blue | opus |
| implementation-engineer | Unified TDD: tests (RED) + code (GREEN) + execution | green | sonnet |
| review-auditor | Hallucination detection + contract conformance + test-source cross-check + security audit | orange | sonnet |
| deployment-engineer | Deployment plans + rollback strategies | cyan | haiku |
| knowledge-curator | Per-phase + end-of-cycle knowledge capture | purple | haiku |
| traceability-analyst | Live traceability matrix (incremental + finalize) | white | haiku |
| qg-requirements | Requirements-specific quality gate validation | yellow | sonnet |
| qg-design | Design-specific quality gate validation | yellow | sonnet |
| qg-implementation | Implementation-specific quality gate validation | yellow | sonnet |
| qg-deployment | Deployment-specific quality gate validation | yellow | sonnet |
| testing-engineer | DEPRECATED — merged into implementation-engineer | — | — |

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
3. **Quality Gate** - Per-phase QG agent validates (PASS/WARN/FAIL)
4. **Human Review** - User reviews (only if QG passes)
5. **Refinement** - Iterate if changes requested
6. **Approval** - User approves phase
7. **Post-Phase** - traceability + knowledge capture (parallel)

### Phase Order (v5.1 Unified TDD Flow)

Requirements → Design → Contracts → Implementation (Unified TDD) → Review → Deployment

- **Contracts**: Orchestrator generates shared API surface from design (not an agent phase)
- **Implementation**: Unified TDD — one agent writes tests (RED), implements code (GREEN), and runs execution verification internally (up to 3 iterations)

## Shared Workspace

All cycle artifacts live in `.vbounce/cycles/CYCLE-{PROJECT}-{DATE}-{SEQ}/` with subdirectories per phase. State is tracked in `state.yaml`. Tech stack is auto-detected into `tech-context.yaml`.

## Workflow Tracks

- **Feature** (6 phases) - Standard development cycle with unified TDD flow
- **Bugfix** (6 phases) - P2/P3 bug resolution
- **Hotfix** (5 phases) - P0/P1 emergency fixes
- **Change Request** (4 phases) - Mid-cycle scope changes

## License

MIT
