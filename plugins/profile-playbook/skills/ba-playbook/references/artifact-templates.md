# BA Artifact Templates

Ready-to-use templates for all BA deliverables. Adapt to context — not every section is needed for every project.

---

## Problem Statement

```markdown
# Problem Statement

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Status:** {Draft | Review | Approved}

## Problem Definition

{Clear, concise description of the problem. What is happening that should not be, or what is not happening that should be?}

## Who Is Affected

| Stakeholder Group | How They Are Affected | Estimated Scale |
|--------------------|----------------------|-----------------|
| {User group} | {Impact on their work/experience} | {Number of people, frequency} |

## Current Impact

- **Operational:** {How does this problem affect daily operations?}
- **Financial:** {Estimated cost of the problem — lost revenue, waste, rework}
- **Customer:** {How does this affect customer satisfaction or retention?}
- **Compliance:** {Any regulatory or compliance exposure?}

## Desired State

{Describe what "solved" looks like. What should the future state be once this problem is addressed?}

## Success Criteria

| Criterion | Baseline (Current) | Target | How to Measure |
|-----------|-------------------|--------|----------------|
| {Metric 1} | {Current value} | {Target value} | {Measurement method} |
| {Metric 2} | {Current value} | {Target value} | {Measurement method} |

## Scope Boundaries

- **In scope:** {What this problem statement covers}
- **Out of scope:** {What it explicitly does not cover}

## Assumptions

- {Assumption 1}
- {Assumption 2}
```

---

## Stakeholder Map

```markdown
# Stakeholder Map

## Stakeholder Register

| Name/Title | Role | Key Concerns | Influence | Interest | Preferred Communication |
|------------|------|-------------|-----------|----------|------------------------|
| {Name} | {Sponsor/User/SME/Regulator/...} | {What they care about} | {High/Medium/Low} | {High/Medium/Low} | {Format, frequency} |

## Influence-Interest Matrix

|  | Low Interest | High Interest |
|--|-------------|---------------|
| **High Influence** | Keep Satisfied: {names} | Manage Closely: {names} |
| **Low Influence** | Monitor: {names} | Keep Informed: {names} |

## Stakeholder Groups

### Decision Makers
- {List stakeholders who approve deliverables and sign off on requirements}

### Subject Matter Experts
- {List stakeholders who provide domain knowledge}

### End Users
- {List end-user groups and their primary needs}

### Affected Parties
- {List teams/departments/systems impacted by the change}

## Communication Plan

| Stakeholder/Group | Information Need | Format | Frequency | Owner |
|-------------------|-----------------|--------|-----------|-------|
| {Decision Makers} | {Status, decisions needed} | {Meeting/Report} | {Weekly} | {BA name} |
| {End Users} | {Progress, upcoming changes} | {Newsletter/Demo} | {Bi-weekly} | {BA name} |
| {SMEs} | {Detailed requirements review} | {Workshop} | {As needed} | {BA name} |
```

---

## As-Is / To-Be Analysis

```markdown
# As-Is / To-Be Analysis — {Process or Capability Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}

## Current State (As-Is)

### Description
{Narrative description of how things work today}

### Current Process Summary
| Step | Actor | Action | System/Tool | Issues |
|------|-------|--------|-------------|--------|
| {1} | {Who} | {What they do} | {Tool used} | {Pain point} |

### Pain Points
| # | Pain Point | Impact | Frequency | Affected Users |
|---|-----------|--------|-----------|----------------|
| 1 | {Description} | {High/Medium/Low} | {Daily/Weekly/Monthly} | {Who} |

### Current Metrics
| Metric | Current Value | Notes |
|--------|-------------|-------|
| {Processing time} | {Value} | {Context} |
| {Error rate} | {Value} | {Context} |

## Future State (To-Be)

### Vision
{Description of the desired future state and how it addresses the pain points}

### Future Process Summary
| Step | Actor | Action | System/Tool | Improvement |
|------|-------|--------|-------------|-------------|
| {1} | {Who} | {What they do} | {Tool used} | {What changes and why} |

### Expected Improvements
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| {Processing time} | {Current value} | {Target value} | {Expected gain} |

## Gap Analysis

| Gap | As-Is | To-Be | Action Required | Priority |
|-----|-------|-------|----------------|----------|
| {Gap 1} | {Current state} | {Desired state} | {What must change} | {High/Medium/Low} |

## Transition Considerations

- **Dependencies:** {What must be in place before the transition}
- **Risks:** {Key risks during transition}
- **Phasing:** {Can the transition be staged? How?}
- **Training:** {What training or change management is needed}
- **Rollback:** {What happens if the transition fails}
```

