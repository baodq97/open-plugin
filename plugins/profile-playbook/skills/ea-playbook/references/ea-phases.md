# EA Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Understand the business strategy, assess the current state of the enterprise architecture, identify stakeholders, and clarify the drivers for architectural change.

### Conversation Guide

Start with these questions (adapt to context):

1. **Business strategy**: "What is the organization's business strategy? What are the key strategic objectives?"
2. **Drivers for change**: "What is driving the need for enterprise architecture? (digital transformation, M&A, cost reduction, regulatory, growth)"
3. **Stakeholders**: "Who are the key stakeholders? Who sponsors architecture decisions? Who are the consumers of architecture artifacts?"
4. **Current state**: "What does the current technology landscape look like? What enterprise systems are in place?"
5. **Pain points**: "What are the biggest pain points? Where is there duplication, fragmentation, or misalignment?"
6. **Constraints**: "What are the hard constraints? (budget, regulatory, organizational structure, legacy commitments)"

### Activities Checklist

- [ ] Identify all stakeholders and their concerns
- [ ] Document business strategy and strategic objectives
- [ ] Assess current state architecture landscape
- [ ] Map business drivers for change
- [ ] Identify quality attribute priorities at enterprise level
- [ ] Document known constraints and assumptions

### Artifacts

**Business Strategy Summary** (`discover/business-strategy-summary.md`)
- Strategic objectives and business goals
- Key performance indicators
- Strategic initiatives and their architecture implications

**Current State Assessment** (`discover/current-state-assessment.md`)
- Enterprise systems inventory
- Technology portfolio assessment
- Integration landscape and pain points
- Technical debt inventory

**Stakeholder Map** (`discover/stakeholder-map.md`)
- Name/role, concerns, influence level, communication preference
- Decision makers, influencers, consumers of architecture artifacts

**Driver Analysis** (`discover/driver-analysis.md`)
- Business drivers for change
- Technology drivers
- Regulatory and compliance drivers
- Market and competitive drivers

### SFIA Skills Practiced

| Skill | Code | Level 5 Activity |
|-------|------|------------------|
| Business situation analysis | BUSA | Plan, manage and investigate business situations with significant ambiguity and complexity |
| Strategic planning | ITSP | Collate information and create reports to support strategy management processes |
| Stakeholder relationship management | RLMT | Identify communications and relationship needs of stakeholder groups |

### Coaching Moments

- After stakeholder identification: coach on engaging management-level stakeholders, not just operational ones
- After current state assessment: coach on identifying systemic issues, not just individual pain points
- Before transitioning: coach on what "good enough" discovery looks like at the enterprise level

### When to Skip

Skip Discover if:
- Business strategy is already well-documented and communicated
- Current state assessment has been recently completed
- This is an incremental evolution of an existing architecture, not a new initiative

---

## Phase 2: Define

### Purpose
Define the architecture vision, establish architecture principles, create a business capability model, and describe the target state that aligns with business strategy.

### Conversation Guide

1. **Architecture vision**: "What is the desired future state? What does success look like in 3-5 years?"
2. **Principles**: "What architecture principles should guide all decisions? (reuse, buy vs build, cloud-first, data sovereignty...)"
3. **Capability model**: "What are the key business capabilities? Which are differentiating vs. commodity?"
4. **Target state**: "What does the target architecture look like at the enterprise level?"
5. **Gap analysis**: "What are the major gaps between current state and target state?"
6. **Boundaries**: "What is in scope for this architecture effort? What is explicitly out of scope?"

### Activities Checklist

- [ ] Define architecture vision aligned with business strategy
- [ ] Establish architecture principles catalog
- [ ] Create business capability model (3-level hierarchy)
- [ ] Describe target state architecture
- [ ] Conduct gap analysis (current vs target)
- [ ] Prioritize gaps and define transformation themes

### Artifacts

**Architecture Vision** (`define/architecture-vision.md`)
- Future state description
- Business outcomes expected
- Key architecture decisions and rationale
- Success metrics

**Architecture Principles** (`define/architecture-principles.md`)
- Principle name, statement, rationale, implications
- Categorized by: business, data, application, technology

**Business Capability Model** (`define/business-capability-model.md`)
- Level 1: Strategic capability areas
- Level 2: Capability groups
- Level 3: Individual capabilities
- Heat map: maturity, strategic importance, investment need

