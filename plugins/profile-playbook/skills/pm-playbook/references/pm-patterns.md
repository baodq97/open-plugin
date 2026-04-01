# Common Project Management Patterns

Reference guide for evaluating trade-offs during the Plan and Define phases. Each pattern includes context-appropriate guidance.

---

## 1. Methodology: Waterfall vs Agile vs Hybrid

### When to choose what

| Criteria | Waterfall | Agile | Hybrid |
|----------|-----------|-------|--------|
| Requirements clarity | Well-defined, stable | Evolving, uncertain | Core stable, details uncertain |
| Regulatory needs | High compliance (audit trail) | Low compliance | Mixed |
| Team experience | Traditional PM culture | Agile-mature teams | Mixed capability |
| Stakeholder involvement | Limited availability | Highly available | Partially available |
| Delivery cadence | Single delivery at end | Iterative increments | Phased with iterations |
| Best suited for | Infrastructure, compliance, construction | Product development, software | Most enterprise projects |

### Recommendation

**Default:** Hybrid -- use Waterfall for governance milestones, Agile for delivery within phases. Most real-world projects are neither pure Waterfall nor pure Agile.

**Key principle:** Choose methodology based on context, not ideology. At SFIA Level 5+, you should be adapting methods to the project, not forcing the project into a methodology.

---

## 2. Governance: Light-touch vs Formal PMO vs Portfolio-level

### When to choose what

| Criteria | Light-touch | Formal PMO | Portfolio-level |
|----------|------------|-----------|----------------|
| Project budget | < $100k | $100k - $1M | > $1M or multi-project |
| Team size | 1-5 people | 5-20 people | 20+ people or multiple teams |
| Duration | < 3 months | 3-12 months | > 12 months |
| Risk level | Low | Medium-High | High, cross-organizational |
| Reporting frequency | Monthly | Bi-weekly | Weekly |
| Approval gates | Informal | Defined stage gates | Formal gates with steering committee |

### Recommendation

**Principle:** Governance should be proportional to complexity. Over-governance slows teams down; under-governance creates risk. The PM's job is to find the right balance.

**Start with:** Light-touch + clear escalation paths. Add governance layers only when complexity demands it.

**Anti-pattern:** Creating heavy governance for small projects to "look professional" -- this signals L3, not L4.

---

## 3. Risk Management: Qualitative vs Quantitative vs Monte Carlo

### When to choose what

| Criteria | Qualitative | Quantitative | Monte Carlo |
|----------|------------|-------------|-------------|
| Project scale | Any | Medium-Large | Large, complex |
| Data availability | Limited | Historical data available | Rich historical data |
| Stakeholder needs | General awareness | Specific probability ranges | Statistical confidence levels |
| PM skill required | L4 | L5 | L5-L6 |
| Time to perform | Hours | Days | Days-weeks |
| Best suited for | Most projects | Budget/schedule confidence | Major investments, regulatory |

### Recommendation

**Default:** Qualitative risk assessment (H/M/L) with RAID log. This is sufficient for the vast majority of projects.

**When to upgrade:** If the steering committee needs statistical confidence in budget/schedule estimates, use quantitative analysis. If major investment decisions depend on risk analysis, consider Monte Carlo simulation.

**Key principle:** The goal of risk management is to make better decisions, not to produce impressive reports. A well-maintained RAID log that drives action beats an elaborate risk model that sits on a shelf.

---

## 4. Resource Planning: Dedicated vs Shared vs Matrix

### When to choose what

| Criteria | Dedicated Team | Shared Resources | Matrix Organization |
|----------|---------------|-----------------|-------------------|
| Team commitment | 100% allocation | Part-time, multi-project | Part-time with functional manager |
| PM control | Full | Limited | Negotiated |
| Resource availability | High, but expensive | Variable | Variable |
| Communication overhead | Low | Medium | High |
| Best suited for | High-priority, time-critical | BAU improvements, small projects | Enterprise-wide, ongoing |
| Risk | Key person dependency | Priority conflicts | Unclear accountability |

### Recommendation

**Default:** Matrix with clear RACI. Most organizations operate in a matrix; the PM needs to negotiate for resources, not assume them.

**Key principle:** Resource planning is about capacity management, not headcount. For each resource: what percentage of their time do you need? When do you need them? What skills must they have? What happens if they're unavailable?

**Anti-pattern:** Planning with 100% allocation when resources are shared across projects -- always plan for realistic availability (typically 60-80% for project work).

---

## 5. Stakeholder Engagement: Inform vs Consult vs Collaborate

### When to choose what

| Criteria | Inform | Consult | Collaborate |
|----------|--------|---------|-------------|
| Stakeholder influence | Low | Medium | High |
| Stakeholder interest | Low-Medium | Medium-High | High |
| Engagement effort | Low | Medium | High |
| Communication style | One-way (reports, emails) | Two-way (surveys, reviews) | Joint decision-making |
| When to use | Large stakeholder groups, general updates | Technical reviewers, impacted teams | Sponsors, key decision-makers |

### Recommendation

**Map stakeholders to engagement levels using the Influence/Interest grid:**

```
High Influence + High Interest  = Collaborate (Manage closely)
High Influence + Low Interest   = Consult (Keep satisfied)
Low Influence  + High Interest  = Consult (Keep informed)
Low Influence  + Low Interest   = Inform (Monitor)
```

**Key principle:** Not all stakeholders need the same level of engagement. Over-engaging low-influence stakeholders wastes time; under-engaging high-influence stakeholders creates risk.

**Anti-pattern:** Treating all stakeholders the same -- sending everyone the same report at the same frequency.

---

## General Principles: Governance over Control

### PM Scope vs Team Scope

The PM provides:
1. **Constraints** -- budget, timeline, quality standards, compliance requirements
2. **Governance** -- decision-making authority, escalation paths, reporting cadence
3. **Coordination** -- cross-team dependencies, stakeholder communication, change management
4. **Risk management** -- identify, assess, mitigate, escalate

The PM does NOT:
1. **Own the technical solution** -- engineering team decides architecture, technology, implementation
2. **Own the product roadmap** -- PO decides features, priorities, market fit
3. **Micromanage tasks** -- team leads manage day-to-day work within agreed guardrails

### Questions before every governance decision

1. **Proportionality test:** "Is this governance measure proportional to the project's complexity and risk?"
2. **Value test:** "Does this process help the team deliver, or does it slow them down?"
3. **Accountability test:** "Is it clear who is accountable for this decision?"
4. **Escalation test:** "Do people know when and how to escalate?"

### Pattern

```
Establish governance -> Empower teams within guardrails -> Monitor and adjust
   (PM scope)              (Team scope)                     (PM scope)
```

The best project managers create the conditions for success, then get out of the way.
