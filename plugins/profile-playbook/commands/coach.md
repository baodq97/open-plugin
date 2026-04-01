---
description: Get coaching on a specific SFIA skill or overview of role-relevant skills
argument-hint: "[SFIA skill code, e.g., ARCH, PROD, TEST] or [role] to see all skills for a role"
allowed-tools: [Read]
---

Provide coaching on SFIA skills for the active role.

## Instructions

1. **Determine the role:**
   - Read `.profile-playbook/sessions/` to find the most recent session
   - Read `{workspace}/state.yaml` to get the `role` field
   - If no active session and a role name is provided as argument (sa, po, ba, testing, pm, ea, cio, cto, cpo), use that role
   - If no session and no role, ask the user which role they want coaching for

2. **Load role-specific coaching resources:**
   - Skill descriptions: `skills/{role}-playbook/references/sfia-skill-map.md`
   - Coaching prompts: `skills/{role}-playbook/references/coaching-prompts.md`

3. **If a SFIA skill code is provided** (e.g., `ARCH`, `TEST`, `PRMG`):
   - Show the skill name, category, and overall description
   - Show level descriptions for the role's relevant levels (typically 4, 5, 6 — or 5, 6, 7 for senior roles)
   - Explain the key transitions between levels
   - Provide practical exercises to build competency at each level
   - Give examples of good vs. insufficient output at each level

4. **If no skill code provided:**
   - Show an overview table of all SFIA skills relevant to the role with:
     - Skill name and code
     - Level range
     - One-line description of what it means for this role
   - Ask the user which skill they want to deep-dive into
