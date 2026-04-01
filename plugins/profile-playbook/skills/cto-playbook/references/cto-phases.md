# CTO Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Assess the technology landscape, understand market trends, evaluate competitive position, and identify the current state of engineering capabilities and technical debt.

### Conversation Guide

Start with these questions (adapt to context):

1. **Technology landscape**: "What is your current technology stack? What systems are in production today?"
2. **Market trends**: "What technology trends are relevant to your industry? What are competitors doing?"
3. **Engineering capability**: "How mature is your engineering organisation? What are the team's strengths and gaps?"
4. **Technical debt**: "Where is the most significant technical debt? What is its impact on velocity?"
5. **Stakeholders**: "Who are the key stakeholders for technology decisions? (CEO, CPO, board, engineering leads)"
6. **Constraints**: "What are the hard constraints? (budget, headcount, regulatory, timeline)"

### Activities Checklist

- [ ] Map the current technology landscape (systems, integrations, dependencies)
- [ ] Assess market and competitor technology positions
- [ ] Inventory technical debt with impact assessment
- [ ] Evaluate engineering team capabilities and maturity
- [ ] Identify key stakeholders and their technology concerns
- [ ] Document constraints and assumptions

### Artifacts

**Technology Landscape Assessment** (`discover/technology-landscape.md`)
- Use template from `artifact-templates.md`
- Capture: current systems, technology stack, integration points, maturity assessment

**Market/Competitor Analysis** (`discover/market-analysis.md`)
- Technology trends relevant to the domain
- Competitor technology positioning
- Opportunities and threats

**Technical Debt Inventory** (`discover/technical-debt-inventory.md`)
- Use template from `artifact-templates.md`
- Capture: debt item, impact, effort to resolve, priority

**Engineering Capability Assessment** (`discover/engineering-capability.md`)
- Team structure and skills
- Development practices maturity
- Tooling and infrastructure assessment

### SFIA Skills Practiced

| Skill | Code | Level 5-6 Activity |
|-------|------|---------------------|
| Emerging technology monitoring | EMRG | Monitor external environment, assess impacts and opportunities |
| Strategic planning | ITSP | Collect and analyse information to support strategy development |
| Stakeholder relationship management | RLMT | Identify communications and relationship needs of stakeholder groups |

### Coaching Moments

- After technology landscape mapping: coach on identifying strategic vs tactical technology decisions
- After technical debt assessment: coach on quantifying debt impact in business terms (velocity, risk, cost)
- After market analysis: coach on distinguishing hype from substantive technology shifts
- Before transitioning: coach on what "good enough" discovery looks like for strategic decision-making

### When to Skip

Skip Discover if:
- A recent technology assessment or audit already exists
- The initiative is focused on a specific technology decision (not a full strategy)
- The CTO is iterating on an existing strategy with well-understood landscape

---

## Phase 2: Envision

### Purpose
Define the technology vision, innovation strategy, platform direction, and establish the principles that will guide technology decisions across the organisation.

### Conversation Guide

1. **Technology vision**: "Where should the technology organisation be in 3 years? What capabilities must exist?"
2. **Innovation strategy**: "How will you identify and evaluate emerging technologies? What is the innovation process?"
3. **Platform direction**: "What is the target platform architecture? Monolith, microservices, composable?"
4. **Build vs Buy**: "For each major capability, should you build in-house, buy COTS, adopt open-source, or use SaaS?"
5. **Principles**: "What are the non-negotiable technology principles? (e.g., API-first, cloud-native, security by design)"
6. **Alignment**: "How does this technology vision support the business strategy?"

### Activities Checklist

- [ ] Draft the technology vision document
- [ ] Define the innovation strategy and processes
- [ ] Establish platform architecture principles
- [ ] Conduct Build vs Buy analysis for key capabilities
- [ ] Define technology principles and guardrails
- [ ] Validate alignment with business strategy

### Artifacts

**Technology Vision Document** (`envision/technology-vision.md`)
- Use template from `artifact-templates.md`
- Current state summary, target state, transition principles

**Innovation Strategy** (`envision/innovation-strategy.md`)
- Use template from `artifact-templates.md`
- Innovation process, evaluation criteria, portfolio approach

