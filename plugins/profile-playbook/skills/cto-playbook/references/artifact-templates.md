# CTO Artifact Templates

Ready-to-use templates for all CTO deliverables. Adapt to context — not every section is needed for every initiative.

---

## Technology Landscape Assessment

```markdown
# Technology Landscape Assessment

## Current Technology Stack

| Layer | Technology | Version | Status | Notes |
|-------|-----------|---------|--------|-------|
| Frontend | {e.g., React} | {v18} | {Current/Aging/Legacy} | {Key concerns} |
| Backend | {e.g., Node.js} | {v20} | {Current/Aging/Legacy} | {Key concerns} |
| Database | {e.g., PostgreSQL} | {v16} | {Current/Aging/Legacy} | {Key concerns} |
| Infrastructure | {e.g., AWS ECS} | {N/A} | {Current/Aging/Legacy} | {Key concerns} |
| CI/CD | {e.g., GitHub Actions} | {N/A} | {Current/Aging/Legacy} | {Key concerns} |

## System Architecture Overview
{High-level description of how systems fit together}

## Integration Points
| System A | System B | Integration Type | Health | Notes |
|----------|----------|-----------------|--------|-------|
| {System} | {System} | {API/Event/File/Manual} | {Healthy/Fragile/Broken} | {Key risks} |

## Maturity Assessment
| Area | Maturity (1-5) | Evidence | Gap |
|------|---------------|----------|-----|
| Development practices | {score} | {what exists} | {what's missing} |
| Testing & quality | {score} | {what exists} | {what's missing} |
| Observability | {score} | {what exists} | {what's missing} |
| Security | {score} | {what exists} | {what's missing} |
| Infrastructure | {score} | {what exists} | {what's missing} |

## Key Findings
1. {Finding 1 with implications}
2. {Finding 2 with implications}
```

---

## Technical Debt Inventory

```markdown
# Technical Debt Inventory

| ID | Area | Description | Impact on Velocity | Risk Level | Effort to Resolve | Priority |
|----|------|-------------|-------------------|------------|-------------------|----------|
| TD-01 | {area} | {what the debt is} | {High/Med/Low} | {High/Med/Low} | {S/M/L/XL} | {P1/P2/P3} |

## Impact Categories
- **Velocity impact**: How much does this debt slow down feature delivery?
- **Risk level**: What is the probability and severity of a failure caused by this debt?
- **Effort**: T-shirt size for resolution (S=days, M=weeks, L=months, XL=quarters)

## Recommended Approach
| Strategy | Debt Items | Timeline | Business Case |
|----------|-----------|----------|--------------|
| {Pay-as-you-go} | {TD-01, TD-03} | {Ongoing} | {Low overhead, continuous improvement} |
| {Dedicated sprint} | {TD-02} | {Q2} | {Blocking feature X} |
| {Rewrite} | {TD-04} | {H2} | {Technical risk unacceptable} |

## Total Estimated Cost of Debt
- Velocity drag: {estimated % of engineering capacity spent on debt-related work}
- Risk exposure: {estimated business impact if debt causes an incident}
```

---

## Technology Vision Document

```markdown
# Technology Vision

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Author:** {CTO name}
**Status:** {Draft | Review | Approved}

## Executive Summary
{2-3 paragraphs: where we are, where we need to be, and how technology gets us there}

## Current State
{Summary from Technology Landscape Assessment — key strengths and gaps}

## Target State (3-Year Horizon)
| Dimension | Current | Target | Why |
|-----------|---------|--------|-----|
| Platform architecture | {e.g., Monolith} | {e.g., Composable} | {Business driver} |
| Engineering practices | {e.g., Manual testing} | {e.g., Full CI/CD} | {Velocity driver} |
| Team structure | {e.g., Project-based} | {e.g., Product teams} | {Ownership driver} |
| Innovation | {e.g., Ad-hoc} | {e.g., Structured pipeline} | {Competitive driver} |

## Technology Principles
1. {Principle 1} — {Rationale and implications}
2. {Principle 2} — {Rationale and implications}
3. {Principle 3} — {Rationale and implications}

## Strategic Technology Bets
| Bet | Rationale | Investment | Expected Outcome | Risk |
|-----|-----------|-----------|-----------------|------|
| {Technology/approach} | {Why this matters} | {Effort/cost} | {Measurable outcome} | {Key risk} |

## Transition Roadmap
| Phase | Timeframe | Focus | Key Milestones |
|-------|-----------|-------|---------------|
| Foundation | {H1 Year 1} | {What to establish first} | {Measurable milestones} |
| Build | {H2 Year 1} | {What to build next} | {Measurable milestones} |
| Scale | {Year 2} | {What to scale} | {Measurable milestones} |
| Optimise | {Year 3} | {What to optimise} | {Measurable milestones} |

## Alignment with Business Strategy
| Business Objective | Technology Enabler | Status |
|-------------------|-------------------|--------|
| {Business goal} | {How technology enables it} | {Planned/In progress/Done} |
```

