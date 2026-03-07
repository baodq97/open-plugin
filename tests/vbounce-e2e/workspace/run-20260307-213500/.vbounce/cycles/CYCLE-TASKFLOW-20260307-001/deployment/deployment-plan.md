# Deployment Plan: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Agent**: deployment-engineer
**Generated**: 2026-03-08
**Version**: 1.0
**Strategy**: Blue-Green Deployment with Canary Validation

---

## 1. Deployment Overview

| Parameter | Value |
|-----------|-------|
| Application | TaskFlow API v1.0.0 |
| Target Environment | Production Kubernetes Cluster (`taskflow` namespace) |
| Strategy | Blue-Green with 10% canary phase |
| Replicas | 2 (min) to 5 (max via HPA) |
| Database | PostgreSQL 16 (managed/RDS) |
| Docker Image | `taskflow-api:1.0.0` (Node.js 20 Alpine, multi-stage) |
| Estimated Downtime | Zero (blue-green swap) |
| Rollback Time | < 2 minutes (DNS/service swap back to blue) |

---

## 2. Pre-Deployment Checklist

All items must be verified and checked off before proceeding to deployment steps.

- [ ] All 210 tests passing (reference: `testing/test-results.md` -- 210/210 PASS, 0 failures)
- [ ] 100% AC coverage verified (reference: `testing/coverage-matrix.md` -- 56/56 ACs covered)
- [ ] Code review passed with score 90.1/100 (reference: `review/review-report.md` -- verdict PASS, threshold 70)
- [ ] All HIGH severity security findings addressed or risk-accepted:
  - [ ] S-01: Hardcoded default encryption key -- `WEBHOOK_ENCRYPTION_KEY` env var set in production secrets (not using default)
  - [ ] S-03: SSRF protection integration -- `WebhookDeliveryDriver.isPrivateUrl()` integrated into `WebhookService` delivery path, or risk accepted with compensating control (egress NetworkPolicy)
- [ ] All MEDIUM severity security findings triaged:
  - [ ] S-02: HS256 mode gated behind `NODE_ENV !== 'production'` or `JWT_SECRET` not set in production
  - [ ] S-06: Activity logging transactional gap -- accepted for v1.0 with monitoring
  - [ ] S-08: `checkBoardAccess` middleware coverage -- accepted (service-layer RBAC enforced)
- [ ] Database migrations verified in staging:
  - [ ] `001-create-boards.sql` -- boards table + updated_at trigger
  - [ ] `002-create-board-members.sql` -- board_members table + unique constraint
  - [ ] `003-create-tasks.sql` -- tasks table + tsvector trigger + GIN index + partial indexes
  - [ ] `004-create-webhooks.sql` -- webhooks table + encrypted secret column
  - [ ] `005-create-webhook-deliveries.sql` -- webhook_deliveries table + retry indexes
  - [ ] `006-create-activity-logs.sql` -- activity_logs table + composite indexes
- [ ] All migrations run successfully against staging PostgreSQL 16 instance
- [ ] Environment variables documented and configured in Kubernetes secrets/configmaps (see Section 5)
- [ ] Docker image `taskflow-api:1.0.0` built, tagged, and pushed to container registry
- [ ] Docker image scanned for CVEs (zero critical, zero high vulnerabilities)
- [ ] Kubernetes manifests reviewed:
  - [ ] Deployment (replicas: 2, resource limits: 256Mi-512Mi memory, 100m-500m CPU)
  - [ ] Service (ClusterIP)
  - [ ] Ingress (api.taskflow.internal)
  - [ ] HPA (min: 2, max: 5, target CPU: 70%)
  - [ ] NetworkPolicy (egress restricted to PostgreSQL + external HTTPS for webhooks)
