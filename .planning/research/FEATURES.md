# Feature Landscape: Claude Code Plugin Hooks Alignment

**Domain:** Claude Code plugin hooks for skills ontology management
**Researched:** 2026-03-06
**Source:** Official Claude Code hooks reference at https://code.claude.com/docs/en/hooks

## Table Stakes

Features users expect. Missing = plugin does not comply with the official hooks specification.

### TS-1: Stdin JSON Input for All Hooks

| Attribute | Detail |
|-----------|--------|
| Hook Event | All (PostToolUse, SessionStart, PreToolUse, Stop) |
| Why Expected | Official spec delivers JSON via stdin with `session_id`, `cwd`, `tool_name`, `tool_input`, `tool_response`, `hook_event_name`, `permission_mode`, `transcript_path`. Current hooks read `CLAUDE_FILE_PATH` and `CLAUDE_TOOL_INPUT` env vars, which are undocumented legacy behavior. |
| Complexity | Medium |
| Notes | Use `fs.readFileSync('/dev/stdin', 'utf-8')` or `process.stdin` to read. Must handle empty stdin gracefully. The session_id field also fixes the tracker collision bug (TS-6). |

### TS-2: Structured JSON Output via Stdout

| Attribute | Detail |
|-----------|--------|
| Hook Event | All |
| Why Expected | Official spec: exit 0 + JSON stdout is parsed for `hookSpecificOutput`, `additionalContext`, `decision`, `reason`, `systemMessage`, `continue`, `suppressOutput`. Current hooks use `console.log()` with plain text prefixes (`ONTOLOGY-DRIFT:`, `ONTOLOGY-TRACK:`), which only appears in verbose mode for PostToolUse. Structured JSON with `additionalContext` is injected into Claude's actual context. |
| Complexity | Medium |
| Notes | For PostToolUse, `additionalContext` makes drift information visible to Claude without verbose mode. For SessionStart, both plain stdout and `additionalContext` are added as context. Key distinction: plain stdout is shown as hook output in the transcript; `additionalContext` is added more discretely. |

### TS-3: Plugin Script Path Portability (`${CLAUDE_PLUGIN_ROOT}`)

| Attribute | Detail |
|-----------|--------|
| Hook Event | Configuration (hooks.json) |
| Why Expected | Official spec: plugin hooks use `${CLAUDE_PLUGIN_ROOT}` for script paths. Current `node hooks/ontology_sync.js` breaks if cwd differs from plugin root. The variable resolves to the plugin's root directory at runtime. |
| Complexity | Low |
| Notes | Change `"command": "node hooks/ontology_sync.js"` to `"command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js"`. All hook script paths must use this pattern. |

### TS-4: Top-Level `description` Field in hooks.json

| Attribute | Detail |
|-----------|--------|
| Hook Event | Configuration (hooks.json) |
| Why Expected | Official spec shows plugin hooks.json supports an optional top-level `description` field. Current hooks.json lacks this. While optional per spec, it is expected for any published plugin. |
| Complexity | Low |
| Notes | Add `"description": "Skills ontology drift detection and usage tracking"` at the top level of hooks.json. |

### TS-5: Timeout Configuration for Hooks

| Attribute | Detail |
|-----------|--------|
| Hook Event | All |
| Why Expected | Official spec: command hooks default to 600s timeout. Plugin hooks should specify appropriate timeouts. Filesystem scanning in ontology_sync.js should complete in seconds, not minutes. Explicit timeouts signal to Claude Code and to users that the hook is well-behaved. |
| Complexity | Low |
| Notes | Recommended: 10s for SessionStart hooks, 15s for PostToolUse hooks (filesystem scanning), 5s for PreToolUse and Stop hooks. |

### TS-6: Session ID-Based Tracker File Isolation

| Attribute | Detail |
|-----------|--------|
| Hook Event | PostToolUse (Skill tracking) |
| Why Expected | Current tracker uses shared file `claude-ontology-session.yaml` in os.tmpdir(). Concurrent Claude Code sessions collide on this file. Stdin JSON provides `session_id` field. Using `claude-ontology-session-{session_id}.yaml` isolates sessions. |
| Complexity | Low |
| Notes | Direct consequence of adopting stdin input (TS-1). The session_id is always present in the common input fields. |

