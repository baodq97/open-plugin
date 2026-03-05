"use strict";

const { DOMAIN_COLORS, EDGE_STYLES } = require("../generate-graph");

/**
 * Render graph data as Mermaid diagram syntax.
 * @param {{ nodes: Object[], edges: Object[], domains: string[] }} graph
 * @returns {string} Mermaid diagram
 */
function renderMermaid(graph) {
  const { nodes, edges, domains } = graph;
  const lines = ["graph LR"];

  // Group nodes by domain into subgraphs
  for (const domain of domains) {
    const domainNodes = nodes.filter((n) => n.domain === domain);
    if (!domainNodes.length) continue;

    const color = DOMAIN_COLORS[domain] || DOMAIN_COLORS.general;
    lines.push(`  subgraph ${domain}["${domain.toUpperCase()}"]`);
    for (const node of domainNodes) {
      const label = node.id.length > 25 ? node.id.slice(0, 22) + "..." : node.id;
      lines.push(`    ${sanitizeId(node.id)}["${label}"]`);
    }
    lines.push("  end");
  }

  // Add edges
  for (const edge of edges) {
    const from = sanitizeId(edge.from);
    const to = sanitizeId(edge.to);
    const label = EDGE_STYLES[edge.type]?.label || edge.type;
    const strength = edge.strength || 50;

    let arrow;
    if (edge.type === "prerequisite") {
      arrow = `-->|"${label} (${strength})"|`;
    } else if (edge.type === "alternative") {
      arrow = `-.-|"${label} (${strength})"|`;
    } else {
      arrow = `---|"${label} (${strength})"|`;
    }
    lines.push(`  ${from} ${arrow} ${to}`);
  }

  // Style subgraphs
  for (const domain of domains) {
    const color = (DOMAIN_COLORS[domain] || DOMAIN_COLORS.general).hex;
    lines.push(`  style ${domain} fill:${color}15,stroke:${color},stroke-width:2px`);
  }

  return lines.join("\n");
}

/** Sanitize node ID for Mermaid (no hyphens in IDs) */
function sanitizeId(id) {
  return id.replace(/-/g, "_");
}

module.exports = { renderMermaid };