- [ ] Liveness probe configured: `GET /healthz` every 10s, 3 failure threshold
- [ ] Readiness probe configured: `GET /readyz` every 5s, 3 failure threshold
- [ ] Startup probe configured: `GET /healthz` every 2s, 15 failure threshold (30s max)
- [ ] Monitoring dashboards configured in Grafana (see `monitoring.md`)
- [ ] PagerDuty integration configured for alerting
- [ ] Slack channel `#taskflow-deploys` configured for notifications
- [ ] Rollback procedure reviewed by on-call engineer
- [ ] Deployment window confirmed: low-traffic period (02:00-04:00 UTC recommended)

---

## 3. Deployment Steps

### Phase 1: Database Migration (Green Environment Preparation)

**Step 1.1: Create database backup**

```bash
pg_dump -h $DB_HOST -U $DB_USER -d taskflow_production -Fc -f taskflow_backup_$(date +%Y%m%d_%H%M%S).dump
```

- Pre-verification: Confirm backup storage has sufficient space (>= 2x current DB size)
- Post-verification: Verify backup file size > 0 bytes; run `pg_restore --list` against backup to confirm integrity

**Step 1.2: Run database migrations on production database**

```bash
# Run migrations in order
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 001-create-boards.sql
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 002-create-board-members.sql
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 003-create-tasks.sql
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 004-create-webhooks.sql
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 005-create-webhook-deliveries.sql
psql -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -f 006-create-activity-logs.sql
```

- Pre-verification: Confirm migration user has CREATE TABLE, CREATE INDEX, CREATE TRIGGER privileges
- Post-verification: Run `\dt` to confirm all 6 tables created; run `\di` to confirm all indexes exist; verify tsvector trigger with `\df+ tasks_search_vector_update`

**Step 1.3: Verify database schema**

```bash
psql -h $DB_HOST -U $DB_USER -d taskflow_production -c "
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
"
```

- Post-verification: Confirm tables: `activity_logs`, `board_members`, `boards`, `tasks`, `webhook_deliveries`, `webhooks`

### Phase 2: Green Environment Deployment

**Step 2.1: Deploy green environment**

```bash
kubectl apply -f k8s/green/deployment.yaml -n taskflow
kubectl apply -f k8s/green/service.yaml -n taskflow
```

- Pre-verification: `kubectl get pods -n taskflow -l color=green` returns no existing green pods
- Post-verification: `kubectl rollout status deployment/taskflow-api-green -n taskflow --timeout=120s` succeeds

**Step 2.2: Wait for green pods to become ready**

```bash
kubectl wait --for=condition=ready pod -l app=taskflow-api,color=green -n taskflow --timeout=60s
```

- Post-verification: All green pods show `1/1 READY` status; readiness probe (`GET /readyz`) returning 200

**Step 2.3: Verify green environment health**

```bash
# Port-forward to green service for direct testing
kubectl port-forward svc/taskflow-api-green 8080:3000 -n taskflow &
curl -s http://localhost:8080/healthz | jq .
curl -s http://localhost:8080/readyz | jq .
```

- Post-verification: `/healthz` returns `{"status":"ok"}`; `/readyz` returns `{"status":"ok","database":"connected"}`

**Step 2.4: Run smoke tests against green environment**

```bash
# Smoke test: unauthenticated request returns 401
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/boards
# Expected: 401

# Smoke test: health endpoints respond
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/healthz
# Expected: 200

# Smoke test: rate limiter headers present
curl -s -I http://localhost:8080/healthz | grep -i "x-ratelimit"
```

- Post-verification: 401 for unauthenticated requests; 200 for health endpoints; rate limit headers present

### Phase 3: Canary Deployment (10% Traffic)

**Step 3.1: Route 10% traffic to green**

```bash
kubectl apply -f k8s/canary/ingress-weighted.yaml -n taskflow
# Sets: nginx.ingress.kubernetes.io/canary-weight: "10"
```

- Pre-verification: Blue environment is currently serving 100% traffic
- Post-verification: Verify weighted routing via repeated requests; approximately 10% should hit green pods

**Step 3.2: Monitor canary for 15 minutes**

Monitor the following metrics during the canary window:

