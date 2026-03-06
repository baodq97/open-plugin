# Testing Patterns

**Analysis Date:** 2026-03-06

## Test Framework

**Runner:**
- `node:test` (Node.js built-in test runner, available since Node 18)
- No external test framework (no Jest, Vitest, Mocha)
- Config: None. Configured via `package.json` scripts only.

**Assertion Library:**
- `node:assert/strict` (Node.js built-in strict assertions)

**Run Commands:**
```bash
npm test                                          # Run all tests (69 tests, 19 suites)
node --test --test-concurrency=1 test/*.test.js   # Direct invocation (same as npm test)
```

**Key flag:** `--test-concurrency=1` enforces serial execution. Tests use shared filesystem resources (temp dirs, session tracker files in `os.tmpdir()`) that would conflict under parallel execution.

## Test File Organization

**Location:**
- Separate `test/` directory at project root (not co-located with source)
- One test file per source module, plus cross-cutting test files

**Naming:**
- Test files: `{source-module-name}.test.js`
- Helper module: `test/helpers.js`

**Structure:**
```
test/
├── helpers.js                  # Shared test utilities (makeTempDir, createSkill, cleanup)
├── build-registry.test.js      # Tests for src/build-registry.js (25 tests)
├── adjust-strengths.test.js    # Tests for src/adjust-strengths.js (8 tests)
├── graph.test.js               # Tests for src/generate-graph.js + src/graph.js + renderers (18 tests)
├── validate.test.js            # Tests for src/validate.js (4 tests)
├── hooks.test.js               # Tests for hooks/ontology_sync.js + hooks/ontology_track_skill.js (5 tests)
└── plugin-standard.test.js     # Structure/smoke tests for plugin layout (2 tests)
```

## Test Structure

**Suite Organization:**
```javascript
"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");
const { functionUnderTest } = require("../src/module-name");

describe("functionUnderTest", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("prefix");
  });

  afterEach(() => cleanup(tmpDir));

  it("describes expected behavior", () => {
    // Arrange
    createSkill(tmpDir, "skill-name", { version: '"1.0"' });

    // Act
    const result = functionUnderTest(tmpDir);

    // Assert
    assert.ok(result);
    assert.equal(result.count, 1);
  });
});
```

**Patterns:**
- Import `describe`, `it`, `beforeEach`, `afterEach` from `node:test` (destructured)
- Import `assert` from `node:assert/strict`
- `let tmpDir` declared at describe-block scope, assigned in `beforeEach`
- `cleanup(tmpDir)` in `afterEach` for filesystem cleanup
- Each `describe` block groups tests for one function or one logical unit
- Test names use present-tense description: "parses simple key-value pairs", "returns 0 for valid ontology"
- No nested `describe` blocks

## Test Helpers

**File:** `test/helpers.js`

```javascript
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

/** Create a temp directory for test isolation */
function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `skills-ontology-test-${prefix}-`));
}

/** Create a minimal skill directory with frontmatter */
function createSkill(projectRoot, name, frontmatter, body) {
  const dir = path.join(projectRoot, ".claude", "skills", name);
  fs.mkdirSync(dir, { recursive: true });
  const fm = frontmatter
    ? `---\n${Object.entries(frontmatter).map(([k, v]) => `${k}: ${v}`).join("\n")}\n---\n`
    : "";
  fs.writeFileSync(path.join(dir, "SKILL.md"), fm + (body || `# ${name}\n\nA test skill.\n`));
}

/** Remove a directory recursively */
function cleanup(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch { /* best effort */ }
}
```

**Key conventions for helpers:**
- `makeTempDir(prefix)` creates unique temp dirs with descriptive prefix (e.g., `"build"`, `"validate"`, `"graph"`)
- `createSkill(projectRoot, name, frontmatter, body)` sets up a complete skill directory structure
- Frontmatter values must include their own quoting: `{ version: '"1.0"', description: '"A test skill"' }`
- `cleanup()` is best-effort with swallowed errors

## Filesystem Test Isolation

All tests that touch the filesystem follow this pattern:

1. **Create** a unique temp directory in `beforeEach` via `makeTempDir()`
2. **Set up** test fixtures using `createSkill()` and `fs.writeFileSync()` / `fs.mkdirSync()`
3. **Execute** the function under test, passing `tmpDir` as the target directory
4. **Assert** against filesystem state using `fs.existsSync()` and `fs.readFileSync()`
5. **Clean up** in `afterEach` via `cleanup(tmpDir)`

**Important:** Tests create the full `.claude/skills/` and `.claude/ontology/` directory structure inside each temp dir. The source functions operate on these temp directories as if they were real project roots.

## Mocking

**Framework:** No mocking library. Tests use real filesystem operations.

**What is mocked:**
- Nothing. There are no mocks, stubs, or spies in the test suite.

**What is NOT mocked:**
- Filesystem operations -- tests use real temp directories
- `console.log` / `console.error` -- output is not captured or asserted (except for hook tests via `execFileSync`)
- Child processes -- hook tests use `execFileSync` to run hook scripts as real processes

**Hook testing pattern (subprocess execution):**
```javascript
const { execFileSync } = require("child_process");

