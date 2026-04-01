---
description: Show current SA session status, phase progress, and SFIA skills practiced
allowed-tools: [Read, Glob]
---

Display the current SA Playbook session status.

## Instructions

1. Read `.sa-playbook/sessions/` to find the active session (most recent or specified)
2. Read `{workspace}/state.yaml` to get current state
3. Scan workspace directories for existing artifacts

Display a status report:

```
## SA Session: {session_id}

**Current Phase:** {phase} ({status})

### Phase Progress
| Phase | Status | Artifacts |
|-------|--------|-----------|
| Discover | {status} | {list of files created} |
| Define | {status} | {list of files created} |
| Design | {status} | {list of files created} |
| Decide | {status} | {list of files created} |
| Deliver | {status} | {list of files created} |

### SFIA Skills Practiced
{List skills from coaching_log with estimated levels}

### Recommended Next Steps
{Based on current phase and artifacts, suggest what to do next}
```
