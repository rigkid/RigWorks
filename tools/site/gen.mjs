#!/usr/bin/env node
/**
 * Render the Contract as a static site — schema catalog, schema pages, docs,
 * examples, and the agent skill. The markdown and JSON Schema in the repo stay
 * the source of truth; nothing here edits them.
 *
 *   node tools/site/gen.mjs           # write _site/
 *   node tools/site/gen.mjs --check   # write, then fail on a missing page or dead link
 *
 * Pages carry a browse sidebar; the catalog is a grouped list with a filter box
 * that degrades to the full list when script is off.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "_site");
const GITHUB = "https://github.com/rigkid/RigWorks";
const BLOB = `${GITHUB}/blob/master`;
const TREE = `${GITHUB}/tree/master`;

marked.setOptions({ gfm: true, breaks: false });

/** Working trees with core.autocrlf check text out as CRLF; parse in LF. */
const readText = (...parts) =>
  fs.readFileSync(path.join(root, ...parts), "utf8").replace(/\r\n/g, "\n");

const version = readText("VERSION").trim();

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/* ---------- schemas ---------- */

/** Datatype name for a JSON Schema node: `vec3`, `enum`, `array<vec2>`, … */
function typeName(node) {
  if (!node) return "";
  if (node.$ref) {
    const m = node.$ref.match(/#\/\$defs\/(.+)$/);
    if (m) return m[1];
    return node.$ref.replace(/^\.\//, "").replace(/\.schema\.json$/, "");
  }
  if (node.const !== undefined) return JSON.stringify(node.const);
  if (node.enum) return "enum";
  if (node.type === "array") return `array<${typeName(node.items) || "any"}>`;
  if (Array.isArray(node.type)) return node.type.join(" | ");
  return node.type ?? "object";
}

/** Grammar the JSON Schema pins down beyond the datatype. */
function constraints(node) {
  if (!node) return "";
  const bits = [];
  const enums = node.enum ?? node.items?.enum;
  if (enums) bits.push(enums.join(" · "));
  if (node.minimum !== undefined || node.maximum !== undefined) {
    bits.push(`${node.minimum ?? "*"} – ${node.maximum ?? "*"}`);
  }
  if (node.exclusiveMinimum !== undefined) bits.push(`> ${node.exclusiveMinimum}`);
  if (node.minItems && node.minItems === node.maxItems) bits.push(`${node.minItems} items`);
  else if (node.minItems) bits.push(`min ${node.minItems} items`);
  return bits.join(" · ");
}

const cellsOf = (row) => row.split("|").slice(1, -1).map((c) => c.trim());

/**
 * Rows of the prose table headed Field | Type | Meaning. Schema pages carry
 * other tables too (enum values, host notes) — those are not it.
 */
function proseFields(md) {
  const rows = [];
  let inFieldTable = false;

  for (const line of md.split(/\r?\n/)) {
    if (!line.startsWith("|")) {
      inFieldTable = false;
      continue;
    }
    const cells = cellsOf(line);
    if (cells[0]?.toLowerCase() === "field" && cells.length >= 3) {
      inFieldTable = true;
      continue;
    }
    if (!inFieldTable || cells.length < 3) continue;
    const name = cells[0].replace(/`/g, "").trim();
    if (!name || /^-+$/.test(name)) continue;
    if (!rows.some((r) => r.name === name)) {
      rows.push({ name, type: cells[1].replace(/`/g, "").trim(), meaning: cells[2] });
    }
  }
  return rows;
}

/** The generated field table replaces the prose one; drop the duplicate. */
function stripFieldTable(html) {
  return html.replace(
    /(<div class="table-wrap">)?<table>[\s\S]*?<\/table>(<\/div>)?\s*/g,
    (whole) => (/<th>Field<\/th>/.test(whole) ? "" : whole)
  );
}

function walk(dir, filter, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === "json") continue;
      walk(p, filter, out);
    } else if (filter(name)) out.push(p);
  }
  return out;
}

const idHeading = /^#\s+`?(rig\.[a-z0-9_.]+)`?\s*$/m;