**Target State Description** (`define/target-state-description.md`)
- Target architecture overview
- Gap analysis (current vs target)
- Transformation themes and priorities

### SFIA Skills Practiced

| Skill | Code | Level 5 Activity |
|-------|------|------------------|
| Enterprise and business architecture | STPL | Develop models and plans to drive business strategy execution |
| Governance | GOVN | Contribute to governance frameworks that enable governance activity |
| Business modelling | BSMO | Manage the development of models that support strategic business objectives |

### Coaching Moments

- After architecture vision: coach on ensuring vision traces directly to business strategy
- After principles: coach on making principles actionable (not just aspirational)
- After capability model: coach on distinguishing differentiating from commodity capabilities
- Before transitioning: coach on stakeholder buy-in for the vision

### When to Skip

Skip Define if:
- Architecture vision and principles already exist and are current
- Business capability model has been recently created
- Iterating on specific architecture domains, not the full enterprise

---

## Phase 3: Design

### Purpose
Create reference architectures, technology roadmaps, data architecture, security architecture, and integration patterns that realize the target state.

### Conversation Guide

1. **Reference architecture**: "What reference architectures are needed? (application, data, integration, infrastructure, security)"
2. **Technology roadmap**: "What technologies should be adopted, maintained, or retired? Over what timeline?"
3. **Data architecture**: "How should data be governed across the enterprise? What data domains exist?"
4. **Security architecture**: "What security architecture patterns are needed? What compliance frameworks apply?"
5. **Integration**: "How should enterprise systems integrate? (API-first, event-driven, ESB, point-to-point)"
6. **Standards**: "What architecture standards should be defined for delivery teams?"

### Activities Checklist

- [ ] Create reference architecture for each relevant domain
- [ ] Develop technology roadmap (adopt, maintain, retire)
- [ ] Design enterprise data architecture
- [ ] Design security architecture aligned with compliance needs
- [ ] Define integration patterns and standards
- [ ] Verify designs against architecture principles

### Artifacts

**Reference Architecture** (`design/reference-architecture.md`)
- Domain-specific reference architectures (application, data, integration, infrastructure)
- Pattern library for each domain
- Technology standards per layer

**Technology Roadmap** (`design/technology-roadmap.md`)
- Technology radar (adopt, trial, assess, hold)
- Migration paths for retiring technologies
- Investment timeline aligned with strategic priorities

**Data Architecture** (`design/data-architecture.md`)
- Enterprise data domains and ownership
- Data governance model
- Data integration patterns
- Data quality standards

**Security Architecture** (`design/security-architecture.md`)
- Security zones and trust boundaries
- Identity and access management patterns
- Data protection and privacy controls
- Compliance mapping (regulations to controls)

**Integration Patterns** (`design/integration-patterns.md`)
- Enterprise integration patterns
- API standards and governance
- Event-driven architecture patterns
- Inter-system communication standards

### SFIA Skills Practiced

| Skill | Code | Level 5 Activity |
|-------|------|------------------|
| Enterprise and business architecture | STPL | Create and maintain roadmaps to guide execution of business strategy |
| Network design | NTDS | Produce network architectures, topologies and configuration databases |
| Data modelling and design | DTAN | Set standards for data modelling tools and techniques |
| Information security | SCTY | Provide advice on security strategies to manage identified risks |

### Coaching Moments

- After reference architecture: coach on making reference architectures actionable for delivery teams
- After technology roadmap: coach on balancing innovation with stability
- After data architecture: coach on enterprise data governance vs. domain autonomy
- Before transitioning: coach on verifying designs against architecture principles

---

## Phase 4: Govern

### Purpose
Establish architecture governance structures, compliance processes, review boards, and waiver processes to ensure adherence to architecture standards.

### Conversation Guide

1. **Governance model**: "What governance model fits? (centralized, federated, hybrid)"
2. **Architecture review board**: "Who should be on the ARB? How often should it meet? What decisions require ARB approval?"
3. **Compliance**: "How will compliance with architecture standards be monitored and enforced?"
4. **Waivers**: "What is the process for granting exceptions to architecture standards?"
5. **Metrics**: "How will architecture effectiveness be measured?"

### Activities Checklist

