# Technology Stack: Claude Code Hook Scripts (Node.js, Zero Dependencies)

**Project:** Skills Ontology Plugin -- Hooks Spec Alignment
**Researched:** 2026-03-06
**Focus:** stdin JSON reading, structured JSON output, environment variables, cross-platform

## Recommended Stack

### Core Runtime

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | >= 18 | Hook script runtime | Already the project minimum; all hooks use `#!/usr/bin/env node` |
| CommonJS | N/A | Module format | Project convention; broadest compat, no build step |

### Stdin Reading Pattern

| Approach | Use | Why |
|----------|-----|-----|
| `fs.readFileSync(0, 'utf8')` | Primary stdin reader | Synchronous, zero-dependency, works for piped input on all platforms Node 18+ |
| `fs.readSync` loop (fallback) | Only if readFileSync fails | Buffer-based loop with EAGAIN/EOF catch; handles edge cases on older Windows |

### JSON Output Pattern

| Approach | Use | Why |
|----------|-----|-----|
| `JSON.stringify()` to stdout | All hook responses | Official spec requires clean JSON on stdout; `process.stdout.write()` avoids trailing newline issues |
| `process.exitCode = N` | Exit code signaling | Cleaner than `process.exit(N)`; lets event loop drain |

### Environment Variables

| Variable | Purpose | When Available |
|----------|---------|----------------|
| `${CLAUDE_PLUGIN_ROOT}` | Plugin root directory path | Always; use in hooks.json `command` fields |
| `$CLAUDE_PROJECT_DIR` | User's project root | Always; available in hook process environment |
| `$CLAUDE_ENV_FILE` | Path for persisting env vars | SessionStart hooks only |
| `$CLAUDE_CODE_REMOTE` | `"true"` in web environments | Always; check for remote vs local context |

## The Correct Stdin Reading Pattern

**Confidence: HIGH** -- Verified against official Claude Code docs, Node.js docs, and real-world hook implementations.

### How Claude Code Delivers Input

Claude Code pipes JSON to the hook script's stdin. This is NOT interactive terminal input -- it is piped data. The pipe closes when all data is written. This matters because piped stdin behaves differently from interactive TTY stdin.

### Recommended: `fs.readFileSync(0, 'utf8')`

```javascript
#!/usr/bin/env node
"use strict";

const fs = require("fs");

// Read all stdin synchronously. File descriptor 0 = stdin.
// This works cross-platform when stdin is piped (not TTY),
// which is always the case for Claude Code hooks.
let input;
try {
  input = fs.readFileSync(0, "utf8");
} catch (err) {
  // If stdin is empty or closed, treat as no input
  input = "";
}

let hookData = {};
if (input.trim()) {
  try {
    hookData = JSON.parse(input);
  } catch (err) {
    // Invalid JSON -- log to stderr (shown in verbose mode only)
    process.stderr.write(`Hook: invalid JSON on stdin: ${err.message}\n`);
    process.exitCode = 1;
    return;
  }
}

// Access fields from hookData
const sessionId = hookData.session_id || "";
const cwd = hookData.cwd || process.cwd();
const toolName = hookData.tool_name || "";
const toolInput = hookData.tool_input || {};
const toolResponse = hookData.tool_response || {};
const hookEventName = hookData.hook_event_name || "";
```

### Why `fs.readFileSync(0, 'utf8')` and NOT Alternatives

| Alternative | Why NOT |
|-------------|---------|
| `fs.readFileSync('/dev/stdin')` | Does not exist on Windows. Hard fail. |
| `process.stdin` stream events | Asynchronous; hook scripts need synchronous execution to be simple and predictable. Adds complexity with event listeners, Promises, or async/await for no benefit. |
| `readline` module | Designed for interactive line-by-line input, not bulk JSON parsing. Overkill and wrong abstraction. |
| Environment variables | **The current implementation uses this. It is wrong.** Official spec delivers data via stdin, not env vars. Env vars like `CLAUDE_FILE_PATH`, `CLAUDE_TOOL_INPUT` are undocumented/legacy and may be removed. |
| `child_process.execSync('cat')` | Spawning a child process to read stdin is absurd overhead. |

### Cross-Platform Stdin Behavior

**Confidence: MEDIUM-HIGH** -- Verified via Node.js issue tracker and community testing.

| Platform | `fs.readFileSync(0)` with piped input | Notes |
|----------|---------------------------------------|-------|
| Linux | Works correctly | No issues |
| macOS | Works correctly | No issues |
| Windows (piped) | Works correctly on Node 18+ | Claude Code always pipes; never interactive TTY |
| Windows (no pipe/TTY) | May throw EISDIR | Not relevant -- hooks always receive piped input |

