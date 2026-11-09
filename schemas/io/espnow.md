---
id: "rig.io.espnow"
maturity: "draft"
summary: "ESP-NOW peer and payload. Format when present. The send itself is an action."
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Stack active when true; absent = false"
    absent: "false"
  - name: "peer"
    ref: "string"
    meaning: "Optional. Peer MAC, six hex bytes separated by colons. Absent = no peer"
    absent: "no peer"
  - name: "channel"
    type: "integer"
    minimum: 1
    maximum: 14
    meaning: "Optional. 2.4 GHz channel 1-14. Absent = the Wi-Fi radio's current channel"
    absent: "the Wi-Fi radio's current channel"
  - name: "payload"
    ref: "string"
    meaning: "Optional. Bytes to send, as text. Absent = empty"
    absent: "empty"
---
# `rig.io.espnow`

ESP-NOW peer and payload. Format when present. The send itself is an action.

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Stack active when true; absent = false |
| `peer` | string | Optional. Peer MAC, six hex bytes separated by colons. Absent = no peer |
| `channel` | int | Optional. 2.4 GHz channel 1-14. Absent = the Wi-Fi radio's current channel |
| `payload` | string | Optional. Bytes to send, as text. Absent = empty |

The action id `espnow.send` sends `payload` to `peer`. A pending flag and the last result are host cache. ESP-NOW uses the Wi-Fi radio, so a host whose radio `mode` is `off` refuses the send. This is not [`rig.io.osc`](osc.md) and not [`rig.net.replica`](../net/replica.md).
