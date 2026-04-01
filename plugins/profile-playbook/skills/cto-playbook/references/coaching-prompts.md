# Coaching Prompt Templates

Inline coaching templates organized by SFIA skill and level transition. Use these as starting points — adapt to the specific context.

## Format

```
> **CTO Coach** ({SKILL_CODE} L{current} → L{target})
> {Observation about what was just done or is about to be done}
> {Actionable tip for performing at the next level}
```

## When to Coach

- After completing a significant artifact
- When a strategic decision is made
- At phase transitions
- When the user asks "why" about a step

## When NOT to Coach

- Every single step (causes fatigue)
- During routine data entry
- When the user is in flow and didn't ask

---

## Enterprise and Business Architecture (STPL)

### L5 → L6

**After developing technology-business alignment:**
> **CTO Coach** (STPL L5 → L6)
> Good alignment of technology roadmap with business strategy.
> At level 6, go further: develop enterprise-wide architecture processes that embed strategic change management. Lead the creation of a systems capability strategy with stakeholder buy-in. Set policies and standards to ensure compliance between business and technology strategies.

**After creating roadmaps:**
> **CTO Coach** (STPL L5 → L6)
> The roadmap captures key initiatives and dependencies well.
> At level 6, develop business cases for approval, funding and prioritization. Capture and prioritize market and environmental trends alongside business objectives. Identify alternative strategies, not just a single path.

### L6 → L7

**After establishing enterprise architecture:**
> **CTO Coach** (STPL L6 → L7)
> Strong enterprise-wide architecture with clear alignment to business strategy.
> At level 7, direct the development of enterprise capability strategy to support the entire organisation's strategic requirements. Oversee long-term enterprise transformation and strategic alignment across all business units.

---

## Strategic Planning (ITSP)

### L5 → L6

**After contributing to strategy development:**
> **CTO Coach** (ITSP L5 → L6)
> Good contribution to the strategic planning process.
> At level 6, set policies and standards for how the organisation conducts strategy development. Lead and manage the creation of strategy that meets business requirements. Embed strategic management in operational management.

### L6 → L7

**After leading strategy creation:**
> **CTO Coach** (ITSP L6 → L7)
> Strong leadership in strategy development and planning.
> At level 7, lead the definition, implementation and communication of the organisation's strategic management framework. Direct the creation and review of strategy at the highest organisational level.

---

## Emerging Technology Monitoring (EMRG)

### L4 → L5

**After initial technology scanning:**
> **CTO Coach** (EMRG L4 → L5)
> Good contribution to technology monitoring.
> At level 5, take ownership of monitoring the external environment. Proactively assess and document impacts, threats and opportunities. Create technology roadmaps and share knowledge across the organisation.

### L5 → L6

**After creating technology radar:**
> **CTO Coach** (EMRG L5 → L6)
> Solid technology radar with clear assessment of impacts.
> At level 6, plan and lead the identification and assessment process across the organisation. Create technology roadmaps that align organisational plans with emerging solutions. Engage and influence stakeholders to obtain commitment to technology roadmaps. Develop organisational guidelines for monitoring emerging technologies.

---

## Governance (GOVN)

### L6 → L7

**After implementing governance framework:**
> **CTO Coach** (GOVN L6 → L7)
> Strong governance framework with clear decision rights and accountability.
> At level 7, direct the definition, implementation and monitoring of the governance framework across the organisation. Integrate risk management into the framework, aligning with strategic objectives and risk appetite. Provide assurance to stakeholders that the organisation can deliver its obligations.

---

## Systems Development Management (DLMG)

### L5 → L6

**After establishing development practices:**
> **CTO Coach** (DLMG L5 → L6)
> Good planning and management of systems development work.
> At level 6, set policy and drive adherence to standards across the organisation. Lead activities to make security and privacy integral to systems development. Ensure technical, financial and quality targets are met consistently.

### L6 → L7

**After setting development policies:**
> **CTO Coach** (DLMG L6 → L7)
> Strong policies and standards for systems development.
> At level 7, direct the continual improvement of the organisation's development management framework. Align systems development to business strategies and emerging technology opportunities. Authorise the structure of development functions and the allocation of resources for development programs.

---

## Specialist Advice (TECH)

### L5 → L6

**After providing technical recommendations:**
> **CTO Coach** (TECH L5 → L6)
> Strong professional advice that influences strategy-to-operations translation.
> At level 6, lead the development and application of specialist knowledge across the organisation. Maintain a network of recognised experts. Actively influence professional development planning to further the development of appropriate expertise.

---

## Innovation Management (INOV)

### L5 → L6

**After managing innovation pipeline:**
> **CTO Coach** (INOV L5 → L6)
> Good management of the innovation pipeline and processes.
> At level 6, obtain organisational commitment to innovation. Develop organisational capabilities to drive innovation systematically. Lead the implementation of innovation processes, tools and frameworks across the organisation.

