# UFO

Rig names editable-font meaning as [`rig.font.*`](../schemas/font/face.md). Unified Font Object **files** stay host mappings at the boundary — same rule as IFC in [openbim.md](openbim.md) and SVG ([design philosophy](design-philosophy.md#encoding)).

The Contract job is entities, POD components, and schema ids. A `.ufo` / `.ufoz` reader (RigKit **rigUfo** or a sibling tool) is fulfillment, not this catalog.

## Thin layer

We do **not** invent `rig.font.ttf` or treat a compiled OT/TTF as the source face. A file on disk is [`rig.media.asset_ref`](../schemas/media/asset-ref.md) kind font. A canvas run that *uses* a compiled face is [`rig.media.text`](../schemas/media/text.md). Outlines compose [`rig.geometry.path`](../schemas/geometry/path.md) on the glyph entity — do not add a second contour type.

| UFO idea | Rig |
|----------|-----|
| Family / style / UPM / metrics | [`rig.font.face`](../schemas/font/face.md) |
| Layer (`public.default`, …) | [`rig.font.layer`](../schemas/font/layer.md) + [`rig.meta.named`](../schemas/meta/named.md) |
| Glyph name | [`rig.meta.named`](../schemas/meta/named.md) `stableId` |
| Unicodes / advance width | [`rig.font.glyph`](../schemas/font/glyph.md) |
| Contours | [`rig.geometry.path`](../schemas/geometry/path.md) on the glyph |
| Component (composite) | [`rig.font.component`](../schemas/font/component.md) on a child entity |
| Anchor | [`rig.font.anchor`](../schemas/font/anchor.md) on a child entity |
| `kerning.plist` pair | [`rig.font.kern`](../schemas/font/kern.md) (`left` / `right` are names) |
| `groups.plist` | [`rig.font.group`](../schemas/font/group.md) |
| `features.fea` | [`rig.media.code`](../schemas/media/code.md) `language` `fea`, pointed at by `face.features` |
| Containment | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` (face → layer → glyph) |

## Encodings (fulfillment)

| File | Role |
|------|------|
| `.ufo` / `.ufoz` | Map into / out of `rig.font.*` + path |
| `.glif` | One glyph; same POD as `rig.font.glyph` + path / component / anchor |
| `.otf` / `.ttf` / `.woff2` | Compiled instance — asset_ref or export, never the live source |

Do not put glyph caches, atlas slots, dirty epochs, or FreeType handles in portable components.

## Host trips!

Two hosts that speak `rig.font.face` + `glyph` + `kern` can exchange a UFO-as-Rig document. Round-tripping every lib.plist key or UFO3 guideline is **not required**.

Example: [`examples/font-ufo.json`](../examples/font-ufo.json).
