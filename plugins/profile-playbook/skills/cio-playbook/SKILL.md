---
name: cio-playbook
description: |
  This skill should be used when the user asks to "define IT strategy",
  "create IT governance", "write an IT roadmap", "do IT leadership planning",
  "IT governance framework", "review my IT strategy", "CIO task",
  "IT portfolio", "IT operating model", "IT investment",
  "digital transformation", "technology strategy", "IT leadership",
  "service management", "IT budget", "vendor management",
  "IT risk", "information management", "IT roadmap",
  or mentions IT leadership or CIO work. Guides IT Directors and Heads of IT
  through IT leadership tasks using SFIA 9 framework with a 5-phase workflow
  (Discover → Strategize → Govern → Transform → Sustain), inline coaching,
  and IT leadership competency assessment.
  Do NOT use for: solution architecture, code implementation,
  project management (use pm-playbook), product management (use po-playbook/cpo-playbook).
---

# CIO Playbook v1.0

Guides IT Directors and Heads of IT through IT Leadership tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build CIO competency from SFIA level 6 (Initiate, influence) toward level 7.

## Core Principles

1. **Hybrid guidance** — Walk through CIO phases together, not just instruct. Recommend frameworks, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (IT strategy documents, governance frameworks, transformation plans), not just checklists.
5. **Strategic enablement** — IT strategy enables business strategy, not the other way around. IT capabilities must align with and accelerate business objectives.
6. **CIO does not own the business strategy** — CIO ensures IT capability aligns with business objectives set by the executive team. The CIO translates business strategy into IT strategy, not the reverse.

## CIO Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Assess current IT landscape, business alignment, pain points | IRMG, SLMO, RLMT | IT landscape assessment, Business-IT alignment analysis, Stakeholder map, Pain point register |
| 2 | **Strategize** | Define IT vision, strategy, investment priorities | ITSP, STPL, FMIT, DEMM | IT strategy document, Investment portfolio, Technology roadmap, Capability gap analysis |
| 3 | **Govern** | Establish governance frameworks, policies, compliance | GOVN, BURM, QUMG, SUPP | IT governance framework, Risk management plan, Quality standards, Vendor management strategy, Policy catalog |
| 4 | **Transform** | Drive transformation initiatives, manage change | ISCO, ITMG, OCDV, DLMG | Transformation program plan, Change management strategy, Operating model design, Capability development plan |
| 5 | **Sustain** | Monitor performance, optimize operations, continuous improvement | SLMO, ITMG, SLEN | IT performance dashboard, Service improvement plan, Operational excellence report, Annual IT review |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/cio-phases.md`.

## Session Management

### Starting a Session

When the user initiates a CIO task:

1. Generate session ID: `CIO-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.cio-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: CIO-{PROJECT}-{YYYYMMDD}-{SEQ}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  strategize: { status: not_started, artifacts: [] }
  govern: { status: not_started, artifacts: [] }
  transform: { status: not_started, artifacts: [] }
  sustain: { status: not_started, artifacts: [] }
coaching_log: []
```

### Workspace Structure

```
.cio-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── strategize/
├── govern/
├── transform/
└── sustain/
```

### Phase Navigation

- **Skip**: If IT landscape is already well-documented, skip Discover and start at Strategize
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, strategic decisions, phase transitions), provide coaching:

```
> **CIO Coach** (ITSP L6 → L7)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## IT Leadership Competency Assessment

When reviewing IT leadership artifacts (via `/cio:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for CIO work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Service level management | SLMO | Discover, Sustain |
| Strategic planning | ITSP | Strategize |
| Information systems coordination | ISCO | Transform |
| Information management | IRMG | Discover |
| Technology service management | ITMG | Transform, Sustain |
| Enterprise and business architecture | STPL | Strategize |
| Governance | GOVN | Govern |
| Stakeholder relationship management | RLMT | Discover |

Secondary skills:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Risk management | BURM | Govern |
| Organisational capability development | OCDV | Transform |
| Financial management | FMIT | Strategize |
| Supplier management | SUPP | Govern |
| Quality management | QUMG | Govern |
| Demand management | DEMM | Strategize |
| Systems development management | DLMG | Transform |
| Systems and software lifecycle engineering | SLEN | Sustain |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- IT landscape assessment
- Business-IT alignment analysis
- IT strategy document
- Investment portfolio
- Technology roadmap (strategic level)
- IT governance framework
- Risk management plan
- Vendor management strategy
- Transformation program plan
- Operating model design
- IT performance dashboard template
- Service improvement plan
- Annual IT review template
- Capability gap analysis

## CIO Patterns

When selecting IT leadership approaches, consult `references/cio-patterns.md` for common patterns with trade-off analysis:
- IT operating model: Centralized vs Federated vs Hybrid
- Sourcing strategy: In-house vs Outsource vs Multi-vendor vs Cloud-first
- IT governance: COBIT vs ITIL vs Custom framework
- Investment approach: CapEx-heavy vs OpEx-first vs Balanced portfolio
- Digital transformation: Big-bang vs Incremental vs Platform-led

## Level Progression

Target audience: IT Director/Head of IT → CIO (SFIA Level 6), with growth path:

- **Level 6 (Initiate, influence)** — Lead IT strategy, establish governance frameworks, manage stakeholder relationships at executive level
- **Level 7 (Set strategy, inspire)** — Direct organizational IT vision, shape industry practice, accountable for enterprise-wide IT outcomes

## Additional Resources

### Reference Files

- **`references/cio-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for CIO-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all CIO artifacts
- **`references/assessment-criteria.md`** — Full rubric for IT leadership competency assessment scoring
- **`references/cio-patterns.md`** — Common IT leadership patterns with trade-off analysis
