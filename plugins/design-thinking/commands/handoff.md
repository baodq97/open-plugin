---
description: Copy PRD to project root and suggest starting vbounce
allowed-tools: [Read, Write, Bash]
---

Hand off the completed PRD to the vbounce workflow.

## Instructions

1. Read `.design-thinking/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current state
3. Validate: PRD phase must be `approved`
   - If not approved, report: "PRD must be approved before handoff. Current status: {status}. Run `/design-thinking:export` first."
4. Copy `{workspace}/prd.md` to the project root as `prd.md` (or a user-specified path if provided as argument)
5. Report:
   ```
   PRD copied to ./prd.md

   To start the vbounce SDLC cycle with this PRD:
     /vbounce:start prd.md

   Design Thinking session: {session_id}
   Artifacts preserved at: {workspace}/
   ```
6. Add history entry: "PRD handed off to project root"
