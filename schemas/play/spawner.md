# `rig.play.spawner`

Clones a prototype on a period. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `prototype` | entity | Entity to clone |
| `period` | float | Seconds between spawns |
| `maxAlive` | uint | Optional. Cap on living clones; absent = 1 |
| `active` | bool | Optional. Spawns while true; absent = true |

The clone copies the prototype's components. Spawned entity ids and the cooldown clock stay in the host. The prototype itself is not one of the alive clones.
