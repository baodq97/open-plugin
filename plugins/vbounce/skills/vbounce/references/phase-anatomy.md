# 7-Activity Phase Anatomy

Every V-Bounce phase follows this structured cycle:

```
1. INPUT           Load context from previous phase
2. AI GENERATION   Phase agent produces output
3. QUALITY GATE    Per-phase QG agent validates (PASS/WARN/FAIL)
4. HUMAN REVIEW    User reviews (only if QG passes/warns <= 2)
5. REFINEMENT      Iterate if changes requested
6. APPROVAL        User approves phase
7. POST-PHASE      trace + KC dispatched in PARALLEL
```

## Activity Details

| # | Activity | Actor | Output |
|---|----------|-------|--------|
| 1 | Input | Orchestrator | Context from prior phase loaded |
| 2 | AI Generation | Phase agent | Phase artifacts (requirements, design, code+tests, etc.) |
| 3 | Quality Gate | Per-phase QG agent (sonnet) | PASS/WARN/FAIL verdict |
| 4 | Human Review | User | Feedback, change requests |
| 5 | Refinement | Phase agent | Revised artifacts (loops back to step 3) |
| 6 | Approval | User | Phase approved |
| 7 | Post-Phase | traceability-analyst + knowledge-curator PARALLEL (haiku) | Matrix updated, learnings captured |

## QG Failure Loop

If Quality Gate returns FAIL:
1. Knowledge-curator captures failure patterns -> appends prevention rule to `.claude/rules/vbounce-learned-rules.md`
2. Phase agent reads the new prevention rule
3. Phase agent revises output applying the rule
4. Quality Gate re-runs on revised output

No human review until QG passes. This capture-then-fix loop ensures the same failure pattern never recurs across cycles.

## Bounce Time Allocation

The paper's key insight: implementation should be DEEP (unified TDD), validation should be DEEP.

| Phase | Time Allocation | Instruction |
|-------|----------------|-------------|
| Requirements | DEEP DIVE | Multiple refinement cycles expected. Ambiguity score must be < 50. Test skeletons generated alongside stories. |
| Design | DEEP DIVE | ADRs documented. Security design (STRIDE) mandatory. Complete test specifications produced. |
| Contracts | FAST TRACK | Orchestrator generates shared API contracts from design + requirements + tech context. No agent dispatch. |
| Implementation | DEEP DIVE | Unified TDD: write tests from contracts (RED), implement code (GREEN), execute and verify internally (max 3 iterations). Includes test generation, code implementation, and execution verification. |
| Review | DEEP DIVE | Full hallucination check. Contract conformance check. Test-source cross-check. Execution report reviewed. Security audit. |
| Deployment | STANDARD | Acceptance verification first. Checklist-driven. Rollback plan mandatory. |
