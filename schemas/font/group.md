---
id: "rig.font.group"
maturity: "stable"
summary: "Kerning class. Format when present."
fields:
  - name: "members"
    type: "array"
    itemsRef: "string"
    required: true
    meaning: "Glyph names (stableId); may be empty"
  - name: "side"
    type: "string"
    enum: ["left","right"]
    meaning: "Optional. left / right; absent = unclassified"
    absent: "unclassified"
---
# `rig.font.group`

Kerning class. Format when present.

UFO `groups.plist`. Compose [`rig.meta.named`](../meta/named.md) - `stableId` is the group name (`public.kern1.A`). Not [`rig.spatial.group`](../spatial/group.md) (scene folder).

| Field | Type | Meaning |
|-------|------|---------|
| `members` | string[] | Glyph names (`stableId`); may be empty |
| `side` | enum | Optional. `left` / `right`; absent = unclassified |

Parent the group to the [`rig.font.face`](face.md). Member strings match glyph names, not entity ids.
