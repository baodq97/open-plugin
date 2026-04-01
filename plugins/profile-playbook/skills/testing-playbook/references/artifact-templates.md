# Testing Artifact Templates

Ready-to-use templates for all testing deliverables. Adapt to context — not every section is needed for every project.

---

## Test Context Document

```markdown
# Test Context Document

## Business Drivers
- {Why this testing initiative exists}
- {Business goals it supports}
- {Expected outcomes}

## System Under Test
- **System name:** {name}
- **Description:** {what it does}
- **Architecture:** {high-level architecture overview}
- **Key integrations:** {external systems}

## Scope
- **In scope:** {What testing covers}
- **Out of scope:** {What testing explicitly does not cover}

## Constraints
| Type | Constraint | Impact on Testing |
|------|-----------|-------------------|
| Technical | {e.g., Limited test environments} | {How it affects test approach} |
| Organizational | {e.g., QA team size is 3} | {How it affects coverage} |
| Regulatory | {e.g., GDPR compliance required} | {How it affects test data} |
| Timeline | {e.g., Release in 4 weeks} | {How it affects test scope} |
| Budget | {e.g., No dedicated perf testing tools} | {How it affects test types} |

## Quality Attribute Priorities
1. {Highest priority, e.g., Functionality}
2. {Second priority, e.g., Security}
3. {Third priority, e.g., Performance}
4. {Lower priority, e.g., Usability}
```

---

## Test Strategy

```markdown
# Test Strategy

## Objectives
- {Primary testing objective}
- {Secondary testing objective}

## Risk-Based Approach
| Risk Area | Likelihood | Impact | Test Priority | Test Approach |
|-----------|-----------|--------|--------------|---------------|
| {Area 1} | {H/M/L} | {H/M/L} | {Critical/High/Medium/Low} | {Type of testing} |

## Test Types
| Test Type | Scope | Approach | Tools |
|-----------|-------|----------|-------|
| Functional | {What is covered} | {Manual/Automated/Both} | {Tools used} |
| Integration | {What is covered} | {Approach} | {Tools used} |
| Performance | {What is covered} | {Approach} | {Tools used} |
| Security | {What is covered} | {Approach} | {Tools used} |
| UAT | {What is covered} | {Approach} | {Tools used} |

## Automation Strategy
- **Scope:** {What will be automated}
- **Framework:** {Tools and frameworks}
- **Maintenance:** {Who maintains automated tests}

## Environment Strategy
- {Test environments and their purpose}
- {Test data approach}
```

---

## Test Plan

```markdown
# Test Plan

## Overview
- **Project:** {project name}
- **Release:** {release version}
- **Test plan version:** {version}
- **Prepared by:** {name}
- **Date:** {YYYY-MM-DD}

## Scope
- **In scope:** {features/areas to test}
- **Out of scope:** {features/areas excluded}

## Test Approach
{Summary of test strategy and risk-based prioritization}

## Test Levels
| Level | Scope | Responsibility | Automation |
|-------|-------|---------------|------------|
| Unit | {scope} | {team} | {Yes/No} |
| Integration | {scope} | {team} | {Yes/No} |
| System | {scope} | {team} | {Yes/No} |
| Acceptance | {scope} | {team} | {Yes/No} |

## Entry Criteria
- [ ] {Criterion 1, e.g., Build deployed to test environment}
- [ ] {Criterion 2, e.g., Test data prepared and validated}
- [ ] {Criterion 3, e.g., Test cases reviewed and approved}

## Exit Criteria
- [ ] {Criterion 1, e.g., All critical test cases passed}
- [ ] {Criterion 2, e.g., No open Severity 1 or 2 defects}
- [ ] {Criterion 3, e.g., Test summary report delivered}

## Schedule
| Phase | Start | End | Milestone |
|-------|-------|-----|-----------|
| Test preparation | {date} | {date} | {milestone} |
| Test execution | {date} | {date} | {milestone} |
| UAT | {date} | {date} | {milestone} |
| Test closure | {date} | {date} | {milestone} |

## Resources
| Role | Name | Responsibility |
|------|------|---------------|
| Test lead | {name} | {responsibility} |
| Test analyst | {name} | {responsibility} |
| Business tester | {name} | {responsibility} |

## Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {Risk} | {H/M/L} | {H/M/L} | {Mitigation approach} |
```

---

## Risk-Based Test Prioritization Matrix

```markdown
# Risk-Based Test Prioritization Matrix

## Risk Assessment Criteria
- **Business Impact:** How critical is this feature to the business?
- **Complexity:** How complex is the implementation?
- **Change Frequency:** How often does this area change?
- **Defect History:** How many defects have been found here before?

## Prioritization Matrix

| Feature/Area | Business Impact | Complexity | Change Freq | Defect History | Risk Score | Test Priority |
|-------------|----------------|-----------|-------------|---------------|------------|--------------|
| {Feature 1} | {H/M/L} | {H/M/L} | {H/M/L} | {H/M/L} | {1-16} | {Critical/High/Medium/Low} |

## Risk Score Calculation
- High = 4, Medium = 2, Low = 1
- Risk Score = Impact x Complexity x Change Freq x Defect History
- Critical: score >= 64, High: 16-63, Medium: 4-15, Low: 1-3

## Test Allocation
| Priority | Test Depth | Automation | Regression |
|----------|-----------|------------|------------|
| Critical | Full coverage, edge cases, negative | Full automation | Every build |
| High | Main flows, key boundaries | Selective automation | Every release |
| Medium | Happy path, key scenarios | Manual | Major releases |
| Low | Smoke test only | None | On change only |
```

---

## Test Case Template