---

## Requirements Document

```markdown
# Requirements Document — {Project/Feature Name}

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Status:** {Draft | Review | Approved}

## 1. Introduction

### Purpose
{Why this requirements document exists}

### Scope
- **In scope:** {What is covered}
- **Out of scope:** {What is not covered}

### Audience
{Who should read this document}

## 2. Functional Requirements

### {Domain/Module 1}

| ID | Requirement | Priority | Source | Acceptance Criteria |
|----|-------------|----------|--------|-------------------|
| FR-{01} | {The system shall...} | {Must/Should/Could} | {Stakeholder/Workshop/...} | {How to verify} |

### {Domain/Module 2}

| ID | Requirement | Priority | Source | Acceptance Criteria |
|----|-------------|----------|--------|-------------------|
| FR-{10} | {The system shall...} | {Must/Should/Could} | {Stakeholder/Workshop/...} | {How to verify} |

## 3. Non-Functional Requirements

| ID | Category | Requirement | Measurable Target | Priority |
|----|----------|-------------|-------------------|----------|
| NFR-{01} | {Performance} | {Description} | {Specific metric} | {Must/Should/Could} |
| NFR-{02} | {Security} | {Description} | {Specific metric} | {Must/Should/Could} |
| NFR-{03} | {Usability} | {Description} | {Specific metric} | {Must/Should/Could} |

## 4. Constraints

| Type | Constraint | Impact |
|------|-----------|--------|
| {Technical} | {Description} | {How it affects the solution} |
| {Regulatory} | {Description} | {How it affects the solution} |
| {Budget} | {Description} | {How it affects the solution} |
| {Timeline} | {Description} | {How it affects the solution} |

## 5. Assumptions

| # | Assumption | Impact If Wrong | Validated By |
|---|-----------|----------------|-------------|
| 1 | {Assumption} | {Consequence} | {Who/When} |

## 6. Dependencies

| # | Dependency | Type | Owner | Status |
|---|-----------|------|-------|--------|
| 1 | {Description} | {Internal/External} | {Team/Vendor} | {Confirmed/Pending} |

## 7. Traceability Matrix

| Requirement ID | Business Objective | Test Case | User Story | Status |
|---------------|-------------------|-----------|------------|--------|
| FR-{01} | {Objective} | TC-{01} | US-{01} | {Draft/Approved/Implemented} |

## Appendices

- Glossary of terms
- Reference documents
```

---

## Business Model Canvas

```markdown
# Business Model Canvas — {Product/Initiative Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}

## Key Partners
- {Partner 1 — what they provide and why the partnership matters}
- {Partner 2 — what they provide and why the partnership matters}

## Key Activities
- {Activity 1 — core action required to deliver the value proposition}
- {Activity 2 — core action required to deliver the value proposition}

## Key Resources
- {Resource 1 — people, technology, IP, financial}
- {Resource 2 — people, technology, IP, financial}

## Value Propositions
- {Value 1 — what problem is solved, what need is met, for whom}
- {Value 2 — what differentiates this from alternatives}

## Customer Relationships
- {Relationship type 1 — self-service, dedicated support, community, co-creation}
- {How is the relationship established, maintained, and grown?}

## Channels
- {Channel 1 — how the value proposition is delivered to customers}
- {Channel 2 — awareness, evaluation, purchase, delivery, after-sales}

## Customer Segments
- {Segment 1 — who are the target customers, what are their characteristics}
- {Segment 2 — mass market, niche, segmented, diversified}

## Cost Structure
| Cost Category | Description | Type | Estimated Amount |
|--------------|-------------|------|-----------------|
| {Category} | {What drives this cost} | {Fixed/Variable} | {Estimate or range} |

## Revenue Streams
| Revenue Source | Description | Model | Estimated Value |
|---------------|-------------|-------|----------------|
| {Source} | {How revenue is generated} | {Subscription/Transaction/License/...} | {Estimate or range} |

## Assumptions to Validate
- {Key assumption 1 — how to validate}
- {Key assumption 2 — how to validate}
```

