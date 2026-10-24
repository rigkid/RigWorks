#!/usr/bin/env node
/**
 * One reading order, four renderings - kept in agreement mechanically.
 *
 * The canonical order is DOC_GROUPS in tools/site/gen.mjs (the site nav).
 * README.md, llms.txt, and docs/README.md render the same order for
 * humans and models. This check extracts the docs/*.md link sequence
 * from each rendering and fails when any of them disagrees with the
 * canonical order, so adding a doc means updating all four in one pass.
 *
 *   node tools/check-docs-order.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

let failed = false;
const fail = (msg) => { console.error(msg); failed = true; };

// Canonical: the slugs arrays inside DOC_GROUPS in the site generator.
const genSrc = read("tools/site/gen.mjs");
const groupsBlock = genSrc.split("const DOC_GROUPS")[1]?.split("];")[0] ?? "";
const canonical = [...groupsBlock.matchAll(/"([a-z0-9-]+)"/g)]
  .map((m) => m[1])
  .filter((slug) => fs.existsSync(path.join(root, "docs", `${slug}.md`)));

function docOrder(text, pattern) {
  const seen = [];
  for (const m of text.matchAll(pattern)) {
    if (!seen.includes(m[1])) seen.push(m[1]);
  }
  return seen;
}

// Only the order-bearing section of each rendering counts; docs linked
// from pitch prose elsewhere in the file are not the reading order.
const section = (text, startMarker, endMarker) => {
  const start = text.indexOf(startMarker);
  if (start === -1) return "";
  const rest = text.slice(start);
  const end = endMarker ? rest.indexOf(endMarker, startMarker.length) : -1;
  return end === -1 ? rest : rest.slice(0, end);
};

const renderings = [
  ["README.md", docOrder(section(read("README.md"), "## More reading"), /\]\(docs\/([a-z0-9-]+)\.md\)/g)],
  ["llms.txt", docOrder(section(read("llms.txt"), "## Docs", "## Schemas"), /\]\(docs\/([a-z0-9-]+)\.md\)/g)],
  ["docs/README.md", docOrder(read("docs/README.md"), /\]\(([a-z0-9-]+)\.md\)/g)],
];

for (const [name, order] of renderings) {
  const missing = canonical.filter((slug) => !order.includes(slug));
  const extra = order.filter((slug) => !canonical.includes(slug));
  for (const slug of missing) fail(`${name} does not list docs/${slug}.md - the reading order lives in tools/site/gen.mjs (DOC_GROUPS); update every rendering together`);
  for (const slug of extra) fail(`${name} lists docs/${slug}.md, which is not in the site reading order (tools/site/gen.mjs DOC_GROUPS)`);
  if (!missing.length && !extra.length && order.join(",") !== canonical.join(",")) {
    fail(`${name} lists the docs in a different order than the site nav (tools/site/gen.mjs DOC_GROUPS):\n  ${name}: ${order.join(", ")}\n  canonical: ${canonical.join(", ")}`);
  }
}

if (!failed) console.log(`docs order ok - ${canonical.length} docs in one order across README.md, llms.txt, docs/README.md, and the site nav`);
process.exitCode = failed ? 1 : 0;
