#!/usr/bin/env node
"use strict";

const path = require("path");

const command = process.argv[2];
const target = process.argv[3];

function usage() {
  console.log("Skills Ontology — Claude Code Plugin");
  console.log();
  console.log("Usage:");
  console.log("  npx skills-ontology install [path]     Install into a project");
  console.log("  npx skills-ontology uninstall [path]    Remove from a project");
  console.log("  npx skills-ontology validate [path]     Validate ontology");
  console.log("  npx skills-ontology build [path]        Rebuild registry");
  console.log("  npx skills-ontology adjust [path]       Auto-adjust graph strengths from usage log");
  console.log("  npx skills-ontology graph [path] [opts] Visualize the ontology graph");
  console.log("    --format=html|mermaid|ascii|json      Output format (default: html)");
  console.log("    --output=<file>                       Write to file instead of stdout");
  console.log("    --no-open                             Don't auto-open HTML in browser");
}

switch (command) {
  case "install": {
    process.argv = [process.argv[0], process.argv[1], target || "."];
    require(path.join(__dirname, "..", "install.js"));
    break;
  }
  case "uninstall": {
    process.argv = [process.argv[0], process.argv[1], target || "."];
    require(path.join(__dirname, "..", "uninstall.js"));
    break;
  }
  case "validate": {
    const { validate } = require(path.join(__dirname, "..", "src", "validate.js"));
    process.exit(validate(path.resolve(target || ".")));
    break;
  }
  case "build": {
    const { buildRegistry } = require(path.join(__dirname, "..", "src", "build-registry.js"));
    buildRegistry(path.resolve(target || "."));
    break;
  }
  case "adjust": {
    const { adjustStrengths } = require(path.join(__dirname, "..", "src", "adjust-strengths.js"));
    adjustStrengths(path.resolve(target || "."));
    break;
  }
  case "graph": {
    const { graphCommand } = require(path.join(__dirname, "..", "src", "graph.js"));
    // Parse flags from remaining args
    const args = process.argv.slice(3);
    let gTarget = ".";
    let format = "html";
    let output = null;
    let noOpen = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--format" && args[i + 1]) format = args[++i];
      else if (args[i].startsWith("--format=")) format = args[i].split("=")[1];
      else if (args[i] === "--output" && args[i + 1]) output = args[++i];
      else if (args[i].startsWith("--output=")) output = args[i].split("=")[1];
      else if (args[i] === "--no-open") noOpen = true;
      else if (!args[i].startsWith("-")) gTarget = args[i];
    }
    graphCommand(path.resolve(gTarget), format, { output, open: !noOpen });
    break;
  }
  default:
    usage();
    process.exit(command ? 1 : 0);
}
