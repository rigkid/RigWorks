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