### TS-7: Exit Code Compliance

| Attribute | Detail |
|-----------|--------|
| Hook Event | All |
| Why Expected | Official spec: exit 0 = success (stdout parsed for JSON), exit 2 = blocking error (stderr fed to Claude), other = non-blocking error. Current hooks always exit 0 with console.log output. Hooks must use correct exit codes to communicate intent. |
| Complexity | Low |
| Notes | PostToolUse hooks cannot block (tool already ran), so exit 0 is correct. But hooks should still exit cleanly and handle errors (e.g., missing registry) by exiting with non-zero non-2 code to signal non-blocking failure. |

## Differentiators

Features that set the plugin apart. Not expected for spec compliance, but significantly increase value.

### DF-1: SessionStart Context Injection

| Attribute | Detail |
|-----------|--------|
| Hook Event | SessionStart |
| Why Expected Value | At session start, inject ontology context so Claude knows which skills exist, their domains, phases, and routing priorities. This eliminates the cold-start problem where Claude has no awareness of available skills until one is invoked. |
| Complexity | Medium |
| Notes | Read registry.yaml and graph.yaml, build a compact summary (skill names, domains, top prerequisite chains), and return it via `hookSpecificOutput.additionalContext`. Must stay fast (10s timeout). SessionStart only supports `type: "command"` hooks. Matcher can be `startup` to run only on new sessions, or omitted to also run on `resume`/`clear`/`compact`. |

**Output format:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "ONTOLOGY: 12 skills available across 4 domains..."
  }
}
```

### DF-2: PreToolUse Skill Routing / Prerequisite Injection

| Attribute | Detail |
|-----------|--------|
| Hook Event | PreToolUse (matcher: Skill or relevant tool name) |
| Why Expected Value | Before a skill is invoked, inject prerequisite and routing information via `additionalContext`. This tells Claude "before using skill X, consider loading prerequisite Y first" or "skill X is part of chain Z, here are the next steps." This is the key intelligence layer. |
| Complexity | Medium-High |
| Notes | PreToolUse receives `tool_name` and `tool_input` on stdin. The hook can return `permissionDecision: "allow"` with `additionalContext` containing prerequisite info. Must determine the right matcher -- if skills appear as a specific tool name, match on that. The `additionalContext` field is added to Claude's context before the tool executes. Can also use `updatedInput` to modify tool parameters. |

**Output format:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "additionalContext": "ONTOLOGY-ROUTE: Skill 'deploy-service' has prerequisites: [build-artifacts, run-tests]. Chain: deployment-pipeline (step 3/5)."
  }
}
```

**Important caveat:** The official spec matcher for PreToolUse matches on `tool_name`. The plugin currently assumes a tool called "Skill" exists. The actual tool name depends on how Claude Code loads skills -- this needs verification during implementation. If skills are loaded via Read or Bash, the matcher would need to be different or broader.

### DF-3: PostToolUse Drift Detection with Structured Context

| Attribute | Detail |
|-----------|--------|
| Hook Event | PostToolUse (matcher: `Write|Edit`) |
| Why Expected Value | Existing ontology_sync.js already detects drift, but its console.log output only shows in verbose mode. By returning structured JSON with `additionalContext`, drift information reaches Claude's actual context, making it actionable without requiring verbose mode. |
| Complexity | Low (refactor of existing logic) |
| Notes | Convert existing console.log messages to a structured JSON response. Use `additionalContext` for drift information that Claude should act on. PostToolUse also has `decision: "block"` capability, but since the tool already ran, this only prompts Claude with the reason -- useful for "you should rebuild the registry" nudges. |

