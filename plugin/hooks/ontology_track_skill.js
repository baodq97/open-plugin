#!/usr/bin/env node
"use strict";

/**
 * ontology_track_skill.js — Track skill invocations during a session.
 * Called by PostToolUse hook on Skill tool.
 * Reads CLAUDE_TOOL_INPUT env var for the skill name.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

function main() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT || "";

  // Extract skill name from JSON input
  let skillName = "";
  const nameMatch = toolInput.match(/"skill_name"\s*:\s*"([^"]+)"/);
  if (nameMatch) {
    skillName = nameMatch[1];
  } else {
    const cmdMatch = toolInput.match(/"command"\s*:\s*"([^"]+)"/);
    if (cmdMatch) skillName = cmdMatch[1];
  }

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

  if (unique.length >= 2) {
    console.log(
      `ONTOLOGY-TRACK: ${skills.length} skills used this session [${unique.join(", ")}]. ` +
      "Remember to log outcome to .claude/ontology/usage-log.yaml when done."
    );
  }
}

main();
