---
description: Review and assess a document against SFIA criteria for the active role
argument-hint: "[path to document or paste content]"
allowed-tools: [Read, Glob, Grep]
---

Assess a document against SFIA criteria for the active role.

## Instructions

1. **Determine the role:**
   - Read `.profile-playbook/sessions/` to find the most recent session
   - Read `{workspace}/state.yaml` to get the `role` field
   - If no active session, ask the user which role to assess against (sa, po, ba, testing, pm, ea, cio, cto, cpo)

2. **Load role-specific assessment resources:**
   - Assessment rubric: `skills/{role}-playbook/references/assessment-criteria.md`
   - SFIA skill map: `skills/{role}-playbook/references/sfia-skill-map.md`

3. **Get the document to assess:**
   - If a file path is provided as argument, read the file
   - If no argument, ask the user to provide or paste the document

4. **Evaluate the document:**

   **Identify demonstrated SFIA skills** using the role's skill map — look for evidence of each skill in the document.

   **Score each skill on 4 dimensions:**
   - **Completeness** — coverage of required elements
   - **Depth** — analysis thoroughness
   - **Communication** — clarity and audience appropriateness
   - **Decision quality** — rationale and alternatives documentation

5. **Output the assessment** using the format in the assessment criteria reference:
   - Overall summary
   - Skill ratings with estimated SFIA level
   - Dimension scores with evidence
   - Strengths (with specific examples from the document)
   - Gaps (with specific recommendations)
   - Actionable recommendations for level-up

Keep the assessment constructive — highlight strengths before gaps.
