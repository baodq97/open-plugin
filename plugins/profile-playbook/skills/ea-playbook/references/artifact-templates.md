# EA Artifact Templates

Ready-to-use templates for all EA deliverables. Adapt to context — not every section is needed for every initiative.

---

## Business Strategy Summary

```markdown
# Business Strategy Summary

## Strategic Objectives
| # | Objective | Description | Key Metrics | Timeline |
|---|-----------|-------------|-------------|----------|
| 1 | {Objective name} | {What it aims to achieve} | {How success is measured} | {Target period} |

## Strategic Initiatives
| Initiative | Objective Supported | Architecture Implications |
|-----------|---------------------|--------------------------|
| {Initiative name} | {Which objective} | {How it affects architecture} |

## Business Context
- **Industry:** {Industry and competitive landscape}
- **Market position:** {Current market position and trajectory}
- **Key differentiators:** {What sets the organization apart}

## Architecture Implications
- {Key implication 1 — how strategy drives architecture}
- {Key implication 2}
- {Key implication 3}
```

---

## Current State Architecture Assessment

```markdown
# Current State Architecture Assessment

## Enterprise Systems Inventory
| System | Domain | Technology | Status | Owner | Users |
|--------|--------|-----------|--------|-------|-------|
| {System name} | {Business domain} | {Tech stack} | {Active/Legacy/Sunset} | {Team/Dept} | {User count} |

## Technology Portfolio Assessment
| Technology | Category | Status | Risk | Action |
|-----------|----------|--------|------|--------|
| {Technology} | {Infrastructure/Platform/Application} | {Strategic/Tactical/Legacy} | {H/M/L} | {Invest/Maintain/Migrate/Retire} |

## Integration Landscape
| Source | Target | Method | Volume | Issues |
|--------|--------|--------|--------|--------|
| {System A} | {System B} | {API/File/DB/Event} | {Transactions/day} | {Known issues} |

## Pain Points and Technical Debt
| # | Pain Point | Impact | Root Cause | Affected Systems |
|---|-----------|--------|-----------|------------------|
| 1 | {Description} | {Business impact} | {Why it exists} | {Which systems} |

## Assessment Summary
- **Strengths:** {What works well}
- **Weaknesses:** {Key gaps and risks}
- **Opportunities:** {Where improvement is possible}
- **Threats:** {What could cause failure}
```

---

## Architecture Vision Document

```markdown
# Architecture Vision

## Vision Statement
{2-3 sentences describing the desired future state of the enterprise architecture}

## Business Outcomes
| Outcome | Description | Measurement |
|---------|-------------|-------------|
| {Outcome name} | {What it achieves} | {How to measure success} |

## Key Architecture Decisions
| Decision | Rationale | Impact |
|----------|-----------|--------|
| {Decision} | {Why this choice} | {What it affects} |

## Target State Overview
{High-level description of the target architecture — domains, key patterns, technology direction}

## Transition Approach
{How to get from current state to target state — phases, priorities, dependencies}

## Success Metrics
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| {Metric name} | {Current value} | {Target value} | {When} |
```

---

## Architecture Principles Catalog

```markdown
# Architecture Principles Catalog

## Business Principles

### BP-{N}: {Principle Name}
- **Statement:** {Clear, concise principle statement}
- **Rationale:** {Why this principle matters}
- **Implications:** {What this means in practice}
- **Related principles:** {Links to related principles}

## Data Principles

### DP-{N}: {Principle Name}
- **Statement:** {Clear, concise principle statement}
- **Rationale:** {Why this principle matters}
- **Implications:** {What this means in practice}
- **Related principles:** {Links to related principles}

## Application Principles

### AP-{N}: {Principle Name}
- **Statement:** {Clear, concise principle statement}
- **Rationale:** {Why this principle matters}
- **Implications:** {What this means in practice}
- **Related principles:** {Links to related principles}

## Technology Principles

### TP-{N}: {Principle Name}
- **Statement:** {Clear, concise principle statement}
- **Rationale:** {Why this principle matters}
- **Implications:** {What this means in practice}
- **Related principles:** {Links to related principles}
```