---

## Feasibility Assessment

```markdown
# Feasibility Assessment — {Initiative/Option Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Status:** {Draft | Review | Approved}

## Executive Summary

{Brief overview of the initiative and the assessment conclusion}

## Options Under Evaluation

| Option | Description | Estimated Cost | Estimated Timeline |
|--------|-------------|---------------|-------------------|
| {Option A} | {Brief description} | {Cost range} | {Duration} |
| {Option B} | {Brief description} | {Cost range} | {Duration} |
| {Option C} | {Brief description} | {Cost range} | {Duration} |

## Feasibility Evaluation

### Technical Feasibility

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Technology maturity | {High/Medium/Low} | {H/M/L} | {H/M/L} |
| Integration complexity | {H/M/L} | {H/M/L} | {H/M/L} |
| Team capability | {H/M/L} | {H/M/L} | {H/M/L} |
| Infrastructure readiness | {H/M/L} | {H/M/L} | {H/M/L} |
| **Technical feasibility** | **{Feasible/Marginal/Not feasible}** | **{...}** | **{...}** |

### Business Feasibility

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Strategic alignment | {H/M/L} | {H/M/L} | {H/M/L} |
| Market demand | {H/M/L} | {H/M/L} | {H/M/L} |
| ROI potential | {H/M/L} | {H/M/L} | {H/M/L} |
| Time to value | {H/M/L} | {H/M/L} | {H/M/L} |
| **Business feasibility** | **{Feasible/Marginal/Not feasible}** | **{...}** | **{...}** |

### Operational Feasibility

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Process change required | {H/M/L} | {H/M/L} | {H/M/L} |
| User adoption risk | {H/M/L} | {H/M/L} | {H/M/L} |
| Organizational readiness | {H/M/L} | {H/M/L} | {H/M/L} |
| Support model | {H/M/L} | {H/M/L} | {H/M/L} |
| **Operational feasibility** | **{Feasible/Marginal/Not feasible}** | **{...}** | **{...}** |

## Cost/Benefit Analysis

| Item | Option A | Option B | Option C |
|------|----------|----------|----------|
| Implementation cost | {$} | {$} | {$} |
| Annual operating cost | {$} | {$} | {$} |
| Expected annual benefit | {$} | {$} | {$} |
| Payback period | {months} | {months} | {months} |
| 3-year net benefit | {$} | {$} | {$} |

## Risk Analysis

| Risk | Likelihood | Impact | Affected Options | Mitigation |
|------|-----------|--------|-----------------|------------|
| {Risk 1} | {H/M/L} | {H/M/L} | {A, B} | {How to mitigate} |

## Recommendation

**Recommended option:** {Option X}

**Rationale:** {Why this option best balances feasibility, cost/benefit, and risk}

**Conditions for success:** {What must be true for this option to succeed}

**Next steps:** {Immediate actions if this recommendation is approved}
```

---

## Process Map

```markdown
# Process Map — {Process Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Process Owner:** {Name/Role}

## Process Overview

- **Process name:** {Name}
- **Purpose:** {What this process achieves}
- **Trigger:** {What initiates this process}
- **Input:** {What is needed to start}
- **Output:** {What is produced at the end}
- **Frequency:** {How often this process runs}

## Process Steps

| Step | Actor | Action | System/Tool | Input | Output | Notes |
|------|-------|--------|-------------|-------|--------|-------|
| 1 | {Who} | {What they do} | {System used} | {What they need} | {What they produce} | {Conditions, rules} |
| 2 | {Who} | {What they do} | {System used} | {What they need} | {What they produce} | {Conditions, rules} |

## Decision Points

| # | Decision | Criteria | Yes Path | No Path |
|---|----------|----------|----------|---------|
| D1 | {Question to be answered} | {How the decision is made} | {Go to step X} | {Go to step Y} |

## Exceptions and Error Handling

| # | Exception | Trigger | Handling Procedure | Escalation |
|---|-----------|---------|-------------------|------------|
| E1 | {What can go wrong} | {When it happens} | {How to handle it} | {Who to escalate to} |

## SLA / KPI

| Metric | Target | Current | Measurement Method |
|--------|--------|---------|-------------------|
| {End-to-end processing time} | {Target value} | {Current value} | {How measured} |
| {Error rate} | {Target value} | {Current value} | {How measured} |
| {Throughput} | {Target value} | {Current value} | {How measured} |

## RACI Matrix

| Activity | {Role A} | {Role B} | {Role C} | {Role D} |
|----------|----------|----------|----------|----------|
| {Activity 1} | R | A | C | I |
| {Activity 2} | I | R | A | C |
```

