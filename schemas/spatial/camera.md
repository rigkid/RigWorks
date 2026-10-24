---
id: "rig.spatial.camera"
maturity: "stable"
summary: "Projection parameters (pose lives on transform). Format when present."
fields:
  - name: "active"
    ref: "bool"
    meaning: "Optional. Used for present (typically one); absent = true"
    absent: "true"
  - name: "projection"
    type: "string"
    enum: ["perspective","orthographic"]
    meaning: "Optional. perspective, orthographic; absent = perspective"
    absent: "perspective"
  - name: "fovYDegrees"
    ref: "float"
    meaning: "Optional. Perspective FOV (degrees); absent = 60. Ignored if orthographic, and ignored when the four off-axis angles below are all set"
    absent: "60"
  - name: "leftDegrees"
    ref: "float"
    meaning: "Optional. Signed degrees from −Z to the left clip plane. Negative when that plane sits left of the axis"
  - name: "rightDegrees"
    ref: "float"
    meaning: "Optional. Signed degrees to the right clip plane. Positive when that plane sits right of the axis"
  - name: "upDegrees"
    ref: "float"
    meaning: "Optional. Signed degrees to the top clip plane. Positive when that plane sits above the axis"
  - name: "downDegrees"
    ref: "float"
    meaning: "Optional. Signed degrees to the bottom clip plane. Negative when that plane sits below the axis"
  - name: "orthoHeight"
    ref: "float"
    meaning: "Ortho frustum height; required when orthographic"
  - name: "nearClip"
    ref: "float"
    meaning: "Optional. Near plane; absent = 0.1"
    absent: "0"
  - name: "farClip"
    ref: "float"
    meaning: "Optional. Far plane; absent = 1000"
    absent: "1000"
  - name: "aspect"
    ref: "float"
    meaning: "Optional. Absent or 0 = use viewport aspect at present"
    absent: "or 0 = use viewport aspect at present"
  - name: "fixedAspect"
    ref: "bool"
    meaning: "Optional. Keep aspect when the viewport changes; absent = false"
    absent: "false"
---
# `rig.spatial.camera`

Projection parameters (pose lives on transform). Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `active` | bool | Optional. Used for present (typically one); absent = true |
| `projection` | enum | Optional. perspective, orthographic; absent = perspective |
| `fovYDegrees` | float | Optional. Perspective FOV (degrees); absent = 60. Ignored if orthographic, and ignored when the four off-axis angles below are all set |
| `leftDegrees` | float | Optional. Signed degrees from −Z to the left clip plane. Negative when that plane sits left of the axis |
| `rightDegrees` | float | Optional. Signed degrees to the right clip plane. Positive when that plane sits right of the axis |
| `upDegrees` | float | Optional. Signed degrees to the top clip plane. Positive when that plane sits above the axis |
| `downDegrees` | float | Optional. Signed degrees to the bottom clip plane. Negative when that plane sits below the axis |
| `orthoHeight` | float | Ortho frustum height; required when orthographic |
| `nearClip` | float | Optional. Near plane; absent = 0.1 |
| `farClip` | float | Optional. Far plane; absent = 1000 |
| `aspect` | float | Optional. Absent or 0 = use viewport aspect at present |
| `fixedAspect` | bool | Optional. Keep `aspect` when the viewport changes; absent = false |

Looks along local −Z. 3D is right-handed, +Y up - [Axes](../document.md#axes).

When any of `leftDegrees`, `rightDegrees`, `upDegrees`, `downDegrees` is present, all four are present. Together they replace `fovYDegrees` and `aspect` (an off-axis or stereo frustum). They are ignored when `projection` is orthographic. A stereo eye composes this camera on [`rig.vr.eye`](../vr/eye.md).

No camera object / GPU handle.
