---
description: Initialize a new Design Thinking session from a pain point or problem statement
allowed-tools: [Read, Write, Bash]
---

Initialize a new Design Thinking session.

## Instructions

Follow the **Session Initialization** procedure from the design-thinking orchestrator skill (SKILL.md):

1. Generate session ID: `DT-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. Create workspace: `mkdir -p .design-thinking/sessions/{session_id}/{empathize,define,ideate,prototype,quality-gates}`
3. Initialize `{workspace}/state.yaml` with all phases set to `not_started`, empathize set to `engaging`
4. Write `.design-thinking/state.yaml` with `active_session` and `workspace`
5. If user provided a pain point or problem description as argument, log it to `{workspace}/empathize/conversation-log.md`
6. Begin the Empathize phase — start Round 1 of the structured interview (Context & Users)

If no pain point/problem was provided, ask the user to describe their problem or pain point before proceeding.
