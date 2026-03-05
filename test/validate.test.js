"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { makeTempDir, createSkill, cleanup } = require("./helpers");
const { buildRegistry } = require("../src/build-registry");
const { validate } = require("../src/validate");

describe("validate", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir("validate");
  });

  afterEach(() => cleanup(tmpDir));

  it("returns 0 for valid ontology", () => {
    createSkill(tmpDir, "my-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);

    // Create usage-log.yaml
    fs.writeFileSync(path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"), "entries: []\n");

    const errors = validate(tmpDir);
    assert.equal(errors, 0);
  });

  it("returns errors for missing files", () => {
    fs.mkdirSync(path.join(tmpDir, ".claude", "ontology"), { recursive: true });
    const errors = validate(tmpDir);
    assert.ok(errors > 0);
  });

  it("detects skills missing from registry", () => {
    createSkill(tmpDir, "registered-skill", { version: '"1.0"' });
    buildRegistry(tmpDir);

    // Add a new skill dir without rebuilding registry
    createSkill(tmpDir, "unregistered-skill", { version: '"1.0"' });

    fs.writeFileSync(path.join(tmpDir, ".claude", "ontology", "usage-log.yaml"), "entries: []\n");

    const errors = validate(tmpDir);
    assert.ok(errors > 0);
  });
});