function loadSchemas() {
  const byId = new Map();

  for (const file of fs.readdirSync(path.join(root, "schemas", "json"))) {
    if (!file.endsWith(".schema.json") || file === "_defs.schema.json") continue;
    const id = file.replace(/\.schema\.json$/, "");
    const schema = JSON.parse(
      fs.readFileSync(path.join(root, "schemas", "json", file), "utf8")
    );
    byId.set(id, { id, domain: id.split(".")[1] ?? "document", schema });
  }

  for (const file of walk(
    path.join(root, "schemas"),
    (n) => n.endsWith(".md") && n !== "README.md"
  )) {
    const md = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const m = md.match(idHeading);
    if (!m) continue;
    const entry = byId.get(m[1]);
    if (!entry) continue;
    entry.prose = md;
    entry.proseRel = path.relative(root, file).split(path.sep).join("/");
  }

  for (const entry of byId.values()) {
    const props = entry.schema.properties ?? {};
    const required = new Set(entry.schema.required ?? []);
    const rows = entry.prose ? proseFields(entry.prose) : [];
    const byName = new Map(rows.map((r) => [r.name, r]));

    entry.union = Boolean(entry.schema.oneOf);
    entry.fields = Object.entries(props).map(([name, node]) => ({
      name,
      type: typeName(node),
      constraint: constraints(node),
      required: required.has(name),
      meaning: byName.get(name)?.meaning ?? node.description ?? "",
    }));

    // Tagged unions keep their shapes in oneOf, so the prose table is the only
    // per-field list there. Take it rather than showing no fields at all.
    if (!entry.fields.length && rows.length) {
      entry.fields = rows.map((r) => ({
        name: r.name,
        type: r.type,
        constraint: "",
        required: null,
        meaning: r.meaning,
      }));
    }

    entry.summary = summarize(entry);
  }

  return byId;
}

