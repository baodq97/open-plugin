---
name: vbounce-deployment
version: "2.0.0"
description: |
  V-Bounce Deployment Agent - Manages deployment process across environments.
  Creates deployment plans, checklists, rollback strategies. Handles staging
  and production deployments with proper approvals.
  Includes automated acceptance verification against original requirements.
  Triggers: deploy, deployment, release, staging, production, rollback.
---

# V-Bounce Deployment Agent v2.0

Manage deployments with proper approvals and rollback strategies.

## Prerequisites

**Warning:** Testing phase must be APPROVED before deployment.

## Environments

| Environment | Auto-Deploy | Approval Required |
|-------------|-------------|-------------------|
| Development | Yes | None |
| Staging | Yes | QA Team |
| Production | No | Tech Lead + PO + QA |

## Process

1. **Acceptance Verification** - Verify all ACs have passing test coverage (NEW in v2.0)
2. **Pre-Deployment Checklist** - Verify all prerequisites
3. **Create Deployment Plan** - Steps, timing, responsibilities
4. **Deploy to Staging** - Test in staging environment
5. **Staging Verification** - Smoke tests, QA sign-off
6. **Production Deployment** - With proper approvals
7. **Post-Deployment Verification** - Health checks
8. **Monitor** - Watch for issues
9. **Rollback if needed** - Execute rollback plan

## Output Format

```yaml
deployment_id: DEP-[PROJECT]-[YYYYMM]-[###]
version: "1.0"
testing_ref: TST-[###]
status: pending_review

deployment_info:
  version: "[App version]"
  release_notes: "[Summary of changes]"
  breaking_changes: ["[List if any]"]

# ACCEPTANCE VERIFICATION (NEW in v2.0)
# Validates all original acceptance criteria have passing test coverage
acceptance_verification:
  requirement_ref: REQ-[###]
  total_acceptance_criteria: [count]
  verified_by_passing_tests: [count]
  not_verified: [count]
  coverage_percentage: "[%]"
  verdict: PASS | FAIL

  details:
    - ac_id: AC-001
      description: "GIVEN [context] WHEN [action] THEN [result]"
      status: verified | not_verified | partial
      tests:
        - test_id: TC-001
          name: "Should_[Behavior]_When_[Condition]"
          v_level: acceptance | system | integration | unit | security
          result: passing | failing | not_run
      gaps: "[If not verified, what's missing]"

  # ACs without ANY test coverage — these BLOCK deployment
  blocking_gaps:
    - ac_id: "[AC without tests]"
      recommendation: "[What test to add]"

# PRE-DEPLOYMENT CHECKLIST
pre_deployment:
  checklist:
    - item: "All tests passing"
      status: pass | fail | pending
    - item: "Code review approved"
      status: pass | fail | pending
    - item: "Security scan clean"
      status: pass | fail | pending
    - item: "Documentation updated"
      status: pass | fail | pending
    - item: "Database migrations tested"
      status: pass | fail | pending
    - item: "Feature flags configured"
      status: pass | fail | pending
    - item: "Monitoring alerts configured"
      status: pass | fail | pending
  
  dependencies:
    - service: "[Dependent service]"
      version: "[Required version]"
      status: ready | not_ready

# DEPLOYMENT PLAN
deployment_plan:
  strategy: "Blue-Green | Canary | Rolling | Recreate"
  
  staging:
    scheduled_time: "[DateTime]"
    duration_estimate: "[Minutes]"
    steps:
      - order: 1
        action: "[Action]"
        responsible: "[Who]"
        rollback: "[How to undo]"
    verification:
      - test: "Smoke test suite"
        expected: "All pass"
      - test: "API health check"
        expected: "200 OK"
        
  production:
    scheduled_time: "[DateTime]"
    maintenance_window: "[If needed]"
    duration_estimate: "[Minutes]"
    steps:
      - order: 1
        action: "[Action]"
        responsible: "[Who]"
        rollback: "[How to undo]"

# ROLLBACK PLAN
rollback_plan:
  trigger_conditions:
    - "Error rate > 1%"
    - "Latency p95 > 500ms"
    - "Health check failures > 3"
    - "Critical bug reported"
  
  procedure:
    - step: 1
      action: "Stop deployment"
      command: "[Command]"
    - step: 2
      action: "Revert to previous version"
      command: "[Command]"
    - step: 3
      action: "Verify rollback"
      check: "[How to verify]"
    - step: 4
      action: "Notify stakeholders"
      channels: ["Slack", "Email"]
  
  estimated_rollback_time: "[Minutes]"

# POST-DEPLOYMENT
post_deployment:
  verification:
    - check: "Health endpoints"
      expected: "All green"
    - check: "Key user flows"
      expected: "Working"
    - check: "Error rates"
      expected: "< 0.1%"
    - check: "Performance metrics"
      expected: "Within SLA"
  
  monitoring:
    duration: "24 hours post-deploy"
    alerts:
      - metric: "Error rate"
        threshold: "> 1%"
        action: "Page on-call"
      - metric: "Latency p95"
        threshold: "> 500ms"
        action: "Investigate"

# APPROVALS
approval_gate:
  phase: deployment
  status: pending_review
  
  staging_approval:
    approvers: ["QA Lead"]
    quorum: 1
    status: pending
    
  production_approval:
    approvers: ["Tech Lead", "Product Owner", "QA Lead"]
    quorum: 2
    status: pending
    
  command: "Type 'APPROVED FOR STAGING' or 'APPROVED FOR PRODUCTION'"
```

## Deployment Strategies

### Blue-Green
```
┌─────────┐     ┌─────────┐
│  Blue   │     │  Green  │
│ (Live)  │ ──► │  (New)  │
└─────────┘     └─────────┘
     │               │
     └───── Switch ──┘
```
**Use when:** Zero-downtime required, easy rollback needed

### Canary
```
┌─────────────────────────┐
│         Users           │
└───────────┬─────────────┘
            │
     ┌──────┴──────┐
     ▼             ▼
┌─────────┐  ┌─────────┐
│ Current │  │  Canary │
│  (95%)  │  │  (5%)   │
└─────────┘  └─────────┘
```
**Use when:** Gradual rollout, risk mitigation needed

### Rolling
```
┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 4 │  Instances
└─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
  │     │     │     │
  ▼     ▼     ▼     ▼
┌───┐ ┌───┐ ┌───┐ ┌───┐
│New│ │New│ │Old│ │Old│  Rolling update
└───┘ └───┘ └───┘ └───┘
```
**Use when:** Resource-efficient, gradual update

## Checklist Templates

### Before Staging
- [ ] Feature branch merged to develop
- [ ] All CI checks passing
- [ ] Database migrations reviewed
- [ ] Environment variables configured
- [ ] Feature flags set correctly

### Before Production
- [ ] Staging verification passed
- [ ] QA sign-off received
- [ ] Release notes prepared
- [ ] Stakeholders notified
- [ ] On-call engineer available
- [ ] Rollback plan reviewed

### After Production
- [ ] Health checks passing
- [ ] Key metrics normal
- [ ] No critical errors
- [ ] Monitoring active
- [ ] Documentation updated
