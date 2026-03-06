# External Integrations

**Analysis Date:** 2026-03-06

## APIs & External Services

**None.** This project has zero external API dependencies. It is a fully self-contained Claude Code plugin that operates entirely on the local filesystem.

## Claude Code Plugin System

**Claude Code Integration (primary integration point):**
- The project integrates with Claude Code via the official plugin format
- Manifest: `.claude-plugin/plugin.json`
- This is not an HTTP API integration; it is a local plugin loaded by Claude Code's runtime

**Plugin Commands (Claude Code slash commands):**
- `/ontology-build` - Defined in `commands/ontology-build.md`
- `/ontology-stats` - Defined in `commands/ontology-stats.md`
- `/ontology-graph` - Defined in `commands/ontology-graph.md`

**Plugin Hooks (PostToolUse event hooks):**
- Configuration: `hooks/hooks.json`
- `Write|Edit` tool matcher -> `node hooks/ontology_sync.js` - Detects drift between skill files and registry
- `Skill` tool matcher -> `node hooks/ontology_track_skill.js` - Tracks skill invocations during sessions

**Plugin Rules (behavioral guidelines for Claude):**
- `rules/skill-routing.md` - Skill loading algorithm and context budget rules
- `rules/ontology-lifecycle.md` - Auto-update rules for ontology synchronization

**Environment Variables from Claude Code Runtime:**
- `CLAUDE_PROJECT_DIR` - Project root directory (read by `hooks/ontology_sync.js`)
- `CLAUDE_FILE_PATH` - Path of file that was just edited (read by `hooks/ontology_sync.js`)
- `CLAUDE_TOOL_INPUT` - JSON input of the tool that was just used (read by `hooks/ontology_track_skill.js`)

## Data Storage

**Databases:**
- None. All data is stored as YAML files on the local filesystem.

**File Storage:**
- Local filesystem only
- Target project's `.claude/ontology/` directory contains all generated data:
  - `registry.yaml` - Skill index
  - `graph.yaml` - Relationship edges
  - `chains.yaml` - Skill sequences
  - `usage-log.yaml` - Usage history
- Target project's `.claude/skills/*/SKILL.md` - Source skill definitions (read-only by this tool)
- Temp directory (`os.tmpdir()`) - Session tracking file `claude-ontology-session.yaml`

**Caching:**
- None. All reads are from filesystem on each invocation.

## Authentication & Identity

**Auth Provider:**
- Not applicable. No authentication required. The plugin runs locally with the user's filesystem permissions.

## Monitoring & Observability

**Error Tracking:**
- None. Errors are reported via `console.log`/`console.error` to stdout/stderr.

**Logs:**
- Console output only (stdout/stderr)
- Hook scripts output prefixed messages: `ONTOLOGY-DRIFT:`, `ONTOLOGY-STALE:`, `ONTOLOGY-VERSION:`, `ONTOLOGY-TRACK:`
- These prefixed messages are consumed by Claude Code rules (`rules/ontology-lifecycle.md`) to trigger automated responses

## CI/CD & Deployment

**Hosting:**
- npm registry (package name: `skills-ontology`)
- Repository: `https://github.com/anthropics/skills-ontology`

**CI Pipeline:**
- Not detected in the repository (no `.github/workflows/`, no CI config files found)

**Distribution:**
- `npm publish` using `files` field in `package.json` to control included files
- `.npmignore` excludes: `.git`, `.gitignore`, `test/`, `docs/`, `.github/`, `*.test.js`

## Environment Configuration

**Required env vars:**
- None required for CLI usage (`npx skills-ontology build .`)
- When running as Claude Code hooks, these are provided automatically by the Claude Code runtime:
  - `CLAUDE_PROJECT_DIR` (optional, fallback to `process.cwd()`)
  - `CLAUDE_FILE_PATH` (optional, used for token estimate drift detection)
  - `CLAUDE_TOOL_INPUT` (optional, used for skill name extraction)

**Secrets location:**
- Not applicable. No secrets, API keys, or credentials are used.

## Webhooks & Callbacks

**Incoming:**
- None. The plugin is invoked via Claude Code's hook system (local process execution, not HTTP).

**Outgoing:**
- None. No outbound HTTP requests are made.

## Browser Integration

**HTML Graph Viewer:**
- `src/graph.js` uses `child_process.execSync` to open generated HTML in the default browser
- Cross-platform: `open` (macOS), `start` (Windows), `xdg-open` (Linux)
- Best-effort; silently falls back to printing file URL on failure
- Can be disabled with `--no-open` flag

## YAML Handling (Custom, Not External)

The project implements its own lightweight YAML parsing throughout:
- `src/build-registry.js` - `parseFrontmatter()` parses YAML frontmatter from `---` delimited blocks
- `src/adjust-strengths.js` - `parseUsageLog()` and `parseGraphEdges()` parse YAML structures via regex
- `src/generate-graph.js` - `parseRegistryNodes()` and `parseGraphEdges()` parse YAML via regex
- `src/validate.js` - Multiple regex-based YAML extractors for registry, graph, and chain files

This is a deliberate design choice to maintain zero dependencies, but means only a subset of YAML syntax is supported.

---

*Integration audit: 2026-03-06*
