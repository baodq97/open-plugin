# Monitoring Configuration: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Agent**: deployment-engineer
**Generated**: 2026-03-08
**Stack**: Prometheus + Grafana + PagerDuty + Slack

---

## 1. Alert Thresholds

### 1.1 Error Rate Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_high_error_rate` | HTTP 5xx responses / total responses | > 5% | 5-minute rolling | CRITICAL | Page on-call, initiate rollback evaluation |
| `taskflow_elevated_error_rate` | HTTP 5xx responses / total responses | > 2% | 5-minute rolling | WARNING | Notify Slack, investigate |
| `taskflow_client_error_spike` | HTTP 4xx responses / total responses | > 25% | 10-minute rolling | WARNING | Notify Slack, investigate (possible attack or client misconfiguration) |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-errors
    rules:
      - alert: TaskFlowHighErrorRate
        expr: >
          (sum(rate(http_requests_total{app="taskflow-api", status=~"5.."}[5m]))
          / sum(rate(http_requests_total{app="taskflow-api"}[5m]))) > 0.05
        for: 5m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API error rate > 5%"
          description: "HTTP 5xx error rate is {{ $value | humanizePercentage }} over the last 5 minutes."
          runbook: "https://wiki.internal/taskflow/runbook/high-error-rate"

      - alert: TaskFlowElevatedErrorRate
        expr: >
          (sum(rate(http_requests_total{app="taskflow-api", status=~"5.."}[5m]))
          / sum(rate(http_requests_total{app="taskflow-api"}[5m]))) > 0.02
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API error rate > 2%"
          description: "HTTP 5xx error rate is {{ $value | humanizePercentage }} over the last 5 minutes."

      - alert: TaskFlowClientErrorSpike
        expr: >
          (sum(rate(http_requests_total{app="taskflow-api", status=~"4.."}[10m]))
          / sum(rate(http_requests_total{app="taskflow-api"}[10m]))) > 0.25
        for: 10m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API client error rate > 25%"
          description: "HTTP 4xx error rate is {{ $value | humanizePercentage }} over the last 10 minutes."
