# Architecture

**Analysis Date:** 2026-03-06

## Pattern Overview

**Overall:** Pipeline / Transform architecture with Plugin Integration Layer

This is a CLI tool and Claude Code plugin that follows a pipeline pattern: scan skill files from a target project's `.claude/skills/` directory, transform them into structured YAML ontology files in `.claude/ontology/`, and provide visualization and validation of the resulting graph. The plugin integration layer (hooks, commands, rules) enables Claude Code to interact with the ontology automatically during sessions.

**Key Characteristics:**
- Stateless file-in/file-out processing: each command reads from disk, transforms, and writes back
- No runtime server or daemon; all operations are synchronous one-shot CLI invocations
- The plugin operates on a *target project* (not itself); the target is always a path argument or `process.cwd()`
- Zero external dependencies; all YAML parsing is hand-rolled regex/string-based
- Dual entry: CLI (`bin/cli.js`) for humans, hooks/commands/rules for Claude Code automation

## Layers

**Plugin Manifest Layer:**
- Purpose: Declares the plugin identity for Claude Code's plugin system
- Location: `.claude-plugin/plugin.json`
- Contains: Plugin metadata (name, version, description, author, license)
- Depends on: Nothing
- Used by: Claude Code plugin loader

**Command Layer:**
- Purpose: Define slash-commands that Claude Code presents to users (e.g., `/ontology-build`)
- Location: `commands/`
- Contains: Markdown instruction files that Claude Code reads as prompts
- Depends on: CLI layer (commands reference `npx skills-ontology build|graph`)
- Used by: Claude Code command system

**Rules Layer:**
- Purpose: Persistent behavioral instructions for Claude Code during sessions
- Location: `rules/`
- Contains: `skill-routing.md` (how to find/load skills), `ontology-lifecycle.md` (when to auto-update ontology)
- Depends on: YAML data files in target project's `.claude/ontology/`
- Used by: Claude Code rule system (always-active context)

**Hooks Layer:**
- Purpose: Automated triggers that fire after Claude Code tool use
- Location: `hooks/`
- Contains: `hooks.json` (hook configuration), `ontology_sync.js` (drift detection), `ontology_track_skill.js` (usage tracking)
- Depends on: Target project's `.claude/skills/` and `.claude/ontology/` directories
- Used by: Claude Code hook system (PostToolUse events)

**CLI Entry Layer:**
- Purpose: Single entry point that dispatches to core modules
- Location: `bin/cli.js`
- Contains: Argument parsing, command routing via switch/case
- Depends on: Core Processing layer (`src/*.js`)
- Used by: Users via `npx skills-ontology <command>`, commands layer

**Core Processing Layer:**
- Purpose: All business logic for building, validating, adjusting, and graphing the ontology
- Location: `src/`
- Contains: Four main modules: `build-registry.js`, `validate.js`, `adjust-strengths.js`, `generate-graph.js`
- Depends on: Node.js stdlib only (`fs`, `path`)
- Used by: CLI entry layer, graph orchestrator

**Graph Orchestrator:**
- Purpose: Coordinate graph generation with format-specific rendering and file I/O
- Location: `src/graph.js`
- Contains: Format dispatch (html/mermaid/ascii/json), output file writing, browser opening
- Depends on: `src/generate-graph.js`, `src/renderers/*.js`
- Used by: CLI entry layer

**Renderer Layer:**
- Purpose: Transform graph data structures into visual output formats
- Location: `src/renderers/`
- Contains: `html.js` (interactive SVG with force-directed layout), `mermaid.js` (Mermaid diagram syntax), `ascii.js` (terminal box-drawing)
- Depends on: `src/generate-graph.js` (for `DOMAIN_COLORS`, `EDGE_STYLES` constants)
- Used by: `src/graph.js`

## Data Flow

**Build Flow (primary):**

1. `buildRegistry(targetDir)` scans `{targetDir}/.claude/skills/*/SKILL.md`
2. Each skill file is parsed for YAML frontmatter (version, description, triggers)
3. Domain and SDLC phase are inferred from skill name via regex heuristics (`inferDomain()`, `inferPhase()`)
4. Token estimate is computed from line count (`lines * 3.8`)
5. Output written to `{targetDir}/.claude/ontology/registry.yaml`
6. If `graph.yaml` does not exist, `suggestEdges()` auto-generates edges from domain/phase overlaps
7. If `chains.yaml` does not exist, `suggestChains()` groups skills by domain into workflow chains

