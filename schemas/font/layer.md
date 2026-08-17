# `rig.font.layer`

UFO layer identity. Format when present.

Compose [`rig.meta.named`](../meta/named.md) for the layer name (`public.default`, `background`). Parent the layer to the [`rig.font.face`](face.md); parent glyphs to this layer — [`rig.spatial.relationship`](../spatial/relationship.md).

Not [`rig.spatial.layer`](../spatial/layer.md) (scene draw stack).

| Field | Type | Meaning |
|-------|------|---------|
| `role` | enum | Optional. `foreground` / `background` / `spare`; absent = `foreground` |