---

## Data Model

```markdown
# Data Model — {System/Domain Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}

## Entity Definitions

| Entity | Description | Key Attributes | Owner |
|--------|-------------|---------------|-------|
| {Entity 1} | {What it represents} | {Primary key, core fields} | {Team/System} |
| {Entity 2} | {What it represents} | {Primary key, core fields} | {Team/System} |

## Relationship Table

| Entity A | Relationship | Entity B | Cardinality | Description |
|----------|-------------|----------|-------------|-------------|
| {Entity 1} | {has many} | {Entity 2} | {1:N} | {Business meaning} |
| {Entity 2} | {belongs to} | {Entity 3} | {N:1} | {Business meaning} |

## Data Dictionary

| Entity | Attribute | Type | Required | Description | Validation Rules | Example |
|--------|-----------|------|----------|-------------|-----------------|---------|
| {Entity 1} | {attribute_name} | {String/Integer/Date/...} | {Yes/No} | {What it means} | {Constraints} | {Sample value} |

## Data Flow

| Source | Destination | Data Transferred | Trigger | Frequency | Format |
|--------|------------|-----------------|---------|-----------|--------|
| {System A} | {System B} | {What data moves} | {Event/Schedule} | {Real-time/Daily/...} | {API/File/Message} |

## Data Quality Rules

| # | Rule | Entity/Attribute | Description | Action on Violation |
|---|------|-----------------|-------------|-------------------|
| 1 | {Rule name} | {What it applies to} | {What must be true} | {Reject/Flag/Default} |

## Data Retention

| Data Category | Retention Period | Archival Policy | Deletion Policy |
|---------------|-----------------|----------------|----------------|
| {Category} | {Duration} | {Where archived} | {How deleted} |
```

---

## UX Analysis

```markdown
# UX Analysis — {Product/Feature Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}

## User Groups

| User Group | Description | Technical Proficiency | Usage Frequency | Key Goals |
|-----------|-------------|---------------------|----------------|-----------|
| {Group 1} | {Who they are} | {Novice/Intermediate/Expert} | {Daily/Weekly/Occasional} | {What they want to accomplish} |

## Key Tasks

| # | Task | User Group | Frequency | Current Steps | Pain Level |
|---|------|-----------|-----------|--------------|------------|
| 1 | {Task description} | {Group} | {How often} | {Number of steps} | {High/Medium/Low} |

## Pain Points

| # | Pain Point | User Group | Severity | Frequency | Root Cause |
|---|-----------|-----------|----------|-----------|------------|
| 1 | {Description} | {Group} | {High/Medium/Low} | {How often encountered} | {Why it happens} |

## Usability Findings

| # | Finding | Source | Severity | Affected Tasks | Evidence |
|---|---------|--------|----------|---------------|----------|
| 1 | {What was observed} | {User interview/Survey/Analytics/...} | {Critical/Major/Minor} | {Task numbers} | {Data supporting the finding} |

## Recommendations

| # | Recommendation | Addresses Pain Point | Effort | Impact | Priority |
|---|---------------|---------------------|--------|--------|----------|
| 1 | {What to change} | {Pain point number} | {High/Medium/Low} | {High/Medium/Low} | {Must/Should/Could} |

## User Journey Summary

### {Scenario Name}
1. **Entry point:** {How the user begins}
2. **Steps:** {Key steps in the journey}
3. **Decision points:** {Where the user must choose}
4. **Exit point:** {How the journey ends}
5. **Emotion curve:** {Positive/Neutral/Negative at each stage}
```

