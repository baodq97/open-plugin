#!/usr/bin/env node
"use strict";

/**
 * compute-metrics.js — Compute D1-D4 benchmark scores from eval results.
 *
 * Usage: node compute-metrics.js <workspace-dir> <iteration>
 * Example: node compute-metrics.js workspace/run-20260307-174641 1
 *
 * Reads: benchmark.json, grading.json, timing.json from the iteration directory.
 * Writes: benchmark-full.json with D1-D4 scores added.
 */

const fs = require("fs");
const path = require("path");

const PHASES = ["requirements", "design", "implementation", "review", "testing", "deployment"];
const PHASE_EVAL_MAP = {
  requirements: 2,
  design: 5,
  implementation: 6,
  review: 7,
  testing: 8,
  deployment: 9,
};

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function loadAssertions() {
  const assertionsPath = path.resolve(__dirname, "..", "references", "phase-assertions.json");
  return loadJSON(assertionsPath);
}

/**
 * Scan iteration directory for eval result directories and load their grading/timing files.
 */
function loadEvalResults(iterDir) {
  const results = {};
  if (!fs.existsSync(iterDir)) return results;

  const entries = fs.readdirSync(iterDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("eval-")) continue;

    const evalId = parseInt(entry.name.match(/eval-(\d+)/)?.[1], 10);
    if (isNaN(evalId)) continue;

    const evalDir = path.join(iterDir, entry.name);
    results[evalId] = {};

    for (const config of ["with_skill", "without_skill"]) {
      const configDir = path.join(evalDir, config);
      if (!fs.existsSync(configDir)) continue;

      results[evalId][config] = {
        grading: loadJSON(path.join(configDir, "grading.json")),
        timing: loadJSON(path.join(configDir, "timing.json")),
      };
    }
  }
  return results;
}

/**
 * D1: Structural Quality — pass rate of d1_structure assertions across all evals.
 */
function computeD1(evalResults, assertionDefs) {
  let passed = 0;
  let total = 0;

  for (const [evalId, configs] of Object.entries(evalResults)) {
    const defs = assertionDefs.evals[evalId];
    if (!defs) continue;

    const structAssertions = defs.assertions.filter((a) => a.category === "d1_structure");
    if (structAssertions.length === 0) continue;

    const grading = configs.with_skill?.grading;
    if (!grading?.expectations) continue;

    for (const sa of structAssertions) {
      total++;
      const match = grading.expectations.find(
        (e) => e.text.toLowerCase().includes(sa.id.replace(/_/g, " ")) || e.text.toLowerCase().includes(sa.description.toLowerCase().slice(0, 30))
      );
      if (match?.passed) passed++;
      // Also check per_assertion from benchmark if grading expectations don't match
      if (!match) {
        const benchmark = configs.with_skill?.grading;
        if (benchmark?.pass_rate === 1.0) passed++;
      }
    }
  }

  return {
    score: total > 0 ? Math.round((passed / total) * 100) : 0,
    passed,
    total,
    label: "Structural Quality",
    description: "Plugin structure, ID formats, file existence",
  };
}

/**
 * D2: Functional Effectiveness — pass rate of d2_functional assertions.
 */
function computeD2(evalResults, assertionDefs) {
  let passed = 0;
  let total = 0;

  for (const [evalId, configs] of Object.entries(evalResults)) {
    const defs = assertionDefs.evals[evalId];
    if (!defs) continue;

    const funcAssertions = defs.assertions.filter((a) => a.category === "d2_functional");
    const grading = configs.with_skill?.grading;
    if (!grading) continue;

    for (const fa of funcAssertions) {
      total++;
      // Use pass_rate as proxy if detailed expectations unavailable
      if (grading.pass_rate === 1.0) {
        passed++;
      } else if (grading.expectations) {
        const match = grading.expectations.find(
          (e) => e.passed && (e.text.toLowerCase().includes(fa.id.replace(/_/g, " ")) || e.text.toLowerCase().includes(fa.description.toLowerCase().slice(0, 25)))
        );
        if (match) passed++;
      }
    }
  }

  return {
    score: total > 0 ? Math.round((passed / total) * 100) : 0,
    passed,
    total,
    label: "Functional Effectiveness",
    description: "Content quality, correctness, completeness",
  };
}

/**
 * D3: Process Compliance — anatomy step adherence per phase.
 */
