# vbounce — AI-Native SDLC Orchestrator v4.0

V-Bounce orchestrates a complete software development lifecycle with 9 specialized agents, explicit contracts, shared workspace, state management, and multi-layer quality assurance. Based on arXiv 2408.03416 (Hymel, 2024).

## Install

```bash
claude plugin install --from <marketplace-url> vbounce
```

## Architecture

Agent-first design: agents are self-contained execution units with explicit input/output contracts. The orchestrator skill manages state and validates contracts at every transition.

### Orchestrator Skill

| Skill | Triggers |
|-------|----------|
| **vbounce** | "start vbounce cycle", "run sdlc pipeline", "resume vbounce", "APPROVED", "START BUGFIX", "START CR" |

### Agents (9)

| Agent | Role | Color | Model |
|-------|------|-------|-------|
| requirements-analyst | Structured requirements + test skeletons | red | opus |
| design-architect | Technical design + STRIDE threat model | blue | opus |
| implementation-engineer | Fast-track code generation | green | opus |
| review-auditor | Hallucination detection + security audit | orange | opus |
| testing-engineer | Comprehensive test suites (40/20/10/10/10/10) | magenta | opus |
| deployment-engineer | Deployment plans + rollback strategies | cyan | opus |
| knowledge-curator | Per-phase + end-of-cycle knowledge capture | purple | opus |
| quality-gate-validator | Per-phase PASS/WARN/FAIL validation | yellow | opus |
| traceability-analyst | Live traceability matrix maintenance | white | opus |

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

### Shared References (15)

All reference files live in `skills/vbounce/references/` and are accessible to all agents:
phase-anatomy, id-conventions, approval-matrix, quality-criteria, acceptance-criteria, ambiguity-checklist, user-story-patterns, architecture-patterns, coding-standards, hallucination-patterns, edge-cases, and 4 workflow track definitions.

## Workflow

Every phase follows the 6-activity anatomy:

1. **Input** - Load context from previous phase
2. **AI Generation** - Phase agent produces output
3. **Quality Gate** - quality-gate-validator validates (PASS/WARN/FAIL)
4. **Human Review** - User reviews (only if QG passes)
5. **Refinement** - Iterate if changes requested
6. **Approval + Knowledge** - User approves, traceability + knowledge updated

## Shared Workspace

All cycle artifacts live in `.vbounce/cycles/CYCLE-{PROJECT}-{DATE}-{SEQ}/` with subdirectories per phase. State is tracked in `state.yaml`.

## Workflow Tracks

- **Feature** (6 phases) - Standard development cycle
- **Bugfix** (6 phases) - P2/P3 bug resolution
- **Hotfix** (5 phases) - P0/P1 emergency fixes
- **Change Request** (4 phases) - Mid-cycle scope changes

## License

MIT
