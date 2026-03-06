# Codebase Structure

**Analysis Date:** 2026-03-06

## Directory Layout

```
open-plugin/
├── .claude-plugin/
│   └── plugin.json              # Claude Code plugin manifest (identity)
├── bin/
│   └── cli.js                   # CLI entry point (npx skills-ontology)
├── commands/                    # Claude Code slash-command definitions
│   ├── ontology-build.md        # /ontology-build command instructions
│   ├── ontology-graph.md        # /ontology-graph command instructions
│   └── ontology-stats.md        # /ontology-stats command instructions
├── hooks/                       # Claude Code PostToolUse hooks
│   ├── hooks.json               # Hook configuration (matchers + commands)
│   ├── ontology_sync.js         # Drift detection on Write|Edit
│   └── ontology_track_skill.js  # Usage tracking on Skill tool
├── plugin/                      # Empty scaffolding (legacy/placeholder)
│   ├── commands/
│   ├── hooks/
│   ├── ontology/
│   └── rules/
├── rules/                       # Claude Code persistent rules
│   ├── ontology-lifecycle.md    # Auto-update rules for ontology files
│   └── skill-routing.md         # How Claude should find and load skills
├── src/                         # Core business logic
│   ├── build-registry.js        # Scan skills, generate registry/graph/chains
│   ├── validate.js              # Ontology consistency checker
│   ├── adjust-strengths.js      # Usage-based edge strength tuning
│   ├── generate-graph.js        # YAML -> graph data structure + constants
│   ├── graph.js                 # Graph command orchestrator (format dispatch)
│   └── renderers/               # Graph visualization renderers
│       ├── html.js              # Self-contained HTML with force-directed SVG
│       ├── mermaid.js           # Mermaid diagram syntax output
│       └── ascii.js             # Terminal box-drawing art output
├── test/                        # Test suite (node:test)
│   ├── helpers.js               # Shared test utilities (temp dirs, skill creation)
│   ├── build-registry.test.js   # Tests for build-registry.js
│   ├── validate.test.js         # Tests for validate.js
│   ├── adjust-strengths.test.js # Tests for adjust-strengths.js
│   ├── graph.test.js            # Tests for generate-graph.js, renderers, graph.js
│   ├── hooks.test.js            # Tests for hook scripts
│   └── plugin-standard.test.js  # Tests for plugin manifest structure
├── .planning/                   # Planning and analysis documents
│   └── codebase/                # Codebase analysis (this directory)
├── package.json                 # NPM manifest (zero dependencies)
├── .npmignore                   # NPM publish exclusions
├── CLAUDE.md                    # Claude Code project instructions
├── README.md                    # Project documentation
└── LICENSE                      # MIT license
```

## Directory Purposes

**`.claude-plugin/`:**
- Purpose: Claude Code plugin identity
- Contains: Single `plugin.json` with name, version, description, author, license, homepage, repository
- Key files: `plugin.json`

**`bin/`:**
- Purpose: CLI entry point for the npm package
- Contains: Single `cli.js` script declared as `"skills-ontology"` in package.json `bin` field
- Key files: `cli.js`

**`commands/`:**
- Purpose: Claude Code slash-command definitions (one markdown file per command)
- Contains: Instruction files that tell Claude how to execute each command
- Key files: `ontology-build.md`, `ontology-stats.md`, `ontology-graph.md`
- Naming: `ontology-{action}.md` pattern; the filename becomes the slash-command name

**`hooks/`:**
- Purpose: Automated hook scripts triggered by Claude Code after tool use
- Contains: `hooks.json` (configuration mapping tool matchers to scripts), JS scripts executed as child processes
- Key files: `hooks.json`, `ontology_sync.js`, `ontology_track_skill.js`
- Naming: `ontology_{action}.js` with underscores (not hyphens) for JS files

**`rules/`:**
- Purpose: Always-active behavioral rules loaded by Claude Code into its context
- Contains: Markdown files with instructions for skill routing algorithm and ontology lifecycle management
- Key files: `skill-routing.md`, `ontology-lifecycle.md`

**`src/`:**
- Purpose: All core business logic
- Contains: Four main modules plus a renderers subdirectory
- Key files: `build-registry.js` (primary), `validate.js`, `adjust-strengths.js`, `generate-graph.js`, `graph.js`

**`src/renderers/`:**
- Purpose: Format-specific graph visualization output
- Contains: Three renderer modules, each exporting a single render function
- Key files: `html.js`, `mermaid.js`, `ascii.js`

**`test/`:**
- Purpose: Full test suite using Node.js built-in test runner
- Contains: One test file per source module, plus shared helpers and plugin structure tests
- Key files: `helpers.js` (test utilities), `*.test.js` files

**`plugin/`:**
- Purpose: Empty directory structure, appears to be a legacy placeholder or scaffolding remnant
- Contains: Empty subdirectories (`commands/`, `hooks/`, `ontology/`, `rules/`)
- Note: All empty; the actual plugin files live at the root level

## Key File Locations

**Entry Points:**
- `bin/cli.js`: CLI dispatcher (the `npx skills-ontology` command)
- `hooks/ontology_sync.js`: Hook entry for drift detection
- `hooks/ontology_track_skill.js`: Hook entry for usage tracking

**Configuration:**
- `package.json`: NPM manifest, scripts (`test`, `validate`), engine requirement (Node >=18)
- `.claude-plugin/plugin.json`: Plugin identity manifest
- `hooks/hooks.json`: Hook trigger configuration (PostToolUse matchers)
- `.npmignore`: Publish exclusion rules

