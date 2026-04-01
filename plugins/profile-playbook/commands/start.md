---
description: Initialize a new SFIA playbook session for a specific role
argument-hint: "[role] [description] — e.g., 'sa design a payment system' or just 'sa'"
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Initialize a new Profile Playbook session.

## Available Roles

| Role | Code | Phases | Target Audience |
|------|------|--------|-----------------|
| **sa** | SA | Discover → Define → Design → Decide → Deliver | Dev/Tech Lead → Solution Architect |
| **po** | PO | Discover → Define → Prioritize → Plan → Deliver & Learn | Dev/PM → Product Owner |
| **ba** | BA | Discover → Define → Analyze → Design → Deliver & Validate | Dev/Analyst → Business Analyst |
| **testing** | TEST | Discover → Plan → Execute → Evaluate → Improve | Dev/QA → Test Analyst |
| **pm** | PM | Discover → Define → Plan → Execute → Close & Learn | Team Lead → Project Manager |
| **ea** | EA | Discover → Define → Design → Govern → Evolve | SA/Tech Lead → Enterprise Architect |
| **cio** | CIO | Discover → Strategize → Govern → Transform → Sustain | IT Director → CIO |
| **cto** | CTO | Discover → Envision → Build → Scale → Evolve | Engineering Lead → CTO |
| **cpo** | CPO | Discover → Define → Prioritize → Plan → Deliver & Learn | Senior PM → CPO |

## Instructions

1. **Determine the role:**
   - If the first argument matches a role from the table above, use that role
   - If no role provided, show the Available Roles table and ask the user to choose

2. **Look up role configuration:**

   | Role | Code | Phase Directories |
   |------|------|-------------------|
   | sa | SA | discover,define,design,design/adrs,decide,decide/adrs,deliver |
   | po | PO | discover,define,prioritize,plan,deliver-learn |
   | ba | BA | discover,define,analyze,design,deliver-validate |
   | testing | TEST | discover,plan,execute,evaluate,improve |
   | pm | PM | discover,define,plan,execute,close-learn |
   | ea | EA | discover,define,design,govern,evolve |
   | cio | CIO | discover,strategize,govern,transform,sustain |
   | cto | CTO | discover,envision,build,scale,evolve |
   | cpo | CPO | discover,define,prioritize,plan,deliver-learn |

3. **Generate session ID:** `{CODE}-{PROJECT}-{YYYYMMDD}-{SEQ}` (derive PROJECT from directory name, SEQ starts at 001)

4. **Create workspace:** `mkdir -p .profile-playbook/sessions/{session_id}/{phase_dirs}`

5. **Initialize `{workspace}/state.yaml`:**

```yaml
session_id: {session_id}
role: {role}
workspace: .profile-playbook/sessions/{session_id}
current_phase: {first_phase}
phases:
  {phase1}: { status: in_progress, artifacts: [] }
  {phase2}: { status: not_started, artifacts: [] }
  {phase3}: { status: not_started, artifacts: [] }
  {phase4}: { status: not_started, artifacts: [] }
  {phase5}: { status: not_started, artifacts: [] }
coaching_log: []
```

6. **Load the role's skill:** Read `skills/{role}-playbook/SKILL.md` for the session management procedure and core principles.

7. **If a description was provided** (text after the role):
   - Log it to `{workspace}/{first_phase}/context-doc.md` as initial context
   - Begin the first phase with guided questions from `skills/{role}-playbook/references/{domain}-phases.md`

8. **If no description provided**, ask contextual questions appropriate for the role (refer to the role's phases reference).

9. **If the user already has existing work**, offer to skip to an appropriate phase.

10. Present the first coaching message introducing the first phase and the SFIA skills that will be practiced.
