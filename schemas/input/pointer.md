---
id: "rig.input.pointer"
maturity: "draft"
summary: "Logical pointer for one player. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "x"
    type: "number"
    minimum: 0
    maximum: 1
    required: true
    meaning: "Horizontal position, 0-1 across the viewport"
  - name: "y"
    type: "number"
    minimum: 0
    maximum: 1
    required: true
    meaning: "Vertical position, 0-1 down the viewport"
  - name: "primary"
    ref: "bool"
    meaning: "Optional. Primary button level; absent = false"
    absent: "false"
  - name: "secondary"
    ref: "bool"
    meaning: "Optional. Secondary button level; absent = false"
    absent: "false"
---
# `rig.input.pointer`

Logical pointer for one player. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `x` | float | Horizontal position, 0-1 across the viewport |
| `y` | float | Vertical position, 0-1 down the viewport |
| `primary` | bool | Optional. Primary button level; absent = false |
| `secondary` | bool | Optional. Secondary button level; absent = false |

`x` and `y` are ratios of the host viewport, not scene lengths. Press and release edges stay in the host. Device mapping is [`rig.input.binding`](binding.md).