**Output format:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "ONTOLOGY-DRIFT: New skill 'api-gateway' not in registry. Run /ontology-build to update."
  }
}
```

### DF-4: PostToolUse Skill Usage Tracking with Session Isolation

| Attribute | Detail |
|-----------|--------|
| Hook Event | PostToolUse (matcher: tool name for skill invocations) |
| Why Expected Value | Existing ontology_track_skill.js tracks usage but has a session collision bug and uses legacy env vars. Upgrading to stdin JSON with session_id fixes isolation and enables richer tracking (access to tool_response for outcome tracking). |
| Complexity | Low-Medium (refactor of existing logic) |
| Notes | With PostToolUse input, the hook receives `tool_response` in addition to `tool_input`. This enables tracking whether skill invocation succeeded or failed, which feeds into the adjust-strengths pipeline. Return tracking status via `additionalContext`. |

### DF-5: Stop Hook for Usage Log Reminder

| Attribute | Detail |
|-----------|--------|
| Hook Event | Stop |
| Why Expected Value | When Claude finishes responding, check if skills were used during the session and remind to log outcomes. The Stop hook can return `decision: "block"` with a `reason` to prevent Claude from stopping and prompt it to log usage. |
| Complexity | Medium |
| Notes | Stop receives `session_id`, `stop_hook_active`, and `last_assistant_message` on stdin. The hook should: (1) check if a session tracker file exists for this session_id, (2) if skills were used but no usage-log entry was written, return a block decision asking Claude to log. Must check `stop_hook_active` to avoid infinite loops -- if already continuing due to a stop hook, allow stopping. Stop hooks do not support matchers (always fire). |

**Output format (when skills used but not logged):**
```json
{
  "decision": "block",
  "reason": "Session used 3 skills [api-design, error-handling, testing-strategy] but no usage-log entry was written. Please append an entry to .claude/ontology/usage-log.yaml with: date, skills_used, outcome, and notes."
}
```

**Output format (when already handled or no skills used):**
```
exit 0 (no output, allows stop)
```

### DF-6: Async PostToolUse for Non-Blocking Drift Detection

| Attribute | Detail |
|-----------|--------|
| Hook Event | PostToolUse (Write|Edit) |
| Why Expected Value | Drift detection involves filesystem scanning which may be slow for large ontologies. The `async: true` flag allows the hook to run in the background without blocking Claude's workflow. When it finishes, its `systemMessage` or `additionalContext` is delivered on the next conversation turn. |
| Complexity | Low |
| Notes | Configuration-only change: add `"async": true` to the drift detection hook handler. The script itself does not need to change. Tradeoff: async hooks cannot block or control behavior -- the `decision` field is ignored. For drift detection this is acceptable since the tool already ran. For cases where immediate feedback is critical, keep synchronous. |

### DF-7: StatusMessage for User Feedback

| Attribute | Detail |
|-----------|--------|
| Hook Event | All |
| Why Expected Value | The `statusMessage` field in hook handler configuration shows a custom spinner message while the hook runs. This provides immediate user feedback like "Checking ontology..." instead of a generic spinner. |
| Complexity | Low |
| Notes | Configuration-only: add `"statusMessage": "Checking ontology for drift..."` to the drift detection hook, `"statusMessage": "Loading skill context..."` to SessionStart, etc. |

### DF-8: PreCompact Hook for Ontology Context Preservation

| Attribute | Detail |
|-----------|--------|
| Hook Event | PreCompact |
| Why Expected Value | Before context compaction, inject critical ontology information that should survive the compact. This prevents Claude from losing awareness of the skill graph after auto-compaction. PreCompact receives `trigger` (manual/auto) and `custom_instructions`. |
| Complexity | Low-Medium |
| Notes | Only supports `type: "command"` hooks. Output via stdout is added as context that survives compaction. Return a compact summary of current ontology state and any in-progress skill tracking. Matcher can filter on `manual` vs `auto`. |

### DF-9: SessionEnd Hook for Usage Log Finalization

| Attribute | Detail |
|-----------|--------|
| Hook Event | SessionEnd |
| Why Expected Value | When the session ends, finalize any pending usage tracking. Clean up the session tracker temp file. Unlike Stop (which can block), SessionEnd cannot prevent termination but ensures cleanup happens. SessionEnd receives `reason` (clear, logout, prompt_input_exit, etc.). |
| Complexity | Low |
| Notes | Only supports `type: "command"` hooks. Cannot block session end. Use for: (1) clean up session tracker file, (2) if skills were tracked but not logged, write a partial usage-log entry with outcome "incomplete". Complements DF-5 (Stop hook) as a safety net. |

## Anti-Features

Features to deliberately NOT build.

### AF-1: HTTP Hooks

| Anti-Feature | HTTP hook handlers (type: "http") |
|--------------|-----------------------------------|
| Why Avoid | This is a local plugin with no server infrastructure. HTTP hooks add network dependency, authentication complexity, and failure modes. The plugin's zero-dependency constraint makes HTTP hooks a poor fit. |
| What to Do Instead | Use `type: "command"` hooks exclusively. All plugin logic runs as local Node.js scripts. |

### AF-2: Prompt-Based or Agent-Based Hooks

| Anti-Feature | LLM-driven hook evaluation (type: "prompt" or "agent") |
|--------------|---------------------------------------------------------|
| Why Avoid | Prompt hooks call an LLM for each hook invocation, adding latency and API cost. Agent hooks spawn subagents with tool access, even more expensive. The ontology plugin's logic is deterministic (filesystem scanning, YAML parsing) -- it does not need LLM reasoning to make decisions. |
| What to Do Instead | Use `type: "command"` hooks with Node.js scripts that make deterministic decisions. Skill routing and drift detection are algorithmic, not judgment calls. |

### AF-3: PreToolUse Blocking (Deny) Decisions

| Anti-Feature | Using `permissionDecision: "deny"` to block skill invocations |
|--------------|--------------------------------------------------------------|
| Why Avoid | Blocking tool use creates a hostile plugin experience. Users expect plugins to enhance, not gatekeep. The ontology plugin should inform and route, not prevent. If prerequisites are missing, inform Claude via `additionalContext` rather than denying the tool call. |
| What to Do Instead | Use `permissionDecision: "allow"` with `additionalContext` for routing information. Let Claude and the user decide whether to follow the recommendation. |

### AF-4: WorktreeCreate / WorktreeRemove Hooks

| Anti-Feature | Worktree lifecycle hooks |
|--------------|--------------------------|
| Why Avoid | The ontology plugin manages skill metadata, not version control isolation. Worktree hooks are for custom VCS setups (SVN, Perforce). There is no ontology-specific action needed when worktrees are created or removed. |
| What to Do Instead | Do nothing. The ontology is project-scoped and works the same in any worktree. |

### AF-5: ConfigChange Hook for Settings Monitoring

| Anti-Feature | Monitoring settings changes |
|--------------|-----------------------------|
| Why Avoid | The ontology plugin does not manage Claude Code settings. ConfigChange hooks are for security auditing and policy enforcement -- concerns outside this plugin's scope. Adding config monitoring would expand the plugin's responsibility beyond skill management. |
| What to Do Instead | Focus on ontology file changes via PostToolUse on Write|Edit, which already covers skill file modifications. |

### AF-6: Aggressive Stop Blocking

| Anti-Feature | Always blocking Claude from stopping when skills were used |
|--------------|-------------------------------------------------------------|
| Why Avoid | Blocking Stop can create infinite loops if not carefully guarded with `stop_hook_active`. Users find it frustrating when Claude cannot stop. Usage logging is useful but not worth trapping users. |
| What to Do Instead | Block once at most: check `stop_hook_active`, and if true, allow stop. The reminder is a nudge, not a mandate. Consider making the Stop hook advisory-only (return `additionalContext` instead of `decision: "block"`) if usage logging is not critical. |

### AF-7: Notification Hooks

| Anti-Feature | Custom notification handling |
|--------------|------------------------------|
| Why Avoid | Notification hooks fire on permission_prompt, idle_prompt, auth_success, elicitation_dialog. None of these are related to skill ontology management. Adding notification hooks would be scope creep. |
| What to Do Instead | Do nothing. The plugin has no need to react to Claude Code notifications. |

### AF-8: UserPromptSubmit Hook for Skill Routing

| Anti-Feature | Intercepting user prompts to auto-route to skills |
|--------------|---------------------------------------------------|
| Why Avoid | UserPromptSubmit can block/reject prompts and inject context. While tempting for "auto-detect which skill the user wants," this makes the plugin intrusive. Every single user prompt would pass through the hook. The rules layer (skill-routing.md) already handles routing recommendations without intercepting prompts. |
| What to Do Instead | Rely on rules (skill-routing.md) for routing logic and SessionStart (DF-1) for initial context injection. |

### AF-9: InstructionsLoaded Hooks

| Anti-Feature | Tracking when CLAUDE.md/rules files are loaded |
|--------------|------------------------------------------------|
| Why Avoid | InstructionsLoaded is for observability/audit. The plugin's rules are loaded automatically by Claude Code. Tracking when they load adds no value to skill ontology management. |
| What to Do Instead | Do nothing. Trust Claude Code to load rules from the rules/ directory. |

## Feature Dependencies

```
TS-1 (Stdin JSON Input) --> TS-6 (Session ID Isolation)
TS-1 (Stdin JSON Input) --> DF-1 (SessionStart Context)
TS-1 (Stdin JSON Input) --> DF-2 (PreToolUse Routing)
TS-1 (Stdin JSON Input) --> DF-3 (Structured Drift Output)
TS-1 (Stdin JSON Input) --> DF-4 (Usage Tracking Refactor)
TS-1 (Stdin JSON Input) --> DF-5 (Stop Hook)
TS-1 (Stdin JSON Input) --> DF-9 (SessionEnd Cleanup)