---

## Business Capability Model

```markdown
# Business Capability Model

## Level 1: Strategic Capability Areas

| # | Capability Area | Description | Strategic Importance |
|---|----------------|-------------|---------------------|
| 1 | {Area name} | {What it covers} | {Differentiating/Essential/Commodity} |

## Level 2: Capability Groups

### {Level 1 Area Name}
| # | Capability Group | Description | Maturity | Investment Need |
|---|-----------------|-------------|----------|-----------------|
| 1.1 | {Group name} | {What it covers} | {1-5} | {High/Medium/Low} |

## Level 3: Individual Capabilities

### {Level 2 Group Name}
| # | Capability | Description | Current Maturity | Target Maturity |
|---|-----------|-------------|------------------|-----------------|
| 1.1.1 | {Capability} | {What it does} | {1-5} | {1-5} |

## Capability Heat Map

| Capability | Strategic Importance | Current Maturity | Gap | Priority |
|-----------|---------------------|------------------|-----|----------|
| {Name} | {H/M/L} | {1-5} | {Target - Current} | {1-N} |

## Maturity Scale
- **1 — Initial:** Ad-hoc, undocumented
- **2 — Developing:** Partially defined, inconsistent
- **3 — Defined:** Documented, consistently applied
- **4 — Managed:** Measured, actively managed
- **5 — Optimized:** Continuously improved, industry-leading
```

---

## Reference Architecture

```markdown
# Reference Architecture — {Domain}

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Status:** {Draft | Review | Approved}

## Purpose
{What this reference architecture covers and who it is for}

## Scope
- **In scope:** {Domains and systems covered}
- **Out of scope:** {What is explicitly excluded}

## Architecture Layers
| Layer | Description | Key Patterns | Standards |
|-------|-------------|-------------|-----------|
| Presentation | {UI, portals, mobile} | {Patterns used} | {Standards applied} |
| Application | {Services, APIs, logic} | {Patterns used} | {Standards applied} |
| Integration | {ESB, API GW, events} | {Patterns used} | {Standards applied} |
| Data | {Databases, lakes, warehouses} | {Patterns used} | {Standards applied} |
| Infrastructure | {Cloud, network, compute} | {Patterns used} | {Standards applied} |
| Security | {IAM, encryption, monitoring} | {Patterns used} | {Standards applied} |

## Pattern Library
### {Pattern Name}
- **Context:** {When to use}
- **Solution:** {How it works}
- **Consequences:** {Trade-offs}
- **Examples:** {Where it is applied}

## Technology Standards
| Layer | Approved | Emerging | Deprecated |
|-------|----------|----------|-----------|
| {Layer} | {Technologies} | {Under evaluation} | {Being retired} |

## Compliance
- This reference architecture aligns with principles: {list principle IDs}
- Deviations require ARB approval via the waiver process
```

---

## Technology Roadmap

```markdown
# Technology Roadmap

## Technology Radar

### Adopt (use in production)
| Technology | Domain | Rationale |
|-----------|--------|-----------|
| {Tech} | {Where it applies} | {Why adopt now} |

### Trial (use in pilots/PoCs)
| Technology | Domain | Evaluation Criteria |
|-----------|--------|-------------------|
| {Tech} | {Where it applies} | {What we need to prove} |

### Assess (research and evaluate)
| Technology | Domain | Potential Impact |
|-----------|--------|-----------------|
| {Tech} | {Where it applies} | {Expected benefit} |

### Hold (do not start new usage)
| Technology | Domain | Migration Path |
|-----------|--------|---------------|
| {Tech} | {Where it applies} | {How to move away} |

## Migration Roadmap
| Phase | Timeline | Actions | Dependencies |
|-------|----------|---------|-------------|
| Phase 1 | {Period} | {Key migrations and adoptions} | {What must happen first} |

## Investment Alignment
| Technology Initiative | Strategic Objective | Business Case |
|---------------------|---------------------|---------------|
| {Initiative} | {Which objective} | {Expected ROI or value} |
```

---

## Data Architecture Overview

