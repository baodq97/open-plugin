#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

function main() {
  const target = path.resolve(process.argv[2] || ".");
  const claude = path.join(target, ".claude");

  console.log(`Uninstalling Skills Ontology plugin from: ${target}`);

  // Remove ontology directory
  const ontology = path.join(claude, "ontology");
  if (fs.existsSync(ontology)) {
    fs.rmSync(ontology, { recursive: true, force: true });
    console.log("  Removed: .claude/ontology/");
  }

  // Remove hooks
  for (const name of ["ontology_sync.js", "ontology_track_skill.js", "build_registry.js"]) {
    const p = path.join(claude, "hooks", name);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  console.log("  Removed: ontology hooks");

  // Remove rules
  for (const name of ["skill-routing.md", "ontology-lifecycle.md"]) {
    const p = path.join(claude, "rules", name);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  console.log("  Removed: ontology rules");

  // Remove commands
  for (const cmd of ["ontology-build.md", "ontology-stats.md", "ontology-graph.md"]) {
    const cmdFile = path.join(claude, "commands", cmd);
    if (fs.existsSync(cmdFile)) fs.unlinkSync(cmdFile);
  }
  console.log("  Removed: ontology commands");

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

      for (const event of Object.keys(hooks)) {
        hooks[event] = hooks[event]
          .map((entry) => ({
            ...entry,
            hooks: (entry.hooks || []).filter(
              (h) => !/ontology/.test(h.command || "")
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
