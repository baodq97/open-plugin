# CTO Patterns — Technology Leadership

Reference guide for evaluating technology leadership approaches. Each pattern includes trade-off analysis to support strategic decision-making.

---

## 1. Platform Strategy: Monolithic vs Microservices vs Composable

### When to choose what

| Criteria | Monolithic Platform | Microservices | Composable Architecture |
|----------|-------------------|---------------|------------------------|
| Team size | 1-20 engineers | 20+ across independent teams | 10+ with platform team |
| System complexity | Low-medium | High, diverse domains | Medium-high, modular |
| Time to market | Fast (single deploy) | Slower (distributed systems overhead) | Medium (reusable components) |
| Scalability ceiling | Medium | High | High |
| Ops complexity | Low | High (requires DevOps maturity) | Medium |
| Best suited for | Startups, single-product companies | Large orgs, diverse tech needs | Product platforms, marketplace models |

### CTO recommendation

**Start with:** Modular monolith — clear domain boundaries in code, single deployment unit.

**Evolve to:** Composable architecture — extract modules into independently deployable components when team scale or performance demands it.

**Trigger to decompose:** Team coordination cost exceeds development velocity gain from independence. Specific components have fundamentally different scaling or deployment requirements.

---

## 2. Innovation: Skunkworks vs Labs vs Embedded vs Hackathons

### When to choose what

| Criteria | Skunkworks | Innovation Labs | Embedded Innovation | Hackathons |
|----------|-----------|----------------|-------------------|-----------|
| Investment | High (dedicated team) | Medium (part-time + budget) | Low (within existing teams) | Low (periodic events) |
| Output quality | High (focused) | Medium-high | Variable | Variable |
| Time to results | Months | Weeks-months | Ongoing | Days |
| Risk of ivory tower | High | Medium | Low | Low |
| Integration path | Difficult (separate codebase) | Medium | Easy (already in production) | Often throwaway |
| Cultural impact | Low (isolated) | Medium | High (normalises innovation) | High (engagement) |

### CTO recommendation

**For most organisations:** Combine embedded innovation (70% of innovation effort) with periodic hackathons (10%) and a small innovation budget for experiments (20%).

**Reserve skunkworks/labs for:** Strategic bets that require dedicated focus and cannot be pursued within the constraints of product teams (e.g., evaluating a fundamentally new technology platform).

**Key principle:** Innovation without a path to production is just R&D theatre. Every innovation initiative must have a defined integration path before it starts.

---

## 3. Engineering Culture: Move Fast vs Stability-First vs Balanced

### When to choose what

| Criteria | Move Fast | Stability-First | Balanced |
|----------|----------|-----------------|---------|
| Stage | Pre-product-market fit | Post-scale, regulated | Growth stage |
| Risk tolerance | High (speed > quality) | Low (quality > speed) | Medium (managed risk) |
| Testing approach | Minimal, ship and fix | Comprehensive, shift-left | Risk-based (critical paths tested) |
| Release cadence | Multiple times daily | Weekly/bi-weekly | Daily |
| Incident tolerance | High (learn fast) | Very low (prevent at all costs) | Medium (bounded blast radius) |
| Technical debt | Accumulates quickly | Managed proactively | Addressed regularly |

### CTO recommendation

**Default to:** Balanced — risk-based quality investment, daily releases, bounded blast radius through feature flags and progressive rollout.

**Key insight:** "Move fast" does not mean "move carelessly." The best engineering cultures move fast on things that don't matter much (UI experiments, feature flags) and move carefully on things that do (data models, security, platform architecture).

**Culture is set by:** What you measure, what you reward, and what you tolerate. Define engineering metrics (DORA metrics are a good start) and make them visible.

---

## 4. Technical Debt: Pay-as-you-go vs Dedicated Sprints vs Rewrite

### When to choose what

| Criteria | Pay-as-you-go | Dedicated Sprints | Full Rewrite |
|----------|--------------|-------------------|-------------|
| Debt severity | Low-medium | Medium-high | Critical (unmaintainable) |
| Impact on velocity | Manageable drag | Significant drag | Blocking progress |
| Risk | Low | Medium | High (second system effect) |
| Team disruption | Minimal | Moderate (context switching) | Major (months of investment) |
| Predictability | Low (opportunistic) | Medium (planned) | Low (unknowns in rewrite) |
| Best for | Cosmetic debt, minor refactors | Systemic debt, framework upgrades | Architecturally bankrupt systems |

### CTO recommendation

**Default strategy:** Allocate 15-20% of engineering capacity to technical debt reduction as part of regular sprints (pay-as-you-go + small dedicated allocation).

**Escalate to dedicated sprints when:** Debt in a specific area is causing measurable velocity impact (e.g., every feature in module X takes 3x longer than expected).

**Consider rewrite only when:** The total cost of maintaining + extending the existing system exceeds the cost of building a replacement, AND you have a clear migration path that does not require a "big bang" cutover.

**Never do:** Rewrite everything at once. Strangler fig pattern — replace components incrementally while the old system continues to serve production.

---

## 5. Build vs Buy: In-House vs COTS vs Open-Source vs SaaS

### When to choose what

| Criteria | Build In-House | COTS | Open-Source | SaaS |
|----------|---------------|------|------------|------|
| Strategic differentiation | Core differentiator | Commodity | Commodity with customisation | Commodity |
| Time to value | Slowest | Medium | Medium | Fastest |
| Total cost (3yr) | Highest (development + maintenance) | Medium (licence + integration) | Low-medium (integration + support) | Medium (subscription) |
| Customisation | Unlimited | Limited by vendor | Unlimited (but you maintain) | Limited by platform |
| Vendor lock-in | None | High | Low | Medium-high |
| Maintenance burden | Full ownership | Vendor handles updates | Community + your team | Vendor handles everything |
| Data sovereignty | Full control | Varies | Full control | Varies (cloud regions) |

### CTO decision framework

**Build when:** The capability is a core differentiator, you have the team to build and maintain it, and no existing solution meets your specific requirements.

**Buy (COTS) when:** The capability is well-served by established vendors, customisation needs are minimal, and the vendor has a strong track record in your industry.

**Adopt open-source when:** Strong community support exists, your team has the skills to contribute and maintain, and you need customisation without vendor lock-in.

**Use SaaS when:** Time to value is critical, the capability is not differentiating, and the vendor's security/compliance meets your requirements.

**Key principle:** Build your moat, buy everything else. If a capability does not create competitive advantage, do not invest engineering time building it.

---

## General Principles: Technology Leadership Decision-Making

### Questions before every strategic technology decision

1. **Business alignment test:** "How does this advance our business strategy or competitive position?"
2. **Capability test:** "Do we have the team, skills, and operational maturity to execute this?"
3. **Reversibility test:** "If this decision is wrong, how difficult and costly is it to reverse?"
4. **Opportunity cost test:** "What are we NOT doing by investing in this?"
5. **Innovation purpose test:** "Are we adopting this because it solves a real problem, or because it's trendy?"

### Pattern

```
Assess the landscape → Define the vision → Build the foundations → Scale what works → Evolve continuously
      (data)              (strategy)          (practices)           (operations)        (adaptation)
```

Technology leadership is not about having the newest technology. It is about having the right technology, at the right time, for the right reasons.
