# Phase 1: I/O Foundation and Configuration - Research

**Researched:** 2026-03-06
**Domain:** Node.js cross-platform stdin/stdout I/O, Claude Code hooks specification, YAML regex parsing
**Confidence:** HIGH

## Summary

Phase 1 builds two shared utility modules (hook-utils.js, yaml-helpers.js) and updates hooks.json to be spec-compliant. The Claude Code hooks specification is well-documented: hooks receive JSON via stdin with common fields (session_id, transcript_path, cwd, permission_mode, hook_event_name) plus event-specific fields (tool_name, tool_input, tool_response for tool events). Hooks return structured JSON via stdout with hookSpecificOutput containing hookEventName and event-specific decision fields, plus optional additionalContext.

The codebase already has all the YAML parsing patterns needed -- they just need to be extracted from duplicated inline implementations across generate-graph.js, validate.js, adjust-strengths.js, and ontology_sync.js into a single yaml-helpers.js module. The hook I/O pattern is straightforward: read all of stdin synchronously, JSON.parse it, and write JSON.stringify to stdout. Cross-platform stdin reading via `fs.readFileSync(0, 'utf8')` has a known Windows edge case (EOF error instead of returning 0 on empty pipe), which aligns with the CONTEXT.md decision to return `{}` on malformed/empty input via try/catch.

**Primary recommendation:** Build hook-utils.js with readStdinJSON (try/catch around fd 0), buildOutput (construct hookSpecificOutput envelope), and resolveProjectRoot (env -> cwd). Build yaml-helpers.js with parseGraphEdges and extractRegistrySkills extracted from existing code. Update hooks.json with description, ${CLAUDE_PLUGIN_ROOT} paths, timeout, and statusMessage fields.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Status messages: technical/precise tone, prefixed with "Skills Ontology: ", trailing ellipsis for in-progress state (e.g., "Skills Ontology: Checking registry for drift...")
- Module organization: hook-utils.js and yaml-helpers.js live flat in hooks/ root (no lib/ subdirectory)
- Named exports: `module.exports = { readStdinJSON, buildOutput, resolveProjectRoot }`
- yaml-helpers.js shared across hooks/ and src/ -- src/build-registry.js can `require('../hooks/yaml-helpers')` to eliminate duplication
- New test files: test/hook-utils.test.js and test/yaml-helpers.test.js (one per module, matching existing convention)
- readStdinJSON() returns `{}` on empty/malformed stdin -- hooks check properties without crashing
- Use fd 0 (`fs.readFileSync(0, 'utf8')`) for cross-platform support (Windows, Linux, macOS)
- No backward compatibility with env vars -- clean break, env vars are undocumented/legacy
- buildOutput() auto-detects hookEventName from parsed stdin input, caller can override

### Claude's Discretion
- hooks.json top-level description field wording
- Exact timeout values per hook (following SPEC-05 guidance: 10s SessionStart, 15s PostToolUse, 5s PreToolUse/Stop)
- resolveProjectRoot() implementation details (cwd vs CLAUDE_PLUGIN_ROOT resolution order)
- yaml-helpers.js function signatures and edge case handling

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Shared hook I/O utility (hook-utils.js) reads JSON from stdin via `fs.readFileSync(0, 'utf8')` and provides helper to write structured JSON to stdout | Hooks spec input/output format fully documented; cross-platform stdin reading verified; Windows EOF edge case covered by try/catch |
| INFRA-02 | Shared YAML helpers module (yaml-helpers.js) extracts duplicated `parseGraphEdges()` and `extractRegistrySkills()` into reusable functions | Three separate implementations found across generate-graph.js, validate.js, adjust-strengths.js; extraction patterns mapped |
| INFRA-03 | All hooks specify `statusMessage` for user-visible feedback while running | Hooks spec confirms statusMessage is a common field on hook handlers; "Skills Ontology: " prefix convention locked |
| SPEC-03 | All hook script paths in hooks.json use `${CLAUDE_PLUGIN_ROOT}` instead of bare relative paths | Hooks spec confirms ${CLAUDE_PLUGIN_ROOT} contains absolute path to plugin directory; example patterns documented |
| SPEC-04 | hooks.json includes top-level `description` field describing plugin hooks purpose | Hooks spec confirms plugin hooks.json supports optional top-level description field alongside hooks object |
| SPEC-05 | All hooks specify appropriate `timeout` values (10s SessionStart, 15s PostToolUse, 5s PreToolUse/Stop) | Hooks spec confirms timeout is a common field in seconds; defaults are 600 for command, 30 for prompt, 60 for agent |
| TEST-01 | Unit tests for hook-utils.js (stdin reading, JSON output, project root resolution) | Test patterns verified from existing test suite; node:test + node:assert/strict; temp dir isolation via helpers.js |
| TEST-02 | Unit tests for yaml-helpers.js (parseGraphEdges, extractRegistrySkills) | Existing graph/validate tests demonstrate YAML parsing test patterns; sample YAML content for test fixtures available |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| node:fs | Node 18+ | File I/O, stdin reading via fd 0 | Zero-dependency requirement; cross-platform stdlib |
| node:path | Node 18+ | Path resolution for project root | Zero-dependency requirement; cross-platform paths |
| node:os | Node 18+ | Temp dir for session tracking | Zero-dependency requirement; cross-platform temp |
| node:test | Node 18+ | Unit test framework | Already used by project; 69 existing tests |
| node:assert/strict | Node 18+ | Test assertions | Already used by project throughout |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node:child_process | Node 18+ | execFileSync for integration tests | Testing hook scripts as subprocesses with piped stdin |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| fs.readFileSync(0) | process.stdin stream | Async complexity not needed; hooks are synchronous command scripts |
| Regex YAML parsing | yaml npm package | Would violate zero-dependency constraint |
| Jest/Vitest | node:test | node:test already established; no reason to change |

