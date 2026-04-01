# CIO Artifact Templates

Ready-to-use templates for all CIO deliverables. Adapt to context — not every section is needed for every project.

---

## IT Landscape Assessment

```markdown
# IT Landscape Assessment

**Date:** {YYYY-MM-DD}
**Assessed by:** {Name/Role}

## Application Portfolio

| Application | Category | Business Criticality | Technical Health | Vendor | License Model | Annual Cost |
|------------|----------|---------------------|-----------------|--------|--------------|-------------|
| {App name} | {ERP/CRM/HR/Custom/...} | {Critical/Important/Standard} | {Good/Fair/Poor} | {Vendor} | {SaaS/On-prem/...} | {Cost} |

## Infrastructure Overview

| Component | Technology | Status | End of Life | Notes |
|-----------|-----------|--------|-------------|-------|
| {Servers} | {Type/Cloud} | {Current/Aging/Legacy} | {Date} | {Migration plan} |

## Integration Map

| Source | Target | Integration Type | Criticality | Health |
|--------|--------|-----------------|-------------|--------|
| {System A} | {System B} | {API/File/DB/Manual} | {High/Med/Low} | {Good/Fair/Poor} |

## Technical Debt Register

| Area | Description | Impact | Estimated Effort | Priority |
|------|-------------|--------|-----------------|----------|
| {Area} | {What the debt is} | {Business impact} | {T-shirt size} | {High/Med/Low} |

## Key Findings

- {Finding 1}
- {Finding 2}
- {Finding 3}

## Recommendations

- {Recommendation 1}
- {Recommendation 2}
```

---

## Business-IT Alignment Analysis

```markdown
# Business-IT Alignment Analysis

## Business Objectives Mapping

| Business Objective | IT Capability Required | Current IT Support | Gap | Alignment Score |
|-------------------|----------------------|-------------------|-----|----------------|
| {Objective 1} | {What IT needs to provide} | {Current state} | {What's missing} | {1-5} |

## Alignment Maturity Assessment

| Dimension | Current Level | Target Level | Gap |
|-----------|--------------|-------------|-----|
| Communication | {Ad-hoc/Defined/Managed/Optimised} | {Target} | {Description} |
| Value measurement | {Level} | {Target} | {Description} |
| Governance | {Level} | {Target} | {Description} |
| Partnership | {Level} | {Target} | {Description} |
| Technology scope | {Level} | {Target} | {Description} |
| Skills | {Level} | {Target} | {Description} |

## Alignment Gaps

### Critical Gaps
- {Gap that directly blocks business objectives}

### Important Gaps
- {Gap that reduces IT effectiveness}

### Improvement Opportunities
- {Gap that could enhance value delivery}
```

---

## IT Strategy Document

```markdown
# IT Strategy

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Author:** {CIO name}
**Status:** {Draft | Review | Approved}
**Horizon:** {3-5 years}

## 1. Executive Summary
{2-3 paragraphs: IT vision, strategic direction, and expected business outcomes}

## 2. Business Context
{Key business objectives that IT strategy supports}

## 3. IT Vision
{Aspirational statement of what IT will look like and deliver}

## 4. Strategic Themes
| Theme | Description | Business Objective Supported | Success Metric |
|-------|-------------|------------------------------|---------------|
| {Theme 1} | {Description} | {Business objective} | {How measured} |

## 5. Current State Summary
{Key findings from IT landscape assessment and alignment analysis}

## 6. Strategic Priorities
| Priority | Rationale | Investment Category | Timeline |
|----------|-----------|-------------------|----------|
| {Priority 1} | {Why this matters} | {Run/Grow/Transform} | {Short/Medium/Long} |

## 7. Investment Framework
{Run/grow/transform allocation, budget principles}

## 8. Technology Direction
{Key technology decisions and direction — cloud strategy, platform choices, architecture principles}

## 9. People and Organisation
{IT capability requirements, organisational model, talent strategy}

## 10. Governance
{How strategy execution will be governed and measured}

## 11. Risks and Dependencies
{Key risks to strategy execution and dependencies on other business initiatives}

## 12. Success Metrics
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| {Metric 1} | {Baseline} | {Target value} | {When} |
```

---

## Investment Portfolio