---

## Solution Options Paper

```markdown
# Solution Options Paper — {Decision Area}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Decision deadline:** {Date}

## Context

{Business context and why a decision is needed}

## Evaluation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| {Cost} | {High/Medium/Low} | {What "good" looks like for this criterion} |
| {Time to deliver} | {High/Medium/Low} | {What "good" looks like} |
| {Risk} | {High/Medium/Low} | {What "good" looks like} |
| {Fit with strategy} | {High/Medium/Low} | {What "good" looks like} |
| {User impact} | {High/Medium/Low} | {What "good" looks like} |

## Options Comparison

| Criterion | Option A: {Name} | Option B: {Name} | Option C: {Name} |
|-----------|------------------|------------------|------------------|
| Description | {Brief summary} | {Brief summary} | {Brief summary} |
| Cost | {Rating + notes} | {Rating + notes} | {Rating + notes} |
| Time to deliver | {Rating + notes} | {Rating + notes} | {Rating + notes} |
| Risk | {Rating + notes} | {Rating + notes} | {Rating + notes} |
| Fit with strategy | {Rating + notes} | {Rating + notes} | {Rating + notes} |
| User impact | {Rating + notes} | {Rating + notes} | {Rating + notes} |

## Detailed Option Analysis

### Option A: {Name}
- **Description:** {What this option entails}
- **Pros:** {Advantages}
- **Cons:** {Disadvantages}
- **Risks:** {Key risks}
- **Dependencies:** {What this option requires}

### Option B: {Name}
- **Description:** {What this option entails}
- **Pros:** {Advantages}
- **Cons:** {Disadvantages}
- **Risks:** {Key risks}
- **Dependencies:** {What this option requires}

### Option C: {Name}
- **Description:** {What this option entails}
- **Pros:** {Advantages}
- **Cons:** {Disadvantages}
- **Risks:** {Key risks}
- **Dependencies:** {What this option requires}

## Recommendation

**Recommended option:** {Option X}

**Rationale:** {Why this option scores best against the weighted criteria}

**Trade-offs accepted:** {What is sacrificed by choosing this option}

**Next steps if approved:** {Immediate actions}
```

---

## Acceptance Criteria

```markdown
# Acceptance Criteria — {Release/Sprint Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}

## Epic: {Epic Name}

### Feature: {Feature Name}
**User Story:** As a {role}, I want to {action}, so that {benefit}

#### Scenario 1: {Scenario Name}
- **Given** {precondition}
- **When** {action taken}
- **Then** {expected outcome}

#### Scenario 2: {Scenario Name}
- **Given** {precondition}
- **And** {additional precondition}
- **When** {action taken}
- **Then** {expected outcome}
- **And** {additional expected outcome}

#### Scenario 3: {Edge Case / Error Case}
- **Given** {precondition}
- **When** {invalid or exceptional action}
- **Then** {expected error handling or outcome}

### Feature: {Feature Name 2}
**User Story:** As a {role}, I want to {action}, so that {benefit}

#### Scenario 1: {Scenario Name}
- **Given** {precondition}
- **When** {action taken}
- **Then** {expected outcome}

## Epic: {Epic Name 2}

### Feature: {Feature Name 3}
**User Story:** As a {role}, I want to {action}, so that {benefit}

#### Scenario 1: {Scenario Name}
- **Given** {precondition}
- **When** {action taken}
- **Then** {expected outcome}

## Non-Functional Acceptance Criteria

| Category | Criterion | Target |
|----------|----------|--------|
| {Performance} | {Description} | {Measurable target} |
| {Accessibility} | {Description} | {Standard to meet} |
| {Security} | {Description} | {Requirement} |
```

---

## Test Plan

