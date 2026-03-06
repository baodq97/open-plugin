# Coding Conventions

**Analysis Date:** 2026-03-06

## Naming Patterns

**Files:**
- Source files: `kebab-case.js` (e.g., `src/build-registry.js`, `src/adjust-strengths.js`, `src/generate-graph.js`)
- Test files: `kebab-case.test.js` matching source name (e.g., `test/build-registry.test.js`)
- Hook files: `snake_case.js` (e.g., `hooks/ontology_sync.js`, `hooks/ontology_track_skill.js`)
- Renderers: `kebab-case.js` inside `src/renderers/` (e.g., `src/renderers/html.js`, `src/renderers/mermaid.js`, `src/renderers/ascii.js`)
- CLI entry: `bin/cli.js`

**Functions:**
- Use camelCase for all functions: `buildRegistry`, `parseFrontmatter`, `suggestEdges`, `inferDomain`, `adjustStrengths`
- Exported functions match the module's primary purpose: `buildRegistry` in `build-registry.js`, `validate` in `validate.js`
- Internal/private helper functions are not prefixed; they are module-scoped and not exported (e.g., `extractTriggers`, `serializeGraph`)
- Exception: some helpers are exported for direct testing (e.g., `parseFrontmatter`, `parseUsageLog`, `parseGraphEdges`)

**Variables:**
- Use camelCase: `skillsDir`, `ontologyDir`, `regContent`, `graphPath`, `tokenEstimate`
- Constants use UPPER_SNAKE_CASE for lookup objects: `DOMAIN_COLORS`, `EDGE_STYLES`
- Loop variables use short names: `e` for edge, `n` for node, `m` for match, `i`/`j` for indices

**Types:**
- No TypeScript. Types documented via JSDoc `@param` and `@returns` annotations on exported functions.

## Module System

**Format:** CommonJS (`require`/`module.exports`). Never use ESM `import`/`export`.

**Pattern:**
```javascript
"use strict";

const fs = require("fs");
const path = require("path");

// ... module body ...

// CLI entry point guard
if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  someFunction(path.resolve(target));
}

module.exports = { exportedFunction1, exportedFunction2 };
```

**Key rules:**
- Every file starts with `"use strict";` as its first statement (after shebang if present)
- Shebang `#!/usr/bin/env node` on files that serve as CLI entry points: `bin/cli.js`, `src/build-registry.js`, `src/validate.js`, `src/adjust-strengths.js`, `src/generate-graph.js`, `hooks/ontology_sync.js`, `hooks/ontology_track_skill.js`
- Renderer files (`src/renderers/*.js`) do NOT have shebangs -- they are library-only modules
- `module.exports` is always the final statement in the file, using object shorthand: `module.exports = { fn1, fn2 }`
- `require.main === module` guard enables dual CLI/library usage for source modules

## Code Style

**Formatting:**
- No Prettier or formatter configured. Manual formatting.
- 2-space indentation throughout
- Double quotes for strings: `require("fs")`, `"utf-8"`, `"use strict"`
- Semicolons always present
- Trailing commas in multi-line arrays and function calls (not in object literals within YAML serialization)
- Line length is not enforced but generally stays under 120 characters

**Linting:**
- No ESLint or linter configured. No `.eslintrc`, `.prettierrc`, `biome.json`, or `.editorconfig` files present.

## Import Organization

**Order:**
1. Node.js built-in modules: `fs`, `path`, `os`, `child_process`
2. Local project modules: relative paths with `require("./...")`

**Path style:**
- No path aliases. All imports use relative paths or `__dirname`-based resolution.
- CLI (`bin/cli.js`) uses `path.join(__dirname, "..", "src", "module.js")` to reach source files.

**Example from `src/graph.js`:**
```javascript
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateGraph } = require("./generate-graph");
const { renderHtml } = require("./renderers/html");
const { renderMermaid } = require("./renderers/mermaid");
const { renderAscii } = require("./renderers/ascii");
```

## Dependencies

**Zero external dependencies.** Only Node.js built-in modules are allowed:
- `fs` -- file system operations
- `path` -- path manipulation
- `os` -- OS info (temp dirs, platform detection)
- `child_process` -- `execSync`/`execFileSync` for opening files in browser and hook testing

This is a hard constraint of the project. Never add `npm` packages.

## Error Handling

