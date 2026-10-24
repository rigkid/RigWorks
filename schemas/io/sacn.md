---
id: "rig.io.sacn"
maturity: "draft"
summary: "E1.31 (sACN) over the network. Format when present."
fields:
  - name: "universe"
    type: "integer"
    minimum: 1
    maximum: 63999
    required: true
    meaning: "1-63999. First (or only) universe"
  - name: "direction"
    type: "string"
    enum: ["in","out"]
    meaning: "Optional. out (transmit) or in (receive); absent = out"
    absent: "out"
  - name: "universeCount"
    type: "integer"
    minimum: 1
    maximum: 63999
    meaning: "Optional. Contiguous universes starting at universe; absent = 1"
    absent: "1"
  - name: "startChannel"
    type: "integer"
    minimum: 1
    maximum: 512
    meaning: "Optional. 1-512; first DMX slot used in the universe; absent = 1"
    absent: "1"
  - name: "host"
    ref: "string"
    meaning: "Optional. Unicast peer; absent means multicast for that universe"
    absent: "multicast for that universe"
  - name: "fps"
    ref: "float"
    meaning: "Optional. Send rate when direction is out; absent means the host's frame rate"
    absent: "the host's frame rate"
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Whether the endpoint is running; absent = true"
    absent: "true"
  - name: "uvMap"
    ref: "entity"
    meaning: "Optional. Entity carrying rig.led.uv_map - pixel *output* path; unused for plain DMX receive"
---
# `rig.io.sacn`

E1.31 (sACN) over the network. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `universe` | int | 1-63999. First (or only) universe |
| `direction` | enum | Optional. `out` (transmit) or `in` (receive); absent = `out` |
| `universeCount` | int | Optional. Contiguous universes starting at `universe`; absent = 1 |
| `startChannel` | int | Optional. 1-512; first DMX slot used in the universe; absent = 1 |
| `host` | string | Optional. Unicast peer; absent means multicast for that universe |
| `fps` | float | Optional. Send rate when `direction` is `out`; absent means the host's frame rate |
| `enabled` | bool | Optional. Whether the endpoint is running; absent = true |
| `uvMap` | entity | Optional. Entity carrying [`rig.led.uv_map`](../led/uv-map.md) - pixel *output* path; unused for plain DMX receive |

When `direction` is `out` with a UV map, this completes the LED path already covered by [`rig.led.uv_map`](../led/uv-map.md) and [`rig.io.serial`](serial.md): the UV map says where each pixel samples the canvas, this says where the bytes go. Channel count then follows from the pixel count of the referenced UV map.

When `direction` is `in`, the host writes received slots into its DMX buffer (see also [`rig.io.dmx`](dmx.md)). `universeCount` names how many consecutive universes to listen to from `universe`.

A fixture spanning more than one universe uses one entity per universe when mapping fixtures; a receive listener may instead set `universeCount`.

Colour order (RGB versus GRB and friends) is a property of the fixture, not of the document, and is not carried here.
