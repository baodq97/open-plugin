"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, cleanup } = require("./helpers");
const { adjustStrengths, parseUsageLog, parseGraphEdges } = require("../src/adjust-strengths");

describe("parseUsageLog", () => {
  it("parses entries from YAML", () => {
    const content = [
      "entries:",
      '  - date: "2026-03-01"',
      "    skills_used: [skill-a, skill-b]",
      "    outcome: success",
      '  - date: "2026-03-02"',
      "    skills_used: [skill-b, skill-c]",
      "    outcome: failed",
    ].join("\n");

    const entries = parseUsageLog(content);
    assert.equal(entries.length, 2);
    assert.deepEqual(entries[0].skills, ["skill-a", "skill-b"]);
    assert.equal(entries[0].outcome, "success");
    assert.equal(entries[1].outcome, "failed");
  });
});

describe("parseGraphEdges", () => {
  it("parses edges from YAML", () => {
    const content = [
      "edges:",
      "  - from: a",
      "    to: b",
      "    type: prerequisite",
      "    strength: 70",
      '    note: "test"',
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].from, "a");
    assert.equal(edges[0].strength, 70);
  });
});

describe("adjustStrengths", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("adjust");
    fs.mkdirSync(path.join(tmpDir, ".claude", "ontology"), { recursive: true });
  });

  afterEach(() => cleanup(tmpDir));

  it("skips with fewer than 10 entries", () => {
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      'entries:\n  - date: "2026-03-01"\n    skills_used: [a, b]\n    outcome: success\n'
    );
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      "edges: []\n"
    );

    const result = adjustStrengths(tmpDir);
    assert.equal(result.adjusted, 0);
    assert.equal(result.added, 0);
  });

  it("increases strength for successful pairs", () => {
    const logEntries = [];
    for (let i = 0; i < 12; i++) {
      logEntries.push(
        `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
        "    skills_used: [skill-a, skill-b]",
        "    outcome: success"
      );
    }
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + logEntries.join("\n") + "\n"
    );

    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      [
        "edges:",
        "  - from: skill-a",
        "    to: skill-b",
        "    type: prerequisite",
        "    strength: 60",
        '    note: "test"',
        "",
      ].join("\n")
    );

    const result = adjustStrengths(tmpDir);
    assert.equal(result.adjusted, 1);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("strength: 65"));
  });

  it("decreases strength for failed pairs", () => {
    const logEntries = [];
    for (let i = 0; i < 12; i++) {
      logEntries.push(
        `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
        "    skills_used: [skill-a, skill-b]",
        "    outcome: failed"
      );
    }
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + logEntries.join("\n") + "\n"
    );

    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      [
        "edges:",
        "  - from: skill-a",
        "    to: skill-b",
        "    type: prerequisite",
        "    strength: 60",
        '    note: "test"',
        "",
      ].join("\n")
    );

    const result = adjustStrengths(tmpDir);
    assert.equal(result.adjusted, 1);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("strength: 50"));
  });

  it("adds complementary edges for frequent pairs not in graph", () => {
    const logEntries = [];
    for (let i = 0; i < 12; i++) {
      logEntries.push(
        `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
        "    skills_used: [skill-x, skill-y]",
        "    outcome: success"
      );
    }
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + logEntries.join("\n") + "\n"
    );

    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      "edges: []\n"
    );

    const result = adjustStrengths(tmpDir);
    assert.equal(result.added, 1);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("skill-x"));
    assert.ok(graph.includes("complementary"));
  });

  it("caps strength at 100", () => {
    const logEntries = [];
    for (let i = 0; i < 12; i++) {
      logEntries.push(
        `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
        "    skills_used: [a, b]",
        "    outcome: success"
      );
    }
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + logEntries.join("\n") + "\n"
    );
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      "edges:\n  - from: a\n    to: b\n    type: prerequisite\n    strength: 98\n    note: \"test\"\n"
    );

    adjustStrengths(tmpDir);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("strength: 100"));
  });

  it("floors strength at 10", () => {
    const logEntries = [];
    for (let i = 0; i < 12; i++) {
      logEntries.push(
        `  - date: "2026-03-${String(i + 1).padStart(2, "0")}"`,
        "    skills_used: [a, b]",
        "    outcome: failed"
      );
    }
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + logEntries.join("\n") + "\n"
    );
    fs.writeFileSync(
      path.join(tmpDir, ".claude", "ontology", "graph.yaml"),
      "edges:\n  - from: a\n    to: b\n    type: prerequisite\n    strength: 15\n    note: \"test\"\n"
    );

    adjustStrengths(tmpDir);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("strength: 10"));
  });
});
