---
name: vbounce-e2e-test
version: "1.0.0"
description: |
  End-to-end testing harness for the V-Bounce SDLC plugin. Runs a complete
  Feature Track workflow (Requirements -> Design -> Implementation -> Review ->
  Testing -> Deployment) against a sample PRD fixture, verifying each phase's
  output structure, quality gate verdicts, agent behavior, traceability links,
  and knowledge capture.

  Use this skill whenever testing vbounce, running vbounce e2e tests, validating
  the vbounce plugin, checking vbounce workflow, or verifying vbounce agents work
  correctly. Also trigger when someone says "test the SDLC plugin", "verify
  vbounce phases", or "run plugin integration test".
---

# V-Bounce E2E Test Harness

Systematically tests the vbounce plugin by driving a complete Feature Track
through all 6 phases with a controlled sample PRD. Each phase is verified
against explicit acceptance criteria before proceeding.

## Test Architecture

Each phase MUST follow the full **6-Activity Phase Anatomy** from the vbounce
spec. Testing only the AI Generation step (step 2) is NOT sufficient — the
quality gate, human review, and knowledge capture steps are what make vbounce
different from generic requirements analysis.

```
Sample PRD (fixture)
  |
  v
Phase 1: Requirements
  Step 1: INPUT       Load PRD into context
  Step 2: GENERATE    requirements-analyst agent produces artifacts
  Step 3: QG          quality-gate-validator agent returns PASS/WARN/FAIL
                      (if FAIL -> loop back to Step 2, agent revises)
  Step 4: REVIEW      Present artifacts + QG verdict to user for review
  Step 5: REFINE      If user says CHANGES REQUESTED -> agent revises -> Step 3
  Step 6: APPROVE     User says APPROVED -> traceability-analyst updates matrix
                      -> knowledge-curator captures phase learnings
  |
Phase 2-6: Same 6-step anatomy per phase
  |
  v
E2E Report: PASS / FAIL with per-phase details
```

**Critical**: The test MUST verify that separate agents are actually invoked
for quality gate (step 3), traceability (step 6), and knowledge capture
(step 6). A self-verification checklist inside the requirements output does
NOT count as running the quality-gate-validator agent.

## Setup

1. Create a temporary test workspace:
   ```
   tests/vbounce-e2e/workspace/run-YYYYMMDD-HHMMSS/
   ```

2. Copy the sample PRD fixture into the workspace:
   ```
   cp ${CLAUDE_SKILL_DIR}/fixtures/sample-prd.md workspace/run-XXX/prd.md
   ```

3. Initialize a minimal project context in the workspace:
   - Create a CLAUDE.md with basic project info (Node.js, Express, PostgreSQL)
   - Create placeholder src/ and test/ directories
   - This gives vbounce agents realistic context to work with

## Execution: Phase-by-Phase

Run each phase sequentially. After each phase, verify outputs before proceeding.

### Phase 1: Requirements

Each step below maps to the vbounce 6-Activity Phase Anatomy. ALL 6 steps
must execute — skipping any step is a test failure.

#### Step 1: INPUT
**Prompt**:
> I have a PRD at workspace/run-XXX/prd.md. Please start a vbounce SDLC cycle
> for the TaskFlow API feature. Begin the Requirements phase.

Verify: The orchestrator loads the PRD and identifies it as starting a new cycle.

#### Step 2: AI GENERATION (requirements-analyst agent)
The requirements-analyst agent runs the 9-step pipeline and produces artifacts.

**Verify these artifacts exist and are well-formed**:

| Artifact | File | Checks |
|----------|------|--------|
| User Stories | requirements.md | Has US-XXX-XXX IDs, INVEST format, grouped by phase |
| Acceptance Criteria | requirements.md | GIVEN-WHEN-THEN format, >= 3 per story, AC-XXX IDs |
| NFRs | requirements.md | NFR-XXX-XXX IDs, measurable thresholds, 4+ categories |
| Test Skeletons | test-skeletons.md | T-AC-XXX IDs, type classification, linked to ACs |
| Traceability Matrix | traceability.md | PRD -> Story -> AC -> Test mapping, no orphans |
| Ambiguity Report | ambiguity-report.md | All scores < 50, scoring rubric applied |

#### Step 3: QUALITY GATE (quality-gate-validator agent)
**This is a SEPARATE agent invocation, not a self-check.**

