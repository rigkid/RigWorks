#!/usr/bin/env node
/**
 * Semantic-coverage gate for the stable tier.
 *
 *   node tools/audit-semantic.mjs [--scan]
 *
 * Every stable schema is classified in tools/semantic-coverage.json:
 *   validator   - cross-field/document rules in tools/rig-validate/cli.js
 *                 (named in SEMANTIC_RULES there, claimed by name here)
 *   schema      - single-field constraints live in the generated JSON
 *                 Schema (frontmatter minimum/maximum/enum/required)
 *   none        - reviewed: no prose rule beyond field grammar
 *   fulfillment - the prose describes host behaviour, not document validity
 *
 * The gate fails when a stable schema is unclassified, when a claimed
 * rule does not exist in the validator registry, or when a registered
 * rule is claimed by no schema. --scan additionally lists stable prose
 * carrying obligation language (must / never / smaller / between / ...)
 * while classified none or schema - the triage queue for new rules.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scan = process.argv.includes("--scan");

const index = JSON.parse(fs.readFileSync(path.join(root, "schemas", "index.json"), "utf8"));
const coverage = JSON.parse(fs.readFileSync(path.join(root, "tools", "semantic-coverage.json"), "utf8"));
const cli = fs.readFileSync(path.join(root, "tools", "rig-validate", "cli.js"), "utf8");
const registryBlock = cli.split("const SEMANTIC_RULES = [")[1]?.split("];")[0] ?? "";
const registry = new Set([...registryBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));

let failed = false;
const fail = (msg) => { console.error(msg); failed = true; };

const stable = index.schemas.filter((s) => s.maturity === "stable");
const byId = new Map(index.schemas.map((s) => [s.id, s]));

for (const s of stable) {
  const entry = coverage[s.id];
  if (!entry) { fail(`stable schema ${s.id} is not classified in tools/semantic-coverage.json - classify it (validator / schema / none / fulfillment)`); continue; }
  if (!["validator", "schema", "none", "fulfillment"].includes(entry.class)) {
    fail(`stable schema ${s.id} has unknown semantic class "${entry.class}"`);
  }
  if (entry.class === "validator" && !(entry.rules ?? []).length) {
    fail(`stable schema ${s.id} is classified validator but claims no rule`);
  }
}
for (const [id, entry] of Object.entries(coverage)) {
  if (!byId.has(id)) fail(`semantic-coverage.json names unknown schema ${id}`);
  for (const rule of entry.rules ?? []) {
    if (!registry.has(rule)) fail(`semantic-coverage.json: ${id} claims rule "${rule}", which is not in SEMANTIC_RULES (tools/rig-validate/cli.js)`);
  }
}
const claimed = new Set(Object.values(coverage).flatMap((e) => e.rules ?? []));
for (const rule of registry) {
  if (!claimed.has(rule)) fail(`validator rule "${rule}" (tools/rig-validate/cli.js) is claimed by no schema in tools/semantic-coverage.json`);
}

if (scan) {
  const obligation = /\b(must|never|smaller|larger|greater|between|non-decreasing|at least|at most|within|before|after|matches no|exactly one)\b/i;
  console.log("stable prose with obligation language, classified none/schema (triage queue):");
  for (const s of stable) {
    const entry = coverage[s.id];
    if (!entry || entry.class === "validator" || entry.class === "fulfillment") continue;
    const prose = fs.readFileSync(path.join(root, s.prose), "utf8");
    const body = prose.split(/^---$/m).slice(2).join("---");
    const hits = body.split("\n").filter((line) => obligation.test(line));
    if (hits.length) {
      console.log(`  ${s.id} [${entry.class}]`);
      for (const h of hits.slice(0, 3)) console.log(`      ${h.trim().slice(0, 140)}`);
    }
  }
}

if (!failed && !scan) {
  const counts = {};
  for (const s of stable) counts[coverage[s.id].class] = (counts[coverage[s.id].class] ?? 0) + 1;
  console.log(`semantic coverage ok - ${stable.length} stable schemas classified (${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(", ")}), ${registry.size} validator rules all claimed`);
}
process.exitCode = failed ? 1 : 0;
