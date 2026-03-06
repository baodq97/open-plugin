#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { parseGraphEdges } = require("../hooks/yaml-helpers");

/**
 * Read usage-log.yaml and adjust graph.yaml edge strengths.
 * +5 for success, -10 for failed, capped 10-100.
 * @param {string} targetDir - project root
 * @returns {{ adjusted: number, added: number }}
 */
function adjustStrengths(targetDir) {
  const ontology = path.join(targetDir, ".claude", "ontology");
  const logPath = path.join(ontology, "usage-log.yaml");
  const graphPath = path.join(ontology, "graph.yaml");

  if (!fs.existsSync(logPath) || !fs.existsSync(graphPath)) {
    console.log("Missing usage-log.yaml or graph.yaml");
    return { adjusted: 0, added: 0 };
  }

  const logContent = fs.readFileSync(logPath, "utf-8");
  const graphContent = fs.readFileSync(graphPath, "utf-8");

  // Parse usage entries
  const entries = parseUsageLog(logContent);
  if (entries.length < 10) {
    console.log(`Only ${entries.length} log entries (need 10+). Skipping adjustment.`);
    return { adjusted: 0, added: 0 };
  }

  // Count skill pair co-occurrences and outcomes
  const pairStats = {};
  for (const entry of entries) {
    const skills = entry.skills || [];
    const outcome = entry.outcome || "success";
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const key = [skills[i], skills[j]].sort().join("↔");
        if (!pairStats[key]) pairStats[key] = { success: 0, failed: 0, partial: 0 };
        pairStats[key][outcome] = (pairStats[key][outcome] || 0) + 1;
      }
    }
  }

  // Parse existing graph edges
  const edges = parseGraphEdges(graphContent);
  let adjusted = 0;
  let added = 0;

  // Adjust existing edge strengths
  for (const edge of edges) {
    const key = [edge.from, edge.to].sort().join("↔");
    const stats = pairStats[key];
    if (!stats) continue;

    const total = stats.success + stats.failed + stats.partial;
    if (total < 2) continue;

    const successRate = stats.success / total;
    const failRate = stats.failed / total;

    let delta = 0;
    if (successRate >= 0.7) delta = 5;
    else if (failRate >= 0.5) delta = -10;

    if (delta !== 0) {
      edge.strength = Math.max(10, Math.min(100, edge.strength + delta));
      adjusted++;
    }
    delete pairStats[key]; // handled
  }

  // Suggest new complementary edges for frequent pairs not in graph
  for (const [key, stats] of Object.entries(pairStats)) {
    const total = stats.success + stats.failed + stats.partial;
    if (total < 3) continue;

    const [from, to] = key.split("↔");
    edges.push({
      from, to, type: "complementary",
      strength: 50, note: `auto-added: used together ${total} times`,
    });
    added++;
  }

  // Write updated graph
  const newGraph = serializeGraph(edges);
  fs.writeFileSync(graphPath, newGraph);

  console.log(`Adjusted ${adjusted} edge(s), added ${added} new edge(s)`);
  return { adjusted, added };
}

/** Parse usage-log.yaml entries (simple YAML subset) */
function parseUsageLog(content) {
  const entries = [];
  let current = null;

  for (const line of content.split("\n")) {
    if (line.match(/^\s*- date:/)) {
      if (current) entries.push(current);
      current = { date: line.match(/date:\s*"?([^"]+)"?/)?.[1] || "" };
    } else if (current) {
      const skillsMatch = line.match(/skills_used:\s*\[([^\]]*)\]/);
      if (skillsMatch) {
        current.skills = skillsMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
      }
      const outcomeMatch = line.match(/outcome:\s*(\w+)/);
      if (outcomeMatch) current.outcome = outcomeMatch[1];
    }
  }
  if (current) entries.push(current);
  return entries;
}

/** Serialize edges back to YAML */
function serializeGraph(edges) {
  const lines = [
    "# Skills Relationship Graph — edges between skills",
    "# 6 types: prerequisite, complementary, alternative, orchestrates, evolves, enhances",
    "",
  ];

  if (edges.length === 0) {
    lines.push("edges: []");
  } else {
    lines.push("edges:");
    for (const e of edges) {
      lines.push(
        `  - from: ${e.from}`,
        `    to: ${e.to}`,
        `    type: ${e.type}`,
        `    strength: ${e.strength}`,
        `    note: "${e.note || ""}"`,
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  adjustStrengths(path.resolve(target));
}

module.exports = { adjustStrengths, parseUsageLog, parseGraphEdges };
