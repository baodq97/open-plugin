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

/* ---------- helpers for hooks.json spec compliance ---------- */

function loadHooks() {
  const hooksPath = path.join(ROOT, "hooks", "hooks.json");
  return JSON.parse(fs.readFileSync(hooksPath, "utf-8"));
}

/** Iterate every individual hook entry across all event types and matcher groups. */
function forEachHookEntry(hooksData, fn) {
  const events = hooksData.hooks;
  for (const eventType of Object.keys(events)) {
    for (const group of events[eventType]) {
      for (const entry of group.hooks) {
        fn(entry, eventType, group.matcher);
      }
    }
  }
}

describe("hooks.json spec compliance", () => {
  it("has a top-level description field (SPEC-04)", () => {
    const data = loadHooks();
    assert.ok(
      typeof data.description === "string" && data.description.length > 0,
      "hooks.json must have a non-empty top-level 'description' field"
    );
  });

  it("every hook command path uses ${CLAUDE_PLUGIN_ROOT} (SPEC-03)", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.ok(
        entry.command.includes("${CLAUDE_PLUGIN_ROOT}"),
        `Hook command in ${eventType}/${matcher} must use \${CLAUDE_PLUGIN_ROOT}: got "${entry.command}"`
      );
    });
  });

  it("every hook entry has a timeout that is a positive number (SPEC-05)", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.ok(
        typeof entry.timeout === "number" && entry.timeout > 0,
        `Hook in ${eventType}/${matcher} must have a positive 'timeout' value`
      );
    });
  });

  it("every hook entry has a statusMessage with correct prefix and suffix (INFRA-03)", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.ok(
        typeof entry.statusMessage === "string",
        `Hook in ${eventType}/${matcher} must have a 'statusMessage' string`
      );
      assert.ok(
        entry.statusMessage.startsWith("Skills Ontology: "),
        `statusMessage in ${eventType}/${matcher} must start with "Skills Ontology: ": got "${entry.statusMessage}"`
      );
      assert.ok(
        entry.statusMessage.endsWith("..."),
        `statusMessage in ${eventType}/${matcher} must end with "...": got "${entry.statusMessage}"`
      );
    });
  });
});
