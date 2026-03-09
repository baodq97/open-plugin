---
description: Approve the current Design Thinking phase and advance to next
allowed-tools: [Read, Write]
---

Approve the current Design Thinking phase.

## Instructions

1. Read `.design-thinking/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current phase and status
3. If phase status is not `review_pending`, report error: "Phase is not ready for approval (current status: {status})"
4. Update state:
   - `phases.{phase}.status: approved`
   - Add history entry with timestamp
5. Advance state:
   - `current_phase: {next_phase}`
   - `phase_step: engage` (or `synthesize` for PRD phase)
   - `phases.{next_phase}.status: engaging` (or `synthesizing` for PRD phase)
6. Report: "Phase {phase} approved. Moving to {next_phase}."
7. If the approved phase was `prd`, report: "All phases complete! Your PRD is at `{workspace}/prd.md`. Use `/design-thinking:handoff` to prepare for vbounce."

Phase order: empathize → define → ideate → prototype → prd
