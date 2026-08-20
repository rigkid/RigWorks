---
name: generating-rig-documents
description: >-
  Generate and edit Rig JSON documents, SUDE-loop hosts, and ECS component
  data against the Rig shared vocabulary (Semantic Versioning). Use when
  generating or editing Rig entity data, SUDE hooks, or ECS component schemas;
  when creating or modifying rig.* components, rig.document JSON, or .rig
  interchange; when bumping Contract VERSION; before committing or pushing
  Contract changes (run npm run check); or when the user mentions Rig, SUDE,
  or RigKit.
---

# Generating Rig documents

## When to use

Load this skill when generating or editing Rig entity data, SUDE hooks, or ECS component schemas — or when emitting portable JSON a host should load.

## Core model

**Rig** — Readable Independent Grammar: the schema catalog and portable entity/component POD documents ([`rig.document`](../../schemas/document.md)). Schemas are optional; ship what you support. Nothing to link into an app. Not another editor. Floor: [honors.md](../../docs/honors.md).

**Live hosts** also honor [SUDE](../../docs/sude.md) and runtime [ECS](../../docs/ecs.md) conventions (registry, Update/Draw systems). Document composition (entities + POD components) is always required; the loop is not.

### Document composition (always)

| Rule | Detail |
|------|--------|
| Entities + components | Portable meaning is POD keyed by schema ids |
| POD only | Numbers, small structs, strings, entity ids |
| No portable handles | No GPU/UI toolkit types, callbacks, dirty flags, hover/press, pending queues |
| No derived fields | Hosts may cache winding, world matrices, Euler, bar/beat; do not serialize them — [Host cache](../../docs/terms.md) |
| Hierarchy (optional) | Parent as entity id; local `position` / `rotation` (quat) / `scale` |

### SUDE (live hosts)

```
Setup → Update → Draw → Exit
```

| Hook | When | Semantics |
|------|------|-----------|
| `Setup()` | Once | Allocate app state. May be empty. |
| `Update(dt)` | Each tick, before Draw | Simulation. `dt` = seconds (host clock). |
| `Draw()` | Each tick, after Update | Present. Always called; empty body OK. |
| `Exit()` | Once, before teardown | Release state. May be empty. |

Do not nest hooks. No display/UI required for SUDE compliance.

### Runtime ECS (live hosts)

| Rule | Detail |
|------|--------|
| App owns registry | No second hidden registry for app entities |
| Simulate / Present | Mutate in `Update`; present in `Draw` |

## Semantic versioning

