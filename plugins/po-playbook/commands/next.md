---
description: Complete the current PO phase and transition to the next one with coaching
allowed-tools: [Read, Write, Glob]
---

Transition to the next PO phase.

## Instructions

1. Read `{workspace}/state.yaml` to determine current phase
2. Scan current phase directory for artifacts created
3. Summarize current phase outputs:
   - List artifacts produced
   - Highlight key decisions or findings
4. Provide a coaching moment using templates from `references/coaching-prompts.md`:
   - What SFIA skills were practiced and at what level
   - What went well
   - Growth tip for next level
5. Update `state.yaml`:
   - Set current phase status to `completed`, list artifacts
   - Set next phase status to `in_progress`
   - Update `current_phase`
   - Append coaching to `coaching_log`
6. Introduce the next phase:
   - Purpose and activities (from `references/po-phases.md`)
   - SFIA skills that will be practiced
   - First question or activity to begin

If already at the last phase (Deliver & Learn), summarize the entire session with a final coaching review.

If the user wants to skip to a specific phase, allow it — update state accordingly.
