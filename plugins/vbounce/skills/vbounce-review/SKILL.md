---
name: vbounce-review
version: "1.2.0"
description: |
  V-Bounce Review Agent - HALLUCINATION DETECTION CENTER. Primary mission:
  catch AI hallucinations (fake packages, invalid APIs, invented patterns).
  Also checks security, code quality, logic, performance. Includes traceability
  verification and quality gate integration.
  Triggers: review, verify, check, hallucination, PR.
---

# V-Bounce Review Agent v1.2

**PRIMARY MISSION: Catch AI Hallucinations**

## Review Categories

| Category | Weight | Focus |
|----------|--------|-------|
| **Hallucination** | 25% | Fake packages, invalid APIs |
| **Security** | 25% | Vulnerabilities, secrets |
| **Code Quality** | 20% | Standards, maintainability |
| **Logic** | 20% | Correctness, edge cases |
| **Performance** | 10% | Efficiency, N+1 queries |

## Traceability Check (NEW in v1.2)

Before starting the standard review, verify traceability:

```yaml
traceability_check:
  # Every implemented file must trace to a requirement
  unmapped_files: []  # Files with no requirement mapping — flag as WARN

  # Every requirement must have implementation
  unimplemented_requirements: []  # REQs with no code — flag as FAIL

  # Code matches design
  design_conformance:
    components_in_design: [count]
    components_in_code: [count]
    missing_from_code: []  # Design components not yet implemented
    extra_in_code: []      # Code components not in design — flag as WARN
```

**Rules**:
- If `unimplemented_requirements` is not empty → flag in review output
- If `extra_in_code` is not empty → ask if design needs updating
- If `unmapped_files` is not empty → request traceability update

## Quality Gate Integration (NEW in v1.2)

Reference quality gate results to avoid redundant checks:

```yaml
quality_gate_reference:
  qg_verdict: PASS | WARN | FAIL
  qg_id: QG-[###]

  # Don't re-check what QG already verified:
  skip_if_qg_passed:
    - package_verification  # QG already checked this
    - file_size_limits      # QG already checked this
    - test_presence          # QG already checked this

  # Always check regardless of QG:
  always_check:
    - hallucination_detection  # Deep check beyond QG's surface check
    - security_vulnerabilities
    - logic_correctness
    - performance_patterns
```

## Design Document Review

When reviewing TRDs or design docs containing code snippets, apply these rules:

### Rule 1: Code Snippets Must Be Production-Safe

- **No f-string interpolation for structured data** (YAML, JSON, XML) — use language-native serializers
- **Every async call must handle its actual failure mode** — read the real service to check: does it raise or return None?
- **Multi-tenant context must be explicit** — never rely on implicit defaults for tenant/customer scoping
- **Verify all referenced methods exist** — check actual source, not assumptions

### Rule 2: Cross-Document Consistency

When a document references another (sub-TRD → parent TRD, TRD → PRD):

- Field optionality must match source-of-truth models
- Tool/component registration lists must be identical
- Storage path formats must be consistent across all docs
- Human-language choice (Vietnamese, English) must match codebase convention
- Never redefine what the parent already defines — reference it

### Rule 3: Architecture Anti-Patterns in Snippets

Flag these patterns in any code snippet:

| Anti-Pattern | Rule |
|-------------|------|
| Per-item metadata files | Consolidate into a single manifest |
| Sequential I/O in loops | Use concurrent fetch for independent operations |
| Unbounded in-memory collections | Require bounded size with eviction strategy |
| New module for a single declaration | Extend the existing module that owns that concern |
| Duplicated logic across snippets | Extract shared helper, import from one place |
| Domain-specific naming | All names must be generic and domain-agnostic |

### Design Doc Checklist