The critical insight: Claude Code **always pipes** JSON to stdin. The Windows `EISDIR` error only occurs when stdin is not piped (interactive terminal mode), which never happens for Claude Code hooks. The `fs.readSync` EOF bug on Windows pipes (issue #35997) was fixed in libuv and shipped in Node.js releases.

### Defensive Fallback Pattern (if needed)

If `fs.readFileSync(0)` proves unreliable on some edge-case Windows configuration, this `fs.readSync` loop is the fallback:

```javascript
function readStdinSync() {
  const chunks = [];
  const buf = Buffer.alloc(65536);
  try {
    while (true) {
      const bytesRead = fs.readSync(0, buf, 0, buf.length);
      if (bytesRead === 0) break;
      chunks.push(buf.slice(0, bytesRead));
    }
  } catch (err) {
    // EAGAIN, EOF, or pipe closed -- expected at end of input
    if (err.code !== "EAGAIN" && err.code !== "EOF" && err.code !== "EPIPE") {
      throw err; // Unexpected error
    }
  }
  return Buffer.concat(chunks).toString("utf8");
}
```

**Use this only as a fallback.** The `readFileSync(0)` one-liner is preferred for simplicity.

## The Correct JSON Output Pattern

**Confidence: HIGH** -- Verified against official Claude Code hooks reference documentation.

### Exit Code Semantics

| Exit Code | Meaning | stdout behavior | stderr behavior |
|-----------|---------|-----------------|-----------------|
| 0 | Success | Parsed for JSON | Ignored |
| 2 | Blocking error | Ignored entirely | Fed to Claude as error message |
| Other | Non-blocking error | Ignored | Shown in verbose mode only |

### Output Rules

1. **stdout MUST contain ONLY the JSON object** -- no logging, no debug text, no shell profile noise
2. **Choose one approach per hook**: either exit codes alone, OR exit 0 + JSON output. Never mix.
3. **JSON is only processed on exit 0** -- if you exit 2, any JSON on stdout is ignored
4. `console.log()` adds a trailing newline which is fine for JSON output
5. `process.stdout.write()` gives more control but `console.log(JSON.stringify(obj))` works

### PostToolUse Output (for ontology_sync.js and ontology_track_skill.js)

The current hooks use `console.log("ONTOLOGY-DRIFT: ...")` which only shows in verbose mode. To inject context into Claude's actual conversation, return structured JSON:

```javascript
// PostToolUse -- provide feedback to Claude
function outputPostToolUse(additionalContext) {
  const output = {};
  if (additionalContext) {
    output.hookSpecificOutput = {
      hookEventName: "PostToolUse",
      additionalContext: additionalContext
    };
  }
  process.stdout.write(JSON.stringify(output));
  process.exitCode = 0;
}

// Example: drift detected
outputPostToolUse(
  "ONTOLOGY-DRIFT: New skill(s) not in registry: new-skill. " +
  "Run /ontology-build to update registry.yaml and suggest graph edges."
);
```

To signal a problem that should be shown to Claude (not just verbose mode):

```javascript
// PostToolUse -- block pattern (shows reason to Claude)
function outputPostToolUseBlock(reason) {
  const output = {
    decision: "block",
    reason: reason
  };
  process.stdout.write(JSON.stringify(output));
  process.exitCode = 0;
}
```

### SessionStart Output (for new session context hook)

```javascript
// SessionStart -- inject ontology context
function outputSessionStart(context) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context
    }
  };
  process.stdout.write(JSON.stringify(output));
  process.exitCode = 0;
}
```

### PreToolUse Output (for skill routing hook)

```javascript
// PreToolUse -- inject routing context (allow the tool call to proceed)
function outputPreToolUse(context) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "Skill routing context provided",
      additionalContext: context
    }
  };
  process.stdout.write(JSON.stringify(output));
  process.exitCode = 0;
}
```

### Stop Output (for usage log reminder)

```javascript
// Stop -- allow Claude to stop, but add context
function outputStop(reminderContext) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: reminderContext
    }
  };
  // Note: do NOT set decision: "block" unless you want to force continuation
  process.stdout.write(JSON.stringify(output));
  process.exitCode = 0;
}
```

## The Correct hooks.json Format

**Confidence: HIGH** -- Directly from official plugin reference documentation.

### Current Format (INCORRECT)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/ontology_sync.js"
          }
        ]
      }
    ]
  }
}
```

### Corrected Format

```json
{
  "description": "Skills ontology hooks for drift detection, skill tracking, and routing",
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
            "timeout": 10,
            "statusMessage": "Checking skill routing..."
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
            "timeout": 30,
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
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/ontology_stop.js\"",
            "timeout": 10,
            "async": true
          }
        ]
      }
    ]
  }
}
```

### Key Changes from Current

| Change | Why |
|--------|-----|
| Added top-level `description` | Official plugin hooks.json supports this field |
| `${CLAUDE_PLUGIN_ROOT}` in all paths | Prevents cwd-dependent path resolution failures |
| Added `timeout` per hook | Official spec supports per-hook timeouts (default 600s is too long) |
| Added `statusMessage` | Shows user what's happening during hook execution |
| Added `SessionStart` hook | Inject ontology context at session start |
| Added `PreToolUse` on `Skill` | Provide routing/prerequisite info before skill invocation |
| Added `Stop` hook (async) | Remind about usage logging; async = non-blocking |
| Quoted `${CLAUDE_PLUGIN_ROOT}` path | Handles paths with spaces |

## Stdin JSON Input Fields by Hook Event

**Confidence: HIGH** -- Directly from official documentation.

### Common Fields (all hooks receive these)

```typescript
interface CommonHookInput {
  session_id: string;       // Unique session identifier
  transcript_path: string;  // Path to conversation JSONL
  cwd: string;              // Current working directory
  permission_mode: string;  // "default" | "plan" | "acceptEdits" | "dontAsk" | "bypassPermissions"
  hook_event_name: string;  // "SessionStart" | "PreToolUse" | "PostToolUse" | "Stop" | etc.
}
```

### PostToolUse (Write|Edit) -- for ontology_sync.js

```typescript
interface PostToolUseInput extends CommonHookInput {
  tool_name: string;      // "Write" or "Edit"
  tool_input: {
    file_path: string;    // Absolute path to the file
    content?: string;     // File content (Write only)
    old_string?: string;  // Original text (Edit only)
    new_string?: string;  // Replacement text (Edit only)
  };
  tool_response: {
    filePath: string;
    success: boolean;
  };
  tool_use_id: string;
}
```

### PostToolUse (Skill) -- for ontology_track_skill.js

```typescript
interface PostToolUseSkillInput extends CommonHookInput {
  tool_name: string;      // "Skill" (or the actual skill tool name)
  tool_input: {
    skill_name?: string;
    command?: string;
    // ... skill-specific fields
  };
  tool_response: object;  // Skill execution result
  tool_use_id: string;
}
```

### SessionStart -- for new session context hook

```typescript
interface SessionStartInput extends CommonHookInput {
  source: string;  // "startup" | "resume" | "clear" | "compact"
  model: string;   // e.g., "claude-sonnet-4-6"
}
```

### Stop -- for usage log reminder hook

```typescript
interface StopInput extends CommonHookInput {
  stop_hook_active: boolean;       // true if already continuing from a stop hook
  last_assistant_message: string;  // Claude's final response text
}
```

## Extracting Data from Stdin JSON (Migration Guide)

### ontology_sync.js: Replace env vars with stdin JSON

**Before (wrong):**
```javascript
const changedFile = process.env.CLAUDE_FILE_PATH || "";
// ...also uses CLAUDE_PROJECT_DIR for project root
```

**After (correct):**
```javascript
const hookData = JSON.parse(fs.readFileSync(0, "utf8"));
const changedFile = hookData.tool_input?.file_path || "";
const projectRoot = hookData.cwd;  // or use $CLAUDE_PROJECT_DIR from process.env
```

### ontology_track_skill.js: Replace env vars with stdin JSON

**Before (wrong):**
```javascript
const toolInput = process.env.CLAUDE_TOOL_INPUT || "";
const nameMatch = toolInput.match(/"skill_name"\s*:\s*"([^"]+)"/);
```

**After (correct):**
```javascript
const hookData = JSON.parse(fs.readFileSync(0, "utf8"));
const skillName = hookData.tool_input?.skill_name
  || hookData.tool_input?.command
  || "";
