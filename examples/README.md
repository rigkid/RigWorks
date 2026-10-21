# Examples

Canonical Rig JSON documents. Copy the pattern; validate before you trust the output. Agent distillation of these rules: [`../skills/generating-rig-documents/SKILL.md`](../skills/generating-rig-documents/SKILL.md).

```bash
node tools/rig-validate/cli.js examples/minimal-scene.json
node tools/rig-validate/cli.js examples/lfo-binding.json
node tools/rig-validate/cli.js examples/ui-panel.json
node tools/rig-validate/cli.js examples/portable-tool.json
node tools/rig-validate/cli.js examples/path3d-spline3d.json
node tools/rig-validate/cli.js examples/page-anchor.json
node tools/rig-validate/cli.js examples/cad-boolean.json
node tools/rig-validate/cli.js examples/cad-dimension.json
node tools/rig-validate/cli.js examples/cad-reference.json
node tools/rig-validate/cli.js examples/story-flow.json
node tools/rig-validate/cli.js examples/story-frames.json
node tools/rig-validate/cli.js examples/bim-model.json
node tools/rig-validate/cli.js examples/bim-bcf.json
node tools/rig-validate/cli.js examples/bim-ids.json
node tools/rig-validate/cli.js examples/font-ufo.json
node tools/rig-validate/cli.js examples/place-address.json
node tools/rig-validate/cli.js examples/person-contact.json
node tools/rig-validate/cli.js examples/plant-taxon.json
node tools/rig-validate/cli.js examples/book-isbn.json
node tools/rig-validate/cli.js examples/paper-citation.json
node tools/rig-validate/cli.js examples/art-object.json
node tools/rig-validate/cli.js examples/commerce-offer.json
node tools/rig-validate/cli.js examples/legal-agreement.json
node tools/rig-validate/cli.js examples/calendar-event.json
node tools/rig-validate/cli.js examples/lights.json
node tools/rig-validate/cli.js examples/environment.json
node tools/rig-validate/cli.js examples/dev-machine.json
node tools/rig-validate/cli.js examples/dev-hyperv.json
node tools/rig-validate/cli.js examples/dev-kvm.json
node tools/rig-validate/cli.js examples/print-fgf.json
node tools/rig-validate/cli.js examples/paint-brush.json
node tools/rig-validate/cli.js examples/kicad-pcb.json
node tools/rig-validate/cli.js examples/visualizer.json
node tools/rig-validate/cli.js examples/music-chord.json
node tools/rig-validate/cli.js examples/play-scene.json
node tools/rig-validate/cli.js examples/robot-lesson.json
node tools/rig-validate/cli.js examples/robot-lab.json
node tools/rig-validate/cli.js examples/vr-room.json
node tools/rig-validate/cli.js examples/record-bank.json
node tools/rig-validate/cli.js examples/record-care.json
node tools/rig-validate/cli.js examples/record-shop.json
node tools/rig-validate/cli.js examples/record-civic.json
```

## SUDE sketch

Hosts honor Setup / Update / Draw / Exit. Data is ECS POD composed onto entities - the JSON below is what travels; the loop is how a host runs it.

```text
Setup:
  load or spawn entities from a Rig document
Update(dt):
  advance modulators, tweens, transport, bindings...
Draw:
  present transforms / shapes / meshes / whatever this host draws
Exit:
  release host state
```

## `minimal-scene.json`

A specimen sheet of the geometry vocabulary: rounded rectangle, circle, regular polygons (triangle, hexagon), star, parent/child hierarchy under a root [`rig.spatial.vertex`](../schemas/spatial/vertex.md) (`world`), closed and open polygons, line, and a quad mesh. Rendered to [`site/scene.svg`](../site/scene.svg) by [`tools/render-svg.mjs`](../tools/render-svg.mjs). Note what is *absent*: fill-only shapes carry just `fillRgba` and stroke-only shapes just `strokeRgba` - 0.8.0 defaults cover the rest.

One entity (excerpt):

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

## `lfo-binding.json`

`rig.mod.lfo` on one entity, `rig.mod.binding` driving another entity’s `position.y` - Update-system data (advance LFO + apply binding each `dt`); no UI required.

## `ui-panel.json`

An LED-install flavoured control surface: `rig.ui.panel` (`role: led.install`) with controls driving `rig.paint.solid` colour and `rig.mod.lfo` frequency, plus a shared `lfo.resetPhase` action. Same schemas a desktop panel or an ESP32 web page would speak.

## `portable-tool.json`

