# Domain Pitfalls: Claude Code Hook Spec Alignment

**Domain:** Claude Code plugin hooks migration (env vars to stdin/stdout JSON)
**Researched:** 2026-03-06
**Confidence:** HIGH (official docs verified, known Node.js platform issues confirmed)

## Critical Pitfalls

Mistakes that cause hooks to silently fail, produce corrupt output, or break on specific platforms.

---

### Pitfall 1: stdout Pollution Breaks JSON Output Parsing

**What goes wrong:** Any non-JSON text written to stdout causes Claude Code to fail parsing the hook's structured output. The current hooks use `console.log()` freely for status messages (e.g., `ONTOLOGY-DRIFT: ...`, `ONTOLOGY-TRACK: ...`). When migrating to return structured JSON via stdout, these `console.log()` calls will corrupt the JSON stream. Claude Code attempts to parse the entire stdout as JSON; if it encounters `ONTOLOGY-DRIFT: New skill(s)...` followed by `{"hookSpecificOutput": ...}`, parsing fails silently.

**Why it happens:** The current code was designed for an env-var input model where `console.log()` was the only way to surface information (shown in verbose mode). The official spec uses stdout for structured JSON communication. Developers mixing diagnostic messages with JSON output is the single most common hook failure mode, confirmed by multiple bug reports ([Issue #10875](https://github.com/anthropics/claude-code/issues/10875), [Issue #3983](https://github.com/anthropics/claude-code/issues/3983)).

**Consequences:**
- Hook executes but Claude Code ignores all output (additionalContext, decision fields)
- No error message shown to user -- hook appears to work but has no effect
- Debugging is difficult because the hook "runs successfully" (exit code 0)

**Prevention:**
1. Route ALL diagnostic/status messages through `console.error()` (stderr), not `console.log()` (stdout)
2. Reserve `console.log()` exclusively for the final JSON output object
3. Create a helper function: `function emit(json) { console.log(JSON.stringify(json)); }` and use it as the single stdout write point
4. If a hook has no structured output to return, write nothing to stdout and exit 0

**Detection:** Test hooks by piping sample JSON to stdin and capturing stdout. Verify stdout is either empty or valid JSON. Any line that does not parse as JSON is a bug.

**Affected files:** `hooks/ontology_sync.js` (lines 33, 53-54, 60-61, 83-86, 94-97), `hooks/ontology_track_skill.js` (lines 41-44)

**Phase:** Must be addressed in the first phase of migration. Every existing `console.log()` call needs to be audited and rerouted.

---

### Pitfall 2: fs.readFileSync('/dev/stdin') Fails on Windows

**What goes wrong:** The PROJECT.md records a pending decision to "Read stdin via `fs.readFileSync('/dev/stdin')`." This approach does not work on Windows. The path `/dev/stdin` is a Unix-only concept. On Windows, this call throws `ENOENT: no such file or directory`. The alternative `fs.readFileSync(0)` (using file descriptor 0) also fails on Windows when stdin is closed or empty, throwing `EISDIR: illegal operation on a directory` or `EBADF: bad file descriptor` ([Node.js Issue #19831](https://github.com/nodejs/node/issues/19831)).

**Why it happens:** Node.js has no reliable cross-platform synchronous API for reading stdin. The Unix `/dev/stdin` virtual file has no Windows equivalent. The `fs.readFileSync(0)` approach uses libuv's `fstat()` on fd 0, which returns errors on Windows when stdin is a pipe or is closed.

**Consequences:**
- Hooks crash immediately on Windows with an unhandled exception
- The plugin explicitly lists cross-platform (macOS, Linux, Windows) as a constraint
- No graceful degradation -- the entire hook fails, not just the stdin reading

**Prevention:** Use the async `process.stdin` stream API, which works identically across all platforms:

```javascript
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}
```

This requires the hook's `main()` function to be async, which is fine -- Claude Code waits for the process to exit regardless. The script structure becomes:

```javascript
async function main() {
  const raw = await readStdin();
  const input = JSON.parse(raw);
  // ... hook logic using input.tool_name, input.tool_input, etc.
}
main().catch((err) => { console.error(err.message); process.exit(1); });
```

**Detection:** Run tests on Windows (or WSL simulating pipe behavior). Test with `echo '{}' | node hooks/hook.js` and with no stdin input.

**Phase:** Must be resolved in the first phase. This is a blocking architectural decision that affects all hook scripts.

---

### Pitfall 3: Shell Profile Pollution Corrupts Hook JSON

**What goes wrong:** When Claude Code spawns a hook command, it runs it through the user's shell, which sources `~/.bashrc` or `~/.zshrc`. If those profiles contain unconditional `echo` or `printf` statements, that text is prepended to the hook's stdout, corrupting JSON parsing. Example of corrupted output:

```
Welcome to zsh!
{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "..."}}
```

**Why it happens:** Shell profiles often include welcome messages, environment setup output, or diagnostic information that is only intended for interactive use. Hooks run in non-interactive shells but still source these profiles on some systems.

**Consequences:** JSON parsing fails with no clear error. The official docs explicitly call this out as a known issue with a [dedicated troubleshooting section](https://code.claude.com/docs/en/hooks-guide#json-validation-failed).

**Prevention:** This is not something the plugin can control -- it is a user environment issue. However, the plugin can mitigate it:

1. Use `node` directly in hook commands (not bash wrappers), which avoids shell profile sourcing entirely. The current `node hooks/ontology_sync.js` pattern is already correct for this.
2. Document this as a known limitation in plugin documentation.
3. In JSON output, write it as the very last thing before `process.exit(0)` to minimize the window for corruption.

**Detection:** If users report hooks "not working," check verbose mode (`Ctrl+O`) for shell profile output mixed with JSON.

**Phase:** No code change needed (Node.js scripts bypass shell profile), but should be documented in any troubleshooting guide.

---

### Pitfall 4: Accessing Wrong Input Fields After Migration

**What goes wrong:** The current hooks read `process.env.CLAUDE_FILE_PATH` and `process.env.CLAUDE_TOOL_INPUT`. After migration, these values come from the stdin JSON as `tool_input.file_path` and `tool_input` respectively. The field names and structure are different:

| Current (env var) | New (stdin JSON) | Structural difference |
|---|---|---|
| `CLAUDE_FILE_PATH` (string) | `tool_input.file_path` (string inside nested object) | Nested inside `tool_input` |
| `CLAUDE_TOOL_INPUT` (JSON string) | `tool_input` (already-parsed object) | No longer needs JSON.parse |
| `CLAUDE_PROJECT_DIR` (string) | `cwd` (string) | Different field name |
| (not available) | `session_id` (string) | New field, needed for tracker fix |
| (not available) | `tool_name` (string) | New field, useful for filtering |
| (not available) | `tool_response` (object) | New field, PostToolUse only |

**Why it happens:** The env var names were a legacy/undocumented interface. The official stdin JSON spec uses a completely different naming convention and nesting structure. A direct find-and-replace is not sufficient.

**Consequences:**
- `undefined` values where data is expected, causing silent logic failures
- `ontology_sync.js` line 65: `process.env.CLAUDE_FILE_PATH` becomes `input.tool_input.file_path` for Write or `input.tool_input.file_path` for Edit -- but the field name in `tool_input` depends on the tool
- `ontology_track_skill.js` line 14: `process.env.CLAUDE_TOOL_INPUT` was a raw JSON string that needed regex matching. Now `input.tool_input` is already a parsed object, so regex extraction should be replaced with direct property access

**Prevention:**
1. Create a mapping document of old env var names to new stdin JSON paths
2. Write the stdin reader as a shared utility that all hooks import
3. For each hook, write tests that provide the exact JSON schema Claude Code sends (documented per event type in official docs)
4. Remove ALL `process.env.CLAUDE_*` references -- do not leave them as fallbacks, as this creates ambiguity about which input mechanism is active

**Detection:** After migration, grep for `process.env.CLAUDE_` in hook files. Any remaining references are bugs.

**Phase:** Core of the migration phase. Each hook must be individually updated and tested.

---

### Pitfall 5: Session Tracker Collision Not Fixed by Migration Alone

**What goes wrong:** The known bug in `ontology_track_skill.js` (line 29) uses a hardcoded temp file path `os.tmpdir() + '/claude-ontology-session.yaml'` shared across all concurrent sessions. The PROJECT.md correctly identifies that `session_id` from stdin JSON should be used for isolation. However, simply appending `session_id` to the filename is not sufficient -- the tracker file still grows without bound, old session files are never cleaned up, and there is no session start/end lifecycle to flush accumulated data to `usage-log.yaml`.

**Why it happens:** The original design had no access to session identity (env vars did not provide it). Adding `session_id` fixes the collision but does not address the lifecycle gap.

**Consequences:**
- Temp directory accumulates orphaned session tracker files indefinitely
- The `adjustStrengths` feature requires 10+ usage log entries but the tracker never flushes to `usage-log.yaml` automatically
- Without SessionStart/SessionEnd hooks, there is no natural point to initialize or finalize session tracking

**Prevention:**
1. Use `session_id` in the tracker filename: `claude-ontology-session-${sessionId}.yaml`
2. Add a `SessionEnd` hook that flushes the session tracker to `usage-log.yaml` and deletes the temp file
3. Alternatively, add a `SessionStart` hook that cleans up any stale tracker files (files older than 24 hours)
4. Consider whether a temp file is even needed -- if `PostToolUse` hooks can return `additionalContext`, the session skill list could be accumulated in Claude's context instead

**Detection:** Check temp directory for multiple `claude-ontology-session-*.yaml` files after running several sessions.

**Phase:** Should be addressed alongside the stdin migration since session_id availability is the enabler. Add SessionEnd hook in the "new hooks" phase.

---

## Moderate Pitfalls

### Pitfall 6: PostToolUse additionalContext vs console.log Visibility

**What goes wrong:** Developers assume that `console.log()` output from PostToolUse hooks is visible to Claude. It is not. Per the official spec: "For most events, stdout is only shown in verbose mode (Ctrl+O). The exceptions are UserPromptSubmit and SessionStart, where stdout is added as context that Claude can see and act on." To inject context visible to Claude from PostToolUse, you must return JSON with an `additionalContext` field.

**Why it happens:** The current hooks were designed around `console.log()` being the communication channel. The migration must switch to structured JSON output with `additionalContext` to achieve the same effect of Claude seeing the drift/tracking messages.

**Consequences:**
- After migration, all `ONTOLOGY-DRIFT` and `ONTOLOGY-TRACK` messages silently disappear from Claude's view
- The plugin appears to work (hooks run, no errors) but Claude never receives the ontology information
- Users see no benefit from the plugin's hooks

**Prevention:**
1. For PostToolUse hooks that need Claude to see information, return JSON:
   ```json
   {
     "hookSpecificOutput": {
       "hookEventName": "PostToolUse",
       "additionalContext": "ONTOLOGY-DRIFT: New skill 'foo' not in registry. Run /ontology-build."
     }
   }
   ```
2. For PostToolUse hooks that only need side effects (file writes, logging), exit 0 with no stdout
3. Test by triggering the hook and checking whether Claude's next response references the context

**Detection:** After migration, verify Claude references ontology information in responses. If Claude ignores drift warnings, the context is not being injected.

**Phase:** Must be addressed during the stdout migration. This is the entire purpose of the hooks -- if additionalContext is not used, the migration defeats the plugin's value.

---

### Pitfall 7: Missing hookEventName in JSON Output

**What goes wrong:** The `hookSpecificOutput` object requires a `hookEventName` field set to the exact event name string (e.g., `"PostToolUse"`, `"PreToolUse"`, `"SessionStart"`). Omitting this field or misspelling it causes Claude Code to ignore the entire `hookSpecificOutput` object silently.

**Why it happens:** The field is redundant (Claude Code already knows which event fired) but is required for validation. It is easy to forget or to use the wrong casing (e.g., `"postToolUse"` instead of `"PostToolUse"`).

**Consequences:** Hook output is silently discarded. No error message. Hook appears to run successfully.

**Prevention:**
1. Create a shared output builder function:
   ```javascript
   function buildOutput(eventName, fields) {
     return { hookSpecificOutput: { hookEventName: eventName, ...fields } };
   }
   ```
2. Use constants for event names: `const EVENTS = { POST_TOOL_USE: 'PostToolUse', ... }`
3. Add unit tests that validate the output JSON structure against the spec

**Detection:** JSON schema validation in tests. Check that every JSON output from hooks includes `hookSpecificOutput.hookEventName` matching the event.

**Phase:** Should be built into the shared hook utility module created in the first migration phase.

---

### Pitfall 8: Incomplete stdin JSON Parsing (Buffering)

**What goes wrong:** When reading stdin asynchronously via `process.stdin.on('data', ...)`, the JSON payload may arrive in multiple chunks. Attempting to `JSON.parse()` on the first chunk instead of waiting for the `'end'` event produces a `SyntaxError: Unexpected end of JSON input`.

**Why it happens:** Node.js streams deliver data in chunks based on the OS buffer size (typically 64KB on Linux, 8KB on macOS). For most hook invocations, the JSON fits in one chunk, so the bug manifests only with large inputs (e.g., tool_response containing a large file's content in PostToolUse events, or long tool_input.content in Write events).

**Consequences:**
- Hooks work in testing (small payloads) but fail in production with large files
- The error is a non-blocking error (exit code 1), so Claude continues but the hook's side effects never happen
- Intermittent failures that are hard to reproduce

**Prevention:**
1. Always accumulate all chunks before parsing:
   ```javascript
   let data = '';
   process.stdin.on('data', (chunk) => { data += chunk; });
   process.stdin.on('end', () => {
     const input = JSON.parse(data);
     // ... process
   });
   ```
2. Never parse inside the `'data'` event handler
3. Add error handling around `JSON.parse()` with a clear error message to stderr

**Detection:** Test with large JSON payloads (>64KB). Create a test fixture with a large `tool_response` field.

**Phase:** Must be addressed in the shared stdin reader utility (first migration phase).

---

### Pitfall 9: Script Path Resolution with ${CLAUDE_PLUGIN_ROOT}

**What goes wrong:** The current `hooks.json` uses bare paths like `node hooks/ontology_sync.js`. This works when the cwd happens to be the plugin root, but breaks when Claude Code runs the hook from a different working directory. The fix is to use `${CLAUDE_PLUGIN_ROOT}` -- but there are subtleties:

1. The variable uses `${}` syntax (curly braces required), not `$CLAUDE_PLUGIN_ROOT`
2. The variable is only available for plugin hooks (defined in `hooks/hooks.json`), not for project hooks
3. On Windows, the resolved path uses backslashes, which may cause issues if the command is passed through a Unix-like shell

**Why it happens:** The bare `node hooks/ontology_sync.js` path resolves relative to the process cwd, not the plugin installation directory. When Claude Code's cwd differs from the plugin root (which is normal), the hook cannot find its script.

**Consequences:** `Error: Cannot find module` crash, hook fails silently with a non-blocking error.

**Prevention:**
1. Use `node "${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js"` in hooks.json
2. Quote the path to handle spaces in directory names
3. Test with the plugin installed in a path containing spaces

**Detection:** Install the plugin in a project whose path differs from the plugin location. Verify hooks still fire.

**Phase:** First migration phase. This is a one-line fix per hook in hooks.json but must be done alongside other changes.

---

### Pitfall 10: hooks.json Missing description Field

**What goes wrong:** The official plugin hooks format supports a top-level `description` field in `hooks/hooks.json`. The current file omits this. While not strictly required, the `/hooks` menu in Claude Code displays this description to help users understand what the plugin's hooks do. Without it, hooks appear as unnamed entries.

**Why it happens:** The description field was added to the spec after the initial plugin hooks implementation.

**Consequences:** Poor user experience in the `/hooks` menu. Users cannot tell what the plugin's hooks do without reading the code.

**Prevention:** Add a descriptive top-level field:
```json
{
  "description": "Skills ontology: detects skill drift, tracks usage, and injects routing context",
  "hooks": { ... }
}
```

**Detection:** Check hooks.json for the presence of a top-level `description` field.

**Phase:** Quick fix, can be done in any phase.

---

## Minor Pitfalls

### Pitfall 11: Timeout Not Specified (Defaults to 600 seconds)

**What goes wrong:** Without an explicit `timeout` field, command hooks default to 600 seconds (10 minutes). The ontology hooks are lightweight file-reading operations that should complete in under 5 seconds. A 600-second timeout means if a hook hangs (e.g., stdin read blocks waiting for data that never arrives), Claude Code waits 10 minutes before timing out.

**Prevention:** Set explicit timeouts: `"timeout": 10` for sync and track hooks, `"timeout": 30` for any hook that runs the build-registry command.

**Phase:** Quick fix, address in hooks.json update phase.

---

### Pitfall 12: Async Flag Misunderstanding

**What goes wrong:** The `async: true` flag on command hooks means the hook runs in the background and cannot control Claude's behavior (no decision fields, no blocking). This is appropriate for the sync hook (advisory, non-blocking) but would be wrong for a PreToolUse hook that needs to provide routing information before a skill is invoked.

**Why it happens:** Developers assume "async" means "uses async/await" or "non-blocking I/O." In Claude Code, it means "fire-and-forget with delayed context delivery."

**Prevention:**
- Use `async: true` only for `ontology_sync.js` (drift detection is advisory)
- Keep `ontology_track_skill.js` synchronous to ensure tracking completes before the next tool call
- Never use `async: true` on PreToolUse hooks (decisions are ignored for async hooks)

**Phase:** Address when updating hooks.json configuration.

---

### Pitfall 13: Regex Injection in Registry Skill Name Matching

**What goes wrong:** This is an existing bug (documented in CONCERNS.md) that persists through migration. In `ontology_sync.js` lines 78 and 92, skill directory names are interpolated into `new RegExp()` without escaping. A skill named `skill.+name` would produce a regex matching unintended patterns.

**Prevention:** Escape regex metacharacters before interpolation:
```javascript
const escaped = skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(`^ {2}${escaped}:[\\s\\S]*?token_estimate: (\\d+)`, 'm');
```

**Detection:** Create a skill with regex metacharacters in the name and verify the hook does not crash or match incorrectly.

**Phase:** Fix during the migration phase since the code is being refactored anyway.

---

### Pitfall 14: Test Suite Uses env vars -- Must Be Rewritten for stdin

**What goes wrong:** The existing test suite (`test/hooks.test.js`) passes input via `env` options to `execFileSync`:
```javascript
execFileSync("node", [hookPath], {
  env: { ...process.env, CLAUDE_FILE_PATH: "..." },
  cwd: tmpDir,
});
```
After migration, tests must pipe JSON to stdin instead. This requires switching from `execFileSync` to `execSync` with pipe input, or using `child_process.spawn` with stdin writing.

**Why it happens:** The test structure mirrors the hook's input mechanism. When the input mechanism changes, tests must change in lockstep.

**Consequences:**
- Old tests pass even though hooks are broken (they test the old interface)
- New behavior is untested
- False confidence in test coverage

**Prevention:**
1. Create a test helper that pipes JSON to a hook script:
   ```javascript
   function runHook(hookPath, inputJson, options = {}) {
     const input = JSON.stringify(inputJson);
     return execSync(`echo '${input.replace(/'/g, "'\\''")}' | node "${hookPath}"`, {
       cwd: options.cwd || process.cwd(),
       encoding: 'utf-8',
       env: options.env || process.env,
     });
   }
   ```
2. Or use `child_process.spawn` for proper stdin piping (more robust, handles special characters):
   ```javascript
   function runHook(hookPath, inputJson, options = {}) {
     const child = spawnSync('node', [hookPath], {
       input: JSON.stringify(inputJson),
       cwd: options.cwd || process.cwd(),
       encoding: 'utf-8',
     });
     return { stdout: child.stdout, stderr: child.stderr, status: child.status };
   }
   ```
3. Write test fixtures that match the exact JSON schemas from the official docs
4. Test both stdout (JSON output) and stderr (diagnostic messages) separately

**Detection:** After migration, verify that no test passes input via `env` to hook scripts.

**Phase:** Must be done immediately after hook migration. Tests and hooks should be updated in the same phase.

---

### Pitfall 15: findProjectRoot() Redundancy After Migration

**What goes wrong:** `ontology_sync.js` has a `findProjectRoot()` function that checks `CLAUDE_PROJECT_DIR` env var and falls back to `process.cwd()`. After migration, the stdin JSON provides `cwd` (the working directory when the hook was invoked). Using both the old env var lookup and the new stdin field creates confusion about which root is authoritative.

**Prevention:**
1. Use `input.cwd` from stdin JSON as the primary project root
2. Remove the `findProjectRoot()` function entirely
3. If `cwd` does not contain a `.claude` directory, this is not a valid ontology project -- exit 0 silently

**Phase:** Part of the stdin migration refactor.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| stdin migration | Windows `fs.readFileSync('/dev/stdin')` crash (Pitfall 2) | Use async `process.stdin` stream API |
| stdin migration | Incomplete JSON from chunked reads (Pitfall 8) | Accumulate all chunks before parsing |
| stdout migration | console.log pollution (Pitfall 1) | Route diagnostics to stderr, JSON to stdout |
| stdout migration | additionalContext vs console.log visibility (Pitfall 6) | Use structured JSON with additionalContext |
| stdout migration | Missing hookEventName (Pitfall 7) | Shared output builder function |
| hooks.json update | Bare script paths break (Pitfall 9) | Use ${CLAUDE_PLUGIN_ROOT} |
| hooks.json update | No timeout specified (Pitfall 11) | Set explicit timeout per hook |
| hooks.json update | Async misunderstanding (Pitfall 12) | Only use async for advisory hooks |
| New hooks (SessionStart, Stop) | Stop hook infinite loop | Check `stop_hook_active` field |
| Session tracker fix | Collision not fully solved (Pitfall 5) | Use session_id + add SessionEnd cleanup |
| Test migration | Old tests validate wrong interface (Pitfall 14) | Rewrite with stdin piping helpers |
| All phases | Field name mapping errors (Pitfall 4) | Create env-to-stdin mapping reference |

## Sources

- [Claude Code Hooks Reference (official)](https://code.claude.com/docs/en/hooks) -- HIGH confidence
- [Claude Code Hooks Guide (official)](https://code.claude.com/docs/en/hooks-guide) -- HIGH confidence
- [Plugin hooks JSON output not captured (Issue #10875)](https://github.com/anthropics/claude-code/issues/10875) -- HIGH confidence
- [PostToolUse hook JSON output not processed (Issue #3983)](https://github.com/anthropics/claude-code/issues/3983) -- HIGH confidence
- [Node.js stdin fd 0 Windows crash (Issue #19831)](https://github.com/nodejs/node/issues/19831) -- HIGH confidence
- [Node.js stdin EOF error on Windows pipes (Issue #35997)](https://github.com/nodejs/node/issues/35997) -- HIGH confidence
- [Reading stdin in Node.js cross-platform](https://www.codegenes.net/blog/read-all-text-from-stdin-to-a-string/) -- MEDIUM confidence
- [Claude Code Hooks Complete Guide (DEV Community)](https://dev.to/lukaszfryc/claude-code-hooks-complete-guide-with-20-ready-to-use-examples-2026-dcg) -- MEDIUM confidence
- [Synchronous stdin reading in Node.js (GitHub Gist)](https://gist.github.com/espadrine/172658142820a356e1e0) -- MEDIUM confidence

---

*Pitfalls audit: 2026-03-06*
