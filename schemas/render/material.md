# `rig.render.material`

Shading parameters. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `albedoRgb` | vec3 | Base colour (0–1) |
| `albedoMap` | entity | Optional texture / paint entity; none = unused |
| `metallic` | float | 0–1 |
| `roughness` | float | 0–1 |
| `emissive` | vec3 | Emissive RGB (0–1) |

GPU programs live in code packs.