A tool document meant to travel: panel + nested `rig.ui.group` sections, controls bound to LFO and paint fields, shared action id. Author in one UI pack; load in another app that speaks the same schema ids.

## `path3d-spline3d.json`

A cubic space curve as `rig.geometry.path3d` (`cubic-to`) and a separate degree-3 NURBS as `rig.geometry.spline3d`. Authored forms stay distinct - do not dual-attach both on one contour.

## `page-anchor.json`

A page with `rig.spatial.anchor` `center` (page-local origin mid-trim) and a child rectangle with `bottom-right` registration plus a local `offset` - transform stays TRS; the 3×3 lives on the sibling component.

## `cad-boolean.json`

CSG difference of a cuboid minus a cylinder, fillet intent on every edge, a cube mesh with n-gon `loops` and a named-edge chamfer, plus a bilinear `rig.geometry.nurbs_surface`. The CAD tree is the solid source of truth; mesh on a CAD entity is an optional bake.

## `cad-reference.json`

Two posts plus three datums: a [`rig.cad.reference_line`](../schemas/cad/reference-line.md) anchored to both posts by `a` / `b` so it tracks them on rebuild, a second one placed by `origin` + `direction`, and a [`rig.cad.reference_plane`](../schemas/cad/reference-plane.md) at deck height. None of them are solids and none appear in a `boolean.operands` list. An axis is a named reference line, not its own schema id.

## `story-flow.json`

Semantic editorial copy: named paragraph and character styles only (no font, colour, or local bold/italic flags), a heading, a body with Bold and Italic style runs, a bullet list via `listKind`, and a two-column table with a header row. Canvas type stays on `rig.media.text`.

One entity (the flow):

<!-- rig:begin entity=story from=examples/story-flow.json -->
```json
{
  "id": "story",
  "components": {
    "rig.meta.named": {
      "name": "Main story",
      "stableId": "story"
    },
    "rig.story.flow": {
      "blocks": [
        "p-title",
        "p-body",
        "p-li-1",
        "p-li-2",
        "table-people"
      ]
    }
  }
}
```
<!-- rig:end -->

## `story-frames.json`

Threaded text layout: facing pages, a right master with slug, two document pages, two [`rig.layout.frame`](../schemas/layout/frame.md) boxes (columns / insets / first baseline), and a [`rig.layout.frame_chain`](../schemas/layout/frame-chain.md) that walks them. Visual typography lives on `rig.layout.paragraph_style` / `character_style` (including a character style that is not italic). `.idml` stays a host encoding - [docs/idml.md](../docs/idml.md).

One entity (the first frame):

<!-- rig:begin entity=frame-1 from=examples/story-frames.json -->
```json
{
  "id": "frame-1",
  "components": {
    "rig.meta.named": {
      "name": "Frame 1",
      "stableId": "frame-1"
    },
    "rig.layout.frame": {
      "width": 116,
      "height": 172,
      "insets": 2,
      "columnCount": 2,
      "columnGutter": 4,
      "firstBaseline": "ascent"
    },
    "rig.spatial.relationship": {
      "parent": "page-1",
      "order": 0
    },
    "rig.spatial.transform": {
      "position": [
        16,
        18,
        0
      ]
    }
  }
}
```
<!-- rig:end -->

## `bim-model.json`

OpenBIM model cut: site, building, storey, space, a shared wall type, an extruded wall occurrence, an opening that voids the wall, and a door that fills the opening. IFC class is a string on `rig.bim.classify` - not a per-class schema. See [docs/openbim.md](../docs/openbim.md).

## `bim-bcf.json`

BCF thread: topic + comment + viewpoint (camera, selected elements, clip plane, snapshot asset).

## `bim-ids.json`

IDS specification: applicability facet (`IfcWall`) and requirement facet (`Pset_WallCommon.FireRating`). Specs-only document - no building model required.

## `lights.json`

Three lamps: directional (local −Z), point with `range`, spot with inner/outer cones. Pose stays on transform.

## `environment.json`

One image-based light. `hdri` is a [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `image`, lat-long Radiance file). Absent `intensity` is 1. Decode and spherical-harmonic coefficients stay in the host.

## `font-var.json`

Variable face: one `wght` axis (+ identity `avar`), a stem glyph `I` with default `rig.geometry.path` and a positive-weight [`rig.font.cell`](../schemas/font/cell.md) delta. Design space is first-class - [docs/ufo.md](../docs/ufo.md).

## `font-ufo.json`