TS-2 (JSON Output) --> DF-1 (SessionStart Context)
TS-2 (JSON Output) --> DF-2 (PreToolUse Routing)
TS-2 (JSON Output) --> DF-3 (Structured Drift Output)
TS-2 (JSON Output) --> DF-5 (Stop Hook)

TS-3 (CLAUDE_PLUGIN_ROOT) --> all hook entries in hooks.json

DF-1 (SessionStart) --> DF-2 (PreToolUse Routing) [ontology context must exist first]
DF-4 (Usage Tracking) --> DF-5 (Stop Hook) [tracker file must exist to check]
DF-4 (Usage Tracking) --> DF-9 (SessionEnd Cleanup) [tracker file must exist to clean up]
DF-5 (Stop Hook) --> DF-9 (SessionEnd Cleanup) [safety net if Stop hook was skipped]
```

## MVP Recommendation

Prioritize (Phase 1 -- Spec Compliance):
1. **TS-1**: Stdin JSON input -- foundational, everything depends on it
2. **TS-2**: Structured JSON output -- the other half of the contract
3. **TS-3**: CLAUDE_PLUGIN_ROOT paths -- prevents breakage
4. **TS-4**: Description field in hooks.json -- trivial, do alongside TS-3
5. **TS-5**: Timeout configuration -- trivial, do alongside TS-3
6. **TS-6**: Session ID isolation -- falls out naturally from TS-1
7. **TS-7**: Exit code compliance -- audit existing hooks

Prioritize (Phase 2 -- Existing Hook Upgrades):
1. **DF-3**: PostToolUse drift detection with structured context (refactor existing)
2. **DF-4**: PostToolUse usage tracking with session isolation (refactor existing)
3. **DF-7**: StatusMessage configuration (trivial, config-only)

Prioritize (Phase 3 -- New Hook Events):
1. **DF-1**: SessionStart context injection (highest value new hook)
2. **DF-5**: Stop hook for usage log reminder
3. **DF-2**: PreToolUse skill routing (highest complexity, highest intelligence value)

Defer:
- **DF-6** (Async drift detection): Optimization, not needed until performance is a problem
- **DF-8** (PreCompact): Nice-to-have for long sessions, not critical
- **DF-9** (SessionEnd cleanup): Safety net, lower priority than Stop hook

## Hook Event Coverage Matrix

| Hook Event | Current | After Alignment | Purpose |
|------------|---------|-----------------|---------|
| SessionStart | None | DF-1 | Inject ontology context at session start |
| PreToolUse | None | DF-2 | Skill routing / prerequisite injection |
| PostToolUse (Write\|Edit) | ontology_sync.js (env vars) | DF-3 (stdin/JSON) | Drift detection |
| PostToolUse (Skill) | ontology_track_skill.js (env vars) | DF-4 (stdin/JSON) | Usage tracking |
| Stop | None | DF-5 | Usage log reminder |
| PreCompact | None | DF-8 (deferred) | Context preservation |
| SessionEnd | None | DF-9 (deferred) | Tracker cleanup |
| UserPromptSubmit | None | Anti-feature | -- |
| Notification | None | Anti-feature | -- |
| WorktreeCreate/Remove | None | Anti-feature | -- |
| ConfigChange | None | Anti-feature | -- |
| InstructionsLoaded | None | Anti-feature | -- |
| PostToolUseFailure | None | Not planned | Could track failed skill invocations (future) |
| SubagentStart/Stop | None | Not planned | Not relevant to ontology |
| TeammateIdle | None | Not planned | Not relevant to ontology |
| TaskCompleted | None | Not planned | Not relevant to ontology |
| PermissionRequest | None | Not planned | Not relevant to ontology |

## Hooks.json Target Configuration

For reference, the target hooks.json after full alignment:

```json
{
  "description": "Skills ontology drift detection, usage tracking, and context injection",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_session_start.js",
            "timeout": 10,
            "statusMessage": "Loading skill ontology context..."
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "<skill-tool-name>",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_route_skill.js",
            "timeout": 5,
            "statusMessage": "Checking skill prerequisites..."
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js",
            "timeout": 15,
            "statusMessage": "Checking ontology for drift..."
          }
        ]
      },
      {
        "matcher": "<skill-tool-name>",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_track_skill.js",
            "timeout": 10,
            "statusMessage": "Tracking skill usage..."
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_stop.js",
            "timeout": 5,
            "statusMessage": "Checking skill usage log..."
          }
        ]
      }
    ]
  }
}
```

**Note:** `<skill-tool-name>` is a placeholder. The actual tool name that appears when skills are invoked needs to be verified during implementation. If Claude Code uses a specific tool name for skill loading (e.g., "Skill", "Read", or an MCP tool name), the matcher must match that name.

## Sources

- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) -- Official documentation, PRIMARY source (HIGH confidence)
- [Claude Code Plugin Hook Development Skill](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/hook-development/SKILL.md) -- Official examples (HIGH confidence)
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide) -- Official quickstart (HIGH confidence)

## Confidence Assessment

| Feature Category | Confidence | Rationale |
|-----------------|------------|-----------|
| Table Stakes (TS-1 through TS-7) | HIGH | Directly from official hooks reference documentation. Input/output schemas, exit codes, and configuration fields are fully specified. |
| SessionStart (DF-1) | HIGH | Official spec clearly documents additionalContext field and SessionStart-only capabilities like CLAUDE_ENV_FILE. |
| PostToolUse refactors (DF-3, DF-4) | HIGH | Existing hooks need known changes (stdin input, JSON output). Official spec clearly documents PostToolUse schema. |
| Stop Hook (DF-5) | HIGH | Official spec documents decision control, stop_hook_active field, and blocking behavior. |
| PreToolUse Routing (DF-2) | MEDIUM | The hooks specification is clear, but the actual tool name matcher for skill invocations is uncertain. Depends on how Claude Code presents skill tools -- could be "Skill", a Read-based pattern, or an MCP tool name. Needs verification during implementation. |
| Async/PreCompact/SessionEnd (DF-6, DF-8, DF-9) | MEDIUM | Official spec supports these, but the value proposition for this specific plugin is less clear. Deferred appropriately. |
| Anti-features | HIGH | Clear scope boundaries based on plugin purpose and spec capabilities. |
