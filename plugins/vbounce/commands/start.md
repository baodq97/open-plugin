---
description: Initialize a new V-Bounce SDLC feature cycle from a PRD
allowed-tools: [Read, Write, Bash, Agent]
---

Initialize a new V-Bounce feature cycle.

## Instructions

Follow the **Cycle Initialization** procedure from the vbounce orchestrator skill (SKILL.md):

1. Generate cycle ID, create workspace (including `contracts/` directory)
2. If user provided a PRD path argument, copy it to the workspace. Otherwise, ask user to describe the feature and write it as the PRD.
3. Run tech stack detection + framework context loading
4. Initialize state.yaml with v5.0 schema
5. Set active cycle
6. Begin Requirements phase
