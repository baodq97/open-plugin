# Skill Routing

Skills are indexed in `.claude/ontology/` — load on demand, not upfront.

## Routing Algorithm
1. **Explicit invocation** (`/skill-name`) — load that skill directly
2. **Chain match** — check `.claude/ontology/chains.yaml` for task pattern match
3. **Registry match** — search `.claude/ontology/registry.yaml` by domain/phase/triggers
4. **Graph walk** — check `.claude/ontology/graph.yaml` for prerequisites/complements

## Context Budget
Before loading a chain, sum `token_estimate` from registry. If total > 5000 tokens, use progressive disclosure — load skills one at a time as each phase completes.

## Post-Session Tracking
After a session using 2+ skills, append an entry to `.claude/ontology/usage-log.yaml`.
