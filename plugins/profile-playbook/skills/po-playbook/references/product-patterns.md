# Common Product Management Patterns

Reference guide for evaluating trade-offs during product decisions. Each pattern includes an outcome-first analysis: start simple, iterate when validated.

---

## 1. Prioritization: RICE vs MoSCoW vs Kano vs Value/Effort

### When to choose what

| Criteria | RICE | MoSCoW | Kano | Value/Effort |
|----------|------|--------|------|-------------|
| Best for | Feature comparison with data | Release scoping with stakeholders | Understanding user satisfaction drivers | Quick team alignment |
| Data requirement | High (needs reach/impact estimates) | Low (qualitative) | Medium (needs user surveys) | Low (team estimates) |
| Stakeholder involvement | Low (PO-driven) | High (consensus-based) | Medium (user research) | Medium (team discussion) |
| Best suited for | Mature products with usage data | MVP scoping, compliance-driven releases | Product-market fit exploration | Sprint planning, small backlogs |

### Outcome-first recommendation

**Start with:** Value/Effort matrix — quick, visual, gets the team aligned. Good enough for early-stage products.

**Upgrade path:** When you have usage data → RICE for data-driven decisions. When stakeholders disagree → MoSCoW for explicit trade-offs. When you need to understand delight vs. basic needs → Kano for strategic positioning.

**Trigger to upgrade:** When gut-feel prioritization leads to building low-impact features, or stakeholder conflicts cannot be resolved with a 2x2 matrix.

---

## 2. Roadmap: Now-Next-Later vs Timeline vs Theme-based

### When to choose what

| Criteria | Now-Next-Later | Timeline (Quarterly) | Theme-based |
|----------|---------------|---------------------|-------------|
| Certainty level | Low (startup, new product) | High (mature product, fixed deadlines) | Medium (strategic direction clear) |
| Stakeholder expectation | Flexible, directional | Specific dates and commitments | Strategic alignment |
| Planning horizon | Rolling | Fixed quarters/halves | Mixed |
| Best suited for | Agile teams, startups, R&D | Enterprise sales, compliance deadlines | Portfolio planning, OKR-aligned teams |

### Outcome-first recommendation

**Start with:** Now-Next-Later — communicates priorities without false precision. "Now" is committed, "Next" is planned, "Later" is directional.

**Upgrade path:** When sales/enterprise needs dates → add timeline for committed items only. When multiple teams need coordination → theme-based roadmap for strategic alignment.

**Avoid:** Putting dates on everything too early. A roadmap with dates becomes a deadline list. A roadmap without dates communicates intent.

---

## 3. Discovery: Continuous vs Big-bang vs Dual-track Agile

### When to choose what

| Criteria | Continuous Discovery | Big-bang Discovery | Dual-track Agile |
|----------|--------------------|--------------------|------------------|
| Team size | 1-3 people | 5+ people | 3-5 people |
| Product stage | Existing product, iterating | New product, greenfield | Growing product |
| Research capacity | PO does research | Dedicated researcher/team | Split between discovery and delivery |
| Best suited for | Lean teams, ongoing improvement | Major pivots, new market entry | Teams scaling product-market fit |

### Outcome-first recommendation

**Start with:** Continuous Discovery — weekly user touchpoints (interviews, usability tests, data reviews). Build discovery into the sprint rhythm, not as a separate phase.

**Upgrade path:** When facing a major strategic decision (new market, pivot) → invest in a focused Big-bang Discovery sprint. When team grows → formalize into Dual-track with dedicated discovery capacity.

**Principle:** Discovery is not a phase — it is a habit. Even one user interview per week prevents building the wrong thing.

---

## 4. Delivery: Scrum vs Kanban vs Shape Up

### When to choose what

| Criteria | Scrum | Kanban | Shape Up |
|----------|-------|--------|---------|
| Work predictability | Medium (estimable stories) | Low (interrupts, support) | High (shaped work) |
| Team size | 5-9 people | Any size | Small teams (2-3 people) |
| Planning cadence | Fixed sprints (1-4 weeks) | Continuous flow | 6-week cycles + 2-week cooldown |
| PO involvement | High (sprint planning, review) | Medium (prioritize flow) | High (shaping, betting) |
| Best suited for | Product development teams | Ops, support, maintenance | Autonomous teams, product companies |

