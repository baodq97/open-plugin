# Coaching Prompt Templates

Inline coaching templates organized by SFIA skill and level transition. Use these as starting points — adapt to the specific context.

## Format

```
> **SA Coach** ({SKILL_CODE} L{current} → L{target})
> {Observation about what was just done or is about to be done}
> {Actionable tip for performing at the next level}
```

## When to Coach

- After completing a significant artifact
- When a design decision is made
- At phase transitions
- When the user asks "why" about a step

## When NOT to Coach

- Every single step (causes fatigue)
- During routine data entry
- When the user is in flow and didn't ask

---

## Solution Architecture (ARCH)

### L4 → L5

**After identifying trade-offs:**
> **SA Coach** (ARCH L4 → L5)
> Good identification of trade-offs between {X} and {Y}.
> At level 5, go further: provide technical governance on these decisions. Define which trade-offs are acceptable and which violate architectural principles. Document this as a reusable guideline.

**After creating C4 diagrams:**
> **SA Coach** (ARCH L4 → L5)
> The C4 diagrams capture the architecture well.
> At level 5, ensure the tools and methods for architecture development are documented and shared. Lead the preparation of technical plans, not just contribute to them.

**After documenting an ADR:**
> **SA Coach** (ARCH L4 → L5)
> This ADR clearly documents the decision and alternatives.
> At level 5, also evaluate incoming change requests against these decisions. Build a habit of asking: "Does this change align with our architectural standards?"

### L5 → L6

**After architecture review:**
> **SA Coach** (ARCH L5 → L6)
> Strong leadership in developing this architecture.
> At level 6, establish reusable policies and principles for selecting architecture components. Think cross-project: how does this architecture decision affect other initiatives?

---

## Systems Design (DESN)

### L3 → L4

**After following a design pattern:**
> **SA Coach** (DESN L3 → L4)
> Good use of established design patterns.
> At level 4, create multiple design views — one for developers (technical), one for business stakeholders (functional). Each audience has different concerns.

### L4 → L5

**After creating design specifications:**
> **SA Coach** (DESN L4 → L5)
> Solid design specifications with clear trade-off analysis.
> At level 5, ensure the design balances ALL requirements — functional and non-functional. Conduct impact analysis on major design options. Start contributing to organizational design policies and standards.

---

## Requirements Definition (REQM)

### L3 → L4

**After documenting requirements:**
> **SA Coach** (REQM L3 → L4)
> Good requirements documentation with traceability.
> At level 4, actively facilitate stakeholder input — don't wait for requirements to come to you. Provide constructive challenge: "Is this requirement really needed? What happens if we defer it?"

### L4 → L5

**After establishing a requirements baseline:**
> **SA Coach** (REQM L4 → L5)
> Good requirements baseline with stakeholder agreement.
> At level 5, negotiate between stakeholders with competing priorities. Select and adapt requirements methods for the initiative's complexity. Drive prioritization, don't just facilitate it.

---

## Business Situation Analysis (BUSA)

### L3 → L4

**After initial context gathering:**
> **SA Coach** (BUSA L3 → L4)
> Good investigation of the business situation.
> At level 4, adopt a holistic view — look beyond the immediate problem. Conduct root cause analysis: "Why does this problem exist? What systemic factors contribute?"

### L4 → L5

**After stakeholder analysis:**
> **SA Coach** (BUSA L4 → L5)
> Thorough analysis of the business situation with clear recommendations.
> At level 5, advise on the approach itself — which analysis techniques fit this situation? Engage management-level stakeholders, not just operational ones.

---

## Data Management (DATM)

### L3 → L4

**After documenting data requirements:**
> **SA Coach** (DATM L3 → L4)
> Good documentation of data requirements.
> At level 4, think about data governance — who owns this data? How is integrity maintained across multiple sources? Advise on data transformation approaches.

---

## Information Security (SCTY)

### L3 → L4

**After listing security requirements:**
> **SA Coach** (SCTY L3 → L4)
> Good identification of security requirements.
> At level 4, perform security risk and business impact analysis. Don't just list controls — explain WHY each control is needed and what risk it mitigates. Identify risks from the solution architecture itself.

---

## Specialist Advice (TECH)

### L4 → L5

**After providing technical recommendations:**
> **SA Coach** (TECH L4 → L5)
> Strong technical advice in your specialist area.
> At level 5, consolidate expertise from multiple sources — not just your own knowledge. Oversee the provision of specialist advice by others. Influence how strategy translates into operations.

---

## Consultancy (CNSL)

### L4 → L5

