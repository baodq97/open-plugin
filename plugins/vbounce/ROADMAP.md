# V-Bounce Roadmap

## v4.0.0

Agent-first architecture with explicit contracts, shared workspace, state management, and multi-layer quality assurance.

### Completed (2026-03-07)

- 1 orchestrator skill + 9 specialized agents
- 8 slash commands (start, status, approve, bugfix, hotfix, cr, skip, rollback)
- 2 hooks (PreToolUse contract validation, SubagentStop output verification)
- 15 shared reference files
- 4 workflow tracks (feature, bugfix, hotfix, change request)
- Contract chain fixes: security-design input, review output forwarding, design inputs for deployment
- Agent color deconfliction (9 unique colors)

---

## v5.0.0

Mixed-model assignment, TDD flow (contracts → TDD-RED → TDD-GREEN → execution verification), tech-aware context injection, parallel post-phase agents, incremental traceability.

### Completed (2026-03-08)

- Mixed-model: opus(2), sonnet(3), haiku(4) — ~75% cost reduction
- TDD flow: shared contracts eliminate agent-to-agent desync
- Tech stack detection + framework context injection into all agent dispatches
- Execution verification: orchestrator runs install → compile → test with up to 3 re-dispatch iterations
- Parallel post-phase: trace + KC dispatched concurrently
- Incremental traceability: append mode + finalize after deployment
- QG criteria deduplicated to single reference file
- Command resolution table extracted to reference file

---

## v5.1.0

Architecture redesign based on FEAT-3877 real cycle and E2E benchmark results.

### Completed (2026-03-09)

- **Unified TDD**: Merged testing-engineer into implementation-engineer — one agent writes tests (RED), implements code (GREEN), and runs execution verification (max 3 iterations). Eliminates the #1 v5.0 failure mode: agent-to-agent contract mismatch
- **Per-phase specialized QG agents**: Replaced generic quality-gate-validator (haiku) with 4 domain-specific QG agents (sonnet): qg-requirements, qg-design, qg-implementation, qg-deployment
- **QG failure loop with KC**: QG FAIL → knowledge-curator captures → phase agent revises → QG re-run
- **Parallel implementation support**: Task breakdown for independent modules, scope-restricted agent launches, combined integration verification
- **Review agent enhancements**: Test-source cross-check (7a/7b/7c), aggressive execution report review, constructor compatibility check
- **Design agent frontend support**: Step 3b for component hierarchy, field-to-UI mapping, error states, accessibility baseline
- **Installed skills consultation**: Design-architect and implementation-engineer actively search installed skills for framework-specific patterns
- **Traceability token budget**: Update mode capped at 500 lines, append-only; only Finalize mode reads full matrix
- **Phase reduction**: 8 → 6 phases (removed separate Testing and Execution phases)
- **Agent count**: 9 → 12 active agents (8 core + 4 QG), 1 deprecated (testing-engineer)

---

## v5.2.0 — Validate & Harden (next)

Focus: validate v5.1 architecture, reduce tech debt, improve reliability.

### 5.2.1 — SKILL.md refactor: extract reusable patterns

SKILL.md is 465 lines monolithic — patterns embedded in SDLC context cannot be reused by other plugins.

Extract into reusable reference files:

| Pattern | New Reference File | Reusable By |
|---------|-------------------|-------------|
| 7-activity state machine | `references/state-machine.md` | Any multi-phase workflow |
| Tech stack detection (init steps 4-5) | `references/tech-detection.md` | Any code-aware plugin |
| Input/output contract validation | `references/contract-validation.md` | Any agent-based workflow |
| Workspace convention + state.yaml schema | `references/workspace-convention.md` | Any multi-agent project |
| QG failure loop protocol | `references/qg-failure-loop.md` | Any QA pipeline |
| Parallel dispatch + scope restriction | `references/parallel-dispatch.md` | Any orchestrator |

Result: SKILL.md shrinks to ~100-150 lines (triggers, phase list, dispatch table, cross-references).

### 5.2.2 — Workspace resolution DRY

Extract the repeated "Workspace Resolution" paragraph from all 12 agents into `references/workspace-resolution.md`. Agents reference it instead of duplicating.

### 5.2.3 — Contract chain validation script

Script that parses all agent contracts and verifies:
- Agent A output files = Agent B required input files
- No orphaned outputs (produced but never consumed)
- No missing inputs (required but never produced)
- Color uniqueness across agents

```
scripts/validate-contracts.py → new script
```

### 5.2.4 — Agent resume on QG failure

Use Agent tool `resume` parameter when QG fails. The phase agent retains full context from its previous run, making revisions faster and more accurate than a cold re-dispatch. Major token savings.

### 5.2.5 — Self-verification parity

Expand lean checklists to match depth of implementation-engineer (20 items):
- deployment-engineer: 5 → 10 items
- knowledge-curator: 4 → 8 items
- traceability-analyst: 5 → 8 items
- 4 QG agents: verify criteria count matches

### 5.2.6 — Plugin settings template

Create `.claude/vbounce.local.md` template with documented fields for v5.1:

```yaml
---
qg_overrides:
  requirements:
    ambiguity_threshold: 40
  implementation:
    distribution_tolerance: 8
model_overrides:
  qg-requirements: opus
  traceability-analyst: sonnet
default_track: feature
---
```

---

## v5.3.0 — Efficiency & UX

Focus: token optimization, hooks, user experience.

### 5.3.1 — Token budget enforcement

Add explicit token/line budgets to all agents:
- Traceability Update: 500 lines (done in v5.1)
- Knowledge per-phase capture: 200 lines
- QG agents: 100 lines (verdict + criteria only)
- Review agent: 500 lines
- Benchmark: measure total token usage vs v5.0 (target: < 50% overhead)

### 5.3.2 — Stop hook

Add `Stop` hook that warns when a session ends mid-cycle. Saves state snapshot for resume. Prevents state corruption from abandoned phases.

### 5.3.3 — UserPromptSubmit hook

Parse vbounce commands (APPROVED, CHANGES REQUESTED, SKIP TO, ROLLBACK TO, START CR, START BUGFIX) early. Inject structured context so the orchestrator receives parsed intent instead of free-text.

### 5.3.4 — `/vbounce:report` command

Generate a consolidated cycle report: phase statuses, QG verdicts, approval history, traceability coverage, knowledge captured. Supports markdown output.

### 5.3.5 — Real cycle benchmark

Run v5.1 on a real project (same scope as FEAT-3877) and compare:
- Token usage vs v5.0 (target: < 1.2M vs 1.87M)
- Test pass rate (target: > 95% vs 90.5%)
- TS errors (target: < 10 vs 30)
- Cycle time (target: < 120 min vs 173 min)

---

## v6.0.0 — Advanced Features

### 6.0.1 — Multi-cycle management

Support parallel active cycles (e.g., feature + bugfix running simultaneously). Root `.vbounce/state.yaml` tracks multiple active cycles with context switching.

### 6.0.2 — Cycle history & analytics

Dashboard aggregating QG pass rates, cycle durations, common failure patterns, agent performance metrics across completed cycles.

### 6.0.3 — MCP integration

Connect to external services:
- Jira/Linear: ticket sync, status updates, acceptance criteria import
- GitHub: PR auto-creation after implementation, CI status tracking
- Slack: phase approval notifications, QG failure alerts

### 6.0.4 — Model tier configuration

Per-agent model selection via plugin settings (override defaults from v5.1).

### 6.0.5 — Streaming progress indicators

Real-time phase progress via hook `statusMessage` fields. Users see which step the agent is on (e.g., "requirements-analyst: Step 7/11 — Writing Acceptance Criteria").
