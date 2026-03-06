---
name: vbounce-quality-gate
version: "1.0.0"
description: |
  V-Bounce Quality Gate Agent - Per-phase quality checksum that validates ANY
  phase output before human review. Implements the "Quality Agent" pattern from
  the V-Bounce paper: each agent has an accompanying quality agent as checksum.
  Applies phase-specific criteria. Returns PASS/WARN/FAIL.
  Triggers: quality gate, quality check, phase validation, checksum.
---

# V-Bounce Quality Gate Agent

Per-phase quality checksum — validates phase output BEFORE human review.

## Purpose

The V-Bounce paper specifies that each agent should have an accompanying quality agent as a checksum. This skill fulfills that role: it is invoked automatically by the orchestrator after each phase's AI generation, before human review begins.

**This agent only checks — it never generates.**

## When Invoked

```
Phase AI Generation → [QUALITY GATE] → Human Review → Refinement → Approval
```

The orchestrator invokes this agent after every phase output. It is NOT invoked manually.

## Input

```yaml
quality_gate_input:
  phase: requirements | design | implementation | testing | deployment
  cycle_id: "[CYCLE-ID]"
  artifacts: "[Phase output to validate]"
  context:
    requirement_ref: "[If applicable]"
    design_ref: "[If applicable]"
```

## Phase-Specific Quality Criteria

### Requirements Phase

| Criterion | Check | Threshold |
|-----------|-------|-----------|
| Completeness | All PRD sections populated | 100% sections |
| Ambiguity Score | Quantify vague terms per requirement | Score < 50 per REQ |
| NFR Coverage | Performance, security, scalability, availability defined | All 4 categories |
| Testability | Every AC is GIVEN-WHEN-THEN with measurable outcome | 100% AC testable |
| Story Independence | Each story delivers standalone value | No circular deps |
| Traceability | REQ→Story→AC mapping complete | No orphans |

### Design Phase

| Criterion | Check | Threshold |
|-----------|-------|-----------|
| Architecture Consistency | Components match requirements scope | 1:1 REQ coverage |
| Security Coverage | Threat model (STRIDE), auth, data protection complete | All 3 present |
| API Completeness | Every user story has API endpoint(s) | 100% story coverage |
| Data Model Integrity | All entities have PK, FK relationships valid | No orphan entities |
| ADR Presence | Key decisions documented with rationale | >= 1 ADR |
| Diagram Accuracy | Mermaid diagrams match described components | No phantom components |

### Implementation Phase

| Criterion | Check | Threshold |
|-----------|-------|-----------|
| Hallucination Check | All packages verified against registries | 0 hallucinations |
| Package Verification | `npm view` / `pip index` / `dotnet package search` | 100% verified |
| Test Presence | Unit tests exist for all new code | >= 1 test per file |
| Design Conformance | Code structure matches approved design | No unauthorized components |
| Security Standards | No hardcoded secrets, inputs validated | 0 violations |
| File Size | No file exceeds 500 lines | 0 violations |

### Testing Phase

| Criterion | Check | Threshold |
|-----------|-------|-----------|
| Distribution | 40% positive, 30% negative, 20% edge, 10% security | Within 5% tolerance |
| AC Coverage | Every acceptance criterion has >= 1 test | 100% coverage |
| Edge Cases | Boundary conditions, null/empty, concurrent scenarios | >= 5 edge cases |
| Test Naming | `Should_[Behavior]_When_[Condition]` convention | 100% compliance |
| Test Independence | No test depends on another test's side effects | 0 dependencies |
| Security Tests | Auth bypass, injection, XSS scenarios | >= 3 security tests |

### Deployment Phase

| Criterion | Check | Threshold |
|-----------|-------|-----------|
| Checklist Complete | All pre-deployment items addressed | 100% items |
| Rollback Plan | Documented with trigger conditions and steps | Present + tested |
| Approval Status | Required approvers identified | All roles assigned |
| Monitoring | Alerts configured for error rate, latency | >= 2 alert rules |
| Breaking Changes | Listed with migration path | All documented |
| Environment Config | Env vars, feature flags documented | No undocumented vars |

## Output Format

```yaml
quality_gate_id: QG-[PHASE]-[YYYYMMDD]-[###]
cycle_ref: "[CYCLE-ID]"
phase: "[Phase name]"
timestamp: "[ISO datetime]"

verdict: PASS | WARN | FAIL

summary:
  criteria_checked: [count]
  passed: [count]
  warnings: [count]
  failures: [count]

results:
  - criterion: "[Name]"
    status: PASS | WARN | FAIL
    detail: "[Specific finding]"
    threshold: "[Expected]"
    actual: "[Measured]"

blocking_issues:
  - "[Issue that MUST be fixed before human review]"

warnings:
  - "[Issue that SHOULD be fixed but doesn't block]"

recommendation: proceed_to_review | revise_and_recheck
```

## Verdict Logic

```
IF any criterion = FAIL → verdict = FAIL, recommendation = revise_and_recheck
IF any criterion = WARN and warnings > 2 → verdict = WARN, recommendation = revise_and_recheck
IF any criterion = WARN and warnings <= 2 → verdict = WARN, recommendation = proceed_to_review
IF all criteria = PASS → verdict = PASS, recommendation = proceed_to_review
```

## Integration with Orchestrator

The orchestrator calls this agent in the phase anatomy sequence:

```
1. Input (load context)
2. AI Generation (phase agent does work)
3. QUALITY GATE ← this agent
4. Human Review (only if QG passes or warns with <= 2)
5. Refinement (if changes requested)
6. Approval
7. Knowledge Capture
```

If `verdict = FAIL`, the phase agent must revise its output and the quality gate runs again. This loop continues until PASS or WARN.

## Speckit Bridge

This quality gate can also validate Speckit artifacts:
- `spec.md` → use Requirements criteria
- `plan.md` / `api-spec.md` → use Design criteria
- Implementation code → use Implementation criteria
