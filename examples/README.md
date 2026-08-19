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
node tools/rig-validate/cli.js examples/story-flow.json
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
```

## SUDE sketch

Hosts honor Setup / Update / Draw / Exit. Data is ECS POD composed onto entities — the JSON below is what travels; the loop is how a host runs it.

```text
Setup:
  load or spawn entities from a Rig document
Update(dt):
  advance modulators, tweens, transport, bindings…
Draw:
  present transforms / shapes / meshes / whatever this host draws
Exit:
  release host state
```

## `minimal-scene.json`

A specimen sheet of the geometry vocabulary: rounded rectangle, circle, regular polygons (triangle, hexagon), star, parent/child hierarchy, closed and open polygons, line, and a quad mesh. Rendered to [`site/scene.svg`](../site/scene.svg) by [`tools/render-svg.mjs`](../tools/render-svg.mjs). Note what is *absent*: fill-only shapes carry just `fillRgba` and stroke-only shapes just `strokeRgba` — 0.8.0 defaults cover the rest.

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

`rig.mod.lfo` on one entity, `rig.mod.binding` driving another entity’s `position.y` — Update-system data (advance LFO + apply binding each `dt`); no UI required.

## `ui-panel.json`

An LED-install flavoured control surface: `rig.ui.panel` (`role: led.install`) with controls driving `rig.paint.solid` colour and `rig.mod.lfo` frequency, plus a shared `lfo.resetPhase` action. Same schemas a desktop panel or an ESP32 web page would speak.

## `portable-tool.json`

A tool document meant to travel: panel + nested `rig.ui.group` sections, controls bound to LFO and paint fields, shared action id. Author in one UI pack; load in another app that speaks the same schema ids.

## `path3d-spline3d.json`

A cubic space curve as `rig.geometry.path3d` (`cubicTo`) and a separate degree-3 NURBS as `rig.geometry.spline3d`. Authored forms stay distinct — do not dual-attach both on one contour.

## `page-anchor.json`

A page with `rig.spatial.anchor` `center` (page-local origin mid-trim) and a child rectangle with `bottomRight` registration plus a local `offset` — transform stays TRS; the 3×3 lives on the sibling component.

## `cad-boolean.json`

CSG difference of a cuboid minus a cylinder, fillet intent on every edge, a cube mesh with n-gon `loops` and a named-edge chamfer, plus a bilinear `rig.geometry.nurbs_surface`. The CAD tree is the solid source of truth; mesh on a CAD entity is an optional bake.

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

## `bim-model.json`

OpenBIM model cut: site → building → storey → space, a shared wall type, an extruded wall occurrence, an opening that voids the wall, and a door that fills the opening. IFC class is a string on `rig.bim.classify` — not a per-class schema. See [docs/openbim.md](../docs/openbim.md).

## `bim-bcf.json`

BCF thread: topic + comment + viewpoint (camera, selected elements, clip plane, snapshot asset).

## `bim-ids.json`

IDS specification: applicability facet (`IfcWall`) and requirement facet (`Pset_WallCommon.FireRating`). Specs-only document — no building model required.

## `lights.json`

Three lamps: directional (local −Z), point with `range`, spot with inner/outer cones. Pose stays on transform.

## `font-ufo.json`

UFO source as Rig: face metrics, a foreground layer, glyphs `A` / `V` / `space` / `acute` / `Aacute` (composite), a `top` anchor, pair `A`/`V`, a left kerning group, and AFDKO features as `rig.media.code`. Outlines are `rig.geometry.path` on the glyph. `.ufo` stays a host encoding — [docs/ufo.md](../docs/ufo.md).

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

A Penguin Classics edition: `rig.book.identifier` (ISO 2108 ISBN-13 digits only), `title` (subtitle / series — distinctive title stays on `rig.meta.named`), `publication` (publisher is an organisation entity), `contribution` (author is a person entity), `cover` (image `asset_ref`), and `subject` (Dewey). Not an ONIX XML message.

## `paper-citation.json`

Watson & Crick 1953: `rig.paper.identifier` (DOI / PMID), `article` (pages + date), `issue` (journal entity + volume). Authors reuse `rig.book.contribution`. One `rig.paper.citation` points at a cited work. Not a JATS XML file.

## `art-object.json`

Van Gogh *Irises*: CDWA core composed as `rig.art.object` / `creation` / `attribution` / `dimensions` / `material` / `location` / `subject` / `image`. Copyright is `rig.rights.statement` (`publicDomain` + RightsStatements.org URI), not a year on the object.

## `commerce-offer.json`

Penguin Classics paperback: `rig.commerce.offer` (item + seller), `rig.commerce.price` (GBP amount, not a formatted string), `rig.commerce.discount` (`percent` 20), validity as `rig.calendar.span`. Not a cart or tax engine.

## `legal-agreement.json`

Employment instrument beside job facts: `rig.legal.agreement` + two `rig.legal.party` entities (employer / employee). Term is `rig.calendar.span`. The PDF is `rig.media.asset_ref`. `jobTitle` stays on `rig.person.employment`. Not e-sign workflow.

## `calendar-event.json`

Exhibition hours (`weekly` + `span`), Christmas dark day, Christmas Eve special hours on `exception`, opening-night `event`, weekly curator talk as `recurrence` fields (not an `RRULE` string), and one `attendee`. Venue is `rig.place.address`. Not iCalendar XML.
