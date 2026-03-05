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

## Install

```bash
git clone <this-repo>
cd <repo-folder>

# Install into any Claude Code project
node install.js /path/to/your-project
```

Or with the CLI:
```bash
node bin/cli.js install /path/to/your-project
```

The installer:
1. Copies hooks, rules, commands into `.claude/`
2. Scans existing skills and builds `registry.yaml`
3. Creates skeleton `graph.yaml` and `chains.yaml`
4. Patches `settings.local.json` with PostToolUse hooks

## Uninstall

```bash
node uninstall.js /path/to/your-project
```

Removes all ontology files, hooks, and rules. Your skills are untouched.

## How it works

### Files installed into your project

```
.claude/
  ontology/
    registry.yaml              # Machine-readable index of all skills
    graph.yaml                 # Relationship graph (prerequisite, complementary, etc.)
    chains.yaml                # Pre-defined skill sequences
    usage-log.yaml             # Append-only usage tracking
  hooks/
    ontology_sync.js           # Detects drift when skill files change
    ontology_track_skill.js    # Tracks skill usage per session
    build_registry.js          # Rebuilds registry from skill sources
  rules/
    skill-routing.md           # Routing algorithm (always in Claude's context)
    ontology-lifecycle.md      # Auto-update behavioral rules
  commands/
    ontology-build.md          # /ontology-build slash command
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
node install.js [path]           # Install plugin
node uninstall.js [path]         # Remove plugin
node src/validate.js [path]      # Validate ontology
node src/build-registry.js [path] # Rebuild registry only
```

## Requirements

- Node.js >= 18
- git (for project root detection in hooks)
