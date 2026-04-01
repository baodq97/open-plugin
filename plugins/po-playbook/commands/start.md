---
description: Initialize a new Product Owner session and begin the PO workflow
argument-hint: "[description of product/feature to manage]"
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Initialize a new PO Playbook session.

## Instructions

Follow the **Session Management** procedure from the po-playbook orchestrator skill (SKILL.md):

1. Generate session ID: `PO-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)
2. Create workspace: `mkdir -p .po-playbook/sessions/{session_id}/{discover,define,prioritize,plan,deliver-learn}`
3. Initialize `{workspace}/state.yaml`:

```yaml
session_id: {session_id}
workspace: .po-playbook/sessions/{session_id}
current_phase: discover
phases:
  discover: { status: in_progress, artifacts: [] }
  define: { status: not_started, artifacts: [] }
  prioritize: { status: not_started, artifacts: [] }
  plan: { status: not_started, artifacts: [] }
  deliver_learn: { status: not_started, artifacts: [] }
coaching_log: []
```

4. If the user provided a description as argument:
   - Log it to `{workspace}/discover/problem-statement.md` as initial context
   - Begin the Discover phase with guided questions from `references/po-phases.md`
5. If no argument provided, ask: "What product or feature are you working on? Who are your target users? Any known constraints?"
6. If the user already has a product vision/strategy, offer to skip to an appropriate phase

Present the first coaching message introducing the Discover phase and the SFIA skills that will be practiced.
