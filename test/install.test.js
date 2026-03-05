"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");

const PLUGIN_DIR = path.resolve(__dirname, "..");

describe("install.js", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("install");
    fs.mkdirSync(path.join(tmpDir, ".claude"), { recursive: true });
  });

  afterEach(() => cleanup(tmpDir));

  it("copies all plugin files", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    const expected = [
      ".claude/hooks/ontology_sync.js",
      ".claude/hooks/ontology_track_skill.js",
      ".claude/hooks/build_registry.js",
      ".claude/rules/skill-routing.md",
      ".claude/rules/ontology-lifecycle.md",
      ".claude/commands/ontology-build.md",
      ".claude/commands/ontology-stats.md",
      ".claude/ontology/usage-log.yaml",
      ".claude/settings.local.json",
    ];

    for (const file of expected) {
      assert.ok(fs.existsSync(path.join(tmpDir, file)), `Missing: ${file}`);
    }
  });

  it("creates empty ontology when no skills exist", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    const reg = path.join(tmpDir, ".claude", "ontology", "registry.yaml");
    assert.ok(fs.existsSync(reg));
    const content = fs.readFileSync(reg, "utf-8");
    assert.ok(content.includes("skills: {}") || content.includes("skills:"));
  });

  it("builds registry when skills exist", () => {
    createSkill(tmpDir, "test-skill", { version: '"1.0"', description: '"Test"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    const reg = path.join(tmpDir, ".claude", "ontology", "registry.yaml");
    const content = fs.readFileSync(reg, "utf-8");
    assert.ok(content.includes("test-skill:"));
  });

  it("patches settings.local.json", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    const settings = JSON.parse(
      fs.readFileSync(path.join(tmpDir, ".claude", "settings.local.json"), "utf-8")
    );
    assert.ok(settings.hooks);
    assert.ok(settings.hooks.PostToolUse.length >= 2);
  });
});
