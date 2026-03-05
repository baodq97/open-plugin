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
├── install.js              # Install into target project
├── uninstall.js            # Clean removal
├── bin/cli.js              # CLI entry (install|uninstall|validate|build|adjust)
├── src/
│   ├── build-registry.js   # Scan skills → generate registry.yaml + suggest edges/chains
│   ├── patch-settings.js   # Merge hooks into settings.local.json (cross-platform)
│   ├── validate.js         # Validate ontology consistency
│   ├── adjust-strengths.js # Auto-adjust graph edge strengths from usage log
│   ├── generate-graph.js   # Core: YAML → { nodes[], edges[] } graph data
│   ├── graph.js            # CLI graph command (format dispatch + file output)
│   └── renderers/
│       ├── html.js         # Self-contained HTML with force-directed SVG
│       ├── mermaid.js      # Mermaid diagram syntax
│       └── ascii.js        # Terminal box-drawing art
├── plugin/                 # Legacy template source for installer mode
│   ├── hooks/
│   │   ├── ontology_sync.js         # Drift + version detection
│   │   └── ontology_track_skill.js  # Usage tracking
│   ├── rules/
│   │   ├── skill-routing.md         # Routing algorithm
│   │   └── ontology-lifecycle.md    # Auto-update rules
│   ├── commands/
│   │   ├── ontology-build.md        # /ontology-build
│   │   ├── ontology-stats.md        # /ontology-stats
│   │   └── ontology-graph.md        # /ontology-graph
│   └── ontology/                    # YAML templates
├── test/                   # node:test suite (82+ tests)
├── LICENSE                 # MIT
└── .npmignore
```

## Key Decisions

- **CommonJS** — broadest Node.js compatibility (18+), no build step
- **Zero dependencies** — only `fs`, `path`, `os` from Node stdlib
- **Cross-platform hooks** — `node -e "try{require(...)}catch{}"` (works on bash, cmd, powershell)
- **Idempotent** — install.js won't duplicate hooks or overwrite graph/chains
- **graph.yaml + chains.yaml preserved** — only registry.yaml is auto-regenerated
- **Auto-suggestion** — suggestEdges() and suggestChains() propose initial graph/chain structure

## Test

```bash
npm test                     # Full test suite (node:test)
node install.js /tmp/test    # Manual install test
node src/validate.js /tmp/test
node uninstall.js /tmp/test
```

## Conventions
- CommonJS (`require`/`module.exports`), `"use strict"`
- No external dependencies — stdlib only
- Hook scripts use `__dirname` to find project root (no shell-specific commands)
- Tests use `node:test` built-in runner, `node:assert/strict`
