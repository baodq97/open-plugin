# Codebase Concerns

**Analysis Date:** 2026-03-06

## Tech Debt

**Duplicated YAML Graph Edge Parser:**
- Issue: `parseGraphEdges()` is implemented identically in two separate files with no shared code. Both parse `graph.yaml` edges using the same line-by-line approach, same regex patterns, and same data structure output.
- Files: `src/generate-graph.js` (lines 108-136), `src/adjust-strengths.js` (lines 119-140)
- Impact: Bug fixes or format changes to graph.yaml parsing must be applied in two places. Divergence risk is high since neither file imports from the other.
- Fix approach: Extract `parseGraphEdges()` into a shared module (e.g., `src/yaml-helpers.js`) and import from both files. The `extractRegistrySkills()` helper in `src/validate.js` (line 30-33) and `hooks/ontology_sync.js` (line 46-48) also duplicate registry skill name extraction logic and should be consolidated.

**Hand-Rolled YAML Parser (No Spec Compliance):**
- Issue: The project uses custom regex-based YAML parsing throughout (`parseFrontmatter()` in `src/build-registry.js`, `parseRegistryNodes()` in `src/generate-graph.js`, `parseUsageLog()` / `parseGraphEdges()` in `src/adjust-strengths.js`, and inline parsing in `src/validate.js` and `hooks/ontology_sync.js`). While this supports the zero-dependency constraint, the parsers handle only a narrow subset of YAML and will silently produce wrong results on valid YAML that uses features like nested objects, multi-document streams, anchors/aliases, or flow mappings.
- Files: `src/build-registry.js` (lines 284-347), `src/generate-graph.js` (lines 75-136), `src/adjust-strengths.js` (lines 97-140), `src/validate.js` (lines 30-75), `hooks/ontology_sync.js` (lines 46-48, 78, 92)
- Impact: If a user hand-edits YAML files using valid but uncommon YAML syntax (nested maps, anchors, quoted colons in values, block sequences with complex items), the parsers will silently skip or misparse data. The project generates its own YAML so this is mitigated for machine-generated files, but user-edited files (graph.yaml, chains.yaml, usage-log.yaml) are at risk.
- Fix approach: Document the supported YAML subset explicitly. Consider adding validation warnings when encountering unrecognized YAML constructs. Alternatively, bundle a lightweight YAML parser as a vendored dependency.

**Hardcoded Domain and Phase Inference Rules:**
- Issue: `inferDomain()` and `inferPhase()` in `src/build-registry.js` use hardcoded regex patterns that match specific product/project names (e.g., `aiquinta-`, `vbounce`, `azdo-`, `vercel-`). These are tightly coupled to one particular user's skill naming conventions and provide no value for other users of the plugin.
- Files: `src/build-registry.js` (lines 361-383)
- Impact: Any user with different skill naming conventions gets everything classified as `general` domain and `implementation` phase, making auto-suggested edges and chains useless. The heuristics are not extensible without modifying source code.
- Fix approach: Allow domain/phase to be declared in SKILL.md frontmatter (e.g., `domain: frontend`, `phase: testing`) and fall back to heuristic inference only when not specified. Add a configuration file (e.g., `.claude/ontology/config.yaml`) for custom domain/phase mapping rules.

**No Linter or Formatter Configuration:**
- Issue: The project has no `.eslintrc`, `.prettierrc`, `biome.json`, or any code formatting/linting configuration. Code style is enforced only by convention.
- Files: Project root (missing config files)
- Impact: Contributors may introduce inconsistent formatting. No automated style enforcement on CI or pre-commit. Current code is consistent but this is fragile as the project grows.
- Fix approach: Add ESLint and Prettier configuration files. Consider adding a lint script to `package.json` and potentially a pre-commit hook.

## Known Bugs