function summarize(entry) {
  if (entry.prose) {
    const body = entry.prose.replace(idHeading, "").trim();
    const para = body
      .split(/\n\s*\n/)
      .find((p) => p && !p.startsWith("|") && !p.startsWith("#"));
    if (para) return para.replace(/\n/g, " ").replace(/[`*]/g, "").trim();
  }
  return entry.schema.description ?? "";
}

/* ---------- docs, examples, skill ---------- */

// Reading order, not directory order — same sequence as llms.txt.
const DOC_ORDER = [
  "design-philosophy",
  "why-no-code",
  "terms",
  "honors",
  "sude",
  "ecs",
  "ui",
  "interchange",
  "properties",
  "versioning",
  "gaps",
  "ai-collaboration",
];

const blurbOf = (body) =>
  (body.split(/\n\s*\n/).find((p) => p && !p.startsWith("|") && !p.startsWith(">")) ?? "")
    .replace(/\n/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*]/g, "")
    .trim();

function loadDocs() {
  const rank = (name) => {
    const at = DOC_ORDER.indexOf(name.replace(/\.md$/, ""));
    return at === -1 ? DOC_ORDER.length : at;
  };
  return fs
    .readdirSync(path.join(root, "docs"))
    .filter((n) => n.endsWith(".md"))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((name) => {
      const md = readText("docs", name);
      const slug = name.replace(/\.md$/, "");
      const title = (md.match(/^#\s+(.+)$/m)?.[1] ?? slug).replace(/[`*]/g, "");
      return {
        slug,
        title,
        blurb: blurbOf(md.replace(/^#\s+.+$/m, "").trim()),
        md,
        rel: `docs/${name}`,
      };
    });
}

/**
 * Per-example prose from examples/README.md, keyed by file name. The synced
 * entity excerpt goes with its lead-in line — the page prints the whole
 * document a screen below.
 */
function exampleNotes() {
  const md = readText("examples", "README.md");
  const dropSnippet = (text) =>
    text
      .replace(/\n[^\n]*:[ \t]*\n+<!--\s*rig:begin[\s\S]*?rig:end\s*-->/g, "")
      .replace(/<!--\s*rig:begin[\s\S]*?rig:end\s*-->/g, "")
      .trim();

  const notes = new Map();
  const parts = md.split(/^##\s+`([^`]+\.json)`\s*$/m);
  const intro = parts.shift() ?? "";
  for (let i = 0; i < parts.length; i += 2) notes.set(parts[i], dropSnippet(parts[i + 1]));
  return { intro: dropSnippet(intro.replace(/^#\s+.+$/m, "")), notes };
}

function loadExamples() {
  const { intro, notes } = exampleNotes();
  const list = fs
    .readdirSync(path.join(root, "examples"))
    .filter((n) => n.endsWith(".json"))
    .sort()
    .map((name) => {
      const raw = readText("examples", name);
      const doc = JSON.parse(raw);
      const ids = new Set();
      for (const ent of doc.entities ?? []) {
        for (const id of Object.keys(ent.components ?? {})) ids.add(id);
      }
      return {
        name,
        slug: name.replace(/\.json$/, ""),
        rel: `examples/${name}`,
        json: JSON.stringify(doc, null, 2),
        entities: (doc.entities ?? []).length,
        targets: doc.rig ?? "",
        title: doc.document?.title ?? name,
        ids,
        note: notes.get(name) ?? "",
        // The in-repo SVG fulfillment renders exactly this document.
        svg: name === "minimal-scene.json" ? "scene.svg" : null,
      };
    });
  return { intro, list };
}

const SKILL_REL = "skills/generating-rig-documents/SKILL.md";

function loadSkill() {
  const raw = readText(SKILL_REL);
  const md = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
  return { md, rel: SKILL_REL };
}

/* ---------- grouping (mirrors schemas/README.md section order) ---------- */

const GROUPS = [
  { title: "Document", domains: ["document"] },
  {
    title: "Spatial / scene",
    domains: ["spatial", "layout"],
    note: "A scene is a root (unparented) vertex. Anchor is a bounds cell — not font.anchor (a glyph point).",
  },
  { title: "Place (civic / postal)", domains: ["place"] },
  { title: "Person / organisation / party", domains: ["person", "organisation", "party"] },
  { title: "Commerce", domains: ["commerce"] },
  { title: "Plant (botanica)", domains: ["plant"] },
  { title: "Book", domains: ["book"] },
  { title: "Paper (articles / citations)", domains: ["paper"] },
  { title: "Rights", domains: ["rights"] },
  { title: "Legal (agreements)", domains: ["legal"] },
  { title: "Art (CDWA core)", domains: ["art"] },
  { title: "Geometry / paint", domains: ["geometry", "paint"] },
  { title: "CAD / solids", domains: ["cad"] },
  { title: "BIM / OpenBIM", domains: ["bim"] },
  { title: "Meta / render", domains: ["meta", "render"] },
  { title: "Animation / modulators", domains: ["anim", "mod"] },
  { title: "Music", domains: ["music"] },
  { title: "Audio", domains: ["audio"] },
  { title: "Media", domains: ["media"] },
  { title: "Font (UFO source)", domains: ["font"] },
  { title: "Story (semantic copy)", domains: ["story"] },
  { title: "Pixel / raster", domains: ["pixel"] },
  {
    title: "I/O",
    domains: ["io", "dmx", "led", "sensor", "input", "light", "calendar"],
  },
  { title: "Simulation", domains: ["sim"] },
  { title: "Interaction", domains: ["interact"] },
  { title: "UI (control surfaces)", domains: ["ui"] },
  { title: "Node graph", domains: ["node"] },
];

function groupSchemas(byId) {
  const ids = [...byId.keys()].sort();
  const used = new Set();
  const groups = GROUPS.map((g) => ({
    title: g.title,
    note: g.note ?? "",
    members: ids.filter((id) => {
      const domain = id === "rig.document" ? "document" : byId.get(id).domain;
      if (!g.domains.includes(domain)) return false;
      used.add(id);
      return true;
    }),
  })).filter((g) => g.members.length);

  const rest = ids.filter((id) => !used.has(id));
  if (rest.length) groups.push({ title: "Other", members: rest });
  return groups;
}

/* ---------- link plumbing ---------- */

const schemaOut = (id) => `schemas/${id}/index.html`;
const docOut = (slug) => `docs/${slug}/index.html`;
const exampleOut = (slug) => `examples/${slug}/index.html`;
const CATALOG_OUT = "schemas/index.html";
const DOCS_OUT = "docs/index.html";
const EXAMPLES_OUT = "examples/index.html";
const AI_OUT = "for-ai/index.html";
const HOME_OUT = "index.html";

const rel = (from, to) => path.posix.relative(path.posix.dirname(from), to) || ".";

/** Repo-relative path -> generated page, for markdown and landing-page links. */
function buildPathMap({ byId, docs, examples }) {
  const map = new Map();
  for (const entry of byId.values()) {
    if (entry.proseRel) map.set(entry.proseRel, schemaOut(entry.id));
  }
  for (const doc of docs) map.set(doc.rel, docOut(doc.slug));
  for (const ex of examples.list) map.set(ex.rel, exampleOut(ex.slug));
  map.set("schemas/README.md", CATALOG_OUT);
  map.set("schemas", CATALOG_OUT);
  map.set("schemas/json", CATALOG_OUT);
  map.set("docs", DOCS_OUT);
  map.set("examples", EXAMPLES_OUT);
  map.set("examples/README.md", EXAMPLES_OUT);
  map.set(SKILL_REL, AI_OUT);
  map.set("skills", AI_OUT);
  map.set("README.md", HOME_OUT);
  map.set("llms.txt", "llms.txt");
  map.set("site/scene.svg", "scene.svg");
  // Images prose points at keep their path under the output.
  for (const name of imageAssets()) map.set(name, name);
  return map;
}

/** Relative paths of image files copied verbatim into the output. */
function imageAssets() {
  const dir = path.join(root, "examples", "img");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((name) => `examples/img/${name}`);
}

function resolveHref(href, sourceRel, pageOut, pathMap) {
  if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) return href;
  const [target, hash = ""] = href.split("#");
  if (!target) return href;
  const abs = path.posix
    .normalize(path.posix.join(path.posix.dirname(sourceRel), target))
    .replace(/\/$/, "");
  const page = pathMap.get(abs);
  if (page) return rel(pageOut, page) + (hash ? `#${hash}` : "");
  const onDisk = path.join(root, abs);
  if (fs.existsSync(onDisk)) {
    const base = fs.statSync(onDisk).isDirectory() ? TREE : BLOB;
    return `${base}/${abs}${hash ? `#${hash}` : ""}`;
  }
  return href;
}

/** GitHub-compatible heading slug, so cross-file #section links keep working. */
const slugify = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .toLowerCase()
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .replace(/ +/g, "-");

/** Inline markdown (a table cell), links rewritten the same way. */
function inlineMarkdown(md, sourceRel, pageOut, pathMap) {
  return marked
    .parseInline(md || "")
    .replace(/href="([^"]+)"/g, (_, href) =>
      `href="${esc(resolveHref(href, sourceRel, pageOut, pathMap))}"`
    );
}

function renderMarkdown(md, sourceRel, pageOut, pathMap) {
  return marked
    .parse(md)
    .replace(/href="([^"]+)"/g, (_, href) =>
      `href="${esc(resolveHref(href, sourceRel, pageOut, pathMap))}"`
    )
    .replace(/<(h[2-4])>([\s\S]*?)<\/\1>/g, (_, tag, inner) =>
      `<${tag} id="${slugify(inner)}">${inner}</${tag}>`
    )
    .replaceAll("<table>", '<div class="table-wrap"><table>')
    .replaceAll("</table>", "</table></div>");
}

