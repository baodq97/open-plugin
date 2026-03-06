#!/usr/bin/env node
"use strict";

/**
 * ontology_sync.js — Detect drift between skill files and ontology registry.
 * Called by PostToolUse hook when .claude/skills/ files are edited.
 * Reads tool input from stdin JSON (Claude Code hook protocol).
 */
const fs = require("fs");
const path = require("path");
const { readStdinJSON, resolveProjectRoot } = require("./hook-utils");
const { extractRegistrySkills } = require("./yaml-helpers");

function main() {
  const input = readStdinJSON();
  const root = resolveProjectRoot();
  const registry = path.join(root, ".claude", "ontology", "registry.yaml");
  const skillsDir = path.join(root, ".claude", "skills");

  if (!fs.existsSync(registry)) {
    console.log("ONTOLOGY: registry.yaml not found. Run /ontology-build to create it.");
    return;
  }
  if (!fs.existsSync(skillsDir)) return;

  // Collect skill directory names
  const dirSkills = fs
    .readdirSync(skillsDir)
    .filter((d) => fs.statSync(path.join(skillsDir, d)).isDirectory())
    .sort();

  // Collect registry skill names
  const regContent = fs.readFileSync(registry, "utf-8");
  const regSkills = extractRegistrySkills(regContent);

  // New skills (in dirs but not registry)
  const newSkills = dirSkills.filter((d) => !regSkills.includes(d));
  if (newSkills.length) {
    console.log(`ONTOLOGY-DRIFT: New skill(s) not in registry: ${newSkills.join(", ")}`);
    console.log("ACTION: Add entries to .claude/ontology/registry.yaml and suggest graph edges.");
  }

  // Removed skills (in registry but not dirs — skip built-in entries)
  const removed = regSkills.filter((r) => !dirSkills.includes(r));
  if (removed.length) {
    console.log(`ONTOLOGY-DRIFT: Registry has skill(s) with no directory: ${removed.join(", ")}`);
    console.log("ACTION: Remove entries from .claude/ontology/registry.yaml and graph.yaml.");
  }

  // Check token estimate drift for the changed file
  const changedFile = (input.tool_input && input.tool_input.file_path) || "";
  if (changedFile.includes(".claude/skills/")) {
    const skillName = changedFile.split(".claude/skills/")[1]?.split(/[/\\]/)[0];
    if (skillName && dirSkills.includes(skillName)) {
      let skillFile = path.join(skillsDir, skillName, "SKILL.md");
      if (!fs.existsSync(skillFile)) skillFile = path.join(skillsDir, skillName, "skill.md");

      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, "utf-8");
        const lines = content.split("\n").length;
        const expected = Math.round(lines * 3.8);

        // Extract current estimate from registry
        const entryMatch = regContent.match(new RegExp(`^ {2}${skillName}:[\\s\\S]*?token_estimate: (\\d+)`, "m"));
        if (entryMatch) {
          const current = parseInt(entryMatch[1], 10);
          const diff = Math.abs(expected - current);
          if (diff > current * 0.3) {
            console.log(
              `ONTOLOGY-STALE: ${skillName} token_estimate (${current}) is outdated. ` +
              `File has ${lines} lines (~${expected} tokens). Update registry.yaml.`
            );
          }
        }

        // Version drift detection
        const versionMatch = content.match(/^version:\s*"?([^"\n]+)"?/m);
        const regVersionMatch = regContent.match(new RegExp(`^ {2}${skillName}:[\\s\\S]*?version: "?([^"\\n]+)"?`, "m"));
        if (versionMatch && regVersionMatch && versionMatch[1].trim() !== regVersionMatch[1].trim()) {
          console.log(
            `ONTOLOGY-VERSION: ${skillName} version changed from "${regVersionMatch[1].trim()}" to "${versionMatch[1].trim()}". ` +
            "Update registry.yaml."
          );
        }
      }
    }
  }
}

main();
