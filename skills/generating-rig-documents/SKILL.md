---
name: generating-rig-documents
description: >-
  Generate and edit Rig entity/component JSON, SUDE hosts, and ECS schemas
  against the Rig vocabulary (SemVer). Use for rig.* components, rig.document,
  .rig / .rigz, Contract VERSION bumps, and before committing or pushing
  Contract changes (npm run check). Triggers: Rig, SUDE, RigKit.
---

# Generating Rig documents

**Rig** is portable entity/component POD keyed by schema ids ([`rig.document`](../../schemas/document.md)). Ship what you support. Nothing to link. Floor: [honors.md](../../docs/honors.md). Live hosts also honor [SUDE](../../docs/sude.md) and runtime [ECS](../../docs/ecs.md). Copy the closest file in [`examples/`](../../examples/), then validate. Open one schema when a field is unclear. Leave the rest of the catalog unloaded.

## Composition

- POD only: numbers, small structs, strings, entity ids. Key components by full schema ids (`rig.spatial.transform`).
- No GPU/UI types, callbacks, dirty flags, hover/press, or pending queues.
- No derived fields (winding, world matrices, Euler, bar/beat). Hosts cache those - [Host cache](../../docs/terms.md).
- Hierarchy is optional: parent entity id, local `position` / `rotation` (quat) / `scale`.
- Being Rig means this composition for the schemas you support. The loop is for live hosts. You do not implement every schema.

## SUDE (live hosts)

`Setup()` once, may be empty. `Update(dt)` each tick before Draw; `dt` is seconds. `Draw()` each tick after Update; always called; empty body is fine. `Exit()` once before teardown. Do not nest hooks. No window, GPU, UI, filesystem, or audio required.

## Runtime ECS (live hosts)

One registry, owned by the app. Mutate in `Update`. Present in `Draw`.

## Semantic versioning

One source: [`VERSION`](../../VERSION), `MAJOR.MINOR.PATCH`. Ranges and History: [`docs/versioning.md`](../../docs/versioning.md). Do not copy the number into other docs. `npm run check:version` checks that `VERSION` is SemVer. It does not check the History row.

| When | Bump |
|------|------|
| Additive schema or optional field (0.x) | `MINOR` |
| Breaking schema or core rule after `1.0.0` | `MAJOR` |
| Docs, tooling, no schema meaning change | leave `VERSION` |

A schema change bumps `VERSION` and adds a History row. Root `"rig"` is the current `VERSION`, or an older version the document targets. Older documents stay valid under additive releases.

## Document shape

