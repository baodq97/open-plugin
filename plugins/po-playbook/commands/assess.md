---
description: Review and assess product work against SFIA criteria
argument-hint: "[path to product document or paste content]"
allowed-tools: [Read, Glob, Grep]
---

Assess product management work against SFIA criteria.

## Instructions

This command works independently of any active session.

1. If a file path is provided as argument, read the file
2. If no argument, ask the user to provide or paste the product document (roadmap, backlog, vision, etc.)
3. Load the assessment rubric from `references/assessment-criteria.md`
4. Evaluate the document:

   **Identify demonstrated SFIA skills:**
   - Product management (PROD) — look for: backlog structure, prioritization rationale, lifecycle awareness
   - Requirements definition (REQM) — look for: user stories, acceptance criteria, scope management
   - Stakeholder management (RLMT) — look for: stakeholder identification, communication planning, engagement
   - Delivery management (DEMG) — look for: release planning, methodology, progress tracking
   - Customer experience (CEXP) — look for: customer journey, user research integration, experience design
   - Measurement (MEAS) — look for: success metrics, OKRs, data-driven decisions
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
