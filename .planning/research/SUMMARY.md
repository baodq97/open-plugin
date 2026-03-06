# Project Research Summary

**Project:** Skills Ontology Plugin -- Hooks Spec Alignment
**Domain:** Claude Code plugin hooks migration (env vars to stdin/stdout JSON)
**Researched:** 2026-03-06
**Confidence:** HIGH

## Executive Summary

The Skills Ontology plugin currently uses an outdated, undocumented integration pattern for its Claude Code hooks: environment variables for input (`CLAUDE_FILE_PATH`, `CLAUDE_TOOL_INPUT`) and plain `console.log()` for output. The official hooks specification delivers all context via stdin JSON and processes structured JSON on stdout. This mismatch has a concrete consequence: PostToolUse `console.log()` output is invisible to Claude in normal operation (only shown in verbose mode), which means the plugin's drift detection and skill tracking messages never reach Claude's context. The plugin runs but has no effect.

The recommended approach is a three-phase migration. Phase 1 creates shared I/O infrastructure (`hooks/lib/hook-utils.js` for stdin reading and JSON output building, `src/yaml-helpers.js` for shared YAML parsing) and updates `hooks.json` configuration (add `${CLAUDE_PLUGIN_ROOT}` paths, timeouts, description). Phase 2 refactors the two existing hooks (`ontology_sync.js`, `ontology_track_skill.js`) into a handler/entry-script architecture where handlers are pure functions testable without stdin/stdout coupling. Phase 3 adds three new hook events -- SessionStart for cold-start context injection, Stop for usage-log reminders, and PreToolUse for skill prerequisite routing -- that transform the plugin from a passive observer into an active intelligence layer.

The primary risks are: (1) stdout pollution from leftover `console.log()` calls corrupting JSON parsing, which is the most common hook failure mode per Claude Code issue trackers; (2) cross-platform stdin reading, where `fs.readFileSync('/dev/stdin')` fails on Windows but `fs.readFileSync(0, 'utf8')` works reliably for piped input on Node 18+; and (3) the Stop hook creating an infinite loop if `stop_hook_active` is not checked. All three have well-documented prevention strategies. One genuine uncertainty remains: the PreToolUse matcher for skill invocations depends on how Claude Code presents skill tool names, which needs empirical verification.

## Key Findings

### Recommended Stack

No new dependencies are needed. The migration stays within the project's zero-dependency CommonJS constraint. All I/O uses Node.js stdlib modules (`fs`, `path`, `os`).

**Core technologies:**
- `fs.readFileSync(0, 'utf8')`: Synchronous cross-platform stdin reader -- works on Linux, macOS, and Windows when stdin is piped (which Claude Code always does). Do NOT use `/dev/stdin` (fails on Windows) or async `process.stdin` events (unnecessary complexity for simple hook scripts).
- `process.stdout.write(JSON.stringify(obj))`: Structured JSON output -- avoids `console.log()` trailing newline ambiguity and keeps stdout clean. `console.log(JSON.stringify(obj))` also works but risks accidental mixing with diagnostic output.
- `process.exitCode = N`: Exit code signaling -- cleaner than `process.exit(N)` because it lets the event loop drain and ensures stdout is flushed. Exit 0 = success (stdout parsed), exit 2 = blocking error (stderr shown to Claude), other = non-blocking error (stderr in verbose only).
- `${CLAUDE_PLUGIN_ROOT}`: Plugin path variable -- resolves to the plugin's root directory at runtime, replacing bare relative paths in `hooks.json` that break when cwd differs from plugin root.

