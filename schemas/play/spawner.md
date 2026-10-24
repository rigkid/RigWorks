---
id: "rig.play.spawner"
maturity: "draft"
summary: "Clones a prototype on a period. Format when present."
fields:
  - name: "prototype"
    ref: "entity"
    required: true
    meaning: "Entity to clone"
  - name: "period"
    ref: "float"
    required: true
    meaning: "Seconds between spawns"
  - name: "maxAlive"
    ref: "uint"
    meaning: "Optional. Cap on living clones; absent = 1"
    absent: "1"
  - name: "active"
    ref: "bool"
    meaning: "Optional. Spawns while true; absent = true"
    absent: "true"
---
# `rig.play.spawner`

Clones a prototype on a period. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `prototype` | entity | Entity to clone |
| `period` | float | Seconds between spawns |
| `maxAlive` | uint | Optional. Cap on living clones; absent = 1 |
| `active` | bool | Optional. Spawns while true; absent = true |

The clone copies the prototype's components. Spawned entity ids and the cooldown clock stay in the host. The prototype itself is not one of the alive clones.
