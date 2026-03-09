# open-plugins — Claude Code Plugin Marketplace

Open-source plugin marketplace for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [vbounce](plugins/vbounce/) | 5.1.0 | V-Bounce AI-Native SDLC Orchestrator — 12 agents with unified TDD, per-phase QG, mixed-model assignment, and tech-aware context injection |
| [skills-ontology](plugins/skills-ontology/) | 1.2.0 | Intelligent skill management — turns flat skill directories into a structured knowledge graph with routing, chaining, and usage tracking |

## Install

### Browse marketplace

```bash
# Add as known marketplace, then browse
claude plugin browse --marketplace https://github.com/baodq97/open-plugin.git
```

### Install a specific plugin

```bash
claude plugin install --from https://github.com/baodq97/open-plugin.git vbounce
claude plugin install --from https://github.com/baodq97/open-plugin.git skills-ontology
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
│   └── skills-ontology/          # Skills Ontology v1.2
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       ├── hooks/
│       ├── rules/
│       ├── src/
│       └── bin/
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
