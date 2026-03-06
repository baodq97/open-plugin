---
description: Visualize the skills ontology as a graph
allowed-tools: [Bash, Read, Glob]
---

Visualize the skills ontology as a graph.

## Instructions

1. Read `.claude/ontology/registry.yaml` and `.claude/ontology/graph.yaml`.
2. Generate Mermaid `graph LR`:
   - group skills by domain using `subgraph`
   - show edge labels with type and strength
3. Summarize:
   - total skills and edges
   - domain clusters and counts
   - isolated skills
   - strongest/weakest edges
4. If user wants interactive HTML and CLI is available, run:
   ```bash
   npx skills-ontology graph --format=html
   ```
5. Render Mermaid directly in output.