```markdown
# Test Case: {TC-NNN}

**Title:** {Brief description of what is being tested}
**Feature:** {Feature or module under test}
**Priority:** {Critical/High/Medium/Low}
**Type:** {Functional/Integration/Performance/Security/UAT}
**Automation status:** {Manual/Automated/To be automated}

## Preconditions
- {Precondition 1}
- {Precondition 2}

## Test Data
| Data Element | Value | Notes |
|-------------|-------|-------|
| {element} | {value} | {notes} |

## Steps
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | {action} | {expected result} |
| 2 | {action} | {expected result} |
| 3 | {action} | {expected result} |

## Postconditions
- {Expected system state after test}
```

---

## Defect Report Template

```markdown
# Defect: {DEF-NNN}

**Title:** {Brief, clear description of the defect}
**Severity:** {1-Critical / 2-Major / 3-Minor / 4-Trivial}
**Priority:** {1-Urgent / 2-High / 3-Medium / 4-Low}
**Status:** {New / Open / In Progress / Fixed / Verified / Closed}
**Found in:** {Version/Build/Environment}
**Found by:** {Tester name}
**Date found:** {YYYY-MM-DD}
**Assigned to:** {Developer name}

## Description
{Detailed description of the defect and its impact}

## Steps to Reproduce
1. {Step 1}
2. {Step 2}
3. {Step 3}

## Expected Result
{What should happen}

## Actual Result
{What actually happened}

## Evidence
- {Screenshot/log file/video link}

## Environment
- **OS:** {operating system}
- **Browser:** {browser and version}
- **Test environment:** {environment name}

## Related Test Case
- {TC-NNN}
```

---

## Test Execution Log

```markdown
# Test Execution Log

**Sprint/Release:** {identifier}
**Environment:** {test environment}
**Period:** {start date} to {end date}

## Daily Summary

### {YYYY-MM-DD}

| Metric | Value |
|--------|-------|
| Tests planned | {N} |
| Tests executed | {N} |
| Tests passed | {N} |
| Tests failed | {N} |
| Tests blocked | {N} |
| Defects raised | {N} |

**Blockers:** {any blocking issues}
**Notes:** {observations, decisions, changes}

## Cumulative Progress

| Test Type | Total | Executed | Passed | Failed | Blocked | Not Run |
|-----------|-------|----------|--------|--------|---------|---------|
| Functional | {N} | {N} | {N} | {N} | {N} | {N} |
| Integration | {N} | {N} | {N} | {N} | {N} | {N} |
| Performance | {N} | {N} | {N} | {N} | {N} | {N} |
| UAT | {N} | {N} | {N} | {N} | {N} | {N} |
```

---

## Test Summary Report

```markdown
# Test Summary Report

**Project:** {project name}
**Release:** {release version}
**Test period:** {start date} to {end date}
**Prepared by:** {name}
**Date:** {YYYY-MM-DD}

## Executive Summary
{2-3 paragraphs: overall quality assessment, key findings, recommendation}

## Test Scope
- **Planned:** {what was planned}
- **Executed:** {what was actually tested}
- **Deviations:** {any changes from the plan}

## Results Summary

| Metric | Value |
|--------|-------|
| Total test cases | {N} |
| Executed | {N} ({%}) |
| Passed | {N} ({%}) |
| Failed | {N} ({%}) |
| Blocked | {N} ({%}) |
| Not executed | {N} ({%}) |

## Defect Summary

| Severity | Found | Fixed | Open | Deferred |
|----------|-------|-------|------|----------|
| Critical | {N} | {N} | {N} | {N} |
| Major | {N} | {N} | {N} | {N} |
| Minor | {N} | {N} | {N} | {N} |
| Trivial | {N} | {N} | {N} | {N} |

## Risk Areas
| Risk Area | Test Result | Residual Risk | Notes |
|-----------|------------|---------------|-------|
| {area} | {Pass/Partial/Fail} | {H/M/L} | {notes} |

## Lessons Learned
- {Lesson 1}
- {Lesson 2}
```

---

## Release Readiness Recommendation

```markdown
# Release Readiness Recommendation

**Release:** {release version}
**Date:** {YYYY-MM-DD}
**Prepared by:** {name}

## Recommendation
**{GO / NO-GO / GO WITH CONDITIONS}**

## Exit Criteria Status
| Criterion | Status | Evidence |
|-----------|--------|----------|
| {criterion} | {Met/Not Met/Partially Met} | {evidence} |

## Quality Assessment
{Summary of quality status based on test results}

## Residual Risks
| Risk | Severity | Mitigation | Accepted By |
|------|----------|------------|------------|
| {risk} | {H/M/L} | {mitigation or workaround} | {stakeholder} |

## Conditions (if GO WITH CONDITIONS)
- {Condition 1}
- {Condition 2}

## Note
This is a testing assessment and recommendation. The release decision is made by delivery/product based on this assessment and business factors.
```

---

## Test Retrospective Template

```markdown
# Test Retrospective

**Project:** {project name}
**Release:** {release version}
**Date:** {YYYY-MM-DD}
**Participants:** {list of participants}

## What Went Well
- {Item 1}
- {Item 2}

## What Did Not Go Well
- {Item 1}
- {Item 2}

## What We Learned
- {Lesson 1}
- {Lesson 2}

## Action Items
| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| {action} | {name} | {H/M/L} | {date} |

## Metrics Review
| Metric | This Release | Previous Release | Trend |
|--------|-------------|-----------------|-------|
| Defect density | {value} | {value} | {better/worse/same} |
| Test execution rate | {value} | {value} | {better/worse/same} |
| Defect escape rate | {value} | {value} | {better/worse/same} |
| Automation coverage | {value} | {value} | {better/worse/same} |

## Process Improvements to Implement
1. {Improvement with expected outcome}
2. {Improvement with expected outcome}
```
