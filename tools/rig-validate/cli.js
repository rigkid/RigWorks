#!/usr/bin/env node
/**
 * Scaffold and validate Rig documents.
 *
 *   node tools/rig-validate/cli.js init my-scene
 *   node tools/rig-validate/cli.js path/to/doc.json
 *   node tools/rig-validate/cli.js validate --strict examples/*.json
 *
 * Envelope, per-component fields, duplicate ids, and dangling entity refs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isRigzPath, openRigz } from "./rigz.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const repoSchemas = path.join(repoRoot, "schemas", "json");
const packagedSchemas = path.join(__dirname, "schemas");
const schemaDir = fs.existsSync(repoSchemas) ? repoSchemas : packagedSchemas;
const starterPath = fs.existsSync(path.join(repoRoot, "examples", "minimal-scene.json"))
  ? path.join(repoRoot, "examples", "minimal-scene.json")
  : path.join(__dirname, "starter.rig");
const versionFile = fs.existsSync(path.join(repoRoot, "VERSION"))
  ? path.join(repoRoot, "VERSION")
  : path.join(__dirname, "VERSION");

const args = process.argv.slice(2);
const help = args.length === 0 || args.includes("--help") || args.includes("-h") || args[0] === "help";

function usage() {
  console.log(`Usage:
  rigkit init <name>                  write <name>/scene.rig
  rigkit validate [--strict] <file>...
  rigkit [--strict] <file>...         same as validate

A Rig document is JSON. On disk: .rig, or .rigz (ZIP of one .rig plus data/).`);
}

if (help) {
  usage();
  process.exit(args.length === 0 ? 2 : 0);
}

if (args[0] === "init") {
  const name = args[1];
  if (!name || name.startsWith("-")) {
    console.error("Usage: rigkit init <name>");
    process.exit(2);
  }
  if (!fs.existsSync(starterPath)) {
    console.error("starter document is missing from this install");
    process.exit(1);
  }
  const destDir = path.resolve(process.cwd(), name);
  const dest = path.join(destDir, "scene.rig");
  if (fs.existsSync(dest)) {
    console.error(`refusing to overwrite ${path.relative(process.cwd(), dest) || dest}`);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(starterPath, dest);
  const shown = path.relative(process.cwd(), dest) || dest;
  console.log(`wrote ${shown}`);
  console.log("Open in the viewer: https://viewer.rig.works — drag the file in.");
  process.exit(0);
}

const rest = args[0] === "validate" ? args.slice(1) : args;
const strict = rest.includes("--strict");
const files = rest.filter((a) => a !== "--strict" && !a.startsWith("-"));

if (files.length === 0) {
  usage();
  process.exit(2);
}

const { default: Ajv2020 } = await import("ajv/dist/2020.js");
const { default: addFormats } = await import("ajv-formats");

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** Raw schema JSON by component id, for entity-reference walking. */
const rawSchemas = new Map();

function loadAllSchemas(ajv) {
  const names = fs.readdirSync(schemaDir).filter((n) => n.endsWith(".schema.json"));
  for (const name of names) {
    const schema = loadJson(path.join(schemaDir, name));
    ajv.addSchema(schema);
    rawSchemas.set(name.replace(/\.schema\.json$/, ""), schema);
  }
  return names;
}

const ENTITY_REF = "./_defs.schema.json#/$defs/entity";

/**
 * Walk a schema and an instance together, collecting every entity-typed value.
 * Handles nested objects, arrays, and tagged unions.
 */
function collectEntityRefs(schema, value, pointer, out) {
  if (!schema || typeof schema !== "object" || value === undefined) return;

  if (schema.$ref === ENTITY_REF) {
    if (typeof value === "string") out.push({ pointer, id: value });
    return;
  }

  for (const branch of schema.oneOf ?? schema.anyOf ?? schema.allOf ?? []) {
    collectEntityRefs(branch, value, pointer, out);
  }

  if (schema.properties && value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, sub] of Object.entries(schema.properties)) {
      collectEntityRefs(sub, value[key], `${pointer}/${key}`, out);
    }
  }

  if (schema.items && Array.isArray(value)) {
    value.forEach((item, i) => collectEntityRefs(schema.items, item, `${pointer}/${i}`, out));
  }
}

function repoVersion() {
  try {
    return fs.readFileSync(versionFile, "utf8").trim();
  } catch {
    return null;
  }
}

function isNewerThan(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0);
  }
  return false;
}

