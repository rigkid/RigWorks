# `rig.music.clock`

Tick derivation from transport (or external sync). Format when present.

Does **not** own bpm — read [`rig.music.transport`](transport.md).

| Field | Type | Meaning |
|-------|------|---------|
| `ticksPerQuarter` | int | Pulses per quarter (e.g. 96) |
| `phaseTicks` | float | Running tick count |
| `swingAmount` | float | 0 = straight |
| `swingSubdiv` | int | Swing subdivision |
| `externalSync` | bool | External writer owns phase |
| `syncBeat` | float | External beat when `externalSync` |
| `syncPhase` | float | External phase 0–1 when `externalSync` |
| `syncPeriodBars` | float | External sync period in bars |

Product protocol names stay out of the schema id.
