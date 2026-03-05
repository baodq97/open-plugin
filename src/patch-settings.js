#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { loadManifest } = require("./manifest");

/**
 * Patch .claude/settings.local.json to add ontology hooks.
 * Idempotent — won't duplicate hooks if already present.
 * @param {string} settingsPath - path to settings.local.json
 */
function patchSettings(settingsPath) {
  const manifest = loadManifest(path.resolve(__dirname, ".."));
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    } catch (error) {
      console.warn(
        `Warning: ${settingsPath} is not valid JSON (${error.message}). Recreating settings with ontology hooks only.`
      );
      settings = {};
    }
  }

  const hooks = (settings.hooks = settings.hooks || {});
  const postHooks = (hooks.PostToolUse = hooks.PostToolUse || []);

  for (const hookDef of manifest.settingsHooks) {
    const aliases = hookDef.matcherAliases || [hookDef.matcher];
    const hasHook = postHooks.some(
      (entry) =>
        aliases.includes(entry.matcher || "") &&
        (entry.hooks || []).some(
          (h) =>
            h.hookId === hookDef.id ||
            h.command === hookDef.command ||
            (h.command || "").includes(hookDef.script)
        )
    );

    if (hasHook) continue;

    let targetEntry = postHooks.find((entry) => aliases.includes(entry.matcher || ""));
    if (!targetEntry) {
      targetEntry = { matcher: hookDef.matcher, hooks: [] };
      postHooks.push(targetEntry);
    }
    targetEntry.hooks = targetEntry.hooks || [];
    targetEntry.hooks.push({
      type: "command",
      command: hookDef.command,
      managedBy: manifest.id,
      hookId: hookDef.id,
    });
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
}

// CLI
if (require.main === module) {
  const settingsPath = process.argv[2];
  if (!settingsPath) {
    console.error("Usage: node patch-settings.js <settings.local.json>");
    process.exit(1);
  }
  patchSettings(settingsPath);
  console.log("Patched:", settingsPath);
}

module.exports = { patchSettings };
