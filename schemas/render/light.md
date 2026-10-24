---
id: "rig.render.light"
maturity: "stable"
summary: "Pose on transform. Directional and spot shine along local −Z (world). Point and spot use world translation."
fields:
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Light on; absent = true"
    absent: "true"
  - name: "type"
    type: "string"
    enum: ["directional","point","spot"]
    meaning: "Optional. directional, point, spot; absent = point"
    absent: "point"
  - name: "rgb"
    ref: "rgb"
    meaning: "Optional. Light colour (0-1); absent = white. Hosts may store as three floats"
    absent: "white"
  - name: "intensity"
    ref: "float"
    meaning: "Optional. Scale; absent = 1"
    absent: "1"
  - name: "ambient"
    ref: "float"
    meaning: "Optional. Fill / darkest band level; absent = 0"
    absent: "0"
  - name: "banded"
    ref: "bool"
    meaning: "Optional. Discrete shade steps when true; absent = false"
    absent: "false"
  - name: "bands"
    ref: "int"
    meaning: "Band count; required when banded"
  - name: "range"
    ref: "float"
    meaning: "Optional. Attenuation cutoff in content units. Absent = no cutoff (infinite). Ignored on directional"
    absent: "no cutoff (infinite)"
  - name: "innerConeDegrees"
    ref: "float"
    meaning: "Optional. Spot penumbra inner half-angle; absent = 0. Ignored unless type is spot"
    absent: "0"
  - name: "outerConeDegrees"
    ref: "float"
    meaning: "Optional. Spot cone outer half-angle; absent = 45. Ignored unless type is spot"
    absent: "45"
---
# `rig.render.light`

| Field | Type | Meaning |
|-------|------|---------|
| `enabled` | bool | Optional. Light on; absent = true |
| `type` | enum | Optional. directional, point, spot; absent = point |
| `rgb` | vec3 | Optional. Light colour (0-1); absent = white. Hosts may store as three floats |
| `intensity` | float | Optional. Scale; absent = 1 |
| `ambient` | float | Optional. Fill / darkest band level; absent = 0 |
| `banded` | bool | Optional. Discrete shade steps when true; absent = false |
| `bands` | int | Band count; required when `banded` |
| `range` | float | Optional. Attenuation cutoff in content units. Absent = no cutoff (infinite). Ignored on directional |
| `innerConeDegrees` | float | Optional. Spot penumbra inner half-angle; absent = 0. Ignored unless `type` is spot |
| `outerConeDegrees` | float | Optional. Spot cone outer half-angle; absent = 45. Ignored unless `type` is spot |

Pose on transform. Directional and spot shine along local −Z (world). Point and spot use world translation.

A patched show lamp is this light plus [`rig.dmx.fixture`](../dmx/fixture.md) on the same entity. Looks compose [`rig.light.look`](../light/look.md).

No area lights. No light object handle.
