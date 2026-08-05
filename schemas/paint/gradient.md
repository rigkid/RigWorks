# `rig.paint.gradient`

Shared gradient paint (optional library entity).

| Field | Type | Meaning |
|-------|------|---------|
| `kind` | enum | linear, radial |
| `stops` | {t:float, rgba:vec4}[] | Sorted t in 0–1 |
| `p0` | vec2 | Start / center |
| `p1` | vec2 | End / radius hint |
