"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT } = require("./helpers");

function loadHooks() {
  const hooksPath = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
  return JSON.parse(fs.readFileSync(hooksPath, "utf-8"));
}

const VALID_EVENT_TYPES = [
  "PreToolUse",
  "PostToolUse",
  "Stop",
  "SubagentStop",
  "SessionStart",
  "SessionEnd",
  "UserPromptSubmit",
  "PreCompact",
  "Notification",
];

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

describe("Hook validation", () => {
  it("has a top-level description field", () => {
    const data = loadHooks();
    assert.ok(
      typeof data.description === "string" && data.description.length > 0,
      "hooks.json must have a non-empty 'description'"
    );
  });

  it("uses only valid event types", () => {
    const data = loadHooks();
    for (const eventType of Object.keys(data.hooks)) {
      assert.ok(
        VALID_EVENT_TYPES.includes(eventType),
        `Invalid event type: "${eventType}"`
      );
    }
  });

  it("every event has an array of matcher groups", () => {
    const data = loadHooks();
    for (const [eventType, groups] of Object.entries(data.hooks)) {
      assert.ok(Array.isArray(groups), `${eventType} must be an array of groups`);
      for (const group of groups) {
        assert.ok(
          typeof group.matcher === "string" && group.matcher.length > 0,
          `Every group in ${eventType} must have a non-empty 'matcher'`
        );
        assert.ok(
          Array.isArray(group.hooks) && group.hooks.length > 0,
          `Every group in ${eventType} must have a non-empty 'hooks' array`
        );
      }
    }
  });

  it("every hook entry has type 'prompt'", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.equal(
        entry.type,
        "prompt",
        `Hook in ${eventType}/${matcher} must have type "prompt"`
      );
    });
  });

  it("every hook entry has a positive timeout", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.ok(
        typeof entry.timeout === "number" && entry.timeout > 0,
        `Hook in ${eventType}/${matcher} must have a positive timeout`
      );
    });
  });

  it("every hook prompt is non-empty", () => {
    const data = loadHooks();
    forEachHookEntry(data, (entry, eventType, matcher) => {
      assert.ok(
        typeof entry.prompt === "string" && entry.prompt.length > 20,
        `Hook in ${eventType}/${matcher} must have a substantive prompt`
      );
    });
  });

  it("PreToolUse hook validates workspace resolution", () => {
    const data = loadHooks();
    const preToolUse = data.hooks.PreToolUse;
    assert.ok(preToolUse, "Must have PreToolUse hooks");

    const agentGroup = preToolUse.find((g) => g.matcher === "Agent");
    assert.ok(agentGroup, "Must have a PreToolUse hook with matcher 'Agent'");

    const prompt = agentGroup.hooks[0].prompt;
    assert.ok(
      prompt.includes("workspace") || prompt.includes("{workspace}") || prompt.includes(".vbounce"),
      "PreToolUse Agent hook must validate workspace paths"
    );
  });

  it("SubagentStop hook validates output contracts", () => {
    const data = loadHooks();
    const subagentStop = data.hooks.SubagentStop;
    assert.ok(subagentStop, "Must have SubagentStop hooks");

    const agentGroup = subagentStop[0];
    assert.ok(agentGroup, "Must have at least one SubagentStop group");

    const prompt = agentGroup.hooks[0].prompt;
    assert.ok(
      prompt.includes("output") || prompt.includes("Output"),
      "SubagentStop hook must reference output validation"
    );
    assert.ok(
      prompt.includes("file") || prompt.includes("artifact"),
      "SubagentStop hook must check for file/artifact creation"
    );
  });
});