if (!fs.existsSync(schemaDir)) {
  console.error("Failed to load schemas — this install is missing the catalog");
  process.exit(1);
}

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  validateSchema: false,
});
addFormats(ajv);
loadAllSchemas(ajv);

const validateDoc = ajv.getSchema("https://rig.works/schemas/rig.document.schema.json");
if (!validateDoc) {
  console.error("Failed to load rig.document schema");
  process.exit(1);
}

/* ----- unknown-id suggestions ----- */

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

const knownSchemaIds = [...rawSchemas.keys()].filter((id) => id !== "_defs" && id !== "rig.document");

function suggestSchemaIds(id) {
  const limit = Math.max(2, Math.floor(id.length / 3));
  return knownSchemaIds
    .map((candidate) => ({ candidate, distance: editDistance(id, candidate) }))
    .filter(({ distance }) => distance <= limit)
    .sort((a, b) => a.distance - b.distance || a.candidate.localeCompare(b.candidate))
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

/* ----- semantic checks (rules the prose states but JSON Schema cannot) -----
 * Field-level constraints (ranges, enums) live in the schema frontmatter and
 * are enforced by AJV. The checks below are document-level: conflicts between
 * components on one entity, graph cycles, duplicate durable ids, unit
 * quaternions, and required compositions. */

// Component that only means something composed with another on the same entity.
const REQUIRED_COMPOSITION = {
  "rig.sensor.depth": "rig.spatial.camera",
  "rig.vr.eye": "rig.spatial.camera",
  "rig.sensor.gnss": "rig.place.geo",
};

function semanticChecks(data, errors) {
  const entities = data.entities;
  const byId = new Map();
  entities.forEach((ent, ei) => { if (ent?.id && !byId.has(ent.id)) byId.set(ent.id, ei); });

  const stableIds = new Map();
  entities.forEach((ent, ei) => {
    const comps = ent?.components ?? {};
    const base = `/entities/${ei}/components`;

    const stableId = comps["rig.meta.named"]?.stableId;
    if (typeof stableId === "string" && stableId !== "") {
      if (stableIds.has(stableId)) {
        errors.push({
          level: "error",
          path: `${base}/rig.meta.named/stableId`,
          message: `duplicate stableId "${stableId}" (also on entity ${stableIds.get(stableId)})`,
        });
      } else stableIds.set(stableId, ei);
    }

    const rotation = comps["rig.spatial.transform"]?.rotation;
    if (Array.isArray(rotation) && rotation.length === 4 && rotation.every((n) => typeof n === "number")) {
      const length = Math.hypot(...rotation);
      if (Math.abs(length - 1) > 0.01) {
        errors.push({
          level: "error",
          path: `${base}/rig.spatial.transform/rotation`,
          message: `rotation must be a unit quaternion (x, y, z, w); length is ${length.toFixed(3)}`,
        });
      }
    }

    if (comps["rig.paint.fill"] && comps["rig.paint.fill_stroke"]?.fillRgba !== undefined) {
      errors.push({
        level: "error",
        path: `${base}/rig.paint.fill`,
        message: "entity carries both rig.paint.fill (referenced fill) and rig.paint.fill_stroke fillRgba (inline fill); choose one spelling",
      });
    }
    if (comps["rig.paint.stroke"] && comps["rig.paint.fill_stroke"]?.strokeRgba !== undefined) {
      errors.push({
        level: "error",
        path: `${base}/rig.paint.stroke`,
        message: "entity carries both rig.paint.stroke (referenced stroke) and rig.paint.fill_stroke strokeRgba (inline stroke); choose one spelling",
      });
    }

    for (const [needs, requires] of Object.entries(REQUIRED_COMPOSITION)) {
      if (comps[needs] && !comps[requires]) {
        errors.push({
          level: "error",
          path: `${base}/${needs}`,
          message: `${needs} composes ${requires} on the same entity; that component is missing`,
        });
      }
    }

    // Cross-field rules: two fields of one component that only make
    // sense together (ranges, ordered sequences, date spans).
    const ring = comps["rig.geometry.ring"];
    if (ring && typeof ring.innerRadius === "number" && typeof ring.outerRadius === "number" && ring.innerRadius >= ring.outerRadius) {
      errors.push({ level: "error", path: `${base}/rig.geometry.ring/innerRadius`, message: `innerRadius (${ring.innerRadius}) must be smaller than outerRadius (${ring.outerRadius})` });
    }
    const axis = comps["rig.font.axis"];
    if (axis && typeof axis.min === "number" && typeof axis.max === "number") {
      if (axis.min >= axis.max) {
        errors.push({ level: "error", path: `${base}/rig.font.axis/min`, message: `axis min (${axis.min}) must be smaller than max (${axis.max})` });
      } else if (typeof axis.default === "number" && (axis.default < axis.min || axis.default > axis.max)) {
        errors.push({ level: "error", path: `${base}/rig.font.axis/default`, message: `axis default (${axis.default}) must lie between min (${axis.min}) and max (${axis.max})` });
      }
    }
    const span = comps["rig.calendar.span"];
    if (span && Date.parse(span.endDate) < Date.parse(span.startDate)) {
      errors.push({ level: "error", path: `${base}/rig.calendar.span/endDate`, message: `endDate (${span.endDate}) is before startDate (${span.startDate})` });
    }
    const event = comps["rig.calendar.event"];
    if (event?.endDate && Date.parse(event.endDate) < Date.parse(event.startDate)) {
      errors.push({ level: "error", path: `${base}/rig.calendar.event/endDate`, message: `endDate (${event.endDate}) is before startDate (${event.startDate})` });
    }
    const pattern = comps["rig.music.pattern"];
    if (pattern && typeof pattern.loopStartStep === "number" && typeof pattern.loopEndStep === "number" && pattern.loopEndStep < pattern.loopStartStep) {
      errors.push({ level: "error", path: `${base}/rig.music.pattern/loopEndStep`, message: `loopEndStep (${pattern.loopEndStep}) is before loopStartStep (${pattern.loopStartStep})` });
    }
    const spline = comps["rig.geometry.spline"];
    if (Array.isArray(spline?.knots) && spline.knots.some((k, i) => i > 0 && k < spline.knots[i - 1])) {
      errors.push({ level: "error", path: `${base}/rig.geometry.spline/knots`, message: "spline knots must be non-decreasing" });
    }
    const stops = comps["rig.paint.gradient"]?.stops;
    if (Array.isArray(stops)) {
      const offsets = stops.map((s) => (typeof s?.t === "number" ? s.t : s?.offset)).filter((o) => typeof o === "number");
      if (offsets.some((o) => o < 0 || o > 1)) {
        errors.push({ level: "error", path: `${base}/rig.paint.gradient/stops`, message: "gradient stop offsets must lie between 0 and 1" });
      } else if (offsets.some((o, i) => i > 0 && o < offsets[i - 1])) {
        errors.push({ level: "error", path: `${base}/rig.paint.gradient/stops`, message: "gradient stop offsets must be non-decreasing" });
      }
    }
  });

  // Parent cycles in rig.spatial.relationship.
  const parentOf = new Map();
  entities.forEach((ent) => {
    const parent = ent?.components?.["rig.spatial.relationship"]?.parent;
    if (ent?.id && typeof parent === "string") parentOf.set(ent.id, parent);
  });
  const reportedCycles = new Set();
  for (const start of parentOf.keys()) {
    const seen = new Map();
    let current = start;
    while (current && parentOf.has(current)) {
      if (seen.has(current)) {
        const cycle = [...seen.keys()].slice(seen.get(current)).sort().join(",");
        if (!reportedCycles.has(cycle)) {
          reportedCycles.add(cycle);
          errors.push({
            level: "error",
            path: `/entities/${byId.get(start)}/components/rig.spatial.relationship/parent`,
            message: `parent cycle detected: ${[...cycle.split(","), cycle.split(",")[0]].join(" -> ")}`,
          });
        }
        break;
      }
      seen.set(current, seen.size);
      current = parentOf.get(current);
    }
  }
}

let failed = false;

for (const file of files) {
  const abs = path.resolve(file);
  let data;
  let packWarn = null;
  try {
    if (isRigzPath(abs)) {
      const pack = openRigz(fs.readFileSync(abs));
      packWarn = pack.hasData
        ? null
        : "package has no data/ folder — sidecar files live there";
      data = JSON.parse(pack.jsonText);
    } else {
      data = loadJson(abs);
    }
  } catch (err) {
    const kind = isRigzPath(abs) && err instanceof SyntaxError
      ? "cannot parse JSON"
      : isRigzPath(abs)
        ? "cannot open .rigz"
        : "cannot parse JSON";
    console.error(`${file}: ${kind} — ${err.message}`);
    failed = true;
    continue;
  }

  const ok = validateDoc(data);
  const errors = [];
  if (packWarn) {
    errors.push({ level: "warn", path: "/", message: packWarn });
  }

  if (!ok) {
    for (const e of validateDoc.errors ?? []) {
      errors.push({
        level: "error",
        path: e.instancePath || "/",
        message: `${e.message}${e.params ? " " + JSON.stringify(e.params) : ""}`,
      });
    }
  }

  const version = repoVersion();
  if (version && typeof data?.rig === "string" && isNewerThan(data.rig, version)) {
    errors.push({
      level: "warn",
      path: "/rig",
      message: `document targets ${data.rig}, but this catalog is ${version}`,
    });
  }

  if (Array.isArray(data?.entities)) {
    // Entity id uniqueness
    const ids = new Set();
    for (const ent of data.entities) {
      if (!ent?.id) continue;
      if (ids.has(ent.id)) {
        errors.push({
          level: "error",
          path: `/entities`,
          message: `duplicate entity id "${ent.id}"`,
        });
      }
      ids.add(ent.id);
    }

    // Per-component validation (catches unknown ids + deep field errors)
    const refs = [];
    const reportedExperimental = new Set();
    data.entities.forEach((ent, ei) => {
      const comps = ent?.components;
      if (!comps || typeof comps !== "object") return;
      for (const [schemaId, payload] of Object.entries(comps)) {
        const base = `/entities/${ei}/components/${schemaId}`;

        // x.<vendor>.<name> is a host component the Contract has not named.
        // There is no schema to check it against, so report it and move on —
        // reporting is the point, since none of it is portable.
        if (schemaId.startsWith("x.")) {
          errors.push({
            level: "note",
            path: base,
            message: `extension component "${schemaId}" — carried, not portable`,
          });
          continue;
        }

        const schemaUri = `https://rig.works/schemas/${schemaId}.schema.json`;
        const validateComp = ajv.getSchema(schemaUri);
        if (!validateComp) {
          const suggestions = suggestSchemaIds(schemaId);
          errors.push({
            level: strict ? "error" : "warn",
            path: base,
            message: `unknown schema id "${schemaId}"${suggestions.length ? ` - did you mean ${suggestions.map((s) => `"${s}"`).join(", ")}?` : ""}`,
          });
          continue;
        }
        // Maturity is surfaced at emission time: experimental ids may
        // change in any minor, so say so once per document.
        if (rawSchemas.get(schemaId)?.["x-rig-maturity"] === "experimental" && !reportedExperimental.has(schemaId)) {
          reportedExperimental.add(schemaId);
          errors.push({
            level: "note",
            path: base,
            message: `experimental schema id "${schemaId}" - may change in any minor release`,
          });
        }
        if (!validateComp(payload)) {
          for (const e of validateComp.errors ?? []) {
            errors.push({
              level: "error",
              path: `${base}${e.instancePath || ""}`,
              message: e.message,
            });
          }
        }
        collectEntityRefs(rawSchemas.get(schemaId), payload, base, refs);
      }
    });

    // Dangling entity references (null means "none" and is valid)
    for (const { pointer, id } of refs) {
      if (!ids.has(id)) {
        errors.push({
          level: "error",
          path: pointer,
          message: `entity reference "${id}" matches no entity id in this document`,
        });
      }
    }

    semanticChecks(data, errors);
  }

  // The envelope schema embeds every component schema and the per-component
  // pass validates them again; identical reports are one report.
  const seenErrors = new Set();
  const uniqueErrors = errors.filter((e) => {
    // Envelope reports carry AJV params ("... {\"limit\":0}"); per-component
    // reports of the same fault do not. Normalize before comparing.
    const key = `${e.level}|${e.path}|${e.message.replace(/ \{.*\}$/, "")}`;
    if (seenErrors.has(key)) return false;
    seenErrors.add(key);
    return true;
  });
  errors.length = 0;
  errors.push(...uniqueErrors);

  const hard = errors.filter((e) => e.level === "error");
  const soft = errors.filter((e) => e.level === "warn");

  // Notes report extension components. They are listed but never change the
  // verdict, so a host carrying its own components still validates clean.
  if (hard.length) failed = true;
  console.log(`${hard.length ? "FAIL" : soft.length ? "WARN" : "ok  "} ${file}`);
  for (const e of errors) {
    console.log(`  [${e.level}] ${e.path}: ${e.message}`);
  }
}

process.exit(failed ? 1 : 0);
