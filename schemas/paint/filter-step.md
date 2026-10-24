---
id: "rig.paint.filter_step"
maturity: "stable"
summary: "One primitive in a rig.paint.filter graph. Format when present."
fields:
  - name: "kind"
    type: "string"
    enum: ["blend","color-matrix","component-transfer","composite","convolve","diffuse-light","displacement","drop-shadow","flood","blur","image","merge","morphology","offset","specular-light","tile","turbulence"]
    required: true
    meaning: "blend, color-matrix, component-transfer, composite, convolve, diffuse-light, displacement, drop-shadow, flood, blur, image, merge, morphology, offset, specular-light, tile, turbulence"
  - name: "in"
    ref: "string"
    meaning: "Optional. source-graphic, source-alpha, or a step rig.meta.named stableId"
  - name: "in2"
    ref: "string"
    meaning: "Optional. Second input, same tokens"
  - name: "stdDeviation"
    ref: "float"
    meaning: "Optional. Blur / drop-shadow"
  - name: "offset"
    ref: "vec2"
    meaning: "Optional. Offset / drop-shadow"
  - name: "values"
    type: "array"
    itemsRef: "float"
    meaning: "Optional. Color-matrix / convolve kernel / component curve"
  - name: "operator"
    type: "string"
    enum: ["over","in","out","atop","xor","arithmetic","erode","dilate"]
    meaning: "Optional. Composite over / in / out / atop / xor / arithmetic; morphology erode / dilate"
  - name: "radius"
    ref: "float"
    meaning: "Optional. Morphology"
  - name: "rgba"
    ref: "rgba"
    meaning: "Optional. Flood"
  - name: "asset"
    ref: "entity"
    meaning: "Optional. Image primitive"
---
# `rig.paint.filter_step`

One primitive in a [`rig.paint.filter`](filter.md) graph. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | `blend`, `color-matrix`, `component-transfer`, `composite`, `convolve`, `diffuse-light`, `displacement`, `drop-shadow`, `flood`, `blur`, `image`, `merge`, `morphology`, `offset`, `specular-light`, `tile`, `turbulence` |
| `in` | string | Optional. `source-graphic`, `source-alpha`, or a step [`rig.meta.named`](../meta/named.md) `stableId` |
| `in2` | string | Optional. Second input, same tokens |
| `stdDeviation` | float | Optional. Blur / drop-shadow |
| `offset` | vec2 | Optional. Offset / drop-shadow |
| `values` | float[] | Optional. Color-matrix / convolve kernel / component curve |
| `operator` | enum | Optional. Composite `over` / `in` / `out` / `atop` / `xor` / `arithmetic`; morphology `erode` / `dilate` |
| `radius` | float | Optional. Morphology |
| `rgba` | vec4 | Optional. Flood |
| `asset` | entity | Optional. Image primitive |

Blend modes compose [`rig.render.blend`](../render/blend.md) on this step when `kind` is `blend`. Lighting vectors and kernel extras a host does not author stay off this schema. Unknown or unimplemented `kind` is skipped.
