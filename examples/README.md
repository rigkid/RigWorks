# Examples

Canonical Rig JSON documents. Copy the pattern; validate before you trust the output. Agent distillation of these rules: [`../skills/generating-rig-documents/SKILL.md`](../skills/generating-rig-documents/SKILL.md).

```bash
node tools/rig-validate/cli.js examples/minimal-scene.json
node tools/rig-validate/cli.js examples/lfo-binding.json
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

Shapes + hierarchy matching the RigKit `minimal` demo narrative: rect, circle, parent/child, triangle mesh, quad mesh.

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
        64,
        64,
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
    "rig.geometry.shape": {
      "type": "rectangle",
      "x1": 0,
      "y1": 0,
      "x2": 180,
      "y2": 110,
      "sides": 5,
      "innerRadius": 0.5
    },
    "rig.paint.fill_stroke": {
      "fillRgba": [
        0.25,
        0.65,
        1,
        1
      ],
      "strokeRgba": [
        0,
        0,
        0,
        1
      ],
      "strokeWidth": 1,
      "hasFill": true,
      "hasStroke": false
    },
    "rig.interact.selectable": {
      "enabled": true
    }
  }
}
```
<!-- rig:end -->

## `lfo-binding.json`

`rig.mod.lfo` on one entity, `rig.mod.binding` driving another entity’s `position.y` — Update-side data with no UI required.

## `ui-panel.json`

An LED-install flavoured control surface: `rig.ui.panel` with controls driving `rig.paint.solid` colour and `rig.mod.lfo` frequency, plus a reset `rig.ui.action`. Same schemas a desktop panel or an ESP32 web page would speak.
