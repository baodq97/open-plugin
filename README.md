# Skills Ontology — Claude Code Plugin

Intelligent skill management and retrieval for Claude Code. Turns flat `.claude/skills/` directories into a structured, self-updating knowledge graph with routing, chaining, and usage tracking.

**Cross-platform** — pure Node.js (zero dependencies), works on Windows, macOS, and Linux.

## What it does

| Without ontology | With ontology |
|---|---|
| Skills are flat files, no relationships | Skills connected by 6 relationship types |
| Claude guesses which skill to use | 4-step routing: explicit > chain > registry > graph |
| No skill chaining guidance | Pre-defined chains for common workflows |
| No token budgeting | `token_estimate` per skill, progressive disclosure |
| No usage tracking | Append-only log with outcome tracking |
| Manual catalog maintenance | Auto-sync hooks detect drift on every file edit |

## Install (Claude plugin standard)

```bash
git clone <this-repo>
cd <repo-folder>

# Load plugin directly (recommended)
claude --plugin-dir .
```

Plugin metadata is in:

- `.claude-plugin/plugin.json`
- `commands/`
- `hooks/` (`hooks/hooks.json` + scripts)
- `rules/`

## How it works

### Claude plugin structure (in this repository)

```text
.claude-plugin/
  plugin.json
commands/
  ontology-build.md
  ontology-stats.md
  ontology-graph.md
hooks/
  hooks.json
  ontology_sync.js
  ontology_track_skill.js
rules/
  skill-routing.md
  ontology-lifecycle.md
```

### Ontology files (in target project)

```
.claude/
  ontology/
    registry.yaml              # Machine-readable index of all skills
    graph.yaml                 # Relationship graph (prerequisite, complementary, etc.)
    chains.yaml                # Pre-defined skill sequences
    usage-log.yaml             # Append-only usage tracking
  # populated by build command + hooks during usage
```

### Auto-update loops

**Skill file changes** — When you edit `.claude/skills/*`, the sync hook detects new/removed/stale skills and outputs `ONTOLOGY-DRIFT`. Claude sees this and updates the registry.

**Usage tracking** — When 2+ skills are used via the Skill tool, the track hook outputs `ONTOLOGY-TRACK`. Claude logs the session to `usage-log.yaml`.

**Strength adjustment** — After 10+ entries accumulate, the lifecycle rules guide Claude to strengthen/weaken graph edges based on outcomes.

### Routing algorithm

1. **Explicit** — `/skill-name` loads directly
2. **Chain match** — task keywords match a chain in `chains.yaml`
3. **Registry match** — domain/phase/triggers search in `registry.yaml`
4. **Graph walk** — follow prerequisite/complementary edges

### Relationship types

| Type | Meaning |
|------|---------|
| `prerequisite` | A must run before B |
| `complementary` | Work well together |
| `alternative` | Choose one, not both |
| `orchestrates` | A invokes/coordinates B |
| `evolves` | B is newer version of A |
| `enhances` | A adds quality to B's output |

## Commands

```bash
claude --plugin-dir .            # Run as plugin-native mode
node bin/cli.js build [path]     # Rebuild registry
node bin/cli.js adjust [path]    # Auto-adjust graph strengths
node bin/cli.js graph [path]     # Visualize graph
node src/validate.js [path]      # Validate ontology
node src/build-registry.js [path] # Rebuild registry only
```

## Requirements

- Node.js >= 18
- git (for project root detection in hooks)
