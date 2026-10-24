/**
 * Schema source of truth: YAML frontmatter in each prose schema file.
 *
 * The frontmatter dialect is deliberately small and deterministic so it can
 * be parsed without a YAML dependency (this repo's tools are zero-dep Node):
 *   - top-level scalar keys:  key: "double-quoted string" | number | bool
 *   - `fields:` is a list of flat maps:
 *       - name: "width"
 *         ref: "float"            (a $defs datatype in _defs.schema.json)
 *         type: "number"          (an inline JSON Schema type)
 *         required: true
 *         meaning: "..."
 *         absent: "..."
 *         enum: ["a", "b"]
 *         minimum: 0
 *         itemsRef: "entity"      (array item $defs datatype)
 *         itemsType: "string"     (array item inline type)
 *         schemaJson: "{...}"     (escape hatch: full JSON Schema fragment)
 *   - `topJson:` holds any extra top-level JSON Schema keys as one JSON line.
 *
 * Generated from frontmatter: schemas/json/*.schema.json, schemas/index.json,
 * and the validator's packaged schema copy. Prose below the frontmatter is
 * hand-written and is not generated.
 */
import fs from "node:fs";
import path from "node:path";

export const MATURITIES = ["stable", "draft", "experimental"];

function parseScalar(raw) {
  const v = raw.trim();
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith("[") || v.startsWith("{")) return JSON.parse(v);
  if (v === "true") return true;
  if (v === "false") return false;
  if (v !== "" && !Number.isNaN(Number(v))) return Number(v);
  return v;
}

/** Parse the frontmatter block. Returns null when the file has none. */
export function parseFrontmatter(text) {
  const norm = text.replace(/\r\n/g, "\n");
  if (!norm.startsWith("---\n")) return null;
  const end = norm.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const block = norm.slice(4, end);
  const data = { fields: [] };
  let inFields = false;
  let current = null;
  for (const line of block.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^fields:\s*$/.test(line)) { inFields = true; continue; }
    if (inFields) {
      const item = line.match(/^ {2}- ([a-zA-Z]+):\s*(.*)$/);
      if (item) {
        current = {};
        data.fields.push(current);
        current[item[1]] = parseScalar(item[2]);
        continue;
      }
      const kv = line.match(/^ {4}([a-zA-Z]+):\s*(.*)$/);
      if (kv && current) { current[kv[1]] = parseScalar(kv[2]); continue; }
      throw new Error(`schema-source: cannot parse frontmatter line: ${JSON.stringify(line)}`);
    }
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) { data[kv[1]] = parseScalar(kv[2]); continue; }
    throw new Error(`schema-source: cannot parse frontmatter line: ${JSON.stringify(line)}`);
  }
  return { data, body: norm.slice(end + 5) };
}

const q = (s) => JSON.stringify(String(s));

