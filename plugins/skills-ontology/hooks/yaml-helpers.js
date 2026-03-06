"use strict";

/**
 * Shared YAML parsing utilities for registry and graph files.
 * Extracted from src/generate-graph.js and src/validate.js to eliminate
 * duplicated parsing logic across hook scripts and CLI tools.
 *
 * Pure string-in, data-out — no file I/O, no external dependencies.
 */

/**
 * Parse graph.yaml content into edge objects.
 * @param {string} content - raw graph.yaml text
 * @returns {Array<{from: string, to: string, type: string, strength: number, note: string}>}
 */
function parseGraphEdges(content) {
  const edges = [];
  let current = null;

  for (const line of content.split("\n")) {
    if (line.match(/^\s*- from:/)) {
      if (current) edges.push(current);
      current = { from: line.match(/from:\s*(\S+)/)[1] };
    } else if (current) {
      const toMatch = line.match(/^\s+to:\s*(\S+)/);
      if (toMatch) current.to = toMatch[1];
      const typeMatch = line.match(/^\s+type:\s*(\S+)/);
      if (typeMatch) current.type = typeMatch[1];
      const strMatch = line.match(/^\s+strength:\s*(\d+)/);
      if (strMatch) current.strength = parseInt(strMatch[1], 10);
      const noteMatch = line.match(/^\s+note:\s*"?([^"]*)"?/);
      if (noteMatch) current.note = noteMatch[1];
    }
  }
  if (current) edges.push(current);

  return edges.map((e) => ({
    ...e,
    strength: e.strength || 50,
    type: e.type || "complementary",
    note: e.note || "",
  }));
}

/**
 * Extract sorted skill names from registry.yaml content.
 * Matches 2-space indented top-level keys (the skill name entries).
 * @param {string} content - raw registry.yaml text
 * @returns {string[]} sorted skill names
 */
function extractRegistrySkills(content) {
  const matches = content.match(/^ {2}[a-z][a-z0-9-]*:$/gm);
  return (matches || []).map((m) => m.trim().replace(":", "")).sort();
}

module.exports = { parseGraphEdges, extractRegistrySkills };
