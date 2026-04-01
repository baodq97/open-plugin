# PM Artifact Templates

Ready-to-use templates for all PM deliverables. Adapt to context -- not every section is needed for every project.

---

## Project Brief

```markdown
# Project Brief

## Project Name
{Project name}

## Business Drivers
- {Why this project exists}
- {Business goals it supports}
- {Expected outcomes}

## High-Level Scope
- **In scope:** {What the project will deliver}
- **Out of scope:** {What it explicitly will not deliver}

## Expected Outcomes
- {Outcome 1 with measurable target}
- {Outcome 2 with measurable target}

## Constraints
| Type | Constraint | Impact |
|------|-----------|--------|
| Budget | {e.g., Max $500k total project cost} | {How it affects scope/approach} |
| Timeline | {e.g., Must deliver by Q3} | {How it affects phasing} |
| Resources | {e.g., Team limited to 8 FTEs} | {How it affects parallelism} |
| Regulatory | {e.g., GDPR compliance required} | {How it affects data handling} |
| Dependencies | {e.g., Depends on Platform v2 release} | {How it affects scheduling} |

## Key Assumptions
- {Assumption 1} -- Impact if wrong: {what changes}
- {Assumption 2} -- Impact if wrong: {what changes}

## Key Risks (Initial)
- {Risk 1} -- Likelihood: {H/M/L}, Impact: {H/M/L}
- {Risk 2} -- Likelihood: {H/M/L}, Impact: {H/M/L}
```

---

## Project Charter

```markdown
# Project Charter

**Project Name:** {name}
**Project Manager:** {name}
**Sponsor:** {name}
**Date:** {YYYY-MM-DD}
**Version:** {1.0}
**Status:** {Draft | Approved}

## 1. Project Purpose
{Why this project exists -- the business need}

## 2. Objectives
- {Objective 1 -- SMART format}
- {Objective 2 -- SMART format}

## 3. Scope
### In Scope
- {Deliverable 1}
- {Deliverable 2}

### Out of Scope
- {Exclusion 1}
- {Exclusion 2}

## 4. Success Criteria
| Criterion | Measure | Target |
|-----------|---------|--------|
| {e.g., On time} | {Schedule variance} | {< 5% slippage} |
| {e.g., On budget} | {Cost variance} | {< 10% overrun} |
| {e.g., Quality} | {Defect rate} | {< 2% post-delivery} |
| {e.g., Benefits} | {Revenue increase} | {15% within 6 months} |

## 5. Governance
- **Steering Committee:** {Names, meeting frequency}
- **Decision Authority:** {Who can approve what level of change}
- **Escalation Path:** {PM -> Sponsor -> Steering Committee}
- **Reporting:** {Frequency, format, audience}

## 6. Key Milestones
| Milestone | Target Date | Dependencies |
|-----------|------------|-------------|
| {Milestone 1} | {YYYY-MM-DD} | {None / Milestone X} |
| {Milestone 2} | {YYYY-MM-DD} | {Milestone 1} |

## 7. Budget Summary
| Category | Amount | Notes |
|----------|--------|-------|
| People | {$X} | {FTE count and rates} |
| Technology | {$X} | {Licenses, infrastructure} |
| External | {$X} | {Vendors, contractors} |
| Contingency | {$X} | {% of total} |
| **Total** | {$X} | |

## 8. Key Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {Risk 1} | {H/M/L} | {H/M/L} | {Mitigation strategy} |

## 9. Approvals
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Sponsor | | | |
| PM | | | |
| Steering Committee | | | |
```

---

## Stakeholder Register

```markdown
# Stakeholder Register

| Stakeholder | Role/Title | Interest | Influence | Engagement Strategy | Communication Preference |
|-------------|-----------|----------|-----------|-------------------|------------------------|
| {Name} | {Sponsor/User/Regulator/...} | {What they care about} | {High/Medium/Low} | {Manage closely / Keep satisfied / Keep informed / Monitor} | {Weekly email / Monthly meeting / ...} |

## Stakeholder Groups

### Key Decision Makers
- {List stakeholders who approve project decisions}

### Influencers
- {List stakeholders who shape decisions but don't formally approve}

### Delivery Team
- {List team members and their roles}

### Impacted Parties
- {List teams/departments impacted by the project}

### External Stakeholders
- {List external parties: vendors, regulators, customers}
```

