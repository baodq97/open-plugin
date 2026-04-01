---
description: Get coaching on a specific SFIA skill or overview of all PO-relevant skills
argument-hint: "[SFIA skill code, e.g., PROD, DEMG, RLMT]"
allowed-tools: [Read]
---

Provide coaching on SFIA skills for Product Ownership.

## Instructions

1. Load skill descriptions from `references/sfia-skill-map.md`
2. Load coaching prompts from `references/coaching-prompts.md`

**If a skill code is provided** (e.g., `PROD`):
- Show the skill name, category, and overall description
- Show level descriptions for levels 4, 5, and 6 (the PO-relevant range)
- Explain the key transitions:
  - L3 → L4: what changes
  - L4 → L5: what changes
  - L5 → L6: what changes
- Provide practical exercises to build competency at each level
- Give examples of good vs. insufficient output at each level

**If no skill code provided:**
- Show an overview table of all PO-relevant SFIA skills with:
  - Skill name and code
  - Level range for PO role
  - One-line description of what it means for PO work
- Ask the user which skill they want to deep-dive into

**Practical exercises by skill** (examples):

- **PROD**: "Take your current product. Write the vision statement in elevator pitch format. Can you articulate the key differentiator in one sentence?"
- **REQM**: "Write 5 user stories for your most important feature. Each must have measurable acceptance criteria using Given/When/Then format."
- **RLMT**: "Map all stakeholders for your product. For each, write their top concern and preferred communication channel."
- **DEMG**: "Define go/no-go criteria for your next release. Include at least 3 quality gates."
- **MEAS**: "Define your North Star metric. Explain why this metric best captures user value. List 3 input metrics that drive it."
- **BUSA**: "Analyze your top 3 competitors. For each, identify one thing they do better and one thing you do better."
- **CEXP**: "Map the customer journey for your core use case. Identify the top 3 friction points."
