---
description: Show current playbook session status, phase progress, and SFIA skills practiced
allowed-tools: [Read, Glob]
---

Display the current Profile Playbook session status.

## Instructions

1. Read `.profile-playbook/sessions/` to find the active session (most recent or specified)
2. Read `{workspace}/state.yaml` to get `role`, `current_phase`, and phase statuses
3. Load the role's SKILL.md from `skills/{role}-playbook/SKILL.md` for phase names
4. Scan workspace directories for existing artifacts

Display a status report:

```
## Profile Playbook Session: {session_id}

**Role:** {role} | **Current Phase:** {phase} ({status})

### Phase Progress
| Phase | Status | Artifacts |
|-------|--------|-----------|
| {phase1} | {status} | {list of files created} |
| {phase2} | {status} | {list of files created} |
| {phase3} | {status} | {list of files created} |
| {phase4} | {status} | {list of files created} |
| {phase5} | {status} | {list of files created} |

### SFIA Skills Practiced
{List skills from coaching_log with estimated levels}

### Recommended Next Steps
{Based on current phase and artifacts, suggest what to do next}
```
