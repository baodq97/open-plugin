---
description: Get coaching on a specific SFIA skill or overview of all BA-relevant skills
argument-hint: "[SFIA skill code, e.g., BUSA, REQM, BPRE]"
allowed-tools: [Read]
---

Provide coaching on SFIA skills for Business Analysis.

## Instructions

1. Load skill descriptions from `references/sfia-skill-map.md`
2. Load coaching prompts from `references/coaching-prompts.md`

**If a skill code is provided** (e.g., `BUSA`):
- Show the skill name, category, and overall description
- Show level descriptions for levels 3, 4, and 5 (the BA-relevant range)
- Explain the key transitions:
  - L3 → L4: what changes
  - L4 → L5: what changes
  - L5 → L6: what changes
- Provide practical exercises to build competency at each level
- Give examples of good vs. insufficient output at each level

**If no skill code provided:**
- Show an overview table of all BA-relevant SFIA skills with:
  - Skill name and code
  - Level range for BA role
  - One-line description of what it means for BA work
- Ask the user which skill they want to deep-dive into

**Practical exercises by skill** (examples):

- **BUSA**: "Take your current project. Write a problem statement that includes root cause, not just symptoms. Can you answer 'why' 5 times?"
- **REQM**: "Write 5 requirements for your most important feature. Each must be testable with measurable acceptance criteria."
- **FEAS**: "For your current initiative, identify 3 options. For each, document technical feasibility, business viability, and risks."
- **BPRE**: "Map the current process for a key workflow. Identify 3 improvement opportunities with expected impact."
- **DTAN**: "Create a data model for your core domain. Identify entities, relationships, and key attributes."
- **BPTS**: "Write acceptance criteria for 5 requirements using Given/When/Then format."
- **UNAN**: "Identify the top 3 user tasks in your system. For each, document the current experience and one improvement."
