# `rig.sensor.presence`

Occupancy / presence reading. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `level` | float | Optional. 0–1 occupancy; absent = 0 |
| `device` | entity | Optional board / network entity; absent = local |

Digital hosts threshold `level` themselves. Bus addresses, UART handles, and raw mmWave packets stay in the host (or `x.<vendor>.*` device ops).
