# Interchange

Rig portable documents are **JSON** using the [`rig.document`](../schemas/document.md) envelope. Component object keys are full schema ids (`rig.spatial.transform`).

On disk that JSON is a **`.rig`** file, or a **`.rigz`** ZIP when sidecar files travel with it. Other on-disk encodings are host mappings at the boundary — including OpenBIM (`.ifc`, `.bcfzip`, `.ids`) and UFO (`.ufo`, `.ufoz`); see [openbim.md](openbim.md), [ufo.md](ufo.md), and [design philosophy](design-philosophy.md#encoding).

## Package

A small document is one `.rig` file. A bigger document — images, fonts, models, PDFs, or a large bake — is saved as **`.rigz`**: a ZIP of that same JSON plus a `data/` folder.

```
example.rigz
  document.rig
  data/
    covers/moby-dick.jpg
    fonts/face.ttf
```

| Rule | Detail |
|------|--------|
| Format | ZIP (local headers + central directory). Paths use `/`. |
| Document | Exactly one `.rig` at the archive root. The name is free. The bytes are a [`rig.document`](../schemas/document.md) envelope — same JSON as a loose `.rig`. |
| Sidecars | `data/` at the archive root. Files that travel with the document live here. |
| No wrapper | Do not nest those two inside an extra folder. Zip the contents, not the parent directory. |
| Loose pair | `document.rig` next to a sibling `data/` is the same layout unzipped. Zip that pair to make `.rigz`. |

`.rigz` is Rig interchange, not a host mapping. The wire is still JSON. Zip is the envelope for “document + files”. Do not invent a second document schema, and do not inline binary blobs or data URIs — put the file in `data/` and point [`rig.media.asset_ref`](../schemas/media/asset-ref.md) at it.

### Paths

`asset_ref.path` for a sidecar is relative to `data/` (`covers/moby-dick.jpg`, not `data/covers/moby-dick.jpg`). Absolute paths, URLs, and other host-root paths stay host-root: they name files outside the package.

Validate the `.rig` inside (unzip, or pass the inner file). [`rig-validate`](../tools/rig-validate/) opens `.rigz` and checks that JSON.

## Encoding

| POD type | JSON |
|----------|------|
| `bool` / `int` / `uint` / `float` / `string` | JSON primitives |
| `vec2` / `vec3` / `vec4` / `quat` | Number arrays (`quat` order x, y, z, w) |
| `entity` | String id within the file, or `null` for none |
| Enums | kebab-case string literals from the schema (`top-left`, `color-dodge`) |

Formal grammar: [`schemas/json/`](../schemas/json/). Validate with [`tools/rig-validate`](../tools/rig-validate/). Component object keys are the schema ids. Field names inside those objects match the schema (e.g. transform `rotation` as quat; do not emit editor Euler).
