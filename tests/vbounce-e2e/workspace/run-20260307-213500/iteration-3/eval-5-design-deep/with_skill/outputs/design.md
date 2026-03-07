# Architecture Design: TaskFlow API

**Cycle**: CYCLE-TASKFLOW-20260307-001
**Generated**: 2026-03-07
**Agent**: design-architect
**Version**: 1.0

---

## 1. Architecture Overview

TaskFlow follows **Clean Architecture** with strict dependency inversion. External frameworks (Express, PostgreSQL) live at the outer layers; business logic is framework-agnostic at the core.

### 1.1 Layer Diagram

```mermaid
graph TB
    subgraph External["External Layer"]
        HTTP["HTTP Clients"]
        SSO["Company SSO (JWT Issuer)"]
        WH["Webhook Consumers"]
        K8S["Kubernetes / Docker"]
    end

    subgraph Interface["Interface Adapters Layer"]
        CTRL["Controllers"]
        MW["Middleware (Auth, RateLimit, Validation, Error)"]
        SER["JSON:API Serializers"]
        WHDR["Webhook Delivery Driver"]
    end

    subgraph Application["Application Layer (Use Cases)"]
        TSVC["TaskService"]
        BSVC["BoardService"]
        MSVC["MembershipService"]
        WSVC["WebhookService"]
        SSVC["SearchService"]
        ASVC["ActivityLogService"]
        RSVC["RetentionService"]
    end

    subgraph Domain["Domain Layer"]
        TENT["Task Entity"]
        BENT["Board Entity"]
        MENT["Membership Entity"]
        WENT["Webhook Entity"]
        AENT["ActivityLog Entity"]
        WDENT["WebhookDelivery Entity"]
        REPO["Repository Interfaces (Ports)"]
        EVTS["Domain Events"]
    end

    subgraph Infrastructure["Infrastructure Layer"]
        PGREPO["PostgreSQL Repositories (Adapters)"]
        PGPOOL["pg Pool / Connection Manager"]
        QUEUE["Webhook Queue (in-process)"]
        SCHED["Retention Scheduler (node-cron)"]
    end

    HTTP --> MW --> CTRL
    CTRL --> SER
    CTRL --> TSVC
    CTRL --> BSVC
    CTRL --> MSVC
    CTRL --> WSVC
    CTRL --> SSVC
    CTRL --> ASVC
    TSVC --> REPO
    BSVC --> REPO
    MSVC --> REPO
    WSVC --> REPO
    SSVC --> REPO
    ASVC --> REPO
    RSVC --> REPO
    REPO --> PGREPO
    PGREPO --> PGPOOL
    TSVC --> EVTS
    EVTS --> WSVC
    WSVC --> WHDR
    WHDR --> QUEUE
    RSVC --> SCHED
    SSO -.->|JWT verification| MW
    WHDR -->|HTTP POST| WH
```

### 1.2 Component Diagram

```mermaid
graph LR
    subgraph API["API Gateway (Express)"]
        direction TB
        R["Router"]
        AUTH["Auth Middleware"]
        RL["Rate Limiter"]
        VAL["Validation Middleware"]
        ERR["Error Handler"]
    end

    subgraph Controllers
        TC["TaskController"]
        BC["BoardController"]
        MC["MemberController"]
        WC["WebhookController"]
        SC["SearchController"]
        AC["ActivityController"]
        HC["HealthController"]
    end

    subgraph Services
        TS["TaskService"]
        BS["BoardService"]
        MS["MembershipService"]
        WS["WebhookService"]
        SS["SearchService"]
        AS["ActivityLogService"]
        RS["RetentionService"]
    end

    subgraph Repositories
        TR["TaskRepository"]
        BR["BoardRepository"]
        MR["MembershipRepository"]
        WR["WebhookRepository"]
        WDR["WebhookDeliveryRepository"]
        SR["SearchRepository"]
        AR["ActivityLogRepository"]
    end

    subgraph External["External Systems"]
        PG["PostgreSQL 16"]
        SSOP["SSO Provider"]
        WHE["Webhook Endpoints"]
    end

    R --> AUTH --> RL --> VAL
    VAL --> TC & BC & MC & WC & SC & AC & HC
    TC --> TS --> TR --> PG
    BC --> BS --> BR --> PG
    MC --> MS --> MR --> PG
    WC --> WS --> WR --> PG
    SC --> SS --> SR --> PG
    AC --> AS --> AR --> PG
    WS --> WDR --> PG
    AUTH -.-> SSOP
    WS -.-> WHE
```

