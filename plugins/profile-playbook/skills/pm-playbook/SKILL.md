---
name: pm-playbook
description: |
  This skill should be used when the user asks to "create a project plan",
  "project management", "programme management", "portfolio management",
  "risk register", "stakeholder management", "project governance",
  "RAID log", "project charter", "milestone planning",
  "resource planning", "change management", "benefits realization",
  or mentions project delivery work. Guides team leads and coordinators
  through project delivery tasks using SFIA 9 framework with a 5-phase workflow
  (Discover -> Define -> Plan -> Execute -> Close & Learn), inline coaching,
  and project delivery competency assessment.
  Do NOT use for: solution architecture, product roadmap, code implementation,
  or CI/CD pipeline setup.
---

# PM Playbook v1.0

Guides team leads and coordinators through Project Management tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build project delivery competency from SFIA level 4 (Enable) toward level 5-6.

## Core Principles

1. **Hybrid guidance** -- Walk through PM phases together, not just instruct. Recommend approaches, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** -- Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** -- 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** -- Each phase produces concrete deliverables (project charters, RAID logs, status reports), not just checklists.
5. **Governance over control** -- Establish governance frameworks, empower teams to execute within guardrails.
6. **PM does not own the technical solution** -- PM provides constraints and governance, technical decisions are made by the engineering team.

## PM Workflow -- 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand project context, stakeholders, business case | PRMG, RLMT, INVA | Project brief, Stakeholder register, Business case summary |
| 2 | **Define** | Formalize scope, governance, success criteria | PRMG, PROF, BENM | Project charter, Governance framework, Benefits plan, RACI matrix |
| 3 | **Plan** | Create detailed plans, resource allocation, risk management | PRMG, DEMM, FMIT, MEAS | Project plan, Resource plan, Budget, Risk register (RAID), Communication plan |
| 4 | **Execute** | Monitor delivery, manage changes, report progress | PRMG, ISCO, CIPM, RLMT | Status reports, Change requests, Issue log, Milestone tracker |
| 5 | **Close & Learn** | Handover, benefits review, lessons learned | PRMG, BENM, MEAS, METL | Project closure report, Benefits realization report, Lessons learned, Handover document |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/pm-phases.md`.

## Session Management

### Starting a Session

When the user initiates a PM task:

1. Generate session ID: `PM-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.pm-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: PM-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  plan: { status: not_started, artifacts: [] }
  execute: { status: not_started, artifacts: [] }
  close-learn: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.pm-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── plan/
├── execute/
└── close-learn/
```

### Phase Navigation

- **Skip**: If a project charter already exists, skip Discover/Define and start at Plan
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, project decisions, phase transitions), provide coaching:

```
> **PM Coach** (PRMG L4 -> L5)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Project Delivery Competency Assessment

When reviewing a project management document (via `/pm:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for PM work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Project management | PRMG | All phases |
| Portfolio management | POMG | Discover, Define |
| Programme management | PGMG | Discover, Define |
| Portfolio/programme/project support | PROF | Define, Plan |
| Benefits management | BENM | Define, Close & Learn |
| Stakeholder relationship management | RLMT | Discover, Execute |
| Methods and tools | METL | All phases |
| Demand management | DEMM | Plan |
| Information systems coordination | ISCO | Execute |
| Measurement | MEAS | Plan, Close & Learn |
| Organisational change management | CIPM | Execute |
| Investment appraisal | INVA | Discover |
| Financial management | FMIT | Plan |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Project brief
- Project charter
- Stakeholder register
- RACI matrix
- Project plan (WBS)
- Risk register (RAID log)
- Budget/cost plan
- Communication plan
- Status report
- Change request
- Milestone tracker
- Project closure report
- Benefits realization report
- Lessons learned template

## Project Management Patterns

When selecting project management approaches, consult `references/pm-patterns.md` for common patterns with trade-off analysis:
- Methodology: Waterfall vs Agile vs Hybrid
- Governance: Light-touch vs Formal PMO vs Portfolio-level
- Risk management: Qualitative vs Quantitative vs Monte Carlo
- Resource planning: Dedicated vs Shared vs Matrix
- Stakeholder engagement: Inform vs Consult vs Collaborate

## Level Progression

Target audience: Team leads/coordinators -> Project Manager (SFIA Level 4), with growth path:

- **Level 4 (Enable)** -- Define and execute small projects, apply appropriate PM methods, manage risks and stakeholders
- **Level 5 (Ensure, advise)** -- Take full responsibility for medium-scale projects, provide effective leadership, manage change control
- **Level 6 (Initiate, influence)** -- Lead complex projects, adapt PM methods, integrate risk management within governance frameworks

## Additional Resources

### Reference Files

- **`references/pm-phases.md`** -- Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** -- Full SFIA skill descriptions for PM-relevant skills at each level
- **`references/coaching-prompts.md`** -- Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** -- Ready-to-use templates for all PM artifacts
- **`references/assessment-criteria.md`** -- Full rubric for project delivery competency assessment scoring
- **`references/pm-patterns.md`** -- Common project management patterns with trade-off analysis