| Metric | Threshold | Action if Exceeded |
|--------|-----------|-------------------|
| Error rate (5xx) on green pods | > 2% of requests | Immediate rollback |
| p95 latency on green pods | > 300ms | Immediate rollback |
| CPU usage on green pods | > 80% | Immediate rollback |
| Memory usage on green pods | > 450Mi (88% of 512Mi limit) | Immediate rollback |
| Readiness probe failures | > 0 | Immediate rollback |

- Post-verification: All canary metrics within thresholds for full 15-minute window

### Phase 4: Full Traffic Switch (Blue-Green Swap)

**Step 4.1: Switch 100% traffic to green**

```bash
kubectl apply -f k8s/production/ingress-green.yaml -n taskflow
# Points service selector to color=green
```

- Pre-verification: Canary phase completed with all metrics within thresholds
- Post-verification: All requests now routed to green pods; blue pods still running as fallback

**Step 4.2: Monitor full traffic for 30 minutes**

Monitor all metrics from Section 6 (Rollback Triggers) for 30 minutes.

- Post-verification: All metrics within thresholds for full 30-minute observation window

**Step 4.3: Decommission blue environment**

```bash
# Only after 30-minute observation window passes with no issues
kubectl delete deployment taskflow-api-blue -n taskflow
kubectl delete service taskflow-api-blue -n taskflow
```

- Pre-verification: 30-minute observation window passed; all metrics green
- Post-verification: Only green pods running; confirm application still healthy via `/healthz` and `/readyz`

### Phase 5: Post-Deployment Verification

**Step 5.1: Verify all API endpoints**

```bash
# Run API endpoint verification against production
for endpoint in "/healthz" "/readyz"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.taskflow.internal$endpoint)
  echo "$endpoint: $STATUS"
done
```

- Post-verification: All health endpoints return 200

**Step 5.2: Verify retention scheduler**

- Post-verification: Check application logs for retention scheduler initialization: `"Retention scheduler started: daily at 02:00 UTC"`

**Step 5.3: Confirm monitoring and alerting**

- Post-verification: Trigger a test alert via PagerDuty integration; confirm receipt in `#taskflow-deploys` Slack channel

---

## 4. Environment Variables

All environment variables must be set in Kubernetes secrets/configmaps before deployment.

### Required (Application Fails to Start Without These)

| Variable | Description | Example | Source |
|----------|-------------|---------|--------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://taskflow:****@db.internal:5432/taskflow_production` | K8s Secret |
| `DB_SSL` | Enable TLS for database | `true` | K8s ConfigMap |
| `JWT_ISSUER` | SSO JWT issuer URL | `https://sso.company.internal` | K8s ConfigMap |
| `JWKS_URI` | SSO JWKS endpoint | `https://sso.company.internal/.well-known/jwks.json` | K8s ConfigMap |
| `WEBHOOK_ENCRYPTION_KEY` | AES-256-GCM key for webhook secrets (exactly 32 bytes) | `<32-byte-random-hex>` | K8s Secret |
| `NODE_ENV` | Environment | `production` | K8s ConfigMap |
| `PORT` | HTTP listen port | `3000` | K8s ConfigMap |

### Optional (With Defaults)

| Variable | Description | Default | Source |
|----------|-------------|---------|--------|
| `DB_POOL_MAX` | Max database connections | `20` | K8s ConfigMap |
| `DB_CONNECTION_TIMEOUT` | Connection timeout (ms) | `5000` | K8s ConfigMap |
| `DB_IDLE_TIMEOUT` | Idle connection timeout (ms) | `30000` | K8s ConfigMap |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `60000` | K8s ConfigMap |
| `RATE_LIMIT_MAX` | Max requests per window | `100` | K8s ConfigMap |
| `RETENTION_DAYS` | Activity log retention | `90` | K8s ConfigMap |
| `LOG_LEVEL` | Application log level | `info` | K8s ConfigMap |

### Must NOT Be Set in Production

