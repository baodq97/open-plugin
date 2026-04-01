# BA Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Investigate the business situation, identify stakeholders, understand the current state (as-is), clarify the problem being solved, and establish the boundaries of the analysis effort.

### Conversation Guide

Start with these questions (adapt to context):

1. **Problem space**: "What problem are we solving? What triggered this initiative? What happens if we do nothing?"
2. **Stakeholders**: "Who are the stakeholders? Who sponsors this? Who will be impacted by the outcome?"
3. **Current state**: "What is the current process or system? Walk me through the as-is flow."
4. **Pain points**: "What are the pain points? Where does the current process break down? What workarounds exist?"
5. **Constraints**: "What constraints exist? (budget, timeline, regulatory, organizational, technology)"
6. **Success criteria**: "What does success look like? How will we measure whether we solved the problem?"

### Activities Checklist

- [ ] Identify all stakeholders and classify by influence and interest
- [ ] Conduct stakeholder interviews or workshops
- [ ] Document the current state (as-is process, systems, data flows)
- [ ] Identify and prioritize pain points
- [ ] Document known constraints and assumptions
- [ ] Define the problem statement with measurable impact
- [ ] Clarify scope boundaries (what is in and out of scope)

### Artifacts

**Stakeholder Map** (`discover/stakeholder-map.md`)
- Use template from `artifact-templates.md`
- Capture: name/role, concerns, influence level, interest level, communication preference
- Include a power/interest grid classification

**Problem Statement** (`discover/problem-statement.md`)
- Clear articulation of the problem, not the solution
- Business impact (quantified where possible)
- Who is affected and how
- What success looks like (measurable outcomes)

**As-Is Analysis** (`discover/as-is-analysis.md`)
- Current process description (narrative or flow)
- Current systems and tools in use
- Data flows and handoff points
- Known pain points, bottlenecks, and workarounds
- Baseline metrics (if available)

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Business situation analysis | BUSA | Investigate business situations with some complexity and ambiguity |
| Stakeholder relationship management | RLMT | Identify and manage stakeholder relationships, address conflicts and priorities |

### Coaching Moments

- After stakeholder identification: coach on completeness (did they miss any stakeholder groups — end users, operations, compliance?)
- After as-is analysis: coach on separating observed facts from assumptions
- After problem statement: coach on framing as a problem, not a pre-determined solution ("We need a new portal" is a solution, not a problem)
- Before transitioning: coach on what "good enough" discovery looks like — diminishing returns vs. analysis paralysis

### When to Skip

Skip Discover if:
- A well-documented problem statement and stakeholder map already exist (e.g., from a Design Thinking phase)
- This is a minor enhancement to a well-understood process
- The initiative is a regulatory mandate with clearly defined requirements

---

## Phase 2: Define

### Purpose
Formalize requirements (functional and non-functional), assess feasibility of the initiative, and model the business domain to ensure shared understanding between stakeholders and delivery teams.

### Conversation Guide

1. **Functional requirements**: "What must the system or process do? Walk me through the key business scenarios."
2. **Non-functional requirements**: "What are the performance, availability, and usability expectations? Any compliance mandates?"
3. **Data**: "What data is involved? Where does it come from? Who owns it? What are the retention and privacy rules?"
4. **Feasibility**: "Is this feasible within the given constraints? What are the technical, organizational, and financial risks?"
5. **Options**: "What are the possible approaches? Build, buy, configure, or process change?"
6. **Prioritization**: "Which requirements are must-have vs. nice-to-have? What can we defer to a later phase?"

### Activities Checklist

- [ ] Elicit and document functional requirements (user stories, use cases, or business rules)
- [ ] Define non-functional requirements with measurable targets
- [ ] Model the business domain (entities, relationships, terminology)
- [ ] Conduct feasibility assessment (technical, organizational, financial)
- [ ] Identify options and evaluate trade-offs
- [ ] Prioritize requirements (MoSCoW or similar framework)
- [ ] Validate requirements with stakeholders
- [ ] Establish a glossary of business terms

### Artifacts

**Requirements Document** (`define/requirements.md`)
- Functional requirements grouped by business capability or domain area
- User stories or use cases for key scenarios
- Business rules and validation logic
- Prioritization (MoSCoW or weighted scoring)

**Business Model** (`define/business-model.md`)
- Domain model (key entities and relationships)
- Business glossary (shared terminology)
- Business capability map (if applicable)
- Value chain or value stream mapping

**Feasibility Assessment** (`define/feasibility.md`)
- Technical feasibility: can it be built with available technology and skills?
- Organizational feasibility: does the organization have capacity and willingness?
- Financial feasibility: rough cost-benefit analysis, ROI indicators
- Risk summary with likelihood and impact
- Recommendation: proceed, pivot, or stop

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Requirements definition | REQM | Facilitate stakeholder input, enable prioritization, establish baselines |
| Feasibility assessment | FEAS | Prepare and participate in feasibility assessments, identify risks and required changes |
| Business modelling | BSMO | Represent business activities and their information needs using modelling techniques |

