# MoSCoW Prioritization Guide

## Categories

| Priority | Phase | Label | Meaning |
|----------|-------|-------|---------|
| **Must Have** | F1 | `F1-NNN` | MVP — without this, the product has no value. Non-negotiable for launch. |
| **Should Have** | F2 | `F2-NNN` | Important but not critical for MVP. Can ship without, but should be added soon. |
| **Could Have** | F3 | `F3-NNN` | Nice-to-have. Only if time/budget allows. |
| **Won't Have** | — | Out of Scope | Explicitly excluded. Documented in `scope-boundaries.md`. |

## Assignment Rules

1. **Must Have (F1)** features must collectively solve the core problem statement (POV-001)
2. **Every high-severity pain point** (PP severity >= 8) must have at least one F1 feature
3. **F1 features combined** should form a usable product (not a collection of half-features)
4. **Should Have (F2)** features enhance F1 features or address medium-severity pain points
5. **Could Have (F3)** features are derived from lower-priority HMW questions or secondary personas

## Vbounce Mapping

The MoSCoW phases map directly to vbounce PRD phasing:

```
PRD:
  Phase 1 (MVP):     F1-001, F1-002, F1-003, ...
  Phase 2 (v1.1):    F2-001, F2-002, ...
  Phase 3 (Future):  F3-001, F3-002, ...
```

## Validation

- F1 features must trace to at least one PP (pain point)
- Every F1 feature must have user flows defined
- F1 count should be 3-8 features (< 3 = too thin, > 8 = scope creep)
- Every "Won't Have" must have a documented reason in `scope-boundaries.md`
