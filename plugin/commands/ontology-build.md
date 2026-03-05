Rebuild the skills ontology from source skill files.

## Instructions

1. Run the automated registry builder first:
   ```bash
   node .claude/hooks/build_registry.js
   ```
   This scans all `.claude/skills/*/SKILL.md` files, extracts frontmatter, and regenerates `.claude/ontology/registry.yaml`.

2. Review the console output for skill count, graph status, and chains status.

3. Validate the generated ontology:
   - Check `.claude/ontology/graph.yaml` — flag any edges referencing missing skills
   - Check `.claude/ontology/chains.yaml` — flag any chains with missing skills
   - If graph.yaml has suggested edges (from auto-generation), review and refine them

4. If graph.yaml is empty or has no edges, suggest 3-5 initial edges based on:
   - Skills sharing the same `domain` → `complementary` edges
   - Skills in sequential `phase` order → `prerequisite` edges
   - Skills that orchestrate others → `orchestrates` edges

5. Report: total skills found, new skills added, removed skills, graph coverage gaps.

Do NOT modify `usage-log.yaml`. Only modify `graph.yaml` or `chains.yaml` if explicitly asked — otherwise report suggestions for manual review.
