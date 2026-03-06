#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { generateGraph } = require("./generate-graph");
const { renderHtml } = require("./renderers/html");
const { renderMermaid } = require("./renderers/mermaid");
const { renderAscii } = require("./renderers/ascii");

/**
 * Generate and display the skills ontology graph.
 * @param {string} targetDir - project root
 * @param {string} format - "html" | "mermaid" | "ascii" | "json"
 * @param {{ output?: string, open?: boolean }} options
 */
function graphCommand(targetDir, format, options) {
  const graph = generateGraph(targetDir);
  if (!graph) return;

  if (graph.nodes.length === 0) {
    console.log("No skills found in registry. Run `npx skills-ontology build` first.");
    return;
  }

  format = format || "html";
  options = options || {};

  switch (format) {
    case "html": {
      const html = renderHtml(graph);
      const outPath = options.output || path.join(targetDir, ".claude", "ontology", "graph.html");
      fs.writeFileSync(outPath, html);
      console.log(`Graph written to: ${outPath}`);
      console.log(`  ${graph.stats.nodeCount} nodes, ${graph.stats.edgeCount} edges, ${graph.stats.domainCount} domains`);

      if (options.open !== false) {
        tryOpen(outPath);
      }
      return outPath;
    }

    case "mermaid": {
      const mermaid = renderMermaid(graph);
      if (options.output) {
        fs.writeFileSync(options.output, mermaid);
        console.log(`Mermaid diagram written to: ${options.output}`);
      } else {
        console.log(mermaid);
      }
      return mermaid;
    }

    case "ascii": {
      const ascii = renderAscii(graph);
      if (options.output) {
        fs.writeFileSync(options.output, ascii);
        console.log(`ASCII graph written to: ${options.output}`);
      } else {
        console.log(ascii);
      }
      return ascii;
    }

    case "json": {
      const json = JSON.stringify(graph, null, 2);
      if (options.output) {
        fs.writeFileSync(options.output, json);
        console.log(`JSON graph written to: ${options.output}`);
      } else {
        console.log(json);
      }
      return json;
    }

    default:
      console.error(`Unknown format: ${format}. Use: html, mermaid, ascii, json`);
  }
}

/** Try to open a file in the default browser (best-effort, cross-platform). */
function tryOpen(filePath) {
  const commands = {
    darwin: "open",
    win32: "start",
    linux: "xdg-open",
  };
  const cmd = commands[process.platform];
  if (!cmd) return;

  try {
    execFileSync(cmd, [filePath], { stdio: "ignore" });
  } catch {
    console.log(`  Open manually: file://${path.resolve(filePath)}`);
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  let target = ".";
  let format = "html";
  let output = null;
  let noOpen = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--format" && args[i + 1]) format = args[++i];
    else if (args[i].startsWith("--format=")) format = args[i].split("=")[1];
    else if (args[i] === "--output" && args[i + 1]) output = args[++i];
    else if (args[i].startsWith("--output=")) output = args[i].split("=")[1];
    else if (args[i] === "--no-open") noOpen = true;
    else if (!args[i].startsWith("-")) target = args[i];
  }

  graphCommand(path.resolve(target), format, { output, open: !noOpen });
}

module.exports = { graphCommand };