```markdown
# IT Investment Portfolio

## Portfolio Summary

| Category | % of Budget | Key Initiatives | Business Value |
|----------|------------|----------------|----------------|
| Run (keep the lights on) | {%} | {List} | {Operational continuity} |
| Grow (enhance existing) | {%} | {List} | {Efficiency, capability} |
| Transform (new capabilities) | {%} | {List} | {Strategic advantage} |

## Initiative Details

### {Initiative Name}
- **Category:** {Run/Grow/Transform}
- **Business case:** {One-paragraph summary}
- **Investment required:** {Total cost}
- **Timeline:** {Duration}
- **Expected ROI:** {Quantified benefit}
- **Risk level:** {High/Medium/Low}
- **Dependencies:** {What this depends on}
- **Priority rank:** {1-N}

## Prioritisation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Business alignment | {High} | {How well it supports business objectives} |
| Risk reduction | {Medium} | {How much risk it mitigates} |
| Cost of delay | {Medium} | {Impact of not doing it} |
| Feasibility | {Medium} | {Can we deliver this?} |
| Strategic value | {High} | {Long-term competitive advantage} |
```

---

## Technology Roadmap

```markdown
# Technology Roadmap

**Horizon:** {3-5 years}
**Last updated:** {YYYY-MM-DD}

## Roadmap by Strategic Theme

### Year 1: Foundation
| Initiative | Strategic Theme | Dependencies | Key Milestone |
|-----------|----------------|-------------|---------------|
| {Initiative} | {Theme} | {Dependencies} | {Milestone} |

### Year 2-3: Growth
| Initiative | Strategic Theme | Dependencies | Key Milestone |
|-----------|----------------|-------------|---------------|
| {Initiative} | {Theme} | {Dependencies} | {Milestone} |

### Year 4-5: Transformation
| Initiative | Strategic Theme | Dependencies | Key Milestone |
|-----------|----------------|-------------|---------------|
| {Initiative} | {Theme} | {Dependencies} | {Milestone} |

## Technology Lifecycle

| Technology | Current Status | Target State | Migration Timeline |
|-----------|---------------|-------------|-------------------|
| {Technology} | {Current/Retiring/Emerging} | {Strategic/Contained/Retired} | {When} |

## Dependency Map

{ASCII diagram showing initiative dependencies}

## Decision Points

| Decision | Timing | Options | Impact |
|----------|--------|---------|--------|
| {Decision needed} | {When} | {Options available} | {What it affects} |
```

---

## IT Governance Framework

```markdown
# IT Governance Framework

## Governance Structure

### Decision-Making Bodies

| Body | Purpose | Chair | Members | Frequency |
|------|---------|-------|---------|-----------|
| IT Steering Committee | Strategic direction, investment approval | {CIO/CEO} | {Members} | {Monthly/Quarterly} |
| Architecture Review Board | Technical standards, architecture decisions | {CIO/CTO} | {Members} | {Bi-weekly/Monthly} |
| Change Advisory Board | Change risk assessment, approval | {IT Operations} | {Members} | {Weekly} |

### Decision Rights (RACI)

| Decision Type | Responsible | Accountable | Consulted | Informed |
|--------------|------------|-------------|-----------|----------|
| IT strategy | {Role} | {CIO} | {Exec team} | {IT staff} |
| Technology standards | {Role} | {Role} | {Role} | {Role} |
| Investment > {threshold} | {Role} | {Role} | {Role} | {Role} |
| Vendor selection | {Role} | {Role} | {Role} | {Role} |

### Escalation Path

1. Team level: {Threshold and process}
2. Department level: {Threshold and process}
3. CIO level: {Threshold and process}
4. Executive/Board level: {Threshold and process}

## Policies and Standards

| Policy | Owner | Review Cycle | Last Reviewed |
|--------|-------|-------------|---------------|
| Information security policy | {Role} | {Annual} | {Date} |
| Data management policy | {Role} | {Annual} | {Date} |
| Acceptable use policy | {Role} | {Annual} | {Date} |
| Change management policy | {Role} | {Annual} | {Date} |

## Reporting and Metrics

| Report | Audience | Frequency | Key Metrics |
|--------|----------|-----------|-------------|
| IT performance dashboard | {Executive} | {Monthly} | {List} |
| Project portfolio status | {Steering committee} | {Monthly} | {List} |
| Risk report | {Board/Audit} | {Quarterly} | {List} |
```

---

## Risk Management Plan

```markdown
# IT Risk Management Plan

## Risk Management Approach

- **Framework:** {COBIT/ISO 31000/Custom}
- **Risk appetite:** {Risk appetite statement}
- **Review cycle:** {How often risks are reviewed}

## Risk Categories

| Category | Description | Examples |
|----------|-------------|---------|
| Strategic | Risks to IT strategy execution | {Examples} |
| Operational | Risks to IT service delivery | {Examples} |
| Security | Risks to information and systems security | {Examples} |
| Compliance | Risks of regulatory non-compliance | {Examples} |
| Vendor | Risks from third-party dependencies | {Examples} |
| Technology | Risks from technology choices and lifecycle | {Examples} |

## Risk Register

| ID | Risk | Category | Likelihood | Impact | Severity | Mitigation | Owner | Status |
|----|------|----------|-----------|--------|----------|------------|-------|--------|
| R-01 | {Description} | {Category} | {H/M/L} | {H/M/L} | {H/M/L} | {Strategy} | {Who} | {Open/Mitigated/Accepted} |

## Severity Matrix

|  | Low Impact | Medium Impact | High Impact |
|--|-----------|--------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |
```

