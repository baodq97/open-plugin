# Quality Criteria Reference

Summary index of phase-specific quality criteria. Detailed criteria are embedded in each per-phase QG agent.

## Scoring Guide

Each criterion is scored as:
- **PASS**: Meets or exceeds threshold
- **WARN**: Partially meets threshold (minor gaps)
- **FAIL**: Does not meet threshold (blocking issue)

## Verdict Calculation

- **PASS**: All criteria PASS
- **WARN**: No FAIL criteria, <= 2 WARN criteria
- **FAIL**: Any criterion FAIL, or > 2 WARN criteria

## Phase → QG Agent Index

| Phase | QG Agent | Key Criteria | Model |
|-------|----------|-------------|-------|
| **Requirements** | `qg-requirements` | Ambiguity scoring, AC testability, NFR completeness, story independence (INVEST), traceability coverage | sonnet |
| **Design** | `qg-design` | Architecture consistency, STRIDE coverage, API-story mapping, design-time test specs (ITS-*/STS-*/SECTS-*), ADR presence, data model integrity | sonnet |
| **Contracts** | *(no QG agent — orchestrator validates completeness inline)* | Contract completeness, api-surface.yaml coverage, test-plan.yaml coverage, language match | — |
| **Implementation** | `qg-implementation` | Hallucination detection, contract conformance, file size, test distribution (40/20/10/10/10/10), V-Model levels, AC coverage, design spec compliance, execution results | sonnet |
| **Review** | *(no QG — review IS the deep check)* | — | — |
| **Deployment** | `qg-deployment` | Acceptance verification (100% ACs with passing test), rollback plan (quantitative triggers), checklist completeness, monitoring alerts (>= 2) | sonnet |