**Validation Flow:**

1. `validate(targetDir)` checks existence of `registry.yaml`, `graph.yaml`, `chains.yaml`, `usage-log.yaml`
2. Compares skill directories against registry entries (completeness check)
3. Verifies all graph edge endpoints exist in registry (referential integrity)
4. Verifies all chain skill references exist in registry
5. Reports file sizes and error count; returns error count as exit code

**Adjust Strengths Flow:**

1. `adjustStrengths(targetDir)` reads `usage-log.yaml` and `graph.yaml`
2. Requires 10+ usage log entries before proceeding
3. Counts skill pair co-occurrences and outcomes (success/failed/partial)
4. Adjusts existing edge strengths: +5 for >70% success rate, -10 for >50% failure rate (clamped 10-100)
5. Adds new complementary edges for pairs co-used 3+ times without existing edges
6. Serializes updated graph back to `graph.yaml`

**Graph Visualization Flow:**

1. `generateGraph(targetDir)` parses `registry.yaml` into nodes with domain colors and radii
2. Parses `graph.yaml` into typed, styled edges
3. Returns unified `{ nodes, edges, domains, stats, colors, edgeStyles }` object
4. `graphCommand()` dispatches to format-specific renderer
5. Renderer transforms graph data to output string (HTML/Mermaid/ASCII/JSON)
6. Output is written to file or stdout; HTML auto-opens in browser

**Hook: Drift Detection Flow (PostToolUse on Write|Edit):**

1. `ontology_sync.js` fires when skill files are written/edited
2. Resolves project root from `CLAUDE_PROJECT_DIR` env var or `process.cwd()`
3. Compares `.claude/skills/` directories against `registry.yaml` entries
4. Outputs `ONTOLOGY-DRIFT` messages for new/removed skills
5. For the specific changed file (`CLAUDE_FILE_PATH`), checks token estimate drift (>30% change) and version drift
6. Claude Code rules (`ontology-lifecycle.md`) instruct Claude to act on these messages

**Hook: Skill Tracking Flow (PostToolUse on Skill):**

1. `ontology_track_skill.js` fires when a Skill tool is invoked
2. Extracts skill name from `CLAUDE_TOOL_INPUT` JSON
3. Appends to session tracker file in OS temp directory (`claude-ontology-session.yaml`)
4. Reports cumulative skill usage when 2+ unique skills have been used

**State Management:**
- All state is persisted as YAML files in `{targetDir}/.claude/ontology/`
- Four state files: `registry.yaml` (auto-generated), `graph.yaml` (preserved), `chains.yaml` (preserved), `usage-log.yaml` (append-only)
- `registry.yaml` is regenerated on every build; `graph.yaml` and `chains.yaml` are created once and preserved
- Session tracking state lives in OS temp dir, not in the project

## Key Abstractions

**Skill Entry:**
- Purpose: A registered skill with metadata derived from its `SKILL.md` file
- Examples: Built by `buildRegistry()` in `src/build-registry.js`, parsed by `parseRegistryNodes()` in `src/generate-graph.js`
- Pattern: Has name, version, domain, phase, triggers, invocation, token_estimate
- Domains: `sdlc`, `frontend`, `devops`, `aiquinta`, `backend`, `sdk`, `documentation`, `meta`, `general`
- Phases: `requirements`, `design`, `implementation`, `testing`, `review`, `deployment`, `all`

**Graph Edge:**
- Purpose: A typed, weighted relationship between two skills
- Examples: Parsed by `parseGraphEdges()` in `src/generate-graph.js` and `src/adjust-strengths.js`
- Pattern: `{ from, to, type, strength, note }` with 6 types: `prerequisite`, `complementary`, `alternative`, `orchestrates`, `evolves`, `enhances`
- Strength: Integer 10-100, adjusted by usage patterns

**Graph Data:**
- Purpose: Unified data structure for visualization
- Examples: Returned by `generateGraph()` in `src/generate-graph.js`
- Pattern: `{ nodes[], edges[], domains[], stats, colors, edgeStyles }` consumed by all renderers