**Patterns:**
- Guard-clause early returns for missing files/directories. Functions check `fs.existsSync()` before reading.
- Console output for user-facing messages: `console.log()` for info/success, `console.error()` for errors.
- Return values signal success/failure: `validate()` returns error count, `buildRegistry()` returns skill count, `adjustStrengths()` returns `{ adjusted, added }`.
- `try/catch` used sparingly, only for best-effort operations (e.g., `tryOpen()` in `src/graph.js`, `cleanup()` in `test/helpers.js`).
- Empty `catch` blocks have `/* best effort */` or `/* ok */` comments.
- No custom error classes. No `throw` statements in source code.
- No centralized error handling middleware or wrapper.

**Example pattern from `src/validate.js`:**
```javascript
if (!fs.existsSync(registry)) {
  console.log("ONTOLOGY: registry.yaml not found. Run /ontology-build to create it.");
  return;
}
```

## Logging

**Framework:** `console.log` and `console.error` (no logging library).

**Patterns:**
- Prefix messages with category tags in hooks: `ONTOLOGY-DRIFT:`, `ONTOLOGY-STALE:`, `ONTOLOGY-VERSION:`, `ONTOLOGY-TRACK:`
- Validation output uses `PASS:`, `FAIL:`, `WARN:`, `INFO:`, `SIZE:` prefixes
- Build commands log counts: `Registry: ${count} skills indexed`
- No structured/JSON logging

## Comments

**When to Comment:**
- JSDoc on all exported functions with `@param` and `@returns`
- Inline comments for non-obvious logic sections (e.g., `// Sequential phases within same domain -> prerequisite edges`)
- Section dividers with `// N. Description` numbering pattern in `validate.js`
- Helper functions get single-line `/** description */` JSDoc

**JSDoc pattern:**
```javascript
/**
 * Scan .claude/skills/ and generate ontology files.
 * @param {string} targetDir - project root
 */
function buildRegistry(targetDir) { ... }

/**
 * @param {string} targetDir - project root
 * @returns {{ adjusted: number, added: number }}
 */
function adjustStrengths(targetDir) { ... }
```

## Function Design

**Size:** Functions are generally 20-80 lines. Largest functions are `buildRegistry` (~80 lines) and the HTML renderer (~400 lines of template string).

**Parameters:**
- Primary parameter is typically `targetDir` (project root path) for all core functions
- Options passed as plain objects: `{ output, open }` for `graphCommand()`
- No parameter validation or type checking at runtime

**Return Values:**
- Core functions return data directly: `buildRegistry()` returns skill count (number), `generateGraph()` returns graph data object or `null`
- `graphCommand()` returns the rendered output string or file path
- Hook scripts have no return values; they write to stdout and filesystem

## YAML Handling

**Custom YAML parsing and serialization throughout -- no library.**

- Registry, graph, chains, and usage-log files use a subset of YAML
- Parsing is regex-based, line-by-line iteration
- Serialization constructs YAML strings via array of lines joined with `\n`
- `parseFrontmatter()` in `src/build-registry.js` handles: key-value pairs, inline arrays, block scalars, list items, booleans, numbers, quoted strings, inline comments

**Pattern for YAML serialization:**
```javascript
const lines = ["# Header comment", "", "key:"];
for (const item of items) {
  lines.push(`  - from: ${item.from}`, `    to: ${item.to}`);
}
lines.push("");
fs.writeFileSync(filePath, lines.join("\n"));
```

## CLI Argument Parsing

**Manual argument parsing -- no library (yargs, commander, etc.).**

**Pattern from `src/graph.js`:**
```javascript
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--format" && args[i + 1]) format = args[++i];
  else if (args[i].startsWith("--format=")) format = args[i].split("=")[1];
  else if (args[i] === "--no-open") noOpen = true;
  else if (!args[i].startsWith("-")) target = args[i];
}
```

Supports both `--flag value` and `--flag=value` syntax.

## Cross-Platform Considerations

- Use `path.join()` for all path construction (never string concatenation with `/`)
- `process.platform` checked for OS-specific behavior (`tryOpen()` uses platform-specific open commands)
- `os.tmpdir()` for temporary files
- Hook scripts resolve project root via `process.env.CLAUDE_PROJECT_DIR || process.cwd()`

---

*Convention analysis: 2026-03-06*
