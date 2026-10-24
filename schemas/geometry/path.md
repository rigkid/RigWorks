# `rig.geometry.path`

Freeform 2D path command stream. Format when present. Space curves use [`rig.geometry.path3d`](path3d.md).

Not a parametric shape. A contour that stays editable as parameters belongs to one of the primitives - [`rectangle`](rectangle.md), [`ellipse`](ellipse.md), [`line`](line.md), [`polygon`](polygon.md), [`regular_polygon`](regular-polygon.md), [`star`](star.md), [`arc`](arc.md), [`ring`](ring.md), [`spline`](spline.md). Use a path once it has been resolved to commands, and never both for the same contour. A freeform contour may contain `arc-to`. A contour that is still an editable centre-and-angles span stays [`arc`](arc.md). The same contour is never both.

| Field | Type | Meaning |
|-------|------|---------|
| `commands` | command[] | Ordered path commands |
| `fillRule` | enum | Optional. nonzero, evenodd; absent = nonzero |

## Command

| Field | Type | Meaning |
|-------|------|---------|
| `type` | enum | move-to, line-to, cubic-to, quad-to, close, arc-to |
| `point` | vec2 | Endpoint (move/line/cubic/quad/arc); unused for close |
| `control1` | vec2 | Cubic/quad control 1 |
| `control2` | vec2 | Cubic control 2 |
| `radiusX` | float | Arc x-radius (`arc-to`) |
| `radiusY` | float | Arc y-radius (`arc-to`) |
| `xAxisRotationDegrees` | float | Arc ellipse x-axis rotation (`arc-to`) |
| `largeArc` | bool | Optional. Arc large-arc flag; absent = false |
| `sweep` | bool | Optional. Arc sweep flag; absent = false |

Closed contours use a `close` command. Skip or reject unknown types. Extend only by appending enum values.

Holes are extra `move-to` ... `close` subpaths - no `holes` array. First subpath is the outer (clockwise in 2D page space). Later subpaths with opposite winding punch holes when `fillRule` is `nonzero`. Under `evenodd`, overlap toggles and winding sign does not matter. Fonts / UFO stay `nonzero`. Glyph contours are in font-unit y-up ([`rig.font.glyph`](../font/glyph.md)); opposite-winding subpaths still punch holes. Do not put `fillRule` on paint. Appearance: [`rig.paint.fill_stroke`](../paint/fill-stroke.md). Text that follows this contour composes [`rig.media.text_path`](../media/text-path.md) on the run.
