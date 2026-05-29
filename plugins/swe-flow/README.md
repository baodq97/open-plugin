# swe-flow

Reusable software engineering workflow skills for Claude Code agents — goal structuring, task decomposition, planning, and execution patterns that work across any codebase.

## Skills

| Skill | Description |
|-------|-------------|
| `goal-define` | Turn rough user input into a structured, verifiable `/goal` through guided interview |
| `domain-decompose` | Decompose a domain (from a prose description) into bounded contexts, aggregates, entities, value objects, and domain events with ubiquitous-language naming — writes per-context docs into the project's `docs/domain` folder, and on re-run delta-merges into existing docs (stable ids, preserves human edits, flags drops) instead of overwriting |
