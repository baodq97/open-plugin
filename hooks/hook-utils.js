"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Read JSON from stdin (fd 0) synchronously.
 * Returns parsed object, or {} on empty/malformed input.
 * Cross-platform: handles Windows EOF error on empty pipe.
 */
function readStdinJSON() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Build structured JSON output for Claude Code hook response.
 * Auto-detects hookEventName from stdin input; caller can override.
 * @param {Object} input - Parsed stdin JSON (from readStdinJSON)
 * @param {Object} fields - Fields to include in hookSpecificOutput
 * @returns {Object} Complete hook output object
 */
function buildOutput(input, fields = {}) {
  const hookEventName = fields.hookEventName || input.hook_event_name || "PostToolUse";
  const result = {
    hookSpecificOutput: {
      hookEventName,
    },
  };
  // Copy event-specific fields into hookSpecificOutput
  for (const [key, value] of Object.entries(fields)) {
    if (key !== "hookEventName") {
      result.hookSpecificOutput[key] = value;
    }
  }
  return result;
}

/**
 * Resolve project root directory.
 * Checks CLAUDE_PROJECT_DIR env var first, then cwd.
 * @returns {string} Absolute path to project root
 */
function resolveProjectRoot() {
  if (process.env.CLAUDE_PROJECT_DIR) {
    return path.resolve(process.env.CLAUDE_PROJECT_DIR);
  }
  return path.resolve(process.cwd());
}

module.exports = { readStdinJSON, buildOutput, resolveProjectRoot };
