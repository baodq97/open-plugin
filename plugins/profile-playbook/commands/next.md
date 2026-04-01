---
description: Complete the current phase and transition to the next one with coaching
allowed-tools: [Read, Write, Glob]
---

Transition to the next phase in the active playbook session.

## Instructions

1. **Load session state:**
   - Read `.profile-playbook/sessions/` to find the most recent session
   - Read `{workspace}/state.yaml` to get `role` and `current_phase`

2. **Load role-specific resources:**
   - Phase guide: `skills/{role}-playbook/references/{domain}-phases.md`
   - Coaching prompts: `skills/{role}-playbook/references/coaching-prompts.md`

   **Domain mapping:** sa→sa, po→po, ba→ba, testing→testing, pm→pm, ea→ea, cio→cio, cto→cto, cpo→cpo

3. **Summarize current phase outputs:**
   - Scan current phase directory for artifacts created
   - List artifacts produced
   - Highlight key decisions or findings

4. **Provide a coaching moment:**
   - What SFIA skills were practiced and at what level
   - What went well
   - Growth tip for next level

5. **Update `state.yaml`:**
   - Set current phase status to `completed`, list artifacts
   - Set next phase status to `in_progress`
   - Update `current_phase`
   - Append coaching to `coaching_log`

6. **Introduce the next phase:**
   - Purpose and activities (from the phases reference)
   - SFIA skills that will be practiced
   - First question or activity to begin

If already at the last phase, summarize the entire session with a final coaching review.

If the user wants to skip to a specific phase, allow it — update state accordingly.