**Platform Architecture Principles** (`envision/platform-principles.md`)
- Use template from `artifact-templates.md`
- Core principles with rationale and implications

**Build vs Buy Analysis** (`envision/build-vs-buy.md`)
- Use template from `artifact-templates.md`
- Per-capability evaluation matrix

### SFIA Skills Practiced

| Skill | Code | Level 5-6 Activity |
|-------|------|---------------------|
| Enterprise and business architecture | STPL | Develop models and plans to drive execution of business strategy |
| Strategic planning | ITSP | Lead and manage creation or review of strategy |
| Innovation management | INOV | Manage the innovation pipeline, develop innovation capabilities |
| Specialist advice | TECH | Provide professional advice that shapes direction |

### Coaching Moments

- After technology vision: coach on making the vision actionable (not just aspirational)
- After innovation strategy: coach on balancing exploration with exploitation
- After Build vs Buy: coach on total cost of ownership analysis, not just licence costs
- Before transitioning: coach on validating the vision with key stakeholders before proceeding

---

## Phase 3: Build

### Purpose
Establish engineering practices, development standards, team structure, and governance frameworks that enable the technology vision to be realised.

### Conversation Guide

1. **Engineering standards**: "What development practices will be standard? (code review, testing, CI/CD, observability)"
2. **Development practices**: "What methodologies and workflows will engineering teams follow?"
3. **Team topology**: "How will engineering teams be organized? (stream-aligned, platform, enabling, complicated-subsystem)"
4. **Governance**: "What technology governance framework will guide decision-making? What requires approval?"
5. **Culture**: "What engineering culture do you want to build? How will you measure it?"
6. **Talent**: "What skills are needed? How will you attract, develop, and retain engineering talent?"

### Activities Checklist

- [ ] Define engineering standards and coding practices
- [ ] Establish development workflow and practices guide
- [ ] Design team topology aligned with platform architecture
- [ ] Create technology governance framework
- [ ] Define engineering culture values and metrics
- [ ] Plan talent development and hiring strategy

### Artifacts

**Engineering Standards** (`build/engineering-standards.md`)
- Use template from `artifact-templates.md`
- Code quality standards, review processes, testing requirements

**Development Practices Guide** (`build/development-practices.md`)
- Use template from `artifact-templates.md`
- Methodologies, workflows, toolchain, CI/CD standards

**Team Topology** (`build/team-topology.md`)
- Use template from `artifact-templates.md`
- Team types, responsibilities, interaction modes

**Technology Governance Framework** (`build/governance-framework.md`)
- Use template from `artifact-templates.md`
- Decision rights, review processes, compliance, escalation

### SFIA Skills Practiced

| Skill | Code | Level 5-6 Activity |
|-------|------|---------------------|
| Systems development management | DLMG | Set policy and drive adherence to standards for systems development |
| Governance | GOVN | Implement governance framework, determine requirements for governance |
| Organisational capability development | OCDV | Lead capability improvement programs, plan evaluations |

### Coaching Moments

- After engineering standards: coach on balancing prescriptiveness with team autonomy
- After team topology: coach on cognitive load and team interaction modes (collaboration vs X-as-a-Service)
- After governance framework: coach on making governance an enabler, not a bottleneck
- Before transitioning: coach on change management — standards only work if teams adopt them

---

## Phase 4: Scale

### Purpose
Scale systems, processes, and teams to meet growing demands. Manage vendor relationships, budgets, and service delivery at organisational scale.

### Conversation Guide

1. **Scaling strategy**: "What are the current scaling bottlenecks? (systems, processes, people)"
2. **Performance**: "What performance benchmarks must be met? How will you monitor and measure?"
3. **Vendor strategy**: "Which vendors and partners are critical? How will you manage these relationships?"
4. **Budget**: "What is the technology budget? How is it allocated across build, run, and innovate?"
5. **Service management**: "How will technology services be managed at scale? What SLAs are required?"
6. **Operational excellence**: "What operational practices ensure reliability? (SRE, incident management, runbooks)"

### Activities Checklist

- [ ] Define the scaling strategy for systems and teams
- [ ] Establish performance benchmarks and monitoring
- [ ] Develop vendor/partner strategy
- [ ] Create technology budget with allocation model
- [ ] Define service management practices and SLAs
- [ ] Plan for operational excellence and reliability

