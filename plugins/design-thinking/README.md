# design-thinking — Design Thinking PRD Generator v1.0

Guides users from raw pain points through 5 Design Thinking phases (Empathize, Define, Ideate, Prototype, PRD) to produce vbounce-compatible Product Requirements Documents. The first 3 phases are collaborative conversations (user is the domain expert), while the last 2 are agent-driven compilation.

## Install

```bash
# Add marketplace first
claude plugin marketplace add https://github.com/baodq97/open-plugin

# Then install
claude plugin install design-thinking
```

## Architecture

Hybrid design: orchestrator-led conversation for Empathize/Define/Ideate, agent-driven synthesis for Prototype/PRD. Every synthesis runs through an automated QG rework loop (max 3 retries) before user review.

### Orchestrator Skill

| Skill | Triggers |
|-------|----------|
| **design-thinking** | "design thinking", "create PRD", "explore problem", "pain point", "empathize", "user research", "ideation", "from scratch PRD" |

### Agents (6)

| Agent | Role | Color | Model |
|-------|------|-------|-------|
| empathy-synthesizer | Personas, empathy maps, pain points, journey maps | red | sonnet |
| problem-definer | POV statements, HMW questions, design principles | blue | sonnet |
| ideation-evaluator | Solution concepts, evaluation matrix, selected direction | green | sonnet |
| prototype-architect | Feature specs, user flows, constraints, success criteria | cyan | opus |
| prd-compiler | Vbounce-compatible PRD compilation | purple | opus |
| qg-validator | Phase-specific quality gate validation (all phases) | yellow | sonnet |

### Commands (6)

| Command | Description |
|---------|-------------|
| `/design-thinking:start` | Initialize a new session from a pain point or problem |
| `/design-thinking:status` | Show current session state (read-only) |
| `/design-thinking:approve` | Approve current phase and advance |
| `/design-thinking:revisit` | Go back to an earlier phase for iteration |
| `/design-thinking:export` | Generate PRD from current artifacts |
| `/design-thinking:handoff` | Copy PRD to project root + suggest `/vbounce:start` |

### Shared References (10)

All reference files live in `skills/design-thinking/references/`:
phase-anatomy, id-conventions, persona-template, empathy-map-template, hmw-patterns, ideation-techniques, moscow-guide, prd-template, quality-criteria, conversation-guides.

## Workflow

Every phase follows the 5-step anatomy:

1. **Engage** — Structured conversation with user
2. **Synthesize** — Agent produces artifacts from conversation
3. **Quality Check** — QG validator reviews (PASS/WARN/FAIL)
4. **Review** — User reviews synthesized artifacts
5. **Advance** — Move to next phase

### Phase Flow

| Phase | Engage Style | Min Turns | Agent |
|-------|-------------|-----------|-------|
| Empathize | Deep interview (5 rounds) | 10 | empathy-synthesizer |
| Define | AI-present, user-react | 2 | problem-definer |
| Ideate | AI-present, user-react | 2 | ideation-evaluator |
| Prototype | Brief constraints input | 1 | prototype-architect |
| PRD | None (compilation) | 0 | prd-compiler |

## Shared Workspace

All session artifacts live in `.design-thinking/sessions/DT-{PROJECT}-{DATE}-{SEQ}/` with subdirectories per phase. State is tracked in `state.yaml`.

## Vbounce Integration

The final `prd.md` output is formatted for direct consumption by `/vbounce:start`. Use `/design-thinking:handoff` to copy the PRD and start a vbounce cycle.

```
Design Thinking                          vbounce
Pain Point → Empathize → Define →        /vbounce:start prd.md →
Ideate → Prototype → PRD ──────────────→ Requirements → Design → ...
```

## License

MIT
