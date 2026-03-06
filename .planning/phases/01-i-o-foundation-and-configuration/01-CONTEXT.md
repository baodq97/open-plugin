# Phase 1: I/O Foundation and Configuration - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Shared hook utilities (hook-utils.js, yaml-helpers.js), hooks.json spec compliance (`${CLAUDE_PLUGIN_ROOT}` paths, description, timeout, statusMessage), and unit tests for both modules. No hook migration — that's Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Status messages
- Tone: technical/precise — fits developer-facing plugin
- Prefix all with "Skills Ontology: " so users identify the plugin when multiple plugins are active
- Trailing ellipsis to signal in-progress (e.g., "Skills Ontology: Checking registry for drift...")
- Same pattern for all hooks across Phase 2 and Phase 3

### Module organization
- hook-utils.js and yaml-helpers.js live flat in hooks/ root (no lib/ subdirectory)
- Named exports: `module.exports = { readStdinJSON, buildOutput, resolveProjectRoot }`
- yaml-helpers.js shared across both hooks/ and src/ — src/build-registry.js can `require('../hooks/yaml-helpers')` to eliminate duplication
- New test files: test/hook-utils.test.js and test/yaml-helpers.test.js (one per module, matching existing convention)

### Graceful degradation
- readStdinJSON() returns `{}` on empty/malformed stdin — hooks check properties without crashing
- Use fd 0 (`fs.readFileSync(0, 'utf8')`) for cross-platform support (Windows, Linux, macOS)
- No backward compatibility with env vars — clean break, env vars are undocumented/legacy
- buildOutput() auto-detects hookEventName from parsed stdin input, caller can override

### Claude's Discretion
- hooks.json top-level description field wording
- Exact timeout values per hook (following SPEC-05 guidance: 10s SessionStart, 15s PostToolUse, 5s PreToolUse/Stop)
- resolveProjectRoot() implementation details (cwd vs CLAUDE_PLUGIN_ROOT resolution order)
- yaml-helpers.js function signatures and edge case handling

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- hooks/ontology_sync.js: has `findProjectRoot()` logic (env var -> cwd -> fallback) that can inform resolveProjectRoot()
- hooks/ontology_track_skill.js: has inline YAML-like regex parsing and JSON field extraction — extractable patterns
- src/build-registry.js: has YAML parsing with regex that yaml-helpers.js should consolidate

### Established Patterns
- CommonJS with `"use strict"` across all modules
- node:test + node:assert/strict for testing
- One test file per source module (test/validate.test.js for src/validate.js, etc.)
- No external dependencies — stdlib only

### Integration Points
- hooks.json: needs `${CLAUDE_PLUGIN_ROOT}` paths, description, timeout, statusMessage added
- Phase 2 hooks will require('./hook-utils') and require('./yaml-helpers')
- src/build-registry.js can require('../hooks/yaml-helpers') to deduplicate YAML parsing

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-i-o-foundation-and-configuration*
*Context gathered: 2026-03-06*
