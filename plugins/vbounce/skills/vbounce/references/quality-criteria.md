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

### Design-Time Test Specifications (NEW in v3.0)

The design phase MUST produce complete test specifications (not just skeletons):

| Check | Status |
|-------|--------|
| Every API endpoint has ITS-* spec | PASS if 100%, WARN if >= 80%, FAIL if < 80% |
| Every architecture flow has STS-* spec | PASS if 100%, FAIL if 0 |
| Every STRIDE finding has SECTS-* spec | PASS if 100%, WARN if >= 80%, FAIL if < 80% |
| Specs include preconditions, expected responses, error scenarios | PASS if complete |

## Contracts Phase — Fast Track

### Contract Completeness

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Completeness | Every design interface has contract | 1-2 gaps | > 2 gaps |
| api-surface.yaml | All public methods listed with params + return | Missing return types | Missing methods |
| test-plan.yaml | Positive + negative + edge for each method | Missing edge cases | Missing methods |
| Language match | Contract format matches detected language | Fallback to .md | No contracts generated |

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

## Execution Phase — Fast Track

### Execution Verification

| Criterion | PASS | WARN | FAIL |
|-----------|------|------|------|
| Compile status | 0 errors | - | > 0 errors |
| Test pass rate | 100% | 90-99% | < 90% |
| Iterations | 1 (first try) | 2-3 | > 3 (escalated to user) |

## Testing Phase — Deep Dive

### Distribution Tolerance (v3.0 — V-Model Aligned)

Target: 40% positive / 20% negative / 10% edge / 10% security / 10% component integration / 10% system/E2E

| Actual | Status |
|--------|--------|
| Within 5% of target | PASS |
| Within 10% of target | WARN |
| Beyond 10% of target | FAIL |

### V-Model Level Coverage

Every test suite MUST include tests at all V-Model levels:

| Level | Required | Traces To |
|-------|----------|-----------|
| acceptance | >= 1 per AC | User Stories / ACs |
| system | >= 1 per architecture flow | Architecture flow diagrams |
| integration | >= 1 per API endpoint | API contracts from Design |
| unit | >= 1 per source file | Functions from Implementation |
| security | >= 1 per STRIDE finding | Threat model from Design |

### Design Spec Compliance

Tests MUST implement the design-time test specifications (ITS-*, STS-*, SECTS-*):
1. Every `ITS-*` spec → at least one integration test
2. Every `STS-*` spec → at least one system/E2E test
3. Every `SECTS-*` spec → at least one security test
4. Unimplemented specs are flagged as FAIL

### Coverage Gap Detection

For each AC without a test:
1. Flag as FAIL
2. Suggest test name: `Should_[AC outcome]_When_[AC condition]`
3. Suggest test type (unit/integration/e2e) and v_level

## Deployment Phase — Deep Dive

### Acceptance Verification (NEW in v2.0)

Before any deployment activity, verify all original acceptance criteria have passing test coverage:

1. Load all ACs from the requirements phase output
2. Load test results from the testing phase
3. Map each AC to its test results via the traceability matrix
4. Generate acceptance coverage report

| Check | Status |
|-------|--------|
| 100% ACs have >= 1 passing test | PASS |
| 90-99% ACs have >= 1 passing test | WARN (list uncovered ACs) |
| < 90% ACs have >= 1 passing test | FAIL (block deployment) |

**Blocking rule**: Any AC without at least one passing test at `acceptance` or `system` v_level MUST block production deployment. ACs covered only by `unit` tests get a WARN.

### Rollback Plan Validation

Must include:
1. Trigger conditions (quantitative: error rate %, latency ms)
2. Step-by-step rollback procedure
3. Estimated rollback time
4. Notification plan
5. Post-rollback verification steps
