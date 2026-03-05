#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Validate ontology consistency.
 * @param {string} targetDir - project root
 * @returns {number} error count
 */
function validate(targetDir) {
  const ontology = path.join(targetDir, ".claude", "ontology");
  const skills = path.join(targetDir, ".claude", "skills");
  let errors = 0;

  console.log(`Validating ontology in ${targetDir}\n`);

  // 1. Check files exist
  for (const f of ["registry.yaml", "graph.yaml", "chains.yaml", "usage-log.yaml"]) {
    if (fs.existsSync(path.join(ontology, f))) {
      console.log(`PASS: ${f} exists`);
    } else {
      console.log(`FAIL: ${f} missing`);
      errors++;
    }
  }

  // Helper: extract YAML top-level keys under "skills:"
  const extractRegistrySkills = (content) => {
    const matches = content.match(/^ {2}[a-z][a-z0-9-]*:$/gm);
    return (matches || []).map((m) => m.trim().replace(":", "")).sort();
  };

  // Helper: extract skill names from graph edges
  const extractGraphSkills = (content) => {
    const fromTo = content.match(/(?:from|to): +(\S+)/g) || [];
    const names = fromTo.map((m) => m.replace(/^(?:from|to): +/, ""));
    return [...new Set(names)].sort();
  };

  // Helper: extract skill names from chain definitions
  const extractChainSkills = (content) => {
    const matches = content.match(/^ +- ([a-z][a-z0-9-]*)/gm) || [];
    return [
      ...new Set(matches.map((m) => m.trim().replace(/^- /, "").replace(/ *#.*/, ""))),
    ].sort();
  };

  const registryPath = path.join(ontology, "registry.yaml");
  const graphPath = path.join(ontology, "graph.yaml");
  const chainsPath = path.join(ontology, "chains.yaml");

  // 2. Registry completeness
  if (fs.existsSync(registryPath) && fs.existsSync(skills)) {
    const regContent = fs.readFileSync(registryPath, "utf-8");
    const regSkills = extractRegistrySkills(regContent);
    const dirSkills = fs
      .readdirSync(skills)
      .filter((d) => fs.statSync(path.join(skills, d)).isDirectory())
      .sort();

    const missing = dirSkills.filter((d) => !regSkills.includes(d));
    if (missing.length) {
      console.log(`FAIL: Skills in dirs but not registry: ${missing.join(", ")}`);
      errors++;
    } else {
      console.log("PASS: All skill directories are in registry");
    }
    console.log(`INFO: ${dirSkills.length} skill dirs, ${regSkills.length} registry entries`);
  }

  // 3. Graph coverage
  if (fs.existsSync(graphPath) && fs.existsSync(registryPath)) {
    const regSkills = extractRegistrySkills(fs.readFileSync(registryPath, "utf-8"));
    const graphSkills = extractGraphSkills(fs.readFileSync(graphPath, "utf-8"));
    const edgeCount = (fs.readFileSync(graphPath, "utf-8").match(/^ {2}- from:/gm) || []).length;

    const noEdges = regSkills.filter((s) => !graphSkills.includes(s));
    if (noEdges.length) {
      console.log(`WARN: Skills with no graph edges: ${noEdges.join(", ")}`);
    } else {
      console.log("PASS: All skills have graph edges");
    }
    console.log(`INFO: ${edgeCount} graph edges`);
  }

  // 4. Chain validity
  if (fs.existsSync(chainsPath) && fs.existsSync(registryPath)) {
    const regSkills = extractRegistrySkills(fs.readFileSync(registryPath, "utf-8"));
    const chainSkills = extractChainSkills(fs.readFileSync(chainsPath, "utf-8"));

    const invalid = chainSkills.filter((s) => !regSkills.includes(s));
    if (invalid.length) {
      console.log(`FAIL: Chain skills not in registry: ${invalid.join(", ")}`);
      errors++;
    } else {
      console.log("PASS: All chain skills exist in registry");
    }
  }

  // 5. File sizes
  console.log();
  for (const f of ["registry.yaml", "graph.yaml", "chains.yaml"]) {
    const p = path.join(ontology, f);
    if (fs.existsSync(p)) {
      const lineCount = fs.readFileSync(p, "utf-8").split("\n").length;
      console.log(`SIZE: ${f} = ${lineCount} lines`);
    }
  }

  console.log();
  if (errors === 0) {
    console.log("All checks passed.");
  } else {
    console.log(`${errors} error(s) found.`);
  }

  return errors;
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  process.exit(validate(path.resolve(target)));
}

module.exports = { validate };
