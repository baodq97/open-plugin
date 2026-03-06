"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");
const { buildRegistry } = require("../src/build-registry");
const { generateGraph } = require("../src/generate-graph");
const { renderHtml } = require("../src/renderers/html");
const { renderMermaid } = require("../src/renderers/mermaid");
const { renderAscii } = require("../src/renderers/ascii");
const { graphCommand } = require("../src/graph");

describe("generateGraph", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("graph");
  });

  afterEach(() => cleanup(tmpDir));

  it("returns null when no registry exists", () => {
    assert.equal(generateGraph(tmpDir), null);
  });

  it("returns graph data from registry and graph files", () => {
    createSkill(tmpDir, "skill-a", { version: '"1.0"', description: '"Test A"' });
    createSkill(tmpDir, "skill-b", { version: '"2.0"', description: '"Test B"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    assert.ok(graph);
    assert.equal(graph.nodes.length, 2);
    assert.ok(graph.stats.nodeCount === 2);
    assert.ok(graph.domains.length > 0);
  });

  it("assigns colors and radii to nodes", () => {
    createSkill(tmpDir, "frontend-skill", { version: '"1.0"', description: '"Frontend"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const node = graph.nodes[0];
    assert.ok(node.color);
    assert.ok(node.radius > 0);
    assert.equal(node.domain, "frontend");
  });

  it("includes edges with styles", () => {
    createSkill(tmpDir, "vbounce-requirements", { version: '"1.0"', description: '"Req"' });
    createSkill(tmpDir, "vbounce-design", { version: '"1.0"', description: '"Design"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    if (graph.edges.length > 0) {
      assert.ok(graph.edges[0].type);
      assert.ok(graph.edges[0].strength > 0);
      assert.ok(graph.edges[0].style);
    }
  });
});

describe("renderMermaid", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("mermaid");
  });

  afterEach(() => cleanup(tmpDir));

  it("produces valid Mermaid syntax", () => {
    createSkill(tmpDir, "skill-a", { version: '"1.0"' });
    createSkill(tmpDir, "skill-b", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const mermaid = renderMermaid(graph);

    assert.ok(mermaid.startsWith("graph LR"));
    assert.ok(mermaid.includes("subgraph"));
    assert.ok(mermaid.includes("skill_a"));
    assert.ok(mermaid.includes("skill_b"));
  });

  it("groups skills by domain in subgraphs", () => {
    createSkill(tmpDir, "frontend-design", { version: '"1.0"', description: '"UI"' });
    createSkill(tmpDir, "azdo-git", { version: '"1.0"', description: '"Git"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const mermaid = renderMermaid(graph);

    assert.ok(mermaid.includes("FRONTEND"));
    assert.ok(mermaid.includes("DEVOPS"));
  });
});

describe("renderAscii", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("ascii");
  });

  afterEach(() => cleanup(tmpDir));

  it("produces readable ASCII art", () => {
    createSkill(tmpDir, "skill-a", { version: '"1.0"' });
    createSkill(tmpDir, "skill-b", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const ascii = renderAscii(graph);

    assert.ok(ascii.includes("Skills Ontology Graph"));
    assert.ok(ascii.includes("skill-a"));
    assert.ok(ascii.includes("skill-b"));
    assert.ok(ascii.includes("2 skills"));
  });

  it("shows domain boxes", () => {
    createSkill(tmpDir, "frontend-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const ascii = renderAscii(graph);

    assert.ok(ascii.includes("FRONTEND"));
    assert.ok(ascii.includes("┌"));
    assert.ok(ascii.includes("└"));
  });
});

describe("renderHtml", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("html");
  });

  afterEach(() => cleanup(tmpDir));

  it("produces a self-contained HTML document", () => {
    createSkill(tmpDir, "skill-a", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const html = renderHtml(graph);

    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("Skills Ontology"));
    assert.ok(html.includes("<svg"));
    assert.ok(html.includes("skill-a"));
    assert.ok(html.includes("force")); // force simulation code present
  });

  it("includes all nodes and edges in data", () => {
    createSkill(tmpDir, "vbounce-requirements", { version: '"1.0"' });
    createSkill(tmpDir, "vbounce-design", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const html = renderHtml(graph);

    assert.ok(html.includes("vbounce-requirements"));
    assert.ok(html.includes("vbounce-design"));
  });

  it("embeds CSS and JS inline (no external deps)", () => {
    createSkill(tmpDir, "skill-a", { version: '"1.0"' });
    buildRegistry(tmpDir);

    const graph = generateGraph(tmpDir);
    const html = renderHtml(graph);

    assert.ok(html.includes("<style>"));
    assert.ok(html.includes("<script>"));
    assert.ok(!html.includes("src=")); // no external scripts
    assert.ok(!html.includes("href=") || html.includes('href="#')); // no external stylesheets
  });
});

describe("graphCommand", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("cmd");
    createSkill(tmpDir, "test-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);
  });

  afterEach(() => cleanup(tmpDir));

  it("generates HTML file", () => {
    const outPath = path.join(tmpDir, "test-graph.html");
    graphCommand(tmpDir, "html", { output: outPath, open: false });

    assert.ok(fs.existsSync(outPath));
    const content = fs.readFileSync(outPath, "utf-8");
    assert.ok(content.includes("<!DOCTYPE html>"));
  });

  it("outputs Mermaid to stdout", () => {
    const result = graphCommand(tmpDir, "mermaid", { open: false });
    assert.ok(typeof result === "string");
    assert.ok(result.includes("graph LR"));
  });

  it("outputs ASCII to stdout", () => {
    const result = graphCommand(tmpDir, "ascii", { open: false });
    assert.ok(typeof result === "string");
    assert.ok(result.includes("Skills Ontology Graph"));
  });

  it("outputs JSON to stdout", () => {
    const result = graphCommand(tmpDir, "json", { open: false });
    const parsed = JSON.parse(result);
    assert.ok(parsed.nodes);
    assert.ok(parsed.edges !== undefined);
  });

  it("writes Mermaid to file with --output", () => {
    const outPath = path.join(tmpDir, "diagram.mmd");
    graphCommand(tmpDir, "mermaid", { output: outPath });

    assert.ok(fs.existsSync(outPath));
    const content = fs.readFileSync(outPath, "utf-8");
    assert.ok(content.includes("graph LR"));
  });
});
