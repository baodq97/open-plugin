---
description: Approve the current V-Bounce phase and advance to next
allowed-tools: [Read, Write, Agent]
---

Approve the current V-Bounce phase.

## Instructions

1. Read `.vbounce/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current phase and status
3. If phase status is not `review_pending`, report error: "Phase is not ready for approval (current status: {status})"
4. Update state:
   - `phases.{phase}.status: approved`
   - `phases.{phase}.approved_by: user` (or the role if user provided one as argument)
   - Add history entry with timestamp
5. Launch traceability-analyst agent (Update mode) with the resolved workspace path
6. Launch knowledge-curator agent (Per-Phase capture) with the resolved workspace path
7. Advance state: `current_phase: {next_phase}`, `anatomy_step: input`
8. Report: "Phase {phase} approved. Moving to {next_phase}."
