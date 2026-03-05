Visualize the skills ontology as an interactive graph.

## Instructions

1. Read `.claude/ontology/registry.yaml` and `.claude/ontology/graph.yaml`

2. Generate a Mermaid diagram showing the skills graph inline:
   - Group skills by domain into subgraphs
   - Show edges with type labels and strength scores
   - Use `graph LR` layout for readability

3. Present a summary:
   - Total skills and edges
   - Domain clusters with skill counts
   - Isolated skills (no edges)
   - Strongest and weakest connections

4. If the user wants an interactive view, run:
   ```bash
   node .claude/hooks/build_registry.js
   npx skills-ontology graph
   ```
   This rebuilds the registry and opens the interactive HTML visualization.

5. The Mermaid diagram should follow this structure:
   ```mermaid
   graph LR
     subgraph domain_name["DOMAIN"]
       skill_a["skill-a"]
       skill_b["skill-b"]
     end
     skill_a -->|"prerequisite (80)"| skill_b
     skill_a ---|"complementary (60)"| skill_c
   ```

Present the Mermaid diagram directly so it renders inline in Claude's output.