```

### 1.2 Latency Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_high_latency_p95` | HTTP response time p95 | > 500ms | 5-minute rolling | CRITICAL | Page on-call, initiate rollback evaluation |
| `taskflow_elevated_latency_p95` | HTTP response time p95 | > 300ms | 5-minute rolling | WARNING | Notify Slack, investigate |
| `taskflow_high_latency_p99` | HTTP response time p99 | > 1000ms | 5-minute rolling | CRITICAL | Page on-call |
| `taskflow_elevated_latency_p99` | HTTP response time p99 | > 750ms | 5-minute rolling | WARNING | Notify Slack |
| `taskflow_db_query_latency` | Database query time p95 | > 200ms | 5-minute rolling | WARNING | Investigate slow queries |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-latency
    rules:
      - alert: TaskFlowHighLatencyP95
        expr: >
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)
          ) > 0.5
        for: 5m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API p95 latency > 500ms"
          description: "p95 latency is {{ $value | humanizeDuration }} over the last 5 minutes."
          runbook: "https://wiki.internal/taskflow/runbook/high-latency"

      - alert: TaskFlowElevatedLatencyP95
        expr: >
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)
          ) > 0.3
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API p95 latency > 300ms"
          description: "p95 latency is {{ $value | humanizeDuration }} over the last 5 minutes."

      - alert: TaskFlowHighLatencyP99
        expr: >
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)
          ) > 1.0
        for: 5m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API p99 latency > 1000ms"
          description: "p99 latency is {{ $value | humanizeDuration }} over the last 5 minutes."

      - alert: TaskFlowElevatedLatencyP99
        expr: >
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)
          ) > 0.75
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API p99 latency > 750ms"

      - alert: TaskFlowDBQueryLatency
        expr: >
          histogram_quantile(0.95,
            sum(rate(db_query_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)
          ) > 0.2
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow DB query p95 latency > 200ms"
```

### 1.3 Resource Utilization Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_high_cpu` | Container CPU usage | > 85% of limit (425m of 500m) | 3-minute rolling | CRITICAL | Page on-call, check for runaway processes |
| `taskflow_elevated_cpu` | Container CPU usage | > 70% of limit (350m of 500m) | 5-minute rolling | WARNING | Notify Slack, HPA should be scaling |
| `taskflow_high_memory` | Container memory usage | > 90% of limit (460Mi of 512Mi) | 3-minute rolling | CRITICAL | Page on-call, investigate memory leak |
| `taskflow_elevated_memory` | Container memory usage | > 80% of limit (410Mi of 512Mi) | 5-minute rolling | WARNING | Notify Slack, monitor trend |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-resources
    rules:
      - alert: TaskFlowHighCPU
        expr: >
          (sum(rate(container_cpu_usage_seconds_total{container="taskflow-api"}[3m])) by (pod)
          / sum(kube_pod_container_resource_limits{container="taskflow-api", resource="cpu"}) by (pod)) > 0.85
        for: 3m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API CPU > 85% of limit on {{ $labels.pod }}"
          description: "CPU usage is {{ $value | humanizePercentage }} of the 500m limit."
          runbook: "https://wiki.internal/taskflow/runbook/high-cpu"

      - alert: TaskFlowElevatedCPU
        expr: >
          (sum(rate(container_cpu_usage_seconds_total{container="taskflow-api"}[5m])) by (pod)
          / sum(kube_pod_container_resource_limits{container="taskflow-api", resource="cpu"}) by (pod)) > 0.70
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API CPU > 70% of limit on {{ $labels.pod }}"

      - alert: TaskFlowHighMemory
        expr: >
          (sum(container_memory_working_set_bytes{container="taskflow-api"}) by (pod)
          / sum(kube_pod_container_resource_limits{container="taskflow-api", resource="memory"}) by (pod)) > 0.90
        for: 3m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API memory > 90% of limit (460Mi/512Mi) on {{ $labels.pod }}"
          description: "Memory usage is {{ $value | humanizePercentage }} of the 512Mi limit."
          runbook: "https://wiki.internal/taskflow/runbook/high-memory"

      - alert: TaskFlowElevatedMemory
        expr: >
          (sum(container_memory_working_set_bytes{container="taskflow-api"}) by (pod)
          / sum(kube_pod_container_resource_limits{container="taskflow-api", resource="memory"}) by (pod)) > 0.80
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API memory > 80% of limit (410Mi/512Mi) on {{ $labels.pod }}"
```

### 1.4 Database Connection Pool Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_db_pool_exhaustion` | Active connections / pool max | > 85% (17 of 20 connections) | 1-minute rolling | CRITICAL | Page on-call, investigate query bottleneck |
| `taskflow_db_pool_high` | Active connections / pool max | > 70% (14 of 20 connections) | 3-minute rolling | WARNING | Notify Slack, monitor trend |
| `taskflow_db_connection_errors` | Connection error count | > 5 errors | 5-minute rolling | WARNING | Investigate database connectivity |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-database
    rules:
      - alert: TaskFlowDBPoolExhaustion
        expr: >
          (taskflow_db_pool_active_connections / taskflow_db_pool_max_connections) > 0.85
        for: 1m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow DB connection pool > 85% ({{ $value | humanizePercentage }})"
          description: "Active connections: {{ $value * 20 | printf \"%.0f\" }} of 20 max."
          runbook: "https://wiki.internal/taskflow/runbook/db-pool-exhaustion"

      - alert: TaskFlowDBPoolHigh
        expr: >
          (taskflow_db_pool_active_connections / taskflow_db_pool_max_connections) > 0.70
        for: 3m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow DB connection pool > 70%"

      - alert: TaskFlowDBConnectionErrors
        expr: >
          increase(taskflow_db_connection_errors_total[5m]) > 5
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow DB connection errors > 5 in 5 minutes"
```

### 1.5 Webhook Delivery Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_webhook_failure_rate` | Failed deliveries / total deliveries | > 10% | 15-minute rolling | CRITICAL | Investigate webhook endpoint health |
| `taskflow_webhook_elevated_failures` | Failed deliveries / total deliveries | > 5% | 15-minute rolling | WARNING | Notify Slack |
| `taskflow_webhook_permanently_failed` | Permanently failed delivery count | > 10 | 1-hour window | WARNING | Review failed endpoints |
| `taskflow_webhook_retry_backlog` | Pending retries in queue | > 50 | 5-minute rolling | WARNING | Check for endpoint outage |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-webhooks
    rules:
      - alert: TaskFlowWebhookFailureRate
        expr: >
          (sum(rate(taskflow_webhook_deliveries_total{status="failed"}[15m]))
          / sum(rate(taskflow_webhook_deliveries_total[15m]))) > 0.10
        for: 15m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow webhook delivery failure rate > 10%"
          description: "Webhook failure rate is {{ $value | humanizePercentage }} over the last 15 minutes."
          runbook: "https://wiki.internal/taskflow/runbook/webhook-failures"

      - alert: TaskFlowWebhookElevatedFailures
        expr: >
          (sum(rate(taskflow_webhook_deliveries_total{status="failed"}[15m]))
          / sum(rate(taskflow_webhook_deliveries_total[15m]))) > 0.05
        for: 15m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow webhook delivery failure rate > 5%"

      - alert: TaskFlowWebhookPermanentlyFailed
        expr: >
          increase(taskflow_webhook_deliveries_total{status="permanently_failed"}[1h]) > 10
        for: 0m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow > 10 permanently failed webhook deliveries in 1 hour"

      - alert: TaskFlowWebhookRetryBacklog
        expr: >
          taskflow_webhook_retry_queue_size > 50
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow webhook retry queue > 50 pending"
```

### 1.6 Pod Health Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_pod_restarts` | Container restart count | > 1 restart | 15-minute window | CRITICAL | Page on-call, investigate crash loop |
| `taskflow_pod_not_ready` | Pod ready condition | Pod not ready | 2-minute duration | CRITICAL | Page on-call |
| `taskflow_insufficient_replicas` | Available replicas | < 2 replicas | 1-minute duration | CRITICAL | Page on-call, check HPA and node capacity |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-pods
    rules:
      - alert: TaskFlowPodRestarts
        expr: >
          increase(kube_pod_container_status_restarts_total{container="taskflow-api"}[15m]) > 1
        for: 0m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API pod {{ $labels.pod }} restarted > 1 time in 15 minutes"
          runbook: "https://wiki.internal/taskflow/runbook/pod-restarts"

      - alert: TaskFlowPodNotReady
        expr: >
          kube_pod_status_ready{pod=~"taskflow-api.*"} == 0
        for: 2m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API pod {{ $labels.pod }} not ready for > 2 minutes"

      - alert: TaskFlowInsufficientReplicas
        expr: >
          kube_deployment_status_replicas_available{deployment="taskflow-api"} < 2
        for: 1m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API has < 2 available replicas"
```

### 1.7 Rate Limiting Alerts

| Alert Name | Metric | Threshold | Window | Severity | Action |
|------------|--------|-----------|--------|----------|--------|
| `taskflow_rate_limit_high` | HTTP 429 responses | > 50 per minute | 5-minute rolling | WARNING | Investigate if legitimate traffic or abuse |
| `taskflow_rate_limit_spike` | HTTP 429 responses | > 200 per minute | 1-minute rolling | CRITICAL | Potential DDoS, review IP patterns |

**Prometheus Rules:**

```yaml
groups:
  - name: taskflow-rate-limiting
    rules:
      - alert: TaskFlowRateLimitHigh
        expr: >
          sum(rate(http_requests_total{app="taskflow-api", status="429"}[5m])) * 60 > 50
        for: 5m
        labels:
          severity: warning
          team: taskflow
        annotations:
          summary: "TaskFlow API > 50 rate-limited requests per minute"

      - alert: TaskFlowRateLimitSpike
        expr: >
          sum(rate(http_requests_total{app="taskflow-api", status="429"}[1m])) * 60 > 200
        for: 1m
        labels:
          severity: critical
          team: taskflow
        annotations:
          summary: "TaskFlow API > 200 rate-limited requests per minute (potential DDoS)"
```

---

## 2. Notification Channels

### 2.1 PagerDuty Configuration

| Parameter | Value |
|-----------|-------|
| Service Name | TaskFlow API - Production |
| Integration Type | Prometheus Alertmanager |
| Integration Key | `<configured in alertmanager secret>` |
| Escalation Policy | TaskFlow On-Call |
| Urgency (CRITICAL) | High -- phone call + push notification |
| Urgency (WARNING) | Low -- push notification only |
| Auto-resolve | Yes, when alert clears |
| Maintenance windows | Exclude during planned deployments |

### 2.2 Slack Configuration

| Parameter | Value |
|-----------|-------|
| Channel (deploys) | `#taskflow-deploys` |
| Channel (alerts) | `#taskflow-alerts` |
| Channel (incidents) | `#engineering-incidents` |
| Webhook URL | `<configured in alertmanager secret>` |
| CRITICAL alerts | Post to `#taskflow-alerts` + `#engineering-incidents` |
| WARNING alerts | Post to `#taskflow-alerts` only |
| Deploy notifications | Post to `#taskflow-deploys` |
| Alert format | Include: alert name, severity, current value, threshold, runbook link |

### 2.3 Email Configuration

| Parameter | Value |
|-----------|-------|
| Recipients (CRITICAL) | `oncall@company.internal`, `engineering-leads@company.internal` |
| Recipients (WARNING) | `taskflow-team@company.internal` |
| Send condition | Only for alerts lasting > 15 minutes |
| Format | HTML with metric graphs (Grafana rendered images) |

### Alertmanager Route Configuration

```yaml
route:
  receiver: slack-taskflow-alerts
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
        team: taskflow
      receiver: pagerduty-taskflow-critical
      continue: true
    - match:
        severity: critical
        team: taskflow
      receiver: slack-taskflow-critical
    - match:
        severity: warning
        team: taskflow
      receiver: slack-taskflow-warnings

receivers:
  - name: pagerduty-taskflow-critical
    pagerduty_configs:
      - service_key: '<PAGERDUTY_INTEGRATION_KEY>'
        severity: critical
        description: '{{ .CommonAnnotations.summary }}'
        details:
          description: '{{ .CommonAnnotations.description }}'
          runbook: '{{ .CommonAnnotations.runbook }}'

  - name: slack-taskflow-critical
    slack_configs:
      - api_url: '<SLACK_WEBHOOK_URL>'
        channel: '#taskflow-alerts'
        title: 'CRITICAL: {{ .CommonLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
        color: 'danger'
        send_resolved: true

  - name: slack-taskflow-warnings
    slack_configs:
      - api_url: '<SLACK_WEBHOOK_URL>'
        channel: '#taskflow-alerts'
        title: 'WARNING: {{ .CommonLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
        color: 'warning'
        send_resolved: true
```

---

## 3. Escalation Procedures

### 3.1 Escalation Levels

| Level | Role | Response Time | Contact Method | When |
|-------|------|---------------|----------------|------|
| L1 | On-Call Engineer | < 5 minutes | PagerDuty phone call + push | All CRITICAL alerts |
| L2 | Team Lead / Senior Engineer | < 15 minutes | PagerDuty escalation + Slack DM | L1 unable to resolve in 15 minutes, or multiple CRITICAL alerts simultaneously |
| L3 | Engineering Manager + Principal Engineer | < 30 minutes | Phone call + email | Service outage > 30 minutes, data loss suspected, or security incident |

### 3.2 Escalation Timeline

```
T+0:00  Alert fires
        -> PagerDuty pages L1 on-call
        -> Slack notification to #taskflow-alerts
        -> L1 acknowledges within 5 minutes

T+0:05  If no acknowledgment:
        -> PagerDuty auto-escalates to L2
        -> Slack notification to #engineering-incidents

T+0:15  If issue not resolved or diagnosis unclear:
        -> L1 manually escalates to L2
        -> L2 joins investigation

T+0:30  If service still degraded:
        -> L2 escalates to L3
        -> Engineering Manager notified
        -> Status page updated (if external)

T+1:00  If service still down:
        -> Executive notification
        -> All hands on deck
        -> External status page updated
```

### 3.3 Escalation Decision Matrix

| Condition | Action |
|-----------|--------|
| Error rate > 5% for 5 minutes | L1 investigates, rollback if needed |
| Error rate > 5% for 15 minutes despite rollback | Escalate to L2 |
| p95 latency > 500ms for 5 minutes | L1 investigates, check DB and pod resources |
| p95 latency > 500ms for 15 minutes | Escalate to L2 |
| Pod crash loop (> 3 restarts in 15 min) | L1 checks logs, escalate to L2 if no clear root cause |
| Database connection pool > 85% | L1 investigates slow queries, increase pool if needed |
| Database connection pool at 100% | Escalate to L2 immediately |
| Webhook delivery failure > 10% | L1 investigates external endpoint health |
| Data loss suspected | Escalate to L3 immediately |
| Security breach suspected | Escalate to L3 immediately, engage security team |

---

## 4. Grafana Dashboard Panels

### 4.1 Dashboard: TaskFlow API - Production

**Row 1: Overview**

| Panel | Type | Query | Description |
|-------|------|-------|-------------|
| Request Rate | Time Series | `sum(rate(http_requests_total{app="taskflow-api"}[5m]))` | Total requests per second |
| Error Rate (%) | Gauge | `sum(rate(http_requests_total{app="taskflow-api",status=~"5.."}[5m])) / sum(rate(http_requests_total{app="taskflow-api"}[5m])) * 100` | Current 5xx error percentage |
| p95 Latency | Gauge | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{app="taskflow-api"}[5m])) by (le)) * 1000` | Current p95 in ms |
| Active Pods | Stat | `kube_deployment_status_replicas_available{deployment="taskflow-api"}` | Number of ready pods |

**Row 2: Latency**

| Panel | Type | Query | Description |
|-------|------|-------|-------------|
| Latency Distribution | Time Series | p50, p95, p99 quantiles | Latency over time |
| Latency by Endpoint | Table | `histogram_quantile(0.95, ...) by (path)` | p95 per API endpoint |
| DB Query Latency | Time Series | p50, p95 of `db_query_duration_seconds` | Database performance |

**Row 3: Resources**

| Panel | Type | Query | Description |
|-------|------|-------|-------------|
| CPU Usage | Time Series | `rate(container_cpu_usage_seconds_total{container="taskflow-api"}[5m])` per pod | CPU over time |
| Memory Usage | Time Series | `container_memory_working_set_bytes{container="taskflow-api"}` per pod | Memory over time |
| DB Connections | Gauge | `taskflow_db_pool_active_connections / taskflow_db_pool_max_connections * 100` | Pool utilization % |

**Row 4: Webhooks**

| Panel | Type | Query | Description |
|-------|------|-------|-------------|
| Webhook Delivery Rate | Time Series | `rate(taskflow_webhook_deliveries_total[5m])` by status | Success/failure over time |
| Webhook Failure Rate (%) | Gauge | Failed / total * 100 | Current failure percentage |
| Retry Queue Size | Time Series | `taskflow_webhook_retry_queue_size` | Pending retries |

**Row 5: Business Metrics**

| Panel | Type | Query | Description |
|-------|------|-------|-------------|
| Requests by Status | Time Series | `rate(http_requests_total{app="taskflow-api"}[5m])` by status code | 2xx/4xx/5xx distribution |
| Requests by Endpoint | Table | `rate(http_requests_total{app="taskflow-api"}[5m])` by path | Traffic per endpoint |
| Rate Limited Requests | Time Series | `rate(http_requests_total{app="taskflow-api",status="429"}[5m])` | 429 responses over time |
| HPA Status | Time Series | `kube_hpa_status_current_replicas` | Scaling activity |

---

## 5. Health Check Endpoints

| Endpoint | Purpose | Expected Response | Check Interval |
|----------|---------|-------------------|----------------|
| `GET /healthz` | Liveness probe | `{"status":"ok"}` (HTTP 200) | Every 10 seconds |
| `GET /readyz` | Readiness probe | `{"status":"ok","database":"connected"}` (HTTP 200) | Every 5 seconds |

### Failure Conditions

| Endpoint | Failure Response | K8s Action |
|----------|-----------------|------------|
| `/healthz` returns non-200 | `{"status":"error"}` (HTTP 503) | Pod restarted after 3 consecutive failures |
| `/readyz` returns non-200 | `{"status":"error","database":"disconnected"}` (HTTP 503) | Pod removed from service, no traffic routed |

---

## 6. Log Monitoring

### 6.1 Structured Log Format

All application logs should follow this format (currently using console.log; recommend migration to pino):

```json
{
  "level": "info|warn|error",
  "timestamp": "2026-03-08T02:00:00.000Z",
  "message": "...",
  "requestId": "uuid",
  "userId": "uuid",
  "method": "GET|POST|PATCH|DELETE",
  "path": "/boards/:boardId/tasks",
  "statusCode": 200,
  "duration": 45,
  "error": { "name": "...", "message": "...", "stack": "..." }
}
```

### 6.2 Log-Based Alerts

| Pattern | Threshold | Window | Action |
|---------|-----------|--------|--------|
| `"level":"error"` entries | > 50 per minute | 5-minute rolling | WARNING: investigate |
| `"ECONNREFUSED"` in logs | > 3 occurrences | 1-minute rolling | CRITICAL: database connectivity |
| `"OutOfMemory"` in logs | > 0 | Immediate | CRITICAL: memory leak investigation |
| `"WEBHOOK_ENCRYPTION_KEY"` in logs | > 0 | Immediate | CRITICAL: secret exposure, rotate key |

---

## 7. SLO Targets

| SLO | Target | Measurement Window | Budget |
|-----|--------|--------------------|--------|
| Availability | >= 99.5% | 30-day rolling | 3.6 hours downtime / 30 days |
| API Latency (p95) | <= 200ms | 30-day rolling | 5% of time windows may exceed |
| Webhook Delivery | >= 99% | 24-hour rolling | 1% failure allowed with retries |
| Error Rate | < 0.1% | 24-hour rolling | 0.1% of requests may return 5xx |

### SLO Burn Rate Alerts

| Alert | Condition | Window | Action |
|-------|-----------|--------|--------|
| Fast burn (availability) | Error budget consumed at 14.4x rate | 1-hour window | Page on-call |
| Slow burn (availability) | Error budget consumed at 6x rate | 6-hour window | Notify Slack |
| Fast burn (latency) | SLO violated at 14.4x rate | 1-hour window | Page on-call |
| Slow burn (latency) | SLO violated at 6x rate | 6-hour window | Notify Slack |
