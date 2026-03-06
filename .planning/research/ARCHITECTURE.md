# Architecture Patterns

**Domain:** Claude Code plugin hooks alignment
**Researched:** 2026-03-06

## Recommended Architecture

Restructure the hooks layer into a three-tier design: a shared infrastructure module (`hooks/lib/hook-utils.js`), individual hook handler modules in `hooks/handlers/`, and thin entry-point scripts in `hooks/` that wire the two together. The entry points are what `hooks.json` references; each reads stdin, delegates to a handler, and writes JSON to stdout.

```
hooks/
  hooks.json                        # Hook configuration (references entry scripts)
  lib/
    hook-utils.js                   # Shared: stdin reader, JSON output builder, project root resolver
  handlers/
    sync-handler.js                 # Drift detection logic (pure function)
    track-handler.js                # Skill tracking logic (pure function)
    session-start-handler.js        # Ontology context injection (pure function)
    pre-skill-handler.js            # Pre-skill routing info (pure function)
    stop-handler.js                 # Usage log reminder (pure function)
  ontology_sync.js                  # Entry: stdin -> sync-handler -> JSON stdout
  ontology_track_skill.js           # Entry: stdin -> track-handler -> JSON stdout
  ontology_session_start.js         # Entry: stdin -> session-start-handler -> JSON stdout
  ontology_pre_skill.js             # Entry: stdin -> pre-skill-handler -> JSON stdout
  ontology_stop.js                  # Entry: stdin -> stop-handler -> JSON stdout
```

### Why This Structure

1. **Testability.** Handler modules export pure functions that accept parsed input objects and return output objects. No stdin/stdout coupling. Tests call handlers directly with mock input.

2. **Single stdin implementation.** The `readStdinJSON()` utility lives in one place. Every entry script uses it. No duplication, no divergence, one place to fix cross-platform issues.

3. **Spec-compliant output.** The `buildOutput()` utility constructs the exact JSON structure the hooks spec expects (`hookSpecificOutput`, `additionalContext`, `decision`, exit codes). Handlers return semantic objects; the utility serializes them correctly.

4. **Backward compatibility.** The entry-point filenames (`ontology_sync.js`, `ontology_track_skill.js`) can stay the same for existing hooks. New hooks get new files. `hooks.json` paths update to use `${CLAUDE_PLUGIN_ROOT}`.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `hooks/lib/hook-utils.js` | Read stdin JSON, resolve project root from `cwd` field, build spec-compliant JSON output, handle exit codes | All entry scripts import it |
| `hooks/handlers/sync-handler.js` | Compare skills dirs vs registry, detect token/version drift | Core: reads ontology files from disk using paths derived from `cwd` |
| `hooks/handlers/track-handler.js` | Track skill invocations per session, count unique skills | Writes session tracker file (keyed by `session_id`) |
| `hooks/handlers/session-start-handler.js` | Load ontology summary, build routing context string | Core: reads registry.yaml, graph.yaml, chains.yaml |
| `hooks/handlers/pre-skill-handler.js` | Look up skill prerequisites and routing info | Core: reads graph.yaml for prerequisite edges |
| `hooks/handlers/stop-handler.js` | Check if session used skills, remind about usage-log | Reads session tracker file (keyed by `session_id`) |
| `hooks/hooks.json` | Declare all hook event/matcher/handler bindings | References entry scripts via `${CLAUDE_PLUGIN_ROOT}` |
| Entry scripts (5 files) | Wire stdin -> handler -> stdout | Import hook-utils.js and their handler module |

## Data Flow

### Flow 1: PostToolUse on Write|Edit (Drift Detection)

```
Claude Code writes/edits a file
    |
    v
PostToolUse event fires, matcher "Write|Edit" matches
    |
    v
hooks/ontology_sync.js starts
    |
    v
hook-utils.readStdinJSON() reads:
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path/to/project/.claude/skills/my-skill/SKILL.md", "content": "..." },
  "tool_response": { "filePath": "...", "success": true }
}
    |
    v
sync-handler.handle(input) receives parsed object:
  1. Resolves projectRoot from input.cwd
  2. Reads registry.yaml from {projectRoot}/.claude/ontology/
  3. Reads skills dirs from {projectRoot}/.claude/skills/
  4. Compares: new skills, removed skills
  5. If tool_input.file_path is a skill file: checks token estimate drift, version drift
  6. Returns { additionalContext: "ONTOLOGY-DRIFT: ...", decision: null }
    |
    v
Entry script calls hook-utils.writeOutput():
  - If drift detected: outputs JSON with additionalContext string
  - If no drift: exits 0 with no output
    |
    v
Claude Code receives additionalContext -> injected into Claude's context
```