const sessionId = hookData.session_id;  // Use for session-isolated tracking
```

### Session Tracker: Replace shared temp file with session-isolated file

**Before (bug -- concurrent session collision):**
```javascript
const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
```

**After (fixed -- session-isolated):**
```javascript
const sessionId = hookData.session_id;
const tracker = path.join(os.tmpdir(), `claude-ontology-${sessionId}.yaml`);
```

## What NOT to Do

**Confidence: HIGH** -- Based on official docs, real-world bug reports, and Node.js platform issues.

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Read env vars (`CLAUDE_FILE_PATH`, `CLAUDE_TOOL_INPUT`) | Undocumented/legacy; not part of official hooks spec; may be removed |
| Use `fs.readFileSync('/dev/stdin')` | Does not exist on Windows |
| Use `console.log()` for debug output in hooks | Pollutes stdout; breaks JSON parsing; Claude Code only processes clean JSON |
| Use `process.exit(2)` for advisory messages | Exit 2 is a BLOCKING error; for PostToolUse it shows stderr to Claude as an error |
| Mix `console.log` text with JSON output | stdout must be ONLY JSON or ONLY text, not both |
| Use bare relative paths in hooks.json | `node hooks/foo.js` breaks depending on cwd; always use `${CLAUDE_PLUGIN_ROOT}` |
| Output JSON on exit code != 0 | JSON on stdout is ONLY processed on exit 0 |
| Use `process.exit()` instead of `process.exitCode` | `process.exit()` terminates immediately; may not flush stdout |
| Omit `hookEventName` in `hookSpecificOutput` | Required field; Claude Code needs it to route the response |
| Use deprecated `decision: "approve"` / `decision: "block"` for PreToolUse | Use `hookSpecificOutput.permissionDecision: "allow"/"deny"` instead |

## Shared Utility Pattern

All hooks need stdin reading and JSON output. Extract a shared utility:

```javascript
// hooks/lib/hook-io.js
"use strict";