/* ---------- shell ---------- */

function nav(pageOut, current) {
  const item = (label, to, key) =>
    `<a${current === key ? ' class="here"' : ""} href="${rel(pageOut, to)}">${label}</a>`;
  return `<nav>
  <a class="wordmark" href="${rel(pageOut, HOME_OUT)}">RigWorks</a>
  <span class="nav-links">
    ${item("Schemas", CATALOG_OUT, "schemas")}
    ${item("Docs", DOCS_OUT, "docs")}
    ${item("Examples", EXAMPLES_OUT, "examples")}
    ${item("For AI", AI_OUT, "for-ai")}
    <a class="ghost" href="${GITHUB}">GitHub</a>
  </span>
</nav>`;
}

function sidebar(pageOut, ctx, currentId) {
  const { groups, docs, examples } = ctx;
  const link = (to, label, key) =>
    `<li><a${key === currentId ? ' class="here"' : ""} href="${rel(pageOut, to)}">${esc(
      label
    )}</a></li>`;

  const block = (title, links) => `<div class="side-group">
  <h4>${esc(title)}</h4>
  <ul>${links.join("")}</ul>
</div>`;

  const schemaBlocks = groups
    .map((g) =>
      block(
        g.title,
        g.members.map((id) => link(schemaOut(id), id.replace(/^rig\.[a-z0-9_]+\./, ""), id))
      )
    )
    .join("");

  return `<aside class="sidebar">
  <details open>
    <summary>Browse the Contract</summary>
    <div class="side-scroll">
      ${schemaBlocks}
      ${block("Docs", docs.map((d) => link(docOut(d.slug), d.title, d.slug)))}
      ${block("Examples", examples.list.map((e) => link(exampleOut(e.slug), e.name, e.slug)))}
    </div>
  </details>
</aside>`;
}