**Installation:**
```bash
# No installation needed -- stdlib only
```

## Architecture Patterns

### Recommended Project Structure
```
hooks/
├── hooks.json              # Updated: description, ${CLAUDE_PLUGIN_ROOT} paths, timeout, statusMessage
├── hook-utils.js           # NEW: readStdinJSON, buildOutput, resolveProjectRoot
├── yaml-helpers.js         # NEW: parseGraphEdges, extractRegistrySkills
├── ontology_sync.js        # Existing (Phase 2 will migrate to use hook-utils)
└── ontology_track_skill.js # Existing (Phase 2 will migrate to use hook-utils)
test/
├── hook-utils.test.js      # NEW
├── yaml-helpers.test.js    # NEW
├── hooks.test.js           # Existing
└── helpers.js              # Existing test utilities
```

### Pattern 1: Synchronous Stdin JSON Reading
**What:** Read all stdin as a single synchronous call, parse as JSON, return `{}` on failure
**When to use:** Every hook script entry point
**Example:**
```javascript
// Source: Claude Code hooks spec (https://code.claude.com/docs/en/hooks)
// Hook scripts receive JSON on stdin, must be read synchronously
"use strict";
const fs = require("fs");

function readStdinJSON() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    // Empty stdin, malformed JSON, or Windows EOF error on fd 0
    return {};
  }
}
```

### Pattern 2: Structured JSON Output Builder
**What:** Construct the hookSpecificOutput envelope with hookEventName, additionalContext, and event-specific fields
**When to use:** Every hook that needs to return data to Claude Code
**Example:**
```javascript
// Source: Claude Code hooks spec — JSON output format
// hookSpecificOutput requires hookEventName to match the event
function buildOutput(input, fields = {}) {
  const hookEventName = fields.hookEventName || input.hook_event_name || "PostToolUse";
  const output = {
    hookSpecificOutput: {
      hookEventName,
      ...fields,
    },
  };
  // additionalContext goes inside hookSpecificOutput for most events
  if (fields.additionalContext) {
    output.hookSpecificOutput.additionalContext = fields.additionalContext;
  }
  return output;
}
```

### Pattern 3: Plugin hooks.json with Spec-Compliant Fields
**What:** hooks.json with description, ${CLAUDE_PLUGIN_ROOT} paths, timeout, statusMessage
**When to use:** The single hooks.json file for this plugin
**Example:**
```json
{
  "description": "Skills Ontology hooks for drift detection and skill tracking",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js",
            "timeout": 15,
            "statusMessage": "Skills Ontology: Checking registry for drift..."
          }
        ]
      }
    ]
  }
}
```

### Anti-Patterns to Avoid
- **Reading env vars for hook input:** The spec uses stdin JSON, not CLAUDE_FILE_PATH/CLAUDE_TOOL_INPUT env vars. Phase 1 builds the utilities; Phase 2 migrates hooks.
- **Async stdin reading:** Hooks are synchronous command scripts. Using process.stdin streams adds unnecessary complexity and race conditions.
- **Placing additionalContext at top level:** For most events, additionalContext goes inside hookSpecificOutput. Only PostToolUse and Stop use top-level `decision`/`reason` fields.
- **Forgetting hookEventName:** The hookSpecificOutput object requires hookEventName to match the event name, or Claude Code ignores the output.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML parsing | Full YAML parser | Regex-based extractors scoped to known schemas | Zero-dependency constraint; project YAML files have fixed, simple schemas |
| JSON schema validation | Input validation library | Property checks with fallback defaults | Hooks must be fast; full validation is overkill for known input shapes |
| Cross-platform path joining | Manual string concatenation | path.join() / path.resolve() | Handles Windows backslashes vs Unix forward slashes |
| Stdin reading | Manual buffer accumulation | fs.readFileSync(0, 'utf8') | Single call handles all platforms; try/catch covers edge cases |