JSON on disk is `.rig`, or `.rigz` (ZIP: one `.rig` at the archive root plus `data/`). `data/` may hold more `.rig` files. [interchange](../../docs/interchange.md#package). Emit the envelope. A bare `entities` array is not a document.

| Root | Meaning |
|------|---------|
| `rig` | Contract SemVer |
| `document` | Optional metadata (`title`, `defaultUnit`, ...) |
| `entities` | `{ id, components }[]` |

- `id` is unique in the file. `components` keys are full schema ids.
- `entity` fields are a string id or `null`.
- `vec*` / `quat` are number arrays. **Quat order is x, y, z, w.**
- Enums are kebab-case schema literals (`top-left`, `color-dodge`).
- Fields are lowerCamelCase and spelled out ([Field naming](../../schemas/README.md#field-naming)): `radiusX`, not `rx`.
- Measurements: ratios 0-1; scene lengths in `document.defaultUnit` (a page `unit` may override); catalog facts are SI in the field name; protocol and clock stay native. [Measurements](../../schemas/README.md#measurements).
- Omit optional fields you did not measure. An absent `gate` means 1. An invented `gate` looks like data.
- Grammar: [`schemas/json/`](../../schemas/json/). Meaning: [`schemas/`](../../schemas/).
- `x.<vendor>.<name>` is a host extension the validator carries and reports. Do not emit it. If no `rig.*` id fits, say so. [Extension components](../../schemas/document.md#extension-components).
- `rig.ui.*` uses this same envelope ([docs/ui.md](../../docs/ui.md)). Reference host: [RigKit](https://github.com/rigkid/RigKit).

## Validate

Do not deliver unvalidated JSON.

```bash
npm run setup
node tools/rig-validate/cli.js path/to/doc.json
```

Fix the reported JSON Pointers and re-run until the CLI prints `ok`. `--strict` makes unknown schema ids errors.

## Before commit / push (CI precheck)

Do not push Contract changes until the GitHub Actions gate passes locally.

```bash
npm run setup    # once per clone / when validate deps change
npm run check    # version, schemas, parity, links, snippets, svg, examples, tests
```

| When | Required |
|------|----------|
| Schemas or `tools/gen-schemas.mjs` | `npm run check` (at least `check:schemas`; if stale, `npm run gen` then re-check) |
| `VERSION` or site badges | `npm run check:version` |
| Push to `master` or open a PR | full `npm run check` |

After `npm run hooks:install`, pre-commit checks SemVer. Pre-push runs the same steps as `npm run check` via `node`, so Windows hooks work without npm on PATH. Run `npm run check` before `git push` even when hooks are missing.

## Guards

Component keys are full `rig.*` ids. PascalCase (`Transform`, `Shape`) is not a key. Sidecar bytes go in `data/` inside `.rigz`. `asset_ref.path` is relative to `data/`. No inline blobs or data URIs.

- **CAD.** Split `rig.cad.*` primitives. No tagged-union CSG. Mesh on a CAD entity is an optional bake. A numeric datum is [`rig.cad.dimension`](../../schemas/cad/dimension.md). No `rig.cad.constraint` tagged union. Coincident / parallel wait for their own ids. Fillet/chamfer edges are `{a,b}` vertex pairs. No edge table on `rig.geometry.mesh`. No `rig.geometry.vertex`. Mesh corners stay packed arrays.
- **BIM.** No `rig.bim.wall` / `rig.bim.door`. `ifcClass` lives on `rig.bim.classify`. Geometry lives on cad / mesh. Typed params live on `rig.bim.pset`.
- **ROS.** No `rig.ros2.*`. Map onto spatial / I/O / sensor / SUDE. TF is `transform` + `relationship`. ROS nodes are not `rig.node.*`. [docs/ros.md](../../docs/ros.md)
- **VR.** No `rig.openxr.*`, `rig.webxr.*`, or `rig.steamvr.*`. Headset, stereo eyes, trackers, controllers, hands, and room bounds are `rig.vr.*`. Pose is `transform`. Projection is `camera`. Triggers and grips are `rig.input.*`. Sessions, swapchains, and prediction stay fulfillment. [docs/vr.md](../../docs/vr.md)
- **Robots.** No `rig.isaac.*`, `rig.gazebo.*`, `rig.mujoco.*`, `rig.webots.*`, `rig.lucky.*`, or `rig.lerobot.*`. A robot is `rig.sim.articulation` plus bodies, joints, and drives. Gravity is `rig.sim.world`. A depth image is `rig.sensor.depth` plus `camera`. A scan is `rig.sensor.lidar`. One beam is `rig.sensor.range`. A wrench is `rig.sensor.wrench`. A fix is `rig.sensor.gnss` plus `rig.place.geo`. A class image is `rig.sensor.label` plus `rig.sensor.class`. A take is `rig.sim.episode`. A policy names actuators and sensors on `rig.ai.policy`. A checkpoint is `rig.media.asset_ref`. A reset range is `rig.sim.domain`. Solvers, images, and trainers stay fulfillment. [docs/robot.md](../../docs/robot.md)
- **Font.** No `rig.font.ttf`. No outlines on `rig.media.text`. UFO source is `rig.font.*`. Contours are `rig.geometry.path`. Features are `rig.media.code` (`language` `fea`). [docs/ufo.md](../../docs/ufo.md)
- **IDML.** No `rig.idml.*`, graphic frames, object styles, text wrap, GREP, footnotes, or variables. Map onto `rig.layout.frame` plus layout / story. [docs/idml.md](../../docs/idml.md)
- **Print.** No `rig.print.gcode`. No host paths or last-slice status on `rig.print.job`. FGF is `machine` / `material` / `process` / `compression`. Files are `asset_ref`. This is not envelope `pdfX`, not `rig.dev.machine`, and not a layout page. [docs/print.md](../../docs/print.md)
- **KiCad.** No `rig.kicad.*`, no second pin schema, no member list on a net. A terminal is one entity: `rig.circuit.pin` (+ `rig.pcb.pad` on a board). Nets are `rig.circuit.net` markers that members point at. Layers join through `rig.pcb.layer_set`, not `parent`. Zone fills, net numbers, and ratsnest stay in the host. [docs/kicad.md](../../docs/kicad.md). A part terminal is not `rig.sensor.gpio` (a live line; link it with `terminal`) and not `rig.node.pin` (a patcher socket).
- **Frames.** Text-frame bounds are `rig.layout.frame` `width` / `height` plus transform. `rig.geometry.rectangle` is a drawable. When frames exist, thread with `rig.layout.frame_chain`. Do not parent `rig.story.flow` to the page.
- **Names and origin.** Compose `rig.meta.named`. Do not re-declare `name`. Origin is `rig.spatial.anchor`: `point` is a 3x3 face, optional `height` is min/center/max for 3x3x3, absent means no remap (page trim is top-left). Origin is a cell offset, never an axis invert. It is not a page field, not transform, not `rig.spatial.vertex` (a locator), and not `rig.font.anchor`.
- **Scene graph.** Show/hide is `rig.render.visibility`, not a field on `rig.spatial.layer`. The world root is an unparented `rig.spatial.vertex`. It is not `rig.spatial.group`. There is no `rig.spatial.scene` and no `kind` on vertex. Pose stays on `transform`. Vertex has no `x` / `y` / `z`. Blend / opacity is `rig.render.blend`, not `rig.pixel.layer`.
- **Paint and copy.** Caps, joins, and dash are `rig.paint.stroke_style`, not fields on `fill_stroke`. Text colour is paint (`fill_stroke` / `fill`), not `rig.media.text`. `rig.media.text` is a canvas run. Stories are `rig.story.*`: named styles, no font or colour. A story run is `text` plus a style identity. Bold, italic, underline, strike, super/sub, font, size, and colour are not story fields. Unstyled local emphasis becomes a named character style.
- **Place and person.** Postal, civic, and WGS84 are `rig.place.address` and `rig.place.geo`, not transform, and not person fields. Given / family name is `rig.person.name`. `named.name` is the formatted full name. Sex, birthday, and email are `rig.person.vital` and `rig.person.contact`. Recorded sex is ISO/IEC 5218. Do not copy `sex` into `gender`. Job title, department, and organisation are `rig.person.employment` (employer is an entity), not contact, and not an employment instrument. A photo is `rig.person.portrait` plus `asset_ref`. IBAN / BIC is `rig.party.account`.
- **Plant.** No `scientificName` blob on `rig.plant.taxon`. Compose `rig.meta.named`. Name parts stay on taxon. Cultivar, Group, grex, and trade name are `rig.plant.cultivar`. Habit is growth form. Darwin Core habitat is the site: `rig.place.geo` / `rig.place.address`. A photo is `rig.plant.portrait` plus `asset_ref`.
- **Book, paper, art.** `isbn13` is digits only on `rig.book.identifier`. The title is `rig.meta.named`. Author and publisher are entities: `rig.book.contribution` and `rig.book.publication.publisher`. A cover is `rig.book.cover` plus `asset_ref`. A paper uses `rig.paper.identifier` (DOI / PMID / arXiv). ISSN stays on the journal entity. A citation is `rig.paper.citation` (`citing` / `cited`), not a formatted bibliography string. Copyright holder and licence are `rig.rights.statement`, not `rig.art.object` or `rig.book.publication`. Artist, medium, and size are `attribution`, `material`, and `dimensions` (millimetres).
- **Commerce and legal.** A price is `rig.commerce.price` on an offer, a payment, a claim, or an order line. A discount is `rig.commerce.discount`. A catalog item is `rig.commerce.product` (`gtin` digits only; a variant sets `parent`). Stock is `rig.commerce.stock`. An order is `rig.commerce.order` plus `rig.commerce.order_line` entities. No price string and no list-plus-sale pair on a book or art schema. No price on `rig.play.item`. No cart, checkout, or tax engine. Parties on `rig.legal.agreement` are `rig.legal.party` entities. A policy is `agreement.kind` `insurance`. Copyright of a work stays `rig.rights.statement`. A licence deal is `agreement.kind` `licence`.
- **Calendar.** Compose `rig.calendar.event` / `recurrence` / `attendee`. Times are `startMinutes` in `document.timeZone`. `startSecond` (0-59) orders happenings that share a minute. No `RRULE`, `DTSTART`, or `ATTENDEE` strings. No `rig.calendar.todo`, `alarm`, `freebusy`, or `timezone`. Those stay in the `.ics` source. Title is `rig.meta.named`. Location is `rig.place.address`.
- **Records.** No `rig.fhir.*`, `rig.pacs.*`, `rig.dicom.*`, or `rig.gs1.*`. Classification is `rig.record.mark`. Who stated a fact is `rig.record.assertion`. A happening with no magnitude is `rig.record.event` plus `rig.calendar.event`. A measurement is `rig.clinic.observation` - do not also attach `rig.record.event`. Consent is `rig.record.consent` plus a span. A file is `rig.record.case` or `rig.record.incident`; members point at it with `rig.record.concerns`. A payment is `rig.finance.payment`. A holding is `rig.finance.position` (`isin`). A claim is `rig.finance.claim`. A visit is `rig.clinic.encounter`. An imaging series is `rig.clinic.study`. A trial is `rig.clinic.trial` plus `rig.clinic.criterion` rows. A statute is `rig.law.statute`. Join keys live on the noun. Search, vectors, and message formats stay fulfillment. [docs/records.md](../../docs/records.md).
- **Sim and play.** Friction, restitution, and collision shape are `rig.sim.collider`. Constraints are `rig.sim.joint`. Do not integrate `rig.sim.rigidbody` on an entity that has `rig.sim.character`. The character is the motor. Do not serialize contact manifolds, live particles, solved nav paths, button edges, or audio mix buffers. Hit points are `rig.play.health`. `rig.ai.behavior` `action` is a host name. Source text is `rig.media.code`. No callback or expression. Sprite colour is paint. Collider box sizes are half extents. `rig.play.script` is `className` plus an optional `rig.media.code` asset. No function pointer. Device codes are `rig.input.binding`, not `rig.input.buttons`. HUD is `rig.ui.panel` with `surface` `hud`. Replication is `rig.net.replica`, not `rig.io.osc`. `rig.audio.voice` `gain` is linear amplitude. Do not store decibels beside it.

## Vocabulary

Field meaning is [`schemas/`](../../schemas/). Grammar is [`schemas/json/<id>.schema.json`](../../schemas/json/). Prefix every key with `rig.<domain>.`.

| Domain | Ids |
|--------|-----|
| Document | `rig.document` |
| Spatial | `transform`, `anchor`, `relationship`, `vertex`, `group`, `camera`, `layer` |
| Layout | `page`, `master`, `applied_master`, `facing`, `paragraph_style`, `character_style`, `frame`, `frame_chain` |
| Place | `address`, `geo` |
| Person | `name`, `vital`, `contact`, `employment`, `portrait` |
| Organisation | `identity` |
| Party | `account` |
| Commerce | `price`, `offer`, `discount`, `product`, `stock`, `order`, `order_line` |
| Plant | `taxon`, `cultivar`, `habit`, `occurrence`, `portrait` |
| Book | `identifier`, `title`, `publication`, `contribution`, `cover`, `subject` |
| Paper | `identifier`, `article`, `issue`, `citation` |
| Rights | `statement` |
| Legal | `agreement`, `party` |
| Record | `mark`, `assertion`, `event`, `consent`, `case`, `incident`, `concerns` |
| Finance | `payment`, `position`, `claim` |
| Clinic | `encounter`, `observation`, `study`, `trial`, `criterion` |
| Law | `statute` |
| Art | `object`, `creation`, `attribution`, `dimensions`, `material`, `location`, `subject`, `image` |
| Geometry | `mesh`, `path`, `path3d`, `rectangle`, `ellipse`, `line`, `polygon`, `regular_polygon`, `star`, `arc`, `spline`, `spline3d`, `nurbs_surface`, `ring` |
| Cad | `cuboid`, `cylinder`, `sphere`, `extrude`, `revolve`, `boolean`, `fillet`, `chamfer` |
| Bim | `classify`, `type`, `occurrence`, `pset`, `site`, `building`, `storey`, `space`, `relation`, `topic`, `comment`, `viewpoint`, `spec`, `facet` |
| Paint | `solid`, `gradient`, `fill_stroke`, `fill`, `stroke`, `stroke_style`, `library` |
| Meta / render | `named`, `tags`, `light`, `material`, `visibility`, `blend`, `sprite` |
| Anim / mod | `tween`, `curve`, `skeleton`, `skin`, `clip`, `track`, `blend`, `bind`, `lfo`, `binding`, `trigger` |
| Music | `transport`, `clock`, `sequencer`, `pattern`, `arrangement`, `step`, `note`, `midi_output`, `midi_input` |
| Audio | `analysis`, `bus`, `voice` |
| Picture | `analysis` |
| Visualizer | `deck` |
| Media | `asset_ref`, `text`, `code` |
| Font | `face`, `glyph`, `component`, `anchor`, `layer`, `kern`, `group` |
| Story | `flow`, `paragraph`, `paragraph_style`, `character_style`, `table` |
| Pixel | `canvas`, `source`, `layer`, `raster`, `palette`, `tile_set`, `tile_map`, `effect_chain` |
| Print | `machine`, `material`, `process`, `compression`, `job` |
| Circuit | `part`, `pin`, `net` |
| Pcb | `board`, `layer`, `layer_set`, `footprint`, `pad`, `track`, `via`, `zone`, `keepout` |
| I/O | `osc`, `serial`, `sacn`, `dmx`, `led.uv_map`, `sensor.gpio`, `sensor.presence`, `sensor.depth`, `sensor.lidar`, `sensor.imu`, `sensor.wrench`, `sensor.range`, `sensor.gnss`, `sensor.label`, `sensor.class` |
| Dmx | `fixture` |
| Light | `look` |
| Calendar | `weekly`, `span`, `exception`, `event`, `recurrence`, `attendee` |
| Input | `buttons`, `axes`, `pointer`, `binding` |
| VR | `space`, `headset`, `eye`, `tracker`, `controller`, `pose`, `hand`, `joint`, `haptic`, `anchor` |
| Sim | `rigidbody`, `particle_emitter`, `collider`, `joint`, `actuator`, `episode`, `character`, `navmesh`, `agent`, `world`, `articulation`, `domain` |
| Play | `health`, `item`, `inventory`, `spawner`, `save`, `script` |
| AI | `behavior`, `policy` |
| Net | `replica` |
| Interact | `selectable`, `selected` |
| UI | `panel`, `group`, `control`, `action` |
| Node | `graph`, `node`, `pin`, `link`, `param`, `publish` |
