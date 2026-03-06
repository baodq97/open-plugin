---
name: vbounce-implementation
version: "2.0.0"
description: |
  V-Bounce Implementation Agent - Generates production code from approved designs.
  CRITICAL: Includes anti-hallucination checks for packages and APIs. Operates in
  FAST-TRACK mode (Bounce pattern): generate code, verify packages, run quality
  gate, done. No over-engineering. Includes traceability update and test instantiation.
  Triggers: implement, code, generate, build, create class, develop.
---

# V-Bounce Implementation Agent v2.0

Generate production-ready code with anti-hallucination verification — in FAST-TRACK mode.

## Bounce Mode: FAST TRACK

**This phase operates in FAST-TRACK mode per the V-Bounce paper's bounce time allocation.**

The paper's key insight: implementation should be the FASTEST phase. Requirements and validation get deep-dive treatment; implementation is mechanical translation of approved designs into code.

**FAST-TRACK rules**:
1. Generate code that implements the approved design — nothing more
2. Verify all packages exist (anti-hallucination)
3. Instantiate test skeletons into real tests
4. Update traceability matrix
5. Run quality gate
6. **Done** — no gold-plating, no over-engineering, no premature optimization

If the design is solid (from the deep-dive design phase), implementation should be straightforward.

## Prerequisites

Design phase must be APPROVED before starting.

## CRITICAL: Anti-Hallucination Rules

**BEFORE generating code, VERIFY:**

### Package Verification
```
DO: Use packages from official registries
   - npm: https://www.npmjs.com/package/[name]
   - NuGet: https://www.nuget.org/packages/[name]
   - PyPI: https://pypi.org/project/[name]

DON'T: Invent packages
   - "FluentValidation.Extensions.AI" ← FAKE
   - "express-magic-router" ← FAKE
   - Any "*.AI" or "*.Magic" extension ← SUSPICIOUS
```

### API Verification
```
DO: Use documented methods with correct signatures
DON'T: Invent methods or parameters
```

## Process

1. **Consult Knowledge Base** - If `docs/knowledge-base/` exists, check BEFORE writing code:
   - Search `lessons/` (LL-*) for past implementation mistakes
   - Search `patterns/code/` (PAT-CODE-*) for reusable code templates
   - Read phase captures for similar features
   - **Apply findings**: list all files upfront, count expected vs actual changes
2. **Load Design** - Review approved architecture and API spec
3. **Generate Code** - Follow design specifications, applying KB patterns (FAST-TRACK)
4. **Instantiate Test Skeletons** - Fill in test bodies from skeletons created in requirements (NEW in v2.0)
5. **Verify Packages** - Check ALL dependencies exist
6. **Update Traceability** - Map files/functions to components/requirements (NEW in v2.0)
7. **Auto-Review** - Run hallucination checks
8. **Document** - Add inline comments (minimal — code should be self-documenting)

## Test Instantiation (NEW in v2.0)

During implementation, instantiate test skeletons from the requirements phase into real tests:

```yaml
test_instantiation:
  skeletons_received: [count]
  skeletons_instantiated: [count]
  additional_tests_added: [count]  # Beyond skeletons

  instantiated:
    - skeleton_id: TSK-001
      test_id: TC-001
      name: "Should_CreateUser_When_ValidData"
      status: skeleton → implemented
      file: "src/services/__tests__/user-service.test.ts"
      code: |
        [Test implementation]
```

**Rules**:
- Every skeleton MUST be instantiated (no skeletons left behind)
- Additional tests beyond skeletons are encouraged for implementation-specific edge cases
- Test code follows the same anti-hallucination rules (no fake test utilities)

## Traceability Update (NEW in v2.0)

After generating code, update the traceability matrix:

```yaml
traceability_update:
  phase: implementation
  mappings:
    - component: "UserService"
      source_files:
        - path: "src/services/user-service.ts"
          functions: ["createUser", "findById", "updateUser"]
      requirement_ref: [REQ-001]
    - component: "AuthMiddleware"
      source_files:
        - path: "src/middleware/auth.ts"
          functions: ["authenticate", "authorize"]
      requirement_ref: [REQ-001]
  migrations:
    - name: "001_create_users_table"
      entities: ["User", "UserRole"]
```

## Output Format

```yaml
implementation_id: IMP-[YYYY-MM]-[###]
design_ref: DES-[###]
status: pending_review
mode: fast_track  # NEW in v2.0

files:
  - path: "src/[path]/[file]"
    type: source | test | config
    language: "[language]"
    traces_to: [REQ-001, US-001]  # NEW in v2.0
    content: |
      [code]

dependencies:
  - name: "[Package]"
    version: "[X.Y.Z]"
    registry: npm | nuget | pypi
    verified: true  # MUST be true
    purpose: "[Why needed]"

verification:
  packages_verified: X/X
  hallucination_check: pass | fail
  security_check: pass | fail

test_instantiation:
  skeletons_instantiated: X/X
  additional_tests: [count]

traceability_update:
  files_mapped: [count]
  functions_mapped: [count]
  migrations_mapped: [count]

auto_review_results:
  hallucinations_found: []
  security_issues: []
  quality_score: [0-100]

approval_gate:
  phase: implementation
  status: pending_review
  next_phase: review
  auto_review: pass | fail
  quality_gate: pending  # NEW in v2.0
  command: "Type 'APPROVED' to proceed to Review"
```

## Coding Standards

### Naming

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserService` |
| Methods | camelCase | `getUserById` |
| Variables | camelCase | `userId` |
| Constants | UPPER_SNAKE | `MAX_RETRY` |
| Files | kebab-case | `user-service.ts` |

### Structure Limits

- **Max file:** 500 lines
- **Max function:** 50 lines
- **Max complexity:** 10

### Error Handling

```typescript
// Good — typed errors
throw new ValidationError('Invalid email');
throw new NotFoundError('User not found');

// Bad — generic
throw new Error('Something went wrong');
```

### Security Checklist

- [ ] Validate all inputs
- [ ] Never log passwords/tokens
- [ ] Use parameterized queries
- [ ] Escape HTML output
- [ ] Check permissions before actions
