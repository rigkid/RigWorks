#!/usr/bin/env node
/**
 * Fail if the three schema representations drift apart:
 *   1. frontmatter in schemas/<domain>/<name>.md  (source of truth)
 *   2. schemas/json/*.schema.json                 (generated grammar)
 *   3. the prose Field|Type|Meaning table          (human/AI reading copy)
 *
 * Checks ids, field names, datatypes, and required-vs-"Optional." agreement
 * between frontmatter and the prose table. Generated-output freshness is
 * checked separately by tools/gen-schemas.mjs --check.
 *
 *   node tools/check-schema-parity/check.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaSources, parseFieldTables, fieldTypeLabel } from "../schema-source.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const jsonDir = path.join(root, "schemas", "json");

let failed = false;
const fail = (msg) => { console.error(msg); failed = true; };

const sources = loadSchemaSources(root);
const mdIds = new Set(sources.map((s) => s.data.id));

// Maturity tagging is enforced, not decorative: every prose schema file
// must carry frontmatter with a valid tier. A file without frontmatter is
// invisible to the generator, so it must fail here rather than drift.
import { walkFiles, parseFrontmatter } from "../schema-source.mjs";
for (const file of walkFiles(path.join(root, "schemas"), (n) => n.endsWith(".md") && n !== "README.md")) {
  const parsed = parseFrontmatter(fs.readFileSync(file, "utf8"));
  if (!parsed) fail(`schema file has no frontmatter (maturity tagging is required): ${path.relative(root, file)}`);
}

// Stable is a freeze promise: a stable schema must be exercised by at
// least one reference example. Nested schemas (array items of another
// component) are exercised when an example uses the parent and the
// parent's grammar $refs them - derived from the generated schemas, so
// no hand-kept allowlist can drift.
// Teaching examples and coverage specimens both exercise schema ids;
// specimens live in examples/coverage/ and are validator fodder, not
// copy patterns (the skill never links them - see check-skill).
const exampleText = (() => {
  const texts = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".json")) texts.push(fs.readFileSync(p, "utf8"));
    }
  };
  walk(path.join(root, "examples"));
  return texts.join("\n");
})();
const nestedExercised = new Set();
{
  // Transitive: graph -> node -> pin/param counts as exercised.
  const queue = sources.filter((s) => exampleText.includes(`"${s.data.id}"`)).map((s) => s.data.id);
  while (queue.length) {
    const parentId = queue.shift();
    const file = path.join(jsonDir, `${parentId}.schema.json`);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/\.\/(rig\.[a-z0-9_.]+)\.schema\.json/g)) {
      if (!nestedExercised.has(m[1])) { nestedExercised.add(m[1]); queue.push(m[1]); }
    }
  }
}
for (const s of sources) {
  if (s.data.maturity !== "stable" || s.data.special === "document") continue;
  if (!exampleText.includes(`"${s.data.id}"`) && !nestedExercised.has(s.data.id)) {
    fail(`stable schema ${s.data.id} appears in no example - exemplify it or demote it (${s.rel})`);
  }
}

const jsonIds = new Set();
for (const name of fs.readdirSync(jsonDir)) {
  if (!name.endsWith(".schema.json") || name === "_defs.schema.json") continue;
  jsonIds.add(name.replace(/\.schema\.json$/, ""));
}

for (const id of [...mdIds].filter((id) => !jsonIds.has(id)).sort()) {
  fail(`frontmatter schema missing JSON Schema: ${id}`);
}
for (const id of [...jsonIds].filter((id) => !mdIds.has(id)).sort()) {
  fail(`JSON Schema missing frontmatter source: ${id}`);
}

/* ----- field-level: frontmatter vs prose table ----- */

// Prose Type cells and frontmatter labels use the same vocabulary modulo a
// few spellings (float/number, entity[] / array<entity>).
function normalizeType(label) {
  let s = (label ?? "")
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/["?]/g, "")
    .replace(/\s+/g, "")
    .replaceAll("number", "float")
    .replaceAll("boolean", "bool")
    .replaceAll("integer", "int");
  const sized = s.match(/^(.+)\[\d+\]$/);
  if (sized) s = `array<${sized[1]}>`;
  if (s.endsWith("[]")) s = `array<${s.slice(0, -2)}>`;
  return s.replaceAll("rgba", "vec4").replaceAll("rgb", "vec3");
}

/** Every property name appearing anywhere in a JSON Schema (nested included). */
function nestedNames(node, out = new Set()) {
  if (!node || typeof node !== "object") return out;
  for (const [k, v] of Object.entries(node.properties ?? {})) { out.add(k); nestedNames(v, out); }
  if (node.items) nestedNames(node.items, out);
  for (const k of ["oneOf", "anyOf", "allOf"]) for (const sub of node[k] ?? []) nestedNames(sub, out);
  return out;
}

let fieldProblems = 0;
for (const s of sources) {
  if (s.data.special) continue;
  const rows = parseFieldTables(s.body);
  if (!rows.length) continue; // marker schemas and table-free prose: nothing to compare
  const rowByName = new Map(rows.map((r) => [r.name, r]));
  const fieldNames = new Set((s.data.fields ?? []).map((f) => f.name));
  const schemaJson = JSON.parse(fs.readFileSync(path.join(jsonDir, `${s.data.id}.schema.json`), "utf8"));
  const nested = nestedNames(schemaJson);

  for (const f of s.data.fields ?? []) {
    const row = rowByName.get(f.name);
    if (!row) {
      fail(`${s.data.id}: field "${f.name}" is in frontmatter but not in the prose table (${s.rel})`);
      fieldProblems++;
      continue;
    }
    const want = normalizeType(fieldTypeLabel(f));
    const got = normalizeType(row.type);
    const typeOk = got === want || got.startsWith(want) || want.startsWith(got) || got.includes(want.replace("array<", "").replace(">", ""))
      || (f.enum !== undefined && got === normalizeType(f.type ?? "string")) // prose names the base type of an enum
      || (want === "enum" && got === "string")
      || (want === "array<any>" && got.startsWith("array<"))
      || (want === "faceinsets" && got.startsWith("float"))
      || (want === "propertytype" && got === "string")
      || want.endsWith(`.${got}`) // prose shortens rig.node.graph to "graph"
      || (want === "array<enum>" && got === "array<string>"); // enum items are strings in prose
    if (!typeOk) {
      fail(`${s.data.id}: field "${f.name}" type drift - frontmatter "${fieldTypeLabel(f)}" vs prose "${row.type}" (${s.rel})`);
      fieldProblems++;
    }
    const proseOptional = /\boptional\b/i.test(row.meaning);
    if (f.required && proseOptional) {
      fail(`${s.data.id}: field "${f.name}" is required in frontmatter but prose calls it optional (${s.rel})`);
      fieldProblems++;
    }
  }
  for (const row of rows) {
    // Rows may document fields of nested objects (e.g. a frame inside an
    // arrangement); those live in the JSON Schema, not the top-level fields.
    // Composite rows ("axisTag2 / sign2") document several nested fields at once.
    const parts = row.name.split("/").map((p) => p.trim());
    if (parts.every((p) => fieldNames.has(p) || nested.has(p))) continue;
    if (!fieldNames.has(row.name) && !nested.has(row.name)) {
      fail(`${s.data.id}: field "${row.name}" is in the prose table but not in the schema (${s.rel})`);
      fieldProblems++;
    }
  }
}

if (!failed) {
  console.log(`parity ok - ${mdIds.size} schemas, fields agree across frontmatter, JSON Schema, and prose`);
}
process.exitCode = failed ? 1 : 0;
