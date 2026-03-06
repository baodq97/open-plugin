# Requirements: Skills Ontology Plugin — Hooks Spec Alignment

**Defined:** 2026-03-06
**Core Value:** Plugin hooks correctly integrate with Claude Code's official hooks system, providing intelligent skill routing and tracking

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: Shared hook I/O utility (hook-utils.js) reads JSON from stdin via `fs.readFileSync(0, 'utf8')` and provides helper to write structured JSON to stdout
- [ ] **INFRA-02**: Shared YAML helpers module (yaml-helpers.js) extracts duplicated `parseGraphEdges()` and `extractRegistrySkills()` into reusable functions
- [ ] **INFRA-03**: All hooks specify `statusMessage` for user-visible feedback while running

### Spec Compliance

- [ ] **SPEC-01**: All hook scripts read JSON input from stdin instead of environment variables (CLAUDE_FILE_PATH, CLAUDE_TOOL_INPUT, CLAUDE_PROJECT_DIR)
- [ ] **SPEC-02**: All hook scripts return structured JSON output via stdout with `hookSpecificOutput` and `additionalContext` fields instead of plain console.log text
- [ ] **SPEC-03**: All hook script paths in hooks.json use `${CLAUDE_PLUGIN_ROOT}` instead of bare relative paths
- [ ] **SPEC-04**: hooks.json includes top-level `description` field describing plugin hooks purpose
- [ ] **SPEC-05**: All hooks specify appropriate `timeout` values (10s SessionStart, 15s PostToolUse, 5s PreToolUse/Stop)
- [ ] **SPEC-06**: Session tracker uses `session_id` from stdin JSON for per-session file isolation instead of shared temp file
- [ ] **SPEC-07**: Hook scripts use correct exit codes (0 for success with JSON, non-zero non-2 for non-blocking errors)

### Existing Hook Migration

- [ ] **MIGR-01**: ontology_sync.js (PostToolUse on Write|Edit) reads tool_input.file_path from stdin JSON and returns drift info via additionalContext
- [ ] **MIGR-02**: ontology_track_skill.js (PostToolUse on Skill) reads tool_input from stdin JSON and tracks usage with session_id-scoped temp file
- [ ] **MIGR-03**: Existing tests updated to test stdin-based input and JSON output for both migrated hooks

### New Hook Events

- [ ] **HOOK-01**: SessionStart hook reads registry.yaml and graph.yaml, returns compact skill summary via additionalContext (skill names, domains, top chains)
- [ ] **HOOK-02**: PreToolUse hook on Skill provides prerequisite/routing info via additionalContext before skill invocation
- [ ] **HOOK-03**: Stop hook checks session tracker for unlogged skill usage and reminds via decision:"block" with reason (guarded by stop_hook_active to prevent loops)
- [ ] **HOOK-04**: SessionEnd hook cleans up session-scoped tracker temp file

### Testing

- [ ] **TEST-01**: Unit tests for hook-utils.js (stdin reading, JSON output, project root resolution)
- [ ] **TEST-02**: Unit tests for yaml-helpers.js (parseGraphEdges, extractRegistrySkills)
- [ ] **TEST-03**: Integration tests for each hook script with simulated stdin JSON input and verified stdout JSON output

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Intelligence

- **INTEL-01**: PreToolUse hook suggests optimal skill chains based on current task context
- **INTEL-02**: PostToolUse hook auto-populates usage-log.yaml with outcome data from tool_response
- **INTEL-03**: SessionStart hook adapts context injection based on project type detection

### Advanced Events

- **EVENT-01**: SubagentStart hook injects skill routing context into subagents
- **EVENT-02**: PostToolUseFailure hook tracks failed skill invocations for graph weight adjustment

## Out of Scope

| Feature | Reason |
|---------|--------|
| HTTP hooks | Local plugin, no server infrastructure needed |
| Prompt/agent hook types | Command hooks sufficient for all plugin operations |
| PreToolUse blocking (deny) | Plugin should inform, not gatekeep skill usage |
| WorktreeCreate/Remove hooks | Not relevant to ontology management |
| ConfigChange hooks | Plugin doesn't manage configuration |
| Notification hooks | No notification-driven behavior needed |
| UserPromptSubmit interception | Would be intrusive; plugin is advisory |
| Core YAML parser refactor | Separate concern from hooks alignment |
| New CLI commands | Focus is on hooks, not CLI features |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| SPEC-01 | Phase 2 | Pending |
| SPEC-02 | Phase 2 | Pending |
| SPEC-03 | Phase 1 | Pending |
| SPEC-04 | Phase 1 | Pending |
| SPEC-05 | Phase 1 | Pending |
| SPEC-06 | Phase 2 | Pending |
| SPEC-07 | Phase 2 | Pending |
| MIGR-01 | Phase 2 | Pending |
| MIGR-02 | Phase 2 | Pending |
| MIGR-03 | Phase 2 | Pending |
| HOOK-01 | Phase 3 | Pending |
| HOOK-02 | Phase 3 | Pending |
| HOOK-03 | Phase 3 | Pending |
| HOOK-04 | Phase 3 | Pending |
| TEST-01 | Phase 1 | Pending |
| TEST-02 | Phase 1 | Pending |
| TEST-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after initial definition*
