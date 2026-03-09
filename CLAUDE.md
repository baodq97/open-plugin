# CLAUDE.md

## Project Overview

**open-plugins** — an open-source Claude Code plugin marketplace containing multiple plugins.

## Structure

```
open-plugins/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace manifest (lists all plugins)
├── plugins/
│   ├── vbounce/                      # V-Bounce AI-Native SDLC Orchestrator v5.1
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/
│   │   │   └── vbounce/              # Orchestrator: state machine + contracts + dispatch
│   │   │       ├── SKILL.md
│   │   │       └── references/       # 16 shared reference files
│   │   ├── commands/                  # 8 slash commands
│   │   │   ├── start.md, status.md, approve.md
│   │   │   ├── bugfix.md, hotfix.md, cr.md
│   │   │   └── skip.md, rollback.md
│   │   ├── agents/                   # 12 agents (req, design, impl, review, deploy, KC, trace, 4x QG, testing)
│   │   └── scripts/                  # Utility scripts
│   │       ├── verify_packages.sh
│   │       └── trace-matrix.py
│   ├── design-thinking/              # Design Thinking PRD Generator v1.0
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/
│   │   │   └── design-thinking/      # Orchestrator: state machine + conversation guides
│   │   │       ├── SKILL.md
│   │   │       └── references/       # 10 shared reference files
│   │   ├── commands/                  # 6 slash commands (start, status, approve, revisit, export, handoff)
│   │   └── agents/                   # 6 agents (empathy, define, ideate, prototype, prd, QG)
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

### design-thinking plugin
- Pure skill/agent definitions (markdown + YAML frontmatter)
- No code dependencies
- Produces vbounce-compatible PRDs (couples only on PRD file format)

## Test

```bash
cd plugins/skills-ontology && npm test
```
