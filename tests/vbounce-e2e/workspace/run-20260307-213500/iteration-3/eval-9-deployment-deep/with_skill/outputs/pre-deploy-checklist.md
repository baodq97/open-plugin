# Pre-Deployment Checklist: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Agent**: deployment-engineer
**Generated**: 2026-03-08
**Target**: Production Kubernetes Cluster

---

## Instructions

Every item below must be checked off (marked `[x]`) before deployment begins. Each item is specific and verifiable -- no item should be marked complete without explicit evidence.

---

## 1. Test Results Verification

- [ ] All 210 tests passing with 0 failures (reference: `testing/test-results.md`)
  - [ ] 45 unit tests passing (validation, task-service, board-service, membership-service, search-service, retention-service, webhook-delivery-driver, webhook-retry-queue)
  - [ ] 74 integration tests passing (task-crud: 17, board-management: 12, webhook: 10, search: 12, activity-log: 9, nfr: 14)
  - [ ] 8 system tests passing (STS-001 through STS-008)
  - [ ] 51 security tests passing (SECTS-001 through SECTS-010, covering 51 test vectors)
  - [ ] 6 E2E tests passing (E2E-001 through E2E-006)
  - [ ] 38 edge case tests passing (task fields, board columns, search, webhooks, activity log, concurrency, rate limiting)
- [ ] 100% AC coverage verified: 56/56 acceptance criteria have at least 1 passing test (reference: `testing/coverage-matrix.md`)
- [ ] Test execution completed within expected time (~2.8s estimated)

## 2. Code Review Verification

- [ ] Code review score: 90.1/100, verdict PASS (threshold: 70) (reference: `review/review-report.md`)
- [ ] All 96/96 implementation files reviewed
- [ ] Hallucination detection score: 95/100 -- all 19 npm packages verified as real
- [ ] Security audit score: 88/100
- [ ] Code quality score: 90/100
- [ ] Logic correctness score: 87/100
- [ ] Performance score: 85/100

## 3. Security Findings Resolution

Reference: `review/security-findings.md`

### HIGH Severity (Must be resolved or risk-accepted with compensating controls)

- [ ] **S-01**: Hardcoded default encryption key removed
  - Verify: `WEBHOOK_ENCRYPTION_KEY` environment variable is set in Kubernetes secrets
  - Verify: Application fails to start if `WEBHOOK_ENCRYPTION_KEY` is not set (or add startup check)
  - Evidence: `kubectl get secret taskflow-secrets -n taskflow -o jsonpath='{.data.WEBHOOK_ENCRYPTION_KEY}' | base64 -d | wc -c` returns 32

- [ ] **S-03**: SSRF protection integrated into webhook delivery path
  - Verify: `WebhookService.deliverWebhook()` calls `WebhookDeliveryDriver.isPrivateUrl()` before `fetch()`
  - OR risk-accepted with compensating control: Kubernetes egress NetworkPolicy restricts outbound traffic to external HTTPS only (blocks 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 127.0.0.0/8)
  - Evidence: Code patch applied OR NetworkPolicy YAML reviewed and applied

### MEDIUM Severity (Triaged with accept/mitigate decision)

- [ ] **S-02**: HS256 mode restricted to non-production environments
  - Decision: [ACCEPT/MITIGATE]
  - Mitigation: `JWT_SECRET` environment variable is NOT set in production Kubernetes secrets
  - Evidence: `kubectl get secret taskflow-secrets -n taskflow -o jsonpath='{.data.JWT_SECRET}'` returns empty

- [ ] **S-06**: Activity logging not transactional with mutations
  - Decision: [ACCEPT for v1.0 / MITIGATE]
  - Compensating control: Monitor for orphaned task mutations without corresponding activity log entries
  - Evidence: Decision documented in deployment notes

- [ ] **S-08**: Board member and webhook routes missing `checkBoardAccess` middleware
  - Decision: [ACCEPT -- RBAC enforced at service layer]
  - Evidence: Service-layer authorization verified in code review (membership-service.ts:25-31, webhook-service.ts:34-39)

### LOW Severity (Documented for future iteration)

