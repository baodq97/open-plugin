#!/usr/bin/env node
"use strict";

/**
 * ontology_track_skill.js — Track skill invocations during a session.
 * Called by PostToolUse hook on Skill tool.
 * Reads tool input from stdin JSON (Claude Code hook protocol).
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { readStdinJSON, resolveProjectRoot } = require("./hook-utils");

function main() {
  const input = readStdinJSON();

  // Extract skill name — Skill tool uses "skill" field in tool_input
  const toolInput = input.tool_input || {};
  const skillName = toolInput.skill || "";
  if (!skillName) return;

  // Session tracker in temp directory (cross-platform)
  const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");

  // Append skill with timestamp
  const entry = `  - skill: ${skillName}\n    time: ${new Date().toISOString()}\n`;
  fs.appendFileSync(tracker, entry);

  // Count skills used this session
  const content = fs.readFileSync(tracker, "utf-8");
  const skills = (content.match(/skill: .+/g) || []).map((m) => m.replace("skill: ", ""));
  const unique = [...new Set(skills)];

  // Ensure usage-log.yaml exists in the project
  const root = resolveProjectRoot();
  const ontologyDir = path.join(root, ".claude", "ontology");
  const usageLog = path.join(ontologyDir, "usage-log.yaml");
  if (fs.existsSync(ontologyDir) && !fs.existsSync(usageLog)) {
    fs.writeFileSync(usageLog, "# Skills Ontology Usage Log\n# Auto-populated by ontology_track_skill hook\n\nentries: []\n");
  }

  if (unique.length >= 2) {
    console.log(
      `ONTOLOGY-TRACK: ${skills.length} skills used this session [${unique.join(", ")}]. ` +
      "Remember to log outcome to .claude/ontology/usage-log.yaml when done."
    );
  }
}

main();
