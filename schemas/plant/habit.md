# `rig.plant.habit`

Growth form and mature size. Format when present.

This is how the plant grows — not where it was recorded. Darwin Core `habitat` is the event site; that meaning is [`rig.place.address`](../place/address.md) / [`rig.place.geo`](../place/geo.md).

| Field | Type | Meaning |
|-------|------|---------|
| `lifeForm` | enum | `tree` / `shrub` / `herb` / `vine` / `grass` / `fern` / `moss` / `succulent` / `aquatic` / `palm` / `other` |
| `leafPersistence` | enum | `deciduous` / `evergreen` / `semiEvergreen` |
| `heightMetres` | float | Typical mature height, metres |
| `spreadMetres` | float | Typical mature spread, metres |
| `hardiness` | string | Zone or rating as the source wrote it (`USDA 7`, `RHS H4`) |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

Do not invent a single hardiness-zone system. Watering schedules, soil recipes, and bloom calendars stay in the source / host.
