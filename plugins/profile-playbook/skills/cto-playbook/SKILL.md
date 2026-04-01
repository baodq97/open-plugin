---
name: cto-playbook
description: |
  This skill should be used when the user asks to "define a technology vision",
  "create a technology strategy", "write a tech roadmap", "do technology evaluation",
  "build vs buy analysis", "engineering culture", "platform strategy",
  "tech stack assessment", "engineering excellence", "technical debt strategy",
  "R&D strategy", "innovation pipeline", "technology due diligence",
  or mentions technology leadership work. Guides engineering leads and VPs
  through CTO tasks using SFIA 9 framework with a 5-phase workflow
  (Discover → Envision → Build → Scale → Evolve), inline coaching,
  and technology leadership assessment.
  Do NOT use for: IT operations/service management (use cio-playbook),
  solution architecture (use sa-playbook),
  product management (use cpo-playbook).
---

# CTO Playbook v1.0

Guides engineering leads and VPs through Technology Leadership tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build CTO competency from SFIA level 5 (Ensure, advise) toward level 6-7.

## Core Principles

1. **Hybrid guidance** — Walk through CTO phases together, not just instruct. Recommend strategies, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (technology vision, innovation strategy, governance frameworks), not just checklists.
5. **Innovation with purpose** — Evaluate and adopt emerging technologies only when they advance the organisation's competitive position.
6. **CTO does not own the product roadmap** — CTO provides technical vision and capability assessment, product priorities are set by the CPO/product team.

## CTO Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Assess technology landscape, market trends, competitive position | EMRG, ITSP, RLMT | Technology landscape assessment, Market/competitor analysis, Technical debt inventory, Engineering capability assessment |
| 2 | **Envision** | Define technology vision, innovation strategy, platform direction | STPL, ITSP, INOV, TECH | Technology vision document, Innovation strategy, Platform architecture principles, Build vs Buy analysis |
| 3 | **Build** | Establish engineering practices, development standards, team structure | DLMG, GOVN, OCDV | Engineering standards, Development practices guide, Team topology, Technology governance framework |
| 4 | **Scale** | Scale systems, processes, and teams | ITMG, DLMG, SUPP, FMIT | Scaling strategy, Performance benchmarks, Vendor/partner strategy, Technology budget |
| 5 | **Evolve** | Monitor emerging tech, adapt strategy, drive continuous innovation | EMRG, INOV, BURM, TECH | Technology radar, Innovation pipeline, Risk assessment, Strategy refresh document |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/cto-phases.md`.

## Session Management

### Starting a Session

When the user initiates a CTO task:

1. Generate session ID: `CTO-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.cto-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: CTO-{PROJECT}-{YYYYMMDD}-{SEQ}
workspace: .cto-playbook/sessions/{session_id}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  envision: { status: not_started, artifacts: [] }
  build: { status: not_started, artifacts: [] }
  scale: { status: not_started, artifacts: [] }
  evolve: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.cto-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── envision/
├── build/
├── scale/
└── evolve/
```

### Phase Navigation

- **Skip**: If technology landscape is already assessed, skip Discover and start at Envision
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, strategic decisions, phase transitions), provide coaching:

```
> **CTO Coach** (STPL L6 → L7)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Technology Leadership Assessment

When reviewing a technology strategy or leadership output (via `/cto:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for CTO work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Enterprise and business architecture | STPL | Envision, Build |
| Strategic planning | ITSP | Discover, Envision |
| Emerging technology monitoring | EMRG | Discover, Evolve |
| Governance | GOVN | Build, Scale |
| Systems development management | DLMG | Build, Scale |
| Specialist advice | TECH | Envision, Evolve |
| Innovation management | INOV | Envision, Evolve |
| Technology service management | ITMG | Scale |
| Stakeholder relationship management | RLMT | Discover, All phases |
| Organisational capability development | OCDV | Build |
| Risk management | BURM | Evolve |
| Supplier management | SUPP | Scale |
| Information systems coordination | ISCO | Envision, Build |
| Financial management | FMIT | Scale |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Technology landscape assessment
- Technical debt inventory
- Technology vision document
- Innovation strategy
- Platform architecture principles
- Build vs Buy decision matrix
- Engineering standards document
- Development practices guide
- Team topology design
- Technology governance framework
- Scaling strategy
- Technology radar
- Innovation pipeline tracker
- Technology budget template

## CTO Patterns

When selecting technology leadership approaches, consult `references/cto-patterns.md` for common patterns with trade-off analysis:
- Platform strategy: Monolithic platform vs Microservices vs Composable architecture
- Innovation: Skunkworks vs Labs vs Embedded innovation vs Hackathons
- Engineering culture: Move fast vs Stability-first vs Balanced
- Technical debt: Pay-as-you-go vs Dedicated sprints vs Rewrite
- Build vs Buy: In-house vs COTS vs Open-source vs SaaS

## Level Progression

Target audience: Engineering leads/VPs → CTO (SFIA Level 6), with growth path:

- **Level 5 (Ensure, advise)** — Lead technology initiatives, provide authoritative guidance, ensure standards
- **Level 6 (Initiate, influence)** — Establish policies, shape strategy, manage cross-organisational technology direction
- **Level 7 (Set strategy, inspire, mobilise)** — Define organisational vision, direct enterprise-wide technology transformation

## Additional Resources

### Reference Files

- **`references/cto-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for CTO-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all CTO artifacts
- **`references/assessment-criteria.md`** — Full rubric for technology leadership assessment scoring
- **`references/cto-patterns.md`** — Common technology leadership patterns with trade-off analysis
