# CLAUDE.md

## Project Overview

**Skills Ontology** — a cross-platform Claude Code plugin (pure Node.js, zero dependencies) that adds intelligent skill management and retrieval to any project.

## Structure

```
open-plugin/
├── install.js              # Install into target project
├── uninstall.js            # Clean removal
├── bin/cli.js              # CLI entry (install|uninstall|validate|build)
├── src/
│   ├── build-registry.js   # Scan skills → generate registry.yaml
│   ├── patch-settings.js   # Merge hooks into settings.local.json
│   └── validate.js         # Validate ontology consistency
├── plugin/                 # Files copied into target .claude/
│   ├── hooks/
│   │   ├── ontology_sync.js         # Drift detection
│   │   └── ontology_track_skill.js  # Usage tracking
│   ├── rules/
│   │   ├── skill-routing.md         # Routing algorithm
│   │   └── ontology-lifecycle.md    # Auto-update rules
│   ├── commands/
│   │   └── ontology-build.md        # /ontology-build
│   └── ontology/                    # YAML templates
```

## Key Decisions

- **CommonJS** — broadest Node.js compatibility (18+), no build step
- **Zero dependencies** — only `fs`, `path`, `os` from Node stdlib
- **`__dirname` in hooks** — resolves project root without `git` or env vars
- **Idempotent** — install.js won't duplicate hooks or overwrite graph/chains
- **graph.yaml + chains.yaml preserved** — only registry.yaml is auto-regenerated

## Test

```bash
node install.js /tmp/test-project
node src/validate.js /tmp/test-project
node uninstall.js /tmp/test-project
```

## Conventions
- CommonJS (`require`/`module.exports`), `"use strict"`
- No external dependencies — stdlib only
- Hook scripts use `__dirname` to find project root (no shell-specific commands)