**Prompt**:
> Run the vbounce quality gate on the requirements output.

**Verify**:
- quality-gate-validator agent is invoked (not just a self-checklist)
- Output is in YAML format with `quality_gate_id: QG-REQ-*`
- Per-criterion results: Completeness, Ambiguity Score, NFR Coverage,
  Testability, Story Independence, Traceability
- Each criterion has: status (PASS/WARN/FAIL), threshold, actual value
- Overall verdict: PASS/WARN/FAIL
- If FAIL: agent loops back to Step 2 for revision automatically

**Record**: QG verdict, per-criterion breakdown, blocking issues.

#### Step 4: HUMAN REVIEW
**Verify**: After QG passes/warns (<=2), the system presents artifacts to the
user for review. The user should see a summary and be prompted for action.

Test with: Review the output and say `CHANGES REQUESTED: Add more edge case
ACs for webhook retry failures` to verify the refinement loop (Step 5).

#### Step 5: REFINEMENT (if CHANGES REQUESTED)
**Verify**:
- requirements-analyst agent revises artifacts based on feedback
- Revised output loops back to Step 3 (quality gate re-runs)
- Changes are incremental (not full regeneration)

After verifying refinement works, say `APPROVED` to proceed.

#### Step 6: APPROVAL + KNOWLEDGE CAPTURE
**Prompt**: `APPROVED`

**Verify THREE things happen**:
1. **Traceability update**: traceability-analyst agent updates the matrix
   (adds phase completion marker)
2. **Knowledge capture**: knowledge-curator agent extracts learnings from the
   requirements phase (ambiguity patterns, clarification effectiveness, etc.)
3. **State update**: `vbounce_state.phases.requirements.status` = `approved`

**Record results** in `workspace/run-XXX/results.md`:
```
## Phase 1: Requirements
- Step 2 (Generation): [PASS/FAIL per artifact]
- Step 3 (Quality Gate): [PASS/WARN/FAIL] — was separate agent? [YES/NO]
- Step 4 (Human Review): presented to user? [YES/NO]
- Step 5 (Refinement): loop worked? [YES/NO/SKIPPED]
- Step 6 (Approval): traceability updated? [YES/NO], knowledge captured? [YES/NO]
- Issues: [list any problems found]
```

### Phase 2: Design

Same 6-step anatomy. Requirements APPROVED triggers transition to Design.

#### Step 2: AI GENERATION (design-architect agent)

| Artifact | Checks |
|----------|--------|
| Architecture | Components defined, matches requirements scope |
| API Spec | Endpoints map to user stories |
| Data Model | Entities with PK/FK, no orphans |
| Security Design | STRIDE threat model present |
| ADRs | At least 1 architecture decision documented |

#### Step 3: QUALITY GATE (separate quality-gate-validator invocation)
- QG ID format: `QG-DES-*`
- Criteria: Architecture Consistency, Security Coverage, API Completeness,
  Data Model Integrity, ADR Presence, Diagram Accuracy
- Expected: PASS or WARN (<=2)

#### Step 6: APPROVAL
- Traceability-analyst updates matrix with Component -> API -> Entity mappings
- Knowledge-curator captures design phase learnings

### Phase 3: Implementation (FAST TRACK)

Same 6-step anatomy, but this phase is FAST TRACK per vbounce spec — minimize
time, no over-engineering.

#### Step 2: AI GENERATION (implementation-engineer agent)

| Artifact | Checks |
|----------|--------|
| Code Files | Present in src/ following design structure |
| Tests | At least 1 test per implementation file |
| Package References | No hallucinated packages (verify with npm view/pip index) |
| Design Conformance | Code structure matches approved design |

#### Step 3: QUALITY GATE (separate quality-gate-validator invocation)
- QG ID: `QG-IMP-*`
- Criteria: Hallucination Check, Package Verification, Test Presence,
  Design Conformance, Security Standards, File Size
- Expected: PASS or WARN (<=2)

#### Step 6: APPROVAL
- Traceability-analyst updates: File -> Function mappings added
- Knowledge-curator captures implementation learnings

### Phase 4: Review

#### Step 2: AI GENERATION (review-auditor agent)

| Artifact | Checks |
|----------|--------|
| Review Report | All 5 review categories scored |
| File Coverage | Every implementation file reviewed |
| Hallucination Check | Findings documented |
| Traceability Check | Verification of REQ -> Code mapping |
| Issues | All have file:line locations and fix recommendations |

