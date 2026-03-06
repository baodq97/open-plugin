# vbounce — AI-Native SDLC Orchestrator

V-Bounce orchestrates a complete software development lifecycle with 9 specialized sub-agents, quality gates, traceability, and knowledge capture. Based on arXiv 2408.03416 (Hymel, 2024).

## Install

```bash
claude plugin install --from <marketplace-url> vbounce
```

## Components

### Skills (10)

| Skill | Triggers |
|-------|----------|
| **vbounce** | vbounce, sdlc, requirement, design, implement, test, review, deploy |
| **vbounce-requirements** | requirement, user story, PRD, NFR |
| **vbounce-design** | design, architecture, API, data model, security design |
| **vbounce-implementation** | implement, code, generate |
| **vbounce-review** | review, verify, check |
| **vbounce-testing** | test, coverage, edge cases, QA |
| **vbounce-deployment** | deploy, release, staging, production |
| **vbounce-knowledge** | retrospective, lessons, knowledge |
| **vbounce-quality-gate** | quality gate, quality check |
| **vbounce-traceability** | traceability, trace matrix, impact analysis |

### Agents (9)

| Agent | Role | Model |
|-------|------|-------|
| requirements-analyst | Structured requirements + test skeletons | opus |
| design-architect | Technical design + STRIDE threat model | opus |
| implementation-engineer | Fast-track code generation | opus |
| review-auditor | Hallucination detection + security audit | opus |
| testing-engineer | Comprehensive test suites (40/30/20/10) | opus |
| deployment-engineer | Deployment plans + rollback strategies | opus |
| knowledge-curator | Per-phase + end-of-cycle knowledge capture | opus |
| quality-gate-validator | Per-phase PASS/WARN/FAIL validation | opus |
| traceability-analyst | Live traceability matrix maintenance | opus |

## Workflow

Every phase follows the 6-activity anatomy:

1. **Input** - Load context from previous phase
2. **AI Generation** - Phase agent produces output
3. **Quality Gate** - quality-gate agent validates (PASS/WARN/FAIL)
4. **Human Review** - User reviews (only if QG passes)
5. **Refinement** - Iterate if changes requested
6. **Approval + Knowledge** - User approves, traceability + knowledge updated

## Workflow Tracks

- **Feature** (6 phases) - Standard development cycle
- **Bugfix** (6 phases) - P2/P3 bug resolution
- **Hotfix** (5 phases) - P0/P1 emergency fixes
- **Change Request** (4 phases) - Mid-cycle scope changes

## License

MIT
