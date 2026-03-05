#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { loadManifest } = require("./src/manifest");

function main() {
  const target = path.resolve(process.argv[2] || ".");
  const claude = path.join(target, ".claude");
  const manifest = loadManifest(__dirname);

  console.log(`Uninstalling Skills Ontology plugin from: ${target}`);

  // Remove ontology directory
  const ontology = path.join(claude, "ontology");
  if (fs.existsSync(ontology)) {
    fs.rmSync(ontology, { recursive: true, force: true });
    console.log("  Removed: .claude/ontology/");
  }

  const managedTargets = (manifest.copyFiles || []).map((f) => path.join(target, f.to));
  for (const filePath of managedTargets) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  console.log("  Removed: plugin-managed hooks, rules, and commands");

  // Clean up empty directories
  for (const sub of ["hooks", "rules", "commands"]) {
    const d = path.join(claude, sub);
    try {
      if (fs.existsSync(d) && fs.readdirSync(d).length === 0) fs.rmdirSync(d);
    } catch { /* not empty, OK */ }
  }

  // Clean hooks from settings.local.json
  const settingsPath = path.join(claude, "settings.local.json");
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      const hooks = settings.hooks || {};
      const managedCommands = new Set((manifest.settingsHooks || []).map((h) => h.command));
      const managedScripts = (manifest.settingsHooks || [])
        .map((h) => h.script)
        .filter(Boolean);

      for (const event of Object.keys(hooks)) {
        hooks[event] = hooks[event]
          .map((entry) => ({
            ...entry,
            hooks: (entry.hooks || []).filter(
              (h) => {
                const command = h.command || "";
                if (h.managedBy === manifest.id) return false;
                if (managedCommands.has(command)) return false;
                if (managedScripts.some((script) => command.includes(script))) return false;
                return true;
              }
            ),
          }))
          .filter((entry) => entry.hooks && entry.hooks.length > 0);

        if (hooks[event].length === 0) delete hooks[event];
      }

      if (Object.keys(hooks).length === 0) delete settings.hooks;
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
      console.log("  Cleaned: settings.local.json hooks");
    } catch (e) {
      console.log(`  Warning: Could not clean settings.local.json: ${e.message}`);
    }
  }

  // Clean temp tracker
  const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
  if (fs.existsSync(tracker)) fs.unlinkSync(tracker);

  console.log();
  console.log("Uninstall complete. Your skills in .claude/skills/ are untouched.");
}

main();
