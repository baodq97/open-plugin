# Coaching Prompt Templates

Inline coaching templates organized by SFIA skill and level transition. Use these as starting points — adapt to the specific context.

## Format

```
> **PO Coach** ({SKILL_CODE} L{current} → L{target})
> {Observation about what was just done or is about to be done}
> {Actionable tip for performing at the next level}
```

## When to Coach

- After completing a significant artifact
- When a prioritization decision is made
- At phase transitions
- When the user asks "why" about a step

## When NOT to Coach

- Every single step (causes fatigue)
- During routine data entry
- When the user is in flow and didn't ask

---

## Product Management (PROD)

### L4 → L5

**After creating a product roadmap:**
> **PO Coach** (PROD L4 → L5)
> Good roadmap with clear phases and deliverables.
> At level 5, go further: adapt the roadmap approach to the product's maturity stage. A new product needs a discovery-focused roadmap; a mature product needs an optimization-focused one. Also develop positioning and variant strategies for different customer segments.

**After writing user stories:**
> **PO Coach** (PROD L4 → L5)
> Well-structured user stories with clear acceptance criteria.
> At level 5, also anticipate how changing customer/user needs will affect these stories over time. Build in mechanisms for early feedback (beta testing, customer interviews) to validate assumptions before committing to full development.

**After backlog prioritization:**
> **PO Coach** (PROD L4 → L5)
> Solid backlog prioritization using {framework}.
> At level 5, select and adapt the prioritization method based on context — RICE works well for feature comparison, but for strategic pivots, consider opportunity scoring or cost of delay. Also create retirement plans for features that no longer deliver value.

### L5 → L6

**After product strategy review:**
> **PO Coach** (PROD L5 → L6)
> Strong product lifecycle management and strategic alignment.
> At level 6, think portfolio: how does this product relate to other products in the organization? Create a product lifecycle management framework that other POs can follow. Champion product management principles across the org, not just within your product.

---

## Delivery Management (DEMG)

### L3 → L4

**After following a delivery process:**
> **PO Coach** (DEMG L3 → L4)
> Good adherence to established delivery methodology.
> At level 4, move from following to leading: establish the team's delivery rhythm, create a collaborative environment, and ensure value is delivered incrementally — not just tasks completed.

### L4 → L5

**After managing a release:**
> **PO Coach** (DEMG L4 → L5)
> Well-managed delivery with clear progress communication.
> At level 5, adapt the delivery approach based on context — not every initiative needs the same methodology. Proactively manage risks and dependencies across multiple teams, not just within your own. Drive continuous improvement of delivery processes organization-wide.

---

## Stakeholder Relationship Management (RLMT)

### L4 → L5

**After creating a stakeholder map:**
> **PO Coach** (RLMT L4 → L5)
> Good stakeholder identification and engagement planning.
> At level 5, develop deeper: identify the communication needs of each stakeholder group, not just their influence level. Become the single point of contact who facilitates decision-making, not just reports progress. Translate engagement strategies into concrete activities.

### L5 → L6

**After stakeholder negotiations:**
> **PO Coach** (RLMT L5 → L6)
> Effective facilitation and communication with stakeholders.
> At level 6, build long-term strategic relationships that transcend individual projects. Lead the development of comprehensive stakeholder management strategies. Negotiate agreements that meet stakeholder needs while maintaining product integrity.

---

## Requirements Definition (REQM)

### L3 → L4

**After documenting requirements:**
> **PO Coach** (REQM L3 → L4)
> Good requirements documentation with clear acceptance criteria.
> At level 4, actively facilitate stakeholder input — don't wait for requirements to come to you. Provide constructive challenge: "Is this requirement truly needed? What user value does it deliver? What happens if we defer it?"

### L4 → L5

**After establishing a product backlog:**
> **PO Coach** (REQM L4 → L5)
> Well-structured backlog with stakeholder agreement.
> At level 5, negotiate between stakeholders with competing priorities — this is the core PO skill. Select and adapt requirements methods for the initiative's complexity. Drive prioritization, don't just facilitate it. Manage scope actively, not reactively.

---

## Business Situation Analysis (BUSA)

### L3 → L4

**After initial market/business analysis:**
> **PO Coach** (BUSA L3 → L4)
> Good investigation of the business situation.
> At level 4, adopt a holistic view — look beyond the immediate problem. Conduct root cause analysis: "Why does this opportunity exist? What systemic factors create this market gap?" Engage operational stakeholders, not just management.

### L4 → L5

**After competitive analysis:**
> **PO Coach** (BUSA L4 → L5)
> Thorough analysis with clear recommendations.
> At level 5, advise on the approach itself — which analysis techniques fit this situation? Engage management-level stakeholders. Gain agreement from stakeholders to conclusions before moving to Define.

---

## Feasibility Assessment (FEAS)

### L4 → L5

**After feasibility evaluation:**
> **PO Coach** (FEAS L4 → L5)
> Good identification of options with cost/benefit analysis.
> At level 5, manage the investigative work itself — don't just assess, but design the assessment process. Collaborate with specialists to get deep technical and business input. Prepare complete business cases that senior stakeholders can use for investment decisions.

---

## Customer Experience (CEXP)

### L4 → L5

**After customer journey mapping:**
> **PO Coach** (CEXP L4 → L5)
> Good customer journey with identified improvement points.
> At level 5, establish frameworks for monitoring and measuring customer experience systematically — not just for individual journeys. Use data-driven insights (NPS, CSAT, CES) to guide improvements. Develop CX strategies with senior stakeholders, not just tactical fixes.

