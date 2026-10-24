---
id: "rig.io.osc"
maturity: "stable"
summary: "OSC listen / send endpoints. Format when present. UDP is the default transport. TCP and multicast are off unless their fields are set."
fields:
  - name: "listenEnabled"
    ref: "bool"
    meaning: "Optional. UDP listen active; absent = false"
    absent: "false"
  - name: "listenPort"
    ref: "int"
    meaning: "UDP listen port; required when listenEnabled"
  - name: "sendEnabled"
    ref: "bool"
    meaning: "Optional. Send active; absent = false"
    absent: "false"
  - name: "sendHost"
    ref: "string"
    meaning: "Send target host; required when sendEnabled"
  - name: "sendPort"
    ref: "int"
    meaning: "Send port; required when sendEnabled"
  - name: "addressPrefix"
    ref: "string"
    meaning: "Optional. Address prefix"
  - name: "tcpListen"
    ref: "bool"
    meaning: "Optional. TCP listen; absent = false"
    absent: "false"
  - name: "tcpPort"
    ref: "int"
    meaning: "Optional. TCP port; absent or 0 = listenPort"
    absent: "or 0 = listenPort"
  - name: "tcpConnect"
    ref: "bool"
    meaning: "Optional. Dial sendHost:sendPort and send on that TCP connection; absent = false"
    absent: "false"
  - name: "streamFraming"
    type: "integer"
    enum: [0, 1]
    meaning: "Optional. 0 size prefix (4-byte big-endian), 1 SLIP. Absent = 0"
    absent: "0"
  - name: "multicastGroup"
    ref: "string"
    meaning: "Optional. IPv4 multicast group. Absent = unicast"
    absent: "unicast"
  - name: "multicastTtl"
    type: "integer"
    minimum: 0
    maximum: 255
    meaning: "Optional. Multicast TTL 0..255. Absent = 1"
    absent: "1"
---
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
