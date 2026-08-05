/**
 * Emit schemas/json/rig.*.schema.json from an inline catalog.
 * Run: node tools/gen-schemas.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "schemas", "json");

const ref = (name) => ({ $ref: `./_defs.schema.json#/$defs/${name}` });

function objectSchema(id, properties, opts = {}) {
  const required = opts.required ?? Object.keys(properties);
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://rig.works/schemas/${id}.schema.json`,
    title: id,
    type: "object",
    additionalProperties: false,
    properties,
  };
  if (required.length) schema.required = required;
  if (opts.description) schema.description = opts.description;
  if (opts.allOf) schema.allOf = opts.allOf;
  if (opts.oneOf) schema.oneOf = opts.oneOf;
  if (opts.minProperties !== undefined) schema.minProperties = opts.minProperties;
  return schema;
}

function enumOf(values) {
  return { type: "string", enum: values };
}

/** @type {Record<string, object>} */
const catalog = {};

function add(id, properties, opts) {
  catalog[id] = objectSchema(id, properties, opts);
}

// --- spatial ---
add("rig.spatial.transform", {
  position: ref("vec3"),
  rotation: ref("quat"),
  scale: ref("vec3"),
});

add("rig.spatial.relationship", {
  parent: ref("entity"),
});

add(
  "rig.spatial.group",
  {},
  {
    required: [],
    description: "Marker: presence means scene group root. No fields.",
    minProperties: 0,
  }
);

add("rig.spatial.camera", {
  active: ref("bool"),
  projection: enumOf(["perspective", "orthographic"]),
  fovYDegrees: ref("float"),
  orthoHeight: ref("float"),
  nearClip: ref("float"),
  farClip: ref("float"),
  aspect: ref("float"),
});

add("rig.spatial.layer", {
  order: ref("int"),
  visible: ref("bool"),
  locked: ref("bool"),
  rgba: ref("rgba"),
});

// --- geometry ---
add("rig.geometry.shape", {
  type: enumOf(["rectangle", "ellipse", "line", "polygon", "star"]),
  x1: ref("float"),
  y1: ref("float"),
  x2: ref("float"),
  y2: ref("float"),
  sides: ref("int"),
  innerRadius: ref("float"),
});

const pathCommand = {
  type: "object",
  additionalProperties: false,
  required: ["type"],
  properties: {
    type: enumOf(["moveTo", "lineTo", "cubicTo", "quadTo", "close"]),
    p: ref("vec2"),
    c1: ref("vec2"),
    c2: ref("vec2"),
  },
};

add("rig.geometry.path", {
  commands: { type: "array", items: pathCommand },
});

add("rig.geometry.mesh", {
  positions: {
    oneOf: [
      { type: "array", items: { type: "number" } },
      { type: "array", items: ref("vec3") },
    ],
  },
  indices: { type: "array", items: ref("uint32") },
  texcoords: {
    oneOf: [
      { type: "array", items: { type: "number" } },
      { type: "array", items: ref("vec2") },
    ],
  },
  mode: enumOf(["triangles", "lines", "lineStrip"]),
  faceColors: { type: "array", items: ref("rgba") },
  facePalette: { type: "array", items: ref("uint8") },
}, { required: ["positions", "mode"] });

// --- paint ---
add("rig.paint.fill_stroke", {
  fillRgba: ref("rgba"),
  strokeRgba: ref("rgba"),
  strokeWidth: ref("float"),
  hasFill: ref("bool"),
  hasStroke: ref("bool"),
});

add("rig.paint.solid", {
  rgba: ref("rgba"),
  cmyk: ref("vec4"),
}, { required: ["rgba"] });

add("rig.paint.gradient", {
  kind: enumOf(["linear", "radial"]),
  stops: {
    type: "array",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["t", "rgba"],
      properties: {
        t: { type: "number", minimum: 0, maximum: 1 },
        rgba: ref("rgba"),
      },
    },
  },
  p0: ref("vec2"),
  p1: ref("vec2"),
});

// --- meta / render ---
add("rig.meta.named", {
  name: ref("string"),
  stableId: ref("string"),
}, { required: ["name"] });

