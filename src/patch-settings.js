#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Patch .claude/settings.local.json to add ontology hooks.
 * Idempotent — won't duplicate hooks if already present.
 * @param {string} settingsPath - path to settings.local.json
 */
function patchSettings(settingsPath) {
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  }

  const hooks = (settings.hooks = settings.hooks || {});
  const postHooks = (hooks.PostToolUse = hooks.PostToolUse || []);

  // ── Hook 1: Ontology sync on skill file changes ────────────────────
  // Cross-platform: node -e wraps require in try/catch (works on bash, cmd, powershell)
  const syncCmd = 'node -e "try{require(\'.claude/hooks/ontology_sync.js\')}catch(e){}"';

  const hasSyncHook = postHooks.some(
    (entry) =>
      /Write|Edit/.test(entry.matcher || "") &&
      (entry.hooks || []).some((h) => /ontology_sync/.test(h.command || ""))
  );

  if (!hasSyncHook) {
    // Find existing Write|Edit entry or create new
    let writeEditEntry = postHooks.find((e) => /^(Write\|Edit|Edit\|Write)$/.test(e.matcher || ""));
    if (writeEditEntry) {
      writeEditEntry.hooks = writeEditEntry.hooks || [];
      writeEditEntry.hooks.push({ type: "command", command: syncCmd });
    } else {
      postHooks.push({
        matcher: "Write|Edit",
        hooks: [{ type: "command", command: syncCmd }],
      });
    }
  }

  // ── Hook 2: Skill usage tracking ──────────────────────────────────
  const trackCmd = 'node -e "try{require(\'.claude/hooks/ontology_track_skill.js\')}catch(e){}"';

  const hasTrackHook = postHooks.some(
    (entry) =>
      entry.matcher === "Skill" &&
      (entry.hooks || []).some((h) => /ontology_track/.test(h.command || ""))
  );

  if (!hasTrackHook) {
    let skillEntry = postHooks.find((e) => e.matcher === "Skill");
    if (skillEntry) {
      skillEntry.hooks = skillEntry.hooks || [];
      skillEntry.hooks.push({ type: "command", command: trackCmd });
    } else {
      postHooks.push({
        matcher: "Skill",
        hooks: [{ type: "command", command: trackCmd }],
      });
    }
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
