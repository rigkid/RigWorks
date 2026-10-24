---
id: "rig.font.anchor"
maturity: "stable"
summary: "Named point on a glyph (UFO anchor). Format when present."
fields:
  - name: "point"
    ref: "vec2"
    required: true
    meaning: "Position in font units (y-up, baseline origin)"
---
# `rig.font.anchor`

Named point on a glyph (UFO anchor). Format when present.

Not [`rig.spatial.anchor`](../spatial/anchor.md) (3×3 registration cell) and not [`rig.spatial.vertex`](../spatial/vertex.md) (scene locator). Compose [`rig.meta.named`](../meta/named.md) for the UFO anchor name (`top`, `bottom`, `ogonek`).

Live on a **child** of the [`rig.font.glyph`](glyph.md).

| Field | Type | Meaning |
|-------|------|---------|
| `point` | vec2 | Position in font units (y-up, baseline origin) |