---

## 2. Sequence Diagrams

### 2.1 Create Task Flow

```mermaid
sequenceDiagram
    actor Client
    participant MW as Middleware Stack
    participant TC as TaskController
    participant TS as TaskService
    participant MR as MembershipRepo
    participant TR as TaskRepo
    participant AL as ActivityLogService
    participant WS as WebhookService
    participant SER as JSON:API Serializer

    Client->>MW: POST /boards/:boardId/tasks (JWT + body)
    MW->>MW: Verify JWT token
    MW->>MW: Check rate limit (100 req/min)
    MW->>MW: Validate request body
    MW->>TC: Authenticated request

    TC->>TS: createTask(boardId, userId, taskData)
    TS->>MR: getMembership(boardId, userId)
    MR-->>TS: Membership{role: "Member"}
    TS->>TS: Verify role is Member or Admin
    TS->>TS: Validate business rules (title length, tags count, status enum)
    TS->>TR: insert(task)
    TR-->>TS: Task (with generated ID, timestamps)
    TS->>AL: logActivity(userId, "task.created", null, task)
    TS->>WS: emit("task.created", task, userId)
    TS-->>TC: Task

    TC->>SER: serialize(task)
    SER-->>TC: JSON:API response
    TC-->>Client: HTTP 201 + JSON:API body
```

### 2.2 Update Task with Webhook Delivery

```mermaid
sequenceDiagram
    actor Client
    participant MW as Middleware Stack
    participant TC as TaskController
    participant TS as TaskService
    participant TR as TaskRepo
    participant AL as ActivityLogService
    participant WS as WebhookService
    participant WR as WebhookRepo
    participant WDR as WebhookDeliveryRepo
    participant WHE as Webhook Endpoint

    Client->>MW: PATCH /boards/:boardId/tasks/:taskId
    MW->>TC: Authenticated request

    TC->>TS: updateTask(boardId, taskId, userId, updates)
    TS->>TR: findById(taskId)
    TR-->>TS: Task (before state)
    TS->>TS: Validate updates + RBAC
    TS->>TR: update(taskId, updates)
    TR-->>TS: Updated Task
    TS->>AL: logActivity(userId, "task.updated", before, after)
    TS->>WS: emit("task.status_changed", {before, after}, userId)

    Note over WS: Async webhook delivery
    WS->>WR: getWebhooks(boardId)
    WR-->>WS: Webhook[]
    loop For each webhook
        WS->>WS: Build payload + HMAC-SHA256 signature
        WS->>WHE: POST webhook.url (payload, X-Signature-256)
        alt Success (2xx)
            WHE-->>WS: HTTP 200
            WS->>WDR: record(delivery, "success")
        else Failure (5xx / timeout)
            WHE-->>WS: HTTP 500
            WS->>WDR: record(delivery, "failed", attempt=1)
            Note over WS: Schedule retry: 1s, 4s, 16s backoff
        end
    end

    TS-->>TC: Updated Task
    TC-->>Client: HTTP 200 + JSON:API body
```

### 2.3 Full-Text Search Flow

```mermaid
sequenceDiagram
    actor Client
    participant MW as Middleware Stack
    participant SC as SearchController
    participant SS as SearchService
    participant MR as MembershipRepo
    participant SR as SearchRepo
    participant SER as JSON:API Serializer

    Client->>MW: GET /tasks/search?q=login&filter[status]=todo&page[size]=10&sort=-priority
    MW->>SC: Authenticated request

    SC->>SS: search(userId, query, filters, pagination, sort)
    SS->>MR: getAccessibleBoardIds(userId)
    MR-->>SS: ["board-1", "board-2"]
    SS->>SR: fullTextSearch(boardIds, query, filters, pagination, sort)
    Note over SR: PostgreSQL ts_vector + GIN index
    SR-->>SS: {data: Task[], total: 45}
    SS-->>SC: SearchResult

    SC->>SER: serializeCollection(tasks, {total, page, links})
    SER-->>SC: JSON:API collection
    SC-->>Client: HTTP 200 + JSON:API collection with pagination meta
```