**Key change from current:** Instead of `console.log("ONTOLOGY-DRIFT: ...")` (which only shows in verbose mode for PostToolUse), the handler returns structured JSON with `additionalContext` that Claude actually sees and can act on. This is the single most impactful improvement.

### Flow 2: PostToolUse on Skill (Usage Tracking)

```
Claude invokes a Skill tool
    |
    v
PostToolUse event fires, matcher "Skill" matches
    |
    v
hooks/ontology_track_skill.js starts
    |
    v
hook-utils.readStdinJSON() reads:
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "tool_name": "Skill",
  "tool_input": { "skill_name": "my-skill", ... },
  "tool_response": { ... }
}
    |
    v
track-handler.handle(input) receives parsed object:
  1. Extracts skill name from input.tool_input.skill_name (no more regex on env var)
  2. Computes session-scoped tracker path: os.tmpdir()/claude-ontology-{session_id}.yaml
  3. Appends skill + timestamp
  4. Reads tracker, counts unique skills
  5. Returns { additionalContext: "..." } if 2+ skills, else null
    |
    v
Entry script calls hook-utils.writeOutput()
```

**Key change:** Session isolation via `session_id` from stdin JSON. No more shared global temp file collision.

### Flow 3: SessionStart (Context Injection) -- NEW

```
Claude Code session starts
    |
    v
SessionStart event fires (no matcher needed, or matcher "startup")
    |
    v
hooks/ontology_session_start.js starts
    |
    v
hook-utils.readStdinJSON() reads:
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "SessionStart",
  "source": "startup",
  "model": "claude-sonnet-4-6"
}
    |
    v
session-start-handler.handle(input):
  1. Resolves project root from input.cwd
  2. Checks if .claude/ontology/registry.yaml exists
  3. If exists: reads registry, graph, chains; builds a compact routing summary
  4. Returns {
       hookSpecificOutput: {
         hookEventName: "SessionStart",
         additionalContext: "Skills Ontology Context:\n- 15 skills indexed...\n- Key chains: ..."
       }
     }
  5. If no ontology exists: returns null (exit 0, no output)
    |
    v
Entry script calls hook-utils.writeOutput()
    |
    v
Claude Code injects additionalContext into Claude's context at session start
```

**Impact:** Claude starts every session aware of available skills, chains, and routing info without needing rules to repeat it.

### Flow 4: PreToolUse on Skill (Routing Info) -- NEW

```
Claude is about to invoke a Skill tool
    |
    v
PreToolUse event fires, matcher "Skill" matches
    |
    v
hooks/ontology_pre_skill.js starts
    |
    v
hook-utils.readStdinJSON() reads:
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "PreToolUse",
  "tool_name": "Skill",
  "tool_input": { "skill_name": "my-skill" }
}
    |
    v
pre-skill-handler.handle(input):
  1. Reads graph.yaml for edges where from/to = skill_name
  2. Finds prerequisite edges: "You should use X before this skill"
  3. Finds complementary edges: "Consider also using Y"
  4. Returns {
       hookSpecificOutput: {
         hookEventName: "PreToolUse",
         permissionDecision: "allow",
         additionalContext: "Skill prerequisites: [X]. Related skills: [Y, Z]."
       }
     }
    |
    v
Entry script calls hook-utils.writeOutput()
    |
    v
Claude sees prerequisite/routing info before skill executes
```

**Design note:** Uses `permissionDecision: "allow"` -- never blocks skill execution, only injects context. The hook spec requires `hookSpecificOutput` with `hookEventName: "PreToolUse"` for PreToolUse events.

### Flow 5: Stop (Usage Log Reminder) -- NEW

```
Claude finishes responding
    |
    v
Stop event fires (no matcher support)
    |
    v
hooks/ontology_stop.js starts
    |
    v
hook-utils.readStdinJSON() reads:
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "Stop",
  "stop_hook_active": false,
  "last_assistant_message": "..."
}
    |
    v
stop-handler.handle(input):
  1. If stop_hook_active is true: return null (avoid infinite loops)
  2. Reads session tracker file for this session_id
  3. If 2+ skills were used: return { decision: "block", reason: "..." }
     asking Claude to log usage outcomes to usage-log.yaml
  4. If no skills used or <2 unique skills: return null
    |
    v
Entry script calls hook-utils.writeOutput()
```

**Design decision:** The Stop hook uses `decision: "block"` with a `reason` to prevent Claude from stopping before logging outcomes. The `reason` is shown to Claude, telling it to append usage data. The `stop_hook_active` guard prevents re-triggering.

