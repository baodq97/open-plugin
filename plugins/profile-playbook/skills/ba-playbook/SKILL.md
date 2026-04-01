---
name: ba-playbook
description: |
  This skill should be used when the user asks to "analyze business requirements",
  "do business analysis", "create a requirements document", "map business processes",
  "write user stories", "feasibility assessment", "stakeholder analysis",
  "data modelling", "process improvement", "acceptance criteria",
  "business case", "gap analysis", "as-is to-be analysis",
  "business modelling", "requirements elicitation", "impact analysis",
  or mentions business analyst / business analysis work. Guides developers,
  analysts and aspiring BAs through business analysis tasks using SFIA 9
  framework with a 5-phase workflow
  (Discover → Define → Analyze → Design → Deliver & Validate),
  inline coaching, and competency assessment.
  Do NOT use for: solution architecture, infrastructure design,
  product roadmap management, or code-level implementation decisions.
---

# BA Playbook v1.0

Guides developers, analysts and aspiring BAs through Business Analysis tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build BA competency from SFIA level 4 (Enable) toward level 5-6.

## Core Principles

1. **Hybrid guidance** — Walk through BA phases together, not just instruct. Recommend techniques, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (requirements docs, process maps, data models), not just checklists.
5. **Root cause over symptoms** — Always challenge: "Are we solving the right problem?" Investigate root causes before proposing solutions.
6. **BA does not own the solution** — BA provides analysis, options, and recommendations. Solution decisions are made by stakeholders and the delivery team.

## BA Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Investigate business situation, stakeholders, current state | BUSA, RLMT | Stakeholder map, Problem statement, As-is analysis |
| 2 | **Define** | Formalize requirements, scope, feasibility | REQM, FEAS, BSMO | Requirements doc, Business model, Feasibility assessment |
| 3 | **Analyze** | Improve processes, model data, analyze UX | BPRE, DTAN, UNAN | Process maps, Data model, UX analysis |
| 4 | **Design** | Select methods, design solution, define acceptance | METL, BPTS, STPL | Solution options, Acceptance criteria, Methods selection |
| 5 | **Deliver & Validate** | Test, handoff, manage change | BPTS, CNSL, CIPM | Test plan, Handoff package, Change impact assessment |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/ba-phases.md`.

## Session Management

### Starting a Session

When the user initiates a BA task:

1. Generate session ID: `BA-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.ba-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: BA-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  analyze: { status: not_started, artifacts: [] }
  design: { status: not_started, artifacts: [] }
  deliver_validate: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.ba-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── analyze/
├── design/
└── deliver-validate/
```

### Phase Navigation

- **Skip**: If requirements already exist, skip Discover/Define and start at Analyze
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, analysis decisions, phase transitions), provide coaching:

```
> **BA Coach** (REQM L4 → L5)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## BA Competency Assessment

When reviewing BA work (via `/ba:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for BA work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Business situation analysis | BUSA | Discover |
| Feasibility assessment | FEAS | Define |
| Requirements definition | REQM | Define, all phases |
| Methods and tools | METL | Design, all phases |
| Business process improvement | BPRE | Analyze |
| Data modelling and design | DTAN | Analyze |
| Acceptance testing | BPTS | Design, Deliver & Validate |
| User experience analysis | UNAN | Analyze |
| Business modelling | BSMO | Define |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Problem statement
- Stakeholder map
- As-is / To-be analysis
- Requirements document (functional & non-functional)
- Business model canvas
- Feasibility assessment
- Process map (BPMN-style)
- Data model
- UX analysis
- Solution options paper
- Acceptance criteria
- Test plan
- Change impact assessment
- Handoff package
- Benefits realization plan

## BA Patterns

When selecting business analysis approaches, consult `references/ba-patterns.md` for common patterns with trade-off analysis:
- Elicitation: Interviews vs Workshops vs Observation vs Document analysis
- Requirements: User stories vs Use cases vs Shall-statements vs BDD
- Process mapping: BPMN vs Value stream vs Swimlane vs Event-driven
- Analysis: Gap analysis vs Root cause vs SWOT vs Force field
- Prioritization: MoSCoW vs Kano vs Weighted scoring vs Dot voting

## Level Progression

Target audience: Dev/Analyst → BA (SFIA Level 4), with growth path:

- **Level 4 (Enable)** — Investigate business situations, define requirements, conduct feasibility assessments, model data
- **Level 5 (Ensure, advise)** — Lead complex analysis, adapt methods, negotiate stakeholder priorities, establish standards
- **Level 6 (Initiate, influence)** — Define organizational BA frameworks, lead strategic initiatives, champion BA principles

## Additional Resources

### Reference Files

- **`references/ba-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for BA-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all BA artifacts
- **`references/assessment-criteria.md`** — Full rubric for BA competency assessment scoring
- **`references/ba-patterns.md`** — Common business analysis patterns with trade-off analysis
