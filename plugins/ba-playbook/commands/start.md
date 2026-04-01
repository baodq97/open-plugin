---
description: Initialize a new Business Analysis session and begin the BA workflow
argument-hint: "[description of business problem or initiative to analyze]"
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Initialize a new BA Playbook session.

## Instructions

Follow the **Session Management** procedure from the ba-playbook orchestrator skill (SKILL.md):

1. Generate session ID: `BA-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. Create workspace: `mkdir -p .ba-playbook/sessions/{session_id}/{discover,define,analyze,design,deliver-validate}`
3. Initialize `{workspace}/state.yaml`:

```yaml
session_id: {session_id}
workspace: .ba-playbook/sessions/{session_id}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  analyze: { status: not_started, artifacts: [] }
  design: { status: not_started, artifacts: [] }
  deliver_validate: { status: not_started, artifacts: [] }
coaching_log: []
```

4. If the user provided a description as argument:
   - Log it to `{workspace}/discover/problem-statement.md` as initial context
   - Begin the Discover phase with guided questions from `references/ba-phases.md`
5. If no argument provided, ask: "What business problem or initiative are you analyzing? Who are the key stakeholders? Any known constraints?"
6. If the user already has requirements/analysis, offer to skip to an appropriate phase

Present the first coaching message introducing the Discover phase and the SFIA skills that will be practiced.
