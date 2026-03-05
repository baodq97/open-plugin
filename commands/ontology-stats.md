Analyze skills usage patterns from the ontology usage log.

## Instructions

1. Read `.claude/ontology/usage-log.yaml`.
2. If fewer than 3 entries exist, report `Not enough data yet` and stop.
3. Compute and report:
   - top 5 most-used skills
   - top 3 chains (where `chain_used` is not null)
   - success rate (`outcome: success` / total)
   - unused skills (in registry but never used)
   - frequent unlinked skill pairs (appear together >= 3 times but no graph edge)
4. Suggest edge tuning:
   - frequent unlinked pairs -> add `complementary`
   - chain success >= 80% -> increase edge strength by 5
   - chain failure >= 50% -> decrease edge strength by 10
5. Return concise summary tables, not raw YAML.