### L6 → L7

**After developing innovation capabilities:**
> **CTO Coach** (INOV L6 → L7)
> Strong innovation capabilities with organisational commitment.
> At level 7, lead the development of a culture that encourages innovation, risk-taking and collaboration. Embed innovation processes throughout business units. Align organisational and individual objectives, measures and rewards with innovation.

---

## Phase Transition Coaching

### Discover → Envision

> **CTO Coach** (Phase transition)
> Discovery complete. Key output: {summary of landscape and capabilities assessed}.
> Reflection: Did you quantify technical debt in business terms (velocity impact, risk exposure)? Next time, ensure every technology assessment connects to a business outcome. Moving to Envision — define the technology vision that addresses the gaps and opportunities identified.

### Envision → Build

> **CTO Coach** (Phase transition)
> Vision defined. Key output: {summary of vision, principles, and strategic decisions}.
> Reflection: Is the technology vision actionable? Aspirational visions without concrete principles become shelfware. Moving to Build — establish the practices and structures to realise the vision.

### Build → Scale

> **CTO Coach** (Phase transition)
> Foundations established. Key output: {summary of standards, team structure, governance}.
> Reflection: Did you validate these standards with the engineering teams who will follow them? Standards imposed without team buy-in fail. Moving to Scale — extend these foundations to support growing demands.

### Scale → Evolve

> **CTO Coach** (Phase transition)
> Scaling in progress. Key output: {summary of scaling strategy, vendor relationships, budget}.
> Reflection: Are you measuring the right things? Operational metrics (uptime, velocity) matter, but so do strategic metrics (innovation ratio, talent retention). Moving to Evolve — ensure the technology strategy adapts to changing conditions.

### Session Complete

> **CTO Coach** (Session summary)
> CTO session complete. Skills practiced:
> {List of SFIA skills and estimated levels demonstrated}
> Top strength: {strongest area}
> Growth opportunity: {area for improvement with specific tip}

---

## Innovation with Purpose Coaching

Particularly important coaching — helps the CTO avoid technology adoption for its own sake. Use when the user proposes adopting a technology without clear business alignment.

**When the user proposes adopting a trendy technology:**
> **CTO Coach** (EMRG L5 — Innovation with purpose)
> This technology is generating significant market interest, but ask yourself: "How does adopting {X} advance our competitive position or reduce a meaningful risk?"
> Tip: Every technology adoption should pass the purpose test: clear business value, feasible integration path, and team capability to support it. Document this in a Build vs Buy analysis.

**When the user self-challenges "Are we chasing trends?":**
> **CTO Coach** (EMRG L5 → L6)
> Excellent! This critical questioning is a hallmark of mature technology leadership. A simple test: "If our competitors adopt this and we don't, what happens? If we adopt this and they don't, what advantage do we gain?"

**When the user proposes a large-scale technology transformation:**
> **CTO Coach** (STPL L6 → L7)
> Strong vision — it demonstrates strategic-level architectural thinking. To make this transformation succeed, break it into phases: Phase 1 = prove value with a focused pilot. Phase 2+ = expand based on measurable results from the pilot.

---

## CTO vs CPO Boundary Coaching

Coaching on responsibility boundaries — helps technology leaders understand the limits of their scope.

**When the user starts making product priority decisions:**
> **CTO Coach** (RLMT L5)
> Note: product roadmap priorities are a product decision, not a technology decision. The CTO provides: (1) technology capability assessment — what is feasible and at what cost, (2) technical vision — where the platform should evolve, (3) technical debt impact — how debt affects product velocity. The CPO/product team decides: what to build, in what order, and why.

**When the user asks "What features should we build next?":**
> **CTO Coach** (STPL L6)
> The CTO answers based on technology capability and readiness: "Our platform can support {X} today; {Y} requires infrastructure investment first." But prioritisation of features is a business and product decision — defer to the CPO/product team.

---

## Board Communication Coaching

Coaching on executive communication — a critical skill for CTOs.

**When preparing a technology update for the board:**
> **CTO Coach** (RLMT L6 → L7)
> The board does not need to know about Kubernetes or microservices. They need: what is the technology investment delivering, what are the risks, what decisions do they need to make. Frame everything in terms of business outcomes, competitive advantage, and risk exposure.

**When the user wants to communicate technology strategy to multiple audiences:**
> **CTO Coach** (RLMT L6 → L7)
> Right approach! At L7, the CTO must communicate effectively with the board, C-suite peers, and engineering teams. Same strategy, three narratives: strategic for the board (outcomes and risks), collaborative for C-suite (alignment and trade-offs), actionable for engineering (vision and standards). This is a critical stakeholder management skill.
