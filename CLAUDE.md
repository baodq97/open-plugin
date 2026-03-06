# CLAUDE.md

## Project Overview

**open-plugins** — an open-source Claude Code plugin marketplace containing multiple plugins.

## Structure

```
open-plugins/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace manifest (lists all plugins)
├── plugins/
│   ├── vbounce/                      # V-Bounce AI-Native SDLC Orchestrator
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/                   # 10 skills (orchestrator + 9 sub-agents)
│   │   │   ├── vbounce/              # Main orchestrator + workflow references
│   │   │   ├── vbounce-requirements/
│   │   │   ├── vbounce-design/
│   │   │   ├── vbounce-implementation/
│   │   │   ├── vbounce-review/
│   │   │   ├── vbounce-testing/
│   │   │   ├── vbounce-deployment/
│   │   │   ├── vbounce-knowledge/
│   │   │   ├── vbounce-quality-gate/
│   │   │   └── vbounce-traceability/
│   │   └── agents/                   # 9 agents
│   │       ├── deployment-engineer.md
│   │       ├── design-architect.md
│   │       ├── implementation-engineer.md
│   │       ├── knowledge-curator.md
│   │       ├── quality-gate-validator.md
│   │       ├── requirements-analyst.md
│   │       ├── review-auditor.md
│   │       ├── testing-engineer.md
│   │       └── traceability-analyst.md
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
