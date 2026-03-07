---
description: Start a V-Bounce bugfix cycle (P2/P3)
allowed-tools: [Read, Write, Bash, Agent]
---

Start a V-Bounce bugfix cycle for P2/P3 bugs. User must provide a ticket ID.

## Instructions

1. Read `${CLAUDE_PLUGIN_ROOT}/skills/vbounce/references/workflows-bugfix-track.md` for the full bugfix workflow
2. Generate cycle ID: `BF-{PROJECT}-{YYYYMMDD}-{SEQ}`
3. Create workspace: `mkdir -p .vbounce/cycles/{cycle_id}/{triage,fix-plan,fix,review,verify,deploy,knowledge,quality-gates}`
4. Initialize `{workspace}/state.yaml` for bugfix track with phases: triage, fix-plan, fix, review, verify, deploy
5. Set active cycle in `.vbounce/state.yaml`
6. Begin Triage phase