add("rig.render.light", {
  enabled: ref("bool"),
  type: enumOf(["directional", "point"]),
  rgb: ref("rgb"),
  intensity: ref("float"),
  ambient: ref("float"),
  banded: ref("bool"),
  bands: ref("int"),
});

add("rig.render.material", {
  albedoRgb: ref("rgb"),
  albedoMap: ref("entity"),
  metallic: ref("float"),
  roughness: ref("float"),
  emissive: ref("rgb"),
});

// --- anim / mod ---
add("rig.anim.tween", {
  target: ref("entity"),
  propertyKey: ref("string"),
  from: ref("float"),
  to: ref("float"),
  duration: ref("float"),
  elapsed: ref("float"),
  easing: enumOf(["linear", "easeIn", "easeOut", "easeInOut"]),
  loop: ref("bool"),
  playing: ref("bool"),
});

add("rig.mod.lfo", {
  waveform: enumOf(["sine", "tri", "saw", "square"]),
  frequency: ref("float"),
  amplitude: ref("float"),
  offset: ref("float"),
  phase: ref("float"),
});

add("rig.mod.binding", {
  source: ref("entity"),
  target: ref("entity"),
  propertyKey: ref("string"),
  depth: ref("float"),
  min: ref("float"),
  max: ref("float"),
  additive: ref("bool"),
});

// --- music ---
add("rig.music.transport", {
  playing: ref("bool"),
  bpm: ref("float"),
  timeSigNum: ref("int"),
  timeSigDen: ref("int"),
  positionBeats: ref("float"),
  loop: ref("bool"),
  loopStartBeats: ref("float"),
  loopEndBeats: ref("float"),
});

add("rig.music.clock", {
  ticksPerQuarter: ref("int"),
  phaseTicks: ref("float"),
  swingAmount: ref("float"),
  swingSubdiv: ref("int"),
  externalSync: ref("bool"),
  syncBeat: ref("float"),
  syncPhase: ref("float"),
  syncPeriodBars: ref("float"),
});

add("rig.music.step", {
  active: ref("bool"),
  pitch: { type: "integer", minimum: 0, maximum: 127 },
  velocity: { type: "integer", minimum: 0, maximum: 127 },
  gate: { type: "number", minimum: 0, maximum: 1 },
});

add("rig.music.pattern", {
  steps: {
    type: "array",
    items: { $ref: "./rig.music.step.schema.json" },
  },
  rootNote: { type: "integer", minimum: 0, maximum: 127 },
  scale: enumOf(["chromatic", "major", "minor", "dorian", "pentatonic"]),
});

add("rig.music.sequencer", {
  pattern: ref("entity"),
  currentStep: ref("int"),
  clock: ref("entity"),
});

add("rig.music.note", {
  pitch: { type: "integer", minimum: 0, maximum: 127 },
  velocity: { type: "integer", minimum: 0, maximum: 127 },
  channel: { type: "integer", minimum: 0, maximum: 15 },
  start: ref("float"),
  duration: ref("float"),
  clip: ref("entity"),
});

add("rig.music.midi_output", {
  portName: ref("string"),
  open: ref("bool"),
});

// --- media ---
add("rig.media.asset_ref", {
  kind: enumOf(["image", "audio", "video", "model", "font", "other"]),
  path: ref("string"),
  loop: ref("bool"),
});

add("rig.media.text", {
  text: ref("string"),
  font: ref("entity"),
  fontSize: ref("float"),
  rgba: ref("rgba"),
});

add("rig.media.code", {
  text: ref("string"),
  language: ref("string"),
  readOnly: ref("bool"),
});

// --- pixel ---
add("rig.pixel.canvas", {
  width: ref("int"),
  height: ref("int"),
  clearRgba: ref("rgba"),
});

add("rig.pixel.source", {
  kind: enumOf(["none", "imageFile", "generator", "imageSequence", "webcam", "videoFile"]),
  asset: ref("entity"),
  generatorName: ref("string"),
  sequenceFps: ref("float"),
  sequenceFrame: ref("int"),
  webcamDevice: ref("int"),
  webcamWidth: ref("int"),
  webcamHeight: ref("int"),
  videoTime: ref("float"),
});

