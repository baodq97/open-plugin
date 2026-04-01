# Project Delivery Competency Assessment

Rubric for evaluating project management documents and PM output against SFIA levels. Used by `/pm:assess` command and `pm-reviewer` agent.

## Assessment Process

1. Read the project management document or artifact
2. Identify which SFIA skills are demonstrated
3. For each skill, evaluate on 4 dimensions
4. Determine overall SFIA level per skill
5. Report: strengths, gaps, specific recommendations

## Scoring Rubric

### Dimension 1: Completeness

Does the output cover all elements expected at this SFIA level?

| Level | Criteria |
|-------|----------|
| **Level 3** | Covers basic elements but has significant gaps. Follows PM processes without understanding why. Missing risk management and stakeholder engagement. |
| **Level 4** | Covers all required elements for the scope. Identifies and assesses risks effectively. Prepares realistic project plans with scope, schedule, quality, risk and communication plans. Monitors costs, times, quality and resources. |
| **Level 5** | Comprehensive coverage including change control, governance alignment, and performance metrics. Proactively manages risks and implements preventive actions. Ensures quality reviews occur on schedule. |
| **Level 6** | Complete strategic coverage. Adapts PM methods to project needs. Integrates risk management within governance frameworks. Manages expectations of key stakeholders aligned with organizational goals. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 3** | Surface-level description. States what was planned without exploring risks or alternatives. Follows established processes without questioning fit. |
| **Level 4** | Identifies and assesses risks effectively. Prepares plans with stakeholder involvement and governance alignment. Tracks activities against schedule. Takes action when tolerances are exceeded. |
| **Level 5** | Deep analysis with proactive performance monitoring. Manages change control processes with risk assessment. Ensures deliverables meet agreed standards, budgets and timelines. Implements preventive and corrective actions. |
| **Level 6** | Strategic analysis adapting PM methods to project context. Integrates robust risk management within governance. Ensures activities align with organizational goals and deliver business value. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 3** | Understandable by project team. May use PM jargon without explanation. Reports follow template without adaptation. |
| **Level 4** | Clear to both project team and stakeholders. Reports are well-structured with logical flow. RAG status and variance analysis support decision-making. |
| **Level 5** | Clear to mixed audiences including senior management. Adapts communication style to stakeholder needs. Regular communication ensures alignment. |
| **Level 6** | Influences strategic decisions through clear articulation. Manages expectations of key stakeholders. Ensures all activities communicate business value. |

### Dimension 4: Decision Quality

How well are project decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 3** | Follows prescribed processes. Decisions implicit or undocumented. Limited consideration of impact. |
| **Level 4** | Applies appropriate PM methods and tools. Risk decisions are documented with assessment. Takes action when tolerances are exceeded. Aligns with governance standards. |
| **Level 5** | Manages change control with risk assessment. Ensures projects align with governance frameworks and business priorities. Proactively monitors and takes preventive action. |
| **Level 6** | Adopts and adapts PM methods suited to project needs. Integrates risk management with organizational risk appetite. Ensures outcomes deliver business value. |

## Skill-Specific Assessment

### Project Management (PRMG)

**Level 4 indicators:**
- Defines, documents and executes small projects or sub-projects
- Applies appropriate PM methods and tools
- Identifies, assesses and manages risks effectively
- Prepares realistic project plans with scope, schedule, quality, risk and communication plans
- Tracks activities against schedule, monitors costs, times, quality and resources
- Takes action where these exceed agreed tolerances

**Level 5 indicators:**
- Takes full responsibility for medium-scale projects
- Provides effective leadership to the project team
- Manages change control processes and assesses risks
- Ensures projects align with governance frameworks and business priorities
- Proactively monitors performance metrics, implementing preventive and corrective actions

**Level 6 indicators:**
- Takes full responsibility for complex projects
- Adopts and adapts PM methods suited to the project's needs
- Ensures effective monitoring and control of resources, budgets and timelines
- Integrates robust risk management within governance frameworks
- Manages expectations of key stakeholders aligned with organizational goals

### Portfolio/Programme/Project Support (PROF)

**Level 4 indicators:**
- Supports project control boards, assurance teams and quality review meetings
- Uses project control solutions for planning, scheduling and tracking
- Sets up and provides guidance on PM software, procedures and tools
- Provides views across projects on risk, quality, finance or configuration management

**Level 5 indicators:**
- Takes responsibility for portfolio, program and project support
- Advises on standards, procedures, methods, tools and techniques
- Evaluates project/program performance and recommends changes
- Contributes to reviews and audits of PM processes

### Benefits Management (BENM)

**Level 4 indicators:**
- Contributes to benefits management plans
- Engages stakeholders to identify and quantify benefits
- Monitors and reports on progress towards benefits realization
- Identifies risks and issues that may impact benefits delivery

**Level 5 indicators:**
- Leads benefits realization activities
- Identifies specific metrics and mechanisms to measure benefits
- Monitors benefits against business case predictions
- Ensures all participants are engaged and prepared

## Assessment Output Format

```markdown
# Project Delivery Competency Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the project management quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Project management | PRMG | L{n} | {High/Medium/Low} |
| Benefits management | BENM | L{n} | {High/Medium/Low} |
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

### Project Fundamentals
- [ ] Clear project purpose and business case
- [ ] Stakeholders identified with their concerns and engagement strategy
- [ ] Scope explicitly defined (in/out) with success criteria
- [ ] Governance framework proportional to project complexity

### Planning Quality
- [ ] Work breakdown structure with dependencies
- [ ] Resource plan with skill requirements
- [ ] Budget with contingency
- [ ] Risk register (RAID log) with mitigation strategies
- [ ] Communication plan with stakeholder mapping

### Execution Quality
- [ ] Status reporting with RAG and trend analysis
- [ ] Change control process with impact analysis
- [ ] Issue management with resolution tracking
- [ ] Milestone tracking with variance analysis

### Closure Quality
- [ ] Deliverables accepted and signed off
- [ ] Benefits tracked against business case
- [ ] Lessons learned captured with actionable recommendations
- [ ] Resources released and accounts closed
