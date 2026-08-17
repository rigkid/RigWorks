# `rig.bim.pset`

Property sets on a BIM element or type. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `sets` | object[] | Property sets; each has `name` and `properties` |

Each set:

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Property set name (`Pset_WallCommon`, …) |
| `properties` | object[] | Properties in that set |

Each property:

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Property name (`IsExternal`, `FireRating`, …) |
| `type` | enum | `bool`, `int`, `float`, or `string` |
| `flag` | bool | When `type` is `bool` |
| `integer` | int | When `type` is `int` |
| `number` | float | When `type` is `float` |
| `text` | string | When `type` is `string` |
| `unit` | string | Optional. Unit label for the value (`mm`, `m2`, …); absent = document `defaultUnit` or dimensionless |

Serialize `name`, `type`, and **only** the value field that `type` selects. Omit the others.

Do not reuse [`rig.node.param`](../node/param.md)’s `f` / `i` / `s` / `v` slots. Area, volume, fire rating, and other typed parameters belong here — not on [`rig.meta.tags`](../meta/tags.md).
