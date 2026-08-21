# `rig.layout.page`

A page, artboard, or frame — a bounded region content is composed against. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `index` | int | Optional. Position in the page sequence, ascending; absent = 0. Ties break by document order |
| `width` | float | Page width in `unit` |
| `height` | float | Page height in `unit` |
| `unit` | string | Optional. Overrides the document `defaultUnit` for this page (`"mm"`, `"px"`, `"in"`) |
| `margins` | number \| number[1..6] | Optional. Face insets **inward** from the local AABB (see below). Absent = no margins |
| `bleed` | number \| number[1..6] | Optional. Face extents **outward** past trim. Same channel order |
| `slug` | number \| number[1..6] | Optional. Face extents **outward** past bleed. Same channel order |

`width` and `height` describe the trim size (XY). Bleed and slug extend outward from it; margins inset inward. The three fields address the **same local AABB cuboid** as [`rig.spatial.anchor`](../spatial/anchor.md): the anchor picks which cell is local (0,0,0); inset channels are face offsets on that cuboid and do **not** remap when the origin cell moves (no axis invert).

### Face channels (Host Space: +X right, +Y up, +Z up)

| Index | Channel | Face | Margin (inward) | Bleed / slug (outward) |
|------:|---------|------|-----------------|-------------------------|
| 0 | top | max Y | −Y | +Y |
| 1 | right | max X | −X | +X |
| 2 | bottom | min Y | +Y | −Y |
| 3 | left | min X | +X | −X |
| 4 | floor | min Z | +Z | −Z |
| 5 | ceiling | max Z | −Z | +Z |

Each channel is an inset/extent **from that face**, not a span between faces. Z always has **both** sides when present: length 5 sets `floor` = `ceiling`; length 6 sets them independently. Lengths 1–4 leave Z unset (planar hosts).

### Shorthand (CSS-like, then Z)

| Wire | Expands to |
|------|------------|
| `10` or `[10]` | T=R=B=L=10; Z unset |
| `[12, 8]` | T=B=12, L=R=8; Z unset |
| `[12, 8, 4]` | T=12, L=R=8, B=4; Z unset |
| `[T, R, B, L]` | four XY faces (legacy) |
| `[T, R, B, L, z]` | XY + both Z faces = z |
| `[T, R, B, L, floor, ceiling]` | all six faces |

Catalog channel names for Z are `floor` / `ceiling` (face labels on the volume; not a civic address field). Emit the shortest equivalent form.

Name the page by composing [`rig.meta.named`](../meta/named.md). Content belongs to a page via [`rig.spatial.relationship`](../spatial/relationship.md), the same as any other parent. Which point of the page is local (0,0) — and where a page transform attaches — is [`rig.spatial.anchor`](../spatial/anchor.md), not a field here. Absent anchor ⇒ top-left of the trim (pages have no authored origin of their own).

Which page is currently open in an editor is host state, not a field here.
