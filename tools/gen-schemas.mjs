/**
 * Generate the machine grammar from the schema source of truth.
 *
 * Source: YAML frontmatter in schemas/<domain>/<name>.md
 * (see tools/schema-source.mjs for the dialect). This file contains no
 * per-schema catalog; the only hand-kept schemas here are the shared
 * _defs datatypes and the rig.document envelope, which are built from
 * the component id list.
 *
 * Run: node tools/gen-schemas.mjs          (write)
 *      node tools/gen-schemas.mjs --check  (fail if any output is stale)
 *
 * Outputs:
 *   schemas/json/*.schema.json        (canonical grammar)
 *   schemas/index.json                (AI/site catalog index)
 * The validator's packaged copy (tools/rig-validate/schemas/) is refreshed
 * from schemas/json/ at pack time by tools/rig-validate/pack.mjs - it is a
 * gitignored build artifact, so it is not an output of this script and a
 * fresh clone passes --check without it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaSources, buildComponentSchema, fieldTypeLabel, MATURITIES } from "./schema-source.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const normalize = (text) => text.replace(/\r\n/g, "\n");

const sources = loadSchemaSources(root);
if (!sources.length) {
  console.error("gen-schemas: no schema frontmatter found under schemas/");
  process.exit(1);
}
const ids = new Set();
for (const s of sources) {
  if (ids.has(s.data.id)) { console.error(`gen-schemas: duplicate schema id ${s.data.id} (${s.rel})`); process.exit(1); }
  ids.add(s.data.id);
  if (!MATURITIES.includes(s.data.maturity)) {
    console.error(`gen-schemas: ${s.data.id} has unknown maturity ${JSON.stringify(s.data.maturity)} (want ${MATURITIES.join(" | ")})`);
    process.exit(1);
  }
}

/* ---------- rig.document envelope (built from the component list) ---------- */

function buildDocumentSchema(componentIds) {
  const componentMapProperties = Object.fromEntries(
    componentIds.map((id) => [id, { $ref: `./${id}.schema.json` }])
  );
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://rig.works/schemas/rig.document.schema.json",
    title: "rig.document",
    description:
      "Rig JSON document envelope. Component keys must be rig.<domain>.<name> schema ids.",
    type: "object",
    additionalProperties: false,
    required: ["rig", "entities"],
    properties: {
      rig: {
        type: "string",
        description: "Contract version this document targets (e.g. 0.9.0).",
        pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$",
      },
      document: {
        type: "object",
        additionalProperties: true,
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          createdAt: { type: "string" },
          modifiedAt: { type: "string" },
          defaultUnit: { type: "string" },
          colorSpace: {
            type: "string",
            description: "Colour space for all rgba/rgb values (default: srgb).",
          },
          language: {
            type: "string",
            pattern: "^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$",
            description:
              "BCP 47 language tag for document text (e.g. en, en-GB). Hosts pick hyphenation and spelling resources from it - the region subtag matters (en-GB vs en-US patterns). Absent = host default.",
          },
          timeZone: {
            type: "string",
            description:
              "IANA time zone for wall-clock calendar fields (e.g. Australia/Sydney). Absent = host local.",
          },
          ifcSchema: {
            type: "string",
            enum: ["ifc2x3", "ifc4", "ifc4x3"],
            description:
              "IFC schema this document was derived from. Absent = not an IFC-derived document.",
          },
          pdfX: {
            type: "string",
            description:
              "PDF/X identification (e.g. PDF/X-4). Empty/absent = not a PDF/X job.",
          },
          outputCondition: {
            type: "string",
            description:
              "OutputIntent OutputConditionIdentifier (e.g. FOGRA39, CGATS TR 001).",
          },
          trapped: {
            type: "string",
            enum: ["unknown", "true", "false"],
            description: "PDF Info Trapped; absent = unknown.",
          },
        },
      },
      entities: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "components"],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              description: "Stable within this file; entity-typed fields reference these ids.",
            },
            components: {
              type: "object",
              propertyNames: {
                pattern: "^(rig|x)\\.[a-z0-9_]+\\.[a-z0-9_]+$",
              },
              additionalProperties: true,
              properties: componentMapProperties,
            },
          },
        },
      },
    },
    "x-rig-maturity": "stable",
  };
}

/* ---------- shared _defs datatypes (hand-kept; docs/properties.md) ---------- */

const defsSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/_defs.schema.json",
  $comment: "Shared property datatypes for Rig POD JSON interchange.",
  $defs: {
    bool: { type: "boolean" },
    int: { type: "integer" },
    uint: { type: "integer", minimum: 0 },
    uint8: { type: "integer", minimum: 0, maximum: 255 },
    uint32: { type: "integer", minimum: 0, maximum: 4294967295 },
    float: { type: "number" },
    double: { type: "number" },
    string: { type: "string" },
    vec2: { type: "array", minItems: 2, maxItems: 2, items: { type: "number" } },
    vec3: { type: "array", minItems: 3, maxItems: 3, items: { type: "number" } },
    vec4: { type: "array", minItems: 4, maxItems: 4, items: { type: "number" } },
    quat: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: { type: "number" },
      $comment: "Order: x, y, z, w",
    },
    rgba: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
    rgb: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "number", minimum: 0, maximum: 1 },
    },
    entity: {
      type: ["string", "null"],
      $comment: "Entity id within the document; null = none / unset",
    },
    curve: {
      type: "object",
      description: "1D transfer curve — see schemas/anim/curve.md / rig.anim.curve",
      additionalProperties: false,
      properties: {
        points: { type: "array", minItems: 2, items: { $ref: "#/$defs/vec2" } },
        interpolation: { type: "string", enum: ["linear", "smooth", "bezier"] },
        handles: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              in: { $ref: "#/$defs/vec2" },
              out: { $ref: "#/$defs/vec2" },
            },
          },
        },
        preset: {
          type: "string",
          enum: ["linear", "ease-in", "ease-out", "ease-in-out", "s-curve", "bulge", "squeeze", "custom"],
        },
      },
      required: ["points"],
    },
    faceInsets: {
      description:
        "Page/zone face insets: number or array length 1–6 (CSS XY + optional Z pair). Channels: top,right,bottom,left,floor,ceiling.",
      oneOf: [
        { type: "number" },
        { type: "array", minItems: 1, maxItems: 6, items: { type: "number" } },
      ],
    },
    propertyType: {
      type: "string",
      description: "Property datatype id from docs/properties.md (or host-prefixed).",
    },
  },
};

/* ---------- assemble outputs ---------- */

const outputs = new Map(); // absolute path -> content
const outJson = (rel, obj) => outputs.set(path.join(root, rel), JSON.stringify(obj, null, 2) + "\n");

const componentIds = sources.filter((s) => s.data.special !== "document").map((s) => s.data.id).sort();
for (const s of sources) {
  const schema = s.data.special === "document"
    ? buildDocumentSchema(componentIds)
    : buildComponentSchema(s.data);
  outJson(path.join("schemas", "json", `${s.data.id}.schema.json`), schema);
}
outJson(path.join("schemas", "json", "_defs.schema.json"), defsSchema);

const version = normalize(fs.readFileSync(path.join(root, "VERSION"), "utf8")).trim();
const index = {
  version,
  generatedBy: "tools/gen-schemas.mjs - do not hand-edit; edit frontmatter in schemas/<domain>/<name>.md",
  schemas: sources.map((s) => ({
    id: s.data.id,
    maturity: s.data.maturity,
    summary: s.data.summary ?? "",
    prose: s.rel,
    schema: `schemas/json/${s.data.id}.schema.json`,
    fields: (s.data.fields ?? []).map((f) => ({
      name: f.name,
      type: fieldTypeLabel(f),
      required: Boolean(f.required),
      ...(f.meaning ? { meaning: f.meaning } : {}),
      ...(f.absent ? { absent: f.absent } : {}),
      ...(f.enum ? { enum: f.enum } : {}),
    })),
  })),
};
outJson(path.join("schemas", "index.json"), index);

/* ---------- write or check ---------- */

const stale = [];
for (const [file, expected] of outputs) {
  const actual = fs.existsSync(file) ? normalize(fs.readFileSync(file, "utf8")) : null;
  if (actual !== expected) stale.push(path.relative(root, file));
}
// Files that generation no longer produces are stale too.
for (const dir of [path.join(root, "schemas", "json")]) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    const file = path.join(dir, name);
    if (!outputs.has(file)) stale.push(path.relative(root, file));
  }
}

if (checkOnly) {
  if (stale.length) {
    console.error("generated schema outputs are out of date - run: node tools/gen-schemas.mjs");
    for (const f of stale) console.error("  ", f);
    process.exit(1);
  }
  console.log(`schemas up to date - ${sources.length} schemas (grammar + index)`);
} else {
  for (const [file, content] of outputs) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // Skip unchanged files: rewriting hundreds of identical files is slow
    // and trips over transient file locks on Windows.
    const actual = fs.existsSync(file) ? normalize(fs.readFileSync(file, "utf8")) : null;
    if (actual !== content) fs.writeFileSync(file, content);
  }
  for (const rel of stale) {
    const file = path.join(root, rel);
    if (!outputs.has(file) && fs.existsSync(file)) fs.rmSync(file);
  }
  console.log(`generated ${outputs.size} files from ${sources.length} schema sources`);
}