### Outcome-first recommendation

**Start with:** Scrum — well-understood, provides ceremony and cadence. Most teams and organizations know it.

**Upgrade path:** When sprint ceremonies feel wasteful for small changes → Kanban for flow optimization. When the team is mature and wants more autonomy → Shape Up for appetite-based delivery.

**Anti-pattern:** Choosing a methodology because it sounds modern. Choose based on how work arrives (planned vs. unplanned) and team maturity (needs structure vs. needs autonomy).

---

## 5. Metrics: North Star vs Pirate Metrics (AARRR) vs HEART

### When to choose what

| Criteria | North Star Metric | Pirate Metrics (AARRR) | HEART |
|----------|------------------|----------------------|-------|
| Focus | Single alignment metric | Full funnel view | User experience quality |
| Complexity | Simple (1 metric + inputs) | Medium (5 categories) | Medium (5 dimensions) |
| Best suited for | Aligning teams around value | Growth-stage products, SaaS | UX-heavy products, platforms |
| Categories | Value delivered to users | Acquisition, Activation, Retention, Revenue, Referral | Happiness, Engagement, Adoption, Retention, Task success |

### Outcome-first recommendation

**Start with:** North Star Metric — one metric that captures the value you deliver. It aligns every team and prevents metric overload.

**Upgrade path:** Once you have a North Star → add Pirate Metrics (AARRR) to understand the full funnel. For UX-heavy products → add HEART framework for experience quality.

**Avoid:** Tracking 50 metrics and analyzing none. Better to track 3 metrics deeply than 50 superficially. "What decision would this metric change?" — if no decision, don't track it.

---

## 6. User Story Mapping

A specialized pattern for breaking down product scope into releasable increments.

### How It Works

```
User Activities (left to right = user journey flow)
        │
        ▼
   User Tasks (steps within each activity)
        │
        ▼
   User Stories (details for each task)
        │
   ─────────── Release 1 line ───────────
        │
   ─────────── Release 2 line ───────────
        │
   ─────────── Release 3 line ───────────
```

### When to Use

- Breaking down a large feature/epic into releasable slices
- Aligning the team on the user journey before writing stories
- Identifying the minimum viable slice (horizontal cut across the map)
- Ensuring each release delivers end-to-end user value, not just backend components

### Trade-offs

| Benefit | Cost |
|---------|------|
| Visualizes user journey holistically | Requires team workshop time |
| Identifies missing steps in the journey | Can become complex for large products |
| Makes MVP scope visible | Needs facilitation skill |
| Ensures each release has end-to-end value | Physical/digital board management |

---

## 7. Build vs Buy vs Partner

### When to choose what

| Criteria | Build | Buy (SaaS/License) | Partner (API/Integration) |
|----------|-------|--------------------|-----------------------|
| Core competency | Yes — this is your differentiation | No — commodity capability | Partial — need their expertise |
| Control needed | Full control required | Configuration sufficient | API contract sufficient |
| Time to market | Slow (weeks-months) | Fast (days-weeks) | Medium (weeks) |
| Long-term cost | High upfront, low marginal | Low upfront, high ongoing | Medium ongoing |
| Risk | Execution risk | Vendor lock-in risk | Integration/dependency risk |

### Outcome-first recommendation

**Start with:** Buy/Partner for non-core capabilities. Build only what differentiates you.

**Upgrade path:** When vendor costs exceed build costs at scale → build in-house. When partner reliability becomes a risk → evaluate insourcing.

**Decision framework:** "If this capability disappeared tomorrow, would our users notice and care?" If yes → build. If no → buy.

---

## General Principles: Outcome-First Product Management

### Questions Before Every Decision

1. **Value test:** "Does this deliver measurable user or business value?"
2. **Simplicity test:** "What is the simplest version that validates the hypothesis?"
3. **Data test:** "Do we have data to support this priority, or is it opinion?"
4. **Reversibility test:** "If this is wrong, how easily can we change course?"

### Pattern

```
Validate the problem → Build the smallest solution → Measure the outcome
     (discovery)           (MVP/experiment)              (metrics)
```

Do not build for assumptions. Build for validated learning.