#### Step 3: QUALITY GATE (separate quality-gate-validator invocation)
- QG ID: `QG-REV-*`
- Expected: PASS or WARN (<=2)

#### Step 6: APPROVAL
- Knowledge-curator captures review findings

### Phase 5: Testing

#### Step 2: AI GENERATION (testing-engineer agent)

| Artifact | Checks |
|----------|--------|
| Test Suite | Tests implement all test skeletons from Phase 1 |
| Distribution | ~40% positive, ~30% negative, ~20% edge, ~10% security |
| AC Coverage | 100% acceptance criteria have tests |
| Naming | Should_[Behavior]_When_[Condition] convention |
| V-Model Levels | Unit, Integration, E2E tests present |

#### Step 3: QUALITY GATE (separate quality-gate-validator invocation)
- QG ID: `QG-TST-*`
- Expected: PASS or WARN (<=2)

#### Step 6: APPROVAL
- Traceability-analyst updates: Test -> Result -> Coverage mappings
- Knowledge-curator captures testing learnings

### Phase 6: Deployment

#### Step 2: AI GENERATION (deployment-engineer agent)

| Artifact | Checks |
|----------|--------|
| Deployment Plan | Pre-deployment checklist complete |
| Rollback Plan | Present with quantitative triggers |
| Acceptance Verification | All ACs have passing tests confirmed |
| Monitoring | Alert rules defined |
| Environment Config | Env vars documented |

#### Step 3: QUALITY GATE (separate quality-gate-validator invocation)
- QG ID: `QG-DEP-*`
- Expected: PASS or WARN (<=2)

#### Step 6: APPROVAL
- Knowledge-curator performs end-of-cycle retrospective

## Cross-Phase Verification

After all 6 phases complete, verify these cross-cutting concerns:

### Traceability Completeness
- Read the final traceability matrix
- Verify full chain: PRD Section -> Story -> AC -> Test -> Code -> Deployment
- Count orphans (should be 0)

### Knowledge Capture
- Verify knowledge was captured after each phase approval
- Check knowledge entries reference specific phase findings

### State Management
- Verify vbounce_state YAML tracks:
  - cycle_id format: CYCLE-[PROJECT]-[YYYYMMDD]-[###]
  - All phases show correct status progression
  - phase_anatomy_step transitions are logical

## Generating the E2E Report

After completing all phases, compile the final report:

```markdown
# V-Bounce E2E Test Report

**Run**: [timestamp]
**Plugin Version**: 3.0.0
**Track**: Feature (standard)

## Summary
| Phase | Step 2: Generate | Step 3: QG (separate?) | Step 4: Review | Step 5: Refine | Step 6: Approve+KC |
|-------|-----------------|----------------------|----------------|----------------|-------------------|
| Requirements | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |
| Design | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |
| Implementation | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |
| Review | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |
| Testing | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |
| Deployment | PASS/FAIL | PASS/WARN/FAIL (YES/NO) | YES/NO | YES/NO/SKIP | YES/NO |

**Step 3 "separate?"**: Was quality-gate-validator invoked as a distinct agent,
not just a self-checklist inside the phase agent's output? Must be YES for PASS.

## Cross-Phase
- Traceability Chain: COMPLETE / BROKEN (details)
- Knowledge Capture: X/6 phases captured
- State Management: VALID / INVALID (details)

## Overall Verdict: PASS / FAIL
[Reasoning]

## Issues Found
1. [Phase] - [Severity] - [Description]

## Recommendations
1. [Improvement suggestion]
```

Save this report to `workspace/run-XXX/e2e-report.md`.

## Tips for Running

- The test uses a deliberately small PRD (task management API with 3 features)
  so phases complete quickly — this is by design.
- If a quality gate FAILs, record it and move on. The goal is to test the plugin
  flow, not to produce perfect artifacts.
- Use `APPROVED` to advance phases. Use `SKIP TO [phase]` if you need to jump
  ahead to test a specific phase.
- Compare output structure against the verification tables above — focus on
  structural correctness (IDs, formats, presence) over content quality.

## Reference Files

- `fixtures/sample-prd.md` — The sample PRD used as test input
- `references/expected-artifacts.md` — Detailed expected output structure per phase
- `scripts/verify-structure.sh` — Bash script to check artifact file presence