```markdown
# Test Plan — {Project/Release Name}

**Version:** {1.0}
**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Approver:** {QA Lead/PM}

## 1. Test Scope

### In Scope
- {Feature/function 1}
- {Feature/function 2}

### Out of Scope
- {What will not be tested and why}

## 2. Test Approach

| Test Type | Description | Responsibility | Environment |
|-----------|-------------|---------------|-------------|
| {Unit testing} | {What is covered} | {Dev team} | {Dev} |
| {Integration testing} | {What is covered} | {Dev/QA} | {Staging} |
| {System testing} | {What is covered} | {QA} | {Staging} |
| {UAT} | {What is covered} | {Business users} | {UAT} |
| {Regression testing} | {What is covered} | {QA} | {Staging} |

## 3. Entry/Exit Criteria

### Entry Criteria
- {Code complete and deployed to test environment}
- {Test data prepared}
- {Test cases reviewed and approved}

### Exit Criteria
- {All critical test cases passed}
- {No open Severity 1 or 2 defects}
- {Test coverage meets target: {X}%}

## 4. Test Cases

| TC ID | Feature | Test Case Description | Precondition | Steps | Expected Result | Priority | Status |
|-------|---------|----------------------|-------------|-------|----------------|----------|--------|
| TC-{01} | {Feature} | {What is being tested} | {Setup needed} | {Step-by-step} | {What should happen} | {Critical/High/Medium/Low} | {Not started/In progress/Pass/Fail} |

## 5. Risk-Based Testing Priority

| Risk | Likelihood | Impact | Affected Feature | Testing Priority | Approach |
|------|-----------|--------|-----------------|-----------------|----------|
| {Risk 1} | {H/M/L} | {H/M/L} | {Feature} | {Critical} | {Extra test coverage, edge cases} |

## 6. Defect Management

- **Tool:** {Jira/Azure DevOps/...}
- **Severity levels:** Critical / High / Medium / Low
- **SLA:** {Critical: fix within 24h, High: fix within 3 days, ...}
- **Retest process:** {How retesting is handled}

## 7. Test Schedule

| Phase | Start Date | End Date | Milestone |
|-------|-----------|---------|-----------|
| {Test preparation} | {Date} | {Date} | {Test cases ready} |
| {System testing} | {Date} | {Date} | {System test complete} |
| {UAT} | {Date} | {Date} | {UAT sign-off} |
```

---

## Change Impact Assessment

```markdown
# Change Impact Assessment — {Change/Initiative Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Status:** {Draft | Review | Approved}

## Change Summary

{Brief description of the change and its business driver}

## Affected Stakeholders

| Stakeholder Group | Nature of Impact | Severity | Readiness |
|-------------------|-----------------|----------|-----------|
| {Group 1} | {How they are affected} | {High/Medium/Low} | {Ready/Needs preparation/At risk} |

## Process Changes

| Process | Current State | Future State | Change Type | Complexity |
|---------|-------------|-------------|-------------|------------|
| {Process 1} | {How it works now} | {How it will work} | {New/Modified/Eliminated} | {High/Medium/Low} |

## System/Technology Changes

| System | Change Description | Downtime Required | Data Migration |
|--------|-------------------|-------------------|----------------|
| {System 1} | {What changes} | {Yes/No — duration} | {Yes/No — scope} |

## Training Needs

| Audience | Training Topic | Format | Duration | Timeline |
|----------|---------------|--------|----------|----------|
| {Group 1} | {What they need to learn} | {Workshop/E-learning/Job aid/...} | {Hours/Days} | {Before/During/After go-live} |

## Communication Plan

| Audience | Message | Channel | Timing | Owner |
|----------|---------|---------|--------|-------|
| {Group 1} | {Key message} | {Email/Town hall/Intranet/...} | {When} | {Who sends it} |

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy | Owner |
|------|-----------|--------|-------------------|-------|
| {Resistance to change} | {H/M/L} | {H/M/L} | {Mitigation approach} | {Who} |
| {Knowledge loss during transition} | {H/M/L} | {H/M/L} | {Mitigation approach} | {Who} |

## Rollback Plan

{What happens if the change must be reversed? Steps, timeline, and decision criteria for rollback.}
```

---

## Handoff Package

