# `rig.bim.facet`

One IDS facet — applicability or requirement. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `role` | enum | `applicability` or `requirement` |
| `kind` | enum | `entity`, `attribute`, `classification`, `property`, `material`, or `partOf` |
| `cardinality` | enum | Optional. `required`, `prohibited`, or `optional` — requirements only; absent = `required` when `role` is `requirement` |
| `ifcClass` | string | When `kind` is `entity` (or as needed for other kinds) |
| `predefinedType` | string | Optional. IFC predefined type filter |
| `attributeName` | string | When `kind` is `attribute` |
| `propertySet` | string | When `kind` is `property` |
| `propertyName` | string | When `kind` is `property` |
| `value` | string | Optional. Expected value (string form); absent = presence-only |
| `scheme` | string | When `kind` is `classification` (or material scheme) |
| `partOfClass` | string | When `kind` is `partOf` — parent IFC class |
| `partOfRelation` | string | Optional. When `kind` is `partOf` — relation name |

Emit only the fields the chosen `kind` needs; leave the rest absent. List this entity on [`rig.bim.spec`](spec.md) `applicability` or `requirements`.
