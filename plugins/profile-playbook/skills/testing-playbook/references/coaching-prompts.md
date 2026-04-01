# Coaching Prompt Templates

Inline coaching templates organized by SFIA skill and level transition. Use these as starting points — adapt to the specific context.

## Format

```
> **Testing Coach** ({SKILL_CODE} L{current} → L{target})
> {Observation about what was just done or is about to be done}
> {Actionable tip for performing at the next level}
```

## When to Coach

- After completing a significant artifact
- When a testing decision is made
- At phase transitions
- When the user asks "why" about a step

## When NOT to Coach

- Every single step (causes fatigue)
- During routine data entry
- When the user is in flow and didn't ask

---

## Functional Testing (TEST)

### L3 → L4

**After designing test cases:**
> **Testing Coach** (TEST L3 → L4)
> Good test case design covering the main scenarios.
> At level 4, select your testing approach based on risk and criticality — not just coverage. Ask: "What are the highest-risk areas?" and focus test design there first. Manage the automated framework, not just contribute test scripts.

**After executing test scripts:**
> **Testing Coach** (TEST L3 → L4)
> Solid execution of the test suite.
> At level 4, go further: provide detailed analysis and reporting on test activities and results, including work done by others. Configure environments to mirror real-world usage, not just follow existing configurations.

### L4 → L5

**After creating a test plan:**
> **Testing Coach** (TEST L4 → L5)
> Good test plan with clear risk-based prioritization.
> At level 5, lead functional testing efforts across all development stages. Provide authoritative advice on testing methods, tools and frameworks. Monitor and improve test coverage — don't just report it. Contribute to organizational testing policies and standards.

**After managing test automation:**
> **Testing Coach** (TEST L4 → L5)
> Strong management of the automated testing framework.
> At level 5, lead efforts to improve the efficiency and reliability of functional testing. Identify systemic improvements, not just individual test fixes. Ensure compliance with organizational standards across the testing effort.

### L5 → L6

**After leading a testing initiative:**
> **Testing Coach** (TEST L5 → L6)
> Strong leadership of the testing effort with good risk-based prioritization.
> At level 6, develop organizational policies, standards and guidelines for functional testing. Think cross-project: how can this testing approach become a reusable standard? Drive a culture of quality, not just compliance.

---

## Quality Assurance (QUAS)

### L3 → L4

**After conducting a quality review:**
> **Testing Coach** (QUAS L3 → L4)
> Good identification of compliance issues.
> At level 4, plan and organize assessment activity — don't wait for assignments. Determine the risks associated with findings, not just report non-compliance. Propose corrective actions and provide guidance on organizational standards.

### L4 → L5

**After drafting a compliance report:**
> **Testing Coach** (QUAS L4 → L5)
> Thorough compliance report with clear risk analysis.
> At level 5, conduct formal reviews of complex cross-functional areas. Determine the underlying reasons for non-compliance, not just the symptoms. Identify opportunities to improve organizational control mechanisms. Oversee assurance activities of others.

### L5 → L6

**After improving quality processes:**
> **Testing Coach** (QUAS L5 → L6)
> Strong identification of improvement opportunities.
> At level 6, lead and be accountable for the organizational approach to quality assurance. Consider implications of emerging technology and regulations. Ensure QA processes are tailored to organizational quality objectives.

---

## User Acceptance Testing (BPTS)

### L3 → L4

**After writing acceptance test cases:**
> **Testing Coach** (BPTS L3 → L4)
> Good test cases based on acceptance criteria.
> At level 4, develop acceptance criteria yourself — related to functional and non-functional requirements, business processes, and business rules. Collaborate with stakeholders to ensure comprehensive coverage. Analyze and report on test activities including work done by others.

### L4 → L5

**After facilitating UAT:**
> **Testing Coach** (BPTS L4 → L5)
> Good collaboration with business stakeholders on acceptance testing.
> At level 5, plan and manage the entire UAT activity. Set entry and exit criteria. Ensure test cases reflect realistic operational conditions. Ensure users receive appropriate training and support. Provide authoritative advice on acceptance testing planning and execution.

### L5 → L6

**After managing UAT across projects:**
> **Testing Coach** (BPTS L5 → L6)
> Strong management of UAT with clear entry and exit criteria.
> At level 6, lead the organization's approach to user acceptance testing. Engage senior stakeholders to secure commitment and resources. Develop organizational policies and standards for acceptance testing. Build acceptance testing capabilities for the organization.

