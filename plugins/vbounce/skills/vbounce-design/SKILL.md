---
name: vbounce-design
version: "3.0.0"
description: |
  V-Bounce Design Agent - Creates technical designs from approved requirements.
  Generates: architecture diagrams (Mermaid), API specs (OpenAPI), data models,
  security design (threat model), scalability design, ADRs.
  Includes traceability update, test impact preview, and complete integration/system
  test specifications (V-Model test-first at design time).
  Triggers: design, architecture, API, data model, ERD, system design, security design.
---

# V-Bounce Design Agent v3.0

Create comprehensive technical designs from approved requirements — with traceability, test impact tracking, and V-Model design-time test specifications.

## Prerequisites

Requirements phase must be APPROVED before starting.

## Process

1. **Consult Knowledge Base** - Check `docs/knowledge-base/` if it exists for relevant lessons (LL-*), code patterns (PAT-CODE-*), prompt patterns (PAT-PROMPT-*), and knowledge captures (KC-*). Apply findings to avoid past mistakes.
2. **Analyze Requirements** - Review approved PRD, stories, NFRs
3. **Design Architecture** - Select style, define components
4. **Design Security** - Threat model, auth, data protection
5. **Design APIs** - REST endpoints with OpenAPI spec
6. **Create Data Model** - Entities, relationships, ERD
7. **Plan Scalability** - Capacity, growth, bottlenecks
8. **Document Decisions** - Write ADRs for key choices
9. **Update Traceability** - Map components/APIs/entities to requirements (v2.0+)
10. **Preview Test Impact** - Note design decisions that affect test skeletons (v2.0+)
11. **Produce Design-Time Test Specs** - Write complete ITS-*, STS-*, SECTS-* specifications (NEW in v3.0)

## Traceability Update (NEW in v2.0)

After generating the design, update the traceability matrix with:

```yaml
traceability_update:
  phase: design
  mappings:
    - requirement: REQ-001
      components: ["UserService", "AuthMiddleware"]
      api_endpoints: ["POST /api/v1/users", "GET /api/v1/users/{id}"]
      data_entities: ["User", "UserRole"]
    - requirement: REQ-002
      components: ["NotificationService"]
      api_endpoints: ["POST /api/v1/notifications"]
      data_entities: ["Notification", "NotificationPreference"]
```

**Rules**:
- Every user story must map to at least one component
- Every component must trace to at least one requirement
- No phantom components (components with no requirement justification)

## Test Impact Preview (NEW in v2.0)

When design decisions affect testability, note which test skeletons from the requirements phase may need updating:

```yaml
test_impact_preview:
  - design_decision: "Using event-driven architecture for notifications"
    affected_skeletons: [TSK-005, TSK-006]
    impact: "Tests will need async assertions, mock event bus"
    suggested_test_type_change: "TSK-005: unit → integration"

  - design_decision: "Adding caching layer for user lookups"
    affected_skeletons: [TSK-001]
    impact: "Need cache hit/miss test scenarios"
    new_skeletons_suggested:
      - name: "Should_ReturnCachedUser_When_CacheHit"
        type: unit
        linked_ac: AC-001
```

## Design-Time Test Specifications (NEW in v3.0)

The V-Model principle requires that test definitions corresponding to each design level are produced BEFORE implementation. At design time, produce complete specifications for integration and system tests — not just skeletons, but full test scenarios with expected behavior.

### Integration Test Specifications

For each API contract and component interaction defined in the design, produce a complete test specification:

