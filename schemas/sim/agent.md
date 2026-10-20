# `rig.sim.agent`

Walker on a navmesh. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `navmesh` | entity | Entity with [`rig.sim.navmesh`](navmesh.md) |
| `speed` | float | Units per second |
| `radius` | float | Optional. Clearance. Absent = the host default |
| `goal` | entity | Optional. Target. Its transform position is the destination |
| `destination` | vec3 | Optional. World point. Ignored when `goal` is set |
| `height` | float | Optional. Agent height. Absent = the host default |
| `stoppingDistance` | float | Optional. Distance at which the goal counts as reached; absent = 0 |
| `avoidance` | bool | Optional. Steer around other agents; absent = false |

Absent `goal` and `destination` means idle. The path, neighbour lists, and avoidance horizons stay in the host.
