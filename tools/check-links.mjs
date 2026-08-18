#!/usr/bin/env node
/**
 * Check that relative links resolve — markdown links, and href/src in HTML.
 *   node tools/check-links.mjs
 *
 * site/ is skipped: the hand-written landing page links to pages that only
 * exist once tools/site/gen.mjs has assembled them (schemas/index.html,
 * docs/terms/index.html, …). `npm run check:site` validates every link in the
 * built _site/, which is the shape readers actually get.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipDirs = new Set(["node_modules", ".git", ".cursor", "_site", "fixtures"]);
const skipPaths = new Set([path.join(root, "site")]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = path.join(dir, name);
    if (skipPaths.has(p)) continue;
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".md") || name.endsWith(".html") || name === "llms.txt") out.push(p);
  }
  return out;
}

const markdownLink = /!?\[[^\]]*\]\(([^)\s]+)\)/g;
const htmlAttr = /(?:href|src)\s*=\s*"([^"]+)"/g;
const external = /^(https?:|mailto:|tel:|data:|#)/;

let bad = 0;

for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  const pattern = file.endsWith(".html") ? htmlAttr : markdownLink;

  for (const m of text.matchAll(pattern)) {
    const target = m[1];
    if (external.test(target)) continue;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) {
      console.error(`${path.relative(root, file)}: broken link -> ${target}`);
      bad++;
    }
  }
}

console.log(bad ? `${bad} broken link(s)` : "links ok");
process.exit(bad ? 1 : 0);
