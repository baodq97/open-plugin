---
description: Initialize a new V-Bounce SDLC feature cycle from a PRD
allowed-tools: [Read, Write, Bash, Agent]
---

Initialize a new V-Bounce feature cycle.

## Instructions

1. Generate cycle ID: `CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. Create workspace: `mkdir -p .vbounce/cycles/{cycle_id}/{requirements,design,implementation,review,testing,deployment,knowledge,quality-gates}`
3. If user provided a PRD path argument, copy it to `.vbounce/cycles/{cycle_id}/prd.md`. Otherwise, ask user to describe the feature and write it as the PRD.
4. Initialize `.vbounce/cycles/{cycle_id}/state.yaml` with all phases set to `not_started`, `current_phase: requirements`, `anatomy_step: input`
5. Set active cycle: write `.vbounce/state.yaml` with `active_cycle: {cycle_id}` and `workspace: .vbounce/cycles/{cycle_id}`
6. Begin Requirements phase — validate input contract, dispatch requirements-analyst agent with resolved workspace path