**After stakeholder presentation:**
> **SA Coach** (CNSL L4 → L5)
> Good collaboration with stakeholders on this engagement.
> At level 5, take full responsibility for understanding client requirements — including data collection, analysis, and issue resolution. Manage the scope and delivery of the engagement to meet objectives. Ensure the client can fully exploit the proposed solution.

---

## Phase Transition Coaching

### Discover → Define

> **SA Coach** (Phase transition)
> Discovery complete. Key output: {summary of stakeholders and constraints identified}.
> Reflection: Were there any stakeholders you discovered late that changed the picture? Next time, start with a broader stakeholder canvas. Moving to Define — formalize these findings into measurable requirements.

### Define → Design

> **SA Coach** (Phase transition)
> Requirements defined. Key output: {count} functional requirements, {count} NFRs.
> Reflection: Are all NFRs measurable? Vague NFRs like "high availability" become architecture problems later. Moving to Design — translate these requirements into architecture.

### Design → Decide

> **SA Coach** (Phase transition)
> Architecture designed. Key output: {summary of key components and decisions}.
> Reflection: For each major decision, did you document at least 2 alternatives? This is core ARCH L4 competency. Moving to Decide — validate and get buy-in.

### Decide → Deliver

> **SA Coach** (Phase transition)
> Decisions validated. Key output: {count} ADRs, risk assessment complete.
> Reflection: Did you anticipate stakeholder concerns before presenting? At L5, this becomes second nature. Moving to Deliver — the SA provides the dependency map and readiness conditions, while the PO decides the timeline. Keep these two responsibilities clearly separated.

### Session Complete

> **SA Coach** (Session summary)
> SA session complete. Skills practiced:
> {List of SFIA skills and estimated levels demonstrated}
> Top strength: {strongest area}
> Growth opportunity: {area for improvement with specific tip}

---

## YAGNI Coaching

Particularly important coaching — helps the SA avoid over-engineering. Use when the user proposes an overly complex solution.

**When the user proposes a multi-tier solution:**
> **SA Coach** (ARCH L4 — YAGNI)
> This 3-tier solution is technically strong, but ask yourself: "With {X} users and {Y} operators, is this level of complexity truly needed at this point?"
> Tip: Design for separation (clear code boundaries), deploy simply (single path). Document the upgrade path instead of building everything upfront.

**When the user self-challenges "Am I over-engineering this?":**
> **SA Coach** (ARCH L4 → L5)
> Excellent! Challenging your own design is a critical SA mindset. A simple test: "If the scale doesn't change in the next 6 months, would this decision still make sense?" If it only makes sense at scale, simplify for V1.

**When the user proposes a vision beyond V1 scope:**
> **SA Coach** (ARCH L4 → L5)
> Great vision — it demonstrates L5-level architectural thinking. To turn this vision into reality, break it into phases: V1 = the simplest foundation that delivers value. V2+ = expand once you have validation from real users.

---

## SA vs PO Boundary Coaching

Coaching on responsibility boundaries — helps new SAs understand the limits of their scope.

**When the user starts making timeline decisions:**
> **SA Coach** (CNSL L4)
> Note: roadmap timeline is a product decision, not an architecture decision. The SA provides: (1) dependency map — what must be built before what, (2) readiness milestones — conditions for "ready for X", (3) effort estimates. The PO decides: when, what priority, and how much budget.

**When the user asks "What should we build first?":**
> **SA Coach** (ARCH L4)
> Great question! The SA answers based on technical dependencies: "{A} must be built before {B} because {B} depends on {A}." But prioritization between independent tracks (e.g., MCP Connectors vs Knowledge Hub) is a business decision — defer to the PO.

---

## Presentation Coaching

Coaching on presentation skills — an area often overlooked by new SAs.

**When preparing documentation for the IT team:**
> **SA Coach** (METL L4)
> The IT team needs: technical details, trade-offs, complete ADRs, and clear diagrams. Create interactive documentation (HTML) so they can navigate and deep-dive into the areas they care about.

**When preparing slides for leadership:**
> **SA Coach** (CNSL L4 → L5)
> Leadership does not need to know about PostgreSQL or Kubernetes. They need: what is the problem, what is the solution, what are the risks, and what decisions do they need to make. Keep slides under 15, with one key message per slide. End with the questions you need them to answer.

**When the user wants to create output for multiple audiences:**
> **SA Coach** (CNSL L4 → L5)
> Right approach! At L5, the SA must communicate effectively with both technical and business audiences. Same architecture, two narratives: detailed for IT (read thoroughly, review), summarized for leadership (present, decide). This is a critical Consultancy skill.
