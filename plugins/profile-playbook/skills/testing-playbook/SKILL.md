---
name: testing-playbook
description: |
  This skill should be used when the user asks to "create a test plan",
  "test strategy", "write test cases", "test automation",
  "acceptance testing", "quality assurance", "QA",
  "testing approach", "risk-based testing", "regression testing",
  "performance testing", "test management",
  or mentions testing work. Guides developers and QA
  through testing tasks using SFIA 9 framework with a 5-phase workflow
  (Discover → Plan → Execute → Evaluate → Improve), inline coaching,
  and testing competency assessment.
  Do NOT use for: code-level unit test implementation, CI/CD pipeline setup,
  or infrastructure provisioning.
---

# Testing Playbook v1.0

Guides developers and QA through Testing tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build testing competency from SFIA level 4 (Enable) toward level 5-6.

## Core Principles

1. **Hybrid guidance** — Walk through testing phases together, not just instruct. Recommend approaches, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (test strategies, test plans, defect reports), not just checklists.
5. **Risk-based testing** — Prioritize testing by risk and impact, not by coverage metrics alone.
6. **Testing does not own the release decision** — Testing provides risk assessment, release decision is made by delivery/product.

## Testing Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand test context, requirements, stakeholders, risks | BUSA, REQM, TEST | Test context doc, Risk assessment, Stakeholder map |
| 2 | **Plan** | Design test strategy, select approaches, plan resources | TEST, QUAS, METL | Test strategy, Test plan, Environment requirements |
| 3 | **Execute** | Create and run tests, report defects | TEST, BPTS, PENT | Test cases, Test scripts, Defect reports, Test execution log |
| 4 | **Evaluate** | Analyze results, assess quality, determine readiness | QUAS, BURM, MEAS | Test summary report, Quality assessment, Risk report, Release recommendation |
| 5 | **Improve** | Retrospective, optimize processes, share learnings | METL, QUAS, BPRE | Test retrospective, Process improvement plan, Lessons learned |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/testing-phases.md`.

## Session Management

### Starting a Session

When the user initiates a testing task:

1. Generate session ID: `TEST-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.testing-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: TEST-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  plan: { status: not_started, artifacts: [] }
  execute: { status: not_started, artifacts: [] }
  evaluate: { status: not_started, artifacts: [] }
  improve: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.testing-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── plan/
├── execute/
├── evaluate/
└── improve/
```

### Phase Navigation

- **Skip**: If requirements already exist, skip Discover and start at Plan
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, testing decisions, phase transitions), provide coaching:

```
> **Testing Coach** (TEST L4 → L5)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Testing Competency Assessment

When reviewing a testing document (via `/testing:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for testing work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Functional testing | TEST | Discover, Plan, Execute |
| Quality assurance | QUAS | Plan, Evaluate, Improve |
| User acceptance testing | BPTS | Execute |
| Methods and tools | METL | Plan, Improve |
| User experience evaluation | USEV | Execute, Evaluate |
| Penetration testing | PENT | Execute |
| Risk management | BURM | Discover, Evaluate |
| Specialist advice | TECH | All phases |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Test context document
- Test strategy
- Test plan
- Risk-based test prioritization matrix
- Test case template
- Defect report template
- Test execution log
- Test summary report
- Release readiness recommendation
- Test retrospective template

## Testing Patterns

When selecting testing approaches, consult `references/testing-patterns.md` for common patterns with trade-off analysis:
- Test strategy: Risk-based vs Coverage-based vs Exploratory-first
- Automation: Full automation vs Selective automation vs Manual-first
- Environment: Shared vs Dedicated vs Containerized
- Test data: Production clone vs Synthetic vs Hybrid
- Regression: Full suite vs Risk-based selection vs Change-impact

## Level Progression

Target audience: Dev/QA → Test Analyst/Test Architect (SFIA Level 4), with growth path:

- **Level 4 (Enable)** — Select testing approaches, develop comprehensive test plans, manage automated frameworks, report on test activities
- **Level 5 (Ensure, advise)** — Lead testing efforts, provide authoritative advice on methods, improve efficiency and reliability, contribute to organizational policies
- **Level 6 (Initiate, influence)** — Develop organizational testing policies, lead complex testing initiatives, drive quality culture

## Additional Resources

### Reference Files

- **`references/testing-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for testing-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all testing artifacts
- **`references/assessment-criteria.md`** — Full rubric for testing competency assessment scoring
- **`references/testing-patterns.md`** — Common testing patterns with risk-based trade-off analysis
