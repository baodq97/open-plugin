"use strict";

const { DOMAIN_COLORS } = require("../generate-graph");

/**
 * Render graph data as ASCII art for terminal display.
 * Groups skills by domain in boxes, shows edges below.
 * @param {{ nodes: Object[], edges: Object[], domains: string[], stats: Object }} graph
 * @returns {string}
 */
function renderAscii(graph) {
  const { nodes, edges, domains, stats } = graph;
  const lines = [];

  lines.push("Skills Ontology Graph");
  lines.push("═".repeat(60));
  lines.push(`  ${stats.nodeCount} skills | ${stats.edgeCount} edges | ${stats.domainCount} domains | ${stats.isolatedNodes} isolated`);
  lines.push("");

  // Domain clusters
  for (const domain of domains) {
    const domainNodes = nodes.filter((n) => n.domain === domain);
    if (!domainNodes.length) continue;

    const color = (DOMAIN_COLORS[domain] || DOMAIN_COLORS.general).name;
    const header = ` ${domain.toUpperCase()} (${color}) `;
    const maxNameLen = Math.max(...domainNodes.map((n) => n.id.length), header.length - 4);
    const boxWidth = Math.max(maxNameLen + 4, header.length + 2);

    lines.push("┌" + "─".repeat(boxWidth) + "┐");
    lines.push("│" + header.padStart((boxWidth + header.length) >> 1).padEnd(boxWidth) + "│");
    lines.push("├" + "─".repeat(boxWidth) + "┤");

    for (const node of domainNodes) {
      const tokens = `(${node.tokenEstimate}t)`;
      const name = node.id;
      const content = `  ${name}${" ".repeat(Math.max(1, boxWidth - name.length - tokens.length - 3))}${tokens}`;
      lines.push("│" + content.padEnd(boxWidth) + "│");
    }

    lines.push("└" + "─".repeat(boxWidth) + "┘");
    lines.push("");
  }

  // Edge list
  if (edges.length) {
    lines.push("Edges:");
    lines.push("─".repeat(60));

    const byType = {};
    for (const e of edges) {
      (byType[e.type] = byType[e.type] || []).push(e);
    }

    for (const [type, typeEdges] of Object.entries(byType)) {
      const symbol = type === "prerequisite" ? "──▶" :
                     type === "complementary" ? "◀─▶" :
                     type === "alternative" ? "- -" :
                     type === "orchestrates" ? "═══▶" :
                     type === "evolves" ? "~~~▶" : "···▶";

      lines.push(`  ${type}:`);
      for (const e of typeEdges) {
        lines.push(`    ${e.from} ${symbol} ${e.to}  [${e.strength}]${e.note ? "  " + e.note : ""}`);
      }
    }
  } else {
    lines.push("No edges defined. Run /ontology-build to auto-suggest edges.");
  }

  lines.push("");
  return lines.join("\n");
}

module.exports = { renderAscii };
