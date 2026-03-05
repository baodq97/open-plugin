#!/usr/bin/env node
"use strict";

/**
 * ontology_sync.js — Detect drift between skill files and ontology registry.
 * Called by PostToolUse hook when .claude/skills/ files are edited.
 * Reads CLAUDE_FILE_PATH env var for the changed file path.
 */
const fs = require("fs");
const path = require("path");

function findProjectRoot() {
  // Walk up from this script: .claude/hooks/ontology_sync.js → project root
  return path.resolve(__dirname, "..", "..");
}

function main() {
  const root = findProjectRoot();
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
  const regSkills = (regContent.match(/^ {2}[a-z][a-z0-9-]*:$/gm) || [])
    .map((m) => m.trim().replace(":", ""))
    .sort();

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
  const changedFile = process.env.CLAUDE_FILE_PATH || "";
  if (changedFile.includes(".claude/skills/")) {
    const skillName = changedFile.split(".claude/skills/")[1]?.split(/[/\\]/)[0];
    if (skillName && dirSkills.includes(skillName)) {
      let skillFile = path.join(skillsDir, skillName, "SKILL.md");
      if (!fs.existsSync(skillFile)) skillFile = path.join(skillsDir, skillName, "skill.md");

      if (fs.existsSync(skillFile)) {
        const lines = fs.readFileSync(skillFile, "utf-8").split("\n").length;
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
      }
    }
  }
}

main();