- [ ] Safe serialization — no f-string structured data
- [ ] Error handling matches actual service behavior
- [ ] Tenant/scope context threaded through all calls
- [ ] No contradictions with referenced documents
- [ ] Generic naming — no domain-specific terms
- [ ] Concurrent I/O for independent operations
- [ ] Bounded caches with eviction
- [ ] Extends existing modules, not new files for single concerns

## Hallucination Detection

### Automated Verification

**Package verification script** (run from project root):
```bash
#!/bin/bash
# verify_packages.sh - Verify all packages exist in registries
set -e
ERRORS=0

echo "V-Bounce Package Verification"
echo "================================="

# Verify npm packages
if [ -f "package.json" ]; then
    echo "Checking npm packages..."
    for pkg in $(jq -r '.dependencies // {} | keys[]' package.json 2>/dev/null); do
        if npm view "$pkg" version &>/dev/null; then
            echo "  OK: $pkg"
        else
            echo "  HALLUCINATION: $pkg does not exist"
            ERRORS=$((ERRORS + 1))
        fi
    done
    for pkg in $(jq -r '.devDependencies // {} | keys[]' package.json 2>/dev/null); do
        if npm view "$pkg" version &>/dev/null; then
            echo "  OK: $pkg (dev)"
        else
            echo "  HALLUCINATION: $pkg does not exist (dev)"
            ERRORS=$((ERRORS + 1))
        fi
    done
fi

# Verify Python packages
if [ -f "requirements.txt" ]; then
    echo "Checking Python packages..."
    while IFS= read -r line; do
        [[ -z "$line" || "$line" =~ ^# ]] && continue
        pkg=$(echo "$line" | sed 's/[<>=!].*//' | tr -d '[:space:]')
        if pip index versions "$pkg" &>/dev/null; then
            echo "  OK: $pkg"
        else
            echo "  HALLUCINATION: $pkg does not exist"
            ERRORS=$((ERRORS + 1))
        fi
    done < requirements.txt
fi

# Verify NuGet packages
if [ -f "*.csproj" ] 2>/dev/null; then
    echo "Checking NuGet packages..."
    for csproj in *.csproj; do
        for pkg in $(grep -oP 'PackageReference Include="\K[^"]+' "$csproj" 2>/dev/null); do
            if dotnet package search "$pkg" --take 1 &>/dev/null; then
                echo "  OK: $pkg"
            else
                echo "  HALLUCINATION: $pkg does not exist"
                ERRORS=$((ERRORS + 1))
            fi
        done
    done
fi

echo "================================="
if [ $ERRORS -gt 0 ]; then
    echo "FAILED: $ERRORS hallucinated packages found"
    exit 1
else
    echo "PASSED: All packages verified"
    exit 0
fi
```

### Package Verification

**Verify ALL packages exist:**

#### npm packages
```bash
npm view [package] version
```

#### NuGet packages (.NET)
```bash
dotnet package search [package] --take 5
curl -s "https://api.nuget.org/v3-flatcontainer/[package-lowercase]/index.json" | head -20
```

#### PyPI packages (Python)
```bash
pip index versions [package]
```

### Hallucination Patterns

#### npm (JavaScript/TypeScript)

```yaml
fake_patterns:
  - pattern: "*-ai"
    example: "express-validator-ai"
    real_alternative: "express-validator"
  - pattern: "*-magic"
    example: "react-magic-state"
    real_alternative: "zustand, redux"
  - pattern: "*-auto"
    example: "auto-api-generator"
    real_alternative: "swagger-jsdoc"
  - pattern: "easy-*"
    example: "easy-auth"
    real_alternative: "passport"
```

#### NuGet (.NET)

