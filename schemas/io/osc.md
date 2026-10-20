# `rig.io.osc`

OSC listen / send endpoints. Format when present. UDP is the default transport. TCP and multicast are off unless their fields are set.

| Field | Type | Meaning |
|-------|------|---------|
| `listenEnabled` | bool | Optional. UDP listen active; absent = false |
| `listenPort` | int | UDP listen port; required when `listenEnabled` |
| `sendEnabled` | bool | Optional. Send active; absent = false |
| `sendHost` | string | Send target host; required when `sendEnabled` |
| `sendPort` | int | Send port; required when `sendEnabled` |
| `addressPrefix` | string | Optional. Address prefix |
| `tcpListen` | bool | Optional. TCP listen; absent = false |
| `tcpPort` | int | Optional. TCP port; absent or 0 = `listenPort` |
| `tcpConnect` | bool | Optional. Dial `sendHost:sendPort` and send on that TCP connection; absent = false |
| `streamFraming` | int | Optional. `0` size prefix (4-byte big-endian), `1` SLIP. Absent = 0 |
| `multicastGroup` | string | Optional. IPv4 multicast group. Absent = unicast |
| `multicastTtl` | int | Optional. Multicast TTL 0..255. Absent = 1 |

Listen and send sides are independent - enable one, both, or neither, and emit only the fields the enabled side needs.

Message queues and sockets are host runtime.
