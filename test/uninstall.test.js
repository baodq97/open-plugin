"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");

const PLUGIN_DIR = path.resolve(__dirname, "..");

describe("uninstall.js", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("uninstall");
    fs.mkdirSync(path.join(tmpDir, ".claude"), { recursive: true });
    // Install first
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);
  });

  afterEach(() => cleanup(tmpDir));

  it("removes ontology directory", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "uninstall.js"), tmpDir]);
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "ontology")));
  });

  it("removes hook files", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "uninstall.js"), tmpDir]);
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "hooks", "ontology_sync.js")));
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "hooks", "ontology_track_skill.js")));
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "hooks", "build_registry.js")));
  });

  it("removes rules and commands", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "uninstall.js"), tmpDir]);
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "rules", "skill-routing.md")));
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "rules", "ontology-lifecycle.md")));
    assert.ok(!fs.existsSync(path.join(tmpDir, ".claude", "commands", "ontology-build.md")));
  });

  it("cleans hooks from settings.local.json", () => {
    execFileSync("node", [path.join(PLUGIN_DIR, "uninstall.js"), tmpDir]);

    const settingsPath = path.join(tmpDir, ".claude", "settings.local.json");
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    assert.ok(!settings.hooks || Object.keys(settings.hooks).length === 0);
  });

  it("preserves .claude/skills/ directory", () => {
    createSkill(tmpDir, "keep-me", { version: '"1.0"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "uninstall.js"), tmpDir]);
    assert.ok(fs.existsSync(path.join(tmpDir, ".claude", "skills", "keep-me", "SKILL.md")));
  });
});
