# PO Artifact Templates

Ready-to-use templates for all PO deliverables. Adapt to context — not every section is needed for every project.

---

## Product Vision Document

```markdown
# Product Vision — {Product Name}

## Elevator Pitch
For {target customer} who {statement of need/opportunity},
{product name} is a {product category}
that {key benefit/reason to buy}.
Unlike {primary competitive alternative},
our product {statement of primary differentiation}.

## Vision Statement
{2-3 sentences describing the future state this product creates}

## Target Customer Segments
| Segment | Description | Size | Priority |
|---------|-------------|------|----------|
| {Segment 1} | {Who they are} | {TAM/SAM estimate} | {Primary/Secondary} |

## Key Differentiators
1. {What makes this product unique — be specific}
2. {Another differentiator}
3. {Another differentiator}

## Revenue Model
- {How the product generates revenue}
- {Pricing approach}

## Success Vision (12 months)
- {What success looks like}
- {Key milestones}
```

---

## Value Proposition Canvas

```markdown
# Value Proposition Canvas — {Product Name}

## Customer Profile

### Customer Jobs
| Job | Type | Importance |
|-----|------|-----------|
| {What the customer is trying to get done} | {Functional/Social/Emotional} | {Critical/Important/Nice-to-have} |

### Pains
| Pain | Severity | Current Workaround |
|------|----------|-------------------|
| {What annoys/frustrates the customer} | {Extreme/High/Moderate} | {How they cope today} |

### Gains
| Gain | Type | Priority |
|------|------|----------|
| {What the customer would love to achieve} | {Required/Expected/Desired/Unexpected} | {Must/Should/Could} |

## Value Map

### Products & Services
- {What you offer that helps customers get their jobs done}

### Pain Relievers
| Pain | How We Relieve It |
|------|-------------------|
| {Pain from above} | {Specific mechanism} |

### Gain Creators
| Gain | How We Create It |
|------|-----------------|
| {Gain from above} | {Specific mechanism} |

## Fit Assessment
- **Problem-solution fit:** {Do our pain relievers/gain creators address the most important jobs, pains, gains?}
- **Key risks:** {What assumptions need validation?}
```

---

## User Persona

```markdown
# User Persona — {Persona Name}

**Role:** {Job title / role}
**Demographics:** {Age range, technical proficiency, relevant context}
**Quote:** "{A sentence that captures their mindset}"

## Goals
1. {Primary goal — what they want to achieve}
2. {Secondary goal}

## Pain Points
1. {Primary frustration — what blocks them}
2. {Secondary pain point}

## Jobs-to-be-Done
| Job | Context | Desired Outcome |
|-----|---------|----------------|
| {What they need to do} | {When/where/why} | {What "done well" looks like} |

## Behaviors
- {How they currently work}
- {Tools they use}
- {Information sources they trust}

## Success Criteria
- {How this persona defines "this product works for me"}
```

---

## OKR Framework

```markdown
# OKRs — {Product Name} — {Period}

## Objective 1: {Inspiring, qualitative goal}

| # | Key Result | Baseline | Target | Current | Status |
|---|-----------|----------|--------|---------|--------|
| KR1 | {Measurable outcome} | {Starting point} | {Target} | {Current} | {On track/At risk/Behind} |
| KR2 | {Measurable outcome} | {Starting point} | {Target} | {Current} | {Status} |
| KR3 | {Measurable outcome} | {Starting point} | {Target} | {Current} | {Status} |

**Initiatives:**
- {What we will do to achieve these KRs}

## Objective 2: {Another inspiring goal}

| # | Key Result | Baseline | Target | Current | Status |
|---|-----------|----------|--------|---------|--------|
| KR1 | {Measurable outcome} | {Starting point} | {Target} | {Current} | {Status} |

## North Star Metric
**{The single metric that best captures the value you deliver to users}**
- Current: {value}
- Target: {value}
- Why this metric: {explanation}
```

---

## Product Roadmap (Now-Next-Later)

```markdown
# Product Roadmap — {Product Name}

## Now (Current Sprint/Quarter)
**Theme:** {What we are focused on right now}

| Feature/Epic | User Value | Status | Dependencies |
|-------------|-----------|--------|-------------|
| {Feature} | {Why users care} | {In progress/Ready} | {Blockers} |

## Next (Next Quarter)
**Theme:** {What we are planning next}

| Feature/Epic | User Value | Confidence | Dependencies |
|-------------|-----------|------------|-------------|
| {Feature} | {Why users care} | {High/Medium} | {What must happen first} |

## Later (Future)
**Theme:** {Longer-term vision}

| Feature/Epic | User Value | Confidence | Dependencies |
|-------------|-----------|------------|-------------|
| {Feature} | {Why users care} | {Low/Medium} | {What must happen first} |

## Dependencies & Risks
- {Cross-team dependency} — Impact: {what happens if delayed}
- {External dependency} — Mitigation: {contingency plan}

## Notes
- This roadmap is a plan, not a commitment
- "Later" items are directional, not guaranteed
- Roadmap is reviewed and updated {frequency}
```

---

## Prioritization Matrix (RICE)

