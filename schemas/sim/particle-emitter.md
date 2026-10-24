---
id: "rig.sim.particle_emitter"
maturity: "draft"
summary: "Particle spawn settings. Format when present."
fields:
  - name: "rate"
    ref: "float"
    required: true
    meaning: "Particles spawned per second"
  - name: "lifetime"
    ref: "float"
    required: true
    meaning: "Seconds each particle survives"
  - name: "maxParticles"
    ref: "int"
    required: true
    meaning: "Hard cap on live particles"
  - name: "gravity"
    ref: "vec3"
    meaning: "Optional. Acceleration applied to every particle"
  - name: "damping"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1, velocity lost per second"
  - name: "startRgba"
    ref: "rgba"
    meaning: "Optional. Colour at spawn"
  - name: "endRgba"
    ref: "rgba"
    meaning: "Optional. Colour at death; interpolated over the lifetime"
  - name: "shape"
    type: "string"
    enum: ["point","sphere","box","cone"]
    meaning: "Optional. point, sphere, box, cone; absent = point"
    absent: "point"
  - name: "shapeSize"
    ref: "vec3"
    meaning: "Optional. Sphere uses x as radius. Box is full extents. Cone uses x as base radius and y as height. Ignored for point"
  - name: "seed"
    ref: "int"
    meaning: "Optional. Host RNG start. Absent = any sequence"
    absent: "any sequence"
---
# `rig.sim.particle_emitter`

Particle spawn settings. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `rate` | float | Particles spawned per second |
| `lifetime` | float | Seconds each particle survives |
| `maxParticles` | int | Hard cap on live particles |
| `gravity` | vec3 | Optional. Acceleration applied to every particle |
| `damping` | float | Optional. 0-1, velocity lost per second |
| `startRgba` | rgba | Optional. Colour at spawn |
| `endRgba` | rgba | Optional. Colour at death; interpolated over the lifetime |
| `shape` | enum | Optional. `point`, `sphere`, `box`, `cone`; absent = `point` |
| `shapeSize` | vec3 | Optional. Sphere uses `x` as radius. Box is full extents. Cone uses `x` as base radius and `y` as height. Ignored for `point` |
| `seed` | int | Optional. Host RNG start. Absent = any sequence |

Particles spawn from [`rig.spatial.transform`](../spatial/transform.md), inside `shape` when it is not a point.

`seed` is the author's request for a repeatable sequence. A host that honors it starts its own generator at this integer. Two hosts may still differ, because the generator is fulfillment. A layout that must match exactly is authored entities, not a burst.

Live particles are never serialized. Reopening a document restarts the emitter empty.
