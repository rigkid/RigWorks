# `rig.font.group`

Kerning class. Format when present.

UFO `groups.plist`. Compose [`rig.meta.named`](../meta/named.md) — `stableId` is the group name (`public.kern1.A`). Not [`rig.spatial.group`](../spatial/group.md) (scene folder).

| Field | Type | Meaning |
|-------|------|---------|
| `members` | string[] | Glyph names (`stableId`); may be empty |
| `side` | enum | Optional. `left` / `right`; absent = unclassified |

Parent the group to the [`rig.font.face`](face.md). Member strings match glyph names, not entity ids.
