#!/usr/bin/env node
"use strict";

/**
 * generate-dashboard.js — Generate review.html dashboard from benchmark-full.json.
 *
 * Usage: node generate-dashboard.js <iteration-dir>
 * Example: node generate-dashboard.js workspace/run-20260307-174641/iteration-1
 *
 * Reads: benchmark-full.json (or benchmark.json as fallback)
 * Writes: review.html
 */

const fs = require("fs");
const path = require("path");

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function complianceColor(status) {
  const map = { FULL: "#788c5d", PARTIAL: "#d4a843", MINIMAL: "#d97757", NONE: "#c44", NOT_TESTED: "#b0aea5", NOT_RUN: "#b0aea5" };
  return map[status] || "#b0aea5";
}

function scoreColor(score) {
  if (score >= 90) return "#788c5d";
  if (score >= 75) return "#8fad6a";
  if (score >= 50) return "#d4a843";
  return "#c44";
}

function generateHTML(data) {
  const meta = data.meta || {};
  const d1 = data.d1_structural || { score: 0 };
  const d2 = data.d2_functional || { score: 0 };
  const d3 = data.d3_process || { score: 0, phase_compliance: {} };
  const d4 = data.d4_efficiency || { score: 0, per_eval: {}, aggregate: {} };
  const verdict = data.verdict || { overall_score: 0, verdict: "N/A" };

  const phases = ["requirements", "design", "implementation", "review", "testing", "deployment"];
  const phaseCompliance = d3.phase_compliance || {};

  // Build efficiency table rows
  let efficiencyRows = "";
  for (const [evalId, metrics] of Object.entries(d4.per_eval || {})) {
    const ws = metrics.with_skill || {};
    const wo = metrics.without_skill || {};
    const delta = metrics.delta || {};
    efficiencyRows += `
      <tr>
        <td>Eval #${escapeHtml(evalId)}</td>
        <td>${(ws.pass_rate * 100).toFixed(0)}%</td>
        <td>${ws.tokens?.toLocaleString() || "-"}</td>
        <td>${ws.quality_per_1k_tokens?.toFixed(4) || "-"}</td>
        <td>${(wo.pass_rate * 100).toFixed(0)}%</td>
        <td>${wo.tokens?.toLocaleString() || "-"}</td>
        <td style="color: ${(delta.quality_uplift_pct || 0) > 0 ? "#788c5d" : "#c44"}">${delta.quality_uplift_pct ? "+" + delta.quality_uplift_pct + "%" : "-"}</td>
        <td>${delta.token_overhead_pct ? "+" + delta.token_overhead_pct + "%" : "-"}</td>
      </tr>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>V-Bounce Benchmark Dashboard</title>
  <style>
    :root {
      --bg: #faf9f5; --surface: #ffffff; --border: #e8e6dc;
      --text: #141413; --text-muted: #b0aea5;
      --accent: #d97757; --green: #788c5d; --red: #c44;
      --header-bg: #141413; --header-text: #faf9f5;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); }
    .header { background: var(--header-bg); color: var(--header-text); padding: 1.5rem 2rem; }
    .header h1 { font-size: 1.5rem; font-weight: 700; }
    .header .meta { font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem; }
    .main { max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; }

    /* Summary Cards */
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
    .card .score { font-size: 2.5rem; font-weight: 700; line-height: 1; }
    .card .label { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .card .sublabel { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; }

    /* Verdict */
    .verdict-card { grid-column: 1 / -1; border-width: 2px; }
    .verdict-card .score { font-size: 1.5rem; }

    /* Sections */
    .section { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .section h2 { font-size: 1.1rem; margin-bottom: 1rem; }

    /* Heatmap */
    .heatmap { display: grid; grid-template-columns: 140px repeat(6, 1fr); gap: 2px; }
    .heatmap .cell { padding: 0.5rem 0.25rem; text-align: center; font-size: 0.75rem; border-radius: 4px; }
    .heatmap .header-cell { font-weight: 600; background: #f5f4f0; }
    .heatmap .phase-label { text-align: left; font-weight: 500; padding-left: 0.5rem; }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    th, td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
    th { background: #f5f4f0; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; }

    /* Bar chart */
    .bar-container { display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0; }
    .bar-label { width: 120px; font-size: 0.8rem; text-align: right; }
    .bar-track { flex: 1; height: 24px; background: #f0efe8; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 0.5rem; font-size: 0.7rem; color: white; font-weight: 600; }
    .bar-value { width: 50px; font-size: 0.8rem; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h1>V-Bounce Quality Benchmark Dashboard</h1>
    <div class="meta">Iteration ${escapeHtml(meta.iteration || "?")} | ${escapeHtml(meta.timestamp?.split("T")[0] || "N/A")} | Evals: ${escapeHtml((meta.evals_found || []).join(", ") || "none")}</div>
  </div>
  <div class="main">

    <!-- Summary Cards -->
    <div class="cards">
      <div class="card verdict-card" style="border-color: ${scoreColor(verdict.overall_score)}">
        <div class="score" style="color: ${scoreColor(verdict.overall_score)}">${verdict.overall_score}% ${escapeHtml(verdict.verdict)}</div>
        <div class="label">Overall Verdict</div>
      </div>
      <div class="card">
        <div class="score" style="color: ${scoreColor(d1.score)}">${d1.score}%</div>
        <div class="label">D1: Structural</div>
        <div class="sublabel">${d1.passed || 0}/${d1.total || 0} checks</div>
      </div>
      <div class="card">
        <div class="score" style="color: ${scoreColor(d2.score)}">${d2.score}%</div>
        <div class="label">D2: Functional</div>
        <div class="sublabel">${d2.passed || 0}/${d2.total || 0} assertions</div>
      </div>
      <div class="card">
        <div class="score" style="color: ${scoreColor(d3.score)}">${d3.score}%</div>
        <div class="label">D3: Process</div>
        <div class="sublabel">QG: ${d3.agent_separation?.separate_qg_phases || 0}/${d3.agent_separation?.total_phases || 0} | KC: ${d3.knowledge_capture?.phases_captured || 0}/${d3.knowledge_capture?.total_phases || 0}</div>
      </div>
      <div class="card">
        <div class="score" style="color: ${scoreColor(d4.score)}">${d4.score}%</div>
        <div class="label">D4: Efficiency</div>
        <div class="sublabel">Uplift: ${d4.aggregate?.quality_uplift_pct || 0}% | Overhead: ${d4.aggregate?.token_overhead_pct || 0}%</div>
      </div>
    </div>

    <!-- Phase Compliance Heatmap -->
    <div class="section">
      <h2>Phase Compliance Heatmap</h2>
      <div class="heatmap">
        <div class="cell header-cell">Phase</div>
        ${phases.map((p) => `<div class="cell header-cell">${p.charAt(0).toUpperCase() + p.slice(1)}</div>`).join("\n        ")}

        <div class="cell phase-label">Anatomy</div>
        ${phases.map((p) => {
          const status = phaseCompliance[p] || "NOT_TESTED";
          return `<div class="cell" style="background: ${complianceColor(status)}22; color: ${complianceColor(status)}; font-weight: 600">${status}</div>`;
        }).join("\n        ")}
      </div>
    </div>

    <!-- D1-D3 Score Bars -->
    <div class="section">
      <h2>Dimension Scores</h2>
      ${[
        { label: "D1 Structural", score: d1.score },
        { label: "D2 Functional", score: d2.score },
        { label: "D3 Process", score: d3.score },
        { label: "D4 Efficiency", score: d4.score },
      ].map((d) => `
      <div class="bar-container">
        <div class="bar-label">${d.label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${d.score}%; background: ${scoreColor(d.score)}">${d.score > 15 ? d.score + "%" : ""}</div>
        </div>
        <div class="bar-value" style="color: ${scoreColor(d.score)}">${d.score}%</div>
      </div>`).join("")}
    </div>

    <!-- Efficiency Comparison Table -->
    <div class="section">
      <h2>With/Without Skill Comparison (D4)</h2>
      <table>
        <thead>
          <tr>
            <th>Eval</th>
            <th colspan="3">With Skill</th>
            <th colspan="2">Without Skill</th>
            <th colspan="2">Delta</th>
          </tr>
          <tr>
            <th></th>
            <th>Pass Rate</th><th>Tokens</th><th>Q/1K tok</th>
            <th>Pass Rate</th><th>Tokens</th>
            <th>Quality +</th><th>Token +</th>
          </tr>
        </thead>
        <tbody>
          ${efficiencyRows || '<tr><td colspan="8" style="text-align: center; color: var(--text-muted)">No eval results found. Run functional evals first.</td></tr>'}
        </tbody>
      </table>
    </div>

  </div>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: node generate-dashboard.js <iteration-dir>");
    console.error("Example: node generate-dashboard.js workspace/run-20260307-174641/iteration-1");
    process.exit(1);
  }

  const iterDir = path.resolve(args[0]);

  // Try benchmark-full.json first, then benchmark.json
  let data = loadJSON(path.join(iterDir, "benchmark-full.json"));
  if (!data) {
    const basic = loadJSON(path.join(iterDir, "benchmark.json"));
    if (basic) {
      // Wrap basic benchmark into full format
      data = {
        meta: { iteration: basic.iteration, timestamp: basic.timestamp, evals_found: [2] },
        d1_structural: { score: Math.round((basic.configurations?.[0]?.results?.pass_rate || 0) * 100) },
        d2_functional: { score: Math.round((basic.configurations?.[0]?.results?.pass_rate || 0) * 100) },
        d3_process: { score: 0, phase_compliance: {} },
        d4_efficiency: {
          score: 0,
          per_eval: {
            2: {
              with_skill: basic.configurations?.[0]?.results ? {
                pass_rate: basic.configurations[0].results.pass_rate,
                tokens: basic.configurations[0].results.total_tokens,
                quality_per_1k_tokens: 0,
              } : undefined,
              without_skill: basic.configurations?.[1]?.results ? {
                pass_rate: basic.configurations[1].results.pass_rate,
                tokens: basic.configurations[1].results.total_tokens,
                quality_per_1k_tokens: 0,
              } : undefined,
              delta: basic.delta ? {
                quality_uplift_pct: parseFloat(basic.delta.pass_rate) || 0,
                token_overhead_pct: parseFloat(basic.delta.tokens) || 0,
              } : undefined,
            },
          },
          aggregate: {},
        },
        verdict: { overall_score: 0, verdict: "PARTIAL_DATA" },
      };
    }
  }

  if (!data) {
    console.error(`No benchmark data found in ${iterDir}`);
    process.exit(1);
  }

  const html = generateHTML(data);
  const outPath = path.join(iterDir, "review.html");
  fs.writeFileSync(outPath, html);
  console.log(`Dashboard written to: ${outPath}`);
}

main();
