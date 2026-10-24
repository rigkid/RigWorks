---
id: "rig.layout.character_style"
maturity: "draft"
summary: "Visual map for a rig.story.character_style. Format when present."
fields:
  - name: "storyStyle"
    ref: "entity"
    meaning: "Optional. Story character style this map applies to"
  - name: "basedOn"
    ref: "entity"
    meaning: "Optional. Parent layout character style; absent / null = none"
    absent: "/ null = none"
  - name: "font"
    ref: "entity"
    meaning: "Optional. rig.media.asset_ref kind font"
  - name: "fontSize"
    ref: "float"
    meaning: "Optional. Size override; absent = inherit paragraph"
    absent: "inherit paragraph"
  - name: "paint"
    ref: "entity"
    meaning: "Optional. Paint entity for the run colour"
  - name: "italic"
    ref: "bool"
    meaning: "Optional. Oblique / italic emphasis; absent = false"
    absent: "false"
  - name: "bold"
    ref: "bool"
    meaning: "Optional. Weight emphasis; absent = false"
    absent: "false"
  - name: "tracking"
    ref: "float"
    meaning: "Optional. Uniform letterspace in thousandths of an em; absent = 0"
    absent: "0"
  - name: "kerningMode"
    type: "string"
    enum: ["off","metrics"]
    meaning: "Optional. off / metrics (font kern / GPOS pairs). Absent = metrics"
    absent: "metrics"
  - name: "baselineShift"
    ref: "float"
    meaning: "Optional. Vertical shift off the baseline, positive raises; absent = 0"
    absent: "0"
  - name: "case"
    type: "string"
    enum: ["none","upper","lower","small-caps"]
    meaning: "Optional. none / upper / lower / small-caps. Absent = none"
    absent: "none"
---
# `rig.layout.character_style`

Visual map for a [`rig.story.character_style`](../story/character-style.md). Format when present.

Story character styles are identity only. Face override, size, paint, and emphasis flags live here.

| Field | Type | Meaning |
|-------|------|---------|
| `storyStyle` | entity | Optional. Story character style this map applies to |
| `basedOn` | entity | Optional. Parent layout character style; absent / `null` = none |
| `font` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) kind font |
| `fontSize` | float | Optional. Size override; absent = inherit paragraph |
| `paint` | entity | Optional. Paint entity for the run colour |
| `italic` | bool | Optional. Oblique / italic emphasis; absent = false |
| `bold` | bool | Optional. Weight emphasis; absent = false |
| `tracking` | float | Optional. Uniform letterspace in thousandths of an em; absent = `0` |
| `kerningMode` | enum | Optional. `off` / `metrics` (font kern / GPOS pairs). Absent = `metrics` |
| `baselineShift` | float | Optional. Vertical shift off the baseline, positive raises; absent = `0` |
| `case` | enum | Optional. `none` / `upper` / `lower` / `small-caps`. Absent = `none` |

Based-on chains stay acyclic. A cycle is a document error. Do not put these fields on `rig.story.*`.
