# Ontology Lifecycle — Auto-Update Rules

These rules keep `.claude/ontology/` in sync with skill files and track usage.

## On Skill File Change
When you edit/create/delete any file in `.claude/skills/`:
1. If hook outputs `ONTOLOGY-DRIFT` or `ONTOLOGY-STALE`, act on it immediately:
   - **New skill**: Add entry to `registry.yaml`, suggest 1-3 `graph.yaml` edges
   - **Removed skill**: Remove from `registry.yaml`, remove edges from `graph.yaml`, remove from `chains.yaml`
   - **Stale token_estimate**: Recalculate as `file_lines * 4` and update `registry.yaml`
2. If description/triggers changed, update `registry.yaml` triggers list

## On Skill Usage Tracking
When hook outputs `ONTOLOGY-TRACK` (2+ skills used in session):
1. Before session ends, append to `.claude/ontology/usage-log.yaml`:
   ```yaml
   - date: "YYYY-MM-DD"
     skills_used: [skill-a, skill-b]
     chain_used: chain-name   # or null
     chain_complete: true/false
     outcome: success/partial/failed
     notes: "brief context"
   ```
2. Determine `outcome` from session context:
   - `success`: Task completed, user satisfied, no errors
   - `partial`: Some skills in chain skipped or task partially done
   - `failed`: Errors, wrong skill chosen, user switched approach

## Strength Adjustment (monthly or on review)
When `usage-log.yaml` accumulates 10+ entries:
- Skills frequently used together but not in `graph.yaml` → add `complementary` edge
- Chains with consistent `outcome: success` → increase edge `strength` by 5 (cap 100)
- Chains with consistent `outcome: failed` → decrease edge `strength` by 10 (floor 10)
- Skills never used in 30+ days → flag for review
