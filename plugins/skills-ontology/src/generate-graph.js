#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { parseGraphEdges: parseEdgesRaw } = require("../hooks/yaml-helpers");

/**
 * Domain color palette — consistent across all renderers.
 */
const DOMAIN_COLORS = {
  sdlc: { hex: "#3b82f6", name: "blue" },
  frontend: { hex: "#22c55e", name: "green" },
  devops: { hex: "#f97316", name: "orange" },
  aiquinta: { hex: "#a855f7", name: "purple" },
  backend: { hex: "#ef4444", name: "red" },
  sdk: { hex: "#06b6d4", name: "cyan" },
  documentation: { hex: "#eab308", name: "yellow" },
  meta: { hex: "#64748b", name: "slate" },
  general: { hex: "#9ca3af", name: "gray" },
};

/**
 * Edge type visual encoding.
 */
const EDGE_STYLES = {
  prerequisite: { dash: "", label: "prereq" },
  complementary: { dash: "5,5", label: "complement" },
  alternative: { dash: "2,4", label: "alt" },
  orchestrates: { dash: "8,3", label: "orchestrates" },
  evolves: { dash: "1,3", label: "evolves" },
  enhances: { dash: "4,2,1,2", label: "enhances" },
};

/**
 * Read registry.yaml and graph.yaml, produce a unified graph data structure.
 * @param {string} targetDir - project root
 * @returns {{ nodes: Object[], edges: Object[], domains: string[], stats: Object }}
 */
function generateGraph(targetDir) {
  const ontology = path.join(targetDir, ".claude", "ontology");
  const registryPath = path.join(ontology, "registry.yaml");
  const graphPath = path.join(ontology, "graph.yaml");

  if (!fs.existsSync(registryPath)) {
    console.error("No registry.yaml found. Run `npx skills-ontology build` first.");
    return null;
  }

  const regContent = fs.readFileSync(registryPath, "utf-8");
  const graphContent = fs.existsSync(graphPath) ? fs.readFileSync(graphPath, "utf-8") : "edges: []";

  // Parse nodes from registry
  const nodes = parseRegistryNodes(regContent);

  // Parse edges from graph
  const edges = parseGraphEdges(graphContent);

  // Collect unique domains
  const domains = [...new Set(nodes.map((n) => n.domain))].sort();

  // Stats
  const stats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    domainCount: domains.length,
    isolatedNodes: nodes.filter((n) => !edges.some((e) => e.from === n.id || e.to === n.id)).length,
  };

  return { nodes, edges, domains, stats, colors: DOMAIN_COLORS, edgeStyles: EDGE_STYLES };
}

/**
 * Parse registry.yaml into node objects.
 */
function parseRegistryNodes(content) {
  const nodes = [];
  const blocks = content.split(/\n(?= {2}[a-z])/);

  for (const block of blocks) {
    const nameMatch = block.match(/^ {2}([a-z][a-z0-9-]*):/m);
    if (!nameMatch) continue;

    const name = nameMatch[1];
    const domain = block.match(/domain: \[([^\]]*)\]/)?.[1]?.split(",")[0]?.trim() || "general";
    const phase = block.match(/phase: \[([^\]]*)\]/)?.[1]?.split(",")[0]?.trim() || "implementation";
    const tokens = parseInt(block.match(/token_estimate: (\d+)/)?.[1] || "100", 10);
    const version = block.match(/version: "?([^"\n]+)"?/)?.[1]?.trim() || "1.0";
    const autoTrigger = /auto_trigger: true/.test(block);

    nodes.push({
      id: name,
      domain,
      phase,
      tokenEstimate: tokens,
      version,
      autoTrigger,
      color: (DOMAIN_COLORS[domain] || DOMAIN_COLORS.general).hex,
      radius: Math.max(8, Math.min(30, Math.sqrt(tokens / 3))),
    });
  }

  return nodes;
}

/**
 * Parse graph.yaml into edge objects with style information.
 * Delegates raw parsing to hooks/yaml-helpers.js to avoid duplication.
 */
function parseGraphEdges(content) {
  return parseEdgesRaw(content).map((e) => ({
    ...e,
    style: EDGE_STYLES[e.type] || EDGE_STYLES.complementary,
  }));
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const graph = generateGraph(path.resolve(target));
  if (graph) {
    console.log(JSON.stringify(graph, null, 2));
  }
}

module.exports = { generateGraph, DOMAIN_COLORS, EDGE_STYLES };
