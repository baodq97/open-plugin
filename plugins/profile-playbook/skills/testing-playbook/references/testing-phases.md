# Testing Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Understand the test context, identify stakeholders, map risks, and clarify what needs to be tested and why.

### Conversation Guide

Start with these questions (adapt to context):

1. **Problem space**: "What is being built or changed? What triggered this testing initiative?"
2. **Stakeholders**: "Who are the key stakeholders? Who will accept the test results? Who are the end users?"
3. **Existing landscape**: "What systems exist today? What test infrastructure is already in place?"
4. **Constraints**: "What are the hard constraints? (timeline, environments, test data, compliance)"
5. **Quality priorities**: "Which quality attributes matter most? (functionality, performance, security, usability)"
6. **Risk areas**: "Where are the highest-risk areas? What has failed before? What is new or complex?"

### Activities Checklist

- [ ] Identify all stakeholders and their testing concerns
- [ ] Document test context and business drivers
- [ ] Map existing test landscape (if applicable)
- [ ] Identify quality attribute priorities
- [ ] Conduct initial risk assessment
- [ ] Clarify test scope boundaries

### Artifacts

**Test Context Document** (`discover/test-context-doc.md`)
- Business drivers and goals for testing
- System under test overview
- Constraints (technical, organizational, regulatory)
- Quality attribute priorities (ranked)

**Risk Assessment** (`discover/risk-assessment.md`)
- Business and technical risks
- Areas of highest complexity or change
- Historical defect trends
- Risk-based test priority areas

**Stakeholder Map** (`discover/stakeholder-map.md`)
- Use template from `artifact-templates.md`
- Capture: name/role, testing concerns, sign-off authority, communication preference

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Business situation analysis | BUSA | Investigate business situations with some complexity and ambiguity |
| Requirements definition | REQM | Define and manage scoping for medium-complexity initiatives |
| Functional testing | TEST | Select appropriate testing approaches considering risk and criticality |

### Coaching Moments

- After stakeholder identification: coach on completeness (did they miss any stakeholder groups?)
- After risk assessment: coach on distinguishing high-risk areas from low-risk areas
- Before transitioning: coach on what "good enough" discovery looks like

### When to Skip

Skip Discover if:
- Business context is already well-documented (e.g., PRD exists with acceptance criteria)
- This is regression testing for a well-understood system
- The task is a modification to an existing test plan

---

## Phase 2: Plan

### Purpose
Design the test strategy, select testing approaches, plan resources, and define test environments.

### Conversation Guide

1. **Test strategy**: "What types of testing are needed? (functional, integration, performance, security, UAT)"
2. **Test approach**: "Risk-based or coverage-based? Automated or manual? Exploratory?"
3. **Test levels**: "What test levels apply? (unit, integration, system, acceptance)"
4. **Environments**: "What test environments are needed? How will test data be managed?"
5. **Tools**: "What testing tools and frameworks will be used? Any constraints?"
6. **Resources**: "Who will execute tests? What skills are needed? What is the timeline?"

### Activities Checklist

- [ ] Define test strategy aligned with risk assessment
- [ ] Select testing approaches per risk area
- [ ] Define test levels and their scope
- [ ] Plan test environments and test data
- [ ] Select testing tools and frameworks
- [ ] Define entry and exit criteria
- [ ] Create test schedule and resource plan
- [ ] Document test plan

### Artifacts

**Test Strategy** (`plan/test-strategy.md`)
- Test types and their scope
- Risk-based prioritization approach
- Automation strategy
- Environment strategy

**Test Plan** (`plan/test-plan.md`)
- Use template from `artifact-templates.md`
- Scope, approach, schedule, resources, entry/exit criteria

**Environment Requirements** (`plan/environment-requirements.md`)
- Test environments needed
- Test data requirements
- Infrastructure dependencies
- Configuration management

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Functional testing | TEST | Select appropriate testing approaches, develop comprehensive test plans |
| Quality assurance | QUAS | Plan and organize assessment activity, determine appropriate quality control |
| Methods and tools | METL | Engage stakeholders, recommend appropriate solutions, provide advice on adoption |

### Coaching Moments

- After test strategy: coach on ensuring risk-based prioritization drives the approach
- After environment planning: coach on realistic environment expectations vs. ideal
- After test plan: coach on defining measurable entry and exit criteria

### When to Skip

Skip Plan if:
- A test plan already exists and just needs test cases
- This is ad-hoc exploratory testing with a clear scope

---

## Phase 3: Execute

### Purpose
Create and execute tests, report defects, and maintain the test execution log.

### Conversation Guide

1. **Test design**: "What test cases cover the high-risk areas identified in the plan?"
2. **Test data**: "Is the test data prepared and validated?"
3. **Execution approach**: "What is the execution order? Which tests run first?"
4. **Defect management**: "How will defects be reported and tracked?"
5. **Automation**: "Which tests should be automated? What is the automation coverage target?"
6. **UAT**: "When does UAT start? Who are the business testers?"

### Activities Checklist

- [ ] Design test cases based on risk priority
- [ ] Prepare test data and environments
- [ ] Execute functional tests (manual and automated)
- [ ] Execute non-functional tests (performance, security, usability)
- [ ] Conduct exploratory testing sessions
- [ ] Facilitate user acceptance testing
- [ ] Log and classify defects
- [ ] Maintain test execution log
- [ ] Track test coverage and progress

