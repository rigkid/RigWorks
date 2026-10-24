---
id: "rig.sim.domain"
maturity: "draft"
summary: "One property redrawn at each reset. Format when present. Training randomisation, not a live modulator (rig.mod.binding is that)."
fields:
  - name: "target"
    ref: "entity"
    required: true
    meaning: "Entity whose field is drawn"
  - name: "propertyKey"
    ref: "string"
    required: true
    meaning: "Field path, same addressing as rig.mod.binding"
  - name: "min"
    ref: "float"
    required: true
    meaning: "Inclusive lower end"
  - name: "max"
    ref: "float"
    required: true
    meaning: "Inclusive upper end"
  - name: "seed"
    ref: "int"
    meaning: "Optional. Draw seed. Absent = the host chooses"
    absent: "the host chooses"
---
# `rig.sim.domain`

One property redrawn at each reset. Format when present. Training randomisation, not a live modulator ([`rig.mod.binding`](../mod/binding.md) is that).

| Field | Type | Meaning |
|-------|------|---------|
| `target` | entity | Entity whose field is drawn |
| `propertyKey` | string | Field path, same addressing as [`rig.mod.binding`](../mod/binding.md) |
| `min` | float | Inclusive lower end |
| `max` | float | Inclusive upper end |
| `seed` | int | Optional. Draw seed. Absent = the host chooses |

The draw is uniform. A host samples once when the episode resets and writes the value onto `target`. Several components randomise several fields. Gaussian mixtures and correlated draws stay in the host.
