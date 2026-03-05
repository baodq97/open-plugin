"use strict";

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { makeTempDir, cleanup } = require("./helpers");

const PLUGIN_DIR = path.resolve(__dirname, "..");
const node = process.execPath;

/**
 * Create a realistic skill with proper frontmatter and body content.
 */
function writeSkill(root, name, { version, description, body }) {
  const dir = path.join(root, ".claude", "skills", name);
  fs.mkdirSync(dir, { recursive: true });
  const content = [
    "---",
    `version: "${version || "1.0"}"`,
    `description: "${description || name}"`,
    "---",
    "",
    `# ${name}`,
    "",
    body || `Skill content for ${name}.`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "SKILL.md"), content);
}

describe("E2E: Full plugin lifecycle", () => {
  let project;

  beforeEach(() => {
    project = makeTempDir("e2e");
    // Clean shared temp state
    try { fs.unlinkSync(path.join(os.tmpdir(), "claude-ontology-session.yaml")); } catch {}
  });

  afterEach(() => {
    cleanup(project);
    try { fs.unlinkSync(path.join(os.tmpdir(), "claude-ontology-session.yaml")); } catch {}
  });

  it("Phase 1: Install into empty project → verify scaffolding", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);

    // All core files exist
    const expected = [
      ".claude/hooks/ontology_sync.js",
      ".claude/hooks/ontology_track_skill.js",
      ".claude/hooks/build_registry.js",
      ".claude/rules/skill-routing.md",
      ".claude/rules/ontology-lifecycle.md",
      ".claude/commands/ontology-build.md",
      ".claude/commands/ontology-stats.md",
      ".claude/commands/ontology-graph.md",
      ".claude/ontology/registry.yaml",
      ".claude/ontology/graph.yaml",
      ".claude/ontology/chains.yaml",
      ".claude/ontology/usage-log.yaml",
      ".claude/settings.local.json",
    ];
    for (const f of expected) {
      assert.ok(fs.existsSync(path.join(project, f)), `Missing: ${f}`);
    }

    // Settings has cross-platform hooks
    const settings = JSON.parse(fs.readFileSync(path.join(project, ".claude", "settings.local.json"), "utf-8"));
    assert.ok(settings.hooks.PostToolUse.length >= 2);
    for (const entry of settings.hooks.PostToolUse) {
      for (const h of entry.hooks) {
        assert.ok(h.command.startsWith("node -e"), `Not cross-platform: ${h.command}`);
      }
    }

    // Empty registry (no skills yet)
    const reg = fs.readFileSync(path.join(project, ".claude", "ontology", "registry.yaml"), "utf-8");
    assert.ok(reg.includes("skills: {}") || reg.includes("skills:"));
  });

  it("Phase 2: Add skills → build → verify registry + auto-suggested edges", () => {
    // Install
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);

    // Add 6 skills across 3 domains
    writeSkill(project, "brainstorming", {
      description: "Brainstorm ideas. Triggers: brainstorm, ideate",
      body: "Explore requirements before implementation.\n".repeat(10),
    });
    writeSkill(project, "framework-planner", {
      description: "Plan features. Triggers: plan, design",
      body: "Create detailed implementation plans.\n".repeat(15),
    });
    writeSkill(project, "framework-implement", {
      description: "Implement features. Triggers: implement, code",
      body: "Write production code from plans.\n".repeat(20),
    });
    writeSkill(project, "framework-testing", {
      description: "Test features. Triggers: test, pytest",
      body: "Generate comprehensive test suites.\n".repeat(12),
    });
    writeSkill(project, "frontend-design", {
      description: "Design UI components. Triggers: UI, component, design",
      body: "Create production-grade frontend interfaces.\n".repeat(18),
    });
    writeSkill(project, "azdo-git", {
      description: "Git operations for Azure DevOps. Triggers: git, deploy, branch",
      body: "Manage branches, tags, and deployments.\n".repeat(8),
    });

    // Rebuild registry
    const buildOut = execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project], {
      encoding: "utf-8",
    });
    assert.ok(buildOut.includes("6 skills indexed"));

    // Registry has all 6 skills
    const reg = fs.readFileSync(path.join(project, ".claude", "ontology", "registry.yaml"), "utf-8");
    for (const name of ["brainstorming", "framework-planner", "framework-implement", "framework-testing", "frontend-design", "azdo-git"]) {
      assert.ok(reg.includes(`  ${name}:`), `Missing from registry: ${name}`);
    }

    // Graph has auto-suggested edges (sdlc skills share domain)
    const graph = fs.readFileSync(path.join(project, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("edges:"));
    assert.ok(graph.includes("prerequisite") || graph.includes("complementary"));

    // Chains may have auto-suggested chain for sdlc domain (4 skills, 3+ phases)
    const chains = fs.readFileSync(path.join(project, ".claude", "ontology", "chains.yaml"), "utf-8");
    assert.ok(chains.includes("chains:"));
  });

  it("Phase 3: Validate → should pass with full ontology", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "skill-a", { description: "Test A" });
    writeSkill(project, "skill-b", { description: "Test B" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);
    // Add usage-log
    fs.writeFileSync(path.join(project, ".claude", "ontology", "usage-log.yaml"), "entries: []\n");

    const { validate } = require("../src/validate");
    const errors = validate(project);
    assert.equal(errors, 0);
  });

  it("Phase 4: Hook drift detection → detects new unregistered skill", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "registered", { description: "In registry" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    // Add new skill WITHOUT rebuilding
    writeSkill(project, "unregistered", { description: "Not in registry" });

    const output = execFileSync(node, [path.join(project, ".claude", "hooks", "ontology_sync.js")], {
      env: { ...process.env, CLAUDE_FILE_PATH: "" },
      encoding: "utf-8",
    });
    assert.ok(output.includes("ONTOLOGY-DRIFT"));
    assert.ok(output.includes("unregistered"));
  });

  it("Phase 5: Hook version detection → detects version mismatch", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "versioned-skill", { version: "1.0", description: "Test" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    // Update skill version without rebuilding registry
    writeSkill(project, "versioned-skill", { version: "2.0", description: "Test updated" });

    const output = execFileSync(node, [path.join(project, ".claude", "hooks", "ontology_sync.js")], {
      env: { ...process.env, CLAUDE_FILE_PATH: ".claude/skills/versioned-skill/SKILL.md" },
      encoding: "utf-8",
    });
    assert.ok(output.includes("ONTOLOGY-VERSION"));
    assert.ok(output.includes("1.0"));
    assert.ok(output.includes("2.0"));
  });

  it("Phase 6: Skill usage tracking → tracks 2+ skills, outputs ONTOLOGY-TRACK", () => {
    const hookPath = path.join(PLUGIN_DIR, "plugin", "hooks", "ontology_track_skill.js");

    // First skill — no track message
    const out1 = execFileSync(node, [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "brainstorming"}' },
      encoding: "utf-8",
    });
    assert.ok(!out1.includes("ONTOLOGY-TRACK"));

    // Second skill — should trigger tracking
    const out2 = execFileSync(node, [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "framework-planner"}' },
      encoding: "utf-8",
    });
    assert.ok(out2.includes("ONTOLOGY-TRACK"));
    assert.ok(out2.includes("brainstorming"));
    assert.ok(out2.includes("framework-planner"));

    // Third skill — still tracks
    const out3 = execFileSync(node, [hookPath], {
      env: { ...process.env, CLAUDE_TOOL_INPUT: '{"skill_name": "framework-implement"}' },
      encoding: "utf-8",
    });
    assert.ok(out3.includes("3 skills used"));
  });

  it("Phase 7: Strength adjustment → modifies graph edges from usage data", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "skill-x", { description: "X" });
    writeSkill(project, "skill-y", { description: "Y" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    // Write graph with an edge
    fs.writeFileSync(path.join(project, ".claude", "ontology", "graph.yaml"), [
      "edges:",
      "  - from: skill-x",
      "    to: skill-y",
      "    type: complementary",
      "    strength: 50",
      '    note: "test edge"',
      "",
    ].join("\n"));

    // Write 12 successful usage entries
    const entries = [];
    for (let i = 1; i <= 12; i++) {
      entries.push(
        `  - date: "2026-03-${String(i).padStart(2, "0")}"`,
        "    skills_used: [skill-x, skill-y]",
        "    outcome: success"
      );
    }
    fs.writeFileSync(
      path.join(project, ".claude", "ontology", "usage-log.yaml"),
      "entries:\n" + entries.join("\n") + "\n"
    );

    // Run adjustment
    const { adjustStrengths } = require("../src/adjust-strengths");
    const result = adjustStrengths(project);
    assert.equal(result.adjusted, 1);

    // Strength should have increased from 50 to 55
    const graph = fs.readFileSync(path.join(project, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("strength: 55"));
  });

  it("Phase 8: Graph visualization → all 4 formats produce valid output", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "brainstorming", { description: "Brainstorm. Triggers: ideate" });
    writeSkill(project, "framework-planner", { description: "Plan. Triggers: plan" });
    writeSkill(project, "framework-implement", { description: "Build. Triggers: implement" });
    writeSkill(project, "frontend-design", { description: "UI. Triggers: design" });
    writeSkill(project, "azdo-git", { description: "Git. Triggers: deploy" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    const { graphCommand } = require("../src/graph");

    // HTML
    const htmlPath = path.join(project, "graph.html");
    graphCommand(project, "html", { output: htmlPath, open: false });
    assert.ok(fs.existsSync(htmlPath));
    const html = fs.readFileSync(htmlPath, "utf-8");
    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("brainstorming"));
    assert.ok(html.includes("framework-planner"));
    assert.ok(html.includes("frontend-design"));
    assert.ok(html.includes("<svg"));
    assert.ok(html.includes("Force simulation")); // force sim comment or var

    // Mermaid
    const mermaid = graphCommand(project, "mermaid", { open: false });
    assert.ok(mermaid.startsWith("graph LR"));
    assert.ok(mermaid.includes("subgraph"));
    assert.ok(mermaid.includes("SDLC") || mermaid.includes("sdlc"));
    assert.ok(mermaid.includes("FRONTEND") || mermaid.includes("frontend"));
    assert.ok(mermaid.includes("DEVOPS") || mermaid.includes("devops"));

    // ASCII
    const ascii = graphCommand(project, "ascii", { open: false });
    assert.ok(ascii.includes("Skills Ontology Graph"));
    assert.ok(ascii.includes("5 skills"));
    assert.ok(ascii.includes("┌"));
    assert.ok(ascii.includes("SDLC"));

    // JSON
    const json = graphCommand(project, "json", { open: false });
    const data = JSON.parse(json);
    assert.equal(data.nodes.length, 5);
    assert.ok(data.edges.length >= 0);
    assert.ok(data.domains.length >= 3);
    assert.equal(data.stats.nodeCount, 5);
  });

  it("Phase 9: Uninstall → clean removal, skills preserved", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "keep-this", { description: "User skill" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    // Verify installed
    assert.ok(fs.existsSync(path.join(project, ".claude", "ontology", "registry.yaml")));

    // Uninstall
    execFileSync(node, [path.join(PLUGIN_DIR, "uninstall.js"), project]);

    // Ontology removed
    assert.ok(!fs.existsSync(path.join(project, ".claude", "ontology")));
    // Hooks removed
    assert.ok(!fs.existsSync(path.join(project, ".claude", "hooks", "ontology_sync.js")));
    assert.ok(!fs.existsSync(path.join(project, ".claude", "hooks", "build_registry.js")));
    // Rules removed
    assert.ok(!fs.existsSync(path.join(project, ".claude", "rules", "skill-routing.md")));
    // Commands removed
    assert.ok(!fs.existsSync(path.join(project, ".claude", "commands", "ontology-build.md")));
    assert.ok(!fs.existsSync(path.join(project, ".claude", "commands", "ontology-graph.md")));

    // Settings cleaned
    const settings = JSON.parse(fs.readFileSync(path.join(project, ".claude", "settings.local.json"), "utf-8"));
    assert.ok(!settings.hooks || Object.keys(settings.hooks).length === 0);

    // Skills preserved!
    assert.ok(fs.existsSync(path.join(project, ".claude", "skills", "keep-this", "SKILL.md")));
  });

  it("Phase 10: Reinstall → idempotent, no duplicates", () => {
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);
    writeSkill(project, "my-skill", { description: "Test" });
    execFileSync(node, [path.join(PLUGIN_DIR, "src", "build-registry.js"), project]);

    // Install again
    execFileSync(node, [path.join(PLUGIN_DIR, "install.js"), project]);

    // Settings not duplicated
    const settings = JSON.parse(fs.readFileSync(path.join(project, ".claude", "settings.local.json"), "utf-8"));
    assert.equal(settings.hooks.PostToolUse.length, 2);

    // Graph preserved (not overwritten)
    const graph = fs.readFileSync(path.join(project, ".claude", "ontology", "graph.yaml"), "utf-8");
    assert.ok(graph.includes("edges"));
  });
});
