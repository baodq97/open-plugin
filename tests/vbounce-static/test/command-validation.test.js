"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT, parseFrontmatter } = require("./helpers");

const COMMANDS = ["start", "status", "approve", "bugfix", "hotfix", "cr", "skip", "rollback"];
const VALID_TOOLS = ["Read", "Write", "Edit", "Bash", "Agent", "Grep", "Glob"];

describe("Command validation", () => {
  for (const cmd of COMMANDS) {
    describe(cmd, () => {
      const filePath = path.join(PLUGIN_ROOT, "commands", `${cmd}.md`);

      it("has valid frontmatter with description and allowed-tools", () => {
        const { frontmatter } = parseFrontmatter(filePath);
        assert.ok(frontmatter, `${cmd} must have frontmatter`);
        assert.ok(
          typeof frontmatter.description === "string" && frontmatter.description.length > 5,
          `${cmd} must have a substantive description`
        );
        assert.ok(frontmatter["allowed-tools"], `${cmd} must declare allowed-tools`);
      });

      it("allowed-tools are all valid tool names", () => {
        const { frontmatter } = parseFrontmatter(filePath);
        const tools = frontmatter["allowed-tools"];
        if (Array.isArray(tools)) {
          for (const tool of tools) {
            assert.ok(
              VALID_TOOLS.includes(tool),
              `${cmd} has invalid tool "${tool}"`
            );
          }
        }
      });

      it("has an Instructions section", () => {
        const content = fs.readFileSync(filePath, "utf-8");
        assert.ok(
          content.includes("## Instructions") || content.includes("## instructions"),
          `${cmd} must have ## Instructions section`
        );
      });
    });
  }

  describe("Command semantics", () => {
    it("start command creates workspace and dispatches agent", () => {
      const content = fs.readFileSync(
        path.join(PLUGIN_ROOT, "commands", "start.md"),
        "utf-8"
      );
      assert.ok(content.includes("mkdir") || content.includes("workspace"), "start must create workspace");
      assert.ok(content.includes("state.yaml"), "start must initialize state");
      assert.ok(
        content.includes("requirements") || content.includes("Requirements"),
        "start must begin requirements phase"
      );
    });

    it("approve command updates state and launches cross-cutting agents", () => {
      const content = fs.readFileSync(
        path.join(PLUGIN_ROOT, "commands", "approve.md"),
        "utf-8"
      );
      assert.ok(content.includes("approved"), "approve must set status to approved");
      assert.ok(content.includes("traceability"), "approve must launch traceability-analyst");
      assert.ok(content.includes("knowledge"), "approve must launch knowledge-curator");
    });

    it("skip command validates prerequisites before skipping", () => {
      const content = fs.readFileSync(
        path.join(PLUGIN_ROOT, "commands", "skip.md"),
        "utf-8"
      );
      assert.ok(
        content.includes("prerequisite") || content.includes("input file"),
        "skip must validate prerequisites"
      );
      assert.ok(
        content.includes("AFTER") || content.includes("after"),
        "skip must validate target is after current phase"
      );
    });

    it("rollback command resets downstream phase statuses", () => {
      const content = fs.readFileSync(
        path.join(PLUGIN_ROOT, "commands", "rollback.md"),
        "utf-8"
      );
      assert.ok(
        content.includes("BEFORE") || content.includes("before"),
        "rollback must validate target is before current phase"
      );
      assert.ok(
        content.includes("not_started") || content.includes("reset"),
        "rollback must reset phase statuses"
      );
    });
  });
});
