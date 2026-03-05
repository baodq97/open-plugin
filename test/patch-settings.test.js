"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, cleanup } = require("./helpers");
const { patchSettings } = require("../src/patch-settings");

describe("patchSettings", () => {
  let tmpDir;
  let settingsPath;

  beforeEach(() => {
    tmpDir = makeTempDir("patch");
    settingsPath = path.join(tmpDir, "settings.local.json");
  });

  afterEach(() => cleanup(tmpDir));

  it("creates hooks in empty settings", () => {
    fs.writeFileSync(settingsPath, "{}\n");
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    assert.ok(settings.hooks);
    assert.ok(settings.hooks.PostToolUse);
    assert.equal(settings.hooks.PostToolUse.length, 2);
  });

  it("adds sync hook with Write|Edit matcher", () => {
    fs.writeFileSync(settingsPath, "{}\n");
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    const writeEdit = settings.hooks.PostToolUse.find((e) => e.matcher === "Write|Edit");
    assert.ok(writeEdit);
    assert.ok(writeEdit.hooks[0].command.includes("ontology_sync"));
  });

  it("adds track hook with Skill matcher", () => {
    fs.writeFileSync(settingsPath, "{}\n");
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    const skill = settings.hooks.PostToolUse.find((e) => e.matcher === "Skill");
    assert.ok(skill);
    assert.ok(skill.hooks[0].command.includes("ontology_track"));
  });

  it("uses cross-platform node -e commands", () => {
    fs.writeFileSync(settingsPath, "{}\n");
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    for (const entry of settings.hooks.PostToolUse) {
      for (const hook of entry.hooks) {
        assert.ok(hook.command.startsWith("node -e"), `Expected node -e command, got: ${hook.command}`);
        assert.ok(!hook.command.includes("2>/dev/null"), "Should not contain bash-only syntax");
      }
    }
  });

  it("is idempotent — no duplicates on second run", () => {
    fs.writeFileSync(settingsPath, "{}\n");
    patchSettings(settingsPath);
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    assert.equal(settings.hooks.PostToolUse.length, 2);
  });

  it("preserves existing settings", () => {
    fs.writeFileSync(settingsPath, JSON.stringify({ custom: "value", hooks: {} }, null, 2));
    patchSettings(settingsPath);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    assert.equal(settings.custom, "value");
  });

  it("creates settings file if not exist", () => {
    assert.ok(!fs.existsSync(settingsPath));
    patchSettings(settingsPath);
    assert.ok(fs.existsSync(settingsPath));
  });
});