UFO source as Rig: face metrics, a foreground layer, glyphs `A` / `V` / `space` / `acute` / `Aacute` (composite), a `top` anchor, pair `A`/`V`, a left kerning group, and AFDKO features as `rig.media.code`. Outlines are `rig.geometry.path` on the glyph. `.ufo` stays a host encoding - [docs/ufo.md](../docs/ufo.md).

One entity (the face):

<!-- rig:begin entity=face from=examples/font-ufo.json -->
```json
{
  "id": "face",
  "components": {
    "rig.meta.named": {
      "name": "LiveFace Regular",
      "stableId": "LiveFace-Regular"
    },
    "rig.font.face": {
      "family": "LiveFace",
      "style": "Regular",
      "unitsPerEm": 1000,
      "ascender": 800,
      "descender": -200,
      "capHeight": 700,
      "xHeight": 500,
      "version": "0.1",
      "features": "features-fea"
    }
  }
}
```
<!-- rig:end -->

## `place-address.json`

A site and a nested room: `rig.place.address` (UPU S42 / ISO 20022 `PostalAddress` fields) plus a WGS84 `rig.place.geo` pin on the site. Transform stays drawing pose; the civic fields are not scene coordinates.

## `person-contact.json`

A contact, an employer, and a character. Person parts compose: `rig.person.name`, `vital` (sex and gender identity are different fields), `contact`, `employment` (employer is an entity), `portrait` (photo is an `asset_ref`), and `rig.party.account` (ISO 20022 `CashAccount`). The organisation carries `rig.organisation.identity`. Formatted name stays on `rig.meta.named`; postal fields stay on `rig.place.address`. Document `createdAt` is envelope metadata, not a person field.

## `plant-taxon.json`

A site oak and a named rose. Taxon parts follow Darwin Core / ICNafp; the rose adds ICNCP `rig.plant.cultivar` (`cultivarEpithet` without quotes, `tradeDesignation` separate). Habit is growth form, not Darwin Core `habitat`. The oak's pin is `rig.place.geo`; the formatted name stays on `rig.meta.named`.

## `book-isbn.json`

A paperback edition: `rig.book.identifier` (ISO 2108 ISBN-13 digits only), `title` (subtitle / series - distinctive title stays on `rig.meta.named`), `publication` (publisher is an organisation entity), `contribution` (author is a person entity), `cover` (image `asset_ref`), and `subject` (Dewey). Not an ONIX XML message.

## `paper-citation.json`

Watson & Crick 1953: `rig.paper.identifier` (DOI / PMID), `article` (pages + date), `issue` (journal entity + volume). Authors reuse `rig.book.contribution`. One `rig.paper.citation` points at a cited work. Not a JATS XML file.

## `art-object.json`

Van Gogh *Irises*: CDWA core composed as `rig.art.object` / `creation` / `attribution` / `dimensions` / `material` / `location` / `subject` / `image`. Copyright is `rig.rights.statement` (`public-domain` + RightsStatements.org URI), not a year on the object.

## `commerce-offer.json`

A paperback offer: `rig.commerce.offer` (item + seller), `rig.commerce.price` (GBP amount, not a formatted string), `rig.commerce.discount` (`percent` 20), validity as `rig.calendar.span`. Not a cart or tax engine.

## `legal-agreement.json`

Employment instrument beside job facts: `rig.legal.agreement` + two `rig.legal.party` entities (employer / employee). Term is `rig.calendar.span`. The PDF is `rig.media.asset_ref`. `jobTitle` stays on `rig.person.employment`. Not e-sign workflow.

## `calendar-event.json`

Exhibition hours (`weekly` + `span`), Christmas dark day, Christmas Eve special hours on `exception`, opening-night `event`, weekly curator talk as `recurrence` fields (not an `RRULE` string), and one `attendee`. Venue is `rig.place.address`. Not iCalendar XML.

## `print-fgf.json`

Pellet printer envelope, a grade with density and zone temps, slice knobs plus stack sag, and a job whose `input` / `output` are `rig.media.asset_ref` entities. Not envelope `pdfX`, not a layout page, not [`rig.dev.machine`](../schemas/dev/machine.md), not host paths - [docs/print.md](../docs/print.md).

## `paint-brush.json`

One named brush entity: a size-12 flat with measured ferrule, bristle length, tip-to-max taper, and load capacity. Machine Z / feeds / dip stations are not on this component - [schemas/paint/brush.md](../schemas/paint/brush.md).

## `music-chord.json`

