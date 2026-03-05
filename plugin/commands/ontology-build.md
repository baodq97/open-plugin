Rebuild the skills ontology from source skill files.

## Instructions

1. Scan all `.claude/skills/*/SKILL.md` and `.claude/skills/*/skill.md` files
2. For each skill, extract from YAML frontmatter: name, version, description
3. Infer from description + body: domain, phase, input_type, output_type, triggers
4. Count file lines and estimate tokens (lines * 4)
5. Regenerate `.claude/ontology/registry.yaml` with all skills
6. Validate `.claude/ontology/graph.yaml` — flag any edges referencing missing skills
7. Validate `.claude/ontology/chains.yaml` — flag any chains with missing skills
8. Report: total skills found, new skills added, removed skills, graph coverage gaps

Do NOT modify `graph.yaml` or `chains.yaml` automatically — only report issues for manual review. Do NOT touch `usage-log.yaml`.
