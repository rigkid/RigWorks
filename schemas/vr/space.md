---
id: "rig.vr.space"
maturity: "draft"
summary: "Where the user stands in the scene. Format when present."
fields:
  - name: "reference"
    type: "string"
    enum: ["local","local-floor","stage","unbounded"]
    required: true
    meaning: "local, local-floor, stage, unbounded"
  - name: "bounds"
    schemaJson: "{\"type\":\"array\",\"minItems\":3,\"items\":{\"$ref\":\"./_defs.schema.json#/$defs/vec2\"},\"$comment\":\"Each item is x, z in this space, scene units. Y is the floor.\"}"
    meaning: "Optional. Play-area polygon. Each item is **x, z** in this space, scene units. At least 3. Absent = no recorded boundary"
    absent: "no recorded boundary"
---
# `rig.vr.space`

Where the user stands in the scene. Format when present.

Pose is [`rig.spatial.transform`](../spatial/transform.md). Parent is [`rig.spatial.relationship`](../spatial/relationship.md). A label is [`rig.meta.named`](../meta/named.md). 3D axes: [document.md](../document.md#axes).

| Field | Type | Meaning |
|-------|------|---------|
| `reference` | enum | `local`, `local-floor`, `stage`, `unbounded` |
| `bounds` | vec2[] | Optional. Play-area polygon. Each item is **x, z** in this space, scene units. At least 3. Absent = no recorded boundary |

`local` puts the origin at the head where the session started. `local-floor` uses that same yaw and puts Y = 0 on the floor. `stage` is a room: origin on the floor, bounds when the play area is known. `unbounded` is a large space with no boundary.

`bounds` is the floor outline (guardian, chaperone, bounded floor). Y of the space is the floor for `local-floor` and `stage`. Do not repeat the first point to close the ring.

Sessions, recentering, and the live boundary mesh stay in the host. OpenXR and WebXR map onto this component - [docs/vr.md](../../docs/vr.md).
