---
description: Review and assess an architecture document against SFIA criteria
argument-hint: "[path to architecture document or paste content]"
allowed-tools: [Read, Glob, Grep]
---

Assess an architecture document against SFIA criteria.

## Instructions

This command works independently of any active session.

1. If a file path is provided as argument, read the file
2. If no argument, ask the user to provide or paste the architecture document
3. Load the assessment rubric from `references/assessment-criteria.md`
4. Evaluate the document:

   **Identify demonstrated SFIA skills:**
   - Solution architecture (ARCH) — look for: component design, trade-offs, architectural decisions
   - Systems design (DESN) — look for: detailed design specs, design patterns, modelling
   - Requirements definition (REQM) — look for: requirements documentation, NFRs, traceability
   - Data management (DATM) — look for: data model, governance, storage strategy
   - Information security (SCTY) — look for: security controls, threat analysis, compliance
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
