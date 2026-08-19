# `rig.anim.curve`

1D transfer curve — remap a normalized input `t` in `[0,1]` to an output in `[0,1]`. Format when present.

Used for easing, distribution, bulge/squeeze, and any host that needs an editable response curve. Not a 2D draw path — that is [`rig.geometry.path`](../geometry/path.md). Named tween easings on [`rig.anim.tween`](tween.md) stay as the short enum; this schema is the editable shape those names seed.

| Field | Type | Meaning |
|-------|------|---------|
| `points` | vec2[] | Control points. Each `x`/`y` in `[0,1]`. Sorted by ascending `x`. At least two points; hosts ensure endpoints at `x=0` and `x=1`. |
| `interpolation` | enum | Optional. `linear`, `smooth`; absent = `smooth`. |
| `preset` | enum | Optional. Named seed for `points`: `linear`, `ease-in`, `ease-out`, `ease-in-out`, `s-curve`, `bulge`, `squeeze`, `custom`. Absent = `custom` when points are authored, else `linear`. |

## Rules

- Evaluating at `t` interpolates in `x` and returns `y` (clamped to `[0,1]`).
- Changing `preset` to a named seed regenerates `points`. Editing points sets `preset` to `custom`.
- Runtime LUTs / caches are host-only — do not serialize.
- Unknown `interpolation` / `preset` → treat as `smooth` / `custom` (keep points).
