"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");
const {
  buildRegistry,
  parseFrontmatter,
  suggestEdges,
  suggestChains,
  inferDomain,
  inferPhase,
  extractTriggers,
} = require("../src/build-registry");

describe("parseFrontmatter", () => {
  it("parses simple key-value pairs", () => {
    const result = parseFrontmatter('---\nname: hello\nversion: "1.0"\n---\n# body');
    assert.equal(result.name, "hello");
    assert.equal(result.version, "1.0");
  });

  it("parses inline arrays", () => {
    const result = parseFrontmatter("---\ntags: [a, b, c]\n---\n");
    assert.deepEqual(result.tags, ["a", "b", "c"]);
  });

  it("parses quoted values in arrays", () => {
    const result = parseFrontmatter('---\ntags: ["hello world", \'foo bar\']\n---\n');
    assert.deepEqual(result.tags, ["hello world", "foo bar"]);
  });

  it("parses booleans", () => {
    const result = parseFrontmatter("---\nenabled: true\ndisabled: false\n---\n");
    assert.equal(result.enabled, true);
    assert.equal(result.disabled, false);
  });

  it("parses numbers", () => {
    const result = parseFrontmatter("---\ncount: 42\nratio: 3.14\n---\n");
    assert.equal(result.count, 42);
    assert.equal(result.ratio, 3.14);
  });

  it("strips inline comments", () => {
    const result = parseFrontmatter("---\nname: hello # this is a comment\n---\n");
    assert.equal(result.name, "hello");
  });

  it("handles pipe multi-line", () => {
    const result = parseFrontmatter("---\ndescription: |\n  line one\n  line two\n---\n");
    assert.equal(result.description, "line one\nline two");
  });

  it("handles folded multi-line (>)", () => {
    const result = parseFrontmatter("---\ndescription: >\n  line one\n  line two\n---\n");
    assert.equal(result.description, "line one line two");
  });

  it("handles list items", () => {
    const result = parseFrontmatter("---\nitems:\n  - alpha\n  - beta\n  - gamma\n---\n");
    assert.deepEqual(result.items, ["alpha", "beta", "gamma"]);
  });

  it("returns empty object for no frontmatter", () => {
    assert.deepEqual(parseFrontmatter("# Just a heading\n"), {});
  });

  it("handles hyphenated keys", () => {
    const result = parseFrontmatter("---\nauto-trigger: true\n---\n");
    assert.equal(result["auto-trigger"], true);
  });
});

describe("inferDomain", () => {
  it("identifies sdlc skills", () => assert.equal(inferDomain("framework-planner"), "sdlc"));
  it("identifies frontend skills", () => assert.equal(inferDomain("frontend-design"), "frontend"));
  it("identifies devops skills", () => assert.equal(inferDomain("azdo-git"), "devops"));
  it("identifies aiquinta skills", () => assert.equal(inferDomain("aiquinta-agent-builder"), "aiquinta"));
  it("defaults to general", () => assert.equal(inferDomain("random-thing"), "general"));
});

describe("inferPhase", () => {
  it("identifies requirements", () => assert.equal(inferPhase("brainstorming"), "requirements"));
  it("identifies design", () => assert.equal(inferPhase("framework-planner"), "design"));
  it("identifies testing", () => assert.equal(inferPhase("test-driven-development"), "testing"));
  it("identifies deployment", () => assert.equal(inferPhase("azdo-git"), "deployment"));
});

describe("extractTriggers", () => {
  it("extracts trigger keywords", () => {
    const result = extractTriggers("Build things. Triggers: create, build, deploy");
    assert.ok(result.includes("create"));
    assert.ok(result.includes("build"));
  });

  it("returns empty for no triggers", () => {
    assert.equal(extractTriggers("Just a description"), "");
  });
});

