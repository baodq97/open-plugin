# PO Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Understand the market landscape, identify target users, analyze business context, and clarify what problem the product needs to solve.

### Conversation Guide

Start with these questions (adapt to context):

1. **Problem space**: "What problem are we solving? Who experiences this problem and how painful is it?"
2. **Market**: "Who are the competitors? What alternatives exist today? What is our unfair advantage?"
3. **Users**: "Who are our target users? What are their key jobs-to-be-done?"
4. **Business context**: "What are the business goals? Revenue model? Key constraints?"
5. **Existing state**: "Is there an existing product? What works well? What doesn't?"
6. **Success vision**: "What does success look like in 6 months? 12 months?"

### Activities Checklist

- [ ] Conduct market analysis (competitors, alternatives, trends)
- [ ] Identify and describe target user segments
- [ ] Create user personas with jobs-to-be-done
- [ ] Document the problem statement
- [ ] Identify business model and revenue drivers
- [ ] Clarify scope and constraints

### Artifacts

**Market Analysis** (`discover/market-analysis.md`)
- Competitor landscape
- Market trends and opportunities
- Differentiation factors

**User Personas** (`discover/user-personas.md`)
- Persona profiles with demographics, goals, pain points
- Jobs-to-be-done for each persona
- User journey highlights

**Problem Statement** (`discover/problem-statement.md`)
- Problem definition
- Who is affected and how
- Current alternatives and their limitations
- Opportunity sizing

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Business situation analysis | BUSA | Investigate business situations with some complexity and ambiguity |
| Market research | MRCH | Design and conduct market research studies independently |
| User research | URCH | Conduct generative research, plan research activities, identify methods |

### Coaching Moments

- After market analysis: coach on identifying real differentiation vs. feature comparison
- After personas: coach on validating assumptions with real data, not just intuition
- Before transitioning: coach on what "good enough" discovery looks like — avoid analysis paralysis

### When to Skip

Skip Discover if:
- Market context is already well-documented (e.g., from a strategy doc)
- This is an iteration on an existing product with known users
- The task is a tactical backlog management exercise, not a new product

---

## Phase 2: Define

### Purpose
Formalize the product vision, articulate the value proposition, define success metrics, and establish clear product boundaries.

### Conversation Guide

1. **Vision**: "What is the product vision? What future state are we creating?"
2. **Value proposition**: "What unique value do we deliver? Why should users choose us?"
3. **Strategy**: "What is our go-to-market strategy? What segments do we target first?"
4. **Success metrics**: "How will we measure success? What are the key OKRs?"
5. **Scope**: "What is in scope for V1? What is explicitly out of scope?"
6. **Feasibility**: "Is this technically feasible? What are the biggest unknowns?"

### Activities Checklist

- [ ] Write product vision statement
- [ ] Create value proposition canvas
- [ ] Define success metrics and OKRs
- [ ] Conduct feasibility assessment
- [ ] Define product boundaries (in/out of scope)
- [ ] Identify key assumptions and risks
- [ ] Map customer journey for core use case

### Artifacts

**Product Vision** (`define/product-vision.md`)
- Vision statement (elevator pitch format)
- Target customer segments
- Key differentiators
- Revenue model

**Value Proposition Canvas** (`define/value-proposition.md`)
- Customer profile: jobs, pains, gains
- Value map: products/services, pain relievers, gain creators
- Fit assessment

**Success Metrics** (`define/success-metrics.md`)
- OKRs (Objectives and Key Results)
- North Star metric
- Leading and lagging indicators
- Measurement plan

**Feasibility Assessment** (`define/feasibility.md`)
- Technical feasibility
- Business viability
- User desirability
- Key risks and unknowns

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Product management | PROD | Manage product lifecycle, prioritize requirements, develop roadmaps |
| Customer experience | CEXP | Design and refine customer journeys, recommend technologies |
| Feasibility assessment | FEAS | Select approaches, identify options, undertake feasibility assessment |

### Coaching Moments

- After vision statement: coach on making it inspiring yet actionable
- After value proposition: coach on validating with real user feedback, not assumptions
- After OKRs: coach on making key results measurable and time-bound
- Before transitioning: coach on the difference between vision (aspirational) and scope (practical)

### When to Skip

Skip Define if:
- Product vision and strategy already exist (e.g., from leadership)
- Iterating on existing product with clear direction

---

## Phase 3: Prioritize

### Purpose
Build and prioritize the product backlog, create the roadmap, and make explicit trade-off decisions about what to build and what to defer.

### Conversation Guide

1. **Features**: "What are the key features needed? Walk me through the core user stories."
2. **Prioritization**: "Which features deliver the most value? Which are most urgent?"
3. **Dependencies**: "Are there technical dependencies between features?"
4. **Trade-offs**: "What are we willing to sacrifice? Speed vs. quality? Scope vs. timeline?"
5. **Roadmap**: "What does the phased delivery look like? What is the MVP?"
6. **Stakeholder alignment**: "Do stakeholders agree on priorities? Where are the conflicts?"

### Activities Checklist

- [ ] Write user stories with acceptance criteria
- [ ] Apply prioritization framework (RICE, MoSCoW, or Value/Effort)
- [ ] Create prioritization matrix
- [ ] Build product roadmap
- [ ] Define MVP scope
- [ ] Document trade-off decisions
- [ ] Align stakeholders on priorities

### Artifacts

**Product Backlog** (`prioritize/product-backlog.md`)
- User stories grouped by epic/theme
- Acceptance criteria for each story
- Priority ranking