### 2.4 Webhook Retry Flow

```mermaid
sequenceDiagram
    participant WS as WebhookService
    participant Q as RetryQueue
    participant WDR as WebhookDeliveryRepo
    participant WHE as Webhook Endpoint

    Note over WS: Initial delivery failed

    WS->>Q: enqueue(delivery, delay=1s)
    Q->>WS: dequeue after 1s
    WS->>WHE: POST (attempt 2)
    alt Success
        WHE-->>WS: HTTP 200
        WS->>WDR: update(delivery, "success", attempt=2)
    else Failure
        WHE-->>WS: HTTP 500
        WS->>WDR: update(delivery, "failed", attempt=2)
        WS->>Q: enqueue(delivery, delay=4s)
        Q->>WS: dequeue after 4s
        WS->>WHE: POST (attempt 3)
        alt Success
            WHE-->>WS: HTTP 200
            WS->>WDR: update(delivery, "success", attempt=3)
        else Failure
            WHE-->>WS: HTTP 500
            WS->>WDR: update(delivery, "failed", attempt=3)
            WS->>Q: enqueue(delivery, delay=16s)
            Q->>WS: dequeue after 16s
            WS->>WHE: POST (attempt 4 / final)
            alt Success
                WHE-->>WS: HTTP 200
                WS->>WDR: update(delivery, "success", attempt=4)
            else Final Failure
                WHE-->>WS: HTTP 500
                WS->>WDR: update(delivery, "permanently_failed", attempt=4)
                Note over WS: No further retries
            end
        end
    end
```

### 2.5 Board Member Invite Flow

```mermaid
sequenceDiagram
    actor Client
    participant MW as Middleware Stack
    participant MC as MemberController
    participant MS as MembershipService
    participant MR as MembershipRepo
    participant SER as JSON:API Serializer

    Client->>MW: POST /boards/:boardId/members (JWT + {user_id, role})
    MW->>MC: Authenticated request

    MC->>MS: inviteMember(boardId, actorId, userId, role)
    MS->>MR: getMembership(boardId, actorId)
    MR-->>MS: Membership{role: "Admin"} or owner flag
    MS->>MS: Verify actor is owner or Admin
    MS->>MS: Validate role enum
    MS->>MR: findMembership(boardId, userId)
    alt User already a member
        MR-->>MS: Existing Membership
        MS->>MR: updateRole(boardId, userId, role)
        MR-->>MS: Updated Membership
        MS-->>MC: Membership (HTTP 200)
    else New member
        MR-->>MS: null
        MS->>MR: insert(boardId, userId, role)
        MR-->>MS: New Membership
        MS-->>MC: Membership (HTTP 201)
    end

    MC->>SER: serialize(membership)
    SER-->>MC: JSON:API response
    MC-->>Client: HTTP 200/201 + JSON:API body
```

---

## 3. Directory Structure

