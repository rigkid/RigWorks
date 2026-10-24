---
id: "rig.pixel.raster"
maturity: "stable"
summary: "RGBA buffer. Usually runtime-only; may appear in small documents when needed."
fields:
  - name: "role"
    type: "string"
    enum: ["working","output","layer-pixels","mask","composite"]
    required: true
    meaning: "working, output, layer-pixels, mask, composite"
  - name: "width"
    ref: "int"
    required: true
    meaning: "Pixels"
  - name: "height"
    ref: "int"
    required: true
    meaning: "Pixels"
  - name: "rgba"
    type: "array"
    itemsRef: "uint8"
    meaning: "Optional. Tight RGBA, length ≥ w×h×4; omit when derived"
  - name: "derived"
    ref: "bool"
    meaning: "Optional. Pixels rebuild from source + chain; absent = false"
    absent: "false"
  - name: "rebake"
    ref: "bool"
    meaning: "Optional. Host should rebuild on load; absent = false"
    absent: "false"
---
# `rig.pixel.raster`

RGBA buffer. Usually runtime-only; may appear in small documents when needed.

| Field | Type | Meaning |
|-------|------|---------|
| `role` | enum | working, output, layer-pixels, mask, composite |
| `width` | int | Pixels |
| `height` | int | Pixels |
| `rgba` | uint8[] | Optional. Tight RGBA, length ≥ w×h×4; omit when derived |
| `derived` | bool | Optional. Pixels rebuild from source + chain; absent = false |
| `rebake` | bool | Optional. Host should rebuild on load; absent = false |

No texture ids. Prefer rebuilding from source + chain over shipping large buffers.

**Honesty:** a size-only document must not fake `rgba[]`. Omit the buffer and set `derived` / `rebake` when pixels rebuild from source + chain.