**Prioritization Matrix** (`prioritize/prioritization-matrix.md`)
- Use template from `artifact-templates.md`
- Framework applied (RICE, MoSCoW, Value/Effort)
- Scoring rationale

**Product Roadmap** (`prioritize/product-roadmap.md`)
- Use template from `artifact-templates.md`
- Phases with themes and key deliverables
- Dependencies and milestones

**Trade-off Decisions** (`prioritize/trade-offs.md`)
- What was deferred and why
- What was cut and why
- Reversibility assessment

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Product management | PROD | Own the product backlog, prioritize requirements, develop roadmaps |
| Requirements definition | REQM | Define scoping, facilitate stakeholder input, establish baselines |
| Demand management | DEMM | Monitor demand patterns, identify insights, prioritize alignment |

### Coaching Moments

- After user stories: coach on writing stories that express user value, not implementation tasks
- After prioritization: coach on using data (impact estimates) not just gut feeling
- After roadmap: coach on communicating uncertainty — roadmaps are not promises
- Before transitioning: coach on saying "no" (or "not yet") to stakeholders

### When to Skip

Skip Prioritize if:
- Backlog already exists and is well-prioritized
- Single-feature task with no prioritization needed

---

## Phase 4: Plan

### Purpose
Coordinate delivery with engineering, manage stakeholder expectations, plan releases, and proactively mitigate risks.

### Conversation Guide

1. **Delivery approach**: "How will we deliver? Scrum, Kanban, Shape Up?"
2. **Release planning**: "What goes into each release? What are the acceptance criteria?"
3. **Stakeholders**: "Who needs to be informed? Who has approval authority?"
4. **Dependencies**: "What external dependencies exist? (APIs, partners, legal, compliance)"
5. **Risks**: "What could go wrong? What is the contingency plan?"
6. **Communication**: "How will we communicate progress? To whom, how often?"

### Activities Checklist

- [ ] Select delivery approach with rationale
- [ ] Create release plan with milestones
- [ ] Map stakeholders and communication plan
- [ ] Identify and document risks with mitigation strategies
- [ ] Coordinate with engineering on technical dependencies
- [ ] Define go/no-go criteria for each release
- [ ] Set up feedback loops (demos, reviews, user testing)

### Artifacts

**Release Plan** (`plan/release-plan.md`)
- Release milestones and scope
- Go/no-go criteria
- Dependencies and blockers

**Stakeholder Map** (`plan/stakeholder-map.md`)
- Use template from `artifact-templates.md`
- Stakeholder influence/interest matrix
- Communication plan per stakeholder group

**Risk Register** (`plan/risk-register.md`)
- Risk identification with likelihood and impact
- Mitigation strategies
- Risk owners

**Communication Plan** (`plan/communication-plan.md`)
- Cadence per stakeholder group
- Channels and formats
- Escalation paths

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Delivery management | DEMG | Manage delivery for small-medium initiatives, lead iteration planning |
| Stakeholder relationship management | RLMT | Implement engagement plans, collect feedback, manage resolutions |
| Risk management | BURM | Identify risks, assess impact, develop mitigation strategies |

### Coaching Moments

- After release plan: coach on defining "done" at the release level, not just story level
- After stakeholder map: coach on identifying hidden stakeholders (ops, legal, support)
- After risk register: coach on being honest about risks — hiding risks is not managing them
- Before transitioning: coach on the difference between a plan and a commitment

---

## Phase 5: Deliver & Learn

### Purpose
Execute the launch, measure results against success metrics, gather feedback, and drive continuous improvement.

### Conversation Guide

1. **Launch readiness**: "Is everything ready for launch? Have we met the go/no-go criteria?"
2. **Measurement**: "Are our tracking and analytics in place? Are we measuring the right things?"
3. **Feedback**: "How are we collecting user feedback? What channels?"
4. **Results**: "What do the metrics tell us? Are we meeting our OKRs?"
5. **Learning**: "What did we learn? What should we do differently?"
6. **Next iteration**: "Based on learnings, what changes to the roadmap?"

### Activities Checklist

- [ ] Verify launch readiness (go/no-go review)
- [ ] Execute launch with communication plan
- [ ] Monitor key metrics post-launch
- [ ] Collect and analyze user feedback
- [ ] Compare results against success metrics/OKRs
- [ ] Conduct retrospective
- [ ] Update roadmap based on learnings
- [ ] Document lessons learned

### Artifacts

**Launch Checklist** (`deliver-learn/launch-checklist.md`)
- Pre-launch verification
- Launch day activities
- Post-launch monitoring

**Metrics Report** (`deliver-learn/metrics-report.md`)
- Key metrics vs. targets
- Trends and insights
- Recommendations

**Retrospective** (`deliver-learn/retrospective.md`)
- What went well
- What could be improved
- Action items for next iteration

**Lessons Learned** (`deliver-learn/lessons-learned.md`)
- Key insights from this cycle
- Process improvements
- Product insights for next iteration

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Measurement | MEAS | Identify and prioritize measures, specify data collection, design reports |
| Business process improvement | BPRE | Analyze processes, identify alternatives, recommend improvements |
| Release management | RELM | Plan and schedule releases, manage lifecycle, conduct post-release reviews |

### Coaching Moments

- After launch: coach on monitoring the right metrics (leading indicators, not vanity metrics)
- After metrics review: coach on distinguishing correlation from causation
- After retrospective: coach on turning insights into concrete actions, not just observations
- At completion: summarize SFIA skills practiced and level-up opportunities

### Outcome Over Output Checkpoint

Before closing the cycle, review all decisions:
> "Did we deliver measurable user/business value, or just features?"

If metrics are flat despite feature delivery, investigate the value hypothesis — not just the execution.