function computeD3(evalResults, assertionDefs) {
  const phaseCompliance = {};
  let separateQGCount = 0;
  let totalPhases = 0;
  let kcCount = 0;

  for (const phase of PHASES) {
    const evalId = PHASE_EVAL_MAP[phase];
    const defs = assertionDefs.evals[evalId];
    if (!defs) {
      phaseCompliance[phase] = "NOT_TESTED";
      continue;
    }

    const configs = evalResults[evalId];
    if (!configs?.with_skill?.grading) {
      phaseCompliance[phase] = "NOT_RUN";
      continue;
    }

    totalPhases++;
    const grading = configs.with_skill.grading;
    const processAssertions = defs.assertions.filter((a) => a.category === "d3_process");
    let processPassed = 0;

    for (const pa of processAssertions) {
      if (grading.pass_rate === 1.0) {
        processPassed++;
      } else if (grading.expectations) {
        const match = grading.expectations.find((e) => e.passed);
        if (match) processPassed++;
      }
    }

    const ratio = processAssertions.length > 0 ? processPassed / processAssertions.length : 0;
    if (ratio >= 1.0) phaseCompliance[phase] = "FULL";
    else if (ratio >= 0.66) phaseCompliance[phase] = "PARTIAL";
    else if (ratio > 0) phaseCompliance[phase] = "MINIMAL";
    else phaseCompliance[phase] = "NONE";

    // Check specific process indicators
    const hasQG = processAssertions.some((a) => a.id.includes("qg"));
    const hasKC = processAssertions.some((a) => a.id.includes("knowledge"));
    if (hasQG && grading.pass_rate >= 0.8) separateQGCount++;
    if (hasKC && grading.pass_rate >= 0.8) kcCount++;
  }

  const fullCount = Object.values(phaseCompliance).filter((v) => v === "FULL").length;
  const score = totalPhases > 0 ? Math.round((fullCount / totalPhases) * 100) : 0;

  return {
    score,
    label: "Process Compliance",
    description: "6-Activity Anatomy adherence per phase",
    phase_compliance: phaseCompliance,
    agent_separation: {
      separate_qg_phases: separateQGCount,
      total_phases: totalPhases,
    },
    knowledge_capture: {
      phases_captured: kcCount,
      total_phases: totalPhases,
    },
  };
}

/**
 * D4: Efficiency Metrics — quality-per-token and quality-per-minute.
 */
function computeD4(evalResults) {
  const perEval = {};

  for (const [evalId, configs] of Object.entries(evalResults)) {
    const evalMetrics = {};

    for (const configName of ["with_skill", "without_skill"]) {
      const config = configs[configName];
      if (!config?.grading || !config?.timing) continue;

      const passRate = config.grading.pass_rate ?? 0;
      const tokens = config.timing.total_tokens ?? 0;
      const durationS = config.timing.total_duration_seconds ?? config.timing.duration_ms / 1000 ?? 0;

      evalMetrics[configName] = {
        pass_rate: passRate,
        tokens,
        duration_s: durationS,
        quality_per_1k_tokens: tokens > 0 ? Math.round((passRate / (tokens / 1000)) * 10000) / 10000 : 0,
        quality_per_minute: durationS > 0 ? Math.round((passRate / (durationS / 60)) * 10000) / 10000 : 0,
      };
    }

    // Compute net value (with_skill vs without_skill)
    if (evalMetrics.with_skill && evalMetrics.without_skill) {
      const ws = evalMetrics.with_skill;
      const wo = evalMetrics.without_skill;
      const qualityUplift = wo.pass_rate > 0 ? ((ws.pass_rate - wo.pass_rate) / wo.pass_rate) * 100 : ws.pass_rate > 0 ? Infinity : 0;
      const tokenOverhead = wo.tokens > 0 ? ((ws.tokens - wo.tokens) / wo.tokens) * 100 : 0;

      evalMetrics.delta = {
        quality_uplift_pct: Math.round(qualityUplift * 10) / 10,
        token_overhead_pct: Math.round(tokenOverhead * 10) / 10,
        net_value: qualityUplift > 0 && tokenOverhead > 0 ? Math.round((qualityUplift / tokenOverhead) * 100) / 100 : qualityUplift > 0 ? Infinity : 0,
      };
    }

    perEval[evalId] = evalMetrics;
  }

  // Aggregate across all evals
  let totalWSTokens = 0, totalWOTokens = 0;
  let totalWSPassRate = 0, totalWOPassRate = 0;
  let evalCount = 0;

  for (const metrics of Object.values(perEval)) {
    if (metrics.with_skill) {
      totalWSTokens += metrics.with_skill.tokens;
      totalWSPassRate += metrics.with_skill.pass_rate;
    }
    if (metrics.without_skill) {
      totalWOTokens += metrics.without_skill.tokens;
      totalWOPassRate += metrics.without_skill.pass_rate;
    }
    evalCount++;
  }

  const avgWSRate = evalCount > 0 ? totalWSPassRate / evalCount : 0;
  const avgWORate = evalCount > 0 ? totalWOPassRate / evalCount : 0;

  return {
    score: Math.round(avgWSRate * 100),
    label: "Efficiency",
    description: "Quality-per-token and quality-per-minute",
    per_eval: perEval,
    aggregate: {
      with_skill: { avg_pass_rate: Math.round(avgWSRate * 1000) / 1000, total_tokens: totalWSTokens },
      without_skill: { avg_pass_rate: Math.round(avgWORate * 1000) / 1000, total_tokens: totalWOTokens },
      quality_uplift_pct: avgWORate > 0 ? Math.round(((avgWSRate - avgWORate) / avgWORate) * 1000) / 10 : 0,
      token_overhead_pct: totalWOTokens > 0 ? Math.round(((totalWSTokens - totalWOTokens) / totalWOTokens) * 1000) / 10 : 0,
    },
  };
}

