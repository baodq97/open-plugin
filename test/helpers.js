"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

/** Create a temp directory for test isolation */
function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `skills-ontology-test-${prefix}-`));
}

/** Create a minimal skill directory with frontmatter */
function createSkill(projectRoot, name, frontmatter, body) {
  const dir = path.join(projectRoot, ".claude", "skills", name);
  fs.mkdirSync(dir, { recursive: true });
  const fm = frontmatter
    ? `---\n${Object.entries(frontmatter).map(([k, v]) => `${k}: ${v}`).join("\n")}\n---\n`
    : "";
  fs.writeFileSync(path.join(dir, "SKILL.md"), fm + (body || `# ${name}\n\nA test skill.\n`));
}

/** Remove a directory recursively */
function cleanup(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch { /* best effort */ }
}

module.exports = { makeTempDir, createSkill, cleanup };