**Session Tracker File Collision (ontology_track_skill.js):**
- Symptoms: Multiple concurrent Claude sessions on the same machine share a single session tracker file at `os.tmpdir() + '/claude-ontology-session.yaml'`. Skills from different sessions are mixed together, producing incorrect tracking data. The file also grows without bound across sessions since nothing truncates or rotates it.
- Files: `hooks/ontology_track_skill.js` (line 29)
- Trigger: Run two Claude Code sessions simultaneously on the same machine, both using skills. Or run many sessions sequentially without manually cleaning the temp file.
- Workaround: None built-in. Users can manually delete the session tracker file between sessions.

**Registry Skill Name Regex Only Matches Lowercase:**
- Symptoms: Skill directory names containing uppercase letters (e.g., `MySkill`) are processed by `buildRegistry()` but cannot be matched by `extractRegistrySkills()` in `src/validate.js` (line 31), which uses `^ {2}[a-z][a-z0-9-]*:$` to find skill entries. This causes validation to report phantom "missing" skills.
- Files: `src/validate.js` (line 31), `hooks/ontology_sync.js` (line 46)
- Trigger: Create a skill directory with uppercase characters in the name.
- Workaround: Use only lowercase skill directory names (which is the convention but not enforced).

## Security Considerations

**Command Injection in tryOpen():**
- Risk: The `tryOpen()` function in `src/graph.js` constructs a shell command using string interpolation with a user-controlled file path. On Windows, the `start` command with `execSync` and a crafted path containing shell metacharacters could lead to command injection.
- Files: `src/graph.js` (lines 83-98)
- Current mitigation: The file path is typically auto-generated (`graph.html` in the ontology directory). The function only runs when `options.open !== false`. The `stdio: "ignore"` option prevents output leakage. Errors are caught and suppressed.
- Recommendations: Use `child_process.execFile()` instead of `execSync()` to avoid shell interpretation. On Windows, use `start ""` with proper escaping or use the `os` module to detect platform and use appropriate safe invocation patterns. Alternatively, use `child_process.spawn(cmd, [filePath])` which does not invoke a shell.

**Regex Injection in ontology_sync.js:**
- Risk: Skill directory names are interpolated directly into `new RegExp()` without escaping at `hooks/ontology_sync.js` lines 78 and 92. A skill directory named with regex metacharacters (e.g., `skill.+name` or `skill(name)`) would produce an invalid or unintended regex pattern.
- Files: `hooks/ontology_sync.js` (lines 78, 92)
- Current mitigation: Skill names are typically lowercase alphanumeric with hyphens, and the `buildRegistry()` function only processes directories matching `[a-z][a-z0-9-]*`. However, this constraint is not enforced at the directory creation level.
- Recommendations: Escape the skill name before using it in `new RegExp()` by replacing regex metacharacters: `skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.

**No Input Validation on CLI Arguments:**
- Risk: The CLI in `bin/cli.js` passes `process.argv` values directly to `path.resolve()` and then to functions that read/write files. While Node.js file APIs handle path traversal safely, there is no validation that the target directory is reasonable (e.g., not `/`, not a system directory).
- Files: `bin/cli.js` (lines 6-7, 24-25, 29-30, 34-35)
- Current mitigation: Operations only read/write within `.claude/` subdirectories of the target, limiting blast radius. The tool requires explicit `--output` for non-default output locations.
- Recommendations: Add basic validation that the target directory exists and contains (or can contain) a `.claude/` directory.

## Performance Bottlenecks

**O(n^2) Force Simulation in HTML Renderer:**
- Problem: The force-directed graph layout in the HTML renderer uses an O(n^2) all-pairs repulsion calculation on every animation frame (`tick()` function). For large skill collections (50+ skills), this will cause noticeable frame drops in the browser.
- Files: `src/renderers/html.js` (inlined JavaScript, approximately lines 298-312 of the rendered HTML)
- Cause: Every node is compared against every other node for repulsion forces, with no spatial partitioning (e.g., Barnes-Hut / quadtree optimization).
- Improvement path: Implement a quadtree for spatial partitioning to reduce repulsion calculation to O(n log n). Alternatively, limit simulation ticks and use `requestAnimationFrame` with a frame budget. For the expected use case (5-30 skills), this is not a practical concern.

**Repeated File Reads in validate.js:**
- Problem: `validate()` reads `registry.yaml` and `graph.yaml` multiple times (once per validation check). In the graph coverage check (line 101-113), `graphPath` content is read twice within the same block.
- Files: `src/validate.js` (lines 82-84, 101-104, 116-118)
- Cause: Each validation section independently reads the files it needs rather than reading once and passing parsed data.
- Improvement path: Read each file once at the top of the function and pass the content string to each validation section. Minor issue given file sizes are small (typically < 100 lines).

**O(n^2) Edge Suggestion Algorithm:**
- Problem: `suggestEdges()` in `src/build-registry.js` uses nested loops comparing all pairs of skill entries. With many skills, this produces quadratic time complexity and potentially many edges.
- Files: `src/build-registry.js` (lines 188-234)
- Cause: Two nested loops iterate over all entry pairs for both prerequisite and complementary edge detection.
- Improvement path: Group entries by domain first, then only iterate within same-domain groups. This is already partially done (the `continue` on different domains) but the outer loop still iterates all pairs. For the expected use case (< 50 skills), this is not a practical concern.

## Fragile Areas

**Custom YAML Generation (String Concatenation):**
- Files: `src/build-registry.js` (lines 22-74, 88-105, 138-155), `src/adjust-strengths.js` (lines 143-167)
- Why fragile: YAML is generated by concatenating strings with manual indentation. Values containing special YAML characters (colons, quotes, newlines, hash signs) in skill descriptions or notes will produce invalid YAML output. The `note` field in `serializeGraph()` is wrapped in double quotes but the value itself is not escaped (e.g., a note containing `"` would break the output).
- Safe modification: When adding new YAML output fields, always test with values containing `: `, `"`, `#`, `\n`, `[`, `]`. Wrap all string values in double quotes and escape internal quotes.
- Test coverage: Tests use simple alphanumeric values. No tests exercise special characters in skill names, descriptions, or notes.