```yaml
fake_patterns:
  - pattern: "*.Extensions.AI"
    example: "FluentValidation.Extensions.AI"
    real_alternative: "FluentValidation"
  - pattern: "*.Magic"
    example: "EntityFramework.Magic"
    real_alternative: "Microsoft.EntityFrameworkCore"

common_hallucinations:
  - fake: "FluentValidation.Extensions.AI"
    real: "FluentValidation (11.x)"
  - fake: "Microsoft.Extensions.AI"
    real: "Microsoft.Extensions.Hosting"
  - fake: "Dapper.AutoMapper"
    real: "Dapper (2.x) + manual mapping"
  - fake: "BCrypt.Net"
    real: "BCrypt.Net-Next (4.x)"
  - fake: "CsvParser"
    real: "CsvHelper (30.x-33.x)"
```

**Fake .NET Methods/APIs:**
```yaml
fake_dotnet_apis:
  entity_framework:
    fake: ["DbContext.AutoMigrate()", "DbSet<T>.BulkInsertAsync()"]
    real: ["Database.Migrate()", "AddRange() + SaveChangesAsync()"]
  aspnetcore:
    fake: ["IServiceCollection.AddAutoServices()", "app.UseAutoMiddleware()"]
    real: ["AddScoped/AddTransient/AddSingleton", "app.UseMiddleware<T>()"]
  dapper:
    fake: ["connection.QueryAutoAsync<T>()"]
    real: ["connection.QueryAsync<T>()"]
```

#### PyPI (Python)

```yaml
fake_patterns:
  - pattern: "auto-*"
    example: "auto-django"
    real_alternative: "django"
  - pattern: "*-ai"
    example: "flask-ai"
    real_alternative: "flask"
```

### Red Flags

If you see ANY of these, investigate immediately:

1. **Package name includes "AI", "Magic", "Auto"** - 90% chance hallucination
2. **Method does exactly what you'd want** - May be invented
3. **Configuration option not in docs** - Likely hallucination
4. **Decorator/attribute with convenient name** - Verify exists
5. **CLI flag that seems too helpful** - Check --help output

### Verification Checklist

Before approving implementation:

- [ ] All package names verified against registry
- [ ] All package versions exist
- [ ] All imported methods exist in package docs
- [ ] All decorator/attribute names verified
- [ ] All configuration options verified
- [ ] No "too convenient" patterns used
- [ ] Traceability verified — all code maps to requirements (NEW in v1.2)

## Output Format

```yaml
review_id: REV-[YYYY-MM]-[###]
target: "[What's being reviewed]"
status: pass | fail

summary:
  verdict: approve | request_changes
  overall_score: [0-100]
  issues:
    critical: [count]
    major: [count]
    minor: [count]

# NEW in v1.2
traceability_check:
  unmapped_files: [count]
  unimplemented_requirements: [count]
  design_conformance: pass | warn | fail

quality_gate_ref: QG-[###]  # NEW in v1.2

scores:
  hallucination_check: [0-100]
  security: [0-100]
  code_quality: [0-100]
  logic: [0-100]
  performance: [0-100]

hallucination_report:
  status: clean | issues_found
  packages:
    - name: "[package]"
      verified: true | false
      issue: "[if false]"
  api_calls:
    - call: "[method]"
      valid: true | false
      correct_usage: "[if false]"
  invented_patterns:
    - pattern: "[what was used]"
      issue: "[why wrong]"
      fix: "[correct alternative]"

issues:
  - id: ISS-001
    severity: critical | major | minor
    category: hallucination | security | quality | logic | performance | traceability
    location: "[file:line]"
    description: "[Issue]"
    fix: "[Solution]"

recommendations:
  must_fix: ["[Critical items]"]
  should_fix: ["[Important items]"]
```

## Verdict Logic

```
IF hallucination_score < 80 → REQUEST_CHANGES (critical)
IF security_score < 70 → REQUEST_CHANGES
IF traceability_check = fail → REQUEST_CHANGES (NEW in v1.2)
IF overall_score >= 80 AND no critical → APPROVE
IF overall_score >= 60 → COMMENT (minor fixes)
ELSE → REQUEST_CHANGES
```

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Auth/authz implemented
- [ ] No SQL injection
- [ ] No XSS vulnerabilities
- [ ] Dependencies are current
