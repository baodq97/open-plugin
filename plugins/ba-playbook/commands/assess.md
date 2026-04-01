---
description: Review and assess business analysis work against SFIA criteria
argument-hint: "[path to BA document or paste content]"
allowed-tools: [Read, Glob, Grep]
---

Assess business analysis work against SFIA criteria.

## Instructions

This command works independently of any active session.

1. If a file path is provided as argument, read the file
2. If no argument, ask the user to provide or paste the BA document (requirements, process map, feasibility, etc.)
3. Load the assessment rubric from `references/assessment-criteria.md`
4. Evaluate the document:

   **Identify demonstrated SFIA skills:**
   - Business situation analysis (BUSA) — look for: problem investigation, root cause analysis, stakeholder engagement
   - Requirements definition (REQM) — look for: requirements quality, traceability, scope management, acceptance criteria
   - Feasibility assessment (FEAS) — look for: options analysis, cost/benefit, business cases
   - Business process improvement (BPRE) — look for: process models, gap analysis, improvement recommendations
   - Data modelling (DTAN) — look for: entity models, data relationships, data governance
   - User experience analysis (UNAN) — look for: user research, UX requirements, accessibility
   - Other skills as applicable

   **Score each skill on 4 dimensions:**
   - Completeness — coverage of required elements
   - Depth — analysis thoroughness
   - Communication — clarity and audience appropriateness
   - Decision quality — rationale and alternatives documentation

5. Output the assessment using the format in `references/assessment-criteria.md`:
   - Overall summary
   - Skill ratings with estimated SFIA level
   - Dimension scores with evidence
   - Strengths (with specific examples from the document)
   - Gaps (with specific recommendations)
   - Actionable recommendations for level-up

Keep the assessment constructive — highlight strengths before gaps.