| Variable | Reason |
|----------|--------|
| `JWT_SECRET` | Enables HS256 mode; production must use RS256 via JWKS only |

---

## 5. Deployment Strategy Details

### Blue-Green Architecture

```
                    +------------------+
                    |   Load Balancer  |
                    +--------+---------+
                             |
                    +--------+---------+
                    |     Ingress      |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v---------+        +----------v--------+
    |   Blue Service    |        |   Green Service   |
    |  (current prod)   |        |  (new version)    |
    +---+----------+----+        +---+----------+----+
        |          |                 |          |
    +---v--+  +----v-+          +---v--+  +----v-+
    |Pod 1 |  |Pod 2 |          |Pod 1 |  |Pod 2 |
    +------+  +------+          +------+  +------+
              |                             |
              +--------------+--------------+
                             |
                    +--------v---------+
                    |   PostgreSQL 16  |
                    |  (shared, RDS)   |
                    +------------------+
```

### Deployment Phases Timeline

| Phase | Duration | Traffic Split (Blue:Green) |
|-------|----------|--------------------------|
| 1. Database Migration | ~5 min | 100:0 |
| 2. Green Deployment | ~3 min | 100:0 |
| 3. Canary Validation | 15 min | 90:10 |
| 4. Full Switch | instant | 0:100 |
| 5. Observation | 30 min | 0:100 |
| 6. Blue Decommission | ~1 min | 0:100 (blue removed) |
| **Total** | **~54 min** | -- |

---

## 6. Rollback Triggers

Rollback is **automatically triggered** if ANY of the following quantitative thresholds are exceeded during the canary or observation phases:

### Error Rate Triggers

| Metric | Threshold | Window | Measurement |
|--------|-----------|--------|-------------|
| HTTP 5xx error rate | > 5% of total requests | 5-minute rolling | Prometheus `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])` |
| HTTP 5xx absolute count | > 50 errors | 5-minute rolling | Prometheus `increase(http_requests_total{status=~"5.."}[5m])` |
| Webhook delivery failure rate | > 10% of deliveries | 15-minute rolling | Application metrics: failed deliveries / total deliveries |

### Latency Triggers

| Metric | Threshold | Window | Measurement |
|--------|-----------|--------|-------------|
| API response p95 latency | > 500ms | 5-minute rolling | Prometheus `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| API response p99 latency | > 1000ms | 5-minute rolling | Prometheus `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` |
| Database query p95 latency | > 200ms | 5-minute rolling | Prometheus `histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))` |

### Resource Utilization Triggers

| Metric | Threshold | Window | Measurement |
|--------|-----------|--------|-------------|
| Pod CPU usage | > 85% of limit (425m of 500m) | 3-minute rolling | `container_cpu_usage_seconds_total` |
| Pod memory usage | > 90% of limit (460Mi of 512Mi) | 3-minute rolling | `container_memory_working_set_bytes` |
| Database connection pool utilization | > 85% (17 of 20 connections) | 1-minute rolling | Application metrics: active connections / pool max |

### Health Check Triggers

| Metric | Threshold | Window | Measurement |
|--------|-----------|--------|-------------|
| Readiness probe failures | > 0 consecutive failures | Immediate | Kubernetes probe status |
| Liveness probe failures | > 2 consecutive failures | Immediate | Kubernetes probe status |
| Pod restarts | > 1 restart in any pod | 15-minute window | `kube_pod_container_status_restarts_total` |

---

## 7. Rollback Procedures

### Automatic Rollback (During Canary Phase)

If any rollback trigger is exceeded during the canary phase (Phase 3):

1. Alert fires via PagerDuty and Slack `#taskflow-deploys`
2. Execute the following steps immediately:

**Step R1: Remove canary routing**
```bash
kubectl delete -f k8s/canary/ingress-weighted.yaml -n taskflow
```
Post-verification: All traffic routed to blue; `kubectl get ingress -n taskflow` shows no canary annotation