```yaml
design_test_specs:
  integration_tests:
    - spec_id: ITS-001
      v_level: integration
      traces_to_api: "POST /api/v1/users"
      traces_to_components: ["UserService", "AuthMiddleware"]
      scenario: "Create user with valid data through API"
      preconditions:
        - "Auth token with 'admin' role"
        - "Database is empty"
      request:
        method: POST
        path: "/api/v1/users"
        headers: { Authorization: "Bearer [valid-token]" }
        body: { email: "user@example.com", name: "Test User" }
      expected_response:
        status: 201
        body_contains: { id: "[UUID]", email: "user@example.com" }
      expected_side_effects:
        - "User row created in database"
        - "Welcome email event published"
      error_scenarios:
        - input: { email: "invalid" }
          expected_status: 400
          expected_error: "Invalid email format"
        - input: { email: "existing@example.com" }
          expected_status: 409
          expected_error: "User already exists"

  system_tests:
    - spec_id: STS-001
      v_level: system
      traces_to_flow: "User registration → email verification → first login"
      traces_to_stories: [US-001, US-002]
      scenario: "Complete user onboarding workflow"
      steps:
        - action: "POST /api/v1/users"
          expected: "201 Created, verification email sent"
        - action: "GET /api/v1/verify?token=[token]"
          expected: "200 OK, user status = verified"
        - action: "POST /api/v1/auth/login"
          expected: "200 OK, JWT returned"
      acceptance_criteria_validated: [AC-001, AC-002, AC-003]

  security_tests:
    - spec_id: SECTS-001
      v_level: security
      traces_to_stride: "S-001 (Spoofing: impersonate user)"
      scenario: "Reject forged JWT tokens"
      attack_vector: "Modified JWT payload with different user ID"
      expected_behavior: "401 Unauthorized"
      mitigation_verified: "JWT signature validation"
```

### Rules for Design-Time Test Specs

1. Every API endpoint MUST have at least one integration test specification
2. Every architecture flow diagram MUST have at least one system test specification
3. Every STRIDE finding MUST have at least one security test specification
4. Specifications must be detailed enough to implement WITHOUT referring back to design docs
5. These specs are reviewed at the design quality gate — incomplete specs block approval

## Output Format

```yaml
design_id: DES-[PROJECT]-[YYYYMM]-[###]
version: "1.0"
requirement_ref: REQ-[###]
status: pending_review

architecture:
  style: microservices | monolith | serverless | modular-monolith
  diagram: |
    ```mermaid
    [Architecture diagram]
    ```
  components:
    - name: "[Component]"
      type: service | database | cache | queue | gateway
      technology: "[Tech choice]"
      responsibility: "[What it does]"
      traces_to: [REQ-001, REQ-002]  # NEW in v2.0

security_design:
  threat_model:
    methodology: "STRIDE"
    threats:
      - asset: "[What to protect]"
        threat: "Spoofing | Tampering | Repudiation | Info Disclosure | DoS | Elevation"
        risk: high | medium | low
        mitigation: "[How to prevent]"

  authentication:
    method: "JWT | OAuth2 | Session"
    token_expiry: "[Duration]"
    refresh_strategy: "[How refresh works]"
    mfa: "Required for [roles] | Optional | None"

  authorization:
    model: "RBAC | ABAC | ACL"
    roles:
      - name: "[Role]"
        permissions: ["[Permission]"]

  data_protection:
    classification:
      - type: "PII"
        fields: ["email", "phone", "address"]
        handling: "Encrypt at rest, mask in logs"
      - type: "Sensitive"
        fields: ["password", "token"]
        handling: "Hash, never log"
    encryption:
      at_rest: "AES-256"
      in_transit: "TLS 1.3"

scalability_design:
  current_capacity:
    users: "[Current]"
    requests_per_second: "[Current]"
    data_volume: "[Current]"
  target_capacity:
    users: "[Target]"
    requests_per_second: "[Target]"
    data_volume: "[Target]"
  scaling_strategy:
    horizontal: "[How to scale out]"
    vertical: "[Limits]"
  bottlenecks:
    - component: "[Component]"
      limit: "[What limits it]"
      mitigation: "[How to address]"

api_design:
  base_url: "/api/v1"
  versioning: "URL path"
  authentication: "Bearer JWT"
  endpoints:
    - path: "/[resource]"
      method: GET | POST | PUT | DELETE
      description: "[Purpose]"
      traces_to: [US-001, AC-001]  # NEW in v2.0
      request: { body: {}, params: {} }
      response: { 200: {}, 400: {}, 404: {} }

data_model:
  diagram: |
    ```mermaid
    erDiagram
    [ERD diagram]
    ```
  entities:
    - name: "[Entity]"
      table: "[table_name]"
      traces_to: [REQ-001]  # NEW in v2.0
      fields:
        - name: "[field]"
          type: "[SQL type]"
          constraints: "[PK|FK|NOT NULL]"
          pii: true | false

adrs:
  - id: ADR-001
    title: "[Decision]"
    status: accepted
    context: "[Why needed]"
    decision: "[What we chose]"
    consequences:
      positive: ["[Benefit]"]
      negative: ["[Trade-off]"]

# NEW in v2.0
traceability_update:
  mappings: "[See Traceability Update section]"

test_impact_preview:
  impacts: "[See Test Impact Preview section]"

# NEW in v3.0 — V-Model test-first specifications
design_test_specs:
  integration_tests: "[See Design-Time Test Specifications section]"
  system_tests: "[See Design-Time Test Specifications section]"
  security_tests: "[See Design-Time Test Specifications section]"

approval_gate:
  phase: design
  status: pending_review
  next_phase: implementation
  approvers: ["Tech Lead", "Architect"]
  quorum: 1
  quality_gate: pending  # NEW in v2.0
  command: "Type 'APPROVED' to proceed to Implementation"
```

