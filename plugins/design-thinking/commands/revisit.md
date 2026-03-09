---
description: Go back to an earlier Design Thinking phase for iteration
allowed-tools: [Read, Write]
---

Revisit an earlier Design Thinking phase.

## Instructions

1. Read `.design-thinking/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current phase
3. Parse the target phase from the command argument (e.g., `/design-thinking:revisit empathize`)
4. Validate:
   - Target phase must be before or equal to current phase
   - Valid phases: empathize, define, ideate, prototype, prd
5. Reset target phase:
   - For empathize/define/ideate: set status to `engaging`, phase_step to `engage`
   - For prototype: set status to `engaging`, phase_step to `engage`
   - For prd: set status to `synthesizing`, phase_step to `synthesize`
   - Reset `rework_count: 0`, `qg_verdict: null`, `qg_history: []`
   - Preserve `conversation_turns` (don't reset — accumulated total)
6. Reset all phases AFTER the target phase to `not_started`:
   - Reset status, conversation_turns, rework_count, qg_verdict, qg_history
7. Update `current_phase` and `phase_step`
8. Do NOT delete existing artifact files — they remain for reference
9. Add history entry: "Revisited {target_phase} phase"
10. Report: "Returned to {target_phase} phase. Later phases reset to not_started. Previous artifacts preserved for reference."
