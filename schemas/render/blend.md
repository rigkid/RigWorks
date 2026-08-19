# `rig.render.blend`

Per-entity opacity and blend mode. Format when present.

Compose on any drawable — scene geometry, meshes, and compositor stack entries. This is the only portable blend / opacity for scene entities. Do not put `blendMode` or `opacity` on [`rig.pixel.layer`](../pixel/layer.md) or geometry schemas.

| Field | Type | Meaning |
|-------|------|---------|
| `blendMode` | enum | Optional. See table; absent = `normal` |
| `opacity` | float | Optional. 0–1; absent = 1 |

Absent component means opaque normal blend, so a document only pays for entities that differ.

Show/hide is [`rig.render.visibility`](visibility.md) — a hidden entity is not drawn; this scales coverage when it is. `disabled` is not hide: it still draws, and skips the blend equation.

Hosts may implement a subset. Unknown or unimplemented modes treat as `normal`.

`blendMode` literals are the [Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/) tokens, plus `add` / `subtract` / `disabled`.

| Literal | Meaning |
|---------|---------|
| `normal` | Source over dest |
| `multiply` | Multiply |
| `screen` | Screen |
| `overlay` | Overlay |
| `darken` | Darken |
| `lighten` | Lighten |
| `color-dodge` | Color dodge |
| `color-burn` | Color burn |
| `hard-light` | Hard light |
| `soft-light` | Soft light |
| `difference` | Difference |
| `exclusion` | Exclusion |
| `hue` | Hue |
| `saturation` | Saturation |
| `color` | Color |
| `luminosity` | Luminosity |
| `add` | Source plus dest (not in CSS) |
| `subtract` | Clamped source minus dest (not in CSS) |
| `disabled` | Write source coverage as-is; do not run the blend equation |
