---
description: Get coaching on a specific SFIA skill or overview of all SA-relevant skills
argument-hint: "[SFIA skill code, e.g., ARCH, DESN, REQM]"
allowed-tools: [Read]
---

Provide coaching on SFIA skills for Solution Architecture.

## Instructions

1. Load skill descriptions from `references/sfia-skill-map.md`
2. Load coaching prompts from `references/coaching-prompts.md`

**If a skill code is provided** (e.g., `ARCH`):
- Show the skill name, category, and overall description
- Show level descriptions for levels 4, 5, and 6 (the SA-relevant range)
- Explain the key transitions:
  - L3 → L4: what changes
  - L4 → L5: what changes
  - L5 → L6: what changes
- Provide practical exercises to build competency at each level
- Give examples of good vs. insufficient output at each level

**If no skill code provided:**
- Show an overview table of all SA-relevant SFIA skills with:
  - Skill name and code
  - Level range for SA role
  - One-line description of what it means for SA work
- Ask the user which skill they want to deep-dive into

**Practical exercises by skill** (examples):

- **ARCH**: "Take your last project. Write an ADR for the biggest decision. Include 3 alternatives."
- **DESN**: "Draw a C4 Container diagram for a system you know well. Show it to a colleague — can they understand it without explanation?"
- **REQM**: "Write 5 NFRs for your current project. Each must have a measurable target."
- **BUSA**: "Map all stakeholders for your current project. For each, write their top concern."
- **SCTY**: "For your last architecture, identify 3 security risks and how the design mitigates them."
