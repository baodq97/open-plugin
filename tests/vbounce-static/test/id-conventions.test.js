"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { PLUGIN_ROOT, readPluginFile } = require("./helpers");

const ID_CONVENTIONS = readPluginFile("skills/vbounce/references/id-conventions.md");

describe("ID conventions", () => {
  it("defines all required ID types", () => {
    const requiredTypes = [
      "CYCLE-",
      "BF-",
      "CR-",
      "US-",
      "AC-",
      "NFR-",
      "T-",
      "ITS-",
      "STS-",
      "SECTS-",
      "ADR-",
    ];
    for (const idType of requiredTypes) {
      assert.ok(
        ID_CONVENTIONS.includes(idType),
        `ID conventions must define "${idType}" type`
      );
    }
  });

  it("agent validation patterns match id-conventions", () => {
    // requirements-analyst must use US-XXX and AC-XXX patterns
    const reqAgent = readPluginFile("agents/requirements-analyst.md");
    assert.ok(reqAgent.includes("US-"), "requirements-analyst must reference US- IDs");
    assert.ok(reqAgent.includes("AC-"), "requirements-analyst must reference AC- IDs");
    assert.ok(reqAgent.includes("NFR-"), "requirements-analyst must reference NFR- IDs");
    assert.ok(reqAgent.includes("T-AC-"), "requirements-analyst must reference T-AC- test skeleton IDs");

    // design-architect must use ADR and ITS/STS/SECTS
    const designAgent = readPluginFile("agents/design-architect.md");
    assert.ok(designAgent.includes("ITS-"), "design-architect must reference ITS- specs");
    assert.ok(designAgent.includes("STS-"), "design-architect must reference STS- specs");
    assert.ok(designAgent.includes("SECTS-"), "design-architect must reference SECTS- specs");
    assert.ok(designAgent.includes("ADR"), "design-architect must reference ADRs");
  });

  it("expected-artifacts in output contracts use correct ID prefixes", () => {
    // requirements-analyst output validation patterns
    const reqAgent = readPluginFile("agents/requirements-analyst.md");
    assert.ok(
      reqAgent.includes("US-\\d") || reqAgent.includes("US-"),
      "requirements-analyst output must validate US- pattern"
    );
    assert.ok(
      reqAgent.includes("T-AC-"),
      "requirements-analyst output must validate T-AC- pattern"
    );

    // design-architect output validation patterns
    const designAgent = readPluginFile("agents/design-architect.md");
    assert.ok(
      designAgent.includes("ITS-*") || designAgent.includes("ITS-"),
      "design-architect output must validate ITS- pattern"
    );
  });

  it("QG criteria references match id-conventions prefixes", () => {
    const qgCriteria = readPluginFile("skills/vbounce/references/quality-criteria.md");

    // QG should reference the test spec prefixes
    assert.ok(qgCriteria.includes("ITS-"), "Quality criteria must reference ITS- specs");
    assert.ok(qgCriteria.includes("STS-"), "Quality criteria must reference STS- specs");
    assert.ok(qgCriteria.includes("SECTS-"), "Quality criteria must reference SECTS- specs");
  });

  it("cycle ID format is consistent across SKILL.md and commands", () => {
    const skillMd = readPluginFile("skills/vbounce/SKILL.md");

    // Feature cycle
    assert.ok(
      skillMd.includes("CYCLE-{PROJECT}"),
      "SKILL.md must define CYCLE-{PROJECT} format"
    );

    // Bugfix cycle
    const bugfixCmd = readPluginFile("commands/bugfix.md");
    assert.ok(
      bugfixCmd.includes("BF-{PROJECT}") || bugfixCmd.includes("BF-"),
      "bugfix command must use BF- cycle ID"
    );

    // CR cycle
    const crCmd = readPluginFile("commands/cr.md");
    assert.ok(
      crCmd.includes("CR-{PROJECT}") || crCmd.includes("CR-"),
      "cr command must use CR- cycle ID"
    );

    // Hotfix cycle
    const hotfixCmd = readPluginFile("commands/hotfix.md");
    assert.ok(
      hotfixCmd.includes("HF-{PROJECT}") || hotfixCmd.includes("HF-"),
      "hotfix command must use HF- cycle ID"
    );
  });
});
