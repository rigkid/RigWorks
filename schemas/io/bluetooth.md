---
id: "rig.io.bluetooth"
maturity: "draft"
summary: "Classic Bluetooth audio sink. Format when present. The name phones see is rig.meta.named."
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Discoverable and able to accept a stream when true; absent = false"
    absent: "false"
---
# `rig.io.bluetooth`

Classic Bluetooth audio sink. Format when present. The name phones see is [`rig.meta.named`](../meta/named.md).

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Discoverable and able to accept a stream when true; absent = false |

Pairing, the peer name, and PCM are host cache. Gain and mute belong on [`rig.audio.bus`](../audio/bus.md). ESP32-S3 has no Classic Bluetooth; a host without that radio omits this component. This is not BLE, and it is not Wi-Fi audio.