## Patterns to Follow

### Pattern 1: Shared Stdin Reader

**What:** A single `readStdinJSON()` function that all hooks use to read and parse stdin.

**When:** Every hook entry script.

**Why:** Cross-platform stdin reading in Node.js without dependencies requires care. On Windows, `/dev/stdin` does not exist. The `process.stdin` stream API works everywhere but needs proper buffering. Having one implementation means one place to fix issues.

**Implementation:**

```javascript
"use strict";

/**
 * Read all of stdin synchronously and parse as JSON.
 * Works cross-platform (Linux, macOS, Windows).
 * @returns {Object} Parsed JSON input from Claude Code
 */
function readStdinJSON() {
  const fs = require("fs");
  try {
    // fd 0 = stdin, works cross-platform unlike /dev/stdin
    const input = fs.readFileSync(0, "utf-8").trim();
    if (!input) return {};
    return JSON.parse(input);
  } catch (e) {
    // If stdin is empty or not JSON, return empty object
    return {};
  }
}
```

**Key detail:** Uses `fs.readFileSync(0, "utf-8")` -- reading file descriptor 0 directly. This works on Windows, Linux, and macOS. Do NOT use `fs.readFileSync("/dev/stdin")` which fails on Windows.

### Pattern 2: Structured JSON Output Builder

**What:** Helper functions that construct spec-compliant JSON output for different hook events.

**When:** Every hook handler needs to return output to Claude Code.

**Implementation:**

```javascript
/**
 * Build output JSON for a PostToolUse hook.
 * @param {Object} opts
 * @param {string} [opts.additionalContext] - Context for Claude
 * @param {string} [opts.decision] - "block" or omit
 * @param {string} [opts.reason] - Required when decision is "block"
 * @returns {Object|null} JSON to write to stdout, or null for no output
 */
function buildPostToolUseOutput(opts) {
  if (!opts.additionalContext && !opts.decision) return null;
  const result = {};
  if (opts.decision) {
    result.decision = opts.decision;
    result.reason = opts.reason || "";
  }
  if (opts.additionalContext) {
    result.hookSpecificOutput = {
      hookEventName: "PostToolUse",
      additionalContext: opts.additionalContext,
    };
  }
  return result;
}

/**
 * Build output JSON for a SessionStart hook.
 * @param {string} additionalContext - Context string for Claude
 * @returns {Object|null}
 */
function buildSessionStartOutput(additionalContext) {
  if (!additionalContext) return null;
  return {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  };
}

/**
 * Build output JSON for a PreToolUse hook.
 * @param {Object} opts
 * @param {string} [opts.additionalContext]
 * @param {string} [opts.permissionDecision] - "allow", "deny", or "ask"
 * @param {string} [opts.permissionDecisionReason]
 * @returns {Object|null}
 */
function buildPreToolUseOutput(opts) {
  if (!opts.additionalContext && !opts.permissionDecision) return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: opts.permissionDecision || "allow",
      permissionDecisionReason: opts.permissionDecisionReason || "",
      additionalContext: opts.additionalContext || "",
    },
  };
}

/**
 * Build output JSON for a Stop hook.
 * @param {Object} opts
 * @param {string} [opts.decision] - "block" or omit
 * @param {string} [opts.reason]
 * @returns {Object|null}
 */
function buildStopOutput(opts) {
  if (!opts.decision) return null;
  return {
    decision: opts.decision,
    reason: opts.reason || "",
  };
}

/**
 * Write output to stdout and exit.
 * If output is null, exits 0 silently (allow action).
 * @param {Object|null} output
 * @param {number} [exitCode=0]
 */
function writeOutput(output, exitCode = 0) {
  if (output) {
    process.stdout.write(JSON.stringify(output) + "\n");
  }
  process.exit(exitCode);
}
```

### Pattern 3: Handler as Pure Function

**What:** Each handler module exports a single `handle(input)` function that takes parsed stdin JSON and returns an output object (or null). No side effects on stdout/stderr. Side effects on disk (tracker file) are passed through a file-system interface parameter for testability.

**When:** All hook logic.

**Example:**

```javascript
// hooks/handlers/sync-handler.js
"use strict";
const fs = require("fs");
const path = require("path");

/**
 * @param {Object} input - Parsed stdin JSON from Claude Code
 * @returns {{ additionalContext: string }|null}
 */
function handle(input) {
  const root = input.cwd || process.cwd();
  const registry = path.join(root, ".claude", "ontology", "registry.yaml");
  const skillsDir = path.join(root, ".claude", "skills");

  if (!fs.existsSync(registry) || !fs.existsSync(skillsDir)) return null;

  const messages = [];

  // ... drift detection logic (moved from current ontology_sync.js) ...

  if (messages.length === 0) return null;
  return { additionalContext: messages.join("\n") };
}

module.exports = { handle };
```

