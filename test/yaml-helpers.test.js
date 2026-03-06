"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parseGraphEdges, extractRegistrySkills } = require("../hooks/yaml-helpers");

describe("parseGraphEdges", () => {
  it("extracts edge objects from graph.yaml content", () => {
    const content = [
      "edges:",
      "  - from: javascript",
      "    to: typescript",
      "    type: prerequisite",
      "    strength: 80",
      '    note: "JS knowledge transfers"',
      "  - from: react",
      "    to: nextjs",
      "    type: complementary",
      "    strength: 70",
      '    note: "React is foundation for Next"',
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 2);
    assert.deepStrictEqual(edges[0], {
      from: "javascript",
      to: "typescript",
      type: "prerequisite",
      strength: 80,
      note: "JS knowledge transfers",
    });
    assert.deepStrictEqual(edges[1], {
      from: "react",
      to: "nextjs",
      type: "complementary",
      strength: 70,
      note: "React is foundation for Next",
    });
  });

  it("defaults type to 'complementary' when missing", () => {
    const content = [
      "edges:",
      "  - from: css",
      "    to: tailwind",
      "    strength: 60",
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].type, "complementary");
  });

  it("defaults strength to 50 when missing", () => {
    const content = [
      "edges:",
      "  - from: python",
      "    to: django",
      "    type: prerequisite",
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].strength, 50);
  });

  it("defaults note to empty string when missing", () => {
    const content = [
      "edges:",
      "  - from: go",
      "    to: kubernetes",
      "    type: complementary",
      "    strength: 40",
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].note, "");
  });

  it("returns empty array for empty string", () => {
    const edges = parseGraphEdges("");
    assert.deepStrictEqual(edges, []);
  });

  it("returns empty array for content with no edges", () => {
    const content = [
      "# graph.yaml",
      "edges: []",
      "",
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.deepStrictEqual(edges, []);
  });

  it("returns array with one edge for single edge", () => {
    const content = [
      "edges:",
      "  - from: rust",
      "    to: wasm",
      "    type: evolves",
      "    strength: 65",
      '    note: "Rust compiles to WASM"',
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].from, "rust");
    assert.equal(edges[0].to, "wasm");
    assert.equal(edges[0].type, "evolves");
    assert.equal(edges[0].strength, 65);
    assert.equal(edges[0].note, "Rust compiles to WASM");
  });

  it("extracts note without quotes when quoted", () => {
    const content = [
      "edges:",
      "  - from: node",
      "    to: express",
      "    type: prerequisite",
      "    strength: 90",
      '    note: "Node runtime required"',
    ].join("\n");

    const edges = parseGraphEdges(content);
    assert.equal(edges[0].note, "Node runtime required");
  });
});

describe("extractRegistrySkills", () => {
  it("extracts sorted skill names from registry.yaml content", () => {
    const content = [
      "skills:",
      "  javascript:",
      "    domain: frontend",
      "  react:",
      "    domain: frontend",
      "  python:",
      "    domain: backend",
    ].join("\n");

    const skills = extractRegistrySkills(content);
    assert.deepStrictEqual(skills, ["javascript", "python", "react"]);
  });

  it("returns empty array for empty string", () => {
    const skills = extractRegistrySkills("");
    assert.deepStrictEqual(skills, []);
  });

  it("returns empty array for content with no skill entries", () => {
    const content = [
      "# registry.yaml",
      "skills: {}",
    ].join("\n");

    const skills = extractRegistrySkills(content);
    assert.deepStrictEqual(skills, []);
  });

  it("returns sorted array for unsorted skills", () => {
    const content = [
      "skills:",
      "  zsh:",
      "    domain: devops",
      "  ansible:",
      "    domain: devops",
      "  middleware:",
      "    domain: backend",
    ].join("\n");

    const skills = extractRegistrySkills(content);
    assert.deepStrictEqual(skills, ["ansible", "middleware", "zsh"]);
  });

  it("correctly matches skill names with hyphens and numbers", () => {
    const content = [
      "skills:",
      "  react-native:",
      "    domain: frontend",
      "  vue3:",
      "    domain: frontend",
      "  node-js:",
      "    domain: backend",
      "  es2024:",
      "    domain: frontend",
    ].join("\n");

    const skills = extractRegistrySkills(content);
    assert.deepStrictEqual(skills, ["es2024", "node-js", "react-native", "vue3"]);
  });
});
