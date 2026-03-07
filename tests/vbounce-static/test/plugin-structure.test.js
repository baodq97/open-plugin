"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT, REPO_ROOT, readPluginFile } = require("./helpers");

describe("Plugin structure", () => {
  it("has a valid plugin manifest", () => {
    const manifestPath = path.join(PLUGIN_ROOT, ".claude-plugin", "plugin.json");
    assert.ok(fs.existsSync(manifestPath), "Missing .claude-plugin/plugin.json");

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    assert.equal(manifest.name, "vbounce");
    assert.equal(manifest.version, "4.0.0");
    assert.ok(manifest.description.length > 0, "Description must be non-empty");
    assert.ok(manifest.license, "License field required");
  });

  it("has SKILL.md orchestrator", () => {
    const skillPath = path.join(PLUGIN_ROOT, "skills", "vbounce", "SKILL.md");
    assert.ok(fs.existsSync(skillPath), "Missing skills/vbounce/SKILL.md");

    const content = fs.readFileSync(skillPath, "utf-8");
    assert.ok(content.includes("---"), "SKILL.md must have frontmatter");
    assert.ok(content.includes("name: vbounce"), "SKILL.md frontmatter must declare name");
    assert.ok(content.includes("Agent Dispatch Table"), "SKILL.md must contain dispatch table");
    assert.ok(content.includes("State Management"), "SKILL.md must contain state management");
  });

  it("has all 9 agents", () => {
    const expected = [
      "requirements-analyst",
      "design-architect",
      "implementation-engineer",
      "review-auditor",
      "testing-engineer",
      "deployment-engineer",
      "quality-gate-validator",
      "traceability-analyst",
      "knowledge-curator",
    ];
    for (const agent of expected) {
      const agentPath = path.join(PLUGIN_ROOT, "agents", `${agent}.md`);
      assert.ok(fs.existsSync(agentPath), `Missing agent: agents/${agent}.md`);
    }
    // Verify no extra agents
    const actual = fs.readdirSync(path.join(PLUGIN_ROOT, "agents"))
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", ""))
      .sort();
    assert.deepEqual(actual, [...expected].sort(), "Unexpected extra agents found");
  });

  it("has all 8 commands", () => {
    const expected = ["start", "status", "approve", "bugfix", "hotfix", "cr", "skip", "rollback"];
    for (const cmd of expected) {
      const cmdPath = path.join(PLUGIN_ROOT, "commands", `${cmd}.md`);
      assert.ok(fs.existsSync(cmdPath), `Missing command: commands/${cmd}.md`);
    }
  });

  it("has hooks.json", () => {
    const hooksPath = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
    assert.ok(fs.existsSync(hooksPath), "Missing hooks/hooks.json");

    const data = JSON.parse(fs.readFileSync(hooksPath, "utf-8"));
    assert.ok(data.hooks, "hooks.json must have a 'hooks' object");
    assert.ok(data.description, "hooks.json must have a 'description' field");
  });

  it("has all 15 reference files", () => {
    const expected = [
      "phase-anatomy.md",
      "id-conventions.md",
      "approval-matrix.md",
      "quality-criteria.md",
      "acceptance-criteria.md",
      "ambiguity-checklist.md",
      "user-story-patterns.md",
      "architecture-patterns.md",
      "coding-standards.md",
      "hallucination-patterns.md",
      "edge-cases.md",
      "workflows-bugfix-track.md",
      "workflows-hotfix-track.md",
      "workflows-change-request-track.md",
      "workflows-by-role.md",
    ];
    const refDir = path.join(PLUGIN_ROOT, "skills", "vbounce", "references");
    for (const ref of expected) {
      assert.ok(fs.existsSync(path.join(refDir, ref)), `Missing reference: references/${ref}`);
    }
    // Verify count matches
    const actual = fs.readdirSync(refDir).filter((f) => f.endsWith(".md"));
    assert.equal(actual.length, 15, `Expected 15 references, found ${actual.length}`);
  });

  it("has both utility scripts", () => {
    const scripts = ["verify_packages.sh", "trace-matrix.py"];
    for (const script of scripts) {
      const scriptPath = path.join(PLUGIN_ROOT, "scripts", script);
      assert.ok(fs.existsSync(scriptPath), `Missing script: scripts/${script}`);
    }
  });

  it("is registered in marketplace.json", () => {
    const marketplacePath = path.join(REPO_ROOT, ".claude-plugin", "marketplace.json");
    assert.ok(fs.existsSync(marketplacePath), "Missing .claude-plugin/marketplace.json");

    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf-8"));
    const vbounce = marketplace.plugins.find((p) => p.name === "vbounce");
    assert.ok(vbounce, "vbounce not found in marketplace plugins");
    assert.equal(vbounce.source, "./plugins/vbounce");
    assert.equal(vbounce.version, "4.0.0");
    assert.equal(vbounce.category, "development");
  });
});
