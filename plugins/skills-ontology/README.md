# skills-ontology — Intelligent Skill Management

Manages skill registries, relationship graphs, and usage tracking for Claude Code. Turns flat skill directories into a structured knowledge graph with routing, chaining, and usage tracking.

## Install

```bash
claude plugin install --from https://github.com/baodq97/open-plugin.git skills-ontology
```

## Components

### Commands

| Command | Description |
|---------|-------------|
| `/ontology-build` | Rebuild the skills ontology from source skill files |
| `/ontology-graph` | Visualize the skills ontology as a graph |
| `/ontology-stats` | Analyze skills usage patterns from the usage log |

### Hooks

| Event | Matcher | Action |
|-------|---------|--------|
| PostToolUse | Write, Edit | Detect drift between skill files and registry |
| PostToolUse | Skill | Track skill invocations during a session |

### Rules

- **skill-routing** - Routing algorithm for skill lookup (explicit > chain > registry > graph walk)
- **ontology-lifecycle** - Auto-update rules for keeping ontology in sync

## CLI

```bash
npx skills-ontology build .       # Build registry from skill files
npx skills-ontology validate .    # Validate ontology consistency
npx skills-ontology adjust .      # Adjust graph strengths from usage data
npx skills-ontology graph .       # Generate visual graph (HTML/Mermaid/ASCII)
```

## How It Works

1. Skills live in `.claude/skills/*/SKILL.md`
2. `ontology-build` scans them into `.claude/ontology/registry.yaml`
3. Relationships are defined in `.claude/ontology/graph.yaml`
4. Chains (multi-skill workflows) are defined in `.claude/ontology/chains.yaml`
5. Hooks detect drift and track usage automatically
6. `ontology-stats` analyzes patterns and suggests edge tuning

## Development

```bash
cd plugins/skills-ontology
npm test    # 97 tests, node:test runner
```

No external dependencies. Node.js >= 18.

## License

MIT