---

## Innovation Strategy

```markdown
# Innovation Strategy

## Innovation Vision
{What role does innovation play in the organisation's competitive strategy?}

## Innovation Portfolio
| Category | Allocation | Focus Areas |
|----------|-----------|-------------|
| Core (improve existing) | {e.g., 70%} | {Areas of focus} |
| Adjacent (expand reach) | {e.g., 20%} | {Areas of focus} |
| Transformational (new) | {e.g., 10%} | {Areas of focus} |

## Innovation Process
1. **Ideation** — {How ideas are sourced: hackathons, labs, external partnerships}
2. **Evaluation** — {Criteria for selecting ideas to pursue}
3. **Experimentation** — {How experiments are run: time-boxed, budget-capped}
4. **Scaling** — {How successful experiments become products/capabilities}
5. **Learning** — {How failures are captured and shared}

## Evaluation Criteria
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Strategic alignment | {High} | {Does it advance the technology vision?} |
| Business impact | {High} | {What is the expected ROI?} |
| Feasibility | {Medium} | {Can we execute with current capabilities?} |
| Time to value | {Medium} | {How quickly can we see results?} |
| Risk | {Low} | {What is the downside?} |

## Current Innovation Initiatives
| Initiative | Stage | Owner | Expected Outcome | Timeline |
|-----------|-------|-------|-----------------|----------|
| {Name} | {Ideation/Experiment/Pilot/Scale} | {Who} | {What} | {When} |
```

---

## Platform Architecture Principles

```markdown
# Platform Architecture Principles

## Core Principles

### Principle 1: {e.g., API-First}
- **Statement:** {Clear, actionable principle}
- **Rationale:** {Why this matters for our context}
- **Implications:** {What this means in practice}
- **Violations:** {What would violate this principle — and when exceptions are acceptable}

### Principle 2: {e.g., Cloud-Native by Default}
- **Statement:** {Clear, actionable principle}
- **Rationale:** {Why this matters}
- **Implications:** {What this means in practice}
- **Violations:** {What would violate this principle}

### Principle 3: {e.g., Security by Design}
- **Statement:** {Clear, actionable principle}
- **Rationale:** {Why this matters}
- **Implications:** {What this means in practice}
- **Violations:** {What would violate this principle}

## Architecture Decision Authority
| Decision Type | Authority | Process |
|--------------|-----------|---------|
| {Platform-level} | {CTO / Architecture board} | {ADR + review} |
| {Service-level} | {Tech lead} | {Team decision + ADR} |
| {Library/tool} | {Individual engineer} | {Guideline compliance} |

## Technology Standards
| Category | Standard | Alternatives Allowed | Approval Required |
|----------|----------|---------------------|-------------------|
| {Language} | {e.g., TypeScript} | {Yes/No} | {Who approves} |
| {Database} | {e.g., PostgreSQL} | {Yes/No} | {Who approves} |
| {Cloud} | {e.g., AWS} | {Yes/No} | {Who approves} |
```

---

## Build vs Buy Decision Matrix