---

## Methods and Tools (METL)

### L3 → L4

**After using a testing tool:**
> **Testing Coach** (METL L3 → L4)
> Good use of established testing tools.
> At level 4, engage with stakeholders to understand their tool requirements. Recommend appropriate solutions — don't just use what's given. Tailor processes to meet specific needs while aligning with established standards.

### L4 → L5

**After recommending a tool or approach:**
> **Testing Coach** (METL L4 → L5)
> Good recommendation with clear rationale.
> At level 5, provide authoritative advice and leadership on tool adoption. Evaluate and select methods and tools in line with organizational policies. Manage reviews of the benefits and value of methods and tools. Identify improvements that support broader organizational goals.

### L5 → L6

**After evaluating testing methods:**
> **Testing Coach** (METL L5 → L6)
> Strong evaluation of methods with clear organizational impact.
> At level 6, develop organizational policies, standards and guidelines for methods and tools. Lead the introduction of new techniques and methodologies. Secure organizational commitment and resources. Drive continuous improvement and innovation.

---

## Phase Transition Coaching

### Discover → Plan

> **Testing Coach** (Phase transition)
> Discovery complete. Key output: {summary of risks and context identified}.
> Reflection: Were there any risk areas you discovered late that changed the testing approach? Next time, start with a broader risk canvas. Moving to Plan — translate these findings into a risk-based test strategy.

### Plan → Execute

> **Testing Coach** (Phase transition)
> Planning complete. Key output: test strategy covering {count} test types, {count} risk areas.
> Reflection: Are all entry criteria measurable? Vague criteria like "environment ready" become blockers later. Moving to Execute — focus on the highest-risk areas first.

### Execute → Evaluate

> **Testing Coach** (Phase transition)
> Execution complete. Key output: {count} test cases executed, {count} defects found.
> Reflection: Did the risk-based approach guide execution priority? Were the highest-risk areas tested first? Moving to Evaluate — analyze results and provide a release readiness recommendation.

### Evaluate → Improve

> **Testing Coach** (Phase transition)
> Evaluation complete. Key output: release recommendation with {count} residual risks documented.
> Reflection: Remember — testing provides the risk assessment, the release decision belongs to delivery/product. Moving to Improve — what can we do better next time?

### Session Complete

> **Testing Coach** (Session summary)
> Testing session complete. Skills practiced:
> {List of SFIA skills and estimated levels demonstrated}
> Top strength: {strongest area}
> Growth opportunity: {area for improvement with specific tip}

---

## Risk-Based Testing Coaching

Particularly important coaching — helps the tester focus on risk rather than coverage metrics.

**When the user proposes testing everything equally:**
> **Testing Coach** (TEST L4 — Risk-based)
> Full coverage sounds thorough, but ask yourself: "Which areas have the highest business impact if they fail? Which areas have the most change or complexity?"
> Tip: Prioritize by risk. Test high-risk areas deeply, low-risk areas lightly. Document the rationale for your prioritization.

**When the user focuses on coverage metrics:**
> **Testing Coach** (TEST L4 → L5)
> Coverage metrics are useful but can be misleading. 80% coverage does not mean 80% of risks are tested. A better question: "Have we tested the scenarios that matter most to the business?"

**When the user asks about test completeness:**
> **Testing Coach** (QUAS L4 → L5)
> Testing is never "complete" — it's about reaching an acceptable level of confidence. Define exit criteria based on risk tolerance, not on zero defects. Document residual risks clearly so stakeholders can make informed decisions.

---

## Testing vs Release Decision Coaching

Coaching on responsibility boundaries — helps testers understand the limits of their scope.

**When the user starts making release decisions:**
> **Testing Coach** (QUAS L4)
> Note: the release decision is a product/delivery decision, not a testing decision. Testing provides: (1) test results and quality assessment, (2) residual risk analysis, (3) release readiness recommendation. Delivery/product decides: when to release, which risks to accept, and how much testing is sufficient.

**When the user asks "Should we release?":**
> **Testing Coach** (BURM L4)
> Great question! Testing answers: "Here is the current quality status and these are the residual risks." But the release decision weighs business factors (market timing, contractual deadlines, competitive pressure) that are outside testing's scope. Provide the risk assessment and let delivery/product decide.
