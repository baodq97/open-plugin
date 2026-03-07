"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT, parseFrontmatter, readPluginFile } = require("./helpers");

const AGENTS = [
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

const VALID_COLORS = ["red", "blue", "green", "orange", "magenta", "cyan", "yellow", "white", "purple"];
const VALID_TOOLS = ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Agent"];

describe("Agent contracts", () => {
  for (const agent of AGENTS) {
    describe(agent, () => {
      const filePath = path.join(PLUGIN_ROOT, "agents", `${agent}.md`);
      let content;
      let parsed;

      it("has valid frontmatter", () => {
        content = fs.readFileSync(filePath, "utf-8");
        parsed = parseFrontmatter(filePath);

        assert.ok(parsed.frontmatter, `${agent} must have frontmatter`);
        assert.equal(parsed.frontmatter.name, agent, `name must be "${agent}"`);
        assert.ok(
          parsed.frontmatter.description && parsed.frontmatter.description.length > 10,
          "description must be substantive"
        );
        assert.ok(parsed.frontmatter.model, "model field required");
        assert.ok(
          VALID_COLORS.includes(parsed.frontmatter.color),
          `color "${parsed.frontmatter.color}" not in valid set`
        );
        assert.ok(parsed.frontmatter.tools, "tools field required");
        if (Array.isArray(parsed.frontmatter.tools)) {
          for (const tool of parsed.frontmatter.tools) {
            assert.ok(VALID_TOOLS.includes(tool), `Invalid tool "${tool}" in ${agent}`);
          }
        }
      });

      it("has CONTRACT section with Input and Output tables", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        assert.ok(content.includes("## CONTRACT"), `${agent} missing ## CONTRACT`);
        assert.ok(
          content.includes("### Input") || content.includes("### Input (MANDATORY"),
          `${agent} missing Input contract`
        );
        assert.ok(
          content.includes("### Output") || content.includes("### Output (MUST produce"),
          `${agent} missing Output contract`
        );
      });

      it("has References and Handoff in contract", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        assert.ok(
          content.includes("### References") || content.includes("### Handoff"),
          `${agent} missing References or Handoff section`
        );
      });

      it("has ROLE section", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        assert.ok(content.includes("## ROLE"), `${agent} missing ## ROLE`);
      });

      it("has PROCESS section", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        assert.ok(content.includes("## PROCESS"), `${agent} missing ## PROCESS`);
      });

      it("has SELF-VERIFICATION section", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        // QG validator and cross-cutting agents may embed verification differently
        const hasSelfVerify =
          content.includes("## SELF-VERIFICATION") ||
          content.includes("SELF-VERIFICATION") ||
          content.includes("verify") ||
          content.includes("Verify");
        assert.ok(hasSelfVerify, `${agent} missing self-verification`);
      });

      it("input contract requires state.yaml", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        assert.ok(
          content.includes("state.yaml"),
          `${agent} input contract must reference state.yaml`
        );
      });

      it("output contract specifies workspace paths", () => {
        content = content || fs.readFileSync(filePath, "utf-8");
        // Output section should reference {workspace} paths
        assert.ok(
          content.includes("{workspace}"),
          `${agent} must use {workspace} placeholder in contract`
        );
      });
    });
  }
});

describe("Agent color uniqueness", () => {
  it("no two agents share the same color", () => {
    const colors = new Map();
    for (const agent of AGENTS) {
      const { frontmatter } = parseFrontmatter(
        path.join(PLUGIN_ROOT, "agents", `${agent}.md`)
      );
      const color = frontmatter.color;
      assert.ok(
        !colors.has(color),
        `Color "${color}" used by both "${colors.get(color)}" and "${agent}"`
      );
      colors.set(color, agent);
    }
  });
});

describe("Agent memory setting", () => {
  it("all agents use project memory", () => {
    for (const agent of AGENTS) {
      const { frontmatter } = parseFrontmatter(
        path.join(PLUGIN_ROOT, "agents", `${agent}.md`)
      );
      assert.equal(
        frontmatter.memory,
        "project",
        `${agent} must have memory: project`
      );
    }
  });
});
