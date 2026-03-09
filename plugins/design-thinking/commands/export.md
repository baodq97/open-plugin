---
description: Generate PRD from current artifacts (requires Prototype phase approved)
allowed-tools: [Read, Write, Agent]
---

Export the PRD by triggering the PRD compilation phase.

## Instructions

1. Read `.design-thinking/state.yaml` to get the active workspace
2. Read `{workspace}/state.yaml` to get the current state
3. Validate: Prototype phase must be `approved`
   - If not approved, report: "Prototype phase must be approved before exporting PRD. Current status: {status}"
4. If PRD phase is already `approved`, report: "PRD already compiled. Find it at `{workspace}/prd.md`. Use `/design-thinking:handoff` to copy it."
5. Otherwise, set PRD phase to `synthesizing` and dispatch the prd-compiler agent:
   - Pass all required input file paths (resolved)
   - Include workspace path
6. After prd-compiler returns, dispatch qg-validator for the PRD phase
7. Route on QG verdict:
   - PASS/WARN: Set status to `review_pending`, present PRD to user for review
   - FAIL: Re-dispatch prd-compiler with QG feedback (max 3 retries)
8. After user approves, update state: `phases.prd.status: approved`