```markdown
# Data Architecture Overview

## Data Domains
| Domain | Description | Owner | Key Systems |
|--------|-------------|-------|-------------|
| {Domain name} | {What data it covers} | {Responsible team} | {Systems involved} |

## Data Governance Model
- **Data stewards:** {Who and their responsibilities}
- **Data quality standards:** {How quality is measured}
- **Data lifecycle:** {Creation, usage, archival, deletion policies}
- **Privacy and compliance:** {Regulations and controls}

## Data Integration Patterns
| Pattern | Use Case | Technologies |
|---------|----------|-------------|
| {Pattern name} | {When to use} | {Tools and platforms} |

## Master Data Management
| Master Data Entity | System of Record | Consumers | Sync Method |
|-------------------|-----------------|-----------|------------|
| {Entity} | {Authoritative source} | {Downstream systems} | {How synced} |
```

---

## Security Architecture Overview

```markdown
# Security Architecture Overview

## Security Zones
| Zone | Trust Level | Systems | Controls |
|------|-------------|---------|----------|
| {Zone name} | {High/Medium/Low} | {What lives here} | {Security measures} |

## Identity and Access Management
- **Authentication:** {Patterns and standards}
- **Authorization:** {RBAC/ABAC/Policy-based}
- **Federation:** {SSO, identity providers}

## Data Protection
| Data Classification | Storage Controls | Transit Controls | Access Controls |
|-------------------|-----------------|-----------------|----------------|
| {Classification} | {Encryption, isolation} | {TLS, VPN} | {Who can access} |

## Compliance Mapping
| Regulation | Requirements | Controls | Status |
|-----------|-------------|----------|--------|
| {Regulation} | {What it requires} | {How we comply} | {Compliant/Gap} |

## Threat Model
| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|-----------|
| {Threat description} | {H/M/L} | {H/M/L} | {How addressed} |
```

---

## Architecture Governance Framework

```markdown
# Architecture Governance Framework

## Governance Model
- **Type:** {Centralized / Federated / Hybrid}
- **Rationale:** {Why this model fits the organization}

## Decision Rights
| Decision Type | Decision Maker | Consulted | Informed |
|-------------|---------------|-----------|----------|
| {Architecture standard} | {Who decides} | {Who is consulted} | {Who is informed} |
| {Technology selection} | {Who decides} | {Who is consulted} | {Who is informed} |
| {Waiver/Exception} | {Who decides} | {Who is consulted} | {Who is informed} |

## Compliance Criteria
| Category | Standard | Compliance Check | Enforcement |
|----------|---------|-----------------|-------------|
| {Category} | {What the standard requires} | {How compliance is verified} | {What happens on non-compliance} |

## Reporting
| Report | Audience | Frequency | Content |
|--------|---------|-----------|---------|
| {Report name} | {Who receives it} | {How often} | {What it covers} |

## Escalation Path
1. {First level — who handles routine questions}
2. {Second level — who handles disagreements}
3. {Third level — who makes final decisions}
```

---

## Architecture Review Board Charter

```markdown
# Architecture Review Board Charter

## Purpose
{Why the ARB exists and what value it provides}

## Composition
| Role | Responsibility | Member |
|------|---------------|--------|
| Chair | {Facilitates meetings, sets agenda} | {Name/Title} |
| Enterprise Architect | {Provides architecture guidance} | {Name/Title} |
| Domain Architect | {Represents specific domain} | {Name/Title} |
| Security Architect | {Reviews security aspects} | {Name/Title} |
| Business Representative | {Ensures business alignment} | {Name/Title} |

## Meeting Cadence
- **Regular reviews:** {Frequency, e.g., bi-weekly}
- **Ad-hoc reviews:** {When triggered, e.g., major architecture decisions}
- **Agenda distribution:** {How far in advance}

## Review Process
1. {Submission — what to submit, how far in advance}
2. {Pre-review — asynchronous review by ARB members}
3. {Review meeting — presentation, Q&A, discussion}
4. {Decision — approve / approve with conditions / reject / defer}
5. {Follow-up — tracking conditions and actions}

## Review Criteria
| Criterion | Description | Weight |
|----------|-------------|--------|
| {Principle alignment} | {Does it follow architecture principles?} | {H/M/L} |
| {Standards compliance} | {Does it use approved technologies?} | {H/M/L} |
| {Security} | {Are security requirements addressed?} | {H/M/L} |
| {Data governance} | {Is data handled properly?} | {H/M/L} |
| {Business alignment} | {Does it serve a business capability?} | {H/M/L} |

## Decision Thresholds
- **Full ARB review required:** {Criteria for full review}
- **Lightweight review:** {Criteria for abbreviated process}
- **No review needed:** {What can proceed without ARB}
```

