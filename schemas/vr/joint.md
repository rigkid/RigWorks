---
id: "rig.vr.joint"
maturity: "draft"
summary: "One joint of a rig.vr.hand. Format when present."
fields:
  - name: "name"
    type: "string"
    enum: ["palm","wrist","thumb-metacarpal","thumb-proximal","thumb-distal","thumb-tip","index-metacarpal","index-proximal","index-intermediate","index-distal","index-tip","middle-metacarpal","middle-proximal","middle-intermediate","middle-distal","middle-tip","ring-metacarpal","ring-proximal","ring-intermediate","ring-distal","ring-tip","little-metacarpal","little-proximal","little-intermediate","little-distal","little-tip"]
    required: true
    meaning: "Joint in the standard hand set"
  - name: "radius"
    type: "number"
    minimum: 0
    meaning: "Optional. Sphere radius, scene units. Absent = not measured"
    absent: "not measured"
---
# `rig.vr.joint`

One joint of a [`rig.vr.hand`](hand.md). Format when present.

Pose is [`rig.spatial.transform`](../spatial/transform.md). Parent is [`rig.spatial.relationship`](../spatial/relationship.md).

| Field | Type | Meaning |
|-------|------|---------|
| `name` | enum | Joint in the standard hand set |
| `radius` | float | Optional. Sphere radius, scene units. Absent = not measured |

`name` is `palm`, `wrist`, or a finger joint: `thumb`, `index`, `middle`, `ring`, `little`, each with `metacarpal`, `proximal`, `distal`, `tip`, and (except the thumb) `intermediate`.

| Joint | Parent |
|-------|--------|
| `wrist` | the hand entity |
| `palm` | `wrist` |
| `thumb-metacarpal`, `index-metacarpal`, `middle-metacarpal`, `ring-metacarpal`, `little-metacarpal` | `wrist` |
| `*-proximal` | that finger's metacarpal |
| `*-intermediate` | that finger's proximal |
| `*-distal` | that finger's intermediate, or `thumb-proximal` for the thumb |
| `*-tip` | that finger's distal |

The thumb has no intermediate. A missing joint in the chain: parent to the nearest present ancestor, then the hand.

Confidence and the raw sample history stay in the host.