```markdown
# Prioritization Matrix — {Product Name}

## Scoring Framework: RICE

| # | Feature | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---|---------|-------|--------|-----------|--------|-----------|----------|
| 1 | {Feature name} | {users/quarter} | {0.25/0.5/1/2/3} | {50%/80%/100%} | {person-weeks} | {score} | {P1/P2/P3} |

### Scoring Guide
- **Reach**: How many users will this affect per quarter?
- **Impact**: How much will this affect each user? (0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive)
- **Confidence**: How confident are we in these estimates? (50%=low, 80%=medium, 100%=high)
- **Effort**: Person-weeks of work required

### Formula
RICE Score = (Reach × Impact × Confidence) / Effort

## Prioritization Decision
| Priority | Features | Rationale |
|----------|----------|-----------|
| P1 (Now) | {Features} | {Why these are most important} |
| P2 (Next) | {Features} | {Why these come second} |
| P3 (Later) | {Features} | {Why these can wait} |
| Deferred | {Features} | {Why these are not prioritized} |
```

---

## Prioritization Matrix (MoSCoW)

```markdown
# Prioritization Matrix — MoSCoW — {Product Name}

## Must Have (Non-negotiable for this release)
| Feature | User Value | Justification |
|---------|-----------|---------------|
| {Feature} | {Value} | {Why this is a must — e.g., legal, core functionality} |

## Should Have (Important, not critical)
| Feature | User Value | Justification |
|---------|-----------|---------------|
| {Feature} | {Value} | {Why this is important but can be deferred} |

## Could Have (Desirable, deliver if capacity allows)
| Feature | User Value | Justification |
|---------|-----------|---------------|
| {Feature} | {Value} | {Why this is nice-to-have} |

## Won't Have (Explicitly out of scope for this release)
| Feature | User Value | Reason for Exclusion |
|---------|-----------|---------------------|
| {Feature} | {Value} | {Why this is deferred — not forgotten} |

## Priority Key
- **Must**: Without this, the release has no value or is non-compliant
- **Should**: Important for most users, but workarounds exist
- **Could**: Desirable improvement, minimal impact if missing
- **Won't**: Acknowledged scope, parked for future consideration
```

---

## Product Backlog (User Stories)

```markdown
# Product Backlog — {Product Name}

## Epic: {Epic Name}
**Goal:** {What this epic achieves for users}

### User Story: {Story Title}
**As a** {user persona},
**I want to** {action/capability},
**So that** {benefit/value}.

**Acceptance Criteria:**
- [ ] Given {context}, when {action}, then {expected result}
- [ ] Given {context}, when {action}, then {expected result}

**Priority:** {P1/P2/P3}
**Estimate:** {Story points or T-shirt size}
**Dependencies:** {What must be done first}

---

### User Story: {Another Story Title}
**As a** {user persona},
**I want to** {action/capability},
**So that** {benefit/value}.

**Acceptance Criteria:**
- [ ] Given {context}, when {action}, then {expected result}

**Priority:** {P1/P2/P3}
**Estimate:** {Story points or T-shirt size}
```

---

## Stakeholder Map

```markdown
# Stakeholder Map

| Stakeholder | Role | Key Concerns | Influence | Interest | Communication |
|-------------|------|-------------|-----------|----------|---------------|
| {Name/Title} | {Sponsor/User/Engineering/...} | {What they care about} | {High/Medium/Low} | {High/Medium/Low} | {How often, what format} |

## Influence-Interest Matrix

### High Influence, High Interest (Manage Closely)
- {Stakeholders who need active engagement}

### High Influence, Low Interest (Keep Satisfied)
- {Stakeholders who need periodic updates}

### Low Influence, High Interest (Keep Informed)
- {Stakeholders who want regular updates}

### Low Influence, Low Interest (Monitor)
- {Stakeholders to keep on radar}

## Communication Plan
| Stakeholder Group | Channel | Frequency | Content |
|------------------|---------|-----------|---------|
| {Group} | {Email/Slack/Meeting/Demo} | {Weekly/Bi-weekly/Monthly} | {What to communicate} |
```

---

## Release Plan

```markdown
# Release Plan — {Product Name} — {Release Version}

**Release Date:** {YYYY-MM-DD or target quarter}
**Release Goal:** {One sentence — what this release achieves}

## Scope
| Feature | Status | Owner | Notes |
|---------|--------|-------|-------|
| {Feature} | {Ready/In progress/Blocked} | {Team/Person} | {Any notes} |

## Go/No-Go Criteria
- [ ] All P1 features complete and tested
- [ ] Performance targets met ({specify})
- [ ] Security review passed
- [ ] Documentation updated
- [ ] Stakeholder sign-off received

## Dependencies
| Dependency | Owner | Status | Impact if Delayed |
|-----------|-------|--------|------------------|
| {External API} | {Team} | {On track/At risk} | {What happens} |

## Rollback Plan
- {How to roll back if issues arise}
- {Decision criteria for rollback}

## Post-Release
- Monitor: {Key metrics to watch}
- Support: {Support plan for launch period}
- Review: {Post-release review date}
```

---

## Risk Register

