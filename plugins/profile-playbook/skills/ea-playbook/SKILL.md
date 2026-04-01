---
name: ea-playbook
description: |
  This skill should be used when the user asks to "create an enterprise architecture",
  "define a business capability model", "write architecture principles",
  "do enterprise architecture", "build a technology roadmap",
  "architecture governance", "architecture review board",
  "IT strategy", "target architecture", "reference architecture",
  "TOGAF", "architecture standards", "capability model",
  "business architecture", "business capability",
  or mentions enterprise architecture work. Guides solution architects and tech leads
  through EA tasks using SFIA 9 framework with a 5-phase workflow
  (Discover \u2192 Define \u2192 Design \u2192 Govern \u2192 Evolve), inline coaching,
  and architecture assessment.
  Do NOT use for: solution-level design (use sa-playbook), code implementation,
  CI/CD pipeline setup, or project management.
---

# EA Playbook v1.0

Guides solution architects and tech leads through Enterprise Architecture tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build EA competency from SFIA level 5 (Ensure, advise) toward level 6-7.

## Core Principles

1. **Hybrid guidance** — Walk through EA phases together, not just instruct. Recommend frameworks, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (capability models, governance frameworks, technology roadmaps), not just checklists.
5. **Business-IT alignment first** — Every architecture decision must trace to a business capability or strategic objective.
6. **EA does not own the implementation** — EA provides architecture direction and governance, implementation is owned by delivery teams.

## EA Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand business strategy, current state, drivers for change | BUSA, ITSP, RLMT | Business strategy summary, Current state assessment, Stakeholder map, Driver analysis |
| 2 | **Define** | Define architecture vision, principles, capability model | STPL, GOVN, BSMO | Architecture vision, Architecture principles, Business capability model, Target state description |
| 3 | **Design** | Create reference architectures, technology roadmaps, standards | STPL, NTDS, DTAN, SCTY | Reference architecture, Technology roadmap, Data architecture, Security architecture, Integration patterns |
| 4 | **Govern** | Establish governance, compliance, review processes | GOVN, METL | Architecture governance framework, Compliance checklist, Architecture review board charter, Waiver process |
| 5 | **Evolve** | Monitor trends, adapt architecture, continuous improvement | EMRG, INOV, OCDV | Technology radar, Architecture maturity assessment, Innovation pipeline, Capability development plan |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/ea-phases.md`.

## Session Management

### Starting a Session

When the user initiates an EA task:

1. Generate session ID: `EA-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.ea-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: EA-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  design: { status: not_started, artifacts: [] }
  govern: { status: not_started, artifacts: [] }
  evolve: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.ea-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── design/
├── govern/
└── evolve/
```

### Phase Navigation

- **Skip**: If strategy is already documented, skip Discover and start at Define
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, design decisions, phase transitions), provide coaching:

```
> **EA Coach** (STPL L5 \u2192 L6)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Enterprise Architecture Competency Assessment

When reviewing an architecture document (via `/ea:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for EA work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Enterprise and business architecture | STPL | Define, Design, Evolve |
| Methods and tools | METL | All phases |
| Network design | NTDS | Design |
| Strategic planning | ITSP | Discover, Define |
| Governance | GOVN | Define, Govern |
| Requirements definition | REQM | Discover, Define |

Secondary skills:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Data modelling and design | DTAN | Design |
| Data management | DATM | Design |
| Information security | SCTY | Design, Govern |
| Demand management | DEMM | Discover, Govern |
| Information systems coordination | ISCO | Design, Govern |
| Innovation management | INOV | Evolve |
| Emerging technology monitoring | EMRG | Evolve |
| Organizational capability development | OCDV | Evolve |
| Organization design and implementation | ORDI | Define, Govern |
| Consultancy | CNSL | All phases |
| Business process improvement | BPRE | Define, Govern |
| Business situation analysis | BUSA | Discover |
| Feasibility assessment | FEAS | Define, Design |
| Business modelling | BSMO | Define |
| Stakeholder relationship management | RLMT | Discover, Govern |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Business strategy summary
- Current state architecture assessment
- Architecture vision document
- Architecture principles catalog
- Business capability model
- Reference architecture
- Technology roadmap
- Data architecture overview
- Security architecture overview
- Architecture governance framework
- Architecture review board charter
- Technology radar
- Architecture maturity assessment
- Capability development plan

## EA Patterns

When selecting architectural approaches, consult `references/ea-patterns.md` for common patterns with trade-off analysis:
- Architecture framework: TOGAF vs Zachman vs FEAF vs Custom
- Governance model: Centralized vs Federated vs Hybrid
- Integration: Point-to-point vs ESB vs API Gateway vs Event-driven
- Data architecture: Centralized vs Distributed vs Data Mesh
- Cloud strategy: Cloud-first vs Hybrid vs Multi-cloud

## Level Progression

Target audience: Solution Architects/Tech Leads \u2192 Enterprise Architect (SFIA Level 5), with growth path:

- **Level 5 (Ensure, advise)** — Develop models and plans to drive business strategy execution. Contribute to systems capability strategy. Create and maintain roadmaps for architecture and capability improvements.
- **Level 6 (Initiate, influence)** — Develop enterprise-wide architecture and processes for strategic change. Lead systems capability strategy review. Set strategies, policies, standards and practices for compliance between business and technology strategies.
- **Level 7 (Set strategy, inspire, mobilize)** — Direct enterprise-wide architecture development. Direct the creation of enterprise capability strategy. Oversee long-term enterprise transformation and strategic alignment.

## Additional Resources

### Reference Files

- **`references/ea-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for EA-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all EA artifacts
- **`references/assessment-criteria.md`** — Full rubric for architecture assessment scoring
- **`references/ea-patterns.md`** — Common EA patterns with trade-off analysis
