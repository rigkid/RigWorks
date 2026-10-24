---
id: "rig.render.material"
maturity: "stable"
summary: "Shading parameters. Format when present."
fields:
  - name: "albedoRgb"
    ref: "rgb"
    meaning: "Optional. Base colour (0-1); absent = white"
    absent: "white"
  - name: "albedoMap"
    ref: "entity"
    meaning: "Optional texture / paint entity; none = unused"
  - name: "metallic"
    ref: "float"
    meaning: "Optional. 0-1; absent = 0"
    absent: "0"
  - name: "roughness"
    ref: "float"
    meaning: "Optional. 0-1; absent = 1"
    absent: "1"
  - name: "emissive"
    ref: "rgb"
    meaning: "Optional. Emissive RGB (0-1); absent = black"
    absent: "black"
---
# `rig.render.material`

Shading parameters. Format when present.

Compose on the same entity as [`rig.geometry.mesh`](../geometry/mesh.md) (or another drawable that uses PBR). Do not add a `material` field on geometry schemas.

| Field | Type | Meaning |
|-------|------|---------|
| `albedoRgb` | vec3 | Optional. Base colour (0-1); absent = white |
| `albedoMap` | entity | Optional texture / paint entity; none = unused |
| `metallic` | float | Optional. 0-1; absent = 0 |
| `roughness` | float | Optional. 0-1; absent = 1 |
| `emissive` | vec3 | Optional. Emissive RGB (0-1); absent = black |

GPU programs live in code packs.
