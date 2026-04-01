# Architecture Assessment Criteria

Rubric for evaluating architecture documents and SA output against SFIA levels. Used by `/sa:assess` command and `sa-reviewer` agent.

## Assessment Process

1. Read the architecture document or artifact
2. Identify which SFIA skills are demonstrated
3. For each skill, evaluate on 4 dimensions
4. Determine overall SFIA level per skill
5. Report: strengths, gaps, specific recommendations

## Scoring Rubric

### Dimension 1: Completeness

Does the output cover all elements expected at this SFIA level?

| Level | Criteria |
|-------|----------|
| **Level 3** | Covers basic elements but has significant gaps. Follows patterns without understanding why. Missing edge cases and error scenarios. |
| **Level 4** | Covers all required elements for the scope. Identifies trade-offs and alternatives. Documents decisions with rationale. Addresses functional and non-functional requirements. |
| **Level 5** | Comprehensive coverage including edge cases and failure scenarios. Considers cross-cutting concerns (security, observability, operability). Includes governance and evolution guidance. |
| **Level 6** | Complete strategic coverage. Addresses organizational impact, policy alignment, and multi-project implications. Includes principles and standards for others to follow. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 3** | Surface-level description. States what was chosen without exploring why. Follows established patterns without questioning fit. |
| **Level 4** | Identifies trade-offs between 2+ alternatives. Evaluates options against requirements. Documents pros/cons with rationale. Performs basic risk identification. |
| **Level 5** | Deep analysis with risk assessment and mitigation strategies. Considers long-term implications. Evaluates impact of major design options. Provides authoritative guidance. |
| **Level 6** | Strategic analysis considering organizational, financial, and quality aspects. Establishes reusable principles. Balances competing concerns across multiple initiatives. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 3** | Understandable by technical peers. May use jargon without explanation. Structure follows template without adaptation. |
| **Level 4** | Clear to both technical and some business audiences. Uses multiple views for different stakeholders. Well-structured with logical flow. Diagrams support text. |
| **Level 5** | Clear to mixed technical and business audiences. Adapts communication style to stakeholder needs. Builds consensus through clear argumentation. Explains complex concepts accessibly. |
| **Level 6** | Influences strategic decisions through clear articulation. Communicates organizational impact. Provides direction that shapes policy. Accessible at executive level. |

### Dimension 4: Decision Quality

How well are architectural decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 3** | Follows prescribed patterns. Decisions implicit or undocumented. Limited consideration of alternatives. |
| **Level 4** | Evaluates options with explicit rationale. Documents decisions in ADR format. Considers cost, performance, and scalability trade-offs. Aligns with enterprise standards. |
| **Level 5** | Recommends with risk mitigation. Evaluates change impact. Ensures standards and practices are applied correctly. Provides technical governance. |
| **Level 6** | Establishes principles and governance frameworks. Manages trade-offs across organizational scope. Creates reusable decision criteria. Coordinates cross-project architecture. |

## Skill-Specific Assessment

### Solution Architecture (ARCH)

**Level 4 indicators:**
- Documents architecturally significant decisions
- Identifies and evaluates alternative architectures
- Produces component specifications with clear interfaces
- Aligns solutions with enterprise standards
- Addresses security in architecture

**Level 5 indicators:**
- Leads architecture development (not just contributes)
- Provides technical governance
- Evaluates change requests against architectural standards
- Ensures tools and methods are documented
- Manages cost alongside technical concerns

**Level 6 indicators:**
- Establishes architecture selection policies and principles
- Coordinates architecture across multiple projects
- Balances functional, quality, cost, and management requirements
- Maintains architectural consistency and standards adherence

### Systems Design (DESN)

**Level 4 indicators:**
- Uses modelling techniques appropriate to the context
- Creates multiple design views for different stakeholders
- Evaluates design options and trade-offs
- Produces detailed specifications
- Reviews and verifies designs against requirements

**Level 5 indicators:**
- Designs large or complex systems
- Conducts impact analysis on major design options
- Balances functional and non-functional requirements
- Contributes to design policies and standards

### Requirements (REQM)

**Level 4 indicators:**
- Manages scoping for medium-complexity initiatives
- Facilitates stakeholder input with constructive challenge
- Establishes requirements baselines with traceability
- Enables effective prioritization

**Level 5 indicators:**
- Plans and drives requirements for large, complex initiatives
- Negotiates competing priorities between stakeholders
- Selects and adapts requirements methods
- Manages requirements changes

## Assessment Output Format

```markdown
# Architecture Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the architecture's quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Solution architecture | ARCH | L{n} | {High/Medium/Low} |
| Systems design | DESN | L{n} | {High/Medium/Low} |
| {etc.} | | | |

## Dimension Scores

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| Completeness | L{n} | {What's covered, what's missing} |
| Depth | L{n} | {Analysis quality evidence} |
| Communication | L{n} | {Clarity and audience-fit evidence} |
| Decision quality | L{n} | {Decision documentation evidence} |

## Strengths
1. {Specific strength with example from the document}
2. {Specific strength with example from the document}

## Gaps
1. {Specific gap with recommendation}
2. {Specific gap with recommendation}

## Recommendations for Level-Up
1. {Actionable recommendation to reach next level}
2. {Actionable recommendation to reach next level}
```

## Quick Assessment Checklist

For a fast review, check these items:

### Architecture Fundamentals
- [ ] Clear problem statement and business context
- [ ] Stakeholders identified with their concerns
- [ ] Scope explicitly defined (in/out)
- [ ] Quality attributes prioritized with measurable targets

### Design Quality
- [ ] Architectural style chosen with rationale
- [ ] Components have clear responsibilities
- [ ] Integration patterns specified
- [ ] Data model and storage strategy defined
- [ ] Security addressed (not just mentioned)

### Decision Documentation
- [ ] Key decisions documented (ADR format or equivalent)
- [ ] At least 2 alternatives considered per major decision
- [ ] Trade-offs explicitly stated
- [ ] Risks identified with mitigation

### Communication
- [ ] Multiple views for different audiences
- [ ] Diagrams support the narrative
- [ ] Technical jargon explained where needed
- [ ] Actionable for implementation teams
