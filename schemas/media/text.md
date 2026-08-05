# `rig.media.text`

| Field | Type | Meaning |
|-------|------|---------|
| `text` | string | Content |
| `font` | entity | Optional. [`rig.media.asset_ref`](asset-ref.md) with kind font; absent = host default face |
| `fontSize` | float | Optional. Point or pixel size as the host documents; absent = host default |
| `rgba` | vec4 | Optional. Text colour (0–1); absent = black |