**Critical version requirement:** Node.js >= 18. The `fs.readFileSync(0)` Windows pipe EOF bug (Node.js #35997) was fixed in libuv and shipped in Node 18+ releases.

### Expected Features

**Must have (table stakes -- spec compliance):**
- TS-1: Stdin JSON input for all hooks (replaces env var reading)
- TS-2: Structured JSON output via stdout (replaces console.log)
- TS-3: `${CLAUDE_PLUGIN_ROOT}` paths in hooks.json (prevents path resolution failures)
- TS-4: Top-level `description` field in hooks.json
- TS-5: Explicit timeout per hook (current default is 600s, should be 5-15s)
- TS-6: Session ID-based tracker file isolation (fixes concurrent session collision bug)
- TS-7: Exit code compliance (audit and correct all exit paths)

**Should have (differentiators):**
- DF-1: SessionStart context injection -- highest-value new feature; eliminates the cold-start problem where Claude has no skill awareness until one is invoked
- DF-3: PostToolUse drift detection with `additionalContext` -- makes drift warnings visible to Claude without verbose mode (refactor of existing logic)
- DF-4: PostToolUse usage tracking with session isolation and outcome tracking (refactor of existing logic)
- DF-5: Stop hook for usage-log reminders -- nudges Claude to log skill outcomes before session ends
- DF-7: StatusMessage configuration for user feedback during hook execution

**Defer (v2+):**
- DF-2: PreToolUse skill routing -- highest intelligence value but blocked by tool name matcher uncertainty
- DF-6: Async drift detection -- optimization, not needed until performance is a problem
- DF-8: PreCompact hook for ontology context preservation during compaction
- DF-9: SessionEnd hook for tracker cleanup -- safety net, lower priority than Stop hook

**Anti-features (deliberately NOT building):**
- HTTP hooks, prompt/agent hooks, PreToolUse deny decisions, worktree hooks, config change hooks, notification hooks, UserPromptSubmit interception, InstructionsLoaded tracking

### Architecture Approach

Restructure hooks into a three-tier design: a shared I/O module (`hooks/lib/hook-utils.js`), pure-function handler modules in `hooks/handlers/`, and thin 5-10 line entry scripts in `hooks/` that wire stdin reading to handler to JSON output. Additionally, extract duplicated YAML parsing logic from core modules into `src/yaml-helpers.js` shared by both core CLI commands and hook handlers. Hooks should NOT import core CLI modules directly (different interfaces, coupling risk).

**Major components:**
1. `hooks/lib/hook-utils.js` -- readStdinJSON(), output builder functions per event type, resolveProjectRoot(); single implementation of cross-platform stdin reading and spec-compliant JSON output
2. `hooks/handlers/*.js` -- Pure functions: `handle(input) -> output`. No stdin/stdout side effects. Each handler receives a parsed JSON object and returns a result object (or null). Directly testable with mock inputs.
3. `hooks/ontology_*.js` -- Thin entry scripts: read stdin via hook-utils, call handler, write output via hook-utils. Zero business logic. What hooks.json references.
4. `src/yaml-helpers.js` -- Shared YAML parsing: `extractRegistrySkills()`, `parseGraphEdges()`, `parseRegistryEntry()`. Used by both core modules and hook handlers, eliminating regex duplication.
5. `hooks/hooks.json` -- Hook configuration with `${CLAUDE_PLUGIN_ROOT}` paths, per-hook timeouts, statusMessage fields, and top-level description.

### Critical Pitfalls

1. **stdout pollution breaks JSON parsing** -- Any `console.log()` call corrupts the JSON output stream. This is the #1 hook failure mode (confirmed by GitHub issues #10875, #3983). Audit every `console.log()` in existing hooks; route diagnostics to `console.error()` (stderr), reserve stdout exclusively for the final JSON object.

2. **`/dev/stdin` does not exist on Windows** -- Use `fs.readFileSync(0, 'utf8')` (file descriptor 0), not `fs.readFileSync('/dev/stdin')`. This is a hard crash, not a graceful fallback. The cross-platform constraint makes this non-negotiable.

3. **Missing `hookEventName` silently discards output** -- The `hookSpecificOutput` object requires `hookEventName` set to the exact event name string (e.g., `"PostToolUse"`, `"SessionStart"`). Omitting or misspelling it causes Claude Code to ignore the output with no error. Build this into the shared output builder to prevent per-hook mistakes.

4. **Stop hook infinite loop** -- If the Stop hook returns `decision: "block"` without checking `stop_hook_active`, Claude re-invokes the hook indefinitely. Always check `input.stop_hook_active === true` and allow stopping if set.

5. **Session tracker collision persists without full lifecycle** -- Simply adding `session_id` to the filename fixes collision but leaves orphaned temp files. Need SessionEnd or SessionStart cleanup to prevent temp directory accumulation. Also, the tracker never auto-flushes to `usage-log.yaml`, which the adjust-strengths feature depends on.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Spec Compliance

**Rationale:** Everything depends on the shared I/O infrastructure. The stdin reader, output builders, and hooks.json configuration are prerequisites for all subsequent work. This phase has zero risk to existing functionality because it creates new files without modifying existing hooks yet.

**Delivers:**
- `hooks/lib/hook-utils.js` (readStdinJSON, output builders per event type, resolveProjectRoot)
- `src/yaml-helpers.js` (extracted shared YAML parsing from core modules)
- Updated `hooks/hooks.json` (${CLAUDE_PLUGIN_ROOT} paths, description, timeouts, statusMessage)
- Test helpers for piping JSON to hook scripts via `child_process.spawnSync`

**Addresses:** TS-3, TS-4, TS-5, TS-7 (hooks.json config), plus foundation for TS-1, TS-2

**Avoids:**
- Pitfall 2: `/dev/stdin` Windows crash (correct stdin reader from day one)
- Pitfall 7: Missing hookEventName (built into output builders)
- Pitfall 8: Incomplete JSON buffering (single correct implementation)
- Pitfall 9: Bare script paths (fixed in hooks.json)
- Pitfall 11: Missing timeouts (added to hooks.json)

### Phase 2: Existing Hook Migration

**Rationale:** Upgrade the two existing hooks before adding new ones. Lower risk because the business logic stays the same; only the I/O mechanism changes. This phase validates the Phase 1 infrastructure with real hook logic.

**Delivers:**
- `hooks/handlers/sync-handler.js` (drift detection logic extracted as pure function)
- `hooks/handlers/track-handler.js` (usage tracking logic extracted as pure function)
- Rewritten `hooks/ontology_sync.js` (thin entry script)
- Rewritten `hooks/ontology_track_skill.js` (thin entry script)
- Session-isolated tracker files via `session_id`
- Drift detection visible to Claude via `additionalContext` (not just verbose mode)
- Updated test suite: stdin piping instead of env var injection

**Addresses:** TS-1, TS-2, TS-6, DF-3, DF-4, DF-7

**Avoids:**
- Pitfall 1: stdout pollution (all console.log calls audited and rerouted)
- Pitfall 4: Wrong field names after migration (shared utility enforces correct paths)
- Pitfall 5: Session tracker collision (session_id isolation)
- Pitfall 6: additionalContext vs console.log visibility (structured JSON output)
- Pitfall 13: Regex injection in skill name matching (fixed during refactor)
- Pitfall 14: Test suite validates wrong interface (rewritten with stdin piping)
- Pitfall 15: findProjectRoot redundancy (replaced with input.cwd)

### Phase 3: New Hook Events

**Rationale:** With the I/O infrastructure validated and existing hooks working correctly, add new hook events that provide the highest value. SessionStart comes first (well-defined matcher, immediate value). Stop hook second (completes the usage tracking lifecycle). PreToolUse last (requires tool name matcher verification).

**Delivers:**
- `hooks/handlers/session-start-handler.js` + entry script (ontology context injection at session start)
- `hooks/handlers/stop-handler.js` + entry script (usage-log reminder with loop prevention)
- `hooks/handlers/pre-skill-handler.js` + entry script (skill prerequisite routing -- may need adjusted matcher)
- Updated hooks.json with new event bindings

**Addresses:** DF-1, DF-5, DF-2

**Avoids:**
- Pitfall related to Stop hook infinite loop (check stop_hook_active)
- Scope creep into anti-features (no HTTP hooks, no prompt hooks, no deny decisions)

### Phase 4: Integration and Cleanup

**Rationale:** Final cleanup after all hooks are working. Remove legacy code, add integration tests, verify the full hook lifecycle end-to-end.

**Delivers:**
- Integration tests simulating full session lifecycle (SessionStart -> tool use -> PostToolUse -> Stop)
- Removal of all legacy `process.env.CLAUDE_*` references
- SessionEnd hook for tracker cleanup (safety net)
- Documentation of known limitations and troubleshooting

**Addresses:** DF-9 (SessionEnd), legacy code removal

### Phase Ordering Rationale

- Phase 1 before everything: shared I/O utilities are imported by every hook; building them first prevents duplication and ensures cross-platform correctness from day one.
- Phase 2 before Phase 3: migrating existing working hooks validates the infrastructure with known-good business logic. If something breaks, it is an I/O issue, not a logic issue.
- Within Phase 3, SessionStart before PreToolUse: SessionStart's matcher ("startup") is documented and unambiguous. PreToolUse's matcher depends on the skill tool name, which needs empirical testing. Ship SessionStart first while investigating the PreToolUse matcher.
- Phase 4 last: cleanup and integration testing after all features are implemented.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (PreToolUse routing):** The tool name matcher for skill invocations is uncertain. Does Claude Code present skills as tool name "Skill", or as individual tool names, or as MCP tool names? This requires testing with a live Claude Code session. Consider making the matcher configurable or using a broad regex matcher initially.
- **Phase 3 (Stop hook UX):** Whether to use `decision: "block"` (forces Claude to log) vs `additionalContext` (advisory nudge) is a UX decision that may need user feedback. The research recommends starting with advisory-only and upgrading to blocking only if usage logging is consistently missed.

Phases with standard patterns (skip deep research):
- **Phase 1:** Official spec is definitive for hooks.json format, stdin JSON schemas, and output structure. No ambiguity.
- **Phase 2:** The migration is mechanical -- same logic, different I/O. The handler/entry-script pattern is well-established. The ARCHITECTURE.md provides complete data flow diagrams for both existing hooks.
- **Phase 4:** Standard cleanup and integration testing patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. `fs.readFileSync(0)` verified cross-platform for piped stdin. Official Node.js docs + issue tracker confirm behavior. |
| Features | HIGH | All table stakes and differentiators derived directly from the official Claude Code hooks reference. Feature dependency graph is clear. |
| Architecture | HIGH | Three-tier handler pattern is standard. Data flows documented for all 5 hook events. Shared utility extraction is straightforward. |
| Pitfalls | HIGH | 15 pitfalls identified with prevention strategies. Critical pitfalls (stdout pollution, Windows stdin, Stop loop) confirmed by official docs and GitHub issues. |

**Overall confidence:** HIGH

### Gaps to Address

- **PreToolUse tool name matcher:** What `tool_name` value does Claude Code use when a skill is invoked? Needs testing with a live session. If skills are loaded via Read or Bash rather than a dedicated "Skill" tool, the PreToolUse matcher strategy changes entirely. Workaround: defer DF-2 to Phase 3 and use the Phase 2 rollout to observe actual tool_name values in PostToolUse stdin data.
- **SessionStart resume/compact behavior:** Should ontology context be re-injected on session resume or only on fresh startup? Using matcher "startup" limits to new sessions; omitting the matcher fires on resume/clear/compact too. This is a UX decision, not a technical one.
- **Async stdin reader (PITFALLS.md vs STACK.md disagreement):** PITFALLS.md recommends async `process.stdin` streams for Windows safety. STACK.md recommends synchronous `fs.readFileSync(0, 'utf8')` based on Claude Code always piping stdin. The STACK.md recommendation is correct for this use case -- Claude Code hooks always receive piped input, and the synchronous approach is simpler. The async approach is only needed if stdin might not be piped, which does not apply here. Go with `fs.readFileSync(0, 'utf8')`.
- **CLAUDE_ENV_FILE usage in SessionStart:** The SessionStart hook has access to `$CLAUDE_ENV_FILE` for persisting environment variables across the session. Could be used to set flags like `ONTOLOGY_AVAILABLE=true`. Value is unclear vs using `additionalContext`. Low priority.

## Sources

### Primary (HIGH confidence)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) -- Input schemas, output formats, event types, exit codes, configuration
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference) -- Plugin manifest, hooks.json format, ${CLAUDE_PLUGIN_ROOT}
- [Claude Code Hooks Blog Post](https://claude.com/blog/how-to-configure-hooks) -- Official examples and best practices
- [Node.js fs documentation](https://nodejs.org/api/fs.html) -- readFileSync, readSync behavior

### Secondary (MEDIUM confidence)
- [Node.js #19831: stdin fd 0 on Windows](https://github.com/nodejs/node/issues/19831) -- EISDIR error for non-piped stdin (not applicable to Claude Code hooks)
- [Node.js #35997: readSync EOF on Windows pipes](https://github.com/nodejs/node/issues/35997) -- Fixed in libuv, shipped in Node 18+
- [Claude Code Issue #10875: Hook JSON output not captured](https://github.com/anthropics/claude-code/issues/10875) -- Confirms stdout pollution as common failure mode
- [Claude Code Issue #3983: PostToolUse JSON not processed](https://github.com/anthropics/claude-code/issues/3983) -- Confirms PostToolUse stdout visibility limitation
- [claude-flow #1172: hook-handler.cjs stdin](https://github.com/ruvnet/claude-flow/issues/1172) -- Real-world Node.js hook stdin pattern

### Tertiary (LOW confidence)
- [Claude Code Hooks Complete Guide (smartscope.blog)](https://smartscope.blog/en/generative-ai/claude/claude-code-hooks-guide/) -- Third-party guide, used for cross-referencing
- [Claude Code Hooks Guide (DEV Community)](https://dev.to/lukaszfryc/claude-code-hooks-complete-guide-with-20-ready-to-use-examples-2026-dcg) -- Community examples

---
*Research completed: 2026-03-06*
*Ready for roadmap: yes*
