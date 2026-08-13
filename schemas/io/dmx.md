# `rig.io.dmx`

DMX512 port. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `universe` | int | Optional. Logical universe index; absent = 1 |
| `direction` | enum | `in` or `out` |
| `enabled` | bool | Optional. Port active; absent = true |

UART / RS485 handles and the 512-byte slot buffer stay in the host. Patch lamps with [`rig.dmx.fixture`](../dmx/fixture.md) on the light entities.