function page({ pageOut, title, description, current, currentId, ctx, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description ?? "")}">
<meta name="theme-color" content="#0b0d10">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b0d10'/%3E%3Cpath d='M7 21 L13 11 L19 21 L25 11' stroke='%2340a6ff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="stylesheet" href="${rel(pageOut, "styles.css")}">
<link rel="stylesheet" href="${rel(pageOut, "pages.css")}">
</head>
<body class="doc">

<header class="topbar">
${nav(pageOut, current)}
</header>

<div class="shell with-side">
${sidebar(pageOut, ctx, currentId)}
<main class="content">
${body}
</main>
</div>

<footer>
  <p class="wordmark">RigWorks</p>
  <p>
    <a href="${rel(pageOut, CATALOG_OUT)}">Schemas</a> ·
    <a href="${rel(pageOut, DOCS_OUT)}">Docs</a> ·
    <a href="${rel(pageOut, EXAMPLES_OUT)}">Examples</a> ·
    <a href="${GITHUB}">Repository</a> ·
    <a href="${BLOB}/LICENSE">MIT</a>
  </p>
  <p class="muted">Contract v${version} · draft. A shared data vocabulary for creative applications.</p>
</footer>

</body>
</html>
`;
}

/* ---------- filter (progressive enhancement) ---------- */

const FILTER_UI = (count) => `<form class="filter" onsubmit="return false">
  <input id="q" type="search" placeholder="Filter ${count} schemas by id or field name" autocomplete="off" spellcheck="false">
  <span id="q-count" class="filter-count" aria-live="polite"></span>
</form>`;

const FILTER_JS = `<script>
(function () {
  var input = document.getElementById("q");
  if (!input) return;
  var items = [].slice.call(document.querySelectorAll("[data-search]"));
  var sections = [].slice.call(document.querySelectorAll("[data-section]"));
  var count = document.getElementById("q-count");
  function apply() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (el) {
      var hit = !q || el.getAttribute("data-search").indexOf(q) !== -1;
      el.hidden = !hit;
      if (hit) shown++;
    });
    sections.forEach(function (section) {
      var any = [].slice
        .call(section.querySelectorAll("[data-search]"))
        .some(function (el) { return !el.hidden; });
      section.hidden = !any;
    });
    count.textContent = q ? shown + " match" + (shown === 1 ? "" : "es") : "";
  }
  input.addEventListener("input", apply);
  apply();
})();
</script>`;

/* ---------- pages ---------- */

function fieldTable(entry, pageOut, ctx) {
  const source = entry.proseRel ?? "schemas/README.md";
  const unionNote = entry.union
    ? '<p class="note">Tagged union — only the storage field selected by <code>type</code> may be present. The JSON Schema below lists the allowed shapes.</p>'
    : "";

  if (!entry.fields.length) {
    return `<p class="note">Marker component — presence is the whole meaning, no fields.</p>${unionNote}`;
  }

  const flag = (f) =>
    f.required === null
      ? ""
      : f.required
      ? '<span class="req">required</span>'
      : '<span class="opt">optional</span>';

  const rows = entry.fields
    .map(
      (f) => `<tr>
  <td data-label="Field"><code>${esc(f.name)}</code></td>
  <td data-label="Type"><span class="type">${esc(f.type)}</span>${
        f.constraint ? `<span class="constraint">${esc(f.constraint)}</span>` : ""
      }</td>
  <td data-label="Required">${flag(f)}</td>
  <td data-label="Meaning">${inlineMarkdown(f.meaning, source, pageOut, ctx.pathMap)}</td>
</tr>`
    )
    .join("\n");

  return `<div class="table-wrap fields">
