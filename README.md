# open-plugins — Claude Code Plugin Marketplace

Open-source plugin marketplace for Claude Code.

## Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [vbounce](plugins/vbounce/) | 2.0.0 | V-Bounce AI-Native SDLC Orchestrator — 9 sub-agents for requirements, design, implementation, review, testing, deployment, knowledge, quality gates, and traceability |
| [skills-ontology](plugins/skills-ontology/) | 1.2.0 | Intelligent skill management — turns flat skill directories into a structured knowledge graph with routing, chaining, and usage tracking |

## Install

### Browse marketplace

```bash
# Add as known marketplace, then browse
claude plugin browse --marketplace <this-repo-url>
```

### Install a specific plugin

```bash
claude plugin install --from <this-repo-url> vbounce
claude plugin install --from <this-repo-url> skills-ontology
```

## Repository Structure

```
.
├── .claude-plugin/
│   └── marketplace.json          # Marketplace manifest
├── plugins/
│   ├── vbounce/                  # V-Bounce SDLC Orchestrator
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/               # 10 skills (orchestrator + 9 sub-agents)
│   │   └── agents/               # 9 agents
│   └── skills-ontology/          # Skills Ontology
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       ├── hooks/
│       ├── rules/
│       ├── src/
│       └── bin/
├── README.md
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
