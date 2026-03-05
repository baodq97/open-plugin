#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function loadManifest(pluginDir) {
  const root = pluginDir || path.resolve(__dirname, "..");
  const manifestPath = path.join(root, "plugin", "manifest.json");
  const raw = fs.readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(raw);

  if (!manifest || typeof manifest !== "object") {
    throw new Error("Invalid plugin manifest: expected object");
  }
  if (!manifest.id || typeof manifest.id !== "string") {
    throw new Error("Invalid plugin manifest: missing id");
  }
  if (!Array.isArray(manifest.copyFiles)) {
    throw new Error("Invalid plugin manifest: copyFiles must be an array");
  }
  if (!Array.isArray(manifest.settingsHooks)) {
    throw new Error("Invalid plugin manifest: settingsHooks must be an array");
  }

  return manifest;
}

module.exports = { loadManifest };
