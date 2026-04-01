---
name: po-playbook
description: |
  This skill should be used when the user asks to "create a product roadmap",
  "prioritize the backlog", "define product vision", "write user stories",
  "do product management", "product strategy", "release planning",
  "stakeholder management", "feasibility assessment", "customer journey",
  "product metrics", "OKRs", "value proposition", "sprint planning",
  "backlog grooming", "backlog refinement", "product discovery",
  or mentions product owner / product management work. Guides developers,
  PMs and aspiring POs through product management tasks using SFIA 9
  framework with a 5-phase workflow
  (Discover → Define → Prioritize → Plan → Deliver & Learn),
  inline coaching, and competency assessment.
  Do NOT use for: solution architecture, infrastructure design,
  CI/CD pipeline setup, or code-level implementation decisions.
---

# PO Playbook v1.0

Guides developers, product managers and aspiring POs through Product Owner tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build PO competency from SFIA level 4 (Enable) toward level 5-6.

## Core Principles

1. **Hybrid guidance** — Walk through PO phases together, not just instruct. Recommend frameworks, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (vision docs, roadmaps, backlogs), not just checklists.
5. **Outcome over output** — Always challenge: "Does this feature deliver measurable user/business value?" Focus on outcomes, not feature count.
6. **PO does not own architecture** — PO provides business priorities, timeline, and budget. Technical dependency decisions are made by the SA/engineering team.

## PO Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand market, users, business context | BUSA, MRCH, URCH | Market analysis, User personas, Problem statement |
| 2 | **Define** | Formalize vision, strategy, success metrics | PROD, CEXP, FEAS | Product vision, Value proposition, Success metrics |
| 3 | **Prioritize** | Manage backlog, create roadmap, make trade-offs | PROD, REQM, DEMM | Product backlog, Roadmap, Prioritization matrix |
| 4 | **Plan** | Coordinate delivery, manage stakeholders, mitigate risk | DEMG, RLMT, BURM | Release plan, Stakeholder map, Risk register |
| 5 | **Deliver & Learn** | Launch, measure, iterate, improve | MEAS, BPRE, RELM | Launch checklist, Metrics dashboard, Retrospective |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/po-phases.md`.

## Session Management

### Starting a Session

When the user initiates a PO task:

1. Generate session ID: `PO-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.po-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: PO-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  prioritize: { status: not_started, artifacts: [] }
  plan: { status: not_started, artifacts: [] }
  deliver_learn: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.po-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── prioritize/
├── plan/
└── deliver-learn/
```

### Phase Navigation

- **Skip**: If product vision already exists, skip Discover/Define and start at Prioritize
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, prioritization decisions, phase transitions), provide coaching:

```
> **PO Coach** (PROD L4 → L5)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Product Competency Assessment

When reviewing product work (via `/po:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for PO work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Product management | PROD | Define, Prioritize |
| Delivery management | DEMG | Plan, Deliver & Learn |
| Stakeholder relationship management | RLMT | Plan, all phases |
| Requirements definition | REQM | Prioritize, Define |
| Business situation analysis | BUSA | Discover |
| Feasibility assessment | FEAS | Define, Prioritize |
| Customer experience | CEXP | Define, Discover |
| Measurement | MEAS | Deliver & Learn |
| Business process improvement | BPRE | Deliver & Learn |
| Innovation management | INOV | Define, Discover |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Product vision document
- Value proposition canvas
- User persona
- Product roadmap
- Prioritization matrix (RICE, MoSCoW, Value vs Effort)
- Product backlog (user stories, acceptance criteria)
- Release plan
- Stakeholder map
- Risk register
- OKR framework
- Launch checklist
- Metrics dashboard template
- Retrospective template

## Product Patterns

When selecting product management approaches, consult `references/product-patterns.md` for common patterns with trade-off analysis:
- Prioritization: RICE vs MoSCoW vs Kano vs Value/Effort
- Roadmap: Now-Next-Later vs Timeline vs Theme-based
- Discovery: Continuous vs Big-bang vs Dual-track Agile
- Delivery: Scrum vs Kanban vs Shape Up
- Metrics: North Star vs Pirate Metrics (AARRR) vs HEART

## Level Progression

Target audience: Dev/PM → PO (SFIA Level 4), with growth path:

- **Level 4 (Enable)** — Manage product backlog, prioritize requirements, coordinate delivery for small-medium products
- **Level 5 (Ensure, advise)** — Lead full product lifecycle, adapt methods, negotiate stakeholder priorities, drive strategy
- **Level 6 (Initiate, influence)** — Oversee product portfolio, establish frameworks, champion product culture

## Additional Resources

### Reference Files

- **`references/po-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for PO-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all PO artifacts
- **`references/assessment-criteria.md`** — Full rubric for product competency assessment scoring
- **`references/product-patterns.md`** — Common product management patterns with trade-off analysis
