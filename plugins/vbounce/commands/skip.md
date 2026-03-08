---
description: Skip forward to a specific V-Bounce phase
allowed-tools: [Read, Write]
---

Skip to a target phase in the current V-Bounce cycle. User must provide the target phase name.

## Instructions

1. Read `.vbounce/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current phase
3. Valid target phases: design, contracts, testing, implementation, execution, review, deployment
4. Validate: target phase must be AFTER current phase in the sequence
5. Validate prerequisites: check that all required input files for the target phase's agent exist (refer to the agent dispatch table in the orchestrator skill)
6. If prerequisites are missing, report which files are needed and DO NOT skip
7. If valid, update state: `current_phase: {target}`, `anatomy_step: input`
8. Report: "Skipped from {current} to {target}. Ready for {target} phase."
9. Do NOT dispatch any agents — only update state
