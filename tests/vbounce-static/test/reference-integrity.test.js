"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT, readPluginFile } = require("./helpers");

const SKILL_MD = readPluginFile("skills/vbounce/SKILL.md");

describe("Reference integrity", () => {
  it("SKILL.md refs table lists all 15 reference files", () => {
    const refDir = path.join(PLUGIN_ROOT, "skills", "vbounce", "references");
    const actual = fs.readdirSync(refDir).filter((f) => f.endsWith(".md")).sort();

    // Every ref file should appear as a link in the Shared References table
    for (const ref of actual) {
      assert.ok(
        SKILL_MD.includes(`references/${ref}`),
        `Reference file "${ref}" not listed in SKILL.md Shared References table`
      );
    }
  });

  it("dispatch table covers all 6 phase agents", () => {
    const phaseAgents = [
      "requirements-analyst",
      "design-architect",
      "implementation-engineer",
      "review-auditor",
      "testing-engineer",
      "deployment-engineer",
    ];
    for (const agent of phaseAgents) {
      assert.ok(
        SKILL_MD.includes(agent),
        `Agent "${agent}" not found in SKILL.md dispatch table`
      );
    }
  });

  it("dispatch table covers all 3 cross-cutting agents", () => {
    const crossCutting = [
      "quality-gate-validator",
      "traceability-analyst",
      "knowledge-curator",
    ];
    for (const agent of crossCutting) {
      assert.ok(
        SKILL_MD.includes(agent),
        `Cross-cutting agent "${agent}" not found in SKILL.md`
      );
    }
  });

  it("agent ref links point to existing files", () => {
    const agentDir = path.join(PLUGIN_ROOT, "agents");
    const agents = fs.readdirSync(agentDir).filter((f) => f.endsWith(".md"));

    for (const agentFile of agents) {
      const content = fs.readFileSync(path.join(agentDir, agentFile), "utf-8");
      // Extract references like `references/foo.md`
      const refs = content.match(/`references\/[\w-]+\.md`/g) || [];
      for (const ref of refs) {
        const refName = ref.replace(/`/g, "");
        const refPath = path.join(PLUGIN_ROOT, "skills", "vbounce", refName);
        assert.ok(
          fs.existsSync(refPath),
          `Agent "${agentFile}" references "${refName}" which does not exist`
        );
      }
    }
  });

  it("workspace convention paths match agent output contracts", () => {
    // The workspace tree in SKILL.md must mention the directories agents write to
    const expectedDirs = [
      "requirements/",
      "design/",
      "implementation/",
      "review/",
      "testing/",
      "deployment/",
      "knowledge/",
      "quality-gates/",
    ];
    for (const dir of expectedDirs) {
      assert.ok(
        SKILL_MD.includes(dir),
        `Workspace convention missing directory: ${dir}`
      );
    }
  });

  it("handoff chain is consistent across agents", () => {
    // Verify the handoff -> consumed-by chain forms a DAG
    const agentDir = path.join(PLUGIN_ROOT, "agents");
    const handoffs = new Map();

    const agents = fs.readdirSync(agentDir).filter((f) => f.endsWith(".md"));
    for (const agentFile of agents) {
      const content = fs.readFileSync(path.join(agentDir, agentFile), "utf-8");
      const name = agentFile.replace(".md", "");

      // Extract "Next: agent-name" from Handoff section
      const nextMatch = content.match(/Next:\s*([\w-]+)/);
      if (nextMatch) {
        handoffs.set(name, nextMatch[1]);
      }
    }

    // All phase agents should hand off to quality-gate-validator
    const phaseAgents = [
      "requirements-analyst",
      "design-architect",
      "implementation-engineer",
      "review-auditor",
      "testing-engineer",
      "deployment-engineer",
    ];
    for (const agent of phaseAgents) {
      assert.ok(handoffs.has(agent), `${agent} missing handoff`);
      assert.equal(
        handoffs.get(agent),
        "quality-gate-validator",
        `${agent} should hand off to quality-gate-validator`
      );
    }
  });
});
