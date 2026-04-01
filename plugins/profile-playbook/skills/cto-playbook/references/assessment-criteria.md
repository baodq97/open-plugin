# Technology Leadership Assessment Criteria

Rubric for evaluating technology strategy documents and CTO output against SFIA levels. Used by `/cto:assess` command and `cto-reviewer` agent.

## Assessment Process

1. Read the technology strategy document or artifact
2. Identify which SFIA skills are demonstrated
3. For each skill, evaluate on 4 dimensions
4. Determine overall SFIA level per skill
5. Report: strengths, gaps, specific recommendations

## Scoring Rubric

### Dimension 1: Completeness

Does the output cover all elements expected at this SFIA level?

| Level | Criteria |
|-------|----------|
| **Level 4** | Covers basic elements but has significant gaps. Supports monitoring and assessment without leading it. Missing strategic context. |
| **Level 5** | Covers all required elements for the scope. Leads within area of responsibility. Documents decisions with rationale. Addresses technical and business requirements. |
| **Level 6** | Comprehensive coverage including cross-organisational impact. Sets policies and standards. Considers strategic alignment, financial aspects, and governance. Includes frameworks for others to follow. |
| **Level 7** | Complete strategic coverage. Directs enterprise-wide transformation. Addresses organisational vision, long-term sustainability, and industry positioning. Establishes principles that shape the organisation. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 4** | Surface-level description. Supports analysis without driving it. Follows established frameworks without questioning fit. |
| **Level 5** | Identifies impacts, threats and opportunities. Evaluates options against strategic objectives. Documents pros/cons with rationale. Provides authoritative guidance within specialist area. |
| **Level 6** | Deep analysis with organisational-wide risk assessment and mitigation strategies. Considers long-term implications. Establishes policies and governance. Engages stakeholders to obtain commitment. |
| **Level 7** | Strategic analysis at enterprise level. Directs transformation programmes. Balances competing organisational objectives. Anticipates industry evolution and positions the organisation accordingly. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 4** | Understandable by technical peers. May use jargon without explanation. Structure follows template without adaptation. |
| **Level 5** | Clear to both technical and business audiences. Adapts style to stakeholder needs. Builds consensus through clear argumentation. Explains complex concepts accessibly. |
| **Level 6** | Influences strategic decisions through clear articulation. Communicates organisational impact. Shapes policy and direction. Accessible to senior leadership and board. |
| **Level 7** | Inspires and mobilises through strategic communication. Engages with industry. Presents compelling arguments authoritatively. Drives organisational vision and direction. |

### Dimension 4: Decision Quality

How well are strategic technology decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 4** | Follows prescribed frameworks. Decisions implicit or undocumented. Limited consideration of alternatives. |
| **Level 5** | Evaluates options with explicit rationale. Documents decisions clearly. Considers cost, capability, and strategic fit. Aligns with organisational standards. Provides authoritative advice. |
| **Level 6** | Establishes decision frameworks and governance. Manages trade-offs across organisational scope. Creates reusable criteria. Coordinates cross-organisational technology direction. Integrates risk management. |
| **Level 7** | Defines organisational decision-making frameworks. Balances business strategy with technology capabilities. Establishes risk appetite. Directs resource allocation for strategic programmes. |

## Skill-Specific Assessment

### Enterprise and Business Architecture (STPL)

**Level 5 indicators:**
- Develops models and plans aligned with business strategy
- Contributes to systems capability strategy
- Creates and maintains technology roadmaps
- Specifies effective business processes through technology improvements

**Level 6 indicators:**
- Develops enterprise-wide architecture and change management processes
- Leads systems capability strategy aligned with business requirements
- Develops business cases for high-level initiatives
- Sets strategies, policies and standards for business-technology compliance

**Level 7 indicators:**
- Directs enterprise-wide architecture development
- Directs enterprise capability strategy
- Oversees long-term enterprise transformation
- Ensures compliance between business strategies and technology directions

### Strategic Planning (ITSP)

**Level 5 indicators:**
- Creates reports and insights to support strategy management
- Develops and communicates plans to drive strategy execution
- Contributes to policies and guidelines for strategy development

**Level 6 indicators:**
- Sets policies and standards for strategy development
- Leads creation or review of strategy meeting business requirements
- Embeds strategic management in operational management

**Level 7 indicators:**
- Leads definition of organisational strategic management framework
- Directs creation of strategy supporting strategic business requirements

### Emerging Technology Monitoring (EMRG)

**Level 5 indicators:**
- Monitors external environment for emerging technologies
- Assesses and documents impacts, threats and opportunities
- Creates technology roadmaps and shares knowledge

**Level 6 indicators:**
- Plans and leads identification and assessment of emerging technologies
- Creates roadmaps aligning organisational plans with emerging solutions
- Engages stakeholders to obtain commitment to technology roadmaps
- Develops organisational guidelines for technology monitoring

### Governance (GOVN)

**Level 6 indicators:**
- Implements governance framework with clear accountability
- Determines governance requirements reflecting values, ethics and risk appetite
- Communicates delegated authority, benefits, costs and risks
- Leads governance practice reviews with independence

**Level 7 indicators:**
- Directs governance framework definition and monitoring
- Integrates risk management with strategic objectives
- Provides assurance to stakeholders on organisational obligations

### Systems Development Management (DLMG)

**Level 5 indicators:**
- Plans and drives systems development work
- Selects appropriate methods, tools and techniques
- Monitors and reports on development progress
- Ensures projects follow agreed standards including security

**Level 6 indicators:**
- Sets policy and drives standards adherence
- Makes security and privacy integral to development
- Manages resources for all development stages
- Ensures technical, financial and quality targets are met

**Level 7 indicators:**
- Directs continual improvement of development management framework
- Aligns development to business strategies and emerging opportunities
- Authorises development function structure and resource allocation

## Assessment Output Format

```markdown
# Technology Leadership Competency Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the technology leadership quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Enterprise and business architecture | STPL | L{n} | {High/Medium/Low} |
| Strategic planning | ITSP | L{n} | {High/Medium/Low} |
| Emerging technology monitoring | EMRG | L{n} | {High/Medium/Low} |
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

### Strategy Fundamentals
- [ ] Clear technology vision aligned with business strategy
- [ ] Current state assessment with evidence
- [ ] Target state with measurable objectives
- [ ] Transition roadmap with phased approach

### Leadership Quality
- [ ] Technology principles established with rationale
- [ ] Governance framework with clear decision rights
- [ ] Risk assessment with mitigation strategies
- [ ] Innovation strategy with portfolio approach

### Decision Documentation
- [ ] Key technology decisions documented with rationale
- [ ] Build vs Buy analyses for major capabilities
- [ ] At least 2 alternatives considered per strategic decision
- [ ] Trade-offs explicitly stated with business impact

### Communication
- [ ] Adapted for multiple audiences (board, C-suite, engineering)
- [ ] Complex technology concepts explained in business terms
- [ ] Actionable for implementation teams
- [ ] Measurable outcomes defined
