---
description: Rebuild the skills ontology from source skill files
allowed-tools: [Bash, Read, Write, Glob]
---

Rebuild the skills ontology from source skill files.

## Instructions

1. If CLI is available, run:
   ```bash
   npx skills-ontology build .
   ```
   If not available, update `.claude/ontology/registry.yaml` manually from `.claude/skills/*/SKILL.md`.

2. Validate output consistency:
   - `.claude/ontology/graph.yaml` has no edges to missing skills
   - `.claude/ontology/chains.yaml` references only existing skills

3. If graph has no edges, suggest 3-5 initial edges based on:
   - Shared `domain` -> `complementary`
   - Sequential `phase` -> `prerequisite`
   - Coordinator skills -> `orchestrates`

4. Report:
   - total skills
   - new/removed skills
   - graph coverage gaps

Do not modify `.claude/ontology/usage-log.yaml` unless user explicitly asks.
