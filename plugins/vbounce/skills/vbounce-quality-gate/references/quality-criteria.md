# Quality Criteria Reference

Detailed quality criteria for each V-Bounce phase. Referenced by the Quality Gate agent.

## Scoring Guide

Each criterion is scored as:
- **PASS**: Meets or exceeds threshold
- **WARN**: Partially meets threshold (minor gaps)
- **FAIL**: Does not meet threshold (blocking issue)

## Requirements Phase — Deep Dive

### Ambiguity Scoring (0-100)

Score each requirement individually:

| Score | Meaning | Action |
|-------|---------|--------|
| 0-25 | Clear and specific | Proceed |
| 26-50 | Minor ambiguity | Note for reviewer |
| 51-75 | Significant ambiguity | Must clarify |
| 76-100 | Critically vague | Block until rewritten |

**Ambiguity indicators** (each adds points):
- Vague adjective (fast, easy, many): +15
- Missing boundary/limit: +20
- Unstated error handling: +10
- Missing user role specification: +15
- Implicit assumption: +10
- No measurable outcome in AC: +25

### NFR Completeness Matrix

| Category | Required Elements | FAIL if Missing |
|----------|-------------------|-----------------|
| Performance | Response time target, throughput target | Yes |
| Security | Auth method, data classification | Yes |
| Scalability | Current capacity, target capacity | No (WARN) |
| Availability | Uptime SLA | No (WARN) |

## Design Phase — Deep Dive

### Architecture Consistency Check

1. Every user story → at least one component handles it
2. Every component → traces to at least one requirement
3. No component exists without a requirement justification
4. API endpoints cover all CRUD operations implied by stories

### Security Coverage Check

1. STRIDE threat model present with mitigations
2. Authentication mechanism specified
3. Authorization model (RBAC/ABAC) defined
4. PII fields identified and handling documented
5. Encryption standards (at-rest, in-transit) specified

## Implementation Phase — Deep Dive

### Hallucination Severity

| Type | Severity | Example |
|------|----------|---------|
| Fake package | FAIL | `express-magic-router` |
| Wrong version | WARN | `express@99.0.0` |
| Fake method | FAIL | `prisma.user.findManyAndCount()` |
| Wrong signature | WARN | Missing required parameter |
| Fake config option | WARN | `{ autoValidate: true }` |
| Fake attribute | FAIL | `[AutoValidate]` |

## Testing Phase — Deep Dive

### Distribution Tolerance

Target: 40% positive / 30% negative / 20% edge / 10% security

| Actual | Status |
|--------|--------|
| Within 5% of target | PASS |
| Within 10% of target | WARN |
| Beyond 10% of target | FAIL |

### Coverage Gap Detection

For each AC without a test:
1. Flag as FAIL
2. Suggest test name: `Should_[AC outcome]_When_[AC condition]`
3. Suggest test type (unit/integration/e2e)

## Deployment Phase — Deep Dive

### Rollback Plan Validation

Must include:
1. Trigger conditions (quantitative: error rate %, latency ms)
2. Step-by-step rollback procedure
3. Estimated rollback time
4. Notification plan
5. Post-rollback verification steps
