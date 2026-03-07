# Expected Artifacts per Phase

Detailed structural expectations for each phase of the vbounce Feature Track.
Use these to verify agent outputs during E2E testing.

## Phase 1: Requirements

### requirements.md

Must contain these sections in order:

```
# Requirements Analysis: TaskFlow API

## 1. PRD Parse Summary
  - Background, Problem, Solution extracted
  - Stakeholders identified
  - System boundaries defined

## 4. User Stories
  - IDs: US-XXX-XXX format
  - Format: As a [actor], I want to [action] so that [value]
  - Grouped: MVP / Must Have / Nice to Have
  - INVEST compliance noted

## 5. Non-Functional Requirements
  - IDs: NFR-XXX-XXX format
  - Categories: Performance, Security, Scalability, Reliability (minimum)
  - Each has measurable threshold

## 6. Acceptance Criteria
  - IDs: AC-US-XXX-XXX-XX format
  - GIVEN-WHEN-THEN format (no exceptions)
  - >= 3 per story (happy + error + edge)
```

### test-skeletons.md

```
Test ID: T-AC-US-XXX-XXX-XX
Title: descriptive name
Type: Unit | Integration | E2E | Performance | Security
Priority: P0-P3
Preconditions: from GIVEN
Steps: from WHEN
Expected Result: from THEN
Test Data: specific values
```

### traceability.md

Table format with columns:
- PRD Ref | Story ID | AC ID | Test ID | NFR ID | Status
- No orphaned rows (every cell populated where applicable)

### ambiguity-report.md

- Per-requirement ambiguity score (0-100)
- All scores < 50
- Scoring rubric applied (vague quantifiers, subjective adjectives, etc.)

## Phase 2: Design

### Expected artifacts (in design docs):

- **Architecture overview**: Component diagram (Mermaid), layers defined
- **API specification**: Endpoints per user story, HTTP methods, request/response schemas
- **Data model**: Entity definitions with PK/FK, relationships
- **Security design**: STRIDE threat model, auth flow, data protection
- **ADRs**: At least 1 Architecture Decision Record
- **Traceability update**: Component -> API -> Entity mappings added to matrix

### Structural checks:
- Every user story from Phase 1 maps to >= 1 API endpoint
- Every entity has a primary key
- STRIDE covers all 6 categories (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)

## Phase 3: Implementation

### Expected artifacts:

- **Source files** in src/ matching design components
- **Test files** in test/ — at least 1 per source file
- **No hallucinated packages** — every import must be verifiable
- **File size** — no file > 500 lines

### Structural checks:
- Directory structure matches design architecture
- TypeScript files (project uses TS)
- Express route files map to API spec
- PostgreSQL schema matches data model
- Environment variables documented (not hardcoded)

## Phase 4: Review

### Expected artifacts:

- **Review report** with 5 scored categories:
  1. Code quality
  2. Security
  3. Performance
  4. Design conformance
  5. Test coverage
- **Per-file review**: Every implementation file listed
- **Issues list**: Each with file:line, severity, fix recommendation
- **Traceability verification**: Unmapped code flagged

## Phase 5: Testing

### Expected artifacts:

- **Implemented test suite** — all test skeletons from Phase 1 realized
- **Test distribution**: ~40/30/20/10 (positive/negative/edge/security)
- **Naming convention**: Should_[Behavior]_When_[Condition]
- **V-Model levels**: Unit + Integration + E2E tests present
- **AC coverage**: 100% of acceptance criteria have at least 1 test

### Structural checks:
- Test files use project's test framework (node:test or jest based on CLAUDE.md)
- No test depends on another test's state
- Security tests include: auth bypass, injection, XSS (>= 3 total)

## Phase 6: Deployment

### Expected artifacts:

- **Deployment plan**: Pre-deployment checklist, all items addressed
- **Rollback plan**: Documented triggers + steps
- **Acceptance verification**: All ACs confirmed passing
- **Monitoring**: >= 2 alert rules (error rate, latency)
- **Environment config**: All env vars documented
- **Breaking changes**: Listed with migration path (if any)

## Cross-Phase: Traceability Matrix (Final)

The completed matrix should show the full chain:

```
PRD Section -> User Story -> AC -> Test Skeleton -> Code File -> Test File -> Deployment Check
```

No orphans at any level. Every PRD requirement traces all the way to deployment.

## Cross-Phase: Knowledge Capture

After each phase approval, expect a knowledge entry with:
- Phase name
- Key findings/learnings
- Patterns discovered
- Recommendations for future cycles
