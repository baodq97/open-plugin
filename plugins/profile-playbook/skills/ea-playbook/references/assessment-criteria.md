# Enterprise Architecture Competency Assessment

Rubric for evaluating enterprise architecture documents and EA output against SFIA levels. Used by `/ea:assess` command and `ea-reviewer` agent.

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
| **Level 4** | Covers basic elements of enterprise architecture. Contributes to strategy and planning. Documents some architecture decisions. Follows established patterns. |
| **Level 5** | Covers all required elements for the scope. Develops models and plans to drive strategy execution. Creates roadmaps for capability improvements. Specifies effective business processes through technology and organizational improvements. |
| **Level 6** | Comprehensive coverage including enterprise-wide architecture. Leads systems capability strategy. Develops business cases for high-level initiatives. Sets strategies, policies and practices for compliance between business and technology strategies. |
| **Level 7** | Complete strategic coverage. Directs enterprise-wide architecture development. Oversees long-term transformation roadmaps. Ensures compliance between business strategies, transformation activities and technology directions. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 4** | Surface-level analysis. Contributes to strategy without leading. Assists in preparation of reports. Supports communication of plans. |
| **Level 5** | Solid analysis with stakeholder engagement. Creates reports and insights for strategy management. Develops and communicates plans. Contributes to organizational policies and standards. |
| **Level 6** | Deep analysis with enterprise-wide scope. Captures and prioritizes market trends. Identifies alternative strategies. Develops business cases for funding. Sets policies ensuring compliance. |
| **Level 7** | Strategic analysis at the highest level. Directs enterprise capability strategy. Identifies business benefits of alternative strategies. Ensures enterprise-wide compliance between business and technology. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 4** | Communicates to technical peers. Supports communication of strategic plans to stakeholders. Structure follows templates. |
| **Level 5** | Communicates to mixed audiences. Ensures stakeholders are aware of strategic approaches. Provides guidance to help stakeholders adhere to the approach. Clear and well-structured with logical flow. |
| **Level 6** | Communicates at executive level. Ensures stakeholder buy-in for enterprise roadmaps. Develops and communicates implementation processes. Influences strategic decisions. |
| **Level 7** | Communicates at board level. Directs the communication of strategic frameworks. Shapes organizational direction through clear articulation of architecture strategy. |

### Dimension 4: Decision Quality

How well are architectural decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 4** | Follows prescribed patterns. Contributes to decision-making. Documents basic rationale. |
| **Level 5** | Develops plans with clear rationale. Creates roadmaps with strategic alignment. Contributes to organizational policies and standards. |
| **Level 6** | Leads strategy creation that meets business requirements. Develops business cases for approval and funding. Sets strategies and policies for enterprise compliance. |
| **Level 7** | Directs enterprise-wide strategy and architecture. Identifies benefits of alternative strategies. Ensures compliance at the highest level. |

## Skill-Specific Assessment

### Enterprise and Business Architecture (STPL)

**Level 5 indicators:**
- Develops models and plans to drive business strategy execution
- Contributes to systems capability strategy
- Creates and maintains roadmaps for strategy and capability improvements
- Specifies effective business processes through improvements

**Level 6 indicators:**
- Develops enterprise-wide architecture and processes for strategic change
- Leads systems capability strategy creation and review
- Develops roadmaps with stakeholder buy-in
- Sets strategies and policies for business-technology compliance
- Develops business cases for high-level initiative approval

**Level 7 indicators:**
- Directs enterprise-wide architecture development
- Directs enterprise capability strategy creation
- Oversees long-term transformation roadmaps
- Ensures enterprise-wide compliance

### Strategic Planning (ITSP)

**Level 5 indicators:**
- Creates reports and insights for strategy management
- Develops and communicates strategy-driving plans
- Ensures stakeholder awareness of strategic approach
- Contributes to strategy development policies

**Level 6 indicators:**
- Sets policies and standards for strategy development
- Leads strategy creation meeting business requirements
- Embeds strategic management in operational management

### Governance (GOVN)

**Level 6 indicators:**
- Implements governance framework
- Determines governance requirements reflecting values and risk appetite
- Leads reviews of governance practices
- Acts as contact for regulatory authorities

**Level 7 indicators:**
- Directs governance framework definition and monitoring
- Integrates risk management into frameworks
- Secures resources for governance goals
- Provides assurance to stakeholders

## Assessment Output Format

```markdown
# Enterprise Architecture Competency Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the architecture's quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Enterprise and business architecture | STPL | L{n} | {High/Medium/Low} |
| Strategic planning | ITSP | L{n} | {High/Medium/Low} |
| Governance | GOVN | L{n} | {High/Medium/Low} |
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
- [ ] Clear business strategy alignment
- [ ] Stakeholders identified with their concerns
- [ ] Scope explicitly defined (in/out)
- [ ] Architecture principles documented with rationale

### Enterprise Scope
- [ ] Business capability model defined
- [ ] Reference architecture created for relevant domains
- [ ] Technology roadmap with clear adopt/retire guidance
- [ ] Data architecture and governance defined
- [ ] Security architecture aligned with compliance requirements

### Governance
- [ ] Governance model defined and appropriate
- [ ] Architecture review board established
- [ ] Compliance criteria documented
- [ ] Waiver process defined

### Communication
- [ ] Multiple views for different audiences (executive, technical, delivery)
- [ ] Roadmaps are actionable and time-bound
- [ ] Principles are practical, not just aspirational
- [ ] Architecture is accessible to delivery teams