### Coaching Moments

- After functional requirements: coach on testability — every requirement should be verifiable
- After NFRs: coach on making them measurable ("average response time < 2s" not "the system should be fast")
- After feasibility: coach on intellectual honesty — flag risks early, do not bury them
- After prioritization: coach on stakeholder alignment — ensure priorities reflect business value, not loudest voice

### When to Skip

Skip Define if:
- Detailed requirements already exist and have been validated (e.g., from product team or preceding BA engagement)
- The initiative scope is narrow and well-understood (e.g., a configuration change)

---

## Phase 3: Analyze

### Purpose
Perform deep analysis — improve processes, model data in detail, analyze user experience, and identify gaps between the current state and the desired future state.

### Conversation Guide

1. **Process improvement**: "How can the current process be improved? Where are the bottlenecks, redundancies, and waste?"
2. **Data modelling**: "What data entities exist? What are their attributes and relationships? Where is data created, stored, and consumed?"
3. **User experience**: "How do users interact with the current system or process? What are the friction points? What do users actually need vs. what they say they want?"
4. **Gap analysis**: "What are the gaps between the as-is state and the to-be vision? Which gaps are critical vs. acceptable?"
5. **Dependencies**: "What upstream and downstream dependencies exist? What will break if we change this process?"

### Activities Checklist

- [ ] Map current processes in detail (BPMN, swim lanes, or similar)
- [ ] Design to-be processes with improvement opportunities
- [ ] Create detailed data models (logical, conceptual)
- [ ] Analyze user journeys and identify UX pain points
- [ ] Conduct gap analysis (as-is vs. to-be)
- [ ] Identify dependencies and integration points
- [ ] Quantify improvement opportunities (time saved, error reduction, cost impact)
- [ ] Validate analysis findings with subject matter experts

### Artifacts

**Process Map** (`analyze/process-map.md`)
- As-is process flow (current state, documented in Discover, now refined)
- To-be process flow (improved state)
- Improvement annotations: what changes, why, and expected impact
- Swim lanes showing roles and responsibilities

**Data Model** (`analyze/data-model.md`)
- Conceptual data model (entities and relationships)
- Logical data model (attributes, keys, cardinality)
- Data dictionary (definitions, types, constraints, ownership)
- Data lineage (where data originates, transforms, and lands)

**UX Analysis** (`analyze/ux-analysis.md`)
- User personas (if not already defined)
- User journey maps for key scenarios
- Pain points and friction analysis
- Recommendations for UX improvement

**Gap Analysis** (`analyze/gap-analysis.md`)
- As-is vs. to-be comparison matrix
- Gap categorization: process, technology, data, people, policy
- Gap severity: critical, significant, minor
- Remediation approach per gap

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Business process improvement | BPRE | Analyze business processes, identify improvement opportunities, recommend changes |
| Data modelling | DTAN | Investigate data requirements, derive logical data models, plan modelling activities |
| User experience analysis | UNAN | Identify user behaviors, needs, and motivations through observation and analysis |

### Coaching Moments

- After process mapping: coach on challenging the status quo — "just because it is done this way does not mean it should be"
- After data modelling: coach on naming precision — ambiguous entity names cause downstream confusion
- After UX analysis: coach on observing behavior over stated preferences
- After gap analysis: coach on root cause thinking — ensure gaps trace to real business needs, not assumed requirements

### When to Skip

Skip Analyze if:
- The initiative is straightforward with no process change (e.g., a data migration with known schema)
- Detailed process maps and data models already exist and are current
- The scope is limited to selecting a tool or vendor (jump to Design)

---

## Phase 4: Design

### Purpose
Design the solution options, select appropriate methods and tools, define acceptance criteria, and ensure alignment with enterprise architecture and organizational strategy.

### Conversation Guide

1. **Solution options**: "What are the solution options? What are the pros, cons, and risks of each?"
2. **Methods and tools**: "What methods and tools best fit this solution? Build vs. buy vs. configure? What technology stack?"
3. **Acceptance criteria**: "What are the acceptance criteria? How will we verify the solution meets requirements?"
4. **Enterprise alignment**: "How does this solution fit within the enterprise architecture? Are there standards or patterns to follow?"
5. **Transition**: "What needs to change in the organization to adopt this solution? What training or communication is needed?"

### Activities Checklist

- [ ] Develop solution options (minimum 2 viable alternatives)
- [ ] Evaluate options against requirements, constraints, and feasibility
- [ ] Select and recommend preferred option with rationale
- [ ] Define acceptance criteria for all key requirements
- [ ] Select methods, tools, and frameworks
- [ ] Verify alignment with enterprise architecture and standards
- [ ] Create solution design documentation
- [ ] Review solution design with stakeholders and obtain agreement

### Artifacts

