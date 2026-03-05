# Ontology Lifecycle — Auto-Update Rules

These rules keep `.claude/ontology/` synchronized with skill files and usage history.

## On Skill File Change
When any file in `.claude/skills/` is edited/created/deleted:
1. If hook output includes `ONTOLOGY-DRIFT` or `ONTOLOGY-STALE`, handle immediately:
   - **New skill**: add entry to `registry.yaml`, suggest 1-3 `graph.yaml` edges.
   - **Removed skill**: remove from `registry.yaml`, `graph.yaml`, and `chains.yaml`.
   - **Stale token_estimate**: recalculate from file size and update `registry.yaml`.
2. If description/triggers changed, refresh trigger metadata in `registry.yaml`.

## On Skill Usage Tracking
When hook output includes `ONTOLOGY-TRACK`:
1. Append a session record to `.claude/ontology/usage-log.yaml` with:
   - date
   - skills_used
   - chain_used (or null)
   - chain_complete
   - outcome (`success|partial|failed`)
   - notes

## Strength Adjustment
When `usage-log.yaml` has 10+ entries:
- Frequently co-used skills without edges -> add `complementary`.
- Consistent success -> increase edge `strength` by 5 (max 100).
- Consistent failure -> decrease edge `strength` by 10 (min 10).
- Skills unused for 30+ days -> flag for review.