```
taskflow-api/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── task.ts
│   │   │   ├── board.ts
│   │   │   ├── membership.ts
│   │   │   ├── webhook.ts
│   │   │   ├── webhook-delivery.ts
│   │   │   └── activity-log.ts
│   │   ├── events/
│   │   │   └── domain-events.ts
│   │   ├── enums/
│   │   │   ├── task-status.ts
│   │   │   ├── task-priority.ts
│   │   │   ├── member-role.ts
│   │   │   └── webhook-event-type.ts
│   │   └── ports/
│   │       ├── task-repository.ts
│   │       ├── board-repository.ts
│   │       ├── membership-repository.ts
│   │       ├── webhook-repository.ts
│   │       ├── webhook-delivery-repository.ts
│   │       ├── search-repository.ts
│   │       └── activity-log-repository.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── task-service.ts
│   │   │   ├── board-service.ts
│   │   │   ├── membership-service.ts
│   │   │   ├── webhook-service.ts
│   │   │   ├── search-service.ts
│   │   │   ├── activity-log-service.ts
│   │   │   └── retention-service.ts
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       ├── create-board.dto.ts
│   │       ├── update-board.dto.ts
│   │       ├── invite-member.dto.ts
│   │       ├── create-webhook.dto.ts
│   │       └── search-query.dto.ts
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── pool.ts
│   │   │   ├── migrations/
│   │   │   │   ├── 001-create-boards.sql
│   │   │   │   ├── 002-create-board-members.sql
│   │   │   │   ├── 003-create-tasks.sql
│   │   │   │   ├── 004-create-webhooks.sql
│   │   │   │   ├── 005-create-webhook-deliveries.sql
│   │   │   │   └── 006-create-activity-logs.sql
│   │   │   └── repositories/
│   │   │       ├── pg-task-repository.ts
│   │   │       ├── pg-board-repository.ts
│   │   │       ├── pg-membership-repository.ts
│   │   │       ├── pg-webhook-repository.ts
│   │   │       ├── pg-webhook-delivery-repository.ts
│   │   │       ├── pg-search-repository.ts
│   │   │       └── pg-activity-log-repository.ts
│   │   ├── queue/
│   │   │   └── webhook-retry-queue.ts
│   │   └── scheduler/
│   │       └── retention-scheduler.ts
│   ├── interface/
│   │   ├── http/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   ├── validate.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   └── board-access.ts
│   │   │   ├── controllers/
│   │   │   │   ├── task-controller.ts
│   │   │   │   ├── board-controller.ts
│   │   │   │   ├── member-controller.ts
│   │   │   │   ├── webhook-controller.ts
│   │   │   │   ├── search-controller.ts
│   │   │   │   ├── activity-controller.ts
│   │   │   │   └── health-controller.ts
│   │   │   ├── routes/
│   │   │   │   ├── task-routes.ts
│   │   │   │   ├── board-routes.ts
│   │   │   │   ├── member-routes.ts
│   │   │   │   ├── webhook-routes.ts
│   │   │   │   ├── search-routes.ts
│   │   │   │   ├── activity-routes.ts
│   │   │   │   └── health-routes.ts
│   │   │   └── serializers/
│   │   │       ├── task-serializer.ts
│   │   │       ├── board-serializer.ts
│   │   │       ├── membership-serializer.ts
│   │   │       ├── webhook-serializer.ts
│   │   │       ├── activity-serializer.ts
│   │   │       └── error-serializer.ts
│   │   └── webhook/
│   │       └── webhook-delivery-driver.ts
│   └── config/
│       ├── index.ts
│       └── database.ts
├── test/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 4. Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Runtime | Node.js v20+ | LTS, native ESM, performance |
| Language | TypeScript (strict mode) | Type safety, maintainability |
| Framework | Express.js | Lightweight, mature, extensive middleware ecosystem |
| Database | PostgreSQL 16 | Full-text search (tsvector), JSONB, reliability |
| DB Client | pg (node-postgres) | Direct SQL, full control, connection pooling |
| Auth | jsonwebtoken + jwks-rsa | JWT verification with SSO JWKS endpoint |
| Rate Limiting | express-rate-limit + rate-limit-redis | Token bucket per user, 100 req/min |
| Validation | zod | TypeScript-native schema validation |
| Serialization | jsonapi-serializer | JSON:API v1.1 compliance |
| Testing | node:test + supertest | Built-in test runner, HTTP integration testing |
| Coverage | c8 | Native V8 coverage |
| Container | Docker (multi-stage build) | Minimal image, K8s-ready |
| Scheduler | node-cron | Retention purge job (daily at 02:00 UTC) |
| HMAC | Node.js crypto (built-in) | HMAC-SHA256 for webhook signing |

---

## 5. Cross-Cutting Concerns

### 5.1 Authentication
- All requests pass through `auth` middleware
- JWT verified against SSO JWKS endpoint
- Token payload: `{ sub: userId, email, iat, exp }`
- Invalid/missing/expired tokens -> HTTP 401

### 5.2 Authorization (RBAC)
- Board-level roles: **Owner** (implicit, creator), **Admin**, **Member**, **Viewer**
- Checked at service layer via `MembershipRepository.getMembership(boardId, userId)`
- Permission matrix enforced per operation

### 5.3 Rate Limiting
- Token bucket: 100 requests per minute per authenticated user
- Key: `rl:{userId}`
- Exceeded -> HTTP 429 with `Retry-After` header

### 5.4 Error Handling
- Global error handler middleware
- All errors serialized as JSON:API error objects
- Structured: `{ errors: [{ status, title, detail, source? }] }`

### 5.5 Logging
- Structured JSON logs (pino)
- Request ID propagation via `X-Request-Id` header
- Log levels: error, warn, info, debug

### 5.6 Health Checks
- `GET /healthz` -- liveness (always 200 if process running)
- `GET /readyz` -- readiness (checks DB connection)

---

## 6. Deployment Diagram

```mermaid
graph TB
    subgraph K8S["Kubernetes Cluster"]
        subgraph NS["taskflow namespace"]
            subgraph DEPLOY["Deployment (replicas: 2)"]
                POD1["Pod 1<br/>taskflow-api:latest"]
                POD2["Pod 2<br/>taskflow-api:latest"]
            end
            SVC["Service<br/>(ClusterIP)"]
            ING["Ingress<br/>(api.taskflow.internal)"]
            HPA["HPA<br/>(min:2, max:5)"]
        end
    end

    subgraph DB["Database"]
        PG["PostgreSQL 16<br/>(managed/RDS)"]
        PGR["Read Replica<br/>(optional)"]
    end

    subgraph External["External"]
        LB["Load Balancer"]
        SSO["Company SSO"]
        WHC["Webhook Consumers"]
        MON["Monitoring<br/>(Prometheus + Grafana)"]
    end

    LB --> ING
    ING --> SVC
    SVC --> POD1 & POD2
    POD1 & POD2 --> PG
    PG --> PGR
    POD1 & POD2 -.->|JWT verify| SSO
    POD1 & POD2 -.->|webhook POST| WHC
    POD1 & POD2 -.->|metrics /metrics| MON
    HPA -.->|scale| DEPLOY
