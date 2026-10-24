---
id: "rig.input.buttons"
maturity: "draft"
summary: "Logical button state for one player. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "left"
    ref: "bool"
    meaning: "Optional. Left / west; absent = false"
    absent: "false"
  - name: "right"
    ref: "bool"
    meaning: "Optional. Right / east; absent = false"
    absent: "false"
  - name: "up"
    ref: "bool"
    meaning: "Optional. Up / north; absent = false"
    absent: "false"
  - name: "down"
    ref: "bool"
    meaning: "Optional. Down / south; absent = false"
    absent: "false"
  - name: "o"
    ref: "bool"
    meaning: "Optional. Primary action (O / A / confirm); absent = false"
    absent: "false"
  - name: "x"
    ref: "bool"
    meaning: "Optional. Secondary action (X / B / cancel); absent = false"
    absent: "false"
---
# `rig.input.buttons`

Logical button state for one player. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for a label. Portable state only - device handles, keybinds, and edge/pulse caches stay in the host.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `left` | bool | Optional. Left / west; absent = false |
| `right` | bool | Optional. Right / east; absent = false |
| `up` | bool | Optional. Up / north; absent = false |
| `down` | bool | Optional. Down / south; absent = false |
| `o` | bool | Optional. Primary action (O / A / confirm); absent = false |
| `x` | bool | Optional. Secondary action (X / B / cancel); absent = false |

Hosts poll hardware into these fields during `Update`. A common layout is a d-pad plus two face buttons. Sticks and triggers are [`rig.input.axes`](axes.md). A pointer is [`rig.input.pointer`](pointer.md). Which device control feeds a field is [`rig.input.binding`](binding.md). Press and release edges stay in the host.