- [ ] **S-05**: No Retry-After header in 429 responses -- tracked in backlog
- [ ] **S-07**: No statement_timeout in pg pool -- tracked in backlog
- [ ] **S-04**: DNS rebinding risk in SSRF protection -- tracked in backlog

## 4. Database Migrations

- [ ] Migration files present and reviewed:
  - [ ] `src/infrastructure/database/migrations/001-create-boards.sql` (29 lines) -- boards table, updated_at trigger
  - [ ] `src/infrastructure/database/migrations/002-create-board-members.sql` (21 lines) -- board_members table, unique(board_id, user_id)
  - [ ] `src/infrastructure/database/migrations/003-create-tasks.sql` (56 lines) -- tasks table, tsvector trigger, GIN index, partial indexes on deleted_at
  - [ ] `src/infrastructure/database/migrations/004-create-webhooks.sql` (19 lines) -- webhooks table, encrypted_secret column
  - [ ] `src/infrastructure/database/migrations/005-create-webhook-deliveries.sql` (21 lines) -- webhook_deliveries table, retry status indexes
  - [ ] `src/infrastructure/database/migrations/006-create-activity-logs.sql` (18 lines) -- activity_logs table, composite indexes (board_id, created_at)
- [ ] All 6 migrations run successfully against staging PostgreSQL 16 instance
- [ ] Staging database schema verified: 6 tables, all indexes, all triggers created
- [ ] Migration user has appropriate privileges (CREATE TABLE, CREATE INDEX, CREATE TRIGGER, CREATE FUNCTION)
- [ ] Production database backup taken before migration (pg_dump with custom format)
- [ ] Backup integrity verified (pg_restore --list returns valid table of contents)

## 5. Environment Variables

### Required -- Application will not start without these

- [ ] `DATABASE_URL` -- PostgreSQL connection string set in Kubernetes secret `taskflow-secrets`
  - Format: `postgresql://<user>:<password>@<host>:5432/taskflow_production?sslmode=require`
- [ ] `DB_SSL` -- Set to `true` in Kubernetes ConfigMap `taskflow-config`
- [ ] `JWT_ISSUER` -- Company SSO issuer URL set in ConfigMap (e.g., `https://sso.company.internal`)
- [ ] `JWKS_URI` -- JWKS endpoint URL set in ConfigMap (e.g., `https://sso.company.internal/.well-known/jwks.json`)
- [ ] `WEBHOOK_ENCRYPTION_KEY` -- 32-byte key for AES-256-GCM, set in Kubernetes secret
- [ ] `NODE_ENV` -- Set to `production` in ConfigMap
- [ ] `PORT` -- Set to `3000` in ConfigMap

### Verified NOT set in production

- [ ] `JWT_SECRET` -- Must NOT be present (would enable insecure HS256 mode)

### Optional with safe defaults

- [ ] `DB_POOL_MAX` -- Default: 20 (appropriate for 2-5 pod replicas)
- [ ] `RATE_LIMIT_WINDOW_MS` -- Default: 60000 (1 minute)
- [ ] `RATE_LIMIT_MAX` -- Default: 100 (requests per window per user)
- [ ] `RETENTION_DAYS` -- Default: 90

## 6. Docker Image

- [ ] Docker image built from `Dockerfile` (multi-stage: build stage compiles TypeScript, production stage runs dist/)
  - Base image: `node:20-alpine`
- [ ] Image tagged as `taskflow-api:1.0.0` and `taskflow-api:latest`
- [ ] Image pushed to container registry (e.g., `registry.company.internal/taskflow-api:1.0.0`)
- [ ] Image size verified (expected: < 200MB for Alpine-based Node.js image)
- [ ] Image scanned for CVEs:
  - [ ] Zero CRITICAL vulnerabilities
  - [ ] Zero HIGH vulnerabilities
  - [ ] Medium/Low vulnerabilities documented and accepted
- [ ] Image runs successfully locally: `docker run -p 3000:3000 taskflow-api:1.0.0` responds on `/healthz`

## 7. Kubernetes Manifests