---

## RACI Matrix

```markdown
# RACI Matrix

| Activity | {Role 1} | {Role 2} | {Role 3} | {Role 4} |
|----------|----------|----------|----------|----------|
| {Activity 1} | R | A | C | I |
| {Activity 2} | I | R | A | C |
| {Activity 3} | C | I | R | A |

## Legend
- **R** = Responsible (does the work)
- **A** = Accountable (approves/owns the outcome -- exactly ONE per activity)
- **C** = Consulted (provides input before the work)
- **I** = Informed (notified after the work)

## Rules
- Every activity must have exactly ONE Accountable
- At least ONE Responsible per activity
- If everyone is Consulted, no one is Consulted (be selective)
```

---

## Project Plan (WBS)

```markdown
# Project Plan

**Project:** {name}
**Version:** {1.0}
**Date:** {YYYY-MM-DD}

## Work Breakdown Structure

### WP1: {Work Package Name}
| Task | Owner | Effort | Dependencies | Start | End | Status |
|------|-------|--------|-------------|-------|-----|--------|
| {Task 1.1} | {Name} | {days} | {None} | {date} | {date} | {Not started} |
| {Task 1.2} | {Name} | {days} | {Task 1.1} | {date} | {date} | {Not started} |

### WP2: {Work Package Name}
| Task | Owner | Effort | Dependencies | Start | End | Status |
|------|-------|--------|-------------|-------|-----|--------|
| {Task 2.1} | {Name} | {days} | {WP1} | {date} | {date} | {Not started} |

## Critical Path
{List tasks on the critical path -- any delay here delays the project}

## Milestones
| Milestone | Date | Criteria |
|-----------|------|---------|
| {Milestone 1} | {date} | {What "done" means} |
```

---

## Risk Register (RAID Log)

```markdown
# RAID Log

## Risks

| ID | Risk | Likelihood | Impact | Severity | Mitigation | Owner | Status |
|----|------|-----------|--------|----------|------------|-------|--------|
| R-01 | {Risk description} | {H/M/L} | {H/M/L} | {H/M/L} | {Mitigation strategy} | {Name} | {Open/Mitigated/Closed} |

## Assumptions

| ID | Assumption | Impact if Wrong | Validated | Owner |
|----|-----------|----------------|-----------|-------|
| A-01 | {Assumption} | {What changes} | {Yes/No} | {Name} |

## Issues

| ID | Issue | Priority | Resolution Plan | Owner | Status | Due |
|----|-------|----------|----------------|-------|--------|-----|
| I-01 | {Issue description} | {H/M/L} | {Resolution approach} | {Name} | {Open/Resolved} | {date} |

## Dependencies

| ID | Dependency | Type | Owner | Status | Impact if Delayed |
|----|-----------|------|-------|--------|------------------|
| D-01 | {What we depend on} | {Internal/External} | {Name} | {On track/At risk/Blocked} | {Consequence} |

## Severity Matrix
|  | Low Impact | Medium Impact | High Impact |
|--|-----------|--------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |
```

---

## Budget/Cost Plan

```markdown
# Budget/Cost Plan

**Project:** {name}
**Total Budget:** {$X}
**Contingency:** {$X} ({N}%)

## Cost Breakdown

| Category | Work Package | Planned Cost | Actual Cost | Variance | Notes |
|----------|-------------|-------------|-------------|----------|-------|
| People | {WP1} | {$X} | {$X} | {$X} | {FTE x rate x duration} |
| Technology | {WP2} | {$X} | {$X} | {$X} | {Licenses, cloud costs} |
| External | {WP3} | {$X} | {$X} | {$X} | {Vendor costs} |
| Training | {WP4} | {$X} | {$X} | {$X} | {Team capability building} |
| Contingency | -- | {$X} | {$X} | {$X} | {Reserve for unknowns} |
| **Total** | | **{$X}** | **{$X}** | **{$X}** | |

## Spend Forecast

| Month | Planned Spend | Cumulative Planned | Actual Spend | Cumulative Actual |
|-------|-------------|-------------------|-------------|------------------|
| {Month 1} | {$X} | {$X} | {$X} | {$X} |

## Financial Controls
- Budget variance tolerance: {+/- N%}
- Approval required for spend > {$X}
- Monthly financial review with {Sponsor/Steering Committee}
```