**Key insight:** The YAML files in this project have fixed, predictable schemas (registry.yaml, graph.yaml, chains.yaml). Regex extraction is correct and sufficient -- a full YAML parser would be dependency bloat.

## Common Pitfalls

### Pitfall 1: Windows EOF Error on Empty Stdin
**What goes wrong:** `fs.readFileSync(0, 'utf8')` throws `Error: EOF` on Windows when stdin pipe is empty or closed, instead of returning empty string
**Why it happens:** libuv on Windows treats ERROR_BROKEN_PIPE as fatal instead of EOF
**How to avoid:** Wrap in try/catch, return `{}` on any error. This is already the decided behavior per CONTEXT.md.
**Warning signs:** Tests pass on Linux/macOS but fail on Windows CI

### Pitfall 2: stdout Pollution Breaking JSON Parsing
**What goes wrong:** Claude Code fails to parse hook JSON output because non-JSON text is mixed into stdout
**Why it happens:** console.log() statements, shell profile output, or debug logging writes to stdout
**How to avoid:** Only write the final JSON.stringify result to stdout. Use process.stderr.write() for debug logging. Hooks spec states "stdout must contain only the JSON object."
**Warning signs:** Hook output silently ignored by Claude Code; no visible error

### Pitfall 3: Missing hookEventName in Output
**What goes wrong:** Claude Code ignores hookSpecificOutput because hookEventName is missing or mismatched
**Why it happens:** Developer forgets to include hookEventName or hardcodes wrong event name
**How to avoid:** buildOutput() auto-detects from input.hook_event_name, with manual override option
**Warning signs:** Hook runs but Claude doesn't see additionalContext

### Pitfall 4: Regex Extraction Order Sensitivity in YAML
**What goes wrong:** parseGraphEdges() or extractRegistrySkills() returns wrong results when YAML structure changes slightly
**Why it happens:** Regex assumes specific indentation or field ordering that may vary
**How to avoid:** Use the exact same regex patterns already proven across the codebase (3 independent implementations agree on format). Test with edge cases: empty files, single entries, many entries.
**Warning signs:** validate.js finds inconsistencies that build-registry.js doesn't

### Pitfall 5: Forgetting ${CLAUDE_PLUGIN_ROOT} in Hook Commands
**What goes wrong:** Hook scripts fail to find because bare relative paths don't resolve from the plugin cache directory
**Why it happens:** Plugins are cached to ~/.claude/plugins/cache, so relative paths from the original directory break
**How to avoid:** All command paths in hooks.json must use `${CLAUDE_PLUGIN_ROOT}/hooks/script.js`
**Warning signs:** Works in development (`claude --plugin-dir .`) but breaks when installed from marketplace

## Code Examples

Verified patterns from official sources and existing codebase:

### readStdinJSON Implementation
```javascript
// Source: Claude Code hooks spec + existing ontology_sync.js findProjectRoot pattern
"use strict";
const fs = require("fs");

/**
 * Read JSON from stdin (fd 0) synchronously.
 * Returns parsed object, or {} on empty/malformed input.
 * Cross-platform: handles Windows EOF error on empty pipe.
 */
function readStdinJSON() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
```

### buildOutput Implementation
```javascript
// Source: Claude Code hooks spec — hookSpecificOutput structure
/**
 * Build structured JSON output for Claude Code hook response.
 * Auto-detects hookEventName from stdin input; caller can override.
 * @param {Object} input - Parsed stdin JSON (from readStdinJSON)
 * @param {Object} fields - Fields to include in hookSpecificOutput
 * @returns {Object} Complete hook output object
 */
function buildOutput(input, fields = {}) {
  const hookEventName = fields.hookEventName || input.hook_event_name || "PostToolUse";
  const result = {
    hookSpecificOutput: {
      hookEventName,
    },
  };
  // Copy event-specific fields into hookSpecificOutput
  for (const [key, value] of Object.entries(fields)) {
    if (key !== "hookEventName") {
      result.hookSpecificOutput[key] = value;
    }
  }
  return result;
}
```

