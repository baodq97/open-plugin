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

## v4.1.0 — Reliability & Usability

Focus: hooks enforcement, user-facing documentation, settings support.

### 4.1.1 — Stop hook

Add a `Stop` hook that warns when a session ends mid-cycle. Prevents state corruption from abandoned phases.

```
hooks/hooks.json → add Stop event
```

### 4.1.2 — SubagentStart hook

Auto-inject resolved workspace path and learned rules into every vbounce agent launch. Reduces reliance on orchestrator prompt construction.

```
hooks/hooks.json → add SubagentStart event (type: command)
scripts/inject-context.sh → new script
```

### 4.1.3 — `/vbounce:report` command

Generate a consolidated cycle report: phase statuses, QG verdicts, approval history, traceability coverage, knowledge captured. Supports markdown output.

```
commands/report.md → new command
```

### 4.1.4 — Usage guide in README

Quick start guide, full cycle walkthrough with examples, command reference with arguments, configuration guide.

### 4.1.5 — Plugin settings template

Create `.claude/vbounce.local.md` template with documented fields: QG threshold overrides, model preferences per agent, workflow defaults.

```yaml
# Example .claude/vbounce.local.md
---
qg_overrides:
  requirements:
    ambiguity_threshold: 40
  testing:
    distribution_tolerance: 8
model_overrides:
  quality-gate-validator: sonnet
  traceability-analyst: sonnet
default_track: feature
---
```

---

## v4.2.0 — Agent Quality

Focus: contract completeness, self-verification parity, DRY improvements.

### 4.2.1 — Traceability-analyst Update mode specification

Add per-phase guidance on which files to read:
- Design: `design/traceability.md`, `design/api-spec.md`, `design/design.md`
- Implementation: `implementation/summary.md`, `implementation/execution-report.md`
- Testing: `testing/coverage-matrix.md`, `testing/test-results.md`

### 4.2.2 — Self-verification parity

Expand lean checklists to match depth of requirements-analyst (10 items):
- review-auditor: 5 → 8 items (add STRIDE verification, false positive check, file coverage)
- deployment-engineer: 5 → 8 items (add architecture alignment, security config, changelog)
- knowledge-curator: 4 → 7 items (add duplicate rule check, retrospective output, calibration)
- traceability-analyst: 5 → 8 items (add V-Model percentages, impact scope, matrix ID format)

### 4.2.3 — Knowledge-curator retrospective output

Add `{workspace}/knowledge/retrospective-summary.md` to End-of-Cycle mode output contract.

### 4.2.4 — QG criteria single source of truth

Remove inline criteria tables from quality-gate-validator.md. Agent reads criteria exclusively from `references/quality-criteria.md` at runtime. Eliminates drift risk.

### 4.2.5 — UserPromptSubmit hook

Parse vbounce commands (APPROVED, CHANGES REQUESTED, SKIP TO, ROLLBACK TO, START CR, START BUGFIX) early. Inject structured context so the orchestrator receives parsed intent instead of free-text.

### 4.2.6 — Workspace resolution DRY

Extract the repeated "Workspace Resolution" paragraph from all 9 agents into `references/workspace-resolution.md`. Agents reference it instead of duplicating.

---

## v4.3.0 — Infrastructure & Polish

Focus: CI validation, file hygiene, workflow optimization.

### 4.3.1 — plugin.json enhancements

Add `repository`, `homepage`, `keywords` fields.

### 4.3.2 — .gitignore

Add `.vbounce/` to project gitignore (runtime workspace artifacts).

### 4.3.3 — LICENSE file

Add MIT LICENSE file to plugin directory.

### 4.3.4 — State.yaml templates

Pre-built state.yaml templates for each workflow track. Commands reference templates instead of constructing state inline.

```
templates/state-feature.yaml
templates/state-bugfix.yaml
templates/state-hotfix.yaml
templates/state-cr.yaml
```

### 4.3.5 — Contract chain validation script

Script that parses all agent contracts and verifies:
- Agent A output files = Agent B required input files
- No orphaned outputs (produced but never consumed)
- No missing inputs (required but never produced)
- Color uniqueness across agents

```
scripts/validate-contracts.py → new script
```

### 4.3.6 — CR workflow split

Split `workflows-change-request-track.md` (~6000 words):
- `workflows-change-request-track.md` — core reference (~3000 words)
- `workflows-cr-walkthrough.md` — practical walkthrough examples (~3000 words)

---

## v5.0.0 (current)

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

## v5.1.0 (current)

Architecture redesign based on FEAT-3877 real cycle and E2E benchmark results.

### Completed (2026-03-09)

- **Unified TDD**: Merged testing-engineer into implementation-engineer — one agent writes tests (RED), implements code (GREEN), and runs execution verification (max 3 iterations). Eliminates the #1 v5.0 failure mode: agent-to-agent contract mismatch
- **Per-phase specialized QG agents**: Replaced generic quality-gate-validator (haiku) with 4 domain-specific QG agents (sonnet): qg-requirements, qg-design, qg-implementation, qg-deployment
- **QG failure loop with KC**: QG FAIL → knowledge-curator captures → phase agent revises → QG re-run
- **Parallel implementation support**: Task breakdown for independent modules, scope-restricted agent launches, combined integration verification
- **Review agent enhancements**: Test-source cross-check (7a/7b/7c), aggressive execution report review, constructor compatibility check
- **Design agent frontend support**: Step 3b for component hierarchy, field-to-UI mapping, error states, accessibility baseline
- **Traceability token budget**: Update mode capped at 500 lines, append-only; only Finalize mode reads full matrix
- **Phase reduction**: 8 → 6 phases (removed separate Testing and Execution phases)
- **Agent count**: 9 → 12 active agents (8 core + 4 QG), 1 deprecated (testing-engineer)

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

Per-agent model selection via plugin settings (override defaults from v5.0).

### 6.0.5 — Agent resume on QG failure

Use Agent tool `resume` parameter when QG fails. The phase agent retains full context from its previous run, making revisions faster and more accurate than a cold re-dispatch.

### 6.0.6 — Streaming progress indicators

Real-time phase progress via hook `statusMessage` fields. Users see which step the agent is on (e.g., "requirements-analyst: Step 7/11 — Writing Acceptance Criteria").
