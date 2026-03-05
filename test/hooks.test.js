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
    fs.mkdirSync(path.join(tmpDir, ".claude"), { recursive: true });
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);
  });

  afterEach(() => cleanup(tmpDir));

  it("detects drift when new skill added", () => {
    // Build initial registry with one skill
    createSkill(tmpDir, "existing-skill", { version: '"1.0"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    // Add a new skill without rebuilding
    createSkill(tmpDir, "new-skill", { version: '"1.0"' });

    const output = execFileSync("node", [path.join(tmpDir, ".claude", "hooks", "ontology_sync.js")], {
      env: { ...process.env, CLAUDE_FILE_PATH: "" },
      cwd: tmpDir,
    }).toString();

    assert.ok(output.includes("ONTOLOGY-DRIFT"));
    assert.ok(output.includes("new-skill"));
  });

  it("detects stale token estimate", () => {
    createSkill(tmpDir, "growing-skill", { version: '"1.0"', description: '"A skill"' });
    execFileSync("node", [path.join(PLUGIN_DIR, "install.js"), tmpDir]);

    // Make the skill much larger
    const skillPath = path.join(tmpDir, ".claude", "skills", "growing-skill", "SKILL.md");
    const bigContent = "---\nversion: 1.0\n---\n" + "x\n".repeat(500);
    fs.writeFileSync(skillPath, bigContent);

    const output = execFileSync("node", [path.join(tmpDir, ".claude", "hooks", "ontology_sync.js")], {
      env: { ...process.env, CLAUDE_FILE_PATH: ".claude/skills/growing-skill/SKILL.md" },
      cwd: tmpDir,
    }).toString();

    assert.ok(output.includes("ONTOLOGY-STALE"));
  });
});

describe("ontology_track_skill.js hook", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("hooks-track");
    // Clean any leftover session tracker
    const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
    try { fs.unlinkSync(tracker); } catch { /* ok */ }
  });

  afterEach(() => {
    cleanup(tmpDir);
    const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
    try { fs.unlinkSync(tracker); } catch { /* ok */ }
  });

  it("tracks skill invocation", () => {
    const hookPath = path.join(PLUGIN_DIR, "plugin", "hooks", "ontology_track_skill.js");
    execFileSync("node", [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "test-skill"}' },
    });

    const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
    assert.ok(fs.existsSync(tracker));
    const content = fs.readFileSync(tracker, "utf-8");
    assert.ok(content.includes("test-skill"));
  });

  it("outputs ONTOLOGY-TRACK after 2+ skills", () => {
    const hookPath = path.join(PLUGIN_DIR, "plugin", "hooks", "ontology_track_skill.js");

    // First call — no output expected
    execFileSync("node", [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "skill-a"}' },
      encoding: "utf-8",
    });

    // Verify tracker file was created by first call
    const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
    assert.ok(fs.existsSync(tracker), "Session tracker should exist after first call");

    // Second call — should output ONTOLOGY-TRACK
    const output = execFileSync("node", [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "skill-b"}' },
      encoding: "utf-8",
    });

    assert.ok(output.includes("ONTOLOGY-TRACK"), `Expected ONTOLOGY-TRACK in: ${output}`);
  });

  it("ignores empty tool input", () => {
    const hookPath = path.join(PLUGIN_DIR, "plugin", "hooks", "ontology_track_skill.js");
    // Should not throw
    execFileSync("node", [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: "" },
    });

    const tracker = path.join(os.tmpdir(), "claude-ontology-session.yaml");
    assert.ok(!fs.existsSync(tracker));
  });
});