---

## Communication Plan

```markdown
# Communication Plan

| Audience | Information | Format | Frequency | Owner | Channel |
|----------|-----------|--------|-----------|-------|---------|
| Steering Committee | Status, risks, decisions | Formal report + meeting | Monthly | PM | Meeting + email |
| Sponsor | Escalations, major milestones | 1:1 briefing | Bi-weekly | PM | Meeting |
| Delivery Team | Task assignments, priorities | Stand-up / sprint review | Weekly | PM/Scrum Master | Meeting |
| Stakeholders | Progress summary | Newsletter / email | Monthly | PM | Email |
| External partners | Interface updates | Formal correspondence | As needed | PM | Email |

## Escalation Procedures
| Severity | Response Time | Escalation To | Method |
|----------|-------------|--------------|--------|
| Critical | Same day | Sponsor | Phone + email |
| High | 2 business days | PM + Sponsor | Email + meeting |
| Medium | 5 business days | PM | Email |
| Low | Next reporting cycle | Noted in status report | Status report |
```

---

## Status Report

```markdown
# Status Report

**Project:** {name}
**Period:** {date range}
**Author:** {PM name}
**Overall Status:** {GREEN / AMBER / RED}

## RAG Summary

| Dimension | Status | Trend | Commentary |
|-----------|--------|-------|-----------|
| Schedule | {G/A/R} | {Up/Down/Stable} | {Brief explanation} |
| Budget | {G/A/R} | {Up/Down/Stable} | {Brief explanation} |
| Scope | {G/A/R} | {Up/Down/Stable} | {Brief explanation} |
| Quality | {G/A/R} | {Up/Down/Stable} | {Brief explanation} |
| Risk | {G/A/R} | {Up/Down/Stable} | {Brief explanation} |

## Accomplishments This Period
- {What was completed}
- {Milestone achieved}

## Planned Next Period
- {What will be done}
- {Upcoming milestone}

## Risks and Issues
| ID | Description | Severity | Action Required |
|----|-------------|----------|----------------|
| {R/I-XX} | {Description} | {H/M/L} | {Action needed} |

## Decisions Required
| Decision | Needed By | Impact if Delayed |
|----------|----------|------------------|
| {Decision description} | {date} | {Consequence} |

## Budget Summary
| Item | Planned | Actual | Variance |
|------|---------|--------|----------|
| To date | {$X} | {$X} | {$X (+/-N%)} |
| Forecast at completion | {$X} | {$X} | {$X (+/-N%)} |
```

---

## Change Request

```markdown
# Change Request

**CR ID:** CR-{NNN}
**Date:** {YYYY-MM-DD}
**Requested By:** {name}
**Status:** {Submitted | Under Review | Approved | Rejected | Implemented}

## Change Description
{What is being requested and why}

## Justification
{Business reason for the change}

## Impact Analysis

| Dimension | Impact | Details |
|-----------|--------|---------|
| Scope | {None/Low/Medium/High} | {What changes in deliverables} |
| Schedule | {None/Low/Medium/High} | {Days/weeks impact} |
| Budget | {None/Low/Medium/High} | {Cost impact in $} |
| Quality | {None/Low/Medium/High} | {Effect on quality standards} |
| Risk | {None/Low/Medium/High} | {New risks introduced} |

## Options
### Option A: Approve as requested
- **Pros:** {advantages}
- **Cons:** {disadvantages}

### Option B: Modified approach
- **Pros:** {advantages}
- **Cons:** {disadvantages}

### Option C: Reject
- **Pros:** {advantages}
- **Cons:** {disadvantages}

## Recommendation
{Recommended option with rationale}

## Approval
| Role | Name | Decision | Date |
|------|------|----------|------|
| PM | | | |
| Sponsor | | | |
```

---

## Milestone Tracker