it("detects drift when new skill added", () => {
  createSkill(tmpDir, "new-skill", { version: '"1.0"' });

  const output = execFileSync("node", [path.join(PLUGIN_DIR, "hooks", "ontology_sync.js")], {
    env: { ...process.env, CLAUDE_FILE_PATH: "" },
    cwd: tmpDir,
  }).toString();

  assert.ok(output.includes("ONTOLOGY-DRIFT"));
});
```

Hooks are tested as real subprocess invocations with controlled environment variables (`CLAUDE_FILE_PATH`, `CLAUDE_TOOL_INPUT`, `CLAUDE_PROJECT_DIR`). The `cwd` option sets the working directory to the temp dir.

## Assertion Patterns

**Common assertions used:**

```javascript
// Equality
assert.equal(result, expected);
assert.deepEqual(result, expectedArray);

// Truthiness
assert.ok(condition);
assert.ok(fs.existsSync(filePath));

// String content checks (most common pattern)
const content = fs.readFileSync(filePath, "utf-8");
assert.ok(content.includes("expected-substring"));

// Null/type checks
assert.equal(generateGraph(tmpDir), null);
assert.ok(typeof result === "string");
```

**Pattern:** The codebase heavily favors `assert.ok(string.includes(...))` for verifying generated file contents. This is the dominant assertion style for integration-level tests.

## Test Data Construction

**Inline YAML construction:**
```javascript
fs.writeFileSync(
  path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
  "entries:\n" + logEntries.join("\n") + "\n"
);

fs.writeFileSync(
  path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
  [
    "edges:",
    "  - from: skill-a",
    "    to: skill-b",
    "    type: prerequisite",
    "    strength: 60",
    '    note: "test"',
    "",
  ].join("\n")
);
```

**Loop-generated test data:**
```javascript
const logEntries = [];
for (let i = 0; i < 12; i++) {
  logEntries.push(
    `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
    "    skills_used: [skill-a, skill-b]",
    "    outcome: success"
  );
}
```

**No fixtures directory.** All test data is constructed inline within test files. No JSON fixture files or shared test data modules.

## Coverage

**Requirements:** No coverage enforcement. No coverage tool configured.

**No coverage commands available.** To add coverage, use Node.js built-in:
```bash
node --test --experimental-test-coverage test/*.test.js
```

## Test Types

**Unit Tests:**
- Pure function tests for `parseFrontmatter`, `inferDomain`, `inferPhase`, `extractTriggers`, `suggestEdges`, `suggestChains`, `parseUsageLog`, `parseGraphEdges`
- Located in `test/build-registry.test.js` and `test/adjust-strengths.test.js`
- Test functions directly with in-memory data, no filesystem

**Integration Tests:**
- `buildRegistry()`, `validate()`, `adjustStrengths()`, `generateGraph()`, `graphCommand()` tests
- Create full directory structures in temp dirs, run the function, verify output files
- Located in `test/build-registry.test.js`, `test/validate.test.js`, `test/adjust-strengths.test.js`, `test/graph.test.js`

**Subprocess/Hook Tests:**
- Run hook scripts via `execFileSync` with controlled environment variables
- Verify stdout output and filesystem side effects
- Located in `test/hooks.test.js`

**Structure/Smoke Tests:**
- Verify plugin directory layout and manifest structure
- Located in `test/plugin-standard.test.js`

**E2E Tests:**
- Not present. No browser testing or end-to-end test framework.

## Common Patterns

**Async Testing:**
- Not used. All functions are synchronous (`fs.readFileSync`, `fs.writeFileSync`, `execFileSync`). No async/await in tests.

**Error Testing:**
```javascript
it("returns 0 when no skills dir exists", () => {
  fs.mkdirSync(path.join(tmpDir, ".claude"), { recursive: true });
  assert.equal(buildRegistry(tmpDir), 0);
});

it("returns null when no registry exists", () => {
  assert.equal(generateGraph(tmpDir), null);
});

it("returns errors for missing files", () => {
  fs.mkdirSync(path.join(tmpDir, ".claude", "ontology"), { recursive: true });
  const errors = validate(tmpDir);
  assert.ok(errors > 0);
});
```

**Errors are tested via return values, not exceptions.** No `assert.throws()` usage in the test suite. Functions return sentinel values (0, null, error count) rather than throwing.

**Idempotency Testing:**
```javascript
it("is idempotent for graph and chains", () => {
  createSkill(tmpDir, "my-skill", { version: '"1.0"' });
  buildRegistry(tmpDir);

  const graphBefore = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
  buildRegistry(tmpDir);
  const graphAfter = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");

  assert.equal(graphBefore, graphAfter);
});
```

## Test Suite Statistics

- **Total tests:** 69
- **Total suites:** 19
- **Pass rate:** 100% (69/69)
- **Duration:** ~1.2 seconds
- **Skipped/TODO:** 0
- **Test lines:** 856 lines across 6 test files + 29-line helper
- **Source lines:** 1,534 lines across 8 source files
- **Test-to-source ratio:** ~0.56 (moderate coverage)

## Adding New Tests

**For a new source module `src/new-feature.js`:**

1. Create `test/new-feature.test.js`
2. Follow the standard import pattern:
```javascript
"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");
const { newFeature } = require("../src/new-feature");
```
3. Use `makeTempDir("feature-name")` in `beforeEach`, `cleanup(tmpDir)` in `afterEach`
4. Test pure functions separately from filesystem-dependent functions
5. Assert file contents with `assert.ok(content.includes("expected"))` pattern
6. Run with `npm test` -- the glob `test/*.test.js` auto-discovers new files

---

*Testing analysis: 2026-03-06*
