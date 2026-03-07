# CLAUDE.md

## Project Overview

**open-plugins** — an open-source Claude Code plugin marketplace containing multiple plugins.

## Structure

```
open-plugins/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace manifest (lists all plugins)
├── plugins/
│   ├── vbounce/                      # V-Bounce AI-Native SDLC Orchestrator v4.0
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/
│   │   │   └── vbounce/              # Orchestrator: state machine + contracts + dispatch
│   │   │       ├── SKILL.md
│   │   │       └── references/       # 15 shared reference files
│   │   ├── commands/                  # 8 slash commands
│   │   │   ├── start.md, status.md, approve.md
│   │   │   ├── bugfix.md, hotfix.md, cr.md
│   │   │   └── skip.md, rollback.md
│   │   ├── agents/                   # 9 self-contained agents with contracts
│   │   │   ├── requirements-analyst.md
│   │   │   ├── design-architect.md
│   │   │   ├── implementation-engineer.md
│   │   │   ├── review-auditor.md
│   │   │   ├── testing-engineer.md
│   │   │   ├── deployment-engineer.md
│   │   │   ├── quality-gate-validator.md
│   │   │   ├── traceability-analyst.md
│   │   │   └── knowledge-curator.md
│   │   └── scripts/                  # Utility scripts
│   │       ├── verify_packages.sh
│   │       └── trace-matrix.py
│   └── skills-ontology/              # Skills Ontology plugin
│       ├── .claude-plugin/plugin.json
│       ├── commands/
│       ├── hooks/
│       ├── rules/
│       ├── src/
│       ├── bin/
│       └── test/
├── LICENSE
└── .npmignore
```

## Key Decisions

- **Marketplace-first** — repo is a plugin marketplace, each plugin is self-contained under `plugins/`
- **Each plugin has its own `.claude-plugin/plugin.json`**
- **Root `marketplace.json`** registers all plugins with name, description, source path, category

## Conventions

### skills-ontology plugin
- CommonJS (`require`/`module.exports`), `"use strict"`
- No external dependencies — stdlib only
- Tests use `node:test` built-in runner

### vbounce plugin
- Pure skill/agent definitions (markdown + YAML frontmatter)
- No code dependencies

## Test

```bash
cd plugins/skills-ontology && npm test
```
