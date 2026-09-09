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