A pattern step and a free-time note that each sound C major: `pitch` 60 plus `intervals` `[4, 7]`. The next step is G minor (`[3, 7]` from 67). The last step is C alone. [`rig.audio.analysis`](../schemas/audio/analysis.md) asks for live `chroma`, `key`, and `chord`. Those values are not in the file.

## `visualizer.json`

A preset deck: two `kind` `preset` assets, a [`rig.pixel.canvas`](../schemas/pixel/canvas.md) `output`, [`rig.audio.analysis`](../schemas/audio/analysis.md) (live input, publish onset / note / color / temperature), and [`rig.picture.analysis`](../schemas/picture/analysis.md) pointed at the canvas. [`rig.visualizer.deck`](../schemas/visualizer.md) `switchOn` is `onset`. Live color values are not in the file.

## `robot-lesson.json`

A base link, a driven shoulder, and a hinge that mimics it. The lidar is a scan pattern, the eye is a camera plus a depth image, and the IMU is one sample at load. [`rig.sim.episode`](../schemas/sim/episode.md) points at the clip: the action track commands the drive, the observation track records acceleration. The cloud, the depth buffer, and any policy weights are not in the file - [docs/ros.md](../docs/ros.md).

## `robot-lab.json`

A bench in metres: Earth gravity and a 10 ms step on the scene, a static table, and a fixed-base arm with mass and inertia. The shoulder joint stores its angle at save. A wrist wrench, a forward range beam, a class camera, and a GNSS fix sit on the robot. Reset draws the base mass from a range. A policy names the drive and the two sensors. The reach attempt is recorded as failed. The solver, the depth image, and the trainer are not in the file - [docs/robot.md](../docs/robot.md).

## `record-bank.json`

A booked card payment, a long ISIN holding, an insurance policy (`kind` `insurance`), a claim, and a fraud case. The payment and the auth event point at the case with [`rig.record.concerns`](../schemas/record/concerns.md). PCI class and the card-auth assertion sit on the payment. Not a pacs message - [docs/records.md](../docs/records.md).

## `record-care.json`

An outpatient visit, a LOINC blood-pressure observation with `startSecond`, a CT series (`studyUid` / `seriesUid`), a phase-3 trial with one include criterion, and a research consent span. The patient carries `rig.person.identifier` `mrn`. A clinic note hangs on the visit. PHI marks sit on the visit, the observation, the study, the consent, and the note. Not a FHIR Bundle - [docs/records.md](../docs/records.md).

## `record-shop.json`

A branded sweater, a red-M variant (`parent`), warehouse stock, an offer whose `item` is the variant, and a two-unit order line. The bill is an invoice the pending payment points at. The box is in transit from the shed to the porch. A porch note hangs on the order. The buyer carries `taxId`. GTIN is digits only. Not a cart engine - [docs/records.md](../docs/records.md).

## `record-civic.json`

A benefits case, an in-force statute, a flood incident at a geo pin, and a responder boat whose GNSS fix [`rig.record.concerns`](../schemas/record/concerns.md) the incident. Not a case-management workflow - [docs/records.md](../docs/records.md).

## `vr-room.json`

A stage with a floor polygon, a headset (IPD, refresh, per-eye pixels), and two off-axis eyes on the head. The left controller carries grip and aim, a haptic click, and bindings for trigger and squeeze. A partial left hand (wrist through index tip) shows the joint parent chain. A floor pin keeps a `persistentId`. Sessions and swapchains are not in the file - [docs/vr.md](../docs/vr.md).

## `play-scene.json`

A small play scene: a dynamic ball on a hinge, a kinematic hero with health and a walk clip, a navmesh, a particle burst, sticks and a key binding, a spatial voice, a behavior action, an inventory, a spawner, a save slot, a network id, and a HUD bound to health. Contact manifolds, live particles, and the solved path are not in the file.

## `kicad-pcb.json`

A 30 x 20 mm LED board as it lands from a `.kicad_pcb`: board root with `source` pointing at the original file (the `.rigz` sidecar a writer merges onto), seven layers, three nets, and three parts - a pin header, a resistor, and an LED rotated 90 degrees in KiCad (`-90` about +Z here). Each pad is a terminal entity carrying both [`rig.circuit.pin`](../schemas/circuit/pin.md) and [`rig.pcb.pad`](../schemas/pcb/pad.md). Tracks, a via, a ground pour, an outline, and a silkscreen label that reads `{{reference}}`. A [`rig.sensor.gpio`](../schemas/sensor/gpio.md) entity drives BCM 17 and names header terminal 1 as its `terminal`. KiCad uuids are `stableId` - [docs/kicad.md](../docs/kicad.md).
