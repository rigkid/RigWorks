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

A page with `rig.spatial.anchor` `center` (page-local origin mid-trim) and a child rectangle with `bottomRight` registration — transform stays TRS; the 3×3 lives on the sibling component.

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

