---
description: Initialize a new Solution Architecture session and begin the SA workflow
argument-hint: "[description of system/feature to architect]"
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Initialize a new SA Playbook session.

## Instructions

Follow the **Session Management** procedure from the sa-playbook orchestrator skill (SKILL.md):

1. Generate session ID: `SA-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. Create workspace: `mkdir -p .sa-playbook/sessions/{session_id}/{discover,define,design,design/adrs,decide,decide/adrs,deliver}`
3. Initialize `{workspace}/state.yaml`:

```yaml
session_id: {session_id}
workspace: .sa-playbook/sessions/{session_id}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  design: { status: not_started, artifacts: [] }
  decide: { status: not_started, artifacts: [] }
  deliver: { status: not_started, artifacts: [] }
coaching_log: []
```

4. If the user provided a description as argument:
   - Log it to `{workspace}/discover/context-doc.md` as initial context
   - Begin the Discover phase with guided questions from `references/sa-phases.md`
5. If no argument provided, ask: "What system or feature are you designing? Who is it for? Any known constraints?"
6. If the user already has requirements/context, offer to skip to an appropriate phase

Present the first coaching message introducing the Discover phase and the SFIA skills that will be practiced.
