# ID Conventions

Standard identifier formats used across all V-Bounce phases.

## Cycle Identifiers

| Type | Format | Example |
|------|--------|---------|
| Feature Cycle | `CYCLE-{PROJECT}-{YYYYMMDD}-{SEQ}` | `CYCLE-TASKFLOW-20260307-001` |
| Bugfix Cycle | `BF-{PROJECT}-{YYYYMMDD}-{SEQ}` | `BF-TASKFLOW-20260307-001` |
| Change Request | `CR-{PROJECT}-{YYYYMMDD}-{SEQ}` | `CR-TASKFLOW-20260307-001` |
| Traceability Matrix | `TM-{PROJECT}-{YYYYMMDD}` | `TM-TASKFLOW-20260307` |

## Requirements Identifiers

| Type | Format | Example |
|------|--------|---------|
| User Story | `US-{feature}-{seq}` | `US-003-001` |
| Acceptance Criterion | `AC-{story-id}-{seq}` | `AC-US-003-001-01` |
| Non-Functional Req | `NFR-{feature}-{seq}` | `NFR-003-001` |
| Requirement | `REQ-{seq}` | `REQ-001` |

## Test Identifiers

| Type | Format | Example |
|------|--------|---------|
| Test Skeleton | `T-{AC-id}` | `T-AC-US-003-001-01` |
| Test Skeleton (alt) | `TSK-{seq}` | `TSK-001` |
| Integration Test Spec | `ITS-{seq}` | `ITS-001` |
| System Test Spec | `STS-{seq}` | `STS-001` |
| Security Test Spec | `SECTS-{seq}` | `SECTS-001` |

## Design Identifiers

| Type | Format | Example |
|------|--------|---------|
| ADR | `ADR-{seq}` | `ADR-001` |
| STRIDE Threat | `{letter}-{seq}` | `S-001`, `T-002` |
| Component | Path-based | `api/presentation/UserController` |

## Iteration Identifiers

| Type | Format | Example |
|------|--------|---------|
| Iteration | `ITER-{seq}` | `ITER-001` |

## Rules

1. All IDs are **uppercase** with hyphens as separators
2. Sequence numbers are **zero-padded** to 3 digits minimum
3. Feature numbers come from the PRD/feature tracking system
4. IDs are **immutable** once assigned — never reuse a deleted ID
5. Cross-references use the full ID (e.g., `T-AC-US-003-001-01`, not just `T-01`)
