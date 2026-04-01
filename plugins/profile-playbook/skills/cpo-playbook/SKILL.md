---
name: cpo-playbook
description: |
  This skill should be used when the user asks about "product strategy",
  "product portfolio", "product vision", "market analysis",
  "competitive analysis", "product-market fit", "product leadership",
  "product organization", "product operations", "product metrics",
  "product governance", "product culture", "product innovation",
  "go-to-market strategy", "portfolio roadmap", "product investment",
  "portfolio prioritization", "product org design", "product OKRs",
  or mentions CPO / VP of Product / Head of Product / product leadership work.
  Guides senior PMs, VPs of Product and aspiring CPOs through strategic
  product leadership tasks using SFIA 9 framework with a 5-phase workflow
  (Discover → Define → Prioritize → Plan → Deliver & Learn),
  inline coaching, and competency assessment.
  Do NOT use for: day-to-day PO backlog management (use po-playbook),
  solution architecture (use sa-playbook),
  IT strategy (use cio-playbook).
---

# CPO Playbook v1.0

Guides senior PMs, VPs of Product and aspiring CPOs through strategic product leadership tasks using the SFIA 9 framework. Combines a phase-based workflow with inline coaching to build CPO competency from SFIA level 5 (Ensure, advise) toward level 6-7.

## Core Principles

1. **Hybrid guidance** — Walk through CPO phases together, not just instruct. Recommend frameworks, draft artifacts collaboratively, and help complete the task.
2. **SFIA-mapped coaching** — Every activity maps to a SFIA skill and level. Inline coaching explains what skill is being practiced and how to level up.
3. **Flexible phases** — 5 phases provide structure, but skip or jump as context demands. No forced quality gates.
4. **Artifacts over theory** — Each phase produces concrete deliverables (portfolio visions, strategy documents, roadmaps), not just checklists.
5. **Market-driven strategy** — Product decisions must be grounded in market research and customer evidence, not assumptions.
6. **CPO does not own the technical architecture** — CPO provides product vision and market direction, technical implementation is owned by the CTO/engineering team.

## CPO Workflow — 5 Phases

| # | Phase | Purpose | Key SFIA Skills | Key Artifacts |
|---|-------|---------|-----------------|---------------|
| 1 | **Discover** | Understand market landscape, competitive position, customer segments | MRCH, BUSA, RLMT | Market landscape analysis, Competitive positioning matrix, Customer segment map, Industry trend report |
| 2 | **Define** | Define product portfolio vision, strategy, success metrics | PROD, ITSP, GOVN | Product portfolio vision, Product strategy document, Portfolio OKRs, Product governance framework |
| 3 | **Prioritize** | Manage product portfolio, allocate investment, make trade-offs | PROD, BUSA, INOV | Portfolio prioritization matrix, Investment allocation plan, Innovation pipeline, Opportunity assessment |
| 4 | **Plan** | Coordinate cross-product roadmaps, align stakeholders, manage dependencies | RLMT, ITSP, ARCH | Portfolio roadmap, Cross-product dependency map, Stakeholder alignment plan, Go-to-market strategy |
| 5 | **Deliver & Learn** | Launch, measure portfolio performance, iterate strategy | PROD, MRCH, TECH | Portfolio performance dashboard, Market feedback synthesis, Strategic retrospective, Strategy refresh |

For detailed phase activities, coaching prompts, and artifact guidance, consult `references/cpo-phases.md`.

## Session Management

### Starting a Session

When the user initiates a CPO task:

