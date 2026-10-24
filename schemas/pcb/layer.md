---
id: "rig.pcb.layer"
maturity: "draft"
summary: "One board layer - what it is for. Format when present."
fields:
  - name: "role"
    type: "string"
    enum: ["copper","silkscreen","solder-mask","solder-paste","adhesive","courtyard","fabrication","outline","margin","drawing","comment","eco","user"]
    required: true
    meaning: "copper, silkscreen, solder-mask, solder-paste, adhesive, courtyard, fabrication, outline, margin, drawing, comment, eco, user"
  - name: "side"
    type: "string"
    enum: ["front","back","inner"]
    meaning: "Optional. front, back, inner; absent = not sided (outline, drawing, user)"
    absent: "not sided (outline, drawing, user)"
---
# `rig.pcb.layer`

One board layer - what it is for. Format when present.

Compose on a child of the [`rig.pcb.board`](board.md). The canonical layer id (`F.Cu`, `B.SilkS`) is [`rig.meta.named`](../meta/named.md) `stableId`; a user-facing label is `name`. List order and colour are [`rig.spatial.layer`](../spatial/layer.md); show/hide is [`rig.render.visibility`](../render/visibility.md).

| Field | Type | Meaning |
|-------|------|---------|
| `role` | enum | copper, silkscreen, solder-mask, solder-paste, adhesive, courtyard, fabrication, outline, margin, drawing, comment, eco, user |
| `side` | enum | Optional. front, back, inner; absent = not sided (outline, drawing, user) |

Required: `role`.

Copper stack order is [`rig.spatial.layer`](../spatial/layer.md) `order` on the copper layers, front first, ascending to back. Items join layers through [`rig.pcb.layer_set`](layer-set.md) - not through `parent`, which stays the pose graph.
