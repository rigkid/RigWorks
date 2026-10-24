#!/usr/bin/env node
/**
 * Evidence report for maturity tiers - the input to a promotion judgment,
 * not the judgment itself.
 *
 *   node tools/audit-maturity.mjs [--ids]
 *
 * For every schema id, reports two measured facts:
 *   exemplified  - the id appears in examples/*.json (a worked document)
 *   hostConsumed - the id appears in RigKit host code (src/, packs/,
 *                  examples/, tools/, templates/; docs mirrors excluded)
 *
 * Tier policy (docs/versioning.md): stable needs an example here; mapped
 * external vocabularies promote on a second consuming host, not on this
 * report alone. RigKit root defaults to the host this submodule sits in
 * (../../.. from here) and can be overridden with RIGKIT_ROOT.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const showIds = process.argv.includes("--ids");

const index = JSON.parse(fs.readFileSync(path.join(root, "schemas", "index.json"), "utf8"));

function collectIds(dir, exts, skipDirs) {
  const ids = new Set();
  if (!fs.existsSync(dir)) return ids;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) walk(p);
      } else if (exts.has(path.extname(entry.name))) {
        const text = fs.readFileSync(p, "utf8");
        for (const m of text.matchAll(/rig\.[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+/g)) ids.add(m[0]);
      }
    }
  };
  walk(dir);
  return ids;
}

const exemplified = collectIds(path.join(root, "examples"), new Set([".json"]), new Set());
// Nested schemas (array items) are exercised when an example uses a parent
// whose generated grammar $refs them (e.g. rig.node.link inside a graph).
{
  const jsonDir = path.join(root, "schemas", "json");
  const queue = [...exemplified];
  while (queue.length) {
    const parentId = queue.shift();
    const file = path.join(jsonDir, `${parentId}.schema.json`);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/\.\/(rig\.[a-z0-9_.]+)\.schema\.json/g)) {
      if (!exemplified.has(m[1])) { exemplified.add(m[1]); queue.push(m[1]); }
    }
  }
}

const rigkitRoot = process.env.RIGKIT_ROOT
  ? path.resolve(process.env.RIGKIT_ROOT)
  : path.resolve(root, "..", "..", "..");
const hostIds = new Set();
const skip = new Set([".git", "build", "node_modules", "third_party", "docs"]);
for (const tree of ["src", "packs", "examples", "tools", "templates"]) {
  for (const id of collectIds(path.join(rigkitRoot, tree), new Set([".cpp", ".h", ".hpp", ".json", ".mjs", ".js", ".cmake", ".txt"]), skip)) {
    hostIds.add(id);
  }
}

const buckets = new Map();
for (const s of index.schemas) {
  const ex = exemplified.has(s.id);
  const host = hostIds.has(s.id);
  const key = `${s.maturity} | exemplified=${ex ? "yes" : "no "} | host=${host ? "yes" : "no "}`;
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(s.id);
}

console.log(`maturity evidence (${index.schemas.length} schemas, RigKit root: ${rigkitRoot})`);
for (const [key, ids] of [...buckets.entries()].sort()) {
  console.log(`  ${key} : ${ids.length}`);
  if (showIds) for (const id of ids.sort()) console.log(`      ${id}`);
}

// The actionable queues.
const draftNoEvidence = index.schemas.filter((s) => s.maturity === "draft" && !exemplified.has(s.id) && !hostIds.has(s.id));
const draftHostNoExample = index.schemas.filter((s) => s.maturity === "draft" && !exemplified.has(s.id) && hostIds.has(s.id));
const stableNoHost = index.schemas.filter((s) => s.maturity === "stable" && !hostIds.has(s.id));
console.log(`draft with neither example nor host evidence: ${draftNoEvidence.length} (candidates to exemplify, narrow, or demote)`);
console.log(`draft consumed by the host but unexemplified: ${draftHostNoExample.length} (example-first promotion queue)`);
console.log(`stable without host-code evidence: ${stableNoHost.length} (fine when an example is the fulfillment evidence; listed with --ids)`);
if (showIds) {
  for (const [label, list] of [["draft/no-evidence", draftNoEvidence], ["draft/host-no-example", draftHostNoExample], ["stable/no-host", stableNoHost]]) {
    console.log(`${label}:`);
    for (const s of list) console.log(`  ${s.id}`);
  }
}
