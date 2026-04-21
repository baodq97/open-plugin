# open-plugins — Claude Code Plugin Marketplace

Open-source plugin marketplace for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [vbounce](plugins/vbounce/) | 5.1.0 | V-Bounce AI-Native SDLC Orchestrator — 12 agents with unified TDD, per-phase QG, mixed-model assignment, and tech-aware context injection |
| [design-thinking](plugins/design-thinking/) | 1.0.0 | Design Thinking PRD Generator — guides users from pain points through Empathize, Define, Ideate, Prototype to produce vbounce-compatible PRDs |
| [profile-playbook](plugins/profile-playbook/) | 1.0.0 | SFIA 9 Profile Playbook — 9 role-based playbooks (SA, PO, BA, Testing, PM, EA, CIO, CTO, CPO) with phase-based workflows, inline SFIA coaching, and competency assessment |
| [skills-ontology](plugins/skills-ontology/) | 1.2.0 | Intelligent skill management — turns flat skill directories into a structured knowledge graph with routing, chaining, and usage tracking |
| [chom](plugins/chom/) | 1.0.0 | Install Claude Code skills from GitHub URLs — clones to a temp dir, copies only the target skill folder into `~/.claude/skills/`, cleans up, and optionally rewrites the skill's description for better auto-triggering |

## Install

### Add marketplace

```bash
claude plugin marketplace add https://github.com/baodq97/open-plugin
```

### Install a specific plugin

```bash
claude plugin install vbounce
claude plugin install design-thinking
claude plugin install profile-playbook
claude plugin install skills-ontology
claude plugin install chom
```

## Repository Structure

```
.
├── .claude-plugin/
│   └── marketplace.json          # Marketplace manifest
├── plugins/
│   ├── vbounce/                  # V-Bounce SDLC Orchestrator v5.1
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/               # Orchestrator skill + 16 shared references
│   │   ├── agents/               # 12 agents (req, design, impl, review, deploy, KC, trace, 4x QG, testing)
│   │   └── commands/             # 8 slash commands
│   ├── design-thinking/           # Design Thinking PRD Generator v1.0
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/               # Orchestrator skill + 10 shared references
│   │   ├── agents/               # 6 agents (empathy, define, ideate, prototype, prd, QG)
│   │   └── commands/             # 6 slash commands
│   ├── profile-playbook/         # SFIA 9 Profile Playbook v1.0
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/               # 9 role-specific skills (SA, PO, BA, Testing, PM, EA, CIO, CTO, CPO)
│   │   ├── agents/               # 2 shared agents (profile-guide, profile-reviewer)
│   │   └── commands/             # 5 shared commands (start, assess, coach, next, status)
│   ├── skills-ontology/          # Skills Ontology v1.2
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   ├── hooks/
│   │   ├── rules/
│   │   ├── src/
│   │   └── bin/
│   └── chom/                     # chom GitHub skill installer v1.0
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── skills/               # Single chom skill (SKILL.md)
│       └── README.md
├── README.md
├── .gitignore
└── LICENSE
```

## Contributing

Each plugin lives in its own `plugins/<name>/` directory with a `.claude-plugin/plugin.json` manifest. To add a new plugin:

1. Create `plugins/<your-plugin>/`
2. Add `.claude-plugin/plugin.json` with name, description, version
3. Add your commands, hooks, rules, skills, and agents
4. Register it in `.claude-plugin/marketplace.json`

## License

MIT