function computeVerdict(d1, d2, d3, d4) {
  const avgScore = Math.round((d1.score + d2.score + d3.score + d4.score) / 4);
  let verdict;
  if (avgScore >= 90) verdict = "EXCELLENT";
  else if (avgScore >= 75) verdict = "GOOD";
  else if (avgScore >= 50) verdict = "ACCEPTABLE";
  else verdict = "NEEDS_IMPROVEMENT";

  return { overall_score: avgScore, verdict, breakdown: { d1: d1.score, d2: d2.score, d3: d3.score, d4: d4.score } };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node compute-metrics.js <workspace-dir> <iteration>");
    console.error("Example: node compute-metrics.js workspace/run-20260307-174641 1");
    process.exit(1);
  }

  const workspaceDir = path.resolve(args[0]);
  const iteration = parseInt(args[1], 10);
  const iterDir = path.join(workspaceDir, `iteration-${iteration}`);

  if (!fs.existsSync(iterDir)) {
    console.error(`Iteration directory not found: ${iterDir}`);
    process.exit(1);
  }

  const assertionDefs = loadAssertions();
  if (!assertionDefs) {
    console.error("Could not load phase-assertions.json");
    process.exit(1);
  }

  const evalResults = loadEvalResults(iterDir);
  const existingBenchmark = loadJSON(path.join(iterDir, "benchmark.json"));

  // Also extract results from existing benchmark.json if present
  if (existingBenchmark?.configurations) {
    for (const config of existingBenchmark.configurations) {
      const evalId = existingBenchmark.eval_id || 2; // default to eval 2
      if (!evalResults[evalId]) evalResults[evalId] = {};
      evalResults[evalId][config.name] = {
        grading: {
          pass_rate: config.results.pass_rate,
          expectations: config.per_assertion?.map((a) => ({
            text: a.text,
            passed: a.passed,
          })),
        },
        timing: {
          total_tokens: config.results.total_tokens,
          total_duration_seconds: config.results.duration_seconds,
          duration_ms: config.results.duration_ms,
        },
      };
    }
  }

  console.log(`Computing metrics for iteration ${iteration}...`);
  console.log(`Found eval results for: ${Object.keys(evalResults).join(", ")}`);

  const d1 = computeD1(evalResults, assertionDefs);
  const d2 = computeD2(evalResults, assertionDefs);
  const d3 = computeD3(evalResults, assertionDefs);
  const d4 = computeD4(evalResults);
  const verdict = computeVerdict(d1, d2, d3, d4);

  const output = {
    meta: {
      skill_name: "vbounce-e2e-test",
      iteration,
      timestamp: new Date().toISOString(),
      workspace: workspaceDir,
      evals_found: Object.keys(evalResults).map(Number),
    },
    d1_structural: d1,
    d2_functional: d2,
    d3_process: d3,
    d4_efficiency: d4,
    verdict,
  };

  const outPath = path.join(iterDir, "benchmark-full.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nBenchmark written to: ${outPath}`);
  console.log(`\nVerdict: ${verdict.verdict} (${verdict.overall_score}%)`);
  console.log(`  D1 Structural: ${d1.score}%`);
  console.log(`  D2 Functional: ${d2.score}%`);
  console.log(`  D3 Process:    ${d3.score}%`);
  console.log(`  D4 Efficiency: ${d4.score}%`);
}

main();
