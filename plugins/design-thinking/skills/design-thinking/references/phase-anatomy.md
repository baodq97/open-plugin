# 5-Step Phase Anatomy

Every Design Thinking phase follows this simplified cycle (adapted from vbounce's 7-activity anatomy):

```
1. ENGAGE           Conversation with user (collaborative discovery)
2. SYNTHESIZE       Agent produces structured artifacts from conversation
3. QUALITY CHECK    QG validator reviews artifacts (PASS/WARN/FAIL)
4. REVIEW           User reviews synthesized artifacts
5. ADVANCE          Move to next phase
```

## Phase Variations

| Phase | Engage | Synthesize | QG | Review |
|-------|--------|------------|-----|--------|
| **Empathize** | Deep (10-15+ turns, 5 interview rounds) | empathy-synthesizer | Yes | User corrects/adds |
| **Define** | Light (2-3 turns, AI-present → user-react) | problem-definer | Yes | User confirms problem statement |
| **Ideate** | Light (2-3 turns, AI-present → user-react) | ideation-evaluator | Yes | User confirms direction |
| **Prototype** | Brief (1-2 turns, constraints input) | prototype-architect | Yes | User reviews features |
| **PRD** | None (pure compilation) | prd-compiler | Yes | User final review |

## Automated Rework Loop

After SYNTHESIZE, the QG validator checks output. If it fails:

```
Agent produces output
     ↓
QG validator reviews (phase-specific criteria)
     ↓
┌─ PASS → proceed to user REVIEW
│
└─ FAIL/WARN → Agent re-dispatched with:
     • Original inputs
     • Previous output (for reference)
     • QG feedback report (what failed + why)
     ↓
   Agent produces improved output
     ↓
   QG reviews again
     ↓
   Max 3 retries → if still FAIL → escalate to user
```

State tracks: `{phase}.rework_count: 0-3`, `{phase}.qg_history: [{attempt, verdict, report_path}]`

## Minimum Conversation Turns

| Phase | Minimum Turns | Rationale |
|-------|--------------|-----------|
| Empathize | 10 | 5 interview rounds, ~2 turns each |
| Define | 2 | AI presents, user reacts |
| Ideate | 2 | AI presents, user reacts |
| Prototype | 1 | Constraints input |
| PRD | 0 | Pure compilation |
