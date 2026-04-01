# Common EA Patterns

Reference guide for evaluating trade-offs during the Design phase. Each pattern includes analysis of when to use which approach.

---

## 1. Architecture Framework: TOGAF vs Zachman vs FEAF vs Custom

### When to choose what

| Criteria | TOGAF | Zachman | FEAF | Custom |
|----------|-------|---------|------|--------|
| Best for | Large enterprises, structured transformation | Classification and taxonomy | Government organizations | Startups, specific contexts |
| Complexity | High (ADM phases, artifacts) | High (36-cell matrix) | High (federal requirements) | Low-Medium |
| Prescriptiveness | High (process-driven) | Low (taxonomy, not process) | Medium (reference models) | Varies |
| Industry adoption | Very high | Medium | Government-focused | N/A |
| Certification available | Yes (Open Group) | Yes (Zachman International) | No | No |
| Time to implement | 6-12 months | 3-6 months | 6-12 months | 1-3 months |

### Recommendation

**Start with:** Lightweight custom framework inspired by TOGAF ADM phases. Use the phase structure (Architecture Vision \u2192 Business Architecture \u2192 Information Systems Architecture \u2192 Technology Architecture \u2192 Governance) without the full artifact overhead.

**Scale up to:** Full TOGAF when the organization grows beyond 500+ IT staff or faces regulatory requirements for formal architecture governance.

**Use Zachman when:** You need a comprehensive classification system for existing architecture assets. Zachman is a taxonomy, not a methodology — it complements TOGAF, not replaces it.

---

## 2. Governance Model: Centralized vs Federated vs Hybrid

### When to choose what

| Criteria | Centralized | Federated | Hybrid |
|----------|-------------|-----------|--------|
| Organization size | Small-medium (< 500 IT) | Large (> 1000 IT) | Medium-large (500-1000 IT) |
| Business unit autonomy | Low | High | Medium |
| Consistency | High | Low (risk of divergence) | Medium-high |
| Speed of decision | Slow (bottleneck risk) | Fast (local decisions) | Medium |
| Architecture maturity | Early (building standards) | Mature (standards established) | Growing |
| Best for | Establishing standards | Diverse business units | Most organizations |

### Recommendation

**Start with:** Hybrid — central team sets principles, standards and reference architectures. Domain/business unit architects make decisions within those guardrails. Central team reviews major decisions via ARB.

**Key principle:** Centralize strategy and standards, federate execution. The central team should be small (3-5 people) and focus on enabling, not blocking.

**Anti-pattern:** Fully centralized governance in a large organization creates bottlenecks. Fully federated governance in an immature organization creates chaos.

---

## 3. Integration: Point-to-Point vs ESB vs API Gateway vs Event-driven

### When to choose what

| Criteria | Point-to-Point | ESB | API Gateway | Event-driven |
|----------|---------------|-----|-------------|-------------|
| Systems count | < 5 | 10-50 | 5-100+ | 10-100+ |
| Complexity | Low | Very high | Medium | Medium-high |
| Latency | Lowest | Medium | Low | Variable |
| Coupling | Tight | Medium (mediated) | Low (contract-based) | Very low |
| Ops effort | Low initially, grows fast | High | Medium | Medium |
| Best for | Small integration scope | Legacy SOA environments | API-first strategy | Real-time data flows |

### Recommendation

**Modern default:** API Gateway for synchronous + Event-driven for asynchronous. This combination covers most enterprise integration needs.

**Avoid:** New ESB deployments — the industry has moved to lighter-weight alternatives. If an ESB exists, plan a migration path to API Gateway + event-driven.

**Point-to-point:** Only acceptable for < 5 systems with stable interfaces. Document the upgrade path to API Gateway when integration count grows.

**Key standard:** Define an API-first policy — all new integrations must expose well-documented APIs. Legacy systems get API facades.

---

## 4. Data Architecture: Centralized vs Distributed vs Data Mesh

### When to choose what

| Criteria | Centralized (Data Warehouse) | Distributed (Data Lake) | Data Mesh |
|----------|----------------------------|------------------------|-----------|
| Data volume | Medium | Very high | High |
| Data variety | Structured | All types | All types |
| Governance | Central team | Central team | Domain teams |
| Time to insight | Slow (ETL pipelines) | Medium | Fast (domain ownership) |
| Organizational maturity | Any | Medium | High |
| Best for | BI and reporting | Big data analytics | Domain-oriented analytics |

### Recommendation

**Start with:** Centralized data warehouse for core business reporting. Add a data lake for unstructured/semi-structured data when volume or variety demands it.

**Move to Data Mesh when:** (1) Multiple business domains generate and consume data independently, (2) Central data team becomes a bottleneck, (3) Organization has mature data governance practices. Data Mesh requires high organizational maturity — don't adopt it prematurely.

**Key principle:** Regardless of architecture, establish data governance early — data stewards, quality standards, and master data management. Architecture can change; governance fundamentals should not.

---

## 5. Cloud Strategy: Cloud-first vs Hybrid vs Multi-cloud

### When to choose what

| Criteria | Cloud-first | Hybrid | Multi-cloud |
|----------|------------|--------|------------|
| New workloads | All cloud | Cloud by default, on-prem exceptions | Distribute across clouds |
| Legacy systems | Migrate or retire | Keep on-prem, integrate | Migrate selectively |
| Data sovereignty | May be challenging | Easier to control | Most flexible |
| Vendor lock-in risk | High (single cloud) | Medium | Low |
| Operational complexity | Low | Medium | High |
| Cost optimization | Good (single cloud discounts) | Variable | Complex (multi-vendor) |
| Best for | Greenfield, digital-native | Most enterprises | Large enterprises, regulated |

### Recommendation

**Default:** Hybrid — new workloads go to cloud, legacy stays on-prem with a migration roadmap. Pick a primary cloud provider for consistency and leverage volume discounts.

**Multi-cloud when:** (1) Regulatory requirements demand data sovereignty across regions, (2) Specific workloads benefit from specific cloud capabilities, (3) Organization has the ops maturity to manage multiple cloud environments.

**Anti-pattern:** "Multi-cloud to avoid vendor lock-in" without a clear strategy. Multi-cloud multiplies operational complexity. The cost of managing multiple clouds often exceeds the cost of vendor lock-in.

**Key standard:** Define a cloud landing zone with security, networking, and governance guardrails before any workload migration.

---

## General Principles: Business-IT Alignment First

### Questions before every architecture decision

1. **Business capability test:** "Which business capability does this architecture serve?"
2. **Strategic objective test:** "Which strategic objective does this advance?"
3. **Governance test:** "Does this conform to our architecture principles and standards?"
4. **Sustainability test:** "Can we operate and evolve this with our current capabilities?"

### Pattern

```
Trace to strategy \u2192 Define standards \u2192 Enable delivery teams \u2192 Govern outcomes
     (vision)          (principles)         (reference arch)       (ARB + metrics)
```

Do not design for architects. Design for delivery teams — they are the consumers of enterprise architecture. If they can't use it, it doesn't exist.
