# Approval Matrix

## Feature Cycle

```yaml
approval_matrix:
  requirements:
    approvers: ["Product Owner", "Business Analyst"]
    quorum: 1

  design:
    approvers: ["Tech Lead", "Architect"]
    quorum: 1

  implementation:
    auto_review: required
    approvers: ["Senior Developer", "Tech Lead"]
    quorum: 1

  review:
    approvers: ["Senior Developer", "Tech Lead"]
    quorum: 1
    note: "Review verdict accepted by requestor"

  deployment:
    staging:
      approvers: ["QA Lead"]
      quorum: 1
    production:
      approvers: ["Tech Lead", "Product Owner", "QA Lead"]
      quorum: 2  # Need 2 of 3
```

## Bugfix Cycle

| Phase | Approvers | Quorum |
|-------|-----------|--------|
| Triage | Senior Developer, Tech Lead | 1 |
| Fix Plan | Senior Developer, Tech Lead | 1 |
| Fix | Senior Developer, Tech Lead | 1 |
| Review | Senior Developer, Tech Lead | 1 |
| Verify | QA Lead, Senior Developer | 1 |
| Deploy-Staging | QA Lead | 1 |
| Deploy-Prod | Tech Lead, Product Owner, QA Lead | 2 of 3 |

## Hotfix Cycle

| Phase | Approvers | Quorum |
|-------|-----------|--------|
| Emergency Triage | On-call Engineer, Tech Lead | 1 |
| Rapid Fix | Senior Developer, Tech Lead | 1 |
| Express Review | Tech Lead | 1 |
| Emergency Deploy | Tech Lead, On-call Engineer | 1 |
| Post-Hotfix Review | Tech Lead, Product Owner, QA Lead | 2 of 3 |
