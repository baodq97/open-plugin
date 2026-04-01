# Common Business Analysis Patterns

Reference guide for evaluating trade-offs during BA activities. Each pattern includes a practical analysis: start with what works, upgrade when the situation demands it.

---

## 1. Elicitation: Interviews vs Workshops vs Observation vs Document Analysis

### When to choose what

| Criteria | Interviews | Workshops | Observation | Document Analysis |
|----------|-----------|-----------|-------------|-------------------|
| Best for | Deep individual perspectives | Cross-group alignment | Understanding actual workflows | Baseline knowledge, compliance |
| Time cost | Medium (1h per person) | High (2-4h, prep + facilitation) | High (days of shadowing) | Low (self-paced) |
| Stakeholder involvement | 1-on-1 | Group (5-15 people) | Minimal (observe only) | None |
| Depth of insight | High (probing questions) | Medium-high (group dynamics) | Very high (real behavior) | Low-medium (documented intent) |
| Data quality | Subjective, rich context | Consensus-driven, may mask dissent | Objective, behavioral | Factual but potentially outdated |

### Recommendation

**Start with:** Document analysis + interviews — build baseline understanding from existing materials, then validate and deepen through targeted 1-on-1 conversations.

**Upgrade path:** When alignment is needed across groups or conflicting viewpoints emerge, run facilitated workshops to build shared understanding and resolve disagreements in real time.

**Use observation when:** Written processes do not match reality, or when the problem involves tacit knowledge that stakeholders cannot easily articulate.

---

## 2. Requirements Format: User Stories vs Use Cases vs Shall-Statements vs BDD (Given/When/Then)

### When to choose what

| Criteria | User Stories | Use Cases | Shall-Statements | BDD (Given/When/Then) |
|----------|-------------|-----------|-------------------|----------------------|
| Best for | Agile teams, iterative delivery | Complex interactions, system behavior | Contracts, compliance, procurement | Testable acceptance criteria |
| Team familiarity | High (widely adopted) | Medium (requires training) | High (traditional) | Medium (dev + QA focused) |
| Level of detail | Low-medium (intent-focused) | High (step-by-step flows) | Medium (precise but isolated) | High (scenario-specific) |
| Testability | Low (needs acceptance criteria) | Medium (traceable paths) | Medium (verifiable statements) | Very high (directly executable) |
| Stakeholder readability | High (natural language) | Medium (structured format) | Low-medium (formal language) | Medium (readable scenarios) |

### Recommendation

**Start with:** User stories for agile teams — lightweight, emphasize user value, easy for stakeholders to review. Add acceptance criteria to each story for testability.

**Use shall-statements when:** The project involves contracts, regulatory compliance, or procurement where precise, auditable language is required.

**Use BDD when:** Requirements must be directly testable and the team has QA capacity to maintain executable specifications. BDD bridges the gap between requirements and automated tests.

**Use use cases when:** The system involves complex multi-step interactions with branching logic that user stories cannot adequately capture.

---

## 3. Process Mapping: BPMN vs Value Stream vs Swimlane vs Event-Driven Process Chain

### When to choose what

| Criteria | BPMN | Value Stream Mapping | Swimlane Diagrams | Event-Driven Process Chain |
|----------|------|---------------------|-------------------|---------------------------|
| Best for | Complex processes, automation | Lean optimization, waste identification | Role-based handoffs, responsibility | Event-triggered workflows, ERP |
| Complexity handling | Very high (gateways, events, subprocesses) | Medium (linear flow focus) | Medium (parallel lanes) | High (events + functions + rules) |
| Audience | Process engineers, developers | Operations, lean practitioners | Business stakeholders, managers | ERP consultants, SAP teams |
| Tool support | Extensive (Camunda, Bizagi, draw.io) | Moderate (Miro, Lucidchart) | Extensive (any diagramming tool) | Niche (ARIS, Signavio) |
| Learning curve | Steep (full notation) | Low-medium | Low (intuitive) | Steep (specialized notation) |

### Recommendation

**Start with:** Swimlane diagrams — intuitive for all audiences, clearly show handoffs between roles and departments. Most stakeholders can read and validate them without training.

**Upgrade to BPMN when:** The process has complex decision logic, parallel paths, exception handling, or will be used for process automation. BPMN provides the precision needed for executable process models.

**Use value stream mapping when:** The goal is optimization — identifying waste, bottlenecks, and cycle time improvements in an existing process.

**Avoid event-driven process chains unless:** The organization already uses ERP-centric tooling (SAP/ARIS) and the team is familiar with the notation.

---

## 4. Analysis Technique: Gap Analysis vs Root Cause (5 Whys/Fishbone) vs SWOT vs Force Field

### When to choose what

