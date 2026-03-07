# V-Bounce Learned Rules

## Prevention Rules from CYCLE-TASKFLOW-20260307-001

These rules were derived from the full SDLC cycle for the TaskFlow API project. They represent patterns of issues that were detected and should be prevented in future cycles.

---

### PR-001: Fail-fast startup validation for security-critical configuration
- **Trigger**: When implementing services that depend on encryption keys, signing secrets, or database credentials
- **Action**: Add a startup validation function that checks all required security environment variables are present, non-empty, and not set to default/example values. The application must refuse to start if any check fails. Never provide fallback values for security-critical configuration.
- **Severity**: HIGH
- **Source**: Review phase (S-01: hardcoded encryption key, L-SEC-002)

### PR-002: Security control integration verification
- **Trigger**: When a security control module (SSRF protection, input sanitization, rate limiter) is implemented as a separate class or utility
- **Action**: Write an integration test that verifies the security control is on the actual execution path, not just present in the codebase. The test should fail if the control is bypassed. Include a negative test that attempts the attack vector the control is designed to prevent.
- **Severity**: HIGH
- **Source**: Review phase (S-03: SSRF dead code, L-SEC-001)

### PR-003: Environment-gate all development convenience features
- **Trigger**: When implementing development shortcuts that weaken security (symmetric JWT, mock auth, debug endpoints, verbose logging)
- **Action**: Gate the feature behind an explicit `NODE_ENV !== 'production'` check at the point of implementation. Log a WARNING at startup when the feature is active. Add a test that verifies the feature is rejected in production mode.
- **Severity**: HIGH
- **Source**: Review phase (S-02: HS256 in production, L-PAT-003)

### PR-004: Transactional audit logging for all state mutations
- **Trigger**: When implementing any state-changing operation (create, update, delete) that requires an audit trail
- **Action**: Wrap the mutation and the audit log insert in a single database transaction (`BEGIN`/`COMMIT`). Never rely on separate sequential queries for mutation + audit log. Test by simulating a failure after mutation but before log insert and verifying the entire operation is rolled back.
- **Severity**: HIGH
- **Source**: Review phase (S-06: non-transactional audit logging, L-PROC-001)

### PR-005: Live-environment test execution before deployment gate
- **Trigger**: When a test suite achieves 100% pass rate on mock/stub repositories
- **Action**: Before the deployment quality gate, execute the full test suite against a live infrastructure instance (testcontainers, staging environment, or ephemeral preview environment). Track mock-pass-rate and live-pass-rate as separate metrics. A suite that only runs against mocks is a specification, not a verification.
- **Severity**: HIGH
- **Source**: Testing phase (L-COV-002: 100% mock-based pass rate)

### PR-006: Defense-in-depth at both middleware and service layers
- **Trigger**: When adding new API routes that access board-scoped or resource-scoped data
- **Action**: Apply access control checks at both the middleware layer (`checkBoardAccess` or equivalent) AND the service layer. Never rely on a single layer for authorization. Review middleware application on all routes as a dedicated security audit step during implementation.
- **Severity**: MEDIUM
- **Source**: Review phase (S-08: missing checkBoardAccess on some routes, L-SEC-003)

### PR-007: Quantitative rollback triggers defined before deployment begins
- **Trigger**: When preparing a deployment plan for any production service
- **Action**: Define specific rollback triggers with quantitative thresholds (error rate %, latency ms, resource %, health check failures), measurement windows, and PromQL/query expressions BEFORE the deployment starts. Pre-commit to "rollback first, investigate second" for any trigger breach. Include both canary-phase (automatic) and post-switch (manual) rollback procedures.
- **Severity**: MEDIUM
- **Source**: Deployment phase (L-DEP-006: quantitative rollback triggers)

### PR-008: Negative environment variable validation in deployment checklists
- **Trigger**: When deploying applications that have environment-gated features or different security modes
- **Action**: Include FORBIDDEN variable checks (variables that must NOT be set) alongside REQUIRED variable checks in the deployment checklist. Add startup validation that detects and rejects forbidden variables (e.g., `JWT_SECRET` in production). Classify all environment variables into three tiers: REQUIRED, OPTIONAL, and FORBIDDEN.
- **Severity**: MEDIUM
- **Source**: Deployment phase (L-DEP-007: negative environment variable validation)

### PR-009: Structured test skeletons as implementation-to-testing handoff contract
- **Trigger**: When the implementation agent produces test files alongside source code
- **Action**: Generate test skeletons with structured IDs (`T-AC-{feature}-{story}-{ac}`) that trace directly to acceptance criteria. Each skeleton must include: test name, AC reference, test type (positive/negative/edge/security), and expected behavior. The testing agent must promote all skeletons to executable tests and report any skeletons that could not be implemented.
- **Severity**: MEDIUM
- **Source**: Testing phase (L-TS-001: skeleton-to-executable promotion)

### PR-010: Multi-dimensional coverage tracking at the testing quality gate
- **Trigger**: When evaluating test coverage at the testing phase quality gate
- **Action**: Track coverage across at least 4 independent dimensions: (1) acceptance criteria from requirements, (2) integration specs from design, (3) system/E2E specs, (4) security specs from threat model. Report each dimension separately. A single conflated coverage percentage hides critical gaps. Verify V-Model symmetry: left-side spec count must match right-side test count.
- **Severity**: MEDIUM
- **Source**: Testing phase (L-COV-001, L-VM-001: multi-layer coverage and V-Model symmetry)

### PR-011: Review findings must include testing recommendations
- **Trigger**: When the review agent produces security findings or code quality findings
- **Action**: Attach a `recommendation_for_testing` field to every HIGH and MEDIUM finding, specifying: (a) test type, (b) specific assertion to verify, (c) expected behavior when the bug exists vs. when it is fixed. The testing quality gate must verify that every HIGH/MEDIUM review finding has at least one corresponding test.
- **Severity**: MEDIUM
- **Source**: Review phase (L-XP-001: review-to-testing verification pipeline)

### PR-012: Durability requirements for async processing captured as NFRs
- **Trigger**: When designing or implementing async processing (queues, retry mechanisms, scheduled jobs)
- **Action**: Capture durability requirements as explicit NFRs in the requirements phase: what happens to pending items on process restart? What is the acceptable message loss rate? For retry mechanisms, verify that pending retries survive process restarts. If in-process queues are used for simplicity, document the durability limitation and include an upgrade path.
- **Severity**: MEDIUM
- **Source**: Implementation phase (webhook retry queue using in-process setTimeout, lost on restart)