```markdown
# Milestone Tracker

**Project:** {name}
**Last Updated:** {YYYY-MM-DD}

| Milestone | Planned Date | Forecast Date | Actual Date | Variance | Status | Notes |
|-----------|-------------|--------------|-------------|----------|--------|-------|
| {Milestone 1} | {date} | {date} | {date} | {+/- days} | {Complete/On track/At risk/Delayed} | {Commentary} |
| {Milestone 2} | {date} | {date} | | {+/- days} | {On track/At risk/Delayed} | {Commentary} |

## Variance Analysis
{For any milestone with variance > X days, explain root cause and corrective action}
```

---

## Project Closure Report

```markdown
# Project Closure Report

**Project:** {name}
**PM:** {name}
**Start Date:** {YYYY-MM-DD}
**End Date:** {YYYY-MM-DD}
**Status:** {Completed / Completed with exceptions / Terminated}

## 1. Executive Summary
{2-3 paragraphs: what was delivered, key achievements, overall assessment}

## 2. Objectives Achievement
| Objective | Target | Actual | Status |
|-----------|--------|--------|--------|
| {Objective 1} | {Target metric} | {Actual metric} | {Met/Partially met/Not met} |

## 3. Deliverables Summary
| Deliverable | Status | Accepted By | Date |
|------------|--------|-------------|------|
| {Deliverable 1} | {Delivered/Partial/Cancelled} | {Name} | {date} |

## 4. Budget Summary
| Category | Budget | Actual | Variance |
|----------|--------|--------|----------|
| Total | {$X} | {$X} | {$X (+/-N%)} |

## 5. Schedule Summary
| Milestone | Planned | Actual | Variance |
|-----------|---------|--------|----------|
| Project end | {date} | {date} | {+/- days} |

## 6. Key Decisions Made
{Summary of major decisions and their outcomes}

## 7. Outstanding Items
| Item | Owner | Target Date | Action Required |
|------|-------|------------|----------------|
| {Item} | {Name} | {date} | {What needs to happen} |

## 8. Formal Closure
| Action | Status |
|--------|--------|
| Deliverables accepted | {Yes/No} |
| Resources released | {Yes/No} |
| Financial accounts closed | {Yes/No} |
| Documentation archived | {Yes/No} |
| Sponsor sign-off | {Yes/No} |
```

---

## Benefits Realization Report

```markdown
# Benefits Realization Report

**Project:** {name}
**Date:** {YYYY-MM-DD}
**Benefits Owner:** {name}

## Benefits Summary

| Benefit | Expected Value | Realized Value | Status | Measurement Method |
|---------|---------------|---------------|--------|-------------------|
| {Benefit 1} | {Quantified target} | {Actual or projected} | {Realized/In progress/Deferred/Not realized} | {How measured} |

## Realized Benefits
{Detail each benefit that has been achieved, with evidence}

## Deferred Benefits
| Benefit | Expected Realization Date | Prerequisites | Measurement Plan |
|---------|--------------------------|---------------|-----------------|
| {Benefit} | {date} | {What needs to happen first} | {How it will be measured} |

## Lessons for Benefits Management
- {What worked well in benefits tracking}
- {What could be improved}
```

---

## Lessons Learned Template

```markdown
# Lessons Learned

**Project:** {name}
**Date:** {YYYY-MM-DD}
**Facilitator:** {name}
**Participants:** {list}

## What Went Well
| Area | Lesson | Evidence | Recommendation |
|------|--------|----------|---------------|
| {e.g., Planning} | {What worked and why} | {Specific example} | {How to repeat in future projects} |

## What Could Be Improved
| Area | Lesson | Evidence | Recommendation |
|------|--------|----------|---------------|
| {e.g., Communication} | {What didn't work and why} | {Specific example} | {Specific, actionable recommendation} |

## Surprises
| Surprise | Impact | How We Responded | Recommendation |
|----------|--------|-----------------|---------------|
| {Unexpected event} | {Positive/Negative} | {What we did} | {How to prepare next time} |

## Key Recommendations for Future Projects
1. {Specific, actionable recommendation}
2. {Specific, actionable recommendation}
3. {Specific, actionable recommendation}
```
