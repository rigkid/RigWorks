# `rig.install.av_bus`

Show-level audio / visuals bus. Format when present.

This is not [`rig.render.visibility`](../render/visibility.md) — visibility hides a scene entity; this mutes the install's audio output and/or blacks out lighting.

| Field | Type | Meaning |
|-------|------|---------|
| `audioMuted` | bool | Optional. Audio silent when true; absent = false |
| `visualsBlackout` | bool | Optional. Visuals dark when true; absent = false |

A [`rig.calendar.weekly`](../calendar/weekly.md) window may *drive* this bus in Update; it does not replace it.
