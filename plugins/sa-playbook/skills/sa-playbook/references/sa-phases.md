# SA Phases — Detailed Guide

## Phase 1: Discover

### Purpose
Understand the business context, identify stakeholders, map constraints, and clarify what problem the architecture needs to solve.

### Conversation Guide

Start with these questions (adapt to context):

1. **Problem space**: "What problem are we solving? What triggered this initiative?"
2. **Stakeholders**: "Who are the key stakeholders? Who will use this system? Who approves decisions?"
3. **Existing landscape**: "What systems exist today? What are we replacing or integrating with?"
4. **Constraints**: "What are the hard constraints? (budget, timeline, technology mandates, compliance)"
5. **Quality priorities**: "Which qualities matter most? (performance, security, scalability, cost, time-to-market)"
6. **Success criteria**: "How will we know the architecture is successful?"

### Activities Checklist

- [ ] Identify all stakeholders and their concerns
- [ ] Document business context and drivers
- [ ] Map existing system landscape (if applicable)
- [ ] Identify quality attribute priorities
- [ ] Document known constraints and assumptions
- [ ] Clarify scope boundaries

### Artifacts

**Stakeholder Map** (`discover/stakeholder-map.md`)
- Use template from `artifact-templates.md`
- Capture: name/role, concerns, influence level, communication preference

**Context Document** (`discover/context-doc.md`)
- Business drivers and goals
- Constraints (technical, organizational, regulatory)
- Assumptions and risks
- Quality attribute priorities (ranked)

**Existing Landscape** (`discover/existing-landscape.md`)
- Current systems and their roles
- Integration points
- Pain points and technical debt

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Business situation analysis | BUSA | Investigate business situations with some complexity and ambiguity |
| Requirements definition | REQM | Define and manage scoping for medium-complexity initiatives |

### Coaching Moments

- After stakeholder identification: coach on completeness (did they miss any stakeholder groups?)
- After quality priorities: coach on making priorities measurable, not vague
- Before transitioning: coach on what "good enough" discovery looks like

### When to Skip

Skip Discover if:
- Business context is already well-documented (e.g., PRD exists)
- This is a well-understood domain with clear stakeholders
- The task is a design modification, not a new system

---

## Phase 2: Define

### Purpose
Formalize requirements (functional and non-functional), define data needs, security requirements, and establish clear system boundaries.

### Conversation Guide

1. **Functional requirements**: "What must the system do? Walk me through the key user journeys."
2. **Non-functional requirements**: "What are the performance targets? Availability SLA? Data retention?"
3. **Data**: "What data does the system manage? What are the data sources and sinks?"
4. **Security**: "What are the authentication/authorization requirements? Any compliance needs (GDPR, HIPAA)?"
5. **Boundaries**: "What is in scope vs. out of scope? Where does this system end and others begin?"
6. **Integration**: "What external systems does this need to talk to? What protocols/formats?"

### Activities Checklist

- [ ] Document functional requirements
- [ ] Define NFRs with measurable criteria
- [ ] Identify data requirements and flows
- [ ] Define security and compliance requirements
- [ ] Establish system boundaries and interfaces
- [ ] Prioritize requirements (MoSCoW or similar)

### Artifacts

**Requirements Document** (`define/requirements.md`)
- Functional requirements grouped by domain/feature
- User stories or use cases for key flows

**NFR Matrix** (`define/nfr-matrix.md`)
- Use template from `artifact-templates.md`
- Each NFR has: category, description, measurable target, priority

**Data Requirements** (`define/data-requirements.md`)
- Data entities and relationships
- Data sources, volumes, retention
- Privacy and compliance classification

**Security Considerations** (`define/security-considerations.md`)
- Authentication and authorization model
- Data protection requirements
- Compliance requirements
- Threat landscape

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Requirements definition | REQM | Facilitate stakeholder input, enable prioritization, establish baselines |
| Data management | DATM | Devise data governance processes for specific data subsets |
| Information security | SCTY | Provide guidance on security controls, perform risk analysis |

### Coaching Moments

- After NFRs: coach on making them measurable ("p99 < 200ms" not "fast")
- After security: coach on thinking about threat models, not just checklists
- After boundaries: coach on defining clear API contracts at boundaries

### When to Skip

Skip Define if:
- Detailed requirements already exist (e.g., from product team)
- Iterating on an existing architecture with known requirements

---

## Phase 3: Design

### Purpose
Create the architecture — components, interactions, data model, and trade-offs. This is the core SA phase.

### Conversation Guide

1. **High-level approach**: "What architectural style fits? (microservices, modular monolith, event-driven, serverless...)"
2. **Components**: "What are the major components/services? What does each one do?"
3. **Data**: "How is data stored? What database types? How does data flow between components?"
4. **Integration**: "How do components communicate? (sync/async, REST/gRPC/events)"
5. **Infrastructure**: "Cloud or on-prem? What infrastructure patterns? (containers, serverless, VMs)"
6. **Trade-offs**: "What are the key trade-offs? What did we sacrifice and why?"

### Activities Checklist

- [ ] Select architectural style with rationale
- [ ] Create C4 Context diagram
- [ ] Create C4 Container diagram
- [ ] Design component specifications
- [ ] Design data model and storage strategy
- [ ] Design integration patterns
- [ ] Document trade-offs and alternatives considered
- [ ] Verify design against NFRs

### Artifacts

**C4 Context Diagram** (`design/c4-context.md`)
- System in context with users and external systems
- Use template from `artifact-templates.md`

**C4 Container Diagram** (`design/c4-container.md`)
- Internal containers (services, databases, message queues)
- Communication protocols between containers

**Component Specifications** (`design/component-specs.md`)
- Per component: responsibility, technology, APIs, dependencies

