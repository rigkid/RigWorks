---
id: "rig.pcb.board"
maturity: "draft"
summary: "Printed circuit board root. Format when present."
fields:
  - name: "thickness"
    ref: "float"
    meaning: "Optional. Finished board thickness; absent = host default (1.6 mm is common)"
    absent: "host default (1"
  - name: "source"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref (kind document) the board was imported from; absent = authored in Rig"
    absent: "authored in Rig"
---
# `rig.pcb.board`

Printed circuit board root. Format when present.

Board layers ([`rig.pcb.layer`](layer.md)), nets, parts, tracks, vias, zones, and board graphics are children ([`rig.spatial.relationship`](../spatial/relationship.md) `parent`). The board outline is graphics on the layer whose role is `outline`. Lengths are scene lengths in `document.defaultUnit` (normally `mm`).

| Field | Type | Meaning |
|-------|------|---------|
| `thickness` | float | Optional. Finished board thickness; absent = host default (1.6 mm is common) |
| `source` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `document`) the board was imported from; absent = authored in Rig |

`source` is how a board goes back to its tool. A `.rigz` carries the original file in `data/`, and a writer merges this document onto it - [docs/kicad.md](../../docs/kicad.md#round-trip). Design rules, plot settings, and stackup detail live in that file until the catalog names them.