- [ ] Define architecture governance framework
- [ ] Establish architecture review board charter
- [ ] Create compliance monitoring checklist
- [ ] Define waiver and exception process
- [ ] Establish architecture metrics and reporting

### Artifacts

**Architecture Governance Framework** (`govern/governance-framework.md`)
- Governance model (centralized/federated/hybrid)
- Decision rights and escalation paths
- Architecture compliance criteria
- Reporting structure

**Compliance Checklist** (`govern/compliance-checklist.md`)
- Architecture standards checklist for project reviews
- Compliance scoring criteria
- Non-compliance remediation process

**Architecture Review Board Charter** (`govern/arb-charter.md`)
- ARB composition and roles
- Meeting cadence and agenda structure
- Decision-making process
- Review criteria and thresholds

**Waiver Process** (`govern/waiver-process.md`)
- Waiver request template
- Evaluation criteria
- Approval workflow
- Tracking and expiration

### SFIA Skills Practiced

| Skill | Code | Level 6 Activity |
|-------|------|------------------|
| Governance | GOVN | Implement governance frameworks, determine requirements reflecting values, ethics, and risk appetite |
| Methods and tools | METL | Develop organizational policies, standards and guidelines for methods and tools |

### Coaching Moments

- After governance framework: coach on balancing control with agility
- After ARB charter: coach on making architecture reviews value-adding, not bureaucratic
- After waiver process: coach on managing exceptions constructively
- Before transitioning: coach on governance as an enabler, not a gate

### When to Skip

Skip Govern if:
- Governance structures already exist and are effective
- The scope is limited to architecture design without organizational change
- Organization is too small for formal governance (document principles instead)

---

## Phase 5: Evolve

### Purpose
Monitor technology trends, assess architecture maturity, plan continuous improvement, and ensure the architecture adapts to changing business needs.

### Conversation Guide

1. **Technology trends**: "What emerging technologies could impact the enterprise? (AI, cloud-native, edge computing, quantum...)"
2. **Maturity assessment**: "How mature is the current architecture practice? Where are the gaps?"
3. **Innovation pipeline**: "What innovation initiatives should be explored? How do they align with strategy?"
4. **Capability development**: "What skills and capabilities need to be developed in the architecture team?"
5. **Continuous improvement**: "How will the architecture evolve? What review cycles are needed?"

### Activities Checklist

- [ ] Create or update technology radar
- [ ] Conduct architecture maturity assessment
- [ ] Define innovation pipeline
- [ ] Create capability development plan
- [ ] Establish continuous improvement cadence

### Artifacts

**Technology Radar** (`evolve/technology-radar.md`)
- Technologies categorized: Adopt, Trial, Assess, Hold
- Impact assessment for each emerging technology
- Recommendations for evaluation or adoption

**Architecture Maturity Assessment** (`evolve/maturity-assessment.md`)
- Maturity dimensions (governance, standards, adoption, skills, tooling)
- Current maturity level per dimension
- Target maturity and improvement actions

**Innovation Pipeline** (`evolve/innovation-pipeline.md`)
- Innovation opportunities aligned with strategy
- Proof of concept proposals
- Evaluation criteria and timeline

**Capability Development Plan** (`evolve/capability-development-plan.md`)
- Skills gap analysis for architecture team
- Training and development recommendations
- Mentoring and community of practice plans

### SFIA Skills Practiced

| Skill | Code | Level 5 Activity |
|-------|------|------------------|
| Emerging technology monitoring | EMRG | Monitor external environment, assess and document impacts, create technology roadmaps |
| Innovation management | INOV | Manage innovation pipeline, develop innovation tools and processes |
| Organizational capability development | OCDV | Contribute to identifying new capability improvement areas, conduct maturity assessments |

### Coaching Moments

- After technology radar: coach on distinguishing hype from genuine architectural impact
- After maturity assessment: coach on being honest about gaps and celebrating progress
- After innovation pipeline: coach on connecting innovation to strategic value
- At completion: summarize SFIA skills practiced and level-up opportunities

### Session Complete Checkpoint

Before finalizing, review all decisions:
> "Does every architecture decision trace to a business capability or strategic objective? If not, revisit the rationale."

Summarize SFIA skills practiced across all phases and provide growth recommendations.
