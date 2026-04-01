# SA Artifact Templates

Ready-to-use templates for all SA deliverables. Adapt to context — not every section is needed for every project.

---

## Stakeholder Map

```markdown
# Stakeholder Map

| Stakeholder | Role | Key Concerns | Influence | Communication |
|-------------|------|-------------|-----------|---------------|
| {Name/Title} | {Sponsor/User/Regulator/...} | {What they care about} | {High/Medium/Low} | {How often, what format} |

## Stakeholder Groups

### Decision Makers
- {List stakeholders who approve architectural decisions}

### Influencers
- {List stakeholders who shape decisions but don't approve}

### Users
- {List end-user groups and their primary needs}

### Affected Parties
- {List teams/systems impacted by the architecture}
```

---

## Context Document

```markdown
# Architecture Context

## Business Drivers
- {Why this initiative exists}
- {Business goals it supports}
- {Expected outcomes}

## Scope
- **In scope:** {What this architecture covers}
- **Out of scope:** {What it explicitly does not cover}

## Constraints
| Type | Constraint | Impact |
|------|-----------|--------|
| Technical | {e.g., Must integrate with legacy system X} | {How it affects design} |
| Organizational | {e.g., Team size limited to 5} | {How it affects approach} |
| Regulatory | {e.g., GDPR compliance required} | {How it affects data handling} |
| Timeline | {e.g., MVP by Q3} | {How it affects scope} |
| Budget | {e.g., Max $50k/month cloud spend} | {How it affects technology choices} |

## Assumptions
- {Assumption 1} — Impact if wrong: {what changes}
- {Assumption 2} — Impact if wrong: {what changes}

## Quality Attribute Priorities
1. {Highest priority, e.g., Security}
2. {Second priority, e.g., Availability}
3. {Third priority, e.g., Performance}
4. {Lower priority, e.g., Cost optimization}
```

---

## NFR Matrix

```markdown
# Non-Functional Requirements

| ID | Category | Requirement | Measurable Target | Priority | Verification |
|----|----------|-------------|-------------------|----------|-------------|
| NFR-01 | Performance | Response time for API calls | p99 < 200ms | Must | Load testing |
| NFR-02 | Availability | System uptime | 99.9% (8.7h downtime/year) | Must | Monitoring |
| NFR-03 | Scalability | Concurrent users supported | 10,000 concurrent | Should | Load testing |
| NFR-04 | Security | Authentication | OAuth 2.0 + MFA | Must | Security audit |
| NFR-05 | Data retention | Log retention period | 90 days hot, 1 year cold | Must | Policy review |
| NFR-06 | Recovery | Recovery time objective (RTO) | < 1 hour | Should | DR testing |
| NFR-07 | Recovery | Recovery point objective (RPO) | < 15 minutes | Should | DR testing |

## Priority Key
- **Must**: Non-negotiable, blocks go-live
- **Should**: Important, plan to deliver
- **Could**: Desirable, deliver if possible
- **Won't**: Out of scope for this iteration
```

---

## C4 Context Diagram

```markdown
# C4 Context Diagram — {System Name}

## System
**{System Name}** — {One-line description of what it does}

## Users/Actors
| Actor | Description | Interaction |
|-------|-------------|-------------|
| {User type} | {Who they are} | {What they do with the system} |

## External Systems
| System | Description | Integration |
|--------|-------------|-------------|
| {System name} | {What it does} | {How it connects: API/event/file/...} |

## Diagram Description
{Describe the context diagram in words — actors on the left, system in the center, external systems on the right. Use this to generate a diagram in your preferred tool.}

## Key Interactions
1. {Actor} → {System}: {action}
2. {System} → {External system}: {action}
3. {External system} → {System}: {response}
```

---

## C4 Container Diagram

```markdown
# C4 Container Diagram — {System Name}

## Containers
| Container | Technology | Responsibility | Notes |
|-----------|-----------|---------------|-------|
| {Web App} | {React, Next.js} | {User interface} | {SPA, SSR} |
| {API Service} | {Node.js, Go} | {Business logic, API} | {REST, gRPC} |
| {Database} | {PostgreSQL} | {Persistent storage} | {Primary data store} |
| {Message Queue} | {RabbitMQ, Kafka} | {Async communication} | {Event bus} |
| {Cache} | {Redis} | {Session, query cache} | {In-memory} |

## Container Interactions
| From | To | Protocol | Description |
|------|----|----------|-------------|
| Web App | API Service | HTTPS/REST | {User actions} |
| API Service | Database | TCP/SQL | {CRUD operations} |
| API Service | Message Queue | AMQP | {Async events} |
| Worker | Message Queue | AMQP | {Process events} |

## Deployment Notes
- {Container deployment strategy — k8s, ECS, serverless}
- {Scaling approach per container}
```

---

## Architecture Decision Record (ADR)

```markdown
# ADR-{NNN}: {Decision Title}

**Date:** {YYYY-MM-DD}
**Status:** {Proposed | Accepted | Deprecated | Superseded}
**Deciders:** {Who made/approved this decision}

## Context

{What is the issue or situation that motivates this decision? What forces are at play?}

## Decision

{What is the decision that was made? State it clearly and concisely.}

## Alternatives Considered

### Option A: {Name}
- **Pros:** {advantages}
- **Cons:** {disadvantages}
- **Why rejected:** {reason}

### Option B: {Name} (chosen)
- **Pros:** {advantages}
- **Cons:** {disadvantages}
- **Why chosen:** {reason}

### Option C: {Name}
- **Pros:** {advantages}
- **Cons:** {disadvantages}
- **Why rejected:** {reason}

## Consequences

### Positive
- {Benefit 1}
- {Benefit 2}

### Negative
- {Trade-off 1}
- {Trade-off 2}

### Risks
- {Risk and mitigation}

## Related Decisions
- {Links to related ADRs}
```

