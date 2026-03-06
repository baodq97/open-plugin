"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { makeTempDir, createSkill, cleanup } = require("./helpers");

const PLUGIN_DIR = path.resolve(__dirname, "..");

describe("ontology_sync.js hook", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("hooks-sync");
    fs.mkdirSync(path.join(tmpDir, ".claude", "ontology"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, ".claude", "ontology", "registry.yaml"), "skills:\n");
  });

  afterEach(() => cleanup(tmpDir));

  it("detects drift when new skill added", () => {
    createSkill(tmpDir, "existing-skill", { version: '"1.0"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "src", "build-registry.js"), tmpDir]);

    createSkill(tmpDir, "new-skill", { version: '"1.0"' });

    const stdinData = JSON.stringify({ tool_input: { file_path: "" } });
    const output = execFileSync("node", [path.join(PLUGIN_DIR, "hooks", "ontology_sync.js")], {
      input: stdinData,
      cwd: tmpDir,
      encoding: "utf-8",
    });

    assert.ok(output.includes("ONTOLOGY-DRIFT"));
    assert.ok(output.includes("new-skill"));
  });

  it("detects stale token estimate", () => {
    createSkill(tmpDir, "growing-skill", { version: '"1.0"', description: '"A skill"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "src", "build-registry.js"), tmpDir]);

    const skillPath = path.join(tmpDir, ".claude", "skills", "growing-skill", "SKILL.md");
    const bigContent = "---\nversion: 1.0\n---\n" + "x\n".repeat(500);
    fs.writeFileSync(skillPath, bigContent);

    const changedFile = path.join(tmpDir, ".claude", "skills", "growing-skill", "SKILL.md");
    const stdinData = JSON.stringify({ tool_input: { file_path: changedFile } });
    const output = execFileSync("node", [path.join(PLUGIN_DIR, "hooks", "ontology_sync.js")], {
      input: stdinData,
      cwd: tmpDir,
      encoding: "utf-8",
    });

    assert.ok(output.includes("ONTOLOGY-STALE"));
  });
});

describe("ontology_track_skill.js hook", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("hooks-track");
    const tracker = path.join(os.tmpdir(), "claude-ontology-session-default.yaml");
    try { fs.unlinkSync(tracker); } catch { /* ok */ }
  });

  afterEach(() => {
    cleanup(tmpDir);
    const tracker = path.join(os.tmpdir(), "claude-ontology-session-default.yaml");
    try { fs.unlinkSync(tracker); } catch { /* ok */ }
  });

  it("tracks skill invocation", () => {
    const hookPath = path.join(PLUGIN_DIR, "hooks", "ontology_track_skill.js");
    const stdinData = JSON.stringify({ tool_input: { skill: "test-skill" } });
    execFileSync("node", [hookPath], {
      input: stdinData,
      encoding: "utf-8",
    });

    const tracker = path.join(os.tmpdir(), "claude-ontology-session-default.yaml");
    assert.ok(fs.existsSync(tracker));
    const content = fs.readFileSync(tracker, "utf-8");
    assert.ok(content.includes("test-skill"));
  });

  it("outputs ONTOLOGY-TRACK after 2+ skills", () => {
    const hookPath = path.join(PLUGIN_DIR, "hooks", "ontology_track_skill.js");

    execFileSync("node", [hookPath], {
      input: JSON.stringify({ tool_input: { skill: "skill-a" } }),
      encoding: "utf-8",
    });

    const tracker = path.join(os.tmpdir(), "claude-ontology-session-default.yaml");
    assert.ok(fs.existsSync(tracker), "Session tracker should exist after first call");

    const output = execFileSync("node", [hookPath], {
      input: JSON.stringify({ tool_input: { skill: "skill-b" } }),
      encoding: "utf-8",
    });

    assert.ok(output.includes("ONTOLOGY-TRACK"), `Expected ONTOLOGY-TRACK in: ${output}`);
  });

  it("ignores empty tool input", () => {
    const hookPath = path.join(PLUGIN_DIR, "hooks", "ontology_track_skill.js");
    execFileSync("node", [hookPath], {
      input: "",
      encoding: "utf-8",
    });

    const tracker = path.join(os.tmpdir(), "claude-ontology-session-default.yaml");
    assert.ok(!fs.existsSync(tracker));
  });
});
