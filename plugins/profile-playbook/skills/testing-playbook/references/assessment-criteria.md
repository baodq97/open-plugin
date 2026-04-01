# Testing Competency Assessment Criteria

Rubric for evaluating testing documents and testing output against SFIA levels. Used by `/testing:assess` command and `test-reviewer` agent.

## Assessment Process

1. Read the testing document or artifact
2. Identify which SFIA skills are demonstrated
3. For each skill, evaluate on 4 dimensions
4. Determine overall SFIA level per skill
5. Report: strengths, gaps, specific recommendations

## Scoring Rubric

### Dimension 1: Completeness

Does the output cover all elements expected at this SFIA level?

| Level | Criteria |
|-------|----------|
| **Level 3** | Covers basic elements but has significant gaps. Follows test scripts without understanding why. Missing edge cases and negative scenarios. |
| **Level 4** | Covers all required elements for the scope. Selects appropriate testing approaches considering risk. Documents test plans with entry and exit criteria. Addresses functional and non-functional testing. |
| **Level 5** | Comprehensive coverage including edge cases, failure scenarios, and cross-functional areas. Considers risk-based prioritization across all development stages. Includes governance and process improvement guidance. |
| **Level 6** | Complete strategic coverage. Addresses organizational testing policies and standards. Includes risk-based approach aligned with business strategy. Provides direction for others to follow. |

### Dimension 2: Depth

How thoroughly are topics analyzed?

| Level | Criteria |
|-------|----------|
| **Level 3** | Surface-level test design. Executes given scripts without exploring why. Follows established approaches without questioning fit. |
| **Level 4** | Identifies risks and selects testing approaches based on criticality and complexity. Manages automated testing frameworks. Provides detailed analysis and reporting on test activities including work done by others. |
| **Level 5** | Deep analysis with risk-based prioritization across development stages. Provides authoritative advice on testing methods. Leads improvements to efficiency and reliability. Contributes to organizational policies. |
| **Level 6** | Strategic analysis considering organizational, business, and quality aspects. Develops policies and standards. Drives quality culture. Coordinates complex testing initiatives. |

### Dimension 3: Communication

Is the output clear, well-structured, and appropriate for the audience?

| Level | Criteria |
|-------|----------|
| **Level 3** | Understandable by technical peers. May use testing jargon without explanation. Structure follows template without adaptation. |
| **Level 4** | Clear to both technical and business audiences. Reports on test activities and results effectively. Well-structured with logical flow. Defect reports are actionable. |
| **Level 5** | Clear to mixed technical and business audiences. Highlights issues and risks to stakeholders effectively. Builds consensus on quality assessment. Provides authoritative advice accessibly. |
| **Level 6** | Influences strategic decisions through clear articulation. Communicates organizational quality impact. Reports on compliance and improvement opportunities. Accessible at executive level. |

### Dimension 4: Decision Quality

How well are testing decisions made and documented?

| Level | Criteria |
|-------|----------|
| **Level 3** | Follows prescribed test approaches. Decisions implicit or undocumented. Limited consideration of alternatives. |
| **Level 4** | Selects testing approaches with explicit rationale based on risk, criticality, and complexity. Documents entry and exit criteria. Manages test prioritization. Aligns with organizational standards. |
| **Level 5** | Leads testing decisions with risk-based prioritization. Ensures compliance with standards. Provides authoritative guidance. Identifies and implements improvements. |
| **Level 6** | Establishes testing policies and governance frameworks. Develops organizational capabilities. Creates reusable decision criteria. Coordinates cross-project testing standards. |

## Skill-Specific Assessment

### Functional Testing (TEST)

**Level 4 indicators:**
- Selects appropriate testing approaches considering risk, criticality, and complexity
- Develops and automates comprehensive test plans and cases
- Configures environments to mirror real-world usage
- Manages scalable automated testing frameworks
- Provides detailed analysis and reporting including work done by others

**Level 5 indicators:**
- Leads functional testing across all development stages
- Provides authoritative advice on methods, tools, and frameworks
- Monitors and improves test coverage
- Leads improvements to efficiency and reliability
- Contributes to organizational policies and standards

**Level 6 indicators:**
- Develops organizational policies for functional testing
- Plans and leads complex testing initiatives
- Drives quality culture and proactive risk mitigation
- Coordinates with other testing activities

### Quality Assurance (QUAS)

**Level 4 indicators:**
- Plans and organizes assessment activity
- Conducts formal assessments or reviews
- Determines risks associated with findings
- Proposes corrective actions
- Provides advice on organizational standards

**Level 5 indicators:**
- Conducts formal reviews of complex cross-functional areas
- Determines underlying reasons for non-compliance
- Identifies opportunities to improve control mechanisms
- Oversees assurance activities of others

**Level 6 indicators:**
- Leads organizational approach to quality assurance
- Ensures QA processes are tailored to quality objectives
- Considers implications of emerging technology and regulations
- Reports on compliance and improvement opportunities

### User Acceptance Testing (BPTS)

**Level 4 indicators:**
- Develops acceptance criteria for functional and non-functional requirements
- Designs test cases ensuring comprehensive coverage
- Collaborates with stakeholders on accuracy
- Analyzes and reports on test activities including work of others

**Level 5 indicators:**
- Plans and manages entire UAT activity
- Sets and enforces entry and exit criteria
- Ensures realistic operational conditions in test cases
- Provides authoritative advice on acceptance testing

## Assessment Output Format

```markdown
# Testing Competency Assessment

**Document:** {filename or description}
**Assessed:** {date}

## Overall Summary
{2-3 sentence summary of the testing output's quality}

## Skill Ratings

| SFIA Skill | Code | Estimated Level | Confidence |
|-----------|------|----------------|------------|
| Functional testing | TEST | L{n} | {High/Medium/Low} |
| Quality assurance | QUAS | L{n} | {High/Medium/Low} |
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

### Testing Fundamentals
- [ ] Clear test context and business drivers
- [ ] Risk areas identified and prioritized
- [ ] Scope explicitly defined (in/out)
- [ ] Quality attributes prioritized with measurable targets

### Test Design Quality
- [ ] Testing approach selected with rationale
- [ ] Test cases cover high-risk areas first
- [ ] Entry and exit criteria defined and measurable
- [ ] Test data and environment requirements specified
- [ ] Automation strategy defined

### Decision Documentation
- [ ] Testing approach decisions documented with rationale
- [ ] Risk-based prioritization clearly explained
- [ ] Trade-offs between test types stated
- [ ] Residual risks identified with mitigation

### Communication
- [ ] Test plan understandable by non-testers
- [ ] Defect reports are actionable
- [ ] Test summary report highlights key risks
- [ ] Release recommendation is clear and evidence-based