---

## Trade-off Analysis

```markdown
# Trade-off Analysis — {Decision Area}

## Decision: {What needs to be decided}

## Evaluation Criteria
| Criterion | Weight | Description |
|-----------|--------|-------------|
| {Performance} | {High/Med/Low} | {What "good" looks like} |
| {Cost} | {High/Med/Low} | {Budget constraints} |
| {Complexity} | {High/Med/Low} | {Team capability, maintenance} |
| {Time to implement} | {High/Med/Low} | {Timeline constraints} |

## Options Evaluation

| Criterion | Option A: {name} | Option B: {name} | Option C: {name} |
|-----------|------------------|------------------|------------------|
| Performance | {rating + notes} | {rating + notes} | {rating + notes} |
| Cost | {rating + notes} | {rating + notes} | {rating + notes} |
| Complexity | {rating + notes} | {rating + notes} | {rating + notes} |
| Time | {rating + notes} | {rating + notes} | {rating + notes} |

## Recommendation

**Chosen option:** {Option X}

**Rationale:** {Why this option best balances the criteria given the constraints}

**Accepted trade-offs:** {What we're giving up and why it's acceptable}
```

---

## Risk Assessment

```markdown
# Architecture Risk Assessment

| ID | Risk | Likelihood | Impact | Severity | Mitigation | Owner |
|----|------|-----------|--------|----------|------------|-------|
| R-01 | {Risk description} | {H/M/L} | {H/M/L} | {H/M/L} | {How to mitigate} | {Who} |

## Severity Matrix
|  | Low Impact | Medium Impact | High Impact |
|--|-----------|--------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |

## Accepted Risks
- {Risks accepted with justification}
```

---

## Architecture Document (Final)

```markdown
# Architecture Document — {System Name}

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Author:** {SA name}
**Status:** {Draft | Review | Approved}

## 1. Executive Summary
{2-3 paragraphs: what the system does, key architectural decisions, and why}

## 2. Context
{From discover/context-doc.md — business drivers, scope, constraints}

## 3. Stakeholders
{From discover/stakeholder-map.md — key stakeholders and their concerns}

## 4. Requirements Summary
{From define/ — key functional requirements and NFRs}

## 5. Architecture Overview
{From design/ — C4 context and container diagrams, architectural style rationale}

## 6. Component Design
{From design/component-specs.md — per-component details}

## 7. Data Architecture
{From design/data-model.md — data model, storage, flows}

## 8. Security Architecture
{From define/security-considerations.md — security controls and rationale}

## 9. Key Decisions
{From decide/adrs/ — summary of ADRs with links to full records}

## 10. Risks
{From decide/risk-assessment.md — key risks and mitigations}

## 11. Technical Dependency Map
{Visual: what must build before what — see Dependency Map template below}
{Table: Component | Depends On | Blocks}

## 12. Architecture Readiness Milestones
{Milestones with conditions — no dates, PO decides timeline}
{PO Decision Matrix — questions PO must answer}

## 13. Deployment Architecture
{Infrastructure, environments, deployment strategy}

## 14. Tech Stack
{Table: Layer | Technology}

## 15. Appendices
- Full ADRs
- Detailed NFR matrix
- Glossary
```

---

## Technical Dependency Map

```markdown
# Technical Dependency Map

Components have dependency relationships — they must be built in the correct order.
Timeline is determined by the PO based on business priorities.

## Dependency Flow

{ASCII diagram showing layers of dependencies, e.g.:}

Layer 1 (Foundation):  [Component A]  [Component B]
                            ▼              ▼
Layer 2 (Core):        [Component C]  [Component D]
                            ▼
Layer 3 (Features):    [Component E]  [Component F]
                            ▼
Layer 4 (Scale):       [Component G]

## Dependency Table

| Component | Depends On | Blocks |
|-----------|--------------|---------|
| {Component A} | — (foundation) | {Component C, D} |
| {Component C} | {Component A} | {Component E} |
| {Component E} | {Component C} | {Component G} |

## Dependency Rules

- Same layer: can be built in parallel
- Different layers: the preceding layer must be completed first
- Independent branches: PO decides the priority order
```

---

## Architecture Readiness Milestones

```markdown
# Architecture Readiness Milestones

Timeline is determined by the PO — the architecture defines readiness conditions.

## Milestone {N}: {Milestone Name}

**Prerequisites:** {Previous milestone + required capabilities}

| Capability | Current Status | Action Required |
|----------|--------------------|---------| 
| {Capability 1} | {Spec complete / In progress / Not started} | {Specific implementation needed} |
| {Capability 2} | {status} | {action} |

**Outcome:** {When this milestone is complete, what is the platform "ready for"?}

## PO Decision Matrix

| Question | Architecture Impact |
|---------|---------------------|
| {Business question} | {Which milestone/component is affected, estimated effort} |
| {Timeline question} | {Technical constraint affecting timeline} |
```

---

## YAGNI Decision Template

```markdown
# YAGNI Check — {Decision Area}

## Initial Proposal
{Complex solution being proposed}

## Current Reality
- Number of users: {N}
- Number of operators: {N}
- Production customers yet: {Yes/No}

## YAGNI Question
> "If the scale does not change in the next 6 months, would this solution still make sense?"

## Evaluation

| | Simple Solution | Complex Solution |
|--|---|---|
| Sufficient for now? | {Yes/No} | {Yes} |
| Build cost | {Low} | {High} |
| Operational cost | {Low} | {High} |
| Upgrade path | {Describe upgrade approach} | Not needed |

## Decision
{Choose simple / complex solution + rationale}

## Upgrade Path (if simple is chosen)
{Specific steps to upgrade when needed, estimated effort}
```