### Artifacts

**Scaling Strategy** (`scale/scaling-strategy.md`)
- Use template from `artifact-templates.md`
- System scaling, team scaling, process scaling approaches

**Performance Benchmarks** (`scale/performance-benchmarks.md`)
- Key metrics, targets, monitoring approach, alerting thresholds

**Vendor/Partner Strategy** (`scale/vendor-strategy.md`)
- Critical vendors, relationship model, risk management, exit strategies

**Technology Budget** (`scale/technology-budget.md`)
- Use template from `artifact-templates.md`
- Budget allocation, cost optimization, ROI tracking

### SFIA Skills Practiced

| Skill | Code | Level 5-6 Activity |
|-------|------|---------------------|
| Technology service management | ITMG | Manage design, procurement, operation and control of technology services |
| Systems development management | DLMG | Identify and manage resources for all stages of development |
| Supplier management | SUPP | Manage suppliers to meet KPIs, develop organizational policies |
| Financial management | FMIT | Develop financial plans and forecasts, promote financial governance |

### Coaching Moments

- After scaling strategy: coach on scaling people and processes, not just systems
- After vendor strategy: coach on avoiding vendor lock-in while leveraging partnerships
- After budget: coach on communicating technology investment in business value terms
- Before transitioning: coach on building resilience into scaled operations

---

## Phase 5: Evolve

### Purpose
Monitor emerging technologies, adapt strategy to changing conditions, drive continuous innovation, and manage technology risks proactively.

### Conversation Guide

1. **Technology radar**: "What technologies are you tracking? What should be adopted, trialled, assessed, or held?"
2. **Innovation pipeline**: "What innovation initiatives are in progress? How do you move from idea to production?"
3. **Risk assessment**: "What are the key technology risks? (security, obsolescence, single points of failure, talent)"
4. **Strategy refresh**: "How often is the technology strategy reviewed? What triggers a refresh?"
5. **Industry evolution**: "How is your industry changing? What technology disruptions are on the horizon?"
6. **Continuous improvement**: "What processes exist for learning from failures and successes?"

### Activities Checklist

- [ ] Create or update the technology radar
- [ ] Review and update the innovation pipeline
- [ ] Conduct a comprehensive technology risk assessment
- [ ] Refresh the technology strategy based on new data
- [ ] Review industry trends and competitive landscape
- [ ] Document lessons learned and improvement actions

### Artifacts

**Technology Radar** (`evolve/technology-radar.md`)
- Use template from `artifact-templates.md`
- Technologies categorized: Adopt, Trial, Assess, Hold

**Innovation Pipeline** (`evolve/innovation-pipeline.md`)
- Use template from `artifact-templates.md`
- Ideas, experiments, pilots, production initiatives

**Risk Assessment** (`evolve/risk-assessment.md`)
- Technology risks with likelihood, impact, and mitigation
- Residual risks accepted with rationale

**Strategy Refresh Document** (`evolve/strategy-refresh.md`)
- Changes since last strategy, updated priorities, revised roadmap

### SFIA Skills Practiced

| Skill | Code | Level 5-6 Activity |
|-------|------|---------------------|
| Emerging technology monitoring | EMRG | Plan and lead identification of emerging technologies, create technology roadmaps |
| Innovation management | INOV | Obtain organizational commitment to innovation, lead innovation capabilities |
| Risk management | BURM | Plan and manage organisation-wide risk management processes |
| Specialist advice | TECH | Lead development and application of specialist knowledge |

### Coaching Moments

- After technology radar: coach on distinguishing strategic bets from incremental improvements
- After innovation pipeline: coach on measuring innovation ROI and killing underperforming initiatives
- After risk assessment: coach on communicating technology risk to the board in business terms
- At completion: summarize SFIA skills practiced and level-up opportunities

### Strategy Refresh Checkpoint

Before finalizing, review the technology strategy:
> "Has the competitive landscape, team capability, or business strategy changed enough to warrant revising our technology direction?"

If yes, cycle back to Discover with focused scope. If no, document the confirmation and set the next review date.
