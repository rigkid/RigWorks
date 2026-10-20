# `rig.anim.track`

Sampled keys for one property on one clip. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `clip` | entity | [`rig.anim.clip`](clip.md) |
| `target` | entity | Entity whose field is driven |
| `propertyKey` | string | Field name / path (same style as tween) |
| `times` | float[] | Sample times in seconds, ascending, within the clip |
| `values` | float[] | Packed samples. Length = `times.length * stride` |
| `stride` | int | `1` float, `3` vec3, `4` quaternion in x, y, z, w |

Evaluation is the host. Between samples, interpolate. Quaternions slerp. Outside the clip, hold the end sample when `wrap` is `once`. `loop` repeats. `ping-pong` reverses.