---

## Vendor Management Strategy

```markdown
# Vendor Management Strategy

## Vendor Categorisation

| Tier | Criteria | Management Approach | Review Frequency |
|------|----------|-------------------|-----------------|
| Strategic | {High value, high criticality} | {Partnership, joint planning} | {Quarterly} |
| Tactical | {Medium value, specific capability} | {Managed relationship} | {Semi-annual} |
| Commodity | {Low value, easily replaceable} | {Contract compliance} | {Annual} |

## Vendor Portfolio

| Vendor | Tier | Services | Contract Value | Contract End | Risk Level |
|--------|------|----------|---------------|-------------|------------|
| {Vendor} | {Tier} | {Services provided} | {Annual value} | {End date} | {H/M/L} |

## Selection Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Capability fit | {%} | {Technical and functional fit} |
| Financial viability | {%} | {Vendor stability and pricing} |
| Strategic alignment | {%} | {Alignment with IT strategy} |
| Service quality | {%} | {Track record and SLA capability} |
| Risk profile | {%} | {Concentration risk, lock-in risk} |

## Performance Management

| KPI | Target | Measurement Method | Escalation Threshold |
|-----|--------|-------------------|---------------------|
| {SLA compliance} | {Target} | {How measured} | {When to escalate} |
```

---

## Transformation Program Plan

```markdown
# Transformation Program Plan

**Program name:** {Name}
**Sponsor:** {Executive sponsor}
**Program lead:** {Name}
**Duration:** {Timeline}

## Program Vision
{What the transformation will achieve and why it matters}

## Workstreams

| Workstream | Lead | Scope | Key Deliverables | Timeline |
|-----------|------|-------|-----------------|----------|
| {Workstream 1} | {Lead} | {What it covers} | {Deliverables} | {Timeline} |

## Milestones

| Milestone | Date | Workstreams | Success Criteria |
|-----------|------|-------------|-----------------|
| {Milestone 1} | {Date} | {Which workstreams} | {How we know it's done} |

## Dependencies

| Dependency | From | To | Type | Risk if Delayed |
|-----------|------|----|------|----------------|
| {Dependency} | {Source} | {Target} | {Hard/Soft} | {Impact} |

## Resource Requirements

| Role | FTE | Source | Duration |
|------|-----|--------|----------|
| {Role} | {Count} | {Internal/External} | {Duration} |

## Budget

| Category | Budget | Notes |
|----------|--------|-------|
| People | {Amount} | {Internal + external} |
| Technology | {Amount} | {Licenses, infrastructure} |
| Change management | {Amount} | {Training, communications} |
| Contingency | {Amount} | {% of total} |
| **Total** | {Amount} | |

## Risk Summary
{Top 5 risks with mitigation strategies}
```

---

## Operating Model Design

```markdown
# IT Operating Model

## Operating Model Type
{Centralised / Federated / Hybrid — with rationale}

## Organisation Structure

### Functions

| Function | Purpose | Head Count | Key Responsibilities |
|----------|---------|-----------|---------------------|
| {IT Strategy & Architecture} | {Purpose} | {N} | {Responsibilities} |
| {Service Delivery} | {Purpose} | {N} | {Responsibilities} |
| {Development & Innovation} | {Purpose} | {N} | {Responsibilities} |
| {Security & Compliance} | {Purpose} | {N} | {Responsibilities} |

## Process Model

| Process | Owner | Framework | Maturity Target |
|---------|-------|-----------|----------------|
| {Incident management} | {Role} | {ITIL} | {Level} |
| {Change management} | {Role} | {ITIL} | {Level} |
| {Project delivery} | {Role} | {Agile/Waterfall} | {Level} |

## Sourcing Model

| Capability | Delivery Model | Rationale |
|-----------|---------------|-----------|
| {Core development} | {In-house} | {Strategic capability} |
| {Infrastructure} | {Cloud + managed service} | {Cost efficiency} |
| {Specialist skills} | {Contract/Partner} | {Flexibility} |

## Technology Enablers

| Enabler | Purpose | Status |
|---------|---------|--------|
| {ITSM platform} | {Service management} | {Current/Planned} |
| {DevOps toolchain} | {Development efficiency} | {Current/Planned} |
| {Monitoring platform} | {Operational visibility} | {Current/Planned} |
```

---

## IT Performance Dashboard Template