1. Generate session ID: `CPO-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name)
2. Create workspace: `.cpo-playbook/sessions/{session_id}/`
3. Initialize `state.yaml` with phase tracking
4. Begin at the appropriate phase (default: Discover)

### State File

```yaml
session_id: CPO-{PROJECT}-{YYYYMMDD}-{SEQ}
workspace: .cpo-playbook/sessions/{session_id}
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
.cpo-playbook/sessions/{session_id}/
├── state.yaml
├── discover/
├── define/
├── prioritize/
├── plan/
└── deliver-learn/
```

### Phase Navigation

- **Skip**: If product portfolio vision already exists, skip Discover/Define and start at Prioritize
- **Jump back**: Return to any previous phase to refine artifacts
- **Resume**: Read `state.yaml` to continue where left off

## Inline Coaching

At key moments (artifact completion, investment decisions, phase transitions), provide coaching:

```
> **CPO Coach** (PROD L5 → L6)
> [Observation about current work]
> [Tip for next-level performance]
```

Coaching guidelines:
- Map each activity to its SFIA skill code and level
- Show what the current level requires AND what the next level looks like
- Coach at meaningful moments, not every step
- Keep coaching concise (2-3 sentences)

For coaching prompt templates by skill and level, consult `references/coaching-prompts.md`.

## Product Leadership Competency Assessment

When reviewing product leadership work (via `/cpo:assess` or during a session):

1. Read the document
2. Evaluate against SFIA criteria for each relevant skill
3. Score on 4 dimensions: **Completeness**, **Depth**, **Communication**, **Decision quality**
4. Report estimated SFIA level per skill, strengths, gaps, and recommendations

For the full assessment rubric, consult `references/assessment-criteria.md`.

## SFIA Skill Reference

The primary SFIA skills for CPO work and their phase mapping:

| Skill | Code | Primary Phases |
|-------|------|---------------|
| Product management | PROD | Define, Prioritize, Deliver & Learn |
| Strategic planning | ITSP | Define, Plan |
| Stakeholder relationship management | RLMT | Discover, Plan, all phases |
| Business situation analysis | BUSA | Discover, Prioritize |
| Market research | MRCH | Discover, Deliver & Learn |
| Innovation management | INOV | Prioritize |
| Emerging technology monitoring | EMRG | Discover, Prioritize |
| Solution architecture | ARCH | Plan |
| Specialist advice | TECH | Deliver & Learn |
| Governance | GOVN | Define |

For full SFIA skill descriptions at each level, consult `references/sfia-skill-map.md`.

## Artifact Templates

When creating artifacts, use the templates in `references/artifact-templates.md`. Templates include:
- Market landscape analysis
- Competitive positioning matrix
- Customer segment map
- Product portfolio vision
- Product strategy document
- Portfolio OKRs
- Product governance framework
- Portfolio prioritization matrix
- Investment allocation plan
- Innovation pipeline
- Portfolio roadmap
- Go-to-market strategy
- Portfolio performance dashboard
- Strategic retrospective template

## CPO Patterns

When selecting product leadership approaches, consult `references/cpo-patterns.md` for common patterns with trade-off analysis:
- Portfolio strategy: Platform-led vs Product-led vs Customer-led
- Innovation model: Core/Adjacent/Transformational vs Horizon model vs Continuous discovery
- Go-to-market: Product-led growth vs Sales-led vs Partner-led vs Community-led
- Organization: Functional vs Product-aligned vs Outcome-aligned vs Matrix
- Metrics: North Star + Input metrics vs OKRs vs Balanced Scorecard

## Level Progression

Target audience: Senior PM/VP of Product → CPO (SFIA Level 6), with growth path:

- **Level 5 (Ensure, advise)** — Manage the full product lifecycle, select and adapt methods, develop product propositions, coordinate launches, lead complex market research
- **Level 6 (Initiate, influence)** — Oversee the product portfolio, create lifecycle management frameworks, champion product management principles, align product objectives with business objectives, initiate new products
- **Level 7 (Set strategy, inspire, mobilise)** — Lead the definition and implementation of strategic management framework, direct creation and review of strategy, lead innovation culture, determine strategic approach to stakeholder management

## Additional Resources

### Reference Files

- **`references/cpo-phases.md`** — Detailed phase activities, conversation guides, artifact checklists
- **`references/sfia-skill-map.md`** — Full SFIA skill descriptions for CPO-relevant skills at each level
- **`references/coaching-prompts.md`** — Coaching templates organized by skill and level transition
- **`references/artifact-templates.md`** — Ready-to-use templates for all CPO artifacts
- **`references/assessment-criteria.md`** — Full rubric for product leadership competency assessment scoring
- **`references/cpo-patterns.md`** — Common product leadership patterns with trade-off analysis