---

## Measurement (MEAS)

### L4 → L5

**After defining success metrics:**
> **PO Coach** (MEAS L4 → L5)
> Good metrics with clear targets and reporting design.
> At level 5, establish measurement objectives at the organizational level, not just per-product. Plan improvements to measurement capability itself. Advise others on effective use of measures. Ensure metrics drive behavior change, not just reporting.

---

## Business Process Improvement (BPRE)

### L4 → L5

**After process analysis:**
> **PO Coach** (BPRE L4 → L5)
> Good process analysis with improvement recommendations.
> At level 5, manage the execution of improvements end-to-end. Assess feasibility of process changes before recommending. Select and tailor improvement methods for the specific context. Contribute to organizational standards for process improvement.

---

## Phase Transition Coaching

### Discover → Define

> **PO Coach** (Phase transition)
> Discovery complete. Key output: {summary of market analysis, personas, problem statement}.
> Reflection: Did you validate your assumptions with real user data, or are they still hypotheses? Next time, plan validation touchpoints during discovery. Moving to Define — translate these findings into a clear vision and measurable success criteria.

### Define → Prioritize

> **PO Coach** (Phase transition)
> Product defined. Key output: vision, value proposition, {count} OKRs.
> Reflection: Are your OKRs truly measurable? "Improve user experience" is not an OKR — "Increase task completion rate from 60% to 80%" is. Moving to Prioritize — turn the vision into a ranked backlog and roadmap.

### Prioritize → Plan

> **PO Coach** (Phase transition)
> Backlog prioritized. Key output: {count} user stories, roadmap with {count} phases.
> Reflection: Did you apply a consistent prioritization framework, or rely on gut feeling? At L5, you should be able to justify every priority decision with data. Moving to Plan — coordinate delivery with engineering and manage stakeholders.

### Plan → Deliver & Learn

> **PO Coach** (Phase transition)
> Plan complete. Key output: release plan, stakeholder map, risk register.
> Reflection: Did you identify contingency plans for your top risks? At L5, risk management is proactive, not reactive. Moving to Deliver & Learn — execute, measure, and iterate.

### Session Complete

> **PO Coach** (Session summary)
> PO session complete. Skills practiced:
> {List of SFIA skills and estimated levels demonstrated}
> Top strength: {strongest area}
> Growth opportunity: {area for improvement with specific tip}

---

## Outcome Over Output Coaching

Particularly important coaching — helps the PO avoid building features nobody needs. Use when the user focuses on feature count over value delivery.

**When the user lists features without user value:**
> **PO Coach** (PROD L4 — Outcome focus)
> This feature list is comprehensive, but ask yourself: "For each feature, what user behavior change do we expect? How will we measure it?"
> Tip: Every feature should have a hypothesis: "We believe {feature} will result in {outcome} for {user segment}. We will know this is true when {metric} changes by {amount}."

**When the user self-challenges "Am I building too much?":**
> **PO Coach** (PROD L4 → L5)
> Excellent! Challenging your own scope is a critical PO skill. A simple test: "If we shipped only 3 of these 10 features, which 3 would deliver 80% of the value?" If you can't answer, you need more user data.

**When the user proposes a vision beyond MVP scope:**
> **PO Coach** (PROD L4 → L5)
> Great vision — it demonstrates strategic product thinking. To turn this vision into reality, define the smallest product that validates the core hypothesis. MVP is not "version 1 with fewer features" — it is "the minimum experiment that tests whether users want this."

---

## PO vs SA/Engineering Boundary Coaching

Coaching on responsibility boundaries — helps new POs understand the limits of their scope.

**When the user starts making technical architecture decisions:**
> **PO Coach** (RLMT L4)
> Note: technical architecture is an engineering/SA decision, not a product decision. The PO provides: (1) business priorities — what matters most, (2) constraints — budget, timeline, compliance, (3) quality requirements — performance, reliability expectations. The engineering team decides: how to build it, what technology to use, and what technical trade-offs to make.

**When the user asks "What technology should we use?":**
> **PO Coach** (PROD L4)
> Great instinct to think holistically! But the PO's role is to define WHAT to build and WHY, not HOW. Instead of choosing technologies, articulate the constraints: "We need to launch in 3 months, handle 1000 concurrent users, and comply with GDPR." Then let the SA/engineering team propose the technical approach.

---

## Communication Coaching

Coaching on stakeholder communication — a core PO competency.

**When presenting the roadmap to engineering:**
> **PO Coach** (RLMT L4)
> Engineering needs: clear priorities, acceptance criteria, dependency context, and "why" behind each priority. Present the roadmap as a conversation, not a mandate. The best POs co-create the plan with engineering, not hand it down.

**When presenting to leadership/investors:**
> **PO Coach** (RLMT L4 → L5)
> Leadership does not need to see every user story. They need: what problem are we solving, what is our strategy, what are the risks, what decisions do they need to make, and what metrics prove we are on track. Keep it concise. End with the decisions you need from them.

**When the user wants to communicate to multiple audiences:**
> **PO Coach** (RLMT L4 → L5)
> Right approach! At L5, the PO must communicate effectively with both technical and business audiences. Same product, two narratives: detailed for engineering (build context), strategic for leadership (invest/decide). This is a critical Stakeholder Relationship Management skill.
