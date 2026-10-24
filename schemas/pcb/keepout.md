---
id: "rig.pcb.keepout"
maturity: "experimental"
summary: "Rule area - what may not go inside an outline. Format when present."
fields:
  - name: "tracks"
    ref: "bool"
    meaning: "Optional. Tracks are kept out; absent = false"
    absent: "false"
  - name: "vias"
    ref: "bool"
    meaning: "Optional. Vias are kept out; absent = false"
    absent: "false"
  - name: "pads"
    ref: "bool"
    meaning: "Optional. Pads are kept out; absent = false"
    absent: "false"
  - name: "pours"
    ref: "bool"
    meaning: "Optional. Copper pours are kept out; absent = false"
    absent: "false"
  - name: "footprints"
    ref: "bool"
    meaning: "Optional. Footprints are kept out; absent = false"
    absent: "false"
---
# `rig.pcb.keepout`

Rule area - what may not go inside an outline. Format when present.

Compose on an entity with [`rig.geometry.polygon`](../geometry/polygon.md) and [`rig.pcb.layer_set`](layer-set.md), the same shape a [`rig.pcb.zone`](zone.md) uses.

| Field | Type | Meaning |
|-------|------|---------|
| `tracks` | bool | Optional. Tracks are kept out; absent = false |
| `vias` | bool | Optional. Vias are kept out; absent = false |
| `pads` | bool | Optional. Pads are kept out; absent = false |
| `pours` | bool | Optional. Copper pours are kept out; absent = false |
| `footprints` | bool | Optional. Footprints are kept out; absent = false |

`true` means not allowed. Checking the rule is a design-rule check in the host; results are not serialized.
