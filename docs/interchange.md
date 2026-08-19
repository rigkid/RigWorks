# Interchange

Rig portable documents are **JSON** using the [`rig.document`](../schemas/document.md) envelope. Component object keys are full schema ids (`rig.spatial.transform`). The conventional file extension is **`.rig`**. Other on-disk encodings are host mappings at the boundary — including OpenBIM (`.ifc`, `.bcfzip`, `.ids`) and UFO (`.ufo`, `.ufoz`); see [openbim.md](openbim.md), [ufo.md](ufo.md), and [design philosophy](design-philosophy.md#encoding).

## Encoding

| POD type | JSON |
|----------|------|
| `bool` / `int` / `uint` / `float` / `string` | JSON primitives |
| `vec2` / `vec3` / `vec4` / `quat` | Number arrays (`quat` order x, y, z, w) |
| `entity` | String id within the file, or `null` for none |
| Enums | kebab-case string literals from the schema (`top-left`, `color-dodge`) |

Formal grammar: [`schemas/json/`](../schemas/json/). Validate with [`tools/rig-validate`](../tools/rig-validate/). Component object keys are the schema ids. Field names inside those objects match the schema (e.g. transform `rotation` as quat; do not emit editor Euler).
