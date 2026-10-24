#!/usr/bin/env node
/**
 * Gate the AI skill's shape:
 *   - the router (skills/generating-rig-documents/SKILL.md) links every
 *     domain slice, and every slice on disk is linked;
 *   - token budgets hold (approx tokens = chars / 4), so the monolith
 *     cannot regrow;
 *   - every catalog schema id is named in the router or in a slice, so
 *     splitting the skill never silently drops a domain.
 *
 *   node tools/check-skill.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = path.join(root, "skills", "generating-rig-documents");
const routerPath = path.join(skillDir, "SKILL.md");
const domainsDir = path.join(skillDir, "domains");

const ROOT_BUDGET_TOKENS = 1650;
const SLICE_BUDGET_TOKENS = 1200;
const approxTokens = (text) => Math.round(text.length / 4);

let failed = false;
const fail = (msg) => { console.error(msg); failed = true; };

const router = fs.readFileSync(routerPath, "utf8");
if (approxTokens(router) > ROOT_BUDGET_TOKENS) {
  fail(`skill router is ${approxTokens(router)} tokens (budget ${ROOT_BUDGET_TOKENS}) - move domain detail into a slice`);
}

const linked = new Set(
  [...router.matchAll(/\]\(domains\/([a-z0-9-]+\.md)\)/g)].map((m) => m[1])
);
const onDisk = fs.existsSync(domainsDir) ? fs.readdirSync(domainsDir).filter((n) => n.endsWith(".md")) : [];
for (const name of onDisk) {
  if (!linked.has(name)) fail(`domain slice domains/${name} is not linked from SKILL.md`);
}
for (const name of linked) {
  if (!onDisk.includes(name)) fail(`SKILL.md links domains/${name}, which does not exist`);
}

let skillText = router;
for (const name of onDisk) {
  const text = fs.readFileSync(path.join(domainsDir, name), "utf8");
  skillText += "\n" + text;
  if (approxTokens(text) > SLICE_BUDGET_TOKENS) {
    fail(`domain slice domains/${name} is ${approxTokens(text)} tokens (budget ${SLICE_BUDGET_TOKENS}) - split it or cut field detail (fields live in schemas)`);
  }
  // Guidance quality, not just id coverage: a slice must teach composition
  // (a Compose table), name its traps (a Guards section with bullets), and
  // point at a worked example to copy. An id list alone fails here.
  if (!/^## Compose/m.test(text) || !/^\|.*\|$/m.test(text.split(/^## Compose/m)[1] ?? "")) {
    fail(`domain slice domains/${name} has no Compose table - say what to compose, not just which ids exist`);
  }
  const guards = text.split(/^## Guards/m)[1] ?? "";
  if (!guards || !/^- /m.test(guards)) {
    fail(`domain slice domains/${name} has no Guards bullets - name the traps for this domain`);
  }
  if (!/Copy:.*examples\/[a-z0-9-]+\.json/.test(text)) {
    fail(`domain slice domains/${name} points at no copyable example - link one in its Copy line`);
  }
  // Teaching examples only: examples/coverage/ holds validator specimens
  // that exist to exercise schema ids, not documents worth imitating.
  if (/examples\/coverage\//.test(text)) {
    fail(`domain slice domains/${name} links a coverage specimen (examples/coverage/) as a copy pattern - specimens are validator fodder, not teaching examples`);
  }
}

const index = JSON.parse(fs.readFileSync(path.join(root, "schemas", "index.json"), "utf8"));

// A Compose table is a recommendation. Recommending an experimental id
// from the skill means it has outgrown experimental: promote it to draft
// (schemas/<domain>/<name>.md frontmatter, then npm run gen) instead of
// teaching authors to emit a tier the router tells them to avoid.
const maturityOf = new Map(index.schemas.map((s) => [s.id, s.maturity]));
for (const name of onDisk) {
  const text = fs.readFileSync(path.join(domainsDir, name), "utf8");
  const compose = text.split(/^## Compose/m)[1]?.split(/^## /m)[0] ?? "";
  for (const m of compose.matchAll(/rig\.[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+/g)) {
    if (maturityOf.get(m[0]) === "experimental") {
      fail(`domain slice domains/${name} recommends experimental id ${m[0]} in its Compose table - promote ${m[0]} to draft or stop recommending it`);
    }
  }
}

const missing = index.schemas.map((s) => s.id).filter((id) => !skillText.includes(id));
for (const id of missing) fail(`schema id ${id} is not named in the skill (router or any domain slice)`);

if (!failed) {
  console.log(`skill ok - router ${approxTokens(router)} tokens, ${onDisk.length} domain slices, all ${index.schemas.length} schema ids covered`);
}
process.exitCode = failed ? 1 : 0;
