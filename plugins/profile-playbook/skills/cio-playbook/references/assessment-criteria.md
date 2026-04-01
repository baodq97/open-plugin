# IT Leadership Competency Assessment Criteria

Rubric for evaluating IT leadership documents and CIO output against SFIA levels. Used by `/cio:assess` command and `cio-reviewer` agent.

## Assessment Process

1. Read the IT leadership document or artifact
2. Identify which SFIA skills are demonstrated
3. For each skill, evaluate on 4 dimensions
4. Determine overall SFIA level per skill
5. Report: strengths, gaps, specific recommendations

## Scoring Rubric

### Dimension 1: Completeness

Does the output cover all elements expected at this SFIA level?

| Level | Criteria |
|-------|----------|
| **Level 5** | Covers operational elements but has gaps in strategic coverage. Addresses immediate needs without long-term framing. Missing governance or organisational context. |
| **Level 6** | Covers all required elements for the scope. Establishes policies and standards. Addresses organisational impact and stakeholder needs. Considers governance, risk and compliance requirements. |
| **Level 7** | Complete strategic coverage. Addresses enterprise-wide implications, industry context, and long-term direction. Includes frameworks and strategies that others can follow. Sets vision and direction. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 5** | Analyses within a functional area. Provides advice and guidance based on expertise. Identifies issues and recommends solutions within scope. |
| **Level 6** | Organisation-wide analysis with governance alignment. Establishes policies based on deep understanding of business and technology context. Considers financial, quality and risk aspects. Leads strategic initiatives. |
| **Level 7** | Strategic analysis considering industry trends, competitive landscape, and long-term organisational positioning. Establishes enterprise-wide frameworks. Balances competing demands across the entire organisation. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 5** | Clear to technical and some business audiences. Well-structured with logical flow. Explains rationale behind recommendations. |
| **Level 6** | Clear to executive and board-level audiences. Communicates in business value terms. Influences strategic decisions through clear articulation. Adapts communication to stakeholder needs. |
| **Level 7** | Inspires strategic direction. Shapes organisational narrative around IT. Communicates vision that aligns diverse stakeholders. Accessible at board and external stakeholder level. |

### Dimension 4: Decision Quality

How well are IT leadership decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 5** | Makes decisions within delegated authority. Documents rationale and alternatives. Considers operational impact. Aligns with established policies. |
| **Level 6** | Establishes policies and governance frameworks for decision-making. Considers organisational, financial and quality implications. Creates reusable decision criteria. Balances competing demands. |
| **Level 7** | Sets strategic direction and decision-making frameworks. Makes decisions with enterprise-wide and industry-level implications. Provides assurance to stakeholders on governance and risk balance. |

## Skill-Specific Assessment

### Strategic Planning (ITSP)

**Level 6 indicators:**
- Sets policies and guidelines for strategy development
- Leads creation of strategy meeting business requirements
- Embeds strategic management in operational management
- Communicates strategy effectively to stakeholders

**Level 7 indicators:**
- Leads the definition of the strategic management framework
- Directs creation and review of strategy supporting strategic business requirements
- Communicates strategy at board and industry level

### Governance (GOVN)

**Level 6 indicators:**
- Implements governance framework with clear accountability
- Determines governance requirements reflecting values, ethics and risk appetite
- Leads governance reviews with independence
- Manages regulatory relationships

**Level 7 indicators:**
- Directs governance framework definition, implementation and monitoring
- Integrates risk management into governance
- Provides assurance to stakeholders on obligations and risk balance
- Secures resources for governance goals

### Service Level Management (SLMO)

**Level 6 indicators:**
- Ensures effective monitoring and action on service levels
- Ensures SLAs are complete and cost-effective across the catalogue
- Prepares proposals for changes in service levels or types
- Negotiates on disruptions and amendments

**Level 7 indicators:**
- Sets strategies for service delivery supporting strategic needs
- Develops customer relationships at the highest level
- Maintains overview of service delivery contribution to organisational success
- Provides industry leadership on future trends

### Technology Service Management (ITMG)

**Level 6 indicators:**
- Manages resources for technology services portfolio
- Plans processes for monitoring and managing performance
- Aligns services with organisational and financial goals
- Recommends optimal sourcing options

**Level 7 indicators:**
- Sets strategic direction for technology services portfolio
- Promotes technology's potential to drive change
- Authorises new or modified service delivery capabilities
- Maintains strategic overview of technology services contribution

### Enterprise and Business Architecture (STPL)

**Level 6 indicators:**
- Develops enterprise-wide architecture for strategic change
- Leads systems capability strategy aligned with business
- Develops roadmaps with stakeholder buy-in
- Sets policies for compliance between business and technology strategies

**Level 7 indicators:**
- Directs enterprise-wide architecture development
- Oversees roadmaps for long-term transformation
- Ensures compliance between business strategies and technology directions

## Assessment Output Format

```markdown
# IT Leadership Competency Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the IT leadership output quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Strategic planning | ITSP | L{n} | {High/Medium/Low} |
| Governance | GOVN | L{n} | {High/Medium/Low} |
| Service level management | SLMO | L{n} | {High/Medium/Low} |
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

### IT Leadership Fundamentals
- [ ] Clear IT vision linked to business objectives
- [ ] Stakeholders identified with their concerns and influence
- [ ] IT strategy articulated with measurable success criteria
- [ ] Investment priorities justified with business cases

### Governance Quality
- [ ] Decision rights clearly defined
- [ ] Risk management approach established with risk appetite
- [ ] Policies documented with ownership and review cycles
- [ ] Compliance requirements identified and monitored

### Strategic Depth
- [ ] Business-IT alignment explicitly assessed
- [ ] Technology direction with rationale (not just trends)
- [ ] Financial framework with run/grow/transform balance
- [ ] Capability gaps identified with remediation plans

### Communication
- [ ] Executive-level language (business value, not technology jargon)
- [ ] Different views for different audiences
- [ ] Data-driven with clear metrics and targets
- [ ] Actionable with clear decisions required
