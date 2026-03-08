---
description: Rollback to a previous V-Bounce phase
allowed-tools: [Read, Write]
---

Rollback to a previous phase in the current V-Bounce cycle. User must provide the target phase name.

## Instructions

1. Read `.vbounce/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current phase
3. Valid target phases: requirements, design, contracts, implementation, review
4. Validate: target phase must be BEFORE current phase in the sequence
5. Reset the target phase status to `not_started`
6. Reset all phases AFTER the target to `not_started`
7. Update state: `current_phase: {target}`, `anatomy_step: input`
8. Add history entry with timestamp and reason
9. Report: "Rolled back to {target}. Phases after {target} have been reset."
10. Do NOT dispatch any agents — only update state
