# CLAUDE.md

## Project Overview

**Skills Ontology** — a cross-platform Claude Code plugin (pure Node.js, zero dependencies) that adds intelligent skill management and retrieval to any project.

## Structure

```
open-plugin/
├── .claude-plugin/
│   └── plugin.json             # Claude plugin manifest (official format)
├── commands/                   # Plugin commands (official format)
│   ├── ontology-build.md
│   ├── ontology-stats.md
│   └── ontology-graph.md
├── hooks/                      # Plugin hooks (official format)
│   ├── hooks.json
│   ├── ontology_sync.js
│   └── ontology_track_skill.js
├── rules/                      # Plugin rules (official format)
│   ├── skill-routing.md
│   └── ontology-lifecycle.md
├── bin/cli.js              # CLI entry (validate|build|adjust|graph)
├── src/
│   ├── build-registry.js   # Scan skills → generate registry.yaml + suggest edges/chains
│   ├── validate.js         # Validate ontology consistency
│   ├── adjust-strengths.js # Auto-adjust graph edge strengths from usage log
│   ├── generate-graph.js   # Core: YAML → { nodes[], edges[] } graph data
│   ├── graph.js            # CLI graph command (format dispatch + file output)
│   └── renderers/
│       ├── html.js         # Self-contained HTML with force-directed SVG
│       ├── mermaid.js      # Mermaid diagram syntax
│       └── ascii.js        # Terminal box-drawing art
├── test/                   # node:test suite (82+ tests)
├── LICENSE                 # MIT
└── .npmignore
```

## Key Decisions

- **CommonJS** — broadest Node.js compatibility (18+), no build step
- **Zero dependencies** — only `fs`, `path`, `os` from Node stdlib
- **Plugin-native layout** — `.claude-plugin/plugin.json` + root `commands/`, `hooks/`, `rules/`
- **Cross-platform hooks** — hook commands execute via `node hooks/*.js`
- **graph.yaml + chains.yaml preserved** — only registry.yaml is auto-regenerated
- **Auto-suggestion** — suggestEdges() and suggestChains() propose initial graph/chain structure

## Test

```bash
npm test                     # Full test suite (node:test)
node bin/cli.js build .
node src/validate.js .
```

## Conventions
- CommonJS (`require`/`module.exports`), `"use strict"`
- No external dependencies — stdlib only
- Hook scripts use `process.cwd()`/`CLAUDE_PROJECT_DIR` to resolve project root
- Tests use `node:test` built-in runner, `node:assert/strict`
