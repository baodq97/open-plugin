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
│   ├── profile-playbook/              # SFIA 9 Profile Playbook (unified, 9 roles)
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/                    # 9 auto-activating skills (1 per role)
│   │   │   ├── sa-playbook/           # Solution Architecture
│   │   │   ├── po-playbook/           # Product Owner
│   │   │   ├── ba-playbook/           # Business Analysis
│   │   │   ├── testing-playbook/      # Testing
│   │   │   ├── pm-playbook/           # Project Management
│   │   │   ├── ea-playbook/           # Enterprise Architecture
│   │   │   ├── cio-playbook/          # CIO / IT Leadership
│   │   │   ├── cto-playbook/          # CTO / Technology Leadership
│   │   │   └── cpo-playbook/          # CPO / Product Leadership
│   │   ├── commands/                  # 5 shared commands (start, assess, coach, next, status)
│   │   └── agents/                    # 2 shared agents (profile-guide, profile-reviewer)
│   ├── skills-ontology/              # Skills Ontology plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/
│   │   ├── hooks/
│   │   ├── rules/
│   │   ├── src/
│   │   ├── bin/
│   │   └── test/
│   └── chom/                         # chom GitHub skill installer v1.0
│       ├── .claude-plugin/plugin.json
│       ├── skills/
│       │   └── chom/                 # Single chom skill
│       │       └── SKILL.md
│       └── README.md
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

### profile-playbook plugin
- Pure skill/agent definitions (markdown + YAML frontmatter)
- No code dependencies
- Multi-skill architecture: 9 role-specific skills share 5 commands and 2 agents
- Each skill auto-activates based on trigger keywords in its SKILL.md description
- Commands/agents read `state.yaml` → `role` field to load the correct skill's references
- Session workspace: `.profile-playbook/sessions/{CODE}-{PROJECT}-{YYYYMMDD}-{SEQ}/`
- Roles: sa, po, ba, testing, pm, ea, cio, cto, cpo

### chom plugin
- Pure skill definition (markdown + YAML frontmatter) — single `SKILL.md`, no code, no agents, no commands, no hooks
- The skill teaches Claude how to sparse-clone a target skill folder from a GitHub URL, copy only that folder into `~/.claude/skills/<name>/`, and clean up the temp dir via a `trap` so aborts don't leave artifacts
- Install scope is strictly user-level — the skill refuses to install into plugin dirs, the CWD, or anywhere outside `~/.claude/skills/`
- Supports three URL shapes: `tree/REF/PATH` (subfolder skills), `blob/REF/PATH/SKILL.md` (strip filename), and mono-skill repos (whole repo is the skill). Gist / raw / ZIP URLs are rejected
- Optional light-description optimization is opt-in only; heavy optimization (eval loop) defers to `skill-creator`

## Test

```bash
cd plugins/skills-ontology && npm test
```
