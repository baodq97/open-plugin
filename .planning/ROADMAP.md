# Roadmap: Skills Ontology Plugin -- Hooks Spec Alignment

## Overview

This project migrates the Skills Ontology plugin's hooks from an undocumented env-var/console.log pattern to the official Claude Code hooks specification (stdin JSON input, structured JSON output). The work proceeds in three phases: build shared I/O infrastructure and update hooks.json configuration, migrate the two existing hooks to use that infrastructure, then add new hook events (SessionStart, PreToolUse, Stop, SessionEnd) that transform the plugin from a passive observer into an active intelligence layer.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: I/O Foundation and Configuration** - Shared hook utilities, YAML helpers, hooks.json spec compliance, and unit tests for both
- [ ] **Phase 2: Existing Hook Migration** - Refactor ontology_sync and ontology_track_skill to stdin/stdout JSON with session isolation
- [ ] **Phase 3: New Hook Events** - SessionStart context injection, PreToolUse routing, Stop reminders, SessionEnd cleanup, and integration tests

## Phase Details

### Phase 1: I/O Foundation and Configuration
**Goal**: Shared infrastructure exists for all hooks to read stdin JSON, write structured JSON output, and resolve paths correctly -- with hooks.json fully spec-compliant
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, SPEC-03, SPEC-04, SPEC-05, TEST-01, TEST-02
**Success Criteria** (what must be TRUE):
  1. A hook script can import hook-utils.js, call readStdinJSON(), and receive a parsed object from piped JSON input on any platform (Linux, macOS, Windows)
  2. A hook script can call an output builder function and get a correctly structured JSON object with hookSpecificOutput, additionalContext, and hookEventName fields
  3. hooks.json uses ${CLAUDE_PLUGIN_ROOT} paths, has a top-level description field, and every hook entry has a timeout and statusMessage
  4. yaml-helpers.js exports parseGraphEdges() and extractRegistrySkills() that correctly parse ontology YAML files
  5. All new utility modules have passing unit tests (hook-utils.js stdin/output/path tests, yaml-helpers.js parsing tests)
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md -- Hook I/O utilities (hook-utils.js) via TDD
- [ ] 01-02-PLAN.md -- YAML helpers (yaml-helpers.js) via TDD
- [ ] 01-03-PLAN.md -- hooks.json spec compliance (description, paths, timeout, statusMessage)

### Phase 2: Existing Hook Migration
**Goal**: Both existing hooks (ontology_sync, ontology_track_skill) use stdin JSON for input and structured JSON for output, with session-isolated tracking and correct exit codes
**Depends on**: Phase 1
**Requirements**: SPEC-01, SPEC-02, SPEC-06, SPEC-07, MIGR-01, MIGR-02, MIGR-03
**Success Criteria** (what must be TRUE):
  1. ontology_sync.js reads file_path from stdin JSON (not CLAUDE_FILE_PATH env var), detects ontology drift, and returns drift info via additionalContext that Claude can see without verbose mode
  2. ontology_track_skill.js reads tool_input from stdin JSON and writes to a session_id-scoped tracker file, so concurrent sessions do not collide
  3. Both hooks exit with code 0 on success (stdout parsed as JSON) and non-zero/non-2 on non-blocking errors, with no console.log() calls polluting stdout
  4. Existing test suite passes with stdin-piping test harness instead of env var injection
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: New Hook Events
**Goal**: Plugin actively provides skill context at session start, routing info before skill use, usage reminders at session end, and cleans up after itself -- with integration tests covering the full lifecycle
**Depends on**: Phase 2
**Requirements**: HOOK-01, HOOK-02, HOOK-03, HOOK-04, TEST-03
**Success Criteria** (what must be TRUE):
  1. SessionStart hook fires on new session, reads registry.yaml and graph.yaml, and injects a compact skill summary (names, domains, top chains) into Claude's context via additionalContext
  2. PreToolUse hook fires before skill invocation and provides prerequisite/routing info via additionalContext so Claude knows dependencies before executing a skill
  3. Stop hook detects unlogged skill usage in the session tracker and returns a reminder via additionalContext (with stop_hook_active guard preventing infinite loops)
  4. SessionEnd hook removes the session-scoped tracker temp file, preventing orphaned files from accumulating
  5. Integration tests simulate a full session lifecycle (SessionStart -> PreToolUse -> PostToolUse -> Stop -> SessionEnd) with stdin JSON piping and verify correct JSON output at each stage
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. I/O Foundation and Configuration | 0/3 | Planning complete | - |
| 2. Existing Hook Migration | 0/0 | Not started | - |
| 3. New Hook Events | 0/0 | Not started | - |
