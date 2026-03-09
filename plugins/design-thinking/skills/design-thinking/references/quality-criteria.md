# Quality Criteria Reference

Phase-specific quality criteria for the QG validator. All criteria are evaluated per phase.

## Scoring Guide

Each criterion is scored as:
- **PASS**: Meets or exceeds threshold
- **WARN**: Partially meets threshold (minor gaps)
- **FAIL**: Does not meet threshold (blocking issue)

## Verdict Calculation

- **PASS**: All criteria PASS
- **WARN**: No FAIL criteria, <= 2 WARN criteria
- **FAIL**: Any criterion FAIL, or > 2 WARN criteria

## Phase-Specific Criteria

### Empathize Phase

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Persona count | >= 1 persona with all sections filled | 1 persona with minor gaps | 0 personas |
| Empathy map quadrants | All 4 quadrants filled for every persona | 1 quadrant sparse (< 2 entries) | Any quadrant empty |
| Pain point severity | All PPs have severity (1-10) + frequency | 1-2 PPs missing frequency | Any PP missing severity |
| Journey maps | >= 1 journey map per primary persona | Journey map missing 1-2 steps | No journey maps |
| Evidence grounding | All insights trace to conversation | 1-2 insights marked [INFERRED] | Majority ungrounded |

### Define Phase

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| POV format | All POVs: "[persona] needs [need] because [insight]" | Minor format deviation | Missing persona/need/insight |
| HMW count | >= 3 HMW questions | 2 HMW questions | < 2 HMW questions |
| Design principles | >= 3 design principles with rationale | 2 principles | < 2 principles |
| PP coverage | All high-severity PPs (>= 7) in opportunity map | 1 high-severity PP missing | Multiple high-severity PPs missing |
| HMW scope | All HMWs answerable with multiple solutions | 1 HMW too narrow/broad | Multiple HMWs are requirements in disguise |

### Ideate Phase

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Concept count | >= 2 distinct solution concepts | 2 concepts but similar | < 2 concepts |
| Scoring completeness | All concepts scored on all 5 criteria | 1 criterion missing scores | Multiple criteria unscored |
| Direction rationale | Direction tied to design principles + personas | Weak rationale | No rationale |
| Persona alignment | Direction addresses primary persona needs | Partial persona coverage | Ignores primary persona |
| Differentiation | Concepts are genuinely different approaches | Minor variations | All concepts are variations of same idea |

### Prototype Phase

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Feature-PP traceability | Every F1 feature traces to >= 1 PP | 1 F1 feature unlinked | Multiple F1 features unlinked |
| F1 completeness | F1 features form a usable MVP | Minor gaps in MVP flow | F1 features don't form a coherent product |
| User flows | User flows for all F1 features | 1 F1 feature missing flow | No user flows |
| Success criteria | All measurable with units/thresholds | 1-2 missing units | Subjective criteria |
| Scope boundaries | Out-of-scope section non-empty | Thin out-of-scope list | No scope boundaries defined |

### PRD Phase

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Section completeness | All 7 PRD sections present and non-empty | 1 section thin | Any section missing |
| Feature phasing | Features properly phased (F1/F2/F3) | Phase 2/3 thin | No phasing |
| Constraints | Specific, measurable constraints | 1-2 vague constraints | No constraints or all vague |
| Success criteria | Measurable with numbers/percentages | 1-2 without numbers | Subjective success criteria |
| Traceability table | Complete PP → Feature chain | 1-2 gaps | No traceability table |
| Vbounce format | Matches PRD template structure | Minor format deviation | Incompatible format |