```markdown
# IT Performance Dashboard

**Period:** {Month/Quarter YYYY}

## Executive Summary
{2-3 sentences on overall IT performance}

## Service Performance

| Service | SLA Target | Actual | Trend | Status |
|---------|-----------|--------|-------|--------|
| {Service 1} | {Target} | {Actual} | {Up/Down/Stable} | {Green/Amber/Red} |

## Financial Performance

| Category | Budget | Actual | Variance | Notes |
|----------|--------|--------|----------|-------|
| Run | {Budget} | {Actual} | {+/- %} | {Explanation} |
| Grow | {Budget} | {Actual} | {+/- %} | {Explanation} |
| Transform | {Budget} | {Actual} | {+/- %} | {Explanation} |

## Project Portfolio

| Project | Phase | Health | Budget Status | Key Risk |
|---------|-------|--------|--------------|----------|
| {Project 1} | {Phase} | {Green/Amber/Red} | {On/Over/Under} | {Top risk} |

## Key Metrics

| Metric | Target | Actual | Trend |
|--------|--------|--------|-------|
| System availability | {Target} | {Actual} | {Trend} |
| Incident resolution time | {Target} | {Actual} | {Trend} |
| Customer satisfaction | {Target} | {Actual} | {Trend} |
| IT cost per employee | {Target} | {Actual} | {Trend} |

## Actions and Decisions Required

| Item | Owner | Deadline | Priority |
|------|-------|----------|----------|
| {Action/Decision} | {Who} | {When} | {H/M/L} |
```

---

## Service Improvement Plan

```markdown
# Service Improvement Plan

## Improvement Opportunities

| ID | Area | Current Performance | Target | Business Impact | Effort | Priority |
|----|------|-------------------|--------|----------------|--------|----------|
| SI-01 | {Area} | {Current state} | {Target state} | {Impact} | {T-shirt} | {H/M/L} |

## Improvement Actions

### {SI-01}: {Improvement Title}
- **Current state:** {Description}
- **Target state:** {Description}
- **Actions:** {Numbered list of actions}
- **Owner:** {Who}
- **Timeline:** {When}
- **Success metric:** {How we know it worked}
- **Investment required:** {Cost}

## Quick Wins (< 30 days)
- {Quick win 1}
- {Quick win 2}

## Medium-term (1-3 months)
- {Improvement 1}

## Long-term (3-12 months)
- {Improvement 1}
```

---

## Annual IT Review Template

```markdown
# Annual IT Review — {Year}

**Presented by:** {CIO name}
**Date:** {YYYY-MM-DD}
**Audience:** {Executive team / Board}

## 1. Executive Summary
{Key highlights, achievements and challenges of the year}

## 2. Strategy Execution

| Strategic Theme | Target | Achievement | Status |
|----------------|--------|-------------|--------|
| {Theme 1} | {What we planned} | {What we delivered} | {On track/Behind/Ahead} |

## 3. Financial Summary

| Category | Budget | Actual | Variance |
|----------|--------|--------|----------|
| Total IT spend | {Budget} | {Actual} | {Variance} |
| IT spend as % of revenue | {Target} | {Actual} | {Variance} |

## 4. Key Achievements
- {Achievement 1 with business impact}
- {Achievement 2 with business impact}

## 5. Challenges and Lessons Learned
- {Challenge 1 and how it was addressed}
- {Lesson learned and what changes}

## 6. Risk Summary
{Top risks, how they were managed, residual risk position}

## 7. People and Capability
{Team changes, capability development, engagement scores}

## 8. Priorities for Next Year
| Priority | Business Objective Supported | Investment Required |
|----------|------------------------------|-------------------|
| {Priority 1} | {Objective} | {Estimate} |

## 9. Decisions Required
{What the executive team needs to decide}
```

---

## Capability Gap Analysis

```markdown
# Capability Gap Analysis

## Capability Assessment

| Capability | Current Level | Target Level | Gap Severity | Remediation |
|-----------|--------------|-------------|-------------|-------------|
| {Capability 1} | {1-5 or descriptive} | {Target} | {Critical/High/Medium/Low} | {Build/Buy/Partner} |

## Skills Heat Map

| Skill Area | Current Coverage | Demand Trend | Gap Action |
|-----------|-----------------|-------------|------------|
| {Cloud engineering} | {Adequate/Insufficient/Critical} | {Growing/Stable/Declining} | {Hire/Train/Partner} |

## Remediation Plan

### Critical Gaps
| Gap | Action | Timeline | Investment | Owner |
|-----|--------|----------|-----------|-------|
| {Gap} | {What to do} | {When} | {Cost} | {Who} |

### Important Gaps
| Gap | Action | Timeline | Investment | Owner |
|-----|--------|----------|-----------|-------|
| {Gap} | {What to do} | {When} | {Cost} | {Who} |
```