**Token Estimate Heuristic:**
- Files: `src/build-registry.js` (line 52), `hooks/ontology_sync.js` (line 75)
- Why fragile: Token estimation uses a fixed multiplier of `3.8 tokens per line`, which is a rough heuristic. Different content types (code-heavy, table-heavy, prose) have very different token densities. The 30% drift threshold in the sync hook (line 82) amplifies this inaccuracy.
- Safe modification: The multiplier is used in two places and must be kept in sync. Consider extracting it as a named constant.
- Test coverage: No tests validate the token estimate calculation itself or the drift detection threshold.

**HTML Renderer as Template Literal:**
- Files: `src/renderers/html.js` (lines 9-412)
- Why fragile: The entire HTML file (414 lines including ~340 lines of inlined JavaScript) is a single template literal string. This makes the embedded JavaScript impossible to lint, format, type-check, or test independently. A single backtick or `${` in a comment could break the entire renderer.
- Safe modification: Be extremely careful with template literal syntax inside the JavaScript. Never use backticks or `${}` in the inlined code. Test by generating actual HTML output and verifying it loads in a browser.
- Test coverage: Tests verify HTML output contains expected strings but do not verify the interactive behavior of the force simulation, pan/zoom, or detail panel.

## Scaling Limits

**Skills Collection Size:**
- Current capacity: Works well for 1-50 skills based on the O(n^2) algorithms in edge suggestion and graph visualization.
- Limit: With 100+ skills, `suggestEdges()` produces O(n^2) edge candidates, the HTML force simulation becomes sluggish, and the ASCII renderer produces very long output. The registry.yaml file grows linearly but the graph.yaml could grow quadratically.
- Scaling path: Add pagination or filtering to graph visualization. Implement domain-scoped edge suggestion. Add a `--domain` filter flag to the graph command.

**Usage Log Growth:**
- Current capacity: `usage-log.yaml` is read entirely into memory by `adjustStrengths()` and `parseUsageLog()`. The session tracker in tmpdir grows without bound.
- Limit: After months of heavy use, the usage log could grow to thousands of entries, all parsed on every adjustment run.
- Scaling path: Add log rotation (archive entries older than N days). Parse only the most recent N entries for strength adjustment. Clean the session tracker at the start of each session.

