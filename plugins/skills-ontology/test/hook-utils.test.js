"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const path = require("path");

const HOOK_UTILS_PATH = path.resolve(__dirname, "..", "hooks", "hook-utils.js");

// ---------- readStdinJSON ----------

describe("readStdinJSON", () => {
  /**
   * Helper: spawn a child process that requires hook-utils and calls readStdinJSON(),
   * piping `stdinData` to its stdin. Returns the parsed JSON result.
   */
  function runReadStdin(stdinData) {
    const script = `
      const { readStdinJSON } = require(${JSON.stringify(HOOK_UTILS_PATH)});
      const result = readStdinJSON();
      process.stdout.write(JSON.stringify(result));
    `;
    const output = execFileSync(process.execPath, ["-e", script], {
      input: stdinData,
      encoding: "utf8",
      timeout: 5000,
    });
    return JSON.parse(output);
  }

  it("parses valid JSON piped to stdin", () => {
    const result = runReadStdin(JSON.stringify({ hook_event_name: "PostToolUse", tool_name: "Write" }));
    assert.equal(result.hook_event_name, "PostToolUse");
    assert.equal(result.tool_name, "Write");
  });

  it("returns {} when stdin is empty", () => {
    const result = runReadStdin("");
    assert.deepEqual(result, {});
  });

  it("returns {} when stdin contains malformed JSON", () => {
    const result = runReadStdin("{bad");
    assert.deepEqual(result, {});
  });

  it("preserves hook_event_name field from valid JSON", () => {
    const result = runReadStdin(JSON.stringify({ hook_event_name: "PreToolUse", session_id: "abc" }));
    assert.equal(result.hook_event_name, "PreToolUse");
    assert.equal(result.session_id, "abc");
  });
});

// ---------- buildOutput ----------

describe("buildOutput", () => {
  // Direct in-process tests — require the module
  function loadBuildOutput() {
    return require(HOOK_UTILS_PATH).buildOutput;
  }

  it("returns hookSpecificOutput with hookEventName from input", () => {
    const buildOutput = loadBuildOutput();
    const input = { hook_event_name: "PostToolUse" };
    const result = buildOutput(input);
    assert.deepEqual(result, {
      hookSpecificOutput: { hookEventName: "PostToolUse" },
    });
  });

  it("includes additionalContext in hookSpecificOutput", () => {
    const buildOutput = loadBuildOutput();
    const input = { hook_event_name: "PostToolUse" };
    const result = buildOutput(input, { additionalContext: "Registry is stale" });
    assert.equal(result.hookSpecificOutput.hookEventName, "PostToolUse");
    assert.equal(result.hookSpecificOutput.additionalContext, "Registry is stale");
  });

  it("uses hookEventName override from fields", () => {
    const buildOutput = loadBuildOutput();
    const input = { hook_event_name: "PostToolUse" };
    const result = buildOutput(input, { hookEventName: "PreToolUse" });
    assert.equal(result.hookSpecificOutput.hookEventName, "PreToolUse");
  });

  it("defaults hookEventName to PostToolUse when missing from both sources", () => {
    const buildOutput = loadBuildOutput();
    const input = {};
    const result = buildOutput(input);
    assert.equal(result.hookSpecificOutput.hookEventName, "PostToolUse");
  });

  it("copies extra fields (decision, reason) into hookSpecificOutput", () => {
    const buildOutput = loadBuildOutput();
    const input = { hook_event_name: "PostToolUse" };
    const result = buildOutput(input, { decision: "block", reason: "unsafe" });
    assert.equal(result.hookSpecificOutput.decision, "block");
    assert.equal(result.hookSpecificOutput.reason, "unsafe");
    assert.equal(result.hookSpecificOutput.hookEventName, "PostToolUse");
  });
});

// ---------- resolveProjectRoot ----------

describe("resolveProjectRoot", () => {
  function loadResolveProjectRoot() {
    return require(HOOK_UTILS_PATH).resolveProjectRoot;
  }

  it("returns CLAUDE_PROJECT_DIR when env var is set", () => {
    const resolveProjectRoot = loadResolveProjectRoot();
    const original = process.env.CLAUDE_PROJECT_DIR;
    try {
      process.env.CLAUDE_PROJECT_DIR = "/tmp/my-project";
      const result = resolveProjectRoot();
      assert.equal(result, path.resolve("/tmp/my-project"));
    } finally {
      if (original === undefined) {
        delete process.env.CLAUDE_PROJECT_DIR;
      } else {
        process.env.CLAUDE_PROJECT_DIR = original;
      }
    }
  });

  it("returns cwd when CLAUDE_PROJECT_DIR is not set", () => {
    const resolveProjectRoot = loadResolveProjectRoot();
    const original = process.env.CLAUDE_PROJECT_DIR;
    try {
      delete process.env.CLAUDE_PROJECT_DIR;
      const result = resolveProjectRoot();
      assert.equal(result, path.resolve(process.cwd()));
    } finally {
      if (original !== undefined) {
        process.env.CLAUDE_PROJECT_DIR = original;
      }
    }
  });
});
