# `rig.sensor.class`

Class of one entity in a label image. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | Class name. Matches a string in [`rig.sensor.label`](label.md) `classes` |

Compose on the mesh or link the camera should paint. A name the camera does not list is still stored; that camera may ignore it. Several cameras may share one vocabulary.

This is not [`rig.meta.tags`](../meta/tags.md). Tags do not change how a host draws.