<table>
<thead><tr><th>Field</th><th>Type</th><th></th><th>Meaning</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</div>
${unionNote}`;
}

function schemaPage(entry, ctx) {
  const { groups, pathMap, examples } = ctx;
  const pageOut = schemaOut(entry.id);
  const group = groups.find((g) => g.members.includes(entry.id));
  const at = group.members.indexOf(entry.id);
  const prev = at > 0 ? group.members[at - 1] : null;
  const next = at < group.members.length - 1 ? group.members[at + 1] : null;

  const prose = entry.prose
    ? stripFieldTable(
        renderMarkdown(
          entry.prose.replace(idHeading, "").trim(),
          entry.proseRel,
          pageOut,
          pathMap
        )
      )
    : '<p class="note">No prose page yet — the JSON Schema below is the whole grammar.</p>';

  const usedIn = examples.list
    .filter((ex) => ex.ids.has(entry.id))
    .map((ex) => `<a href="${rel(pageOut, exampleOut(ex.slug))}">${esc(ex.name)}</a>`)
    .join(" · ");

  const body = `<p class="crumbs">
  <a href="${rel(pageOut, CATALOG_OUT)}">Schemas</a> <span>/</span> ${esc(group.title)}
</p>
<h1><code class="id">${esc(entry.id)}</code></h1>
<p class="badges">
  <span class="badge">v${version} · draft</span>
  <span class="badge">${entry.fields.length} field${entry.fields.length === 1 ? "" : "s"}</span>
  <span class="badge">${entry.fields.filter((f) => f.required).length} required</span>
</p>

<h2>Fields</h2>
${fieldTable(entry, pageOut, ctx)}

<div class="prose">
${prose}
</div>

<h2>JSON Schema</h2>
<p class="aside">
  Resolves at <code>${esc(entry.schema.$id ?? "")}</code> —
  <a href="${rel(pageOut, `schemas/${entry.id}.schema.json`)}">raw file</a>.
</p>
<pre class="code"><code>${esc(JSON.stringify(entry.schema, null, 2))}</code></pre>

${usedIn ? `<h2>Seen in</h2>\n<p>${usedIn}</p>` : ""}

<nav class="prevnext">
  ${prev ? `<a href="${rel(pageOut, schemaOut(prev))}">&larr; ${esc(prev)}</a>` : "<span></span>"}
  ${next ? `<a href="${rel(pageOut, schemaOut(next))}">${esc(next)} &rarr;</a>` : "<span></span>"}
</nav>`;

  return {
    out: pageOut,
    html: page({
      pageOut,
      title: `${entry.id} — RigWorks`,
      description: entry.summary,
      current: "schemas",
      currentId: entry.id,
      ctx,
      body,
    }),
  };
}

function catalogPage(ctx) {
  const { byId, groups } = ctx;
  const pageOut = CATALOG_OUT;

  const sections = groups
    .map((g) => {
      const rows = g.members
        .map((id) => {
          const entry = byId.get(id);
          const names = entry.fields.map((f) => f.name);
          const search = `${id} ${names.join(" ")}`.toLowerCase();
          return `<li data-search="${esc(search)}">
  <a href="${rel(pageOut, schemaOut(id))}"><code>${esc(id)}</code></a>
  <span class="row-fields">${esc(names.join(", ") || "marker")}</span>
</li>`;
        })
        .join("\n");
      return `<section data-section>
<h2 id="${slugify(g.title)}">${esc(g.title)}</h2>
${g.note ? `<p class="lede">${esc(g.note)}</p>` : ""}
<ul class="catalog-list">
${rows}
</ul>
</section>`;
    })
    .join("\n");

  const body = `<h1>Schema catalog</h1>
<p class="lede">
  Agreed POD field layouts — formats when present. A host that speaks six of these
  and ignores the other seventy is fully Rig.
</p>
<p class="badges">
  <span class="badge">v${version} · draft</span>
  <span class="badge">${byId.size} schemas</span>
  <span class="badge">${groups.length} domains</span>
</p>
${FILTER_UI(byId.size)}
${sections}
${FILTER_JS}`;

  return {
    out: pageOut,
    html: page({
      pageOut,
      title: "Schema catalog — RigWorks",
      description: "Every Rig schema: fields, units, JSON Schema.",
      current: "schemas",
      ctx,
      body,
    }),
  };
}

function docPage(doc, ctx) {
  const pageOut = docOut(doc.slug);
  const body = `<p class="crumbs"><a href="${rel(pageOut, DOCS_OUT)}">Docs</a> <span>/</span> ${esc(
    doc.slug
  )}</p>
