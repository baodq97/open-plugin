# PRD Template (vbounce-compatible)

This template produces a PRD that can be directly consumed by `/vbounce:start`.

```markdown
# Product Requirements Document: {Product Name}

## 1. Background

### Problem Statement
{POV-001 statement: "[Persona] needs [need] because [insight]"}

### Current State
{Summary of current workflows, pain points, and workarounds from empathize phase}

### Stakeholders
{List of personas with roles — from PERSONA-NNN}

## 2. Proposed Solution

### Vision
{Selected direction from Ideate phase — SC-NNN with rationale}

### Design Principles
{DP-001 through DP-NNN from Define phase}

### Success Criteria
{SUCC-001 through SUCC-NNN — measurable outcomes from Prototype phase}

## 3. Requirements

### Phase 1 — MVP (Must Have)
{F1-001 through F1-NNN with descriptions, linked pain points, and user flows}

### Phase 2 — Enhancement (Should Have)
{F2-001 through F2-NNN with descriptions and linked pain points}

### Phase 3 — Future (Could Have)
{F3-001 through F3-NNN with descriptions}

## 4. Constraints

### Technical Constraints
{CON-001 through CON-NNN from Prototype phase}

### Business Constraints
{Timeline, budget, team size constraints}

### Regulatory/Compliance
{Any regulatory requirements}

## 5. Out of Scope
{Explicit list of what this product will NOT do — from scope-boundaries.md}

## 6. User Flows

{Mermaid diagrams for each F1 feature — from user-flows.md}

## 7. Traceability

| Pain Point | Persona | POV | HMW | Solution | Feature |
|------------|---------|-----|-----|----------|---------|
| PP-001 | PERSONA-001 | POV-001 | HMW-001 | SC-001 | F1-001 |
| ... | ... | ... | ... | ... | ... |
```

## Notes

- Every section must be non-empty
- Phase 1 features must collectively address the core problem statement
- Success criteria must be measurable (numbers, percentages, time units)
- Constraints must be specific (not "should be fast" but "response time < 200ms")
- Traceability table must cover every F1 feature
