---
phase: 01-i-o-foundation-and-configuration
plan: 01
subsystem: infra
tags: [hooks, stdin, json, io, commonjs]

# Dependency graph
requires: []
provides:
  - "hooks/hook-utils.js — shared readStdinJSON, buildOutput, resolveProjectRoot for all hook scripts"
  - "test/hook-utils.test.js — 11-test TDD suite validating hook I/O utilities"
affects: [01-02, 01-03, phase-2-hook-migration]

# Tech tracking
tech-stack:
  added: []
  patterns: [synchronous-stdin-fd0, hookSpecificOutput-envelope, env-var-project-root-resolution]

key-files:
  created:
    - hooks/hook-utils.js
    - test/hook-utils.test.js
  modified: []

key-decisions:
  - "Subprocess testing for readStdinJSON — fd 0 cannot be mocked in-process, so tests spawn child_process.execFileSync with piped input"
  - "resolveProjectRoot simplified vs ontology_sync.js — no .claude directory existence check, just env var then cwd (hooks/hook-utils.js is a utility, not a discovery tool)"

patterns-established:
  - "Hook I/O pattern: readStdinJSON() for input, buildOutput(input, fields) for structured response"
  - "hookEventName auto-detection: fields.hookEventName > input.hook_event_name > 'PostToolUse' default"
  - "Subprocess test pattern: execFileSync with inline -e script and input option for stdin-dependent functions"

requirements-completed: [INFRA-01, TEST-01]

# Metrics
duration: 2min
completed: 2026-03-06
---

# Phase 1 Plan 1: Hook I/O Utilities Summary

**Shared hook-utils.js with readStdinJSON (fd 0 sync), buildOutput (hookSpecificOutput envelope), and resolveProjectRoot (env/cwd fallback) -- TDD with 11 passing tests**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-06T03:37:30Z
- **Completed:** 2026-03-06T03:39:44Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Created hooks/hook-utils.js exporting readStdinJSON, buildOutput, resolveProjectRoot
- readStdinJSON handles valid JSON, empty stdin, and malformed JSON via try/catch on fd 0
- buildOutput constructs hookSpecificOutput envelope with hookEventName auto-detection and field copying
- resolveProjectRoot checks CLAUDE_PROJECT_DIR env var first, falls back to process.cwd()
- Full TDD cycle: RED (11 failing tests) then GREEN (all 11 pass)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing tests for hook-utils.js (RED)** - `4073481` (test)
2. **Task 2: Implement hook-utils.js to pass all tests (GREEN)** - `8edf4d8` (feat)

## Files Created/Modified
- `hooks/hook-utils.js` - Shared hook I/O utility module (readStdinJSON, buildOutput, resolveProjectRoot)
- `test/hook-utils.test.js` - 11 unit tests across 3 describe blocks covering all exported functions

## Decisions Made
- Subprocess testing for readStdinJSON: fd 0 cannot be mocked in-process, so tests use child_process.execFileSync with piped input option
- resolveProjectRoot simplified compared to ontology_sync.js findProjectRoot: no .claude directory existence check needed since this is a general utility, not a discovery tool
- buildOutput uses for-of loop over Object.entries for field copying, skipping hookEventName to avoid duplication

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- hook-utils.js is ready for Plan 02 (yaml-helpers.js) and Plan 03 (hooks.json update)
- Phase 2 hook migration can import readStdinJSON/buildOutput/resolveProjectRoot from hooks/hook-utils.js
- 4 pre-existing test failures in plugin-standard.test.js are expected (SPEC-03, SPEC-04, SPEC-05, INFRA-03) -- those will be resolved by Plan 03

## Self-Check: PASSED

- FOUND: hooks/hook-utils.js
- FOUND: test/hook-utils.test.js
- FOUND: 01-01-SUMMARY.md
- FOUND: commit 4073481 (Task 1 RED)
- FOUND: commit 8edf4d8 (Task 2 GREEN)

---
*Phase: 01-i-o-foundation-and-configuration*
*Completed: 2026-03-06*