<div class="prose">
${renderMarkdown(doc.md, doc.rel, pageOut, ctx.pathMap)}
</div>`;
  return {
    out: pageOut,
    html: page({
      pageOut,
      title: `${doc.title} — RigWorks`,
      description: doc.blurb,
      current: "docs",
      currentId: doc.slug,
      ctx,
      body,
    }),
  };
}

function docsIndex(ctx) {
  const pageOut = DOCS_OUT;
  const cards = ctx.docs
    .map(
      (d) => `<a class="card" href="${rel(pageOut, docOut(d.slug))}">
  <h3>${esc(d.title)}</h3>
  <p>${esc(d.blurb.slice(0, 190))}</p>
</a>`
    )
    .join("\n");
  const body = `<h1>Docs</h1>
<p class="lede">What the Contract means, and what counts as Rig.</p>
<div class="grid cards">
${cards}
</div>`;
  return {
    out: pageOut,
    html: page({
      pageOut,
      title: "Docs — RigWorks",
      description: "Rig concepts: terms, SUDE, ECS, properties, versioning.",
      current: "docs",
      ctx,
      body,
    }),
  };
}

function examplePage(ex, ctx) {
  const pageOut = exampleOut(ex.slug);
  const note = ex.note
    ? `<div class="prose">${renderMarkdown(ex.note, "examples/README.md", pageOut, ctx.pathMap)}</div>`
    : "";

  const speaks = [...ex.ids]
    .sort()
    .map((id) =>
      ctx.byId.has(id)
        ? `<a href="${rel(pageOut, schemaOut(id))}"><code>${esc(id)}</code></a>`
        : `<code>${esc(id)}</code>`
    )
    .join(" · ");

  const figure = ex.svg
    ? `<figure class="scene">
  <img src="${rel(pageOut, ex.svg)}" alt="${esc(ex.slug)} drawn by tools/render-svg.mjs" />
  <figcaption>Same document, drawn by the in-repo SVG fulfillment.</figcaption>
</figure>`
    : "";

  const body = `<p class="crumbs"><a href="${rel(pageOut, EXAMPLES_OUT)}">Examples</a> <span>/</span> ${esc(
    ex.slug
  )}</p>
<h1><code class="id">${esc(ex.name)}</code></h1>
<p class="badges">
  <span class="badge">targets v${esc(ex.targets)}</span>
  <span class="badge">${ex.entities} entities</span>
  <span class="badge">${ex.ids.size} schemas</span>
</p>
${note}
${figure}

<h2>Speaks</h2>
<p>${speaks}</p>

<h2>Document</h2>
<p class="aside">
  Validates under <code>npm run check</code> —
  <a href="${rel(pageOut, `examples/${ex.name}`)}">raw file</a>.
</p>
<pre class="code"><code>${esc(ex.json)}</code></pre>`;

  return {
    out: pageOut,
    html: page({
      pageOut,
      title: `${ex.name} — RigWorks`,
      description: blurbOf(ex.note) || `Reference Rig document ${ex.name}.`,
      current: "examples",
      currentId: ex.slug,
      ctx,
      body,
    }),
  };
}

function examplesIndex(ctx) {
  const pageOut = EXAMPLES_OUT;
  const cards = ctx.examples.list
    .map(
      (ex) => `<a class="card" href="${rel(pageOut, exampleOut(ex.slug))}">
  <h3><code>${esc(ex.name)}</code></h3>
  <p>${esc(blurbOf(ex.note).slice(0, 190))}</p>
</a>`
    )
    .join("\n");

  const body = `<h1>Examples</h1>
<p class="lede">Canonical documents. Copy the pattern; validate before you trust the output.</p>
<div class="grid cards">
${cards}
</div>
<div class="prose">
${renderMarkdown(ctx.examples.intro, "examples/README.md", pageOut, ctx.pathMap)}
</div>`;

  return {
    out: pageOut,
    html: page({
      pageOut,
      title: "Examples — RigWorks",
      description: "Reference Rig documents that all validate.",
      current: "examples",
      ctx,
      body,
    }),
  };
}

function aiPage(ctx) {
  const pageOut = AI_OUT;
  const body = `<h1>For AI</h1>
<p class="lede">
  Execution is cheap; agreement is the scarce asset. Load this before generating Rig
  data, copy the examples rather than inventing a vocabulary, and validate the output.