```markdown
# Build vs Buy Analysis — {Capability}

## Capability Description
{What the capability does and why it's needed}

## Options

| Criterion | Build In-House | COTS | Open-Source | SaaS |
|-----------|---------------|------|------------|------|
| Upfront cost | {estimate} | {estimate} | {estimate} | {estimate} |
| Ongoing cost (annual) | {estimate} | {estimate} | {estimate} | {estimate} |
| Time to value | {estimate} | {estimate} | {estimate} | {estimate} |
| Customisation | {High} | {Limited} | {High} | {Low} |
| Maintenance burden | {High} | {Medium} | {Medium} | {Low} |
| Vendor lock-in risk | {None} | {High} | {Low} | {Medium} |
| Strategic differentiation | {High} | {None} | {Low} | {None} |
| Team capability | {Sufficient/Gap} | {N/A} | {Sufficient/Gap} | {N/A} |

## Recommendation
**Chosen option:** {Option}
**Rationale:** {Why this option best fits our context}
**Risk mitigation:** {How to address the main risks of the chosen option}

## Total Cost of Ownership (3-year)
| Cost Category | Year 1 | Year 2 | Year 3 | Total |
|--------------|--------|--------|--------|-------|
| {Licence/development} | {cost} | {cost} | {cost} | {total} |
| {Integration} | {cost} | {cost} | {cost} | {total} |
| {Maintenance} | {cost} | {cost} | {cost} | {total} |
| {Training} | {cost} | {cost} | {cost} | {total} |
| **Total** | **{cost}** | **{cost}** | **{cost}** | **{total}** |
```

---

## Engineering Standards Document

```markdown
# Engineering Standards

## Code Quality
| Standard | Requirement | Tooling |
|----------|-----------|---------|
| Code review | {e.g., All PRs require 1 approval} | {e.g., GitHub PRs} |
| Linting | {e.g., Enforced in CI} | {e.g., ESLint, Prettier} |
| Testing | {e.g., Min 80% coverage for new code} | {e.g., Jest, Playwright} |
| Documentation | {e.g., All public APIs documented} | {e.g., OpenAPI, JSDoc} |

## Development Workflow
1. {Branch strategy: trunk-based, GitFlow, etc.}
2. {PR process: size limits, review requirements}
3. {CI/CD pipeline: stages, quality gates}
4. {Release process: versioning, rollback plan}

## Observability Standards
| Signal | Requirement | Tooling |
|--------|-----------|---------|
| Logging | {e.g., Structured JSON, correlation IDs} | {e.g., ELK, Datadog} |
| Metrics | {e.g., RED metrics for all services} | {e.g., Prometheus, Grafana} |
| Tracing | {e.g., Distributed tracing for all RPCs} | {e.g., Jaeger, Tempo} |
| Alerting | {e.g., PagerDuty for P1, Slack for P2+} | {e.g., PagerDuty} |

## Security Standards
| Area | Requirement |
|------|-----------|
| Authentication | {e.g., OAuth 2.0 / OIDC} |
| Secrets management | {e.g., Vault / cloud KMS, never in code} |
| Dependency scanning | {e.g., Automated in CI} |
| Penetration testing | {e.g., Annual third-party audit} |
```

---

## Development Practices Guide

```markdown
# Development Practices Guide

## Methodology
{e.g., Agile with 2-week sprints, continuous delivery}

## Definition of Done
- [ ] Code reviewed and approved
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Observability instrumented
- [ ] Deployed to staging and verified

## Architecture Decision Records
- All significant technical decisions documented as ADRs
- ADR template: {link to template}
- Storage: {where ADRs live}
- Review process: {who reviews and approves}

## Incident Response
1. {Detection: how incidents are identified}
2. {Triage: severity classification}
3. {Response: who is on call, escalation path}
4. {Resolution: fix and deploy process}
5. {Post-mortem: blameless review, action items}
```

---

## Team Topology Design