**Data Model** (`design/data-model.md`)
- Entity relationships
- Storage technology choices with rationale
- Data flow between components

**Trade-off Analysis** (`design/trade-offs.md`)
- Use template from `artifact-templates.md`
- For each key decision: options considered, evaluation criteria, chosen option with rationale

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Solution architecture | ARCH | Contribute to solution architectures, identify trade-offs in cost/performance/scalability |
| Systems design | DESN | Design system components using modelling techniques, evaluate design options |
| Network design | NTDS | Design network components using agreed architectures and standards |
| Database design | DBDS | Implement physical database designs for performance and availability |
| Data modelling | DTAN | Investigate data requirements, plan modelling activities |
| Software design | SWDN | Design complex software applications and components |

### Coaching Moments

- After architectural style selection: coach on documenting WHY, not just WHAT
- After C4 diagrams: coach on appropriate level of detail (not too much, not too little)
- After trade-offs: coach on evaluating at least 2 alternatives for every decision
- Before transitioning: coach on verifying design against NFRs

---

## Phase 4: Decide

### Purpose
Validate architectural decisions, conduct risk assessment, and get stakeholder buy-in.

### Conversation Guide

1. **Decision review**: "What are the most significant architectural decisions? Are they well-documented?"
2. **Risk assessment**: "What could go wrong? What are the biggest technical risks?"
3. **Stakeholder feedback**: "Who needs to review this? What concerns will they have?"
4. **Gaps**: "Are there any unresolved questions or open issues?"

### Activities Checklist

- [ ] Write ADRs for each significant decision
- [ ] Review architecture against NFRs
- [ ] Conduct risk assessment
- [ ] Identify stakeholder concerns and prepare responses
- [ ] Address feedback and update designs if needed
- [ ] Get formal/informal approval

### Artifacts

**Architecture Decision Records** (`decide/adrs/ADR-NNN-*.md`)
- Use ADR template from `artifact-templates.md`
- One per significant decision
- Include: context, decision, alternatives, consequences

**Risk Assessment** (`decide/risk-assessment.md`)
- Technical risks with likelihood and impact
- Mitigation strategies
- Residual risks accepted

**Review Log** (`decide/review-log.md`)
- Stakeholder feedback received
- Actions taken in response
- Open items

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Specialist advice | TECH | Provide detailed advice, maintain expert knowledge, identify boundaries |
| Consultancy | CNSL | Take responsibility for specific engagement elements, collaborate with clients |
| Solution architecture | ARCH | Align solutions with enterprise standards including security |

### Coaching Moments

- After ADRs: coach on anticipating stakeholder questions
- After risk assessment: coach on being honest about risks (not hiding them)
- After feedback: coach on distinguishing valid concerns from scope creep

---

## Phase 5: Deliver

### Purpose
Finalize documentation, create implementation guidance, and enable handoff to development teams.

### Conversation Guide

1. **Documentation completeness**: "Does the architecture doc cover everything a developer needs?"
2. **Implementation guidance**: "What should teams build first? What are the dependencies?"
3. **Deployment**: "How will this be deployed? What environments are needed?"
4. **Governance**: "How will the architecture evolve? What are the change management rules?"

### Activities Checklist

- [ ] Compile final architecture document
- [ ] Create technical dependency map (what must build before what)
- [ ] Define architecture readiness milestones (no dates — PO decides timeline)
- [ ] Create PO decision matrix (questions PO needs to answer)
- [ ] Create implementation guidance or RFC
- [ ] Define deployment architecture
- [ ] Create presentation outputs (HTML for IT, PPTX for leadership)
- [ ] Apply brand tokens if available
- [ ] Handoff to stakeholders

### Artifacts

**Architecture Document** (`deliver/architecture-doc.md`)
- Consolidated document combining key artifacts from all phases
- Sections: executive summary, context, stakeholders, architecture overview, data architecture, security, key decisions (ADR summary), risks, dependency map, milestones, NFR summary, tech stack

**Technical Dependency Map** (in architecture doc)
- Visualize what must be built before what
- SA owns: technical dependencies. PO owns: timeline
- Table: Component | Depends On | Blocks

**Architecture Readiness Milestones** (in architecture doc)
- Define "ready for X" conditions without dates
- Each milestone: prerequisites, deliverables, expected result
- PO decision matrix: questions with architecture impact per answer

**Presentation Outputs** (`deliver/`)
- HTML interactive — IT team deep review (sidebar nav, expandable ADRs)
- PPTX slide deck — leadership/BD (10-13 slides, visual, dependency map, milestones)
- Apply brand design tokens if project has them

**RFC / Implementation Guide** (`deliver/rfc.md`)
- Implementation order based on dependency map
- Key technical decisions and rationale
- Open questions for implementors

**Deployment Architecture** (`deliver/deployment-architecture.md`)
- Environment topology, infrastructure requirements, deployment strategy

### SFIA Skills Practiced

| Skill | Code | Level 4 Activity |
|-------|------|------------------|
| Solution architecture | ARCH | Support projects through preparation of technical plans |
| Methods and tools | METL | Recommend appropriate solutions, provide advice on adoption |
| Consultancy | CNSL | Ensure proposed solutions are understood and effectively applied |

### Coaching Moments

- After architecture doc: coach on writing for the audience (developers, not architects)
- After dependency map: coach on separating SA scope (dependencies) from PO scope (timeline)
- After milestones: coach on defining measurable "ready" conditions
- After presentations: coach on adapting message per audience (detail for IT, story for leadership)
- At completion: summarize SFIA skills practiced and level-up opportunities

### YAGNI Checkpoint

Before finalizing, review all decisions:
> "If the current scale remains unchanged over the next 6 months, would this decision still be justified?"

If only valid at scale, simplify for V1 and document the upgrade path.
