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
  default:
    usage();
    process.exit(command ? 1 : 0);
}