add("rig.pixel.layer", {
  kind: enumOf(["vector", "overlayImage", "solid", "group"]),
  blendMode: enumOf(["normal", "multiply", "screen", "overlay", "add"]),
  opacity: { type: "number", minimum: 0, maximum: 1 },
  image: ref("entity"),
  rgba: ref("rgba"),
  maskSource: enumOf(["none", "luma", "alpha", "path"]),
  maskAsset: ref("entity"),
  maskLayer: ref("entity"),
  maskPathEntity: ref("entity"),
  invertMask: ref("bool"),
  groupParent: ref("entity"),
});

add("rig.pixel.raster", {
  role: enumOf(["working", "output", "layerPixels", "mask", "composite"]),
  width: ref("int"),
  height: ref("int"),
  rgba: { type: "array", items: ref("uint8") },
});

const effectStep = {
  type: "object",
  additionalProperties: false,
  required: ["id", "stage", "effectId", "enabled"],
  properties: {
    id: ref("uint"),
    stage: enumOf(["image", "draw", "generate"]),
    effectId: ref("string"),
    enabled: ref("bool"),
    parentStep: ref("uint"),
  },
};

add("rig.pixel.effect_chain", {
  steps: { type: "array", items: effectStep },
  nextId: ref("uint"),
});

// --- io / led / sensor / interact ---
add("rig.io.osc", {
  listenEnabled: ref("bool"),
  listenPort: ref("int"),
  sendEnabled: ref("bool"),
  sendHost: ref("string"),
  sendPort: ref("int"),
  addressPrefix: ref("string"),
}, { required: ["listenEnabled", "listenPort", "sendEnabled", "sendHost", "sendPort"] });

add("rig.io.serial", {
  port: ref("string"),
  baud: ref("int"),
  enabled: ref("bool"),
});

add("rig.led.uv_map", {
  width: ref("int"),
  height: ref("int"),
  pixels: {
    type: "array",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["index", "u", "v"],
      properties: {
        index: ref("int"),
        u: ref("float"),
        v: ref("float"),
      },
    },
  },
});

add("rig.sensor.gpio", {
  pin: ref("int"),
  mode: enumOf(["in", "out"]),
  level: { type: "number", minimum: 0, maximum: 1 },
  device: ref("entity"),
});

add("rig.interact.selectable", {
  enabled: ref("bool"),
});

// --- ui (control surfaces: desktop, web, ESP) ---
add("rig.ui.panel", {
  order: ref("int"),
  visible: ref("bool"),
});

add(
  "rig.ui.control",
  {
    panel: ref("entity"),
    order: ref("int"),
    target: ref("entity"),
    propertyKey: ref("string"),
    type: ref("propertyType"),
    min: ref("float"),
    max: ref("float"),
    step: ref("float"),
    enabled: ref("bool"),
    readOnly: ref("bool"),
    options: { type: "array", items: ref("string") },
    widget: enumOf([
      "auto",
      "slider",
      "knob",
      "toggle",
      "field",
      "dropdown",
      "color",
      "xy",
    ]),
  },
  {
    required: ["panel", "order", "target", "propertyKey", "type"],
    description:
      "View over one POD field — never a second store. widget is an advisory hint a host may ignore.",
  }
);

add(
  "rig.ui.action",
  {
    panel: ref("entity"),
    order: ref("int"),
    actionId: ref("string"),
    enabled: ref("bool"),
  },
  {
    required: ["panel", "order", "actionId"],
    description:
      "Command button. actionId is a host-owned catalog id (like node.typeId). Most likely to change before 1.0.0.",
  }
);

// --- node (nested types first as standalone schemas for $ref) ---
add("rig.node.pin", {
  id: ref("uint"),
  name: ref("string"),
  kind: enumOf(["in", "out"]),
  type: ref("propertyType"),
});

// rig.node.param is defined below as a oneOf-only tagged union.

add("rig.node.link", {
  id: ref("uint"),
  fromNode: ref("uint"),
  fromPin: ref("uint"),
  toNode: ref("uint"),
  toPin: ref("uint"),
});

add("rig.node.publish", {
  pin: ref("uint"),
  innerNode: ref("uint"),
  innerPin: ref("uint"),
});

