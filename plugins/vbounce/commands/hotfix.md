---
description: Start a V-Bounce hotfix cycle (P0/P1 emergency)
allowed-tools: [Read, Write, Bash, Agent]
---

Start a V-Bounce hotfix cycle for P0/P1 incidents. User must provide a ticket ID.

## Instructions

1. Read `${CLAUDE_PLUGIN_ROOT}/skills/vbounce/references/workflows-hotfix-track.md` for the full hotfix workflow
2. Generate cycle ID: `HF-{PROJECT}-{YYYYMMDD}-{SEQ}`
3. Create workspace: `mkdir -p .vbounce/cycles/{cycle_id}/{triage-fast,rapid-fix,express-review,emergency-deploy,post-hotfix,knowledge,quality-gates}`
4. Initialize `{workspace}/state.yaml` for hotfix track with phases: triage-fast, rapid-fix, express-review, emergency-deploy, post-hotfix
5. Set active cycle in `.vbounce/state.yaml`
6. Begin Triage (Fast) phase immediately — hotfixes have strict SLA (P0: 4h, P1: 8h)
