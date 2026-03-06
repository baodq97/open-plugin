---
name: vbounce-knowledge
version: "2.0.0"
description: |
  V-Bounce Knowledge Agent - Captures learnings from development cycles.
  Supports 2 modes: Per-Phase (lightweight capture after each phase) and
  End-of-Cycle (full retrospective). Extracts: code patterns, prompt patterns,
  lessons learned, AI effectiveness metrics. Phase-specific templates.
  Triggers: retrospective, lessons, knowledge, patterns, capture, document learnings.
---

# V-Bounce Knowledge Agent v2.0

Capture and organize knowledge — continuously during each phase AND at end of cycle.

## Modes

### 1. Per-Phase Capture Mode (NEW in v2.0)

**Lightweight extraction** invoked by the orchestrator after each phase approval. Captures phase-specific learnings without full retrospective overhead.

```yaml
mode: per_phase
phase: requirements | design | implementation | testing | review | deployment
input:
  cycle_id: "[CYCLE-ID]"
  phase_output: "[Phase artifacts]"
  quality_gate_result: "[QG verdict and details]"
  refinement_rounds: [count]  # How many revision cycles
```

### 2. End-of-Cycle Mode (Standard)

Full retrospective after all phases complete. Same as v1.x behavior plus aggregated per-phase captures.

```yaml
mode: end_of_cycle
input:
  cycle_id: "[CYCLE-ID]"
  all_phase_captures: "[Aggregated per-phase captures]"
  full_cycle_artifacts: "[All cycle outputs]"
```

## Per-Phase Capture Templates

Each phase captures different knowledge. These templates are intentionally lightweight.

### Requirements Phase Capture

```yaml
phase_capture:
  phase: requirements
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  ambiguity_patterns:
    - pattern: "[Vague term or pattern found]"
      frequency: [count]
      resolution: "[How it was clarified]"
      effectiveness: high | medium | low

  clarification_log:
    questions_asked: [count]
    questions_effective: [count]  # Led to meaningful refinement
    avg_ambiguity_reduction: "[Score before → after]"

  nfr_gaps:
    - category: "[Missing NFR category]"
      discovered_during: "review | quality_gate"

  test_skeleton_stats:
    total_generated: [count]
    per_category: { positive: N, negative: N, edge: N, security: N }
```

### Design Phase Capture

```yaml
phase_capture:
  phase: design
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  architecture_decisions:
    - decision: "[What was decided]"
      rationale: "[Why]"
      alternatives_considered: ["[Alt 1]", "[Alt 2]"]
      reusable: true | false  # Could this ADR apply to other features?

  security_findings:
    - finding: "[Security consideration discovered]"
      severity: high | medium | low
      mitigation: "[How addressed]"

  pattern_reuse:
    - pattern: "[Existing pattern reused]"
      source: "[Where it came from]"
      adaptation: "[How it was adapted]"
```

### Implementation Phase Capture

```yaml
phase_capture:
  phase: implementation
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  hallucination_log:
    total_caught: [count]
    by_type:
      fake_packages: [count]
      fake_methods: [count]
      fake_configs: [count]
    patterns: ["[Hallucination patterns to watch for]"]

  package_issues:
    - package: "[Name]"
      issue: "[What went wrong]"
      resolution: "[How fixed]"

  code_quality_insights:
    - insight: "[What was learned]"
      applicable_to: "[Future scenarios]"
```

### Testing Phase Capture

```yaml
phase_capture:
  phase: testing
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  coverage_gaps:
    - gap: "[What wasn't covered initially]"
      discovered_by: "quality_gate | manual_review | edge_case_analysis"
      resolution: "[Tests added]"

  edge_case_discoveries:
    - scenario: "[Edge case found]"
      impact: high | medium | low
      generalizable: true | false  # Applies beyond this feature?

  test_distribution:
    target: { positive: 40, negative: 30, edge: 20, security: 10 }
    actual: { positive: N, negative: N, edge: N, security: N }
    deviation_notes: "[Why distribution differed, if it did]"
```

### Review Phase Capture

