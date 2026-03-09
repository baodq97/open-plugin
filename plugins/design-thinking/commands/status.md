---
description: Show current Design Thinking session state (read-only)
allowed-tools: [Read]
---

Display the current Design Thinking session status. This is a read-only operation — do NOT modify any files.

## Instructions

1. Read `.design-thinking/state.yaml` to find the active session and workspace path
2. If `.design-thinking/state.yaml` does not exist, report: "No active Design Thinking session found."
3. Read `{workspace}/state.yaml` for the full session state
4. Display in a clear table:
   - Session ID
   - Current phase and phase step
   - Each phase status (not_started / engaging / synthesizing / qg_pending / review_pending / approved)
   - Conversation turns per phase
   - QG verdicts and rework counts for completed phases
   - Interview round (for empathize phase)
5. If any phase has warnings or QG failures, highlight them
