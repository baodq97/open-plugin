# Common CIO Patterns

Reference guide for evaluating trade-offs during the Strategize and Govern phases. Each pattern includes contextual guidance to help select the right approach.

---

## 1. IT Operating Model: Centralised vs Federated vs Hybrid

### When to choose what

| Criteria | Centralised | Federated | Hybrid |
|----------|------------|-----------|--------|
| Organisation size | Small-medium (< 500 employees) | Large, diverse business units | Medium-large with shared + specialist needs |
| Business unit autonomy | Low — uniform processes | High — distinct business models | Mixed — shared core, distinct edge |
| Cost efficiency | High — economies of scale | Low — duplicated capabilities | Medium — shared services + flexibility |
| Speed of delivery | Slow — central queue | Fast — local control | Medium — shared platform, local customisation |
| Governance control | Strong | Weak (risk of shadow IT) | Balanced |
| Best suited for | Consistent standards, cost control | Diverse business needs, innovation | Most enterprise organisations |

### Recommendation

**Default to:** Hybrid — centralise platform capabilities (infrastructure, security, data), federate application delivery to business units.

**Key principle:** Centralise what benefits from scale and consistency. Federate what benefits from proximity to the business.

**Warning signs of wrong model:**
- Centralised: business units building shadow IT because central IT is too slow
- Federated: duplicated spending, inconsistent security, integration challenges
- Hybrid: unclear boundaries leading to finger-pointing and gaps

---

## 2. Sourcing Strategy: In-house vs Outsource vs Multi-vendor vs Cloud-first

### When to choose what

| Criteria | In-house | Single outsource | Multi-vendor | Cloud-first |
|----------|---------|-----------------|-------------|-------------|
| Strategic control | Full | Limited | Managed | Varies by service |
| Cost predictability | Lower (fixed salaries) | Higher (fixed contracts) | Complex | Pay-as-you-go |
| Flexibility | Medium (hiring cycles) | Low (contract terms) | High (swap vendors) | High |
| Capability access | Limited to team skills | Vendor capability | Best of breed | Broad but generic |
| Risk concentration | Internal (key person risk) | High (single vendor) | Distributed | Platform risk |
| Best suited for | Core differentiating capabilities | Commodity IT operations | Large, complex IT estates | Digital-native or cloud-ready |

### Recommendation

**Strategic principle:** In-house for differentiating capabilities. Outsource for commodity. Cloud-first for scalability and speed.

**Decision framework:**
1. Is this a differentiating capability? → In-house
2. Is this commodity and well-served by market? → Outsource or cloud
3. Do we need best-of-breed across multiple domains? → Multi-vendor
4. Do we need to scale rapidly and reduce CapEx? → Cloud-first

**Avoid:** Single-vendor dependency for critical services without exit planning.

---

## 3. IT Governance: COBIT vs ITIL vs Custom Framework

### When to choose what

| Criteria | COBIT | ITIL | Custom Framework |
|----------|-------|------|-----------------|
| Focus | Enterprise IT governance | IT service management | Organisation-specific |
| Scope | Strategic — board to operations | Operational — service lifecycle | Tailored to context |
| Regulatory alignment | Strong (audit, compliance) | Moderate | Depends on design |
| Implementation effort | High (comprehensive) | Medium (modular adoption) | Variable |
| Maturity required | Medium-high | Low-medium | Depends on design |
| Best suited for | Regulated industries, board-level governance | Service-oriented IT organisations | Unique operating models |

### Recommendation

**Most organisations:** Hybrid — use COBIT principles for governance structure, ITIL practices for service management, and custom elements for organisation-specific needs.

**Key principle:** Adopt the framework, then adapt it. No framework works perfectly out of the box. The goal is informed decision-making, not framework compliance.

**Common mistake:** Implementing the full framework before understanding which parts deliver value. Start with the governance elements that address your biggest pain points.

---

## 4. Investment Approach: CapEx-heavy vs OpEx-first vs Balanced Portfolio

### When to choose what

| Criteria | CapEx-heavy | OpEx-first | Balanced Portfolio |
|----------|-----------|-----------|-------------------|
| Financial model | Asset ownership, depreciation | Subscription, pay-as-you-go | Mix based on asset type |
| Upfront investment | High | Low | Medium |
| Flexibility | Low (sunk costs) | High (cancel/scale) | Medium |
| Cash flow impact | Lumpy (large purchases) | Smooth (monthly/annual) | Managed |
| Tax treatment | Capitalised, depreciated | Expensed immediately | Mixed |
| Best suited for | On-premise, long-lifecycle assets | Cloud, SaaS, rapidly evolving tech | Most enterprise IT portfolios |

### Recommendation

**Trend:** OpEx-first for most technology investments. Cloud, SaaS, and subscription models reduce upfront risk and increase flexibility.

**CapEx remains valid for:** Long-lifecycle infrastructure that is cheaper to own than rent, or where data sovereignty requires on-premise.

**Decision framework:**
1. Will the technology change significantly in 3 years? → OpEx (avoid asset lock-in)
2. Is the total cost of ownership lower with ownership? → CapEx
3. Is predictable monthly cost more important than total cost? → OpEx
4. Does the CFO prefer capitalised costs? → Discuss trade-offs openly

---

## 5. Digital Transformation: Big-bang vs Incremental vs Platform-led

### When to choose what

| Criteria | Big-bang | Incremental | Platform-led |
|----------|---------|-------------|-------------|
| Risk level | Very high | Low-medium | Medium |
| Time to first value | Long | Short | Medium |
| Change impact | Massive (all at once) | Gradual | Progressive |
| Investment profile | Large upfront | Spread over time | Platform + iterations |
| Organisation readiness required | High | Low | Medium |
| Best suited for | Mandatory compliance, system replacement | Process improvement, culture change | Technology modernisation, ecosystem plays |

### Recommendation

**Default to:** Incremental with a platform foundation. Build the platform in the first phase, then deliver value incrementally on top of it.

**Key principle:** Demonstrate value early and often. Transformation programs that take 18+ months to show results lose executive support and organisational momentum.

**Big-bang only when:** Regulatory deadline forces it, or legacy system is truly unsupportable and no incremental path exists.

**Success factors regardless of approach:**
1. Executive sponsorship with visible commitment
2. Quick wins in the first 90 days
3. Clear metrics that show business value, not just technology delivery
4. Change management as a first-class workstream, not an afterthought

---

## General Principles: Strategic IT Leadership

### Questions before every decision

1. **Business alignment test:** "Which business objective does this support? Can I explain it to the CEO in one sentence?"
2. **Value test:** "What is the business value? Can I quantify it or at least articulate the cost of inaction?"
3. **Risk test:** "What happens if this fails? Is the risk proportionate to the value?"
4. **Capability test:** "Do we have the capability to deliver this? If not, how do we get it?"
5. **Sustainability test:** "Can we operate and maintain this with our current team and budget?"

### Pattern

```
Align with business strategy → Establish governance → Deliver incrementally → Measure and improve
     (why)                        (how we decide)        (how we execute)         (how we learn)
```

The CIO's role is to ensure this cycle runs continuously, not to own every element within it.
