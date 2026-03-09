# ID Conventions

Standard identifier formats used across all Design Thinking phases.

## Session Identifiers

| Type | Format | Example |
|------|--------|---------|
| Session | `DT-{PROJECT}-{YYYYMMDD}-{SEQ}` | `DT-TASKFLOW-20260309-001` |

## Empathize Identifiers

| Type | Format | Example |
|------|--------|---------|
| Persona | `PERSONA-{SEQ}` | `PERSONA-001` |
| Pain Point | `PP-{SEQ}` | `PP-001` |
| Journey Map | `JM-{SEQ}` | `JM-001` |
| Empathy Map | `EM-{SEQ}` | `EM-001` |

## Define Identifiers

| Type | Format | Example |
|------|--------|---------|
| Point of View | `POV-{SEQ}` | `POV-001` |
| How Might We | `HMW-{SEQ}` | `HMW-001` |
| Design Principle | `DP-{SEQ}` | `DP-001` |

## Ideate Identifiers

| Type | Format | Example |
|------|--------|---------|
| Solution Concept | `SC-{SEQ}` | `SC-001` |

## Prototype Identifiers

| Type | Format | Example |
|------|--------|---------|
| Feature (Phase 1) | `F1-{SEQ}` | `F1-001` |
| Feature (Phase 2) | `F2-{SEQ}` | `F2-001` |
| Feature (Phase 3) | `F3-{SEQ}` | `F3-001` |
| User Flow | `UF-{SEQ}` | `UF-001` |
| Success Criterion | `SUCC-{SEQ}` | `SUCC-001` |
| Constraint | `CON-{SEQ}` | `CON-001` |

## Traceability Chain

```
PP-001 → PERSONA-001 → POV-001 → HMW-001 → SC-001 → F1-001 → PRD
                                                                 ↓ [vbounce]
                                                          US-001-001 → AC → Tests → Code
```

## Rules

1. All IDs are **uppercase** with hyphens as separators
2. Sequence numbers are **zero-padded** to 3 digits minimum
3. IDs are **immutable** once assigned — never reuse a deleted ID
4. Cross-references use the full ID (e.g., `PP-001`, not just `1`)
5. Feature phase numbers (F1/F2/F3) correspond to MoSCoW priority mapping:
   - F1 = Must Have (MVP)
   - F2 = Should Have
   - F3 = Could Have
