---
description: Start a V-Bounce change request cycle (mid-cycle scope change)
allowed-tools: [Read, Write, Bash, Agent]
---

Start a V-Bounce change request. User must provide a description of the scope change.

## Instructions

1. Read `${CLAUDE_PLUGIN_ROOT}/skills/vbounce/references/workflows-change-request-track.md` for the full CR workflow
2. Read `.vbounce/state.yaml` to find and note the active feature cycle (it will be paused)
3. Generate CR cycle ID: `CR-{PROJECT}-{YYYYMMDD}-{SEQ}`
4. Create workspace: `mkdir -p .vbounce/cycles/{cycle_id}/{assess,plan,execute,reconcile,knowledge,quality-gates}`
5. Initialize `{workspace}/state.yaml` for CR track with phases: assess, plan, execute, reconcile
6. Record the paused feature cycle ID in the CR state for later reconciliation
7. Set active cycle to the CR cycle in `.vbounce/state.yaml`
8. Begin Assess phase
