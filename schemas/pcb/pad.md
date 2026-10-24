---
id: "rig.pcb.pad"
maturity: "draft"
summary: "Copper land for one terminal. Format when present."
fields:
  - name: "kind"
    type: "string"
    enum: ["through-hole","smd","connector","non-plated"]
    required: true
    meaning: "through-hole, smd, connector (edge finger, no paste), non-plated"
  - name: "shape"
    type: "string"
    enum: ["circle","rectangle","oval","trapezoid","rounded-rectangle","custom"]
    required: true
    meaning: "circle, rectangle, oval, trapezoid, rounded-rectangle, custom"
  - name: "width"
    ref: "float"
    required: true
    meaning: "Pad size along local X"
  - name: "height"
    ref: "float"
    required: true
    meaning: "Pad size along local Y"
  - name: "cornerRatio"
    type: "number"
    minimum: 0
    maximum: 0.5
    meaning: "Optional. Corner radius over the shorter side, 0-0.5, for rounded-rectangle; absent = 0.25"
    absent: "0"
  - name: "drillWidth"
    ref: "float"
    meaning: "Optional. Hole size along local X; absent = no hole"
    absent: "no hole"
  - name: "drillHeight"
    ref: "float"
    meaning: "Optional. Hole size along local Y; absent = drillWidth (round hole). Unequal = slot"
    absent: "drillWidth (round hole)"
  - name: "drillOffset"
    ref: "vec2"
    meaning: "Optional. Hole centre from pad centre; absent = (0, 0)"
    absent: "(0, 0)"
---
# `rig.pcb.pad`

Copper land for one terminal. Format when present.

Compose on the terminal entity next to [`rig.circuit.pin`](../circuit/pin.md) (number, function, net). Position and rotation are [`rig.spatial.transform`](../spatial/transform.md), local to the parent part. Layers are [`rig.pcb.layer_set`](layer-set.md). A non-plated mounting hole has no electrical meaning and may omit the pin component.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | through-hole, smd, connector (edge finger, no paste), non-plated |
| `shape` | enum | circle, rectangle, oval, trapezoid, rounded-rectangle, custom |
| `width` | float | Pad size along local X |
| `height` | float | Pad size along local Y |
| `cornerRatio` | float | Optional. Corner radius over the shorter side, 0-0.5, for `rounded-rectangle`; absent = 0.25 |
| `drillWidth` | float | Optional. Hole size along local X; absent = no hole |
| `drillHeight` | float | Optional. Hole size along local Y; absent = `drillWidth` (round hole). Unequal = slot |
| `drillOffset` | vec2 | Optional. Hole centre from pad centre; absent = (0, 0) |

Required: `kind`, `shape`, `width`, `height`.

`custom` shapes, trapezoid deltas, corner chamfers, and per-pad mask / paste / thermal overrides stay in the source file for now ([`rig.pcb.board`](board.md) `source`). A pad created in Rig with `custom` has no outline to write - use a named shape.
