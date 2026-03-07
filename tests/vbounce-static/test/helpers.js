"use strict";

const fs = require("fs");
const path = require("path");

/** Absolute path to the vbounce plugin root */
const PLUGIN_ROOT = path.resolve(__dirname, "..", "..", "..", "plugins", "vbounce");

/** Absolute path to the repository root */
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/**
 * Parse YAML-style frontmatter from a markdown file.
 * Returns { frontmatter: object|null, body: string }
 */
function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };

  const raw = match[1];
  const body = match[2];

  // Simple YAML parser for flat keys and arrays — no external deps
  const fm = {};
  let currentKey = null;
  for (const line of raw.split("\n")) {
    // Array item under a key
    const arrayItem = line.match(/^\s+-\s+"?([^"]*)"?$/);
    if (arrayItem && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(arrayItem[1]);
      continue;
    }

    // Inline array: key: [val, val]
    const inlineArray = line.match(/^(\w[\w-]*):\s*\[([^\]]*)\]$/);
    if (inlineArray) {
      currentKey = inlineArray[1];
      fm[currentKey] = inlineArray[2]
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    // key: value (simple scalar)
    const scalar = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (scalar) {
      currentKey = scalar[1];
      const val = scalar[2].trim().replace(/^["']|["']$/g, "");
      // Multiline value indicator
      if (val === "|" || val === ">") {
        fm[currentKey] = "";
      } else {
        fm[currentKey] = val;
      }
      continue;
    }

    // key with no value (block scalar continues)
    const keyOnly = line.match(/^(\w[\w-]*):\s*$/);
    if (keyOnly) {
      currentKey = keyOnly[1];
      fm[currentKey] = "";
      continue;
    }

    // Continuation of multiline value
    if (currentKey && typeof fm[currentKey] === "string" && line.startsWith("  ")) {
      fm[currentKey] += (fm[currentKey] ? "\n" : "") + line.trimStart();
    }
  }

  return { frontmatter: fm, body };
}

/**
 * Assert file exists at a path relative to PLUGIN_ROOT.
 * Returns true or throws with descriptive message.
 */
function checkFileExists(relPath) {
  const full = path.join(PLUGIN_ROOT, relPath);
  if (!fs.existsSync(full)) {
    throw new Error(`Expected file missing: ${relPath}`);
  }
  return true;
}

/**
 * Read file content relative to PLUGIN_ROOT.
 */
function readPluginFile(relPath) {
  return fs.readFileSync(path.join(PLUGIN_ROOT, relPath), "utf-8");
}

module.exports = {
  PLUGIN_ROOT,
  REPO_ROOT,
  parseFrontmatter,
  checkFileExists,
  readPluginFile,
};