/** Deterministic frontmatter text for a schema definition (used by the migrator). */
export function formatFrontmatter(data) {
  const lines = ["---", `id: ${q(data.id)}`, `maturity: ${q(data.maturity)}`];
  if (data.summary) lines.push(`summary: ${q(data.summary)}`);
  if (data.special) lines.push(`special: ${q(data.special)}`);
  if (data.topJson) lines.push(`topJson: ${q(data.topJson)}`);
  lines.push("fields:");
  for (const f of data.fields ?? []) {
    let first = true;
    for (const [k, v] of Object.entries(f)) {
      const prefix = first ? "  - " : "    ";
      first = false;
      lines.push(`${prefix}${k}: ${typeof v === "string" ? q(v) : JSON.stringify(v)}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

/** Reconstruct the JSON Schema fragment for one frontmatter field. */
export function fieldToSchema(field) {
  if (field.schemaJson) return JSON.parse(field.schemaJson);
  if (field.ref) return { $ref: `./_defs.schema.json#/$defs/${field.ref}` };
  const schema = {};
  if (field.type !== undefined) schema.type = field.type;
  if (field.enum !== undefined) schema.enum = field.enum;
  for (const k of ["minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "minLength", "maxLength", "pattern", "minItems", "maxItems", "format"]) {
    if (field[k] !== undefined) schema[k] = field[k];
  }
  if (field.itemsRef) schema.items = { $ref: `./_defs.schema.json#/$defs/${field.itemsRef}` };
  else if (field.itemsType) {
    schema.items = { type: field.itemsType };
    if (field.itemsEnum !== undefined) schema.items.enum = field.itemsEnum;
  } else if (field.itemsSchemaJson) schema.items = JSON.parse(field.itemsSchemaJson);
  if (field.description) schema.description = field.description;
  return schema;
}

/** Build the full component JSON Schema from a frontmatter definition. */
export function buildComponentSchema(data) {
  if (data.special === "raw-top") {
    // Schemas whose top level is not a properties object (e.g. the
    // rig.node.param tagged union, which is oneOf-only).
    return {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: `https://rig.works/schemas/${data.id}.schema.json`,
      title: data.id,
      ...(data.topJson ? JSON.parse(data.topJson) : {}),
      "x-rig-maturity": data.maturity,
    };
  }
  const properties = {};
  const required = [];
  for (const f of data.fields ?? []) {
    properties[f.name] = fieldToSchema(f);
    if (f.required) required.push(f.name);
  }
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://rig.works/schemas/${data.id}.schema.json`,
    title: data.id,
    type: "object",
    additionalProperties: false,
    properties,
  };
  if (required.length) schema.required = required;
  if (data.topJson) Object.assign(schema, JSON.parse(data.topJson));
  schema["x-rig-maturity"] = data.maturity;
  return schema;
}

/** Human datatype label for a field, comparable to prose table Type cells. */
export function fieldTypeLabel(field) {
  if (field.ref) return field.ref;
  if (field.schemaJson) {
    try {
      const s = JSON.parse(field.schemaJson);
      if (s.$ref) return s.$ref.replace(/^\.\//, "").replace(/\.schema\.json$/, "").split("/").pop();
      if (s.enum) return "enum";
      if (s.type === "array") return "array";
      return s.type ?? "object";
    } catch { return "object"; }
  }
  if (field.enum) return "enum";
  if (field.type === "array") {
    const inner = field.itemsRef ?? (field.itemsEnum ? "enum" : field.itemsType) ?? "any";
    return `array<${inner}>`;
  }
  return field.type ?? "object";
}

export function walkFiles(dir, filter, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === "json" || name === "node_modules") continue;
      walkFiles(p, filter, out);
    } else if (filter(name)) out.push(p);
  }
  return out;
}

/** All prose schema files carrying frontmatter, as {file, data, body}. */
export function loadSchemaSources(root) {
  const schemasRoot = path.join(root, "schemas");
  const sources = [];
  for (const file of walkFiles(schemasRoot, (n) => n.endsWith(".md") && n !== "README.md")) {
    const text = fs.readFileSync(file, "utf8");
    const parsed = parseFrontmatter(text);
    if (!parsed) continue;
    sources.push({ file, rel: path.relative(root, file).split(path.sep).join("/"), ...parsed });
  }
  sources.sort((a, b) => a.data.id.localeCompare(b.data.id));
  return sources;
}

const cellsOf = (row) => row.split("|").slice(1, -1).map((c) => c.trim());

/** Rows of the first Field|Type|Meaning table in a prose file. */
export function parseFirstFieldTable(md) {
  const rows = [];
  let inTable = false;
  let done = false;
  for (const line of md.replace(/\r\n/g, "\n").split("\n")) {
    if (done) break;
    if (!line.startsWith("|")) { if (inTable) done = true; continue; }
    const cells = cellsOf(line);
    if (cells[0]?.toLowerCase() === "field" && cells.length >= 3) { inTable = true; continue; }
    if (!inTable || cells.length < 3) continue;
    const name = cells[0].replace(/`/g, "").trim();
    if (!name || /^-+$/.test(name)) continue;
    if (!rows.some((r) => r.name === name)) {
      rows.push({ name, type: cells[1].replace(/`/g, "").trim(), meaning: cells[2].trim() });
    }
  }
  return rows;
}

/** Rows of every Field|Type|Meaning table in a prose file (top-level + nested). */
export function parseFieldTables(md) {
  const rows = [];
  let inTable = false;
  for (const line of md.replace(/\r\n/g, "\n").split("\n")) {
    if (!line.startsWith("|")) { inTable = false; continue; }
    const cells = cellsOf(line);
    if (cells[0]?.toLowerCase() === "field" && cells.length >= 3) { inTable = true; continue; }
    if (!inTable || cells.length < 3) continue;
    const name = cells[0].replace(/`/g, "").trim();
    if (!name || /^-+$/.test(name)) continue;
    if (!rows.some((r) => r.name === name)) {
      rows.push({ name, type: cells[1].replace(/`/g, "").trim(), meaning: cells[2].trim() });
    }
  }
  return rows;
}

/** Clean a prose meaning cell to plain text for frontmatter/index use. */
export function cleanMeaning(cell) {
  return (cell ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
