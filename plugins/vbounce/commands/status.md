---
description: Show current V-Bounce cycle state (read-only)
allowed-tools: [Read]
---

Display the current V-Bounce cycle status. This is a read-only operation — do NOT modify any files.

## Instructions

1. Read `.vbounce/state.yaml` to find the active cycle and workspace path
2. If `.vbounce/state.yaml` does not exist, report: "No active V-Bounce cycle found."
3. Read `{workspace}/state.yaml` for the full cycle state
4. Display in a clear table:
   - Cycle ID
   - Current phase and anatomy step
   - Each phase status (not_started / in_progress / qg_pending / review_pending / approved)
   - QG verdicts for completed phases
   - Approval info (who approved, when)
5. If any phase has warnings, highlight them