</p>
<p class="badges">
  <span class="badge">v${version} · draft</span>
  <span class="badge"><a href="${rel(pageOut, "llms.txt")}">llms.txt</a></span>
  <span class="badge"><a href="${BLOB}/${SKILL_REL}">skill source</a></span>
</p>
<div class="prose">
${renderMarkdown(ctx.skill.md, ctx.skill.rel, pageOut, ctx.pathMap)}
</div>`;
  return {
    out: pageOut,
    html: page({
      pageOut,
      title: "For AI — RigWorks",
      description: "Agent skill: generate and validate Rig documents.",
      current: "for-ai",
      ctx,
      body,
    }),
  };
}

/* ---------- build ---------- */

function copyInto(from, toDir, name = path.basename(from)) {
  fs.mkdirSync(toDir, { recursive: true });
  fs.copyFileSync(from, path.join(toDir, name));
}

function build() {
  const byId = loadSchemas();
  const docs = loadDocs();
  const examples = loadExamples();
  const skill = loadSkill();
  const groups = groupSchemas(byId);
  const ctx = { byId, docs, examples, skill, groups };
  ctx.pathMap = buildPathMap(ctx);

  const pages = [
    catalogPage(ctx),
    docsIndex(ctx),
    examplesIndex(ctx),
    aiPage(ctx),
    ...[...byId.values()].map((entry) => schemaPage(entry, ctx)),
    ...docs.map((doc) => docPage(doc, ctx)),
    ...examples.list.map((ex) => examplePage(ex, ctx)),
  ];

  // retryDelay: a browser or editor holding a file open makes Windows report
  // EPERM on the mkdir that follows.
  fs.rmSync(outDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
  for (const { out, html } of pages) {
    const file = path.join(outDir, out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }

  // site/ is copied verbatim: the hand-written landing page already links to
  // the pages below (schemas/index.html, docs/terms/index.html, …), so it needs
  // no rewriting — it only resolves once those pages sit beside it here.
  for (const name of fs.readdirSync(path.join(root, "site"))) {
    copyInto(path.join(root, "site", name), outDir);
  }

  // Raw payloads readers and tools fetch directly.
  copyInto(path.join(root, "llms.txt"), outDir);
  const jsonDir = path.join(root, "schemas", "json");
  for (const name of fs.readdirSync(jsonDir)) {
    if (name.endsWith(".schema.json")) copyInto(path.join(jsonDir, name), path.join(outDir, "schemas"));
  }
  for (const ex of examples.list) {
    copyInto(path.join(root, "examples", ex.name), path.join(outDir, "examples"));
  }
  for (const asset of imageAssets()) {
    copyInto(path.join(root, asset), path.join(outDir, path.dirname(asset)));
  }

  return { ctx, pages };
}

/* ---------- check ---------- */

function checkOutput({ ctx }) {
  const problems = [];

  for (const id of ctx.byId.keys()) {
    if (!fs.existsSync(path.join(outDir, schemaOut(id)))) {
      problems.push(`no page for schema ${id}`);
    }
  }

  // Prose with no page means a schema id the JSON catalog never declared.
  for (const file of walk(
    path.join(root, "schemas"),
    (n) => n.endsWith(".md") && n !== "README.md"
  )) {
    const relPath = path.relative(root, file).split(path.sep).join("/");
    if (!ctx.pathMap.has(relPath)) problems.push(`prose without a page: ${relPath}`);
  }

  const htmlFiles = walk(outDir, (n) => n.endsWith(".html"));
  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
      const target = href.split("#")[0].split("?")[0];
      if (!target) continue;
      const resolved = path.resolve(path.dirname(file), target);
      if (!fs.existsSync(resolved)) {
        problems.push(`${path.relative(outDir, file)}: dead link -> ${href}`);
      }
    }
  }

  if (problems.length) {
    for (const p of problems) console.error(`gen-site: ${p}`);
    console.error(`${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log(`site ok — ${htmlFiles.length} pages checked, no dead links`);
}

const result = build();
console.log(
  `wrote _site/ — ${result.pages.length} generated pages (${result.ctx.byId.size} schemas, ` +
    `${result.ctx.docs.length} docs, ${result.ctx.examples.list.length} examples) plus site/ assets`
);
console.log(`browse ${pathToFileURL(path.join(outDir, "index.html")).href}`);
if (process.argv.includes("--check")) checkOutput(result);
