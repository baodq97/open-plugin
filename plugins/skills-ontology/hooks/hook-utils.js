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

module.exports = { readStdinJSON, resolveProjectRoot };