## Design Quality Rules

### Naming

All names in design docs must be **generic and domain-agnostic**. Design docs are templates — domain terms reduce reusability and leak assumptions.

### Code Snippets

Code in TRDs gets copy-pasted into implementation. Every snippet must be **production-ready**:

1. **Safe serialization** — Use language-native serializers for structured data, never string interpolation
2. **Correct error handling** — Match the actual failure mode of each called method (raise vs return)
3. **Explicit scoping** — Tenant/customer/org context must be passed explicitly, never defaulted
4. **Verified APIs** — Every method call, decorator, and config option must exist in the actual codebase or package

### Architecture Patterns

| Rule | Rationale |
|------|-----------|
| Concurrent I/O for independent operations | Sequential loops waste latency budget |
| Bounded collections with eviction | Unbounded caches leak memory over time |
| Single manifest over per-item metadata files | Reduces I/O, avoids race conditions |
| Extend existing modules | Don't create a new file for a single declaration |
| Extract shared helpers | If logic appears in 2+ snippets, factor it out |

### Cross-Document Consistency

When a sub-TRD references a parent:

- Don't redefine models or enums — reference the parent's definitions
- Field optionality, storage paths, tool lists, and language must all match
- If the parent is the source of truth, the sub-TRD must not contradict it

## Security Checklist

- [ ] Authentication mechanism defined
- [ ] Authorization model defined
- [ ] PII fields identified
- [ ] Encryption standards specified
- [ ] Threat model completed

## Architecture Patterns

### Styles

**Monolith** — Use when: Small team, simple domain, quick MVP

**Microservices** — Use when: Large teams, independent scaling, complex domain

**Modular Monolith** — Best of both: clear boundaries, single deployment.

### Design Patterns

**Repository:**
```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

**Service Layer:**
```typescript
class UserService {
  constructor(private repo: IUserRepository) {}

  async createUser(data: CreateUserDto) {
    return this.repo.save(new User(data));
  }
}
```

### API Patterns

**REST Resources:**
```
GET    /users         # List
GET    /users/{id}    # Get
POST   /users         # Create
PUT    /users/{id}    # Update
DELETE /users/{id}    # Delete
```

**Versioning:** `/api/v1/users`, `/api/v2/users`

### ADR Template

```yaml
- id: ADR-NNN
  title: "[Decision Title]"
  status: proposed | accepted | deprecated | superseded
  context: "[Why is this decision needed?]"
  decision: "[What did we decide?]"
  consequences:
    positive: ["[Benefits]"]
    negative: ["[Trade-offs]"]
```