**YAML Frontmatter:**
- Purpose: Metadata block in SKILL.md files delimited by `---`
- Examples: Parsed by `parseFrontmatter()` in `src/build-registry.js`
- Pattern: Hand-rolled parser supporting key-value pairs, inline arrays, YAML lists, booleans, numbers, pipe/block scalars, quoted strings, inline comments

**Domain Colors:**
- Purpose: Consistent color palette across all visualization formats
- Examples: `DOMAIN_COLORS` constant in `src/generate-graph.js`, consumed by all three renderers
- Pattern: Map of domain name to `{ hex, name }` pairs

## Entry Points

**CLI Entry (`bin/cli.js`):**
- Location: `bin/cli.js`
- Triggers: `npx skills-ontology <command> [path] [opts]`
- Responsibilities: Parse argv, resolve target path, dispatch to core module function
- Commands: `validate`, `build`, `adjust`, `graph`

**Build Module (`src/build-registry.js`):**
- Location: `src/build-registry.js`
- Triggers: CLI `build` command, also runnable directly (`node src/build-registry.js [path]`)
- Responsibilities: Scan skills, generate registry.yaml, create graph.yaml and chains.yaml skeletons

**Validate Module (`src/validate.js`):**
- Location: `src/validate.js`
- Triggers: CLI `validate` command, also runnable directly, also via `npm run validate`
- Responsibilities: Check ontology consistency, report errors

**Hook: Sync (`hooks/ontology_sync.js`):**
- Location: `hooks/ontology_sync.js`
- Triggers: Claude Code PostToolUse event on Write|Edit tools (configured in `hooks/hooks.json`)
- Responsibilities: Detect ontology drift, report via console output for Claude to act on

**Hook: Track (`hooks/ontology_track_skill.js`):**
- Location: `hooks/ontology_track_skill.js`
- Triggers: Claude Code PostToolUse event on Skill tool (configured in `hooks/hooks.json`)
- Responsibilities: Track skill usage in session temp file, report cumulative usage

## Error Handling

**Strategy:** Fail-fast with console output, return error counts or null

**Patterns:**
- `validate()` returns error count (0 = success), used as process exit code
- `buildRegistry()` returns skill count, prints `"No .claude/skills/ directory found"` and returns 0 when nothing to do
- `generateGraph()` returns `null` when `registry.yaml` is missing, callers must null-check
- `adjustStrengths()` returns `{ adjusted: 0, added: 0 }` when prerequisite files are missing or insufficient data
- Hooks use `findProjectRoot()` with fallback chain: `CLAUDE_PROJECT_DIR` -> `process.cwd()` -> cwd as final fallback
- No try/catch blocks in core modules; filesystem errors propagate as unhandled exceptions
- `tryOpen()` in `src/graph.js` is the one exception: it catches errors from `execSync` for cross-platform browser opening

## Cross-Cutting Concerns

**Logging:** All modules use `console.log()` for informational output and `console.error()` for errors. Hook scripts output structured messages prefixed with `ONTOLOGY-DRIFT:`, `ONTOLOGY-STALE:`, `ONTOLOGY-VERSION:`, `ONTOLOGY-TRACK:` that rules parse to trigger automated responses.

**Validation:** No input validation library. Path resolution uses `path.resolve()`. YAML parsing is regex-based with no schema validation. The `validate.js` module provides post-hoc consistency checking rather than input sanitization.

**Authentication:** Not applicable. This is a local-only tool with no network operations.

**YAML Processing:** Hand-rolled throughout. No YAML library is used. Three separate YAML parsing implementations exist:
- `parseFrontmatter()` in `src/build-registry.js` for SKILL.md frontmatter
- `parseRegistryNodes()` / `parseGraphEdges()` in `src/generate-graph.js` for ontology files
- `parseUsageLog()` / `parseGraphEdges()` in `src/adjust-strengths.js` (duplicated graph edge parser)

**Target Directory Resolution:** All core functions accept `targetDir` as first argument pointing to the target project root. The ontology lives at `{targetDir}/.claude/ontology/` and skills at `{targetDir}/.claude/skills/`. Hooks resolve the target via env vars or cwd.

---

*Architecture analysis: 2026-03-06*