---

## Technology Radar

```markdown
# Technology Radar

**Last updated:** {YYYY-MM-DD}

## Quadrants
1. **Languages and Frameworks**
2. **Platforms and Infrastructure**
3. **Tools**
4. **Techniques and Patterns**

## Rings

### Adopt
| Technology | Quadrant | Description |
|-----------|----------|-------------|
| {Tech} | {Quadrant} | {Why we recommend broad adoption} |

### Trial
| Technology | Quadrant | Description |
|-----------|----------|-------------|
| {Tech} | {Quadrant} | {What we want to validate} |

### Assess
| Technology | Quadrant | Description |
|-----------|----------|-------------|
| {Tech} | {Quadrant} | {Why it's worth investigating} |

### Hold
| Technology | Quadrant | Description |
|-----------|----------|-------------|
| {Tech} | {Quadrant} | {Why we recommend caution or migration} |

## Change Log
| Date | Technology | Change | Rationale |
|------|-----------|--------|-----------|
| {Date} | {Tech} | {From ring \u2192 To ring} | {Why it moved} |
```

---

## Architecture Maturity Assessment

```markdown
# Architecture Maturity Assessment

## Assessment Dimensions

| Dimension | Current Level | Target Level | Gap | Priority |
|-----------|-------------|-------------|-----|----------|
| Governance | {1-5} | {1-5} | {Delta} | {H/M/L} |
| Standards | {1-5} | {1-5} | {Delta} | {H/M/L} |
| Adoption | {1-5} | {1-5} | {Delta} | {H/M/L} |
| Skills | {1-5} | {1-5} | {Delta} | {H/M/L} |
| Tooling | {1-5} | {1-5} | {Delta} | {H/M/L} |
| Communication | {1-5} | {1-5} | {Delta} | {H/M/L} |

## Maturity Scale
- **1 — Initial:** No formal architecture practice
- **2 — Developing:** Some architecture activities, ad-hoc
- **3 — Defined:** Formal architecture practice with standards
- **4 — Managed:** Architecture actively managed and measured
- **5 — Optimized:** Continuous improvement, industry-leading

## Improvement Actions
| Dimension | Action | Owner | Timeline | Expected Impact |
|-----------|--------|-------|----------|-----------------|
| {Dimension} | {Specific action} | {Who} | {When} | {What improves} |
```

---

## Capability Development Plan

```markdown
# Capability Development Plan

## Skills Gap Analysis
| Skill Area | Current Level | Target Level | Gap | Development Path |
|-----------|-------------|-------------|-----|-----------------|
| {SFIA skill} | {Level} | {Level} | {Delta} | {How to develop} |

## Training and Development
| Program | Target Audience | Format | Timeline | Provider |
|---------|----------------|--------|----------|---------|
| {Program name} | {Who should attend} | {Course/Workshop/Certification} | {When} | {Internal/External} |

## Mentoring and Community of Practice
- **Mentoring pairs:** {How mentoring is structured}
- **Community of practice:** {Meeting cadence, topics, membership}
- **Knowledge sharing:** {How architecture knowledge is disseminated}

## Certification Path
| Certification | Level | Relevance | Priority |
|-------------|-------|-----------|----------|
| {Certification name} | {Entry/Intermediate/Advanced} | {How it maps to EA role} | {H/M/L} |

## Success Metrics
| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| {Metric} | {Value} | {Value} | {How measured} |
```
