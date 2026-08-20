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

Based-on chains stay acyclic. A cycle is a document error. Do not put these fields on `rig.story.*`.
