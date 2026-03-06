# Skills Ontology Plugin — Hooks Spec Alignment

## What This Is

A Claude Code plugin that manages skill ontologies — scanning skill files, building relationship graphs, and tracking usage patterns. The plugin needs to be updated to align with the official Claude Code hooks specification, closing gaps in how it receives input, outputs results, references scripts, and leverages available hook events.

## Core Value

The plugin's hooks correctly integrate with Claude Code's official hooks system, receiving JSON input via stdin, returning structured JSON output, and using all relevant hook events to provide intelligent skill routing and tracking.

## Requirements

### Validated

- ✓ PostToolUse hook on Write|Edit detects ontology drift — existing
- ✓ PostToolUse hook on Skill tracks skill usage — existing
- ✓ CLI commands (build, validate, adjust, graph) work correctly — existing
- ✓ Plugin manifest (.claude-plugin/plugin.json) follows official format — existing
- ✓ Commands (ontology-build, ontology-stats, ontology-graph) follow official format — existing
- ✓ Rules (skill-routing, ontology-lifecycle) follow official format — existing
- ✓ Zero-dependency, CommonJS, Node 18+ — existing

### Active

- [ ] Hooks read JSON input from stdin instead of environment variables
- [ ] Hooks return structured JSON output (hookSpecificOutput, additionalContext)
- [ ] Hook script paths use `${CLAUDE_PLUGIN_ROOT}` instead of relative paths
- [ ] hooks.json includes top-level `description` field
- [ ] Hooks specify `timeout` appropriate for their operation
- [ ] Hooks include `statusMessage` for user feedback
- [ ] SessionStart hook injects ontology context (skill routing info) via additionalContext
- [ ] PreToolUse hook on Skill provides routing/prerequisite info before invocation
- [ ] Stop hook reminds about usage log outcomes at end of conversation
- [ ] ontology_sync.js async flag considered (advisory, non-blocking)
- [ ] Session tracker collision fix (use session_id from stdin JSON)
- [ ] Existing tests updated for new stdin-based input mechanism

### Out of Scope

- HTTP hooks — local plugin, no server needed
- Prompt/agent hook types — command hooks sufficient for this plugin's needs
- New CLI commands — focus is on hooks alignment, not new features
- Refactoring core modules (YAML parser, graph engine) — separate concern
- WorktreeCreate/WorktreeRemove hooks — not relevant to ontology management

## Context

**Audit source:** Official Claude Code hooks documentation at https://code.claude.com/docs/en/hooks

**Key findings from gap analysis:**
1. **Input mechanism is wrong** — hooks read env vars (CLAUDE_FILE_PATH, CLAUDE_TOOL_INPUT, CLAUDE_PROJECT_DIR) but official spec delivers JSON via stdin with tool_name, tool_input, tool_response, cwd, session_id fields
2. **Script paths are fragile** — bare `node hooks/ontology_sync.js` breaks depending on cwd; should use `${CLAUDE_PLUGIN_ROOT}`
3. **Output is invisible** — console.log() text only shows in verbose mode for PostToolUse; structured JSON with additionalContext gets injected into Claude's actual context
4. **Untapped events** — SessionStart, PreToolUse (on Skill), and Stop hooks would significantly improve the plugin's value
5. **Session tracker bug** — shared temp file collides across concurrent sessions; stdin JSON provides session_id for isolation

**Brownfield context:**
- 82+ tests exist in test/ using node:test
- Hooks are in hooks/ directory with hooks.json config
- Codebase map at .planning/codebase/ documents current architecture

## Constraints

- **Zero dependencies**: Must remain stdlib-only — no external packages for JSON parsing or stdin reading
- **CommonJS**: All code uses require/module.exports, no ESM
- **Node 18+**: Minimum runtime version
- **Backward compatibility**: Existing CLI commands and ontology file formats must not break
- **Cross-platform**: Hooks must work on macOS, Linux, and Windows

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Read stdin via fs.readFileSync('/dev/stdin') | Official spec delivers JSON on stdin; env vars are undocumented/legacy | — Pending |
| Use ${CLAUDE_PLUGIN_ROOT} for script paths | Official spec for plugin hooks; prevents cwd-dependent breakage | — Pending |
| Add SessionStart hook for ontology context | Injects skill routing info at session start via additionalContext | — Pending |
| Add PreToolUse hook on Skill | Provides prerequisite/routing info before skill invocation | — Pending |
| Add Stop hook for usage logging reminder | Captures end-of-conversation usage outcomes | — Pending |
| Use session_id for tracker file isolation | Fixes concurrent session collision bug in ontology_track_skill.js | — Pending |

---
*Last updated: 2026-03-06 after initialization*