The Contract uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`). **One source of truth:** [`VERSION`](../../VERSION). Ranges and History: [`docs/versioning.md`](../../docs/versioning.md).

| When | Bump |
|------|------|
| Additive schema / optional fields (0.x draft) | `MINOR` (e.g. `0.9.0` → `0.10.0`) |
| Breaking schema or core-rule change after `1.0.0` | `MAJOR` |
| Docs-only / tooling / no schema meaning change | leave `VERSION` alone |

When you change schemas: bump [`VERSION`](../../VERSION) and add a History row in `docs/versioning.md` (release notes). Do not copy the number into README or other docs. `npm run check:version` (also the pre-commit hook) only requires `VERSION` to be SemVer.

When generating a document, set root `"rig"` to the current `VERSION` (or an older version the document actually targets — older docs stay valid under additive releases).

## Document shape

Wire format is JSON — [`rig.document`](../../schemas/document.md).

| Root field | Meaning |
|------------|---------|
| `rig` | Contract version (`MAJOR.MINOR.PATCH` SemVer — see [`VERSION`](../../VERSION)) |
| `document` | Optional metadata (`title`, `defaultUnit`, …) |
| `entities` | Array of `{ id, components }` |

- `id` — string, unique within the file
- `components` — map keyed by full schema ids (`rig.spatial.transform`)
- `entity`-typed fields — string id or `null`
- `vec*` / `quat` — JSON number arrays; **quat order x, y, z, w**
- Enums — kebab-case literals from the schema (`top-left`, `color-dodge`)
- Field names — lowerCamelCase, spelled out ([`schemas/README.md` Field naming](../../schemas/README.md#field-naming)); no SVG abbreviations (`radiusX` not `rx`)
- Measurements — ratios 0–1; scene lengths in `document.defaultUnit` (page `unit` may override); catalog facts SI in the field name; protocol/clock native — [`schemas/README.md` Measurements](../../schemas/README.md#measurements)
- Serialize only portable fields; omit host caches
- Optional fields have documented defaults — omit what you did not measure rather than inventing a value (an absent `gate` means 1; an invented `gate` looks like data)

Exact grammar: [`schemas/json/`](../../schemas/json/).

A component key may also be `x.<vendor>.<name>` — a host component the Contract has not named. Validators carry it unchecked and report it. Do **not** reach for this when generating documents: if a `rig.*` id fits, use it, and if none fits, say so rather than inventing an extension. It exists so a host can adopt `.rig` natively, not so a generator can route around the catalog — [`rig.document`](../../schemas/document.md#extension-components).

## Worked examples

Reference documents: [`examples/minimal-scene.json`](../../examples/minimal-scene.json), [`examples/lfo-binding.json`](../../examples/lfo-binding.json), [`examples/ui-panel.json`](../../examples/ui-panel.json), [`examples/portable-tool.json`](../../examples/portable-tool.json), [`examples/path3d-spline3d.json`](../../examples/path3d-spline3d.json), [`examples/cad-boolean.json`](../../examples/cad-boolean.json), [`examples/story-flow.json`](../../examples/story-flow.json), [`examples/bim-model.json`](../../examples/bim-model.json), [`examples/bim-bcf.json`](../../examples/bim-bcf.json), [`examples/bim-ids.json`](../../examples/bim-ids.json), [`examples/font-ufo.json`](../../examples/font-ufo.json), [`examples/font-var.json`](../../examples/font-var.json), [`examples/place-address.json`](../../examples/place-address.json), [`examples/person-contact.json`](../../examples/person-contact.json), [`examples/plant-taxon.json`](../../examples/plant-taxon.json), [`examples/book-isbn.json`](../../examples/book-isbn.json), [`examples/paper-citation.json`](../../examples/paper-citation.json), [`examples/art-object.json`](../../examples/art-object.json), [`examples/commerce-offer.json`](../../examples/commerce-offer.json), [`examples/legal-agreement.json`](../../examples/legal-agreement.json), [`examples/calendar-event.json`](../../examples/calendar-event.json), [`examples/lights.json`](../../examples/lights.json), [`examples/dev-machine.json`](../../examples/dev-machine.json), [`examples/dev-hyperv.json`](../../examples/dev-hyperv.json), [`examples/dev-kvm.json`](../../examples/dev-kvm.json). Validate before you trust the output.

### Entity with shape + paint

<!-- rig:begin entity=demo-rect from=examples/minimal-scene.json -->
```json
{
  "id": "demo-rect",
  "components": {
    "rig.meta.named": {
      "name": "demo-rect",
      "stableId": "demo-rect"
    },
    "rig.spatial.transform": {
      "position": [
        20,
        65,
        0
      ],
      "rotation": [
        0,
        0,
        0,
        1
      ],
      "scale": [
        1,
        1,
        1
      ]
    },
    "rig.spatial.relationship": {
      "parent": "world"
    },
    "rig.geometry.rectangle": {
      "x": 0,
      "y": 0,
      "width": 140,
      "height": 90,
      "cornerRadius": 10
    },
    "rig.paint.fill_stroke": {
      "fillRgba": [
        0.25,
        0.65,
        1,
        1
      ]
    },
    "rig.interact.selectable": {
      "enabled": true
    }
  }
}
```
<!-- rig:end -->

### LFO → binding (Update-side)

```json
{
  "entities": [
    {
      "id": "pulse",
      "components": {
        "rig.meta.named": { "name": "pulse", "stableId": "pulse" },
        "rig.mod.lfo": {
          "waveform": "sine",
          "frequency": 0.5,
          "amplitude": 40,
          "offset": 120,
          "phase": 0
        }
      }
    },
    {
      "id": "dot",
      "components": {
        "rig.meta.named": { "name": "dot", "stableId": "dot" },
        "rig.spatial.transform": {
          "position": [200, 120, 0],
          "rotation": [0, 0, 0, 1],
          "scale": [1, 1, 1]
        }
      }
    },
    {
      "id": "bind-y",
      "components": {
        "rig.mod.binding": {
          "source": "pulse",
          "target": "dot",
          "propertyKey": "position.y",
          "depth": 1,
          "min": 40,
          "max": 280,
          "additive": false
        }
      }
    }
  ]
}
```

(Wrap entities in a full document with `"rig"` set to the current [`VERSION`](../../VERSION) before validating.)

## Feedback loop

Never deliver unvalidated Rig JSON.

1. Write or edit a `.json` document
2. Validate:

```bash
npm run setup
node tools/rig-validate/cli.js path/to/doc.json
```

3. Fix errors at the reported JSON Pointer paths
4. Re-run until the CLI prints `ok`
5. Use `--strict` to treat unknown schema ids as errors

`rig.ui.*` panels travel in the same document envelope — validate them like any other schema (`examples/ui-panel.json`, `examples/portable-tool.json`). Rig + UI is optional Contract surface ([docs/ui.md](../../docs/ui.md)), not a separate spec.

When bumping the Contract version: edit [`VERSION`](../../VERSION) and add a History row in `docs/versioning.md`, then `npm run check:version` (pre-commit runs the same check after `npm run hooks:install`).

## Before commit / push (CI precheck)

Do **not** push Contract changes until the same gate as GitHub Actions passes locally.

```bash
npm run setup    # once per clone / when validate deps change
npm run check    # version, schemas, parity, links, snippets, svg, examples, tests
```

| When | Required |
|------|----------|
| Edit schemas / `tools/gen-schemas.mjs` | `npm run check` (at least `check:schemas` — if stale, `npm run gen` then re-check) |
| Edit `VERSION` / site badges | `npm run check:version` |
| Any push to `master` / open a PR | full `npm run check` |

Pre-commit (after `npm run hooks:install`) only runs SemVer. **Pre-push runs the same steps as `npm run check` via `node` (so Windows Git hooks work without npm on PATH).** Agents must run `npm run check` themselves before `git push` even if hooks are missing — do not rely on CI to catch schema drift.

## Common mistakes / non-requirements

- **Do not** invent a tagged-union CSG blob — split `rig.cad.*` primitives; mesh on a CAD entity is an optional bake
- **Do not** store a parallel edge table on `rig.geometry.mesh` — name fillet/chamfer edges as `{a,b}` vertex pairs
- **Do not** invent `rig.bim.wall` / `rig.bim.door` — use `rig.bim.classify` with `ifcClass`; geometry on cad / mesh; typed params on `rig.bim.pset`
- **Do not** invent `rig.ros2.*` — ROS 2 maps onto existing spatial / I/O / sensor / SUDE; TF is `transform` + `relationship`; do not put ROS nodes on `rig.node.*`; see [docs/ros.md](../../docs/ros.md)
- **Do not** invent `rig.font.ttf` or grow `rig.media.text` with outlines — UFO source is `rig.font.*`; contours compose `rig.geometry.path`; features compose `rig.media.code` (`language` `fea`); `.ufo` is fulfillment — [docs/ufo.md](../../docs/ufo.md)
- **Do not** invent schema ids or use PascalCase keys (`Transform`, `Shape`) — component keys are full `rig.*` ids; see [docs/interchange.md](../../docs/interchange.md)
- **Do not** use `x.<vendor>.<name>` to stand in for a catalog id you could not find — report the gap instead
- **Do not** nest SUDE hooks or skip calling `Draw` (when authoring a live host)
- **Do not** re-declare `name` on domain schemas — compose `rig.meta.named`
- **Do not** put page/entity origin on `rig.layout.page` or transform — compose `rig.spatial.anchor` (`point` 3×3 face + optional `height` min/center/max for 3×3×3; absent = no remap / page trim top-left). Origin is a cell offset — never axis invert. Not a locator: that is `rig.spatial.vertex`. Not `rig.font.anchor`.
- **Do not** put postal / civic fields or WGS84 on `rig.spatial.transform` — compose `rig.place.address` and `rig.place.geo`
- **Do not** put given / family name on `rig.meta.named` — compose `rig.person.name`; `named.name` is the formatted / full name
- **Do not** put sex, birthday, or email on `rig.person.name` — compose `rig.person.vital` and `rig.person.contact`
- **Do not** copy `sex` into `gender` — recorded sex is ISO/IEC 5218; gender identity is a separate string
- **Do not** put job title, department, or organisation name on `rig.person.contact` — compose `rig.person.employment` (employer is an entity)
- **Do not** put a photo path on a person schema — compose `rig.person.portrait` → `rig.media.asset_ref`
- **Do not** put IBAN / BIC on a person name schema — compose `rig.party.account`
- **Do not** put postal fields on a person schema — compose `rig.place.address`
- **Do not** put a `scientificName` blob on `rig.plant.taxon` — compose `rig.meta.named`; parts stay on taxon
- **Do not** put cultivar / Group / grex / trade name on `rig.plant.taxon` — compose `rig.plant.cultivar`
- **Do not** put Darwin Core `habitat` on `rig.plant.habit` — habit is growth form; the site is `rig.place.geo` / `rig.place.address`
- **Do not** put a photo path on a plant schema — compose `rig.plant.portrait` → `rig.media.asset_ref`
- **Do not** put a hyphenated ISBN or a title string on `rig.book.identifier` — digits-only `isbn13`; distinctive title is `rig.meta.named`
- **Do not** put author or publisher name strings on a book schema — compose `rig.book.contribution` (person entity) and `rig.book.publication.publisher` (organisation entity)
- **Do not** put a cover path on a book schema — compose `rig.book.cover` → `rig.media.asset_ref`
- **Do not** put ISBN on a paper — compose `rig.paper.identifier` (DOI / PMID / arXiv); journal ISSN stays on the journal entity
- **Do not** store a formatted bibliography string — compose `rig.paper.citation` (`citing` / `cited` entities)
- **Do not** put copyright holder or licence on `rig.art.object` or `rig.book.publication` — compose `rig.rights.statement`
- **Do not** put artist name, medium, or centimetres on `rig.art.object` — compose `attribution`, `material`, `dimensions` (millimetres)
- **Do not** put a price string or list+sale pair on a book / art schema — compose `rig.commerce.price` on an offer; a discount is `rig.commerce.discount`
- **Do not** invent a cart, checkout, or tax engine — offer + price + discount + `rig.calendar.span` is the commercial record
- **Do not** put party name strings on `rig.legal.agreement` — compose `rig.legal.party` (person / organisation entities)
- **Do not** put copyright of a work on `rig.legal.agreement` — that is `rig.rights.statement`; a licence *deal* is `agreement.kind` `licence`
- **Do not** copy `jobTitle` onto an employment instrument — job facts stay on `rig.person.employment`
- **Do not** encode iCalendar `RRULE` / `DTSTART` / `ATTENDEE` strings — compose `rig.calendar.event` / `recurrence` / `attendee`; times are `startMinutes` in `document.timeZone`
- **Do not** invent `rig.calendar.todo`, `alarm`, `freebusy`, or `timezone` — those stay in the `.ics` source
- **Do not** put an event title or location string on `rig.calendar.event` — compose `rig.meta.named` and `rig.place.address`
- **Do not** put show/hide on `rig.spatial.layer` — compose `rig.render.visibility`
- **Do not** use `rig.spatial.group` as the world root — that is an unparented `rig.spatial.vertex` (a scene)
- **Do not** invent `rig.spatial.scene` or tag vertex with `kind` — the graph is the tag
- **Do not** put `x` / `y` / `z` on `rig.spatial.vertex` — pose stays on `rig.spatial.transform`
- **Do not** invent `rig.geometry.vertex` or index `rig.geometry.mesh` `positions` via a vertex component — mesh corners stay packed arrays
- **Do not** put blend / opacity on `rig.pixel.layer` — compose `rig.render.blend`
- **Do not** put stroke caps / joins / dash on `rig.paint.fill_stroke` — compose `rig.paint.stroke_style`
- **Do not** put text colour on `rig.media.text` — compose paint (`fill_stroke` / `fill`)
- **Do not** flatten editorial copy into `rig.media.text` — that is a canvas run; stories are `rig.story.*` (named styles, no font or colour)
- **Do not** put bold, italic, underline, strike, super/sub, font, size, or colour on `rig.story.*` — a run is `text` + style identity; unstyled local emphasis becomes a named character style
- SUDE does **not** require a window, GPU, UI pack, filesystem, or audio
- Being Rig does **not** require SUDE — only live hosts do — or implementing every schema
- Being Rig **does** require entity/component POD composition against schemas you support

## Vocabulary index

Field meaning: [`schemas/`](../../schemas/). Machine grammar: [`schemas/json/<id>.schema.json`](../../schemas/json/).

| Domain | Schema ids |
|--------|------------|
| Document | `rig.document` |
| Spatial | `transform`, `anchor`, `relationship`, `vertex`, `group`, `camera`, `layer` |
| Layout | `page` |
| Place | `address`, `geo` |
| Person | `name`, `vital`, `contact`, `employment`, `portrait` |
| Organisation | `identity` |
| Party | `account` |
| Commerce | `price`, `offer`, `discount` |
| Plant | `taxon`, `cultivar`, `habit`, `occurrence`, `portrait` |
| Book | `identifier`, `title`, `publication`, `contribution`, `cover`, `subject` |
| Paper | `identifier`, `article`, `issue`, `citation` |
| Rights | `statement` |
| Legal | `agreement`, `party` |
| Art | `object`, `creation`, `attribution`, `dimensions`, `material`, `location`, `subject`, `image` |
| Geometry | `mesh`, `path`, `path3d`, `rectangle`, `ellipse`, `line`, `polygon`, `regular_polygon`, `star`, `arc`, `spline`, `spline3d`, `nurbs_surface`, `ring` |
| Cad | `cuboid`, `cylinder`, `sphere`, `extrude`, `revolve`, `boolean`, `fillet`, `chamfer` |
| Bim | `classify`, `type`, `occurrence`, `pset`, `site`, `building`, `storey`, `space`, `relation`, `topic`, `comment`, `viewpoint`, `spec`, `facet` |
| Paint | `solid`, `gradient`, `fill_stroke`, `fill`, `stroke`, `stroke_style`, `library` |
| Meta / render | `named`, `tags`, `light`, `material`, `visibility`, `blend` |
| Anim / mod | `tween`, `curve`, `lfo`, `binding`, `trigger` |
| Music | `transport`, `clock`, `sequencer`, `pattern`, `arrangement`, `step`, `note`, `midi_output`, `midi_input` |
| Audio | `analysis`, `bus` |
| Media | `asset_ref`, `text`, `code` |
| Font | `face`, `glyph`, `component`, `anchor`, `layer`, `kern`, `group` |
| Story | `flow`, `paragraph`, `paragraph_style`, `character_style`, `table` |
| Pixel | `canvas`, `source`, `layer`, `raster`, `palette`, `tile_set`, `tile_map`, `effect_chain` |
| I/O | `osc`, `serial`, `sacn`, `dmx`, `led.uv_map`, `sensor.gpio`, `sensor.presence` |
| Dmx | `fixture` |
| Light | `look` |
| Calendar | `weekly`, `span`, `exception`, `event`, `recurrence`, `attendee` |
| Sim | `rigidbody`, `particle_emitter` |
| Input | `buttons` |
| Interact | `selectable` |
| UI | `panel`, `group`, `control`, `action` |
| Node | `graph`, `node`, `pin`, `link`, `param`, `publish` |

Prefix every component key with `rig.<domain>.` (e.g. `rig.spatial.transform`).

## Where output goes

[RigKit](https://github.com/rigkid/RigKit) is the reference host. Emit Contract JSON (`rig.*` keys).
