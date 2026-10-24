---
id: "rig.pcb.footprint"
maturity: "draft"
summary: "Board placement of a part. Format when present."
fields:
  - name: "library"
    ref: "string"
    meaning: "Optional. Library item the footprint came from, as the source tool names it (Package_SO:SOIC-8_3.9x4.9mm_P1.27mm); absent = board-only"
    absent: "board-only"
  - name: "side"
    type: "string"
    enum: ["front","back"]
    meaning: "Optional. front, back; absent = front"
    absent: "front"
  - name: "mount"
    type: "string"
    enum: ["smd","through-hole","other"]
    meaning: "Optional. smd, through-hole, other; absent = other"
    absent: "other"
  - name: "locked"
    ref: "bool"
    meaning: "Optional. Placement is fixed; absent = false"
    absent: "false"
---
# `rig.pcb.footprint`

Board placement of a part. Format when present.

Compose on the [`rig.circuit.part`](../circuit/part.md) entity, with [`rig.spatial.transform`](../spatial/transform.md) for position and rotation on the board. Pads are terminal children carrying [`rig.pcb.pad`](pad.md); silkscreen, courtyard, and fabrication drawings are children carrying geometry, paint, and [`rig.pcb.layer_set`](layer-set.md). Children are in part-local coordinates.

| Field | Type | Meaning |
|-------|------|---------|
| `library` | string | Optional. Library item the footprint came from, as the source tool names it (`Package_SO:SOIC-8_3.9x4.9mm_P1.27mm`); absent = board-only |
| `side` | enum | Optional. front, back; absent = front |
| `mount` | enum | Optional. smd, through-hole, other; absent = other |
| `locked` | bool | Optional. Placement is fixed; absent = false |

A back-side footprint's children already sit on back layers and in mirrored local coordinates - `side` records the fact; it does not ask a host to flip again.

3D model links, solder-mask and paste margins, and per-footprint clearances stay in the source file for now ([`rig.pcb.board`](board.md) `source`).
