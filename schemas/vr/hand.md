---
id: "rig.vr.hand"
maturity: "draft"
summary: "A tracked hand. Format when present."
fields:
  - name: "player"
    ref: "int"
    meaning: "Optional. Player index (0-based); absent = 0"
    absent: "0"
  - name: "side"
    type: "string"
    enum: ["left","right"]
    required: true
    meaning: "left, right"
---
# `rig.vr.hand`

A tracked hand. Format when present.

Joints are child entities. Each one carries [`rig.vr.joint`](joint.md) and [`rig.spatial.transform`](../spatial/transform.md). Parent links are [`rig.spatial.relationship`](../spatial/relationship.md). The wrist parents to this entity. Further parents are the joint table in [`rig.vr.joint`](joint.md). Omit a joint you did not measure; parent the next one to the nearest present ancestor.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `side` | enum | `left`, `right` |

Skinning, when the hand is a mesh, is [`rig.anim.skeleton`](../anim/skeleton.md) and [`rig.anim.skin`](../anim/skin.md) on these same entities. This component only names the tracked hand.

A controller in that hand is a separate [`rig.vr.controller`](controller.md). Parent the hand to it when the host treats them as one rigid pose; the contract does not require that parent.
