# `rig.io.osc`

OSC UDP listen / send endpoints. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `listenEnabled` | bool | Listen active |
| `listenPort` | int | Listen port |
| `sendEnabled` | bool | Send active |
| `sendHost` | string | Send target host |
| `sendPort` | int | Send port |
| `addressPrefix` | string | Address prefix (optional) |

Message queues and sockets are host runtime.