**Step R2: Scale down green deployment**
```bash
kubectl scale deployment taskflow-api-green --replicas=0 -n taskflow
```
Post-verification: `kubectl get pods -l color=green -n taskflow` returns no running pods

**Step R3: Verify blue environment health**
```bash
curl -s https://api.taskflow.internal/healthz
curl -s https://api.taskflow.internal/readyz
```
Post-verification: Both return 200; error rate returns to baseline (< 0.1%)

**Step R4: Notify stakeholders**
```bash
# Post to Slack
curl -X POST "$SLACK_WEBHOOK_URL" -H 'Content-Type: application/json' \
  -d '{"text":"ROLLBACK: TaskFlow API v1.0.0 deployment rolled back during canary phase. Blue environment restored. Investigating."}'
```

**Step R5: Capture diagnostic data**
```bash
kubectl logs -l app=taskflow-api,color=green -n taskflow --tail=500 > /tmp/green-rollback-logs.txt
kubectl describe pods -l app=taskflow-api,color=green -n taskflow > /tmp/green-rollback-describe.txt
```

### Manual Rollback (After Full Traffic Switch)

If any rollback trigger is exceeded after full traffic switch (Phase 4):

**Step R1: Switch traffic back to blue**
```bash
kubectl apply -f k8s/production/ingress-blue.yaml -n taskflow
```
Post-verification: Traffic routed to blue pods; confirm via `kubectl get ingress -n taskflow`

**Step R2: Verify blue environment is serving**
```bash
curl -s https://api.taskflow.internal/healthz
curl -s https://api.taskflow.internal/readyz
```
Post-verification: Both return 200

**Step R3: Scale down green**
```bash
kubectl scale deployment taskflow-api-green --replicas=0 -n taskflow
```

**Step R4: Assess database migration rollback need**

If migrations caused data corruption:
```bash
# Restore from pre-deployment backup
pg_restore -h $DB_HOST -U $DB_MIGRATION_USER -d taskflow_production -c taskflow_backup_YYYYMMDD_HHMMSS.dump
```
Post-verification: Run migration verification queries from Step 1.3

**Step R5: Notify stakeholders**
```bash
curl -X POST "$SLACK_WEBHOOK_URL" -H 'Content-Type: application/json' \
  -d '{"text":"ROLLBACK: TaskFlow API v1.0.0 fully rolled back. Blue environment restored. Database state verified. Initiating incident review."}'
```

**Step R6: Create incident report**
- Document trigger metric, threshold, and observed value
- Capture green pod logs and events
- Schedule post-mortem within 48 hours

---

## 8. Post-Deployment Monitoring Checklist

After successful deployment (Phase 5 complete):

- [ ] Error rate < 0.1% for 1 hour after deployment
- [ ] p95 latency < 200ms for 1 hour after deployment
- [ ] CPU usage < 50% during normal load
- [ ] Memory usage < 300Mi during normal load
- [ ] Database connection pool < 50% utilization
- [ ] Retention scheduler fires at 02:00 UTC (next day)
- [ ] Webhook delivery success rate > 99% for first 24 hours
- [ ] Zero pod restarts for first 24 hours
- [ ] HPA not scaling beyond 2 replicas under normal load

---

## 9. Communication Plan

| Timing | Channel | Message |
|--------|---------|---------|
| T-30 min | Slack `#taskflow-deploys` | Deployment starting in 30 minutes |
| T-0 | Slack `#taskflow-deploys` | Deployment initiated -- database migrations starting |
| Phase 2 complete | Slack `#taskflow-deploys` | Green environment deployed, starting canary |
| Phase 3 complete | Slack `#taskflow-deploys` | Canary validation passed, switching full traffic |
| Phase 5 complete | Slack `#taskflow-deploys` + email to stakeholders | Deployment complete, all metrics green |
| On rollback | PagerDuty + Slack `#taskflow-deploys` + `#engineering` | ROLLBACK: Details and ETA for resolution |
