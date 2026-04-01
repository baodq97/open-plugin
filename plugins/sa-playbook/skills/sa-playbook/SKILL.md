---
name: sa-playbook
description: |
  This skill should be used when the user asks to "design a system",
  "create an architecture", "write an ADR", "do solution architecture",
  "architect a solution", "review my architecture", "SA task",
  "stakeholder analysis", "trade-off analysis", "C4 diagram",
  "non-functional requirements", "NFR", "architecture decision record",
  or mentions solution architecture work. Guides developers and tech leads
  through SA tasks using SFIA 9 framework with a 5-phase workflow
  (Discover → Define → Design → Decide → Deliver), inline coaching,
  and architecture assessment.
  Do NOT use for: code-level design patterns, CI/CD pipeline setup,
  or infrastructure provisioning (Terraform/Pulumi).
---

# SA Playbook v1.0

Guides developers and tech leads through Solution Architecture tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build SA competency from SFIA level 4 (Enable) toward level 5-6.

## Core Principles

1. **Hybrid guidance** — Walk through SA phases together, not just instruct. Recommend patterns, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (stakeholder maps, ADRs, C4 diagrams), not just checklists.
5. **YAGNI first** — Always challenge: "Is this truly needed at the current scale?" Design for separation, deploy simply. Avoid over-engineering.
6. **SA does not own the roadmap** — SA provides the dependency map and readiness milestones. Timeline decisions are made by the PO based on business priorities.

## SA Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand context, stakeholders, constraints | BUSA, REQM | Stakeholder map, Context doc |
| 2 | **Define** | Formalize requirements, NFRs, boundaries | REQM, DATM, SCTY | Requirements doc, NFR matrix |
| 3 | **Design** | Create architecture, evaluate trade-offs | ARCH, DESN, NTDS, DBDS, DTAN | C4 diagrams, Component specs, Trade-offs |
| 4 | **Decide** | Validate decisions, get buy-in | TECH, CNSL, ARCH | ADRs, Risk assessment |
| 5 | **Deliver** | Document, communicate, handoff | ARCH, METL | Architecture doc, Dependency map, Milestones, Presentation |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/sa-phases.md`.

## Session Management

### Starting a Session

When the user initiates an SA task:

1. Generate session ID: `SA-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.sa-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: SA-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  design: { status: not_started, artifacts: [] }
  decide: { status: not_started, artifacts: [] }
  deliver: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.sa-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── design/
│   └── adrs/
├── decide/
└── deliver/
```

### Phase Navigation

- **Skip**: If requirements already exist, skip Discover/Define and start at Design
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, design decisions, phase transitions), provide coaching:

```
> **SA Coach** (ARCH L4 → L5)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Architecture Assessment

When reviewing an architecture document (via `/sa:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for SA work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Solution architecture | ARCH | Design, Decide, Deliver |
| Systems design | DESN | Design |
| Requirements definition | REQM | Discover, Define |
| Data management | DATM | Define, Design |
| Data modelling and design | DTAN | Design |
| Network design | NTDS | Design |
| Database design | DBDS | Design |
| Specialist advice | TECH | Decide |
| Methods and tools | METL | All phases |
| Business situation analysis | BUSA | Discover |
| Information security | SCTY | Define, Decide |
| Consultancy | CNSL | Decide, Deliver |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Stakeholder map
- Context document
- NFR matrix
- C4 diagram descriptions
- Architecture Decision Record (ADR)
- Trade-off analysis
- Technical dependency map
- Architecture readiness milestones
- PO decision matrix
- Architecture document (final)

## Architecture Patterns

When selecting architectural approaches, consult `references/architecture-patterns.md` for common patterns with trade-off analysis:
- Deployment: Monolith vs Microservices vs Hybrid
- Data isolation: RLS vs Schema vs Dedicated DB
- Knowledge management: Clone vs Reference vs Real-time sync
- Access control: Restricted vs Open with guardrails
- Config storage: Filesystem vs DB vs Hybrid

## Level Progression

Target audience: Dev/Tech Lead → SA (SFIA Level 4), with growth path:

- **Level 4 (Enable)** — Contribute to architecture, identify trade-offs, document decisions
- **Level 5 (Ensure, advise)** — Lead architecture development, provide governance, ensure standards
- **Level 6 (Initiate, influence)** — Establish policies, manage cross-project architecture

## Additional Resources

### Reference Files

- **`references/sa-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for SA-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all SA artifacts (including dependency map, milestones, PO matrix)
- **`references/assessment-criteria.md`** — Full rubric for architecture assessment scoring
- **`references/architecture-patterns.md`** — Common architectural patterns with YAGNI-first trade-off analysis