// node + graph: mutual recursion via $ref
catalog["rig.node.node"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.node.schema.json",
  title: "rig.node.node",
  type: "object",
  additionalProperties: false,
  required: ["id", "typeId", "title", "pos", "pins", "params"],
  properties: {
    id: ref("uint"),
    typeId: ref("string"),
    title: ref("string"),
    pos: ref("vec2"),
    pins: { type: "array", items: { $ref: "./rig.node.pin.schema.json" } },
    params: { type: "array", items: { $ref: "./rig.node.param.schema.json" } },
    nested: { $ref: "./rig.node.graph.schema.json" },
    publishes: {
      type: "array",
      items: { $ref: "./rig.node.publish.schema.json" },
    },
  },
};

catalog["rig.node.graph"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.graph.schema.json",
  title: "rig.node.graph",
  type: "object",
  additionalProperties: false,
  required: ["nodes", "links", "nextId"],
  properties: {
    nodes: { type: "array", items: { $ref: "./rig.node.node.schema.json" } },
    links: { type: "array", items: { $ref: "./rig.node.link.schema.json" } },
    nextId: ref("uint"),
  },
};

// Param is a tagged union: only the storage field selected by `type` may be present,
// so it is oneOf-only rather than a properties/required object schema.
catalog["rig.node.param"] = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rig.works/schemas/rig.node.param.schema.json",
  title: "rig.node.param",
  description:
    "Serialize key, type, and only the storage field selected by type (f/i/s/v).",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "f"],
      properties: {
        key: ref("string"),
        type: { const: "float" },
        f: ref("float"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "f"],
      properties: {
        key: ref("string"),
        type: { const: "double" },
        f: ref("float"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "i"],
      properties: {
        key: ref("string"),
        type: { enum: ["bool", "int", "uint", "enum", "entity"] },
        i: ref("int"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "s"],
      properties: {
        key: ref("string"),
        type: { const: "string" },
        s: ref("string"),
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["key", "type", "v"],
      properties: {
        key: ref("string"),
        type: { enum: ["vec2", "vec3", "vec4", "quat"] },
        v: ref("vec4"),
      },
    },
  ],
};

// Document envelope
const componentIds = Object.keys(catalog).filter((id) => id !== "_defs").sort();
const componentMapProperties = Object.fromEntries(
  componentIds.map((id) => [id, { $ref: `./${id}.schema.json` }])
);

catalog["rig.document"] = {
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
      description: "Contract version this document targets (e.g. 0.4.0).",
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
              pattern: "^rig\\.[a-z0-9_]+\\.[a-z0-9_]+$",
            },
            additionalProperties: true,
            properties: componentMapProperties,
          },
        },
      },
    },
  },
};


// Shared POD datatype defs (previously hand-maintained as schemas/json/_defs.schema.json)
catalog["_defs"] = {
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
    propertyType: {
      type: "string",
      description: "Property datatype id from docs/properties.md (or host-prefixed).",
    },
  },
};

const checkOnly = process.argv.includes("--check");

// Working trees with core.autocrlf check these files out as CRLF; compare content, not bytes.
const normalize = (text) => text.replace(/\r\n/g, "\n");

if (checkOnly) {
  const stale = [];
  for (const [id, schema] of Object.entries(catalog)) {
    const file = path.join(outDir, `${id}.schema.json`);
    const expected = JSON.stringify(schema, null, 2) + "\n";
    const actual = fs.existsSync(file) ? normalize(fs.readFileSync(file, "utf8")) : null;
    if (actual !== expected) stale.push(path.relative(root, file));
  }
  if (stale.length) {
    console.error("schemas/json/ is out of date — run: node tools/gen-schemas.mjs");
    for (const file of stale) console.error("  ", file);
    process.exit(1);
  }
  console.log(`schemas up to date — ${Object.keys(catalog).length} schemas`);
} else {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [id, schema] of Object.entries(catalog)) {
    const file = path.join(outDir, `${id}.schema.json`);
    fs.writeFileSync(file, JSON.stringify(schema, null, 2) + "\n");
    console.log("wrote", path.relative(root, file));
  }
  console.log(`done — ${Object.keys(catalog).length} schemas`);
}