```markdown
# Team Topology

## Team Types

### Stream-Aligned Teams
| Team | Domain | Responsibilities | Size |
|------|--------|-----------------|------|
| {Team name} | {Business domain} | {What they own} | {N people} |

### Platform Team
| Team | Scope | Services Provided | Size |
|------|-------|------------------|------|
| {Team name} | {Platform scope} | {What they provide to stream teams} | {N people} |

### Enabling Team
| Team | Focus | How They Help | Size |
|------|-------|--------------|------|
| {Team name} | {Capability focus} | {How they enable other teams} | {N people} |

## Interaction Modes
| Team A | Team B | Mode | Duration |
|--------|--------|------|----------|
| {Team} | {Team} | {Collaboration/X-as-a-Service/Facilitating} | {Temporary/Ongoing} |

## Cognitive Load Assessment
| Team | Services Owned | Dependencies | Load Assessment |
|------|---------------|-------------|----------------|
| {Team} | {count} | {count} | {Sustainable/High/Overloaded} |
```

---

## Technology Governance Framework

```markdown
# Technology Governance Framework

## Decision Rights
| Decision Type | Who Decides | Who Advises | Who Is Informed |
|--------------|------------|-------------|-----------------|
| Technology strategy | {CTO} | {Architecture board} | {Engineering leads} |
| Platform architecture | {CTO + Architecture board} | {Tech leads} | {All engineering} |
| Service architecture | {Tech lead} | {Peers} | {Platform team} |
| Tool/library selection | {Engineer} | {Tech lead} | {Team} |

## Review Processes
| Review | Frequency | Participants | Output |
|--------|-----------|-------------|--------|
| Architecture review | {e.g., Monthly} | {Who} | {Decisions, ADRs} |
| Technology radar review | {e.g., Quarterly} | {Who} | {Updated radar} |
| Technical debt review | {e.g., Quarterly} | {Who} | {Prioritised debt backlog} |
| Strategy review | {e.g., Semi-annually} | {Who} | {Strategy refresh} |

## Compliance
| Requirement | Standard | Verification | Frequency |
|------------|---------|-------------|-----------|
| {Security} | {e.g., SOC 2} | {Audit} | {Annual} |
| {Privacy} | {e.g., GDPR} | {Review} | {Ongoing} |
| {Accessibility} | {e.g., WCAG 2.1 AA} | {Testing} | {Per release} |

## Escalation Path
1. {Team-level decision} → Tech lead resolves
2. {Cross-team impact} → Architecture board reviews
3. {Strategic impact} → CTO decides
4. {Business impact} → CTO + CEO/board
```

---

## Scaling Strategy

```markdown
# Scaling Strategy

## System Scaling
| Component | Current Capacity | Target Capacity | Approach | Timeline |
|-----------|-----------------|----------------|----------|----------|
| {Component} | {current} | {target} | {Horizontal/Vertical/Redesign} | {When} |

## Team Scaling
| Team | Current Size | Target Size | Hiring Plan | Key Roles |
|------|-------------|-------------|-------------|-----------|
| {Team} | {N} | {N} | {Hire/Contract/Train} | {Critical roles} |

## Process Scaling
| Process | Current State | Bottleneck | Solution |
|---------|--------------|-----------|----------|
| {e.g., Code review} | {Works for 5 devs} | {Breaks at 20 devs} | {Codeowners, automated checks} |

## Key Metrics
| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Deployment frequency | {current} | {target} | {How measured} |
| Lead time for changes | {current} | {target} | {How measured} |
| Mean time to recovery | {current} | {target} | {How measured} |
| Change failure rate | {current} | {target} | {How measured} |
```

---

## Technology Radar

```markdown
# Technology Radar

**Last Updated:** {YYYY-MM-DD}

## Adopt
Technologies we have high confidence in and recommend for broad use.

| Technology | Category | Why Adopt | Since |
|-----------|----------|----------|-------|
| {Name} | {Languages/Frameworks/Tools/Platforms} | {Rationale} | {Date} |

## Trial
Technologies worth pursuing in projects that can handle the risk.

| Technology | Category | Why Trial | Experiment |
|-----------|----------|----------|-----------|
| {Name} | {Category} | {Rationale} | {What we're testing} |

## Assess
Technologies worth exploring to understand how they might affect us.

| Technology | Category | Why Assess | Next Step |
|-----------|----------|-----------|----------|
| {Name} | {Category} | {Rationale} | {Research/POC/Vendor demo} |

## Hold
Technologies we have decided not to adopt or to phase out.

| Technology | Category | Why Hold | Migration Plan |
|-----------|----------|---------|---------------|
| {Name} | {Category} | {Rationale} | {If applicable} |

## Radar Change Log
| Date | Technology | Change | Rationale |
|------|-----------|--------|-----------|
| {Date} | {Name} | {e.g., Assess → Trial} | {Why the change} |
```

