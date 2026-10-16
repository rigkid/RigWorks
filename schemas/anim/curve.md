# `rig.anim.curve`

1D transfer curve - remap a normalized input `t` in `[0,1]` to an output in `[0,1]`. Format when present.

Used for easing, distribution, bulge/squeeze, and any host that needs an editable response curve. Not a 2D draw path - that is [`rig.geometry.path`](../geometry/path.md). Named tween easings on [`rig.anim.tween`](tween.md) stay as the short enum; this schema is the editable shape those names seed.

| Field | Type | Meaning |
|-------|------|---------|
| `points` | vec2[] | Control points. Each `x`/`y` in `[0,1]`. Sorted by ascending `x`. At least two points; hosts ensure endpoints at `x=0` and `x=1`. |
| `interpolation` | enum | Optional. `linear`, `smooth`, `bezier`; absent = `smooth`. |
| `handles` | object[] | Optional. Per-anchor `{in, out}` relative offsets. Same length as `points`. Meaningful only when `interpolation` is `bezier`; ignored otherwise. Hosts clamp each handle's x so the control point stays inside its segment (evaluation stays a function of t). |
| `preset` | enum | Optional. Named seed for `points`: `linear`, `ease-in`, `ease-out`, `ease-in-out`, `s-curve`, `bulge`, `squeeze`, `custom`. Absent = `custom` when points are authored, else `linear`. |

## Rules

- Evaluating at `t` interpolates in `x` and returns `y` (clamped to `[0,1]`). `bezier` is a cubic segment between neighbouring anchors using that pair's `out` / `in` handles.
- Changing `preset` to a named seed regenerates `points`. Editing points sets `preset` to `custom`.
- Runtime LUTs / caches are host-only - do not serialize.
- Treat unknown `interpolation` / `preset` as `smooth` / `custom` (keep points). `handles` without `bezier` are ignored.