```

### 6.1 Container Configuration

- **Base image**: `node:20-alpine`
- **Multi-stage build**: build stage (compile TS) + production stage (dist only)
- **Environment variables**: DB connection, JWT issuer URL, rate limit config
- **Resource limits**: 256Mi memory request, 512Mi limit; 100m CPU request, 500m limit
- **Probes**:
  - Liveness: `GET /healthz` every 10s, 3 failure threshold
  - Readiness: `GET /readyz` every 5s, 3 failure threshold
  - Startup: `GET /healthz` every 2s, 15 failure threshold (30s max startup)

---

## 7. Data Flow Summary

| Flow | Source | Components | Destination |
|------|--------|-----------|-------------|
| Task CRUD | HTTP Client | Auth MW -> Controller -> Service -> Repo | PostgreSQL |
| Board Mgmt | HTTP Client | Auth MW -> Controller -> Service -> Repo | PostgreSQL |
| Member Mgmt | HTTP Client | Auth MW -> Controller -> Service -> Repo | PostgreSQL |
| Webhook Config | HTTP Client | Auth MW -> Controller -> Service -> Repo | PostgreSQL |
| Webhook Delivery | Task Event | Service -> WebhookService -> DeliveryDriver | External URL |
| Search | HTTP Client | Auth MW -> Controller -> SearchService -> SearchRepo | PostgreSQL (FTS) |
| Activity Log | Task Mutation | Service -> ActivityLogService -> Repo | PostgreSQL |
| Retention Purge | Scheduler | RetentionService -> ActivityLogRepo | PostgreSQL |
| Health Check | K8s Probe | HealthController | HTTP Response |