```yaml
phase_capture:
  phase: review
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  common_issues:
    - issue: "[Frequent review finding]"
      category: hallucination | security | quality | logic | performance
      recurrence: "[How often this comes up]"

  false_positives:
    - flagged: "[What was flagged]"
      actual: "[Why it was actually fine]"
      prevention: "[How to avoid false flag next time]"
```

### Deployment Phase Capture

```yaml
phase_capture:
  phase: deployment
  cycle_ref: "[CYCLE-ID]"
  timestamp: "[ISO datetime]"

  environment_issues:
    - issue: "[Environment-specific problem]"
      environment: staging | production
      resolution: "[How fixed]"

  configuration_surprises:
    - surprise: "[Unexpected config requirement]"
      impact: "[What it affected]"
      documentation_gap: "[What should have been documented]"

  rollback_triggers:
    triggered: true | false
    reason: "[If triggered, why]"
    effectiveness: "[How well rollback worked]"
```

## End-of-Cycle Output Format

```yaml
knowledge_id: KC-[YYYY-MM]-[###]
cycle_ref: "[Cycle ID]"
capture_date: "[ISO date]"

# Aggregated from per-phase captures
phase_captures_summary:
  total_phases: [count]
  total_insights: [count]
  most_productive_phase: "[Phase with most learnings]"

code_patterns:
  - id: PAT-CODE-001
    name: "[Pattern name]"
    category: error-handling | validation | auth | data-access
    description: "[What it does]"
    use_case: "[When to use]"
    template: |
      [Code template]
    example: |
      [Concrete example]

prompt_patterns:
  - id: PAT-PROMPT-001
    name: "[Pattern name]"
    phase: requirements | design | implementation | testing
    effectiveness: [1-10]
    template: |
      [Prompt template]
    tips: ["[Tip 1]", "[Tip 2]"]

lessons_learned:
  - id: LL-001
    title: "[Lesson title]"
    category: technical | process | communication
    situation: "[Context]"
    problem: "[What went wrong]"
    resolution: "[How fixed]"
    prevention: "[How to prevent]"
    tags: ["[tag1]", "[tag2]"]

ai_effectiveness:
  cycle_summary:
    total_outputs: [count]
    accepted_unchanged: [count]
    required_changes: [count]
    rejected: [count]
  by_phase:
    requirements:
      acceptance_rate: "[%]"
      common_issues: ["[issue]"]
      refinement_rounds: [count]
    implementation:
      acceptance_rate: "[%]"
      hallucinations_caught: [count]
  time_analysis:
    estimated_manual: "[hours]"
    actual_with_ai: "[hours]"
    time_saved: "[hours]"
  bounce_effectiveness:
    requirements_time: "[% of total]"
    implementation_time: "[% of total]"
    validation_time: "[% of total]"

recommendations:
  skill_updates:
    - skill: "[skill name]"
      change: "[What to update]"
      reason: "[Why]"
  process_improvements:
    - area: "[Area]"
      suggestion: "[Improvement]"
```

## Knowledge Categories

### Code Patterns
- Error handling
- Validation
- Authentication
- Data access
- Caching
- Integration

### Prompt Patterns
- Requirements extraction
- Design generation
- Code generation
- Test generation

### Lessons Learned
- Technical challenges
- Process improvements
- Communication gaps
- Quality issues

## Metrics Tracked

| Metric | Target |
|--------|--------|
| AI Acceptance Rate | > 80% |
| Hallucination Rate | < 5% |
| Cycle Time | < 5 days |
| Test Coverage | > 80% |
| Bounce Ratio | Requirements+Validation > 60% of time |

## Knowledge Base Structure

```
docs/knowledge-base/
├── patterns/
│   ├── code/
│   └── prompts/
├── lessons/
│   └── [YYYY-MM]/
├── phase-captures/
│   └── [CYCLE-ID]/
│       ├── requirements.yaml
│       ├── design.yaml
│       ├── implementation.yaml
│       ├── testing.yaml
│       └── deployment.yaml
└── metrics/
    └── effectiveness.xlsx
```
