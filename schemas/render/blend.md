# `rig.render.blend`

Per-entity opacity and blend mode. Format when present.

Compose on any drawable — scene geometry, meshes, and compositor stack entries. This is the only portable blend / opacity for scene entities. Do not put `blendMode` or `opacity` on [`rig.pixel.layer`](../pixel/layer.md) or geometry schemas.

| Field | Type | Meaning |
|-------|------|---------|
| `blendMode` | enum | Optional. normal, multiply, screen, overlay, add; absent = normal |
| `opacity` | float | Optional. 0–1; absent = 1 |

Absent component means opaque normal blend, so a document only pays for entities that differ.

Show/hide is [`rig.render.visibility`](visibility.md) — a hidden entity is not drawn; this scales coverage when it is.