const fs = require("fs");

/**
 * Read and parse JSON from stdin (piped by Claude Code).
 * Returns parsed object, or empty object if stdin is empty/invalid.
 */
function readStdin() {
  let raw;
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch (err) {
    return {};
  }
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    process.stderr.write(`hook-io: invalid JSON on stdin: ${err.message}\n`);
    return {};
  }
}

/**
 * Write structured JSON response to stdout and set exit code.
 * @param {object} output - The JSON response object
 * @param {number} [exitCode=0] - Process exit code
 */
function writeOutput(output, exitCode = 0) {
  if (output && Object.keys(output).length > 0) {
    process.stdout.write(JSON.stringify(output));
  }
  process.exitCode = exitCode;
}

/**
 * Signal a blocking error via stderr + exit code 2.
 * @param {string} message - Error message shown to Claude
 */
function writeError(message) {
  process.stderr.write(message);
  process.exitCode = 2;
}

module.exports = { readStdin, writeOutput, writeError };
```

Usage in a hook:

```javascript
#!/usr/bin/env node
"use strict";
const { readStdin, writeOutput } = require("./lib/hook-io");

const hookData = readStdin();
// ... hook logic ...
writeOutput({
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: "ONTOLOGY: drift detected..."
  }
});
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Stdin reading | `fs.readFileSync(0, 'utf8')` | Stream events (`process.stdin.on`) | Async complexity for no benefit; hooks are simple sync scripts |
| Stdin reading | `fs.readFileSync(0, 'utf8')` | `fs.readFileSync('/dev/stdin')` | Not cross-platform (no `/dev/stdin` on Windows) |
| JSON output | `process.stdout.write(JSON.stringify())` | `console.log(JSON.stringify())` | `console.log` adds newline but this is harmless; either works |
| Exit control | `process.exitCode = N` | `process.exit(N)` | `process.exit()` may not flush stdout; exitCode is cleaner |
| Module format | CommonJS | ESM | Project convention is CommonJS; no benefit from ESM here |
| Project root | `hookData.cwd` + `process.env.CLAUDE_PROJECT_DIR` | `process.cwd()` | `cwd` may differ from project root; stdin provides authoritative `cwd` |

## Installation

No installation needed. Zero dependencies. All patterns use Node.js stdlib:

- `fs` -- `readFileSync`, `readSync`, `existsSync`, `readFileSync`, `writeFileSync`, `appendFileSync`, `readdirSync`, `statSync`
- `path` -- `join`, `resolve`
- `os` -- `tmpdir`

## Sources

- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) -- Official documentation (HIGH confidence)
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference) -- Official plugin specification (HIGH confidence)
- [Claude Code Hooks Guide (Anthropic Blog)](https://claude.com/blog/how-to-configure-hooks) -- Official blog post (HIGH confidence)
- [Node.js #19831: stdin fd 0 on Windows](https://github.com/nodejs/node/issues/19831) -- EISDIR error, confirmed Windows-only for non-piped stdin (MEDIUM confidence)
- [Node.js #35997: readSync EOF on Windows pipes](https://github.com/nodejs/node/issues/35997) -- Fixed in libuv (MEDIUM confidence)
- [claude-flow #1172: hook-handler.cjs stdin](https://github.com/ruvnet/claude-flow/issues/1172) -- Real-world Node.js hook stdin pattern (MEDIUM confidence)
- [Node.js fs documentation](https://nodejs.org/api/fs.html) -- Official (HIGH confidence)

---

*Stack research: 2026-03-06*
