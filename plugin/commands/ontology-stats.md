Analyze skills usage patterns from the ontology usage log.

## Instructions

1. Read `.claude/ontology/usage-log.yaml`
2. If the file has fewer than 3 entries, report "Not enough data yet" and exit

3. Compute and report:
   - **Most-used skills**: Count skill appearances across all entries, rank top 5
   - **Most-used chains**: Count chain appearances (where `chain_used` is not null), rank top 3
   - **Success rate**: Percentage of entries with `outcome: success` vs total
   - **Unused skills**: Skills in `.claude/ontology/registry.yaml` that never appear in usage log
   - **Frequent pairs**: Skills that appear together in 3+ entries but have no `graph.yaml` edge

4. Suggest graph edge changes:
   - Frequent pairs without edges → suggest adding `complementary` edge
   - Chains with 80%+ success rate → suggest increasing edge `strength` by 5
   - Chains with 50%+ failure rate → suggest decreasing edge `strength` by 10
   - Skills unused for 30+ days → flag for review

5. Format output as a summary table, not raw YAML