- [ ] **Deployment manifest** reviewed:
  - [ ] Image: `taskflow-api:1.0.0`
  - [ ] Replicas: 2
  - [ ] Resource requests: 256Mi memory, 100m CPU
  - [ ] Resource limits: 512Mi memory, 500m CPU
  - [ ] Environment variables from ConfigMap `taskflow-config` and Secret `taskflow-secrets`
  - [ ] Liveness probe: `GET /healthz` every 10s, failureThreshold 3
  - [ ] Readiness probe: `GET /readyz` every 5s, failureThreshold 3
  - [ ] Startup probe: `GET /healthz` every 2s, failureThreshold 15 (30s max startup)
  - [ ] Security context: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`

- [ ] **Service manifest** reviewed:
  - [ ] Type: ClusterIP
  - [ ] Port: 3000
  - [ ] Selector matches deployment labels

- [ ] **Ingress manifest** reviewed:
  - [ ] Host: `api.taskflow.internal`
  - [ ] TLS configured with valid certificate
  - [ ] Path: `/` -> service:3000

- [ ] **HPA manifest** reviewed:
  - [ ] Min replicas: 2
  - [ ] Max replicas: 5
  - [ ] Target CPU utilization: 70%

- [ ] **NetworkPolicy manifest** reviewed:
  - [ ] Ingress: Allow from ingress controller only
  - [ ] Egress: Allow to PostgreSQL (port 5432), company SSO (HTTPS), external webhook endpoints (HTTPS port 443)
  - [ ] Egress: Block private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) except PostgreSQL

## 8. Monitoring and Alerting

- [ ] Grafana dashboard "TaskFlow API - Production" created with panels:
  - [ ] Request rate (by endpoint and status code)
  - [ ] Error rate (5xx percentage)
  - [ ] Latency (p50, p95, p99)
  - [ ] CPU and memory usage per pod
  - [ ] Database connection pool utilization
  - [ ] Webhook delivery success/failure rate
  - [ ] Active pod count and HPA status
- [ ] Prometheus scraping configured for `/metrics` endpoint on each pod
- [ ] Alert rules configured (see `monitoring.md` for thresholds):
  - [ ] Error rate alert (> 5% for 5 minutes)
  - [ ] Latency p95 alert (> 500ms for 5 minutes)
  - [ ] CPU alert (> 85% for 3 minutes)
  - [ ] Memory alert (> 90% for 3 minutes)
  - [ ] Pod restart alert (> 1 restart in 15 minutes)
  - [ ] Database connection pool alert (> 85% for 1 minute)
  - [ ] Webhook delivery failure alert (> 10% for 15 minutes)
- [ ] PagerDuty service "TaskFlow API" created with escalation policy
- [ ] Slack webhook configured for `#taskflow-deploys` channel
- [ ] Test alert sent and received via PagerDuty
- [ ] Test notification sent and received in Slack `#taskflow-deploys`

## 9. Operational Readiness

- [ ] On-call engineer identified and available during deployment window
- [ ] Rollback procedure documented and reviewed by on-call engineer (see `deployment-plan.md` Section 7)
- [ ] Deployment window confirmed: low-traffic period (02:00-04:00 UTC recommended)
- [ ] Stakeholders notified of deployment schedule
- [ ] Communication plan in place (Slack `#taskflow-deploys` for updates)
- [ ] Production database connection verified from Kubernetes cluster (`kubectl run` test pod)
- [ ] SSO JWKS endpoint reachable from Kubernetes cluster (curl test from pod)
- [ ] DNS entry for `api.taskflow.internal` prepared (or existing, ready for switch)

## 10. Documentation

- [ ] API documentation available (17 endpoints documented)
- [ ] `.env.example` file includes all required and optional environment variables
- [ ] `docker-compose.yml` available for local development (API + PostgreSQL 16)
- [ ] Runbook for common operational scenarios:
  - [ ] Pod restart / crash loop investigation
  - [ ] Database connection exhaustion
  - [ ] Webhook delivery backlog
  - [ ] Rate limiting configuration change
  - [ ] Activity log retention manual trigger

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Deployment Engineer | __________ | __________ | __________ |
| On-Call Engineer | __________ | __________ | __________ |
| Engineering Lead | __________ | __________ | __________ |

**All items checked? Proceed to deployment execution per `deployment-plan.md`.**