### resolveProjectRoot Implementation
```javascript
// Source: Existing ontology_sync.js findProjectRoot() pattern
const path = require("path");

/**
 * Resolve project root directory.
 * Checks CLAUDE_PROJECT_DIR env var first, then cwd.
 * @returns {string} Absolute path to project root
 */
function resolveProjectRoot() {
  if (process.env.CLAUDE_PROJECT_DIR) {
    return path.resolve(process.env.CLAUDE_PROJECT_DIR);
  }
  return path.resolve(process.cwd());
}
```

### parseGraphEdges (extract from generate-graph.js)
```javascript
// Source: Existing generate-graph.js parseGraphEdges() — proven across 69 tests
/**
 * Parse graph.yaml content into edge objects.
 * @param {string} content - Raw graph.yaml content
 * @returns {{ from: string, to: string, type: string, strength: number, note: string }[]}
 */
function parseGraphEdges(content) {
  const edges = [];
  let current = null;
  for (const line of content.split("\n")) {
    if (line.match(/^\s*- from:/)) {
      if (current) edges.push(current);
      current = { from: line.match(/from:\s*(\S+)/)[1] };
    } else if (current) {
      const toMatch = line.match(/^\s+to:\s*(\S+)/);
      if (toMatch) current.to = toMatch[1];
      const typeMatch = line.match(/^\s+type:\s*(\S+)/);
      if (typeMatch) current.type = typeMatch[1];
      const strMatch = line.match(/^\s+strength:\s*(\d+)/);
      if (strMatch) current.strength = parseInt(strMatch[1], 10);
      const noteMatch = line.match(/^\s+note:\s*"?([^"]*)"?/);
      if (noteMatch) current.note = noteMatch[1];
    }
  }
  if (current) edges.push(current);
  return edges.map((e) => ({
    ...e,
    strength: e.strength || 50,
    type: e.type || "complementary",
    note: e.note || "",
  }));
}
```

### extractRegistrySkills (extract from validate.js)
```javascript
// Source: Existing validate.js extractRegistrySkills() — duplicated in ontology_sync.js
/**
 * Extract skill names from registry.yaml content.
 * Matches top-level skill entries (2-space indented keys).
 * @param {string} content - Raw registry.yaml content
 * @returns {string[]} Sorted array of skill names
 */
function extractRegistrySkills(content) {
  const matches = content.match(/^ {2}[a-z][a-z0-9-]*:$/gm);
  return (matches || []).map((m) => m.trim().replace(":", "")).sort();
}
```