### Artifacts

**Test Cases** (`execute/test-cases.md`)
- Use template from `artifact-templates.md`
- Test cases organized by risk priority and functional area

**Test Scripts** (`execute/test-scripts.md`)
- Automated test scripts or script references
- Execution instructions

**Defect Reports** (`execute/defect-reports.md`)
- Use template from `artifact-templates.md`
- Defects with severity, priority, steps to reproduce

**Test Execution Log** (`execute/test-execution-log.md`)
- Use template from `artifact-templates.md`
- Daily execution progress, pass/fail rates, blockers

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Functional testing | TEST | Develop, automate and execute comprehensive test plans and cases |
| User acceptance testing | BPTS | Develop acceptance criteria, design and specify test cases and scenarios |
| Penetration testing | PENT | Select appropriate testing approaches, produce test scripts and materials |

### Coaching Moments

- After test case design: coach on coverage of boundary values and negative scenarios
- After defect reporting: coach on clear reproduction steps and severity classification
- After UAT: coach on collaborating with business stakeholders to refine acceptance criteria

---

## Phase 4: Evaluate

### Purpose
Analyze test results, assess quality, determine release readiness, and provide risk-based recommendations.

### Conversation Guide

1. **Results analysis**: "What is the overall pass/fail rate? Where are the clusters of defects?"
2. **Quality assessment**: "Does the system meet the defined quality criteria?"
3. **Risk evaluation**: "What are the residual risks? Are there known defects being accepted?"
4. **Release readiness**: "Have the exit criteria been met? Is the system ready for release?"

### Activities Checklist

- [ ] Analyze test execution results and trends
- [ ] Assess defect metrics (open vs. closed, severity distribution)
- [ ] Evaluate test coverage against risk areas
- [ ] Assess quality against defined criteria
- [ ] Identify residual risks and their impact
- [ ] Prepare release readiness recommendation
- [ ] Compile test summary report

### Artifacts

**Test Summary Report** (`evaluate/test-summary-report.md`)
- Use template from `artifact-templates.md`
- Overall results, defect metrics, coverage analysis

**Quality Assessment** (`evaluate/quality-assessment.md`)
- Quality criteria evaluation
- Test coverage analysis
- Defect trend analysis

**Risk Report** (`evaluate/risk-report.md`)
- Residual risks with impact and likelihood
- Known defects being deferred
- Mitigation strategies

**Release Readiness Recommendation** (`evaluate/release-recommendation.md`)
- Use template from `artifact-templates.md`
- Exit criteria status, risk assessment, recommendation

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Quality assurance | QUAS | Collect and examine records, analyze evidence, draft compliance reports |
| Risk management | BURM | Identify risks, assess impact and probability, develop mitigation strategies |
| Measurement | MEAS | Collect and analyze metrics, report on test activities |

### Coaching Moments

- After results analysis: coach on identifying patterns and root causes, not just numbers
- After risk evaluation: coach on being honest about risks (not hiding them)
- After release recommendation: coach on separating testing assessment from release decision

### When to Skip

Skip Evaluate if:
- Testing is ongoing (iterative/continuous) — evaluate incrementally instead

---

## Phase 5: Improve

### Purpose
Conduct retrospective, identify process improvements, optimize testing practices, and share learnings.

### Conversation Guide

1. **Retrospective**: "What went well in testing? What could be improved?"
2. **Process analysis**: "Were the testing approaches effective? Were the right risks covered?"
3. **Tool assessment**: "Did the tools and frameworks meet the needs?"
4. **Knowledge sharing**: "What lessons should be shared with the team?"
5. **Metrics review**: "Are the testing metrics meaningful and actionable?"

### Activities Checklist

- [ ] Conduct test retrospective with team
- [ ] Analyze test process effectiveness
- [ ] Review testing metrics and their value
- [ ] Identify automation opportunities
- [ ] Document lessons learned
- [ ] Create process improvement plan
- [ ] Update testing standards and guidelines

### Artifacts

**Test Retrospective** (`improve/test-retrospective.md`)
- Use template from `artifact-templates.md`
- What went well, what didn't, action items

**Process Improvement Plan** (`improve/process-improvement-plan.md`)
- Identified improvements with priority
- Responsible parties and timelines
- Expected outcomes

**Lessons Learned** (`improve/lessons-learned.md`)
- Key learnings from the testing cycle
- Recommendations for future projects
- Updated testing standards or guidelines

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Methods and tools | METL | Review and improve usage and application of methods and tools |
| Quality assurance | QUAS | Provide advice and guidance in the use of organizational standards |
| Business process improvement | BPRE | Identify improvements to testing processes |

### Coaching Moments

- After retrospective: coach on actionable improvements vs. vague observations
- After process analysis: coach on measuring the effectiveness of the testing process itself
- At completion: summarize SFIA skills practiced and level-up opportunities

### Continuous Improvement Checkpoint

Before finalizing, review:
> "Did our testing approach effectively prioritize by risk? Did we find the important defects early?"

If not, document specific changes for the next testing cycle.
