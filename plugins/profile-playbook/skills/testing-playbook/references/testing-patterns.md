# Common Testing Patterns

Reference guide for evaluating trade-offs during the Plan phase. Each pattern includes a risk-based analysis: start focused, expand when needed.

---

## 1. Test Strategy: Risk-Based vs Coverage-Based vs Exploratory-First

### When to choose what

| Criteria | Risk-Based | Coverage-Based | Exploratory-First |
|----------|-----------|---------------|-------------------|
| Project maturity | Any | Mature, stable | Early, uncertain requirements |
| Time pressure | High | Low | High |
| Requirements clarity | Clear risk areas | Well-defined requirements | Unclear or evolving |
| Team experience | Experienced | Any | Experienced testers |
| Best suited for | Most projects | Regulated, compliance-driven | New products, UX validation |

### Recommended approach

**Start with:** Risk-based — prioritize testing effort by business impact and technical complexity.

**When to add coverage-based:** When compliance or regulatory requirements demand traceable coverage of all requirements.

**When to add exploratory:** Always include some exploratory testing — it finds the defects that scripted tests miss. Budget 15-20% of test execution time for exploratory sessions.

**Key principle:** Risk-based testing does not mean less testing — it means smarter allocation of testing effort.

---

## 2. Automation: Full Automation vs Selective Automation vs Manual-First

### When to choose what

| Criteria | Full Automation | Selective Automation | Manual-First |
|----------|----------------|---------------------|--------------|
| Release frequency | Daily/weekly | Bi-weekly/monthly | Quarterly or less |
| UI stability | Stable | Moderately stable | Frequently changing |
| Team automation skill | Strong | Growing | Limited |
| Regression suite size | Large (500+) | Medium (100-500) | Small (<100) |
| Budget | High | Medium | Low |

### Recommended approach

**Start with:** Selective automation — automate the stable, high-value regression tests first. Keep exploratory and new-feature testing manual.

**Automation priority order:**
1. API/integration tests (high ROI, stable interfaces)
2. Core business flow regression (high risk, frequently run)
3. Data validation tests (repetitive, error-prone manually)
4. UI smoke tests (critical path only)
5. Full UI regression (only when UI is stable)

**Avoid:** Automating tests before the feature is stable. Unstable tests cost more to maintain than they save.

**Trigger to expand:** When manual regression testing takes more than 2 days per release cycle, automation ROI becomes clear.

---

## 3. Environment: Shared vs Dedicated vs Containerized

### When to choose what

| Criteria | Shared Environment | Dedicated Environment | Containerized |
|----------|-------------------|----------------------|---------------|
| Team size | 1-3 testers | 3+ testers | Any |
| Test independence | Low (conflicts possible) | High | Very high |
| Infrastructure cost | Low | High | Medium |
| Setup complexity | Low | Medium | High (initial) |
| Data isolation | Weak | Strong | Very strong |

### Recommended approach

**Start with:** Dedicated environment per test type (one for functional, one for integration, one for performance).

**When shared is acceptable:** Small team, sequential testing, no parallel execution needed.

**When containerized is worth it:** When test setup time exceeds 30 minutes per run, or when test data isolation is critical. Docker/Testcontainers pay off quickly for integration tests.

**Key principle:** Test environment problems are the number one cause of false failures and wasted time. Invest in environment stability before investing in test coverage.

---

## 4. Test Data: Production Clone vs Synthetic vs Hybrid

### When to choose what

| Criteria | Production Clone | Synthetic Data | Hybrid |
|----------|-----------------|---------------|--------|
| Data realism | Very high | Medium | High |
| Privacy/compliance | Risky (needs masking) | Safe | Depends on masking |
| Edge case coverage | Limited to prod patterns | Full control | Good |
| Setup effort | Medium (masking needed) | High (generation needed) | Medium |
| Maintenance | Low (refresh from prod) | Medium (update generators) | Medium |

### Recommended approach

**Start with:** Hybrid — production-cloned data (masked/anonymized) for realistic scenarios, synthetic data for edge cases and boundary conditions.

**Privacy requirements:** Never use unmasked production data in test environments. Apply data masking before any copy operation.

**Synthetic data priority:**
1. Boundary values (max/min/zero/negative)
2. Error conditions (invalid data, missing fields)
3. Volume data (for performance testing)
4. Compliance scenarios (GDPR deletion, data retention)

**Key principle:** Good test data is the foundation of good testing. Budget time for test data preparation — it is testing work, not overhead.

---

## 5. Regression: Full Suite vs Risk-Based Selection vs Change-Impact

### When to choose what

| Criteria | Full Suite | Risk-Based Selection | Change-Impact |
|----------|-----------|---------------------|---------------|
| Change scope | Major release | Feature release | Hotfix/patch |
| Time available | Days | Hours | Minutes |
| Risk tolerance | Low | Medium | Higher |
| Automation maturity | High | Any | Requires dependency mapping |
| Best suited for | Major releases, compliance | Regular releases | Emergency fixes |

### Recommended approach

**Start with:** Risk-based selection — run tests related to the change plus high-risk area regression. This is the best default for most releases.

**Full suite triggers:**
- Major version release
- Infrastructure or platform change
- Regulatory or compliance audit
- First release after long development freeze

**Change-impact triggers:**
- Single-file hotfix with clear blast radius
- Configuration-only change
- Rollback scenario testing

**Key principle:** Full regression for every release is often waste. Map test cases to risk areas, and select based on what changed and what it might affect.

---

## General Principles: Risk-First Testing

### Questions before every testing decision

1. **Risk test:** "What is the highest-risk area? Are we testing it deeply enough?"
2. **Value test:** "Does this testing activity reduce risk proportional to its cost?"
3. **Coverage test:** "Have we tested the scenarios that matter most to the business?"
4. **Feedback test:** "Are we getting test results fast enough to be useful?"

### Pattern

```
Identify risks → Prioritize by impact → Test deeply where it matters → Report honestly
   (discover)        (plan)                  (execute)                    (evaluate)
```

Do not test everything equally. Test what matters most, and be transparent about what was not tested and why.
