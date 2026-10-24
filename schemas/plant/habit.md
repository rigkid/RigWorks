---
id: "rig.plant.habit"
maturity: "draft"
summary: "Growth form and mature size. Format when present."
topJson: "{\"description\":\"Growth form and mature size. Not Darwin Core habitat (that is the event site — compose place).\",\"minProperties\":1}"
fields:
  - name: "lifeForm"
    type: "string"
    enum: ["tree","shrub","herb","vine","grass","fern","moss","succulent","aquatic","palm","other"]
    meaning: "tree / shrub / herb / vine / grass / fern / moss / succulent / aquatic / palm / other"
  - name: "leafPersistence"
    type: "string"
    enum: ["deciduous","evergreen","semi-evergreen"]
    meaning: "deciduous / evergreen / semi-evergreen"
  - name: "heightMetres"
    ref: "float"
    meaning: "Typical mature height, metres"
  - name: "spreadMetres"
    ref: "float"
    meaning: "Typical mature spread, metres"
  - name: "hardiness"
    ref: "string"
    meaning: "Zone or rating as the source wrote it (USDA 7, RHS H4)"
---
# `rig.plant.habit`

Growth form and mature size. Format when present.

This is how the plant grows - not where it was recorded. Darwin Core `habitat` is the event site; that meaning is [`rig.place.address`](../place/address.md) / [`rig.place.geo`](../place/geo.md).

| Field | Type | Meaning |
|-------|------|---------|
| `lifeForm` | enum | `tree` / `shrub` / `herb` / `vine` / `grass` / `fern` / `moss` / `succulent` / `aquatic` / `palm` / `other` |
| `leafPersistence` | enum | `deciduous` / `evergreen` / `semi-evergreen` |
| `heightMetres` | float | Typical mature height, metres |
| `spreadMetres` | float | Typical mature spread, metres |
| `hardiness` | string | Zone or rating as the source wrote it (`USDA 7`, `RHS H4`) |

All fields optional. Emit what the source has. An empty component is invalid - attach at least one field.

Do not invent a single hardiness-zone system. Watering schedules, soil recipes, and bloom calendars stay in the source / host.