### Updated hooks.json Structure
```json
{
  "description": "Skills Ontology hooks for drift detection and skill tracking",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js",
            "timeout": 15,
            "statusMessage": "Skills Ontology: Checking registry for drift..."
          }
        ]
      },
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/ontology_track_skill.js",
            "timeout": 15,
            "statusMessage": "Skills Ontology: Tracking skill usage..."
          }
        ]
      }
    ]
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Env vars (CLAUDE_FILE_PATH, CLAUDE_TOOL_INPUT) | Stdin JSON with structured fields | Claude Code hooks spec (current) | All hook input now comes via stdin JSON |
| console.log() plain text output | JSON stdout with hookSpecificOutput | Claude Code hooks spec (current) | Structured output enables additionalContext, decision control |
| Bare relative paths in hooks.json | ${CLAUDE_PLUGIN_ROOT}/path | Plugin spec (current) | Paths resolve correctly from plugin cache |
| No description/timeout/statusMessage | All three fields supported | Plugin hooks spec (current) | Better UX and timeout control |
| Top-level decision for PreToolUse | hookSpecificOutput.permissionDecision | Current spec (top-level deprecated) | PreToolUse uses hookSpecificOutput exclusively |

**Deprecated/outdated:**
- CLAUDE_FILE_PATH, CLAUDE_TOOL_INPUT, CLAUDE_TOOL_RESPONSE env vars: replaced by stdin JSON input
- Top-level `decision`/`reason` for PreToolUse: deprecated in favor of hookSpecificOutput.permissionDecision
- Plain text stdout from hooks: still works for SessionStart/UserPromptSubmit context, but JSON is preferred for structured control

## Open Questions

1. **parseGraphEdges deduplication strategy**
   - What we know: Three identical implementations exist (generate-graph.js, adjust-strengths.js, validate.js). yaml-helpers.js should be the single source.
   - What's unclear: Whether to update generate-graph.js and adjust-strengths.js to use yaml-helpers.js in Phase 1, or defer that refactoring.
   - Recommendation: Phase 1 creates yaml-helpers.js with the canonical implementations. Phase 2 can refactor src/ files to use it. The CONTEXT.md specifically mentions src/build-registry.js using `require('../hooks/yaml-helpers')`, so at minimum that cross-reference path should work.

2. **PostToolUse output format: top-level vs hookSpecificOutput**
   - What we know: The hooks spec shows PostToolUse uses top-level `decision`/`reason` AND hookSpecificOutput with additionalContext. Both patterns are valid.
   - What's unclear: Whether buildOutput() should always use hookSpecificOutput wrapper, or support top-level fields too.
   - Recommendation: buildOutput() always wraps in hookSpecificOutput (consistent pattern). For PostToolUse decision/reason, those go at top level alongside hookSpecificOutput per the spec example.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (built-in, Node 18+) |
| Config file | none -- uses npm script |
| Quick run command | `node --test test/hook-utils.test.js test/yaml-helpers.test.js` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | readStdinJSON parses valid JSON from stdin | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-01 | readStdinJSON returns {} on empty stdin | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-01 | readStdinJSON returns {} on malformed JSON | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-01 | buildOutput constructs hookSpecificOutput with hookEventName | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-01 | buildOutput auto-detects hookEventName from input | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-01 | resolveProjectRoot returns cwd when no env var | unit | `node --test test/hook-utils.test.js` | Wave 0 |
| INFRA-02 | parseGraphEdges extracts edges from graph.yaml content | unit | `node --test test/yaml-helpers.test.js` | Wave 0 |
| INFRA-02 | parseGraphEdges returns [] for empty/no edges | unit | `node --test test/yaml-helpers.test.js` | Wave 0 |
| INFRA-02 | extractRegistrySkills extracts skill names from registry.yaml | unit | `node --test test/yaml-helpers.test.js` | Wave 0 |
| INFRA-02 | extractRegistrySkills returns [] for empty registry | unit | `node --test test/yaml-helpers.test.js` | Wave 0 |
| INFRA-03 | hooks.json has statusMessage for every hook entry | unit | `node --test test/plugin-standard.test.js` | Extend existing |
| SPEC-03 | hooks.json commands use ${CLAUDE_PLUGIN_ROOT} | unit | `node --test test/plugin-standard.test.js` | Extend existing |
| SPEC-04 | hooks.json has top-level description field | unit | `node --test test/plugin-standard.test.js` | Extend existing |
| SPEC-05 | hooks.json has timeout for every hook entry | unit | `node --test test/plugin-standard.test.js` | Extend existing |

### Sampling Rate
- **Per task commit:** `node --test test/hook-utils.test.js test/yaml-helpers.test.js`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `test/hook-utils.test.js` -- covers INFRA-01 (readStdinJSON, buildOutput, resolveProjectRoot)
- [ ] `test/yaml-helpers.test.js` -- covers INFRA-02 (parseGraphEdges, extractRegistrySkills)
- [ ] Extend `test/plugin-standard.test.js` -- covers INFRA-03, SPEC-03, SPEC-04, SPEC-05 (hooks.json validation)

*(No framework install needed -- node:test is built-in)*

## Sources

### Primary (HIGH confidence)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) -- full hooks spec including stdin JSON input schema, JSON output format with hookSpecificOutput, exit code behavior, timeout/statusMessage/description fields, all event types
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference) -- plugin hooks.json format, ${CLAUDE_PLUGIN_ROOT} usage, plugin manifest schema, hook configuration in plugins
- Existing codebase: hooks/ontology_sync.js, hooks/ontology_track_skill.js, src/generate-graph.js, src/validate.js, src/adjust-strengths.js -- verified YAML parsing patterns and project root resolution

### Secondary (MEDIUM confidence)
- [Node.js fs.readSync EOF on Windows (issue #35997)](https://github.com/nodejs/node/issues/35997) -- Windows fd 0 EOF error behavior; closed July 2024, likely fixed in Node 18+ but try/catch is still defensive best practice
- [Node.js stdin fd 0 on Windows (issue #19831)](https://github.com/nodejs/node/issues/19831) -- additional Windows stdin edge cases

### Tertiary (LOW confidence)
- None -- all findings verified against official documentation or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero dependencies, stdlib only, all already used in project
- Architecture: HIGH -- patterns extracted from existing working code; hooks spec thoroughly documented
- Pitfalls: HIGH -- Windows fd 0 issue verified via Node.js issue tracker; stdout pollution documented in hooks spec; hookEventName requirement confirmed in spec

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable -- stdlib and hooks spec unlikely to change)