| Criteria | Gap Analysis | Root Cause (5 Whys / Fishbone) | SWOT | Force Field Analysis |
|----------|-------------|-------------------------------|------|---------------------|
| Best for | Defining change scope (as-is vs to-be) | Understanding why a problem exists | Strategic positioning, initiative evaluation | Assessing change readiness |
| Complexity | Low-medium | Medium (requires discipline) | Low | Low-medium |
| Stakeholder involvement | Medium (SMEs for both states) | Medium-high (diverse perspectives) | High (cross-functional input) | Medium (change agents + resistors) |
| Output type | Action plan with prioritized gaps | Root cause + corrective actions | Opportunity/risk matrix | Driving vs restraining forces map |

### Recommendation

**Start with:** Gap analysis (as-is vs to-be) — it frames the problem space clearly and produces an actionable list of changes needed. This is the most versatile starting point for most BA engagements.

**Use root cause analysis when:** The problem is unclear or recurring. If stakeholders disagree on what the real issue is, 5 Whys or fishbone diagrams surface underlying causes before jumping to solutions.

**Use SWOT for:** Strategic initiatives where external factors (opportunities, threats) are as important as internal capabilities. Useful during project intake and feasibility assessment.

**Use force field analysis when:** Change management is a concern — it explicitly maps forces supporting and opposing the change, helping the team plan targeted interventions.

---

## 5. Prioritization: MoSCoW vs Kano vs Weighted Scoring vs Dot Voting

### When to choose what

| Criteria | MoSCoW | Kano Model | Weighted Scoring | Dot Voting |
|----------|--------|-----------|-----------------|------------|
| Best for | Release scoping, MVP definition | Understanding user satisfaction drivers | Objective multi-criteria decisions | Quick group consensus |
| Data requirement | Low (expert judgment) | Medium (user surveys needed) | Medium-high (defined criteria + scores) | None |
| Stakeholder involvement | Medium (PO + key stakeholders) | Low (survey-based) | High (criteria agreement needed) | High (group exercise) |
| Objectivity | Low (subjective categories) | Medium (data-driven model) | High (quantified comparison) | Low (popularity-based) |
| Speed | Fast (30-60 min session) | Slow (survey design + analysis) | Medium (setup + scoring session) | Very fast (10-15 min) |

### Recommendation

**Start with:** MoSCoW for release scoping — fast, intuitive, and widely understood. It forces clear Must-Have vs Nice-to-Have decisions that keep scope manageable.

**Use weighted scoring when:** Stakeholders disagree on priorities or when decisions need to be defensible. Weighted scoring makes trade-offs transparent by quantifying criteria (business value, effort, risk, dependencies).

**Use Kano when:** The product is mature and the team needs to understand which features drive satisfaction vs which are simply expected. Requires upfront investment in user research.

**Use dot voting for:** Quick temperature checks in workshops. Not suitable for final prioritization decisions — it measures enthusiasm, not strategic value.

---

## 6. Validation: Prototype vs Walkthrough vs Pilot vs UAT

### When to choose what

| Criteria | Prototype | Walkthrough | Pilot | UAT |
|----------|-----------|-------------|-------|-----|
| Best for | UX validation, concept testing | Requirements verification, early defect detection | Real-world feasibility, process validation | Final acceptance before go-live |
| Cost | Medium (design + iteration) | Low (document-based) | High (partial deployment) | Medium-high (test environment + users) |
| User involvement | Medium (feedback sessions) | Low-medium (review meetings) | High (real users, real data) | High (business users execute scenarios) |
| Risk reduction | High for UX/usability | Medium for requirements gaps | Very high (operational risks) | High for acceptance criteria |
| Time | 1-2 weeks per iteration | 1-2 hours per session | Weeks to months | 1-4 weeks |

### Recommendation

**Start with:** Walkthroughs (low cost, catches issues early) — walk stakeholders through requirements, process flows, or wireframes before any build effort. Most requirements defects are cheaper to fix at this stage.

**Add prototyping when:** The solution is UX-heavy or when stakeholders struggle to envision the end product from written requirements alone. Interactive prototypes reduce misunderstanding risk significantly.

**Use pilot when:** The change affects established processes or involves organizational risk. A pilot with a limited user group validates feasibility before full rollout.

**UAT before go-live:** Non-negotiable for any production release. Business users must verify the system meets acceptance criteria using realistic scenarios and data.

---

## General Principles: Root-Cause-First Business Analysis

### Questions before every decision

1. **Problem test:** "Are we solving the real problem or a symptom?"
2. **Stakeholder test:** "Have we heard from all affected parties?"
3. **Data test:** "Do we have evidence or just opinions?"
4. **Simplicity test:** "What is the simplest change that delivers the value?"

### Pattern

```
Understand the problem → Explore options → Recommend with evidence
      (discovery)          (analysis)           (decision)
```

Do not jump to solutions. Understand the problem space first, explore viable options with stakeholders, and recommend based on evidence — not assumptions.