describe("suggestEdges", () => {
  it("suggests prerequisite edges for sequential phases", () => {
    const entries = [
      { name: "s-req", domain: "sdlc", phase: "requirements" },
      { name: "s-design", domain: "sdlc", phase: "design" },
    ];
    const edges = suggestEdges(entries);
    assert.ok(edges.length > 0);
    const prereq = edges.find((e) => e.type === "prerequisite");
    assert.ok(prereq);
    assert.equal(prereq.from, "s-req");
    assert.equal(prereq.to, "s-design");
  });

  it("suggests complementary edges for same domain+phase", () => {
    const entries = [
      { name: "a", domain: "frontend", phase: "implementation" },
      { name: "b", domain: "frontend", phase: "implementation" },
    ];
    const edges = suggestEdges(entries);
    const comp = edges.find((e) => e.type === "complementary");
    assert.ok(comp);
  });

  it("returns empty for single entry", () => {
    assert.deepEqual(suggestEdges([{ name: "a", domain: "x", phase: "y" }]), []);
  });

  it("skips general domain", () => {
    const entries = [
      { name: "a", domain: "general", phase: "implementation" },
      { name: "b", domain: "general", phase: "testing" },
    ];
    assert.deepEqual(suggestEdges(entries), []);
  });
});

describe("suggestChains", () => {
  it("suggests chain for domain with 3+ skills across phases", () => {
    const entries = [
      { name: "a", domain: "sdlc", phase: "requirements" },
      { name: "b", domain: "sdlc", phase: "design" },
      { name: "c", domain: "sdlc", phase: "implementation" },
    ];
    const chains = suggestChains(entries, { a: 100, b: 200, c: 300 });
    assert.equal(chains.length, 1);
    assert.equal(chains[0].name, "sdlc-workflow");
    assert.equal(chains[0].estimated_tokens, 600);
  });

  it("returns empty for fewer than 3 skills", () => {
    const entries = [
      { name: "a", domain: "sdlc", phase: "requirements" },
      { name: "b", domain: "sdlc", phase: "design" },
    ];
    assert.deepEqual(suggestChains(entries, {}), []);
  });

  it("skips domains with only 1 phase", () => {
    const entries = [
      { name: "a", domain: "frontend", phase: "implementation" },
      { name: "b", domain: "frontend", phase: "implementation" },
      { name: "c", domain: "frontend", phase: "implementation" },
    ];
    assert.deepEqual(suggestChains(entries, {}), []);
  });
});

describe("buildRegistry", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("build");
  });

  afterEach(() => cleanup(tmpDir));

  it("generates registry.yaml from skills", () => {
    createSkill(tmpDir, "test-skill", { version: '"2.0"', description: '"A test skill"' });
    buildRegistry(tmpDir);

    const regPath = path.join(tmpDir, ".claude", "ontology", "registry.yaml");
    assert.ok(fs.existsSync(regPath));

    const content = fs.readFileSync(regPath, "utf-8");
    assert.ok(content.includes("test-skill:"));
    assert.ok(content.includes('version: "2.0"'));
  });

  it("creates graph.yaml and chains.yaml", () => {
    createSkill(tmpDir, "my-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);

    assert.ok(fs.existsSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml")));
    assert.ok(fs.existsSync(path.join(tmpDir, ".claude", "ontology", "chains.yaml")));
  });

  it("is idempotent for graph and chains", () => {
    createSkill(tmpDir, "my-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graphBefore = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    buildRegistry(tmpDir);
    const graphAfter = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");

    assert.equal(graphBefore, graphAfter);
  });

  it("returns 0 when no skills dir exists", () => {
    fs.mkdirSync(path.join(tmpDir, ".claude"), { recursive: true });
    assert.equal(buildRegistry(tmpDir), 0);
  });

  it("generates auto-suggested edges for multiple same-domain skills", () => {
    createSkill(tmpDir, "vbounce-requirements", { description: '"Requirements. Triggers: requirement"' });
    createSkill(tmpDir, "vbounce-design", { description: '"Design. Triggers: design"' });
    buildRegistry(tmpDir);

    const graph = fs.readFileSync(path.join(tmpDir, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("prerequisite") || graph.includes("complementary"));
  });
});