## Dependencies at Risk

**Node.js 18 Minimum (End of Life):**
- Risk: The `engines` field specifies `"node": ">=18"`. Node.js 18 reached end-of-life in April 2025. Users on Node 18 will not receive security patches.
- Impact: No immediate breakage, but the minimum version should be updated to a supported LTS release.
- Migration plan: Update `engines` to `">=20"` in `package.json`. Node 20 is the current active LTS and supports all APIs used by the project (`node:test`, `fs.rmSync`, `fs.mkdtempSync`).

## Missing Critical Features

**No YAML Escape/Sanitization:**
- Problem: Generated YAML output never escapes special characters in values. Skill descriptions, notes, and trigger text are inserted raw into YAML strings.
- Blocks: Using skills with descriptions containing colons, quotes, hash signs, or brackets produces corrupt `registry.yaml`, `graph.yaml`, or `chains.yaml` files that fail to parse.

**No Session Boundary Detection:**
- Problem: The session tracker (`hooks/ontology_track_skill.js`) has no concept of session start/end. It appends to a global temp file indefinitely. There is no mechanism to flush session data to `usage-log.yaml` automatically.
- Blocks: The usage-log.yaml is never automatically populated. Users must manually append entries, which means the `adjustStrengths` feature (which requires 10+ log entries) is effectively never triggered in practice without manual effort.

**No Error Recovery for Corrupt YAML Files:**
- Problem: If any of the ontology YAML files (registry.yaml, graph.yaml, chains.yaml) become corrupt (e.g., due to the YAML escaping issue above, or partial write from a crash), the parsers will silently produce empty or partial results with no warning. The `buildRegistry` function will overwrite `registry.yaml` but preserves `graph.yaml` and `chains.yaml` even if corrupt.
- Blocks: Users may not realize their ontology data is incomplete or wrong until they notice missing skills in the graph visualization.

## Test Coverage Gaps

**No Special Character Testing:**
- What's not tested: Skill names, descriptions, notes, and frontmatter values containing YAML-special characters (`: `, `"`, `'`, `#`, `[`, `]`, `\n`, `|`, `>`)
- Files: `test/build-registry.test.js`, `test/validate.test.js`
- Risk: Corrupt YAML generation goes unnoticed. See "No YAML Escape/Sanitization" above.
- Priority: High

**No Error Path Testing for File I/O:**
- What's not tested: Behavior when files are unreadable (permissions), directories are not writable, disk is full, or files change between existence check and read.
- Files: All `src/*.js` files use `fs.existsSync()` followed by `fs.readFileSync()` without try/catch
- Risk: Unhandled exceptions crash the CLI or hooks with cryptic Node.js error messages instead of user-friendly feedback.
- Priority: Medium

**No CLI Argument Edge Case Testing:**
- What's not tested: The `bin/cli.js` argument parsing for malformed inputs, missing subcommands, unknown flags, or conflicting options. Also no test for `--format=unknown` in the graph command.
- Files: `bin/cli.js`, `src/graph.js` (lines 101-118)
- Risk: Low -- CLI is a thin dispatcher and the underlying functions handle missing inputs gracefully.
- Priority: Low

**No Integration Test for Full Workflow:**
- What's not tested: The complete lifecycle: build registry, make edits, trigger sync hook, track skills, accumulate usage log entries, then run adjustStrengths. Each step is tested in isolation but never as a connected flow.
- Files: All test files test individual functions; no end-to-end test exists.
- Risk: Integration bugs between steps (e.g., sync hook producing output that adjustStrengths cannot parse) would not be caught.
- Priority: Medium

**HTML Renderer Interactive Behavior:**
- What's not tested: Force simulation convergence, pan/zoom, node dragging, detail panel display, SVG export, window resize handling in the HTML renderer.
- Files: `src/renderers/html.js`
- Risk: Low -- the HTML is self-contained and can be manually tested in a browser. But regressions in the embedded JavaScript would not be caught by the test suite.
- Priority: Low

---

*Concerns audit: 2026-03-06*
