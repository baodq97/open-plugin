# Technology Stack

**Analysis Date:** 2026-03-06

## Languages

**Primary:**
- JavaScript (CommonJS) - All source, hooks, CLI, renderers, and tests

**Secondary:**
- HTML/CSS/SVG - Inline in `src/renderers/html.js` for self-contained graph visualization
- YAML (hand-rolled parser) - Data format for registry, graph, chains, and usage logs; parsed with regex, not a library
- Markdown - Plugin commands (`commands/*.md`), rules (`rules/*.md`), and skill file format (`SKILL.md`)

## Runtime

**Environment:**
- Node.js >= 18 (declared in `package.json` `engines` field)
- Detected local version: v24.13.0

**Package Manager:**
- npm (implied by `package.json` structure)
- Lockfile: **missing** (no `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`)
- `node_modules`: **absent** (zero external dependencies, nothing to install)

## Frameworks

**Core:**
- None - This is a zero-dependency project using only Node.js stdlib

**Testing:**
- `node:test` (built-in) - Node.js native test runner
- `node:assert/strict` (built-in) - Assertion library

**Build/Dev:**
- None - No build step, no transpilation, no bundling; source ships directly as CommonJS

## Key Dependencies

**Critical:**
- None. The project has **zero external dependencies** (no `dependencies` or `devDependencies` in `package.json`).

**Node.js Stdlib Modules Used:**
- `fs` - File system operations (read/write YAML files, skill directories)
- `path` - Cross-platform path resolution
- `os` - Temp directory for session tracking (`os.tmpdir()`)
- `child_process` - `execSync` in `src/graph.js` for opening HTML in browser
- `node:test` - Built-in test runner (test files only)
- `node:assert/strict` - Assertions (test files only)

## Configuration

**Environment Variables (runtime, not secrets):**
- `CLAUDE_PROJECT_DIR` - Used by hooks (`hooks/ontology_sync.js`) to locate project root
- `CLAUDE_FILE_PATH` - Used by `hooks/ontology_sync.js` to identify the changed file
- `CLAUDE_TOOL_INPUT` - Used by `hooks/ontology_track_skill.js` to extract skill name from JSON

**Build:**
- No build configuration files exist
- No TypeScript, no Babel, no Webpack/Vite/esbuild
- CommonJS `require`/`module.exports` throughout

**Plugin Manifest:**
- `.claude-plugin/plugin.json` - Claude Code plugin manifest declaring name, version, description, license

**Hooks Configuration:**
- `hooks/hooks.json` - Declares PostToolUse hooks: `Write|Edit` triggers `ontology_sync.js`, `Skill` triggers `ontology_track_skill.js`

**npm Configuration:**
- `package.json` - Standard npm manifest with `bin`, `files`, `scripts`, `engines`
- `.npmignore` - Excludes `.git`, `.gitignore`, `test/`, `docs/`, `.github/`, `*.test.js` from published package

## CLI Interface

**Binary:** `skills-ontology` (declared as `bin` in `package.json`, entry point `bin/cli.js`)

**Commands:**
- `npx skills-ontology build [path]` - Rebuild registry from skill files
- `npx skills-ontology validate [path]` - Validate ontology consistency
- `npx skills-ontology adjust [path]` - Auto-adjust graph edge strengths from usage log
- `npx skills-ontology graph [path] [opts]` - Visualize ontology graph

**Graph Output Formats:**
- `--format=html` (default) - Self-contained HTML with force-directed SVG (`src/renderers/html.js`)
- `--format=mermaid` - Mermaid diagram syntax (`src/renderers/mermaid.js`)
- `--format=ascii` - Terminal box-drawing art (`src/renderers/ascii.js`)
- `--format=json` - Raw JSON graph data

## npm Scripts

```bash
npm test                    # node --test --test-concurrency=1 test/*.test.js
npm run validate            # node src/validate.js
```

## Platform Requirements

**Development:**
- Node.js >= 18
- No OS-specific requirements; cross-platform by design
- No installation step needed (zero deps)

**Production/Distribution:**
- Published as npm package (`npx skills-ontology`)
- Can be installed as a Claude Code plugin via `.claude-plugin/plugin.json`
- Cross-platform browser opening: macOS (`open`), Windows (`start`), Linux (`xdg-open`)

## Data Files (Generated at Runtime)

The project generates/reads these YAML files in a target project's `.claude/ontology/` directory:
- `registry.yaml` - Machine-readable skill index (auto-generated)
- `graph.yaml` - Skill relationship edges (auto-suggested, user-refinable)
- `chains.yaml` - Pre-defined skill sequences (auto-suggested, user-refinable)
- `usage-log.yaml` - Session tracking and outcomes (appended by hooks)

Session tracking uses a temp file: `{os.tmpdir()}/claude-ontology-session.yaml`

---

*Stack analysis: 2026-03-06*
