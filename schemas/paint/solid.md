# `rig.paint.solid`

Shared solid paint (optional library entity).

| Field | Type | Meaning |
|-------|------|---------|
| `rgba` | vec4 | 0–1 |
| `cmyk` | vec4 | Optional print quad; (0,0,0,0) = unused |

Inline draw colour also lives on [`rig.paint.fill_stroke`](fill-stroke.md). Use this schema when several entities share one paint entity.