**Solution Options** (`design/solution-options.md`)
- Minimum 2 options with description of each
- Evaluation matrix: criteria, weighting, scoring per option
- Recommended option with clear rationale
- Risks and mitigation per option

**Acceptance Criteria** (`design/acceptance-criteria.md`)
- Acceptance criteria per requirement or user story
- Format: Given/When/Then or equivalent structured format
- Traceability: each criterion linked to a requirement
- Edge cases and negative scenarios

**Methods Selection** (`design/methods-selection.md`)
- Selected tools, frameworks, and methodologies
- Rationale for selection (fit to requirements, organizational capability, cost)
- Alternative tools considered and reasons for rejection
- Implementation considerations and dependencies

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Methods and tools | METL | Recommend appropriate tools and methods, provide advice on adoption and application |
| Acceptance testing | BPTS | Design acceptance tests, specify test conditions and acceptance criteria |
| Enterprise architecture | STPL | Contribute to enterprise architecture policies, standards, and practices |

### Coaching Moments

- After solution options: coach on genuine alternatives — presenting a straw man alongside the preferred option is not a real comparison
- After acceptance criteria: coach on completeness — cover happy path, edge cases, and failure scenarios
- After methods selection: coach on organizational fit — the best tool on paper may not be the best tool for this team
- Before transitioning: coach on traceability — every acceptance criterion should trace back to a stated requirement

### When to Skip

Skip Design if:
- The solution is pre-determined (e.g., mandated platform or vendor already selected)
- This is purely an analysis engagement with no solution delivery component
- Design responsibility belongs to a separate architecture or engineering team (hand off analysis artifacts)

---

## Phase 5: Deliver & Validate

### Purpose
Validate the solution through acceptance testing, prepare handoff to delivery or operations teams, manage organizational change impact, and capture lessons learned.

### Conversation Guide

1. **Acceptance validation**: "Have all acceptance criteria been met? Are there any outstanding defects or exceptions?"
2. **Documentation completeness**: "Is all documentation complete and current? Requirements, process maps, data models, test results?"
3. **Organizational change**: "What organizational changes are needed? Who needs training? What communications must go out?"
4. **Handoff readiness**: "Is the delivery team ready to take ownership? Are there open questions or unresolved dependencies?"
5. **Lessons learned**: "What went well? What would we do differently? What should the organization remember for next time?"

### Activities Checklist

- [ ] Execute or support acceptance testing against defined criteria
- [ ] Document test results and obtain stakeholder sign-off
- [ ] Compile final handoff package (all artifacts, decisions, open items)
- [ ] Assess change impact on people, processes, and technology
- [ ] Create change management plan (communication, training, support)
- [ ] Conduct lessons learned session
- [ ] Archive project artifacts for future reference
- [ ] Formally hand off to delivery, operations, or the next phase

### Artifacts

**Test Plan** (`deliver/test-plan.md`)
- Test scope and approach
- Test cases linked to acceptance criteria
- Test execution results (pass/fail/blocked)
- Defect log with severity and resolution status
- Stakeholder sign-off record

**Handoff Package** (`deliver/handoff-package.md`)
- Consolidated index of all BA artifacts from all phases
- Summary of key decisions and rationale
- Open items and known risks
- Recommended next steps
- Contact information for knowledge transfer

**Change Impact Assessment** (`deliver/change-impact.md`)
- Impacted stakeholder groups and nature of impact
- Process changes and their effect on roles
- Technology changes and training needs
- Communication plan (who, what, when, channel)
- Support model during transition

**Lessons Learned** (`deliver/lessons-learned.md`)
- What went well (replicate in future engagements)
- What did not go well (improve in future engagements)
- Surprises and how they were handled
- Recommendations for the organization
- SFIA skills practiced and level-up opportunities

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Acceptance testing | BPTS | Design and execute acceptance tests, ensure criteria are met before delivery |
| Consultancy | CNSL | Ensure proposed solutions are understood and effectively applied by stakeholders |
| Change management | CIPM | Assess change impact, develop change management plans, support adoption |

### Coaching Moments

- After acceptance testing: coach on rigor — partial pass is not a pass, document exceptions explicitly
- After handoff package: coach on writing for the audience — delivery teams need actionable guidance, not analysis jargon
- After change impact: coach on the human side — technology changes fail when people changes are ignored
- After lessons learned: coach on honesty and specificity — "communication could be better" is not actionable
- At completion: summarize SFIA skills practiced and level-up opportunities across all phases

---

## Root Cause Over Symptoms Checkpoint

Before finalizing the engagement, review all analysis and recommendations:

> "Are we solving the actual business problem, or just addressing symptoms?"

Trace every recommendation back to the problem statement from Phase 1. If a recommendation cannot be linked to a root cause, challenge whether it belongs in scope. Symptom-level fixes create recurring work; root cause solutions create lasting value.

If the analysis reveals that the original problem statement was wrong or incomplete, update it — do not force-fit solutions to a flawed premise. Document the evolution of understanding as a sign of thorough analysis, not a failure of planning.