```markdown
# Risk Register — {Product Name}

| ID | Risk | Category | Likelihood | Impact | Severity | Mitigation | Owner | Status |
|----|------|----------|-----------|--------|----------|------------|-------|--------|
| R-01 | {Risk description} | {Market/Technical/Resource/Regulatory} | {H/M/L} | {H/M/L} | {H/M/L} | {How to mitigate} | {Who} | {Open/Mitigated/Accepted} |

## Severity Matrix
|  | Low Impact | Medium Impact | High Impact |
|--|-----------|--------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |

## Top Risks Action Plan
### R-{NN}: {Risk Name}
- **Impact:** {What happens if this occurs}
- **Mitigation:** {Specific actions to reduce likelihood/impact}
- **Contingency:** {What to do if it occurs despite mitigation}
- **Trigger:** {Early warning signs}

## Accepted Risks
- {Risks accepted with justification}
```

---

## Launch Checklist

```markdown
# Launch Checklist — {Product Name} — {Release}

## Pre-Launch (T-{N} days)
- [ ] All go/no-go criteria met
- [ ] Stakeholder sign-off received
- [ ] Support team briefed
- [ ] Documentation published
- [ ] Analytics/tracking configured
- [ ] Communication plan ready (email, blog, social)
- [ ] Rollback plan tested

## Launch Day
- [ ] Deploy to production
- [ ] Verify core user flows
- [ ] Monitor error rates and performance
- [ ] Send launch communications
- [ ] Update status page / changelog

## Post-Launch (T+1 to T+7)
- [ ] Monitor key metrics daily
- [ ] Review user feedback channels
- [ ] Address critical bugs within SLA
- [ ] Publish post-launch metrics report
- [ ] Schedule retrospective

## Post-Launch (T+30)
- [ ] Compare metrics against OKRs
- [ ] Compile lessons learned
- [ ] Update roadmap based on learnings
- [ ] Share results with stakeholders
```

---

## Metrics Dashboard Template

```markdown
# Metrics Dashboard — {Product Name} — {Period}

## North Star Metric
**{Metric name}:** {Current value} (Target: {target}, Previous: {previous})

## Acquisition
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| New users / week | {value} | {target} | {up/down/flat} |
| Sign-up conversion rate | {value} | {target} | {trend} |
| CAC (Customer Acquisition Cost) | {value} | {target} | {trend} |

## Activation
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Onboarding completion rate | {value} | {target} | {trend} |
| Time to first value | {value} | {target} | {trend} |

## Retention
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| D7 retention | {value} | {target} | {trend} |
| D30 retention | {value} | {target} | {trend} |
| Churn rate | {value} | {target} | {trend} |

## Revenue
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| MRR / ARR | {value} | {target} | {trend} |
| ARPU | {value} | {target} | {trend} |
| LTV / CAC ratio | {value} | {target} | {trend} |

## User Satisfaction
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| NPS | {value} | {target} | {trend} |
| CSAT | {value} | {target} | {trend} |

## Key Insights
1. {What the data tells us}
2. {What action to take}
```

---

## Retrospective Template

```markdown
# Retrospective — {Product Name} — {Sprint/Release}

**Date:** {YYYY-MM-DD}
**Participants:** {Who attended}

## What Went Well
- {Positive observation — be specific}
- {Another positive}

## What Could Be Improved
- {Issue or friction point — be specific}
- {Another issue}

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| {Specific action to take} | {Who} | {When} | {Open/Done} |

## Key Metrics This Sprint/Release
| Metric | Planned | Actual | Notes |
|--------|---------|--------|-------|
| Stories completed | {N} | {N} | {Context} |
| Velocity | {N} | {N} | {Context} |
| Bugs found | {N} | {N} | {Context} |

## Decisions Made
- {Decision and rationale}
```

---

## Feasibility Assessment

```markdown
# Feasibility Assessment — {Initiative Name}

## Initiative Summary
{Brief description of what is being assessed}

## Options

### Option A: {Name}
| Dimension | Assessment | Notes |
|-----------|-----------|-------|
| Technical feasibility | {High/Medium/Low} | {Can we build it?} |
| Business viability | {High/Medium/Low} | {Will it generate value?} |
| User desirability | {High/Medium/Low} | {Do users want it?} |
| Time to market | {Weeks/Months} | {How long to deliver?} |
| Cost estimate | {$Range} | {Development + operational} |
| Risk level | {High/Medium/Low} | {Key risks} |

### Option B: {Name}
| Dimension | Assessment | Notes |
|-----------|-----------|-------|
| Technical feasibility | {High/Medium/Low} | {Notes} |
| Business viability | {High/Medium/Low} | {Notes} |
| User desirability | {High/Medium/Low} | {Notes} |
| Time to market | {Weeks/Months} | {Notes} |
| Cost estimate | {$Range} | {Notes} |
| Risk level | {High/Medium/Low} | {Notes} |

## Recommendation
**Chosen option:** {Option X}
**Rationale:** {Why this option best balances feasibility, viability, and desirability}
**Key risks:** {Top risks and mitigations}
**Next steps:** {What to do next}
```
