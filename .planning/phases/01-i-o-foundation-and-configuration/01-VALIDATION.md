---
phase: 1
slug: i-o-foundation-and-configuration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (built-in, Node 18+) |
| **Config file** | none — uses npm script |
| **Quick run command** | `node --test test/hook-utils.test.js test/yaml-helpers.test.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test test/hook-utils.test.js test/yaml-helpers.test.js`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | INFRA-01 | unit | `node --test test/hook-utils.test.js` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | INFRA-01 | unit | `node --test test/hook-utils.test.js` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | INFRA-01 | unit | `node --test test/hook-utils.test.js` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | INFRA-02 | unit | `node --test test/yaml-helpers.test.js` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | INFRA-02 | unit | `node --test test/yaml-helpers.test.js` | ❌ W0 | ⬜ pending |
| 1-03-01 | 01 | 1 | INFRA-03 | unit | `node --test test/plugin-standard.test.js` | ✅ extend | ⬜ pending |
| 1-03-02 | 01 | 1 | SPEC-03 | unit | `node --test test/plugin-standard.test.js` | ✅ extend | ⬜ pending |
| 1-03-03 | 01 | 1 | SPEC-04 | unit | `node --test test/plugin-standard.test.js` | ✅ extend | ⬜ pending |
| 1-03-04 | 01 | 1 | SPEC-05 | unit | `node --test test/plugin-standard.test.js` | ✅ extend | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/hook-utils.test.js` — stubs for INFRA-01 (readStdinJSON, buildOutput, resolveProjectRoot)
- [ ] `test/yaml-helpers.test.js` — stubs for INFRA-02 (parseGraphEdges, extractRegistrySkills)
- [ ] Extend `test/plugin-standard.test.js` — stubs for INFRA-03, SPEC-03, SPEC-04, SPEC-05

*Existing infrastructure (node:test, helpers.js) covers all framework requirements.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