---

## Innovation Pipeline Tracker

```markdown
# Innovation Pipeline

| ID | Initiative | Stage | Owner | Investment | Expected Value | Status |
|----|-----------|-------|-------|-----------|---------------|--------|
| I-01 | {Name} | {Idea/Experiment/Pilot/Scale/Retired} | {Who} | {Time/money} | {Business value} | {On track/At risk/Blocked} |

## Stage Definitions
- **Idea**: Concept documented, not yet evaluated
- **Experiment**: Time-boxed proof of concept (max {N} weeks, {N} people)
- **Pilot**: Limited production deployment with real users
- **Scale**: Full production rollout
- **Retired**: Experiment did not produce expected results — learnings documented

## Stage Gate Criteria
| From → To | Criteria |
|-----------|----------|
| Idea → Experiment | {Strategic alignment + sponsor + feasibility assessment} |
| Experiment → Pilot | {Positive results + business case + resource commitment} |
| Pilot → Scale | {Measured value + operational readiness + scaling plan} |

## Innovation Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Ideas submitted (quarterly) | {target} | {current} |
| Experiments running | {target} | {current} |
| Experiment-to-pilot conversion | {target %} | {current %} |
| Innovation ROI | {target} | {current} |
```

---

## Technology Budget Template

```markdown
# Technology Budget

**Fiscal Year:** {YYYY}

## Budget Allocation
| Category | Amount | % of Total | Description |
|----------|--------|-----------|-------------|
| Run (keep lights on) | {amount} | {%} | {Infra, licences, support} |
| Build (new capabilities) | {amount} | {%} | {Development, new platforms} |
| Innovate (R&D) | {amount} | {%} | {Experiments, research, POCs} |
| **Total** | **{amount}** | **100%** | |

## Cost Breakdown
| Category | Monthly | Annual | Trend | Notes |
|----------|---------|--------|-------|-------|
| Cloud infrastructure | {cost} | {cost} | {Up/Stable/Down} | {Key drivers} |
| Software licences | {cost} | {cost} | {trend} | {Key contracts} |
| Engineering headcount | {cost} | {cost} | {trend} | {FTE count} |
| Contractors | {cost} | {cost} | {trend} | {Roles} |
| Training & development | {cost} | {cost} | {trend} | {Programs} |

## Cost Optimisation Opportunities
| Opportunity | Estimated Saving | Effort | Timeline |
|------------|-----------------|--------|----------|
| {e.g., Reserved instances} | {amount/year} | {Low/Med/High} | {When} |

## ROI Tracking
| Investment | Cost | Expected Return | Actual Return | Status |
|-----------|------|----------------|--------------|--------|
| {Initiative} | {cost} | {expected value} | {actual value} | {On track/Behind/Exceeded} |
```

---

## Risk Assessment

```markdown
# Technology Risk Assessment

| ID | Risk | Category | Likelihood | Impact | Severity | Mitigation | Owner |
|----|------|----------|-----------|--------|----------|------------|-------|
| R-01 | {Risk description} | {Security/Technical/Operational/Talent/Vendor} | {H/M/L} | {H/M/L} | {H/M/L} | {How to mitigate} | {Who} |

## Severity Matrix
|  | Low Impact | Medium Impact | High Impact |
|--|-----------|--------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |

## Risk Categories
- **Security**: Data breaches, vulnerabilities, compliance failures
- **Technical**: System failures, scalability limits, obsolescence
- **Operational**: Key person dependency, process failures
- **Talent**: Hiring difficulties, retention, skill gaps
- **Vendor**: Supplier failure, lock-in, price increases

## Accepted Risks
- {Risks accepted with justification and monitoring plan}
```