**Core Logic:**
- `src/build-registry.js`: Primary module -- skill scanning, registry generation, edge/chain suggestion, frontmatter parsing, domain/phase inference
- `src/validate.js`: Ontology consistency validation
- `src/adjust-strengths.js`: Usage-log-driven edge strength tuning
- `src/generate-graph.js`: YAML-to-graph-data transform, domain colors, edge styles (shared constants)
- `src/graph.js`: Graph command orchestrator with format dispatch and file output

**Renderers:**
- `src/renderers/html.js`: Self-contained HTML with inline JS force-directed SVG visualization
- `src/renderers/mermaid.js`: Mermaid `graph LR` diagram syntax
- `src/renderers/ascii.js`: Terminal box-drawing art with domain clusters

**Testing:**
- `test/helpers.js`: `makeTempDir()`, `createSkill()`, `cleanup()` utilities
- `test/build-registry.test.js`: Tests for all build-registry exports
- `test/validate.test.js`: Tests for validation logic
- `test/adjust-strengths.test.js`: Tests for strength adjustment
- `test/graph.test.js`: Tests for graph generation and all renderers
- `test/hooks.test.js`: Tests for hook scripts
- `test/plugin-standard.test.js`: Structural tests for plugin manifest and file layout

**Plugin Integration:**
- `commands/ontology-build.md`: Instructions for `/ontology-build` slash command
- `commands/ontology-stats.md`: Instructions for `/ontology-stats` slash command
- `commands/ontology-graph.md`: Instructions for `/ontology-graph` slash command
- `rules/skill-routing.md`: Algorithm for finding and loading skills at runtime
- `rules/ontology-lifecycle.md`: Rules for auto-updating ontology when skills change

## Naming Conventions

**Files:**
- Source modules: `kebab-case.js` (e.g., `build-registry.js`, `adjust-strengths.js`, `generate-graph.js`)
- Hook scripts: `snake_case.js` (e.g., `ontology_sync.js`, `ontology_track_skill.js`)
- Commands: `kebab-case.md` (e.g., `ontology-build.md`, `ontology-graph.md`)
- Rules: `kebab-case.md` (e.g., `skill-routing.md`, `ontology-lifecycle.md`)
- Tests: `{module-name}.test.js` mirroring source file names

**Directories:**
- Lowercase, no special characters: `src/`, `bin/`, `test/`, `hooks/`, `commands/`, `rules/`
- Dot-prefixed for Claude/config: `.claude-plugin/`, `.planning/`
- Subdirectories use lowercase: `src/renderers/`

**Functions:**
- Exported functions: `camelCase` (e.g., `buildRegistry`, `generateGraph`, `adjustStrengths`, `renderHtml`, `graphCommand`)
- Internal helpers: `camelCase` (e.g., `parseFrontmatter`, `suggestEdges`, `inferDomain`, `sanitizeId`, `tryOpen`)
- Parser functions follow `parse{Source}{Type}` pattern (e.g., `parseRegistryNodes`, `parseGraphEdges`, `parseUsageLog`)

**Exports:**
- Every source module uses `module.exports = { namedExport1, namedExport2 }` (object shorthand)
- Each renderer exports a single function: `{ renderHtml }`, `{ renderMermaid }`, `{ renderAscii }`

## Where to Add New Code

**New CLI Command:**
1. Create handler function in a new or existing `src/*.js` module
2. Add case to the switch statement in `bin/cli.js`
3. Add usage line in `usage()` function in `bin/cli.js`
4. Add corresponding Claude command file: `commands/{command-name}.md`
5. Add tests: `test/{module-name}.test.js`

**New Graph Renderer:**
1. Create `src/renderers/{format}.js` exporting `render{Format}(graph)` function
2. Import in `src/graph.js` and add case to the format switch
3. Add to the `--format` help text in `bin/cli.js` usage()
4. Add tests in `test/graph.test.js`

**New Hook:**
1. Create `hooks/{hook_name}.js` (use snake_case)
2. Add matcher entry to `hooks/hooks.json` under the appropriate event type
3. Add tests in `test/hooks.test.js`
4. If the hook produces structured messages, add handling rules to `rules/ontology-lifecycle.md`

**New Rule:**
1. Create `rules/{rule-name}.md` with instructions for Claude Code
2. Add file existence check in `test/plugin-standard.test.js`

**New Core Module:**
1. Create `src/{module-name}.js` (kebab-case)
2. Follow the pattern: `"use strict"`, require stdlib, export functions, add CLI entry point via `if (require.main === module)`
3. Wire into `bin/cli.js` if it should be a CLI command
4. Create `test/{module-name}.test.js`
5. Use `test/helpers.js` utilities for temp directory setup/teardown

**New Test File:**
1. Create `test/{module-name}.test.js`
2. Import from `node:test` and `node:assert/strict`
3. Use `{ makeTempDir, createSkill, cleanup }` from `./helpers` for filesystem tests
4. Follow `describe`/`it` structure with `beforeEach`/`afterEach` for temp dir lifecycle

## Special Directories

**`.claude-plugin/`:**
- Purpose: Plugin manifest for Claude Code's plugin system
- Generated: No (manually maintained)
- Committed: Yes

**`plugin/`:**
- Purpose: Empty scaffolding, likely a legacy artifact from before root-level plugin layout was adopted
- Generated: No
- Committed: Yes (but all subdirectories are empty)
- Note: Can likely be removed without impact

**`.planning/`:**
- Purpose: Codebase analysis and planning documents
- Generated: By analysis tooling
- Committed: Yes

**Target Project Directories (not in this repo, but operated on):**
- `{target}/.claude/skills/*/SKILL.md`: Skill definition files this plugin reads
- `{target}/.claude/ontology/`: Output directory for registry.yaml, graph.yaml, chains.yaml, usage-log.yaml, graph.html

---

*Structure analysis: 2026-03-06*