### Pattern 4: Thin Entry Script

**What:** Entry scripts are 5-10 lines that glue stdin reading to handler to output writing.

**When:** Every hook entry point.

**Example:**

```javascript
#!/usr/bin/env node
"use strict";
const { readStdinJSON, buildPostToolUseOutput, writeOutput } = require("./lib/hook-utils");
const { handle } = require("./handlers/sync-handler");

const input = readStdinJSON();
const result = handle(input);
const output = result ? buildPostToolUseOutput(result) : null;
writeOutput(output);
```

This pattern means the entry script has zero business logic. All logic lives in the handler. All I/O protocol lives in hook-utils.

### Pattern 5: Project Root from stdin.cwd

**What:** Use `input.cwd` from stdin JSON as the project root instead of env vars or `process.cwd()`.

**When:** Always. The `cwd` field is guaranteed by the hooks spec to be the current working directory when the hook was invoked, which for plugin hooks is the project root.

**Why this replaces `findProjectRoot()`:** The current `findProjectRoot()` tries `CLAUDE_PROJECT_DIR` env var, then `process.cwd()`, then falls back. The stdin JSON `cwd` field is the authoritative source per the official spec. The env var `CLAUDE_PROJECT_DIR` is not part of the official hooks input spec (it is a separate env var for `$CLAUDE_PROJECT_DIR` path references in command strings, not for stdin input).

```javascript
function resolveProjectRoot(input) {
  return input.cwd || process.cwd();
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Reading Environment Variables for Hook Input

**What:** Using `process.env.CLAUDE_FILE_PATH`, `process.env.CLAUDE_TOOL_INPUT`, `process.env.CLAUDE_PROJECT_DIR` to get hook event data.

**Why bad:** These are not part of the official hooks specification. The official spec delivers all context via stdin JSON. Env vars may work in some cases but are undocumented/legacy and may be removed. The stdin JSON provides richer data (session_id, tool_response, cwd, permission_mode) that env vars never had.

**Instead:** Read stdin JSON. Use `input.tool_input` for tool arguments, `input.tool_input.file_path` for the changed file path, `input.cwd` for the project root.

### Anti-Pattern 2: console.log() as Hook Output

**What:** Using `console.log("ONTOLOGY-DRIFT: ...")` to communicate with Claude.

**Why bad:** For PostToolUse hooks, stdout text is only visible in verbose mode (`Ctrl+O`). Claude does not see it. The `additionalContext` field in JSON output is what gets injected into Claude's actual context. The current hooks are essentially invisible to Claude for PostToolUse events.

**Instead:** Return structured JSON with `additionalContext` for information Claude should act on. Use `decision: "block"` with `reason` when Claude should take corrective action.

### Anti-Pattern 3: Shared Global Temp File

**What:** Using `os.tmpdir() + '/claude-ontology-session.yaml'` for session tracking without session isolation.

**Why bad:** Multiple concurrent Claude sessions share the same file. Skills from different sessions get mixed. The file grows without bound.

**Instead:** Key temp files by `session_id` from stdin JSON: `os.tmpdir() + '/claude-ontology-' + input.session_id + '.yaml'`. Each session gets its own file. The Stop/SessionEnd hook can clean up.

### Anti-Pattern 4: Bare Script Paths in hooks.json

**What:** Using `"command": "node hooks/ontology_sync.js"` in hooks.json.

**Why bad:** This path is resolved relative to the working directory when Claude Code invokes the hook, which may not be the plugin root. If the user's project has a different cwd, the path breaks.

**Instead:** Use `"command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js\""`. The `${CLAUDE_PLUGIN_ROOT}` variable is resolved by Claude Code to the plugin's root directory.

## Updated hooks.json Configuration

```json
{
  "description": "Skills Ontology — automatic skill tracking, drift detection, and routing",
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_session_start.js\"",
            "timeout": 10,
            "statusMessage": "Loading ontology context..."
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_pre_skill.js\"",
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
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_sync.js\"",
            "timeout": 10,
            "statusMessage": "Checking ontology drift..."
          }
        ]
      },
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_track_skill.js\"",
            "timeout": 5,
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
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_stop.js\"",
            "timeout": 5,
            "statusMessage": "Checking skill usage log..."
          }
        ]
      }
    ]
  }
}
```

## Relationship to Existing Core Modules

The hooks layer reads ontology files but does NOT import core modules directly. This is intentional.

**Why hooks should NOT require() core modules:**

1. **Core modules are CLI-oriented.** They write files, print to console, return exit codes. Hook handlers need to read files and return data structures. The interfaces are different.

2. **Coupling risk.** If hooks import `src/build-registry.js`, changes to the build module's console output could break hook JSON output. Hooks need isolation.

3. **Shared YAML parsing is the exception.** The duplicated `extractRegistrySkills()` regex (used in both `validate.js` and `ontology_sync.js`) and `parseGraphEdges()` (duplicated in `generate-graph.js` and `adjust-strengths.js`) should be extracted into a shared module. But this shared module should be a data-parsing utility, not a hook-specific module.

**Recommended shared parsing module:** `src/yaml-helpers.js`

```
src/yaml-helpers.js
  - extractRegistrySkills(content)  -- regex extraction of skill names from registry.yaml
  - parseGraphEdges(content)        -- parse edges from graph.yaml
  - parseRegistryEntry(content, skillName)  -- extract single skill's metadata
