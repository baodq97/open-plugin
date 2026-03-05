"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

describe("Claude plugin standard structure", () => {
  it("has official plugin manifest", () => {
    const manifestPath = path.join(ROOT, ".claude-plugin", "plugin.json");
    assert.ok(fs.existsSync(manifestPath), "Missing .claude-plugin/plugin.json");

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    assert.equal(manifest.name, "skills-ontology");
    assert.ok(typeof manifest.version === "string" && manifest.version.length > 0);
    assert.ok(typeof manifest.description === "string" && manifest.description.length > 0);
  });

  it("has root-level commands and hooks directories", () => {
    for (const rel of [
      "commands/ontology-build.md",
      "commands/ontology-stats.md",
      "commands/ontology-graph.md",
      "hooks/hooks.json",
      "hooks/ontology_sync.js",
      "hooks/ontology_track_skill.js",
      "rules/skill-routing.md",
      "rules/ontology-lifecycle.md",
    ]) {
      assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing ${rel}`);
    }
  });
});