```markdown
# Handoff Package — {Project/Phase Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Recipient:** {Team/Role receiving the handoff}

## Summary of Deliverables

| # | Deliverable | Location | Status | Notes |
|---|------------|----------|--------|-------|
| 1 | {Requirements document} | {Link/Path} | {Complete/Partial} | {Any caveats} |
| 2 | {Process maps} | {Link/Path} | {Complete/Partial} | {Any caveats} |
| 3 | {Data model} | {Link/Path} | {Complete/Partial} | {Any caveats} |
| 4 | {Acceptance criteria} | {Link/Path} | {Complete/Partial} | {Any caveats} |

## Outstanding Items

| # | Item | Description | Priority | Expected Completion | Owner |
|---|------|-------------|----------|-------------------|-------|
| 1 | {Outstanding item} | {What remains to be done} | {High/Medium/Low} | {Date or milestone} | {Who} |

## Known Issues

| # | Issue | Impact | Workaround | Resolution Plan |
|---|-------|--------|-----------|----------------|
| 1 | {Issue description} | {How it affects the project} | {Temporary solution if any} | {Planned resolution} |

## Key Decisions Made

| # | Decision | Date | Rationale | Decision Maker |
|---|----------|------|-----------|---------------|
| 1 | {Decision} | {Date} | {Why this was decided} | {Who approved} |

## Contacts

| Role | Name | Responsibility | Contact |
|------|------|---------------|---------|
| {BA} | {Name} | {What they can help with} | {Email/Slack} |
| {Product Owner} | {Name} | {What they can help with} | {Email/Slack} |
| {Tech Lead} | {Name} | {What they can help with} | {Email/Slack} |
| {SME} | {Name} | {Domain expertise area} | {Email/Slack} |

## Next Steps

| # | Action | Owner | Deadline | Dependency |
|---|--------|-------|----------|------------|
| 1 | {Next action} | {Who} | {When} | {What it depends on} |

## Lessons Learned

- {What went well}
- {What could be improved}
- {Recommendations for future phases}
```

---

## Benefits Realization Plan

```markdown
# Benefits Realization Plan — {Initiative Name}

**Date:** {YYYY-MM-DD}
**Author:** {BA name}
**Sponsor:** {Executive sponsor}

## Expected Benefits

| # | Benefit | Category | Description | Tangible/Intangible |
|---|---------|----------|-------------|-------------------|
| B1 | {Benefit name} | {Financial/Operational/Customer/Strategic} | {Detailed description} | {Tangible/Intangible} |

## Measurement Approach

| Benefit | KPI/Metric | Measurement Method | Data Source | Frequency |
|---------|-----------|-------------------|------------|-----------|
| {B1} | {Specific metric} | {How it is measured} | {Where the data comes from} | {Monthly/Quarterly/...} |

## Baseline and Targets

| Benefit | Baseline Value | Baseline Date | 6-Month Target | 12-Month Target | 24-Month Target |
|---------|---------------|--------------|----------------|----------------|----------------|
| {B1} | {Current value} | {Date measured} | {Target} | {Target} | {Target} |

## Realization Timeline

| Benefit | Expected Start | Ramp-Up Period | Full Realization | Dependencies |
|---------|---------------|---------------|-----------------|-------------|
| {B1} | {When benefit begins} | {How long to reach full value} | {When full value expected} | {What must be in place} |

## Benefit Owners

| Benefit | Owner | Role | Accountability |
|---------|-------|------|---------------|
| {B1} | {Name} | {Title} | {What they are responsible for delivering} |

## Risks to Realization

| Risk | Affected Benefit | Likelihood | Impact | Mitigation |
|------|-----------------|-----------|--------|------------|
| {Risk 1} | {B1} | {H/M/L} | {H/M/L} | {How to mitigate} |

## Review Schedule

| Review Point | Date | Reviewer | Focus |
|-------------|------|---------|-------|
| {Post-implementation review} | {Date} | {Who} | {Are early benefits on track?} |
| {6-month review} | {Date} | {Who} | {Benefit realization vs. targets} |
| {12-month review} | {Date} | {Who} | {Full assessment, lessons learned} |

## Reporting Template

| Benefit | Target | Actual | Variance | Status | Commentary |
|---------|--------|--------|----------|--------|-----------|
| {B1} | {Target value} | {Actual value} | {Difference} | {On track/At risk/Off track} | {Explanation} |
```