```

Both core modules (`src/validate.js`, `src/adjust-strengths.js`, `src/generate-graph.js`) and hook handlers (`handlers/sync-handler.js`, `handlers/pre-skill-handler.js`, `handlers/session-start-handler.js`) import from this shared module.

## Suggested Build Order

Dependencies flow downward. Build in this order:

```
Phase 1: Foundation
  hooks/lib/hook-utils.js        -- readStdinJSON, output builders, resolveProjectRoot
  src/yaml-helpers.js            -- extract shared YAML parsing from core modules
  hooks.json                     -- update config with ${CLAUDE_PLUGIN_ROOT}, description, timeouts

Phase 2: Migrate Existing Hooks
  hooks/handlers/sync-handler.js     -- extract logic from ontology_sync.js
  hooks/handlers/track-handler.js    -- extract logic from ontology_track_skill.js
  hooks/ontology_sync.js             -- rewrite as thin entry script
  hooks/ontology_track_skill.js      -- rewrite as thin entry script
  (Tests for handlers + hook-utils)

Phase 3: Add New Hooks
  hooks/handlers/session-start-handler.js   -- new: ontology context injection
  hooks/ontology_session_start.js           -- new: entry script
  hooks/handlers/pre-skill-handler.js       -- new: skill routing info
  hooks/ontology_pre_skill.js               -- new: entry script
  hooks/handlers/stop-handler.js            -- new: usage log reminder
  hooks/ontology_stop.js                    -- new: entry script
  (Tests for new handlers)

Phase 4: Integration
  Update existing tests for new stdin-based mechanism
  Integration test: full hook lifecycle simulation
  Clean up: remove env var references from code
```

**Phase 1 has no external dependencies** -- it creates the shared utilities that everything else needs.

**Phase 2 is the migration** -- existing hooks get restructured without changing behavior (except input/output mechanism). Existing tests must be updated to test handlers directly with mock input objects instead of setting env vars.

**Phase 3 is additive** -- new hooks that follow the pattern established in Phases 1-2. No risk to existing functionality.

**Phase 4 is cleanup** -- integration testing and removal of legacy env var code.

## Scalability Considerations

| Concern | Current (2 hooks) | At 5 hooks | At 10+ hooks |
|---------|-------------------|------------|--------------|
| Code duplication | High (each hook rolls its own stdin/output) | Eliminated by hook-utils.js | Stays eliminated |
| Stdin parsing bugs | Risk in each hook | One implementation | One implementation |
| Test surface | Must test stdin piping for each hook | Test handlers as pure functions | Same pattern scales |
| hooks.json complexity | Simple | Manageable | Consider splitting matchers for readability |
| Session tracker files | One global file (collides) | Per-session files via session_id | Same, with cleanup in SessionEnd |

## Sources

- [Hooks reference - Claude Code Docs](https://code.claude.com/docs/en/hooks) -- HIGH confidence. Official specification. All input schemas, output formats, event types, exit codes, and configuration verified against this document.
- [Claude Code power user customization: How to configure hooks](https://claude.com/blog/how-to-configure-hooks) -- MEDIUM confidence. Blog post with examples, consistent with official docs.
- [Claude Code Hooks Complete Guide (February 2026 Edition)](https://smartscope.blog/en/generative-ai/claude/claude-code-hooks-guide/) -- LOW confidence. Third-party guide, used only for cross-referencing community patterns.

---

*Architecture research: 2026-03-06*
