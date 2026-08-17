# `rig.font.kern`

One kerning pair. Format when present.

UFO `kerning.plist` entry. `left` / `right` are **names** (glyph `stableId` or [`rig.font.group`](group.md) `stableId`), not entity ids — that matches the plist keys.

| Field | Type | Meaning |
|-------|------|---------|
| `left` | string | Left glyph or group name |
| `right` | string | Right glyph or group name |
| `value` | float | Pair adjustment in font units (negative = tighter) |

Parent pairs to the [`rig.font.face`](face.md). One pair per entity. Group-to-group pairs use the group names as written in the UFO.
