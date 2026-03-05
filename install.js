#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const PLUGIN_DIR = __dirname;

function main() {
  const target = path.resolve(process.argv[2] || ".");
  const claude = path.join(target, ".claude");

  console.log(`Installing Skills Ontology plugin into: ${target}`);

  // ── 1. Copy plugin files ───────────────────────────────────────────
  for (const sub of ["ontology", "hooks", "rules", "commands"]) {
    fs.mkdirSync(path.join(claude, sub), { recursive: true });
  }

  const copies = [
    ["plugin/hooks/ontology_sync.js", ".claude/hooks/ontology_sync.js"],
    ["plugin/hooks/ontology_track_skill.js", ".claude/hooks/ontology_track_skill.js"],
    ["plugin/rules/skill-routing.md", ".claude/rules/skill-routing.md"],
    ["plugin/rules/ontology-lifecycle.md", ".claude/rules/ontology-lifecycle.md"],
    ["plugin/commands/ontology-build.md", ".claude/commands/ontology-build.md"],
    ["plugin/ontology/usage-log.yaml", ".claude/ontology/usage-log.yaml"],
    ["src/build-registry.js", ".claude/hooks/build_registry.js"],
  ];

  for (const [src, dst] of copies) {
    fs.copyFileSync(path.join(PLUGIN_DIR, src), path.join(target, dst));
  }
  console.log("  Copied: hooks, rules, commands, ontology templates");

  // ── 2. Build initial registry from existing skills ─────────────────
  const skillsDir = path.join(claude, "skills");
  const hasSkills =
    fs.existsSync(skillsDir) &&
    fs.readdirSync(skillsDir).some((d) => {
      const dir = path.join(skillsDir, d);
      return (
        fs.statSync(dir).isDirectory() &&
        (fs.existsSync(path.join(dir, "SKILL.md")) || fs.existsSync(path.join(dir, "skill.md")))
      );
    });

  if (hasSkills) {
    console.log("  Found skills in .claude/skills/ — building registry...");
    const { buildRegistry } = require("./src/build-registry");
    buildRegistry(target);
    console.log("  Built: registry.yaml, graph.yaml, chains.yaml");
  } else {
    console.log("  No skills found — creating empty ontology files");
    for (const name of ["registry-empty.yaml", "graph-empty.yaml", "chains-empty.yaml"]) {
      const dst = name.replace("-empty", "");
      fs.copyFileSync(
        path.join(PLUGIN_DIR, "plugin", "ontology", name),
        path.join(claude, "ontology", dst)
      );
    }
  }

  // ── 3. Patch settings.local.json ───────────────────────────────────
  const { patchSettings } = require("./src/patch-settings");
  const settingsPath = path.join(claude, "settings.local.json");
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, "{}\n");
  }
  patchSettings(settingsPath);
  console.log("  Patched: settings.local.json (PostToolUse hooks)");

  // ── 4. Done ────────────────────────────────────────────────────────
  console.log();
  console.log("Installation complete!");
  console.log();
  console.log("Next steps:");
  console.log("  1. Run /ontology-build in Claude Code to refine the auto-generated ontology");
  console.log("  2. Review .claude/ontology/graph.yaml and add relationship edges");
  console.log("  3. Review .claude/ontology/chains.yaml and define skill sequences");
  console.log();
  console.log("The ontology will auto-update when you edit skill files or use 2+ skills.");
}

main();
