# Font - UFO source, glyphs, variable fonts

Load for: typefaces, glyphs, kerning, design axes, variable font cells. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/font-ufo.json`](../../../examples/font-ufo.json), [`examples/font-var.json`](../../../examples/font-var.json). UFO mapping: [`docs/ufo.md`](../../../docs/ufo.md).

## Compose

| Want | Compose |
|---|---|
| A typeface | `rig.font.face`; design masters are `rig.font.master`, layers `rig.font.layer` |
| A glyph | `rig.font.glyph`; its outline is `rig.geometry.path` on the same entity |
| A composite glyph part | `rig.font.component` (child of the glyph; `glyph` names the source) |
| A named glyph point (`top`, `ogonek`) | `rig.font.anchor` on a child of the glyph - not `rig.spatial.anchor`, not a scene locator |
| Kerning | `rig.font.kern` (`left`/`right` are glyph names via `stableId`, not entity ids) |
| A kern group | `rig.font.group` |
| A design axis / mapping | `rig.font.axis`, `rig.font.avar` |
| Live variable reconstruction | `rig.font.cell` on the glyph |
| OpenType feature text | `rig.media.code` with `language` `fea` |

## Guards

- No `rig.font.ttf`. A compiled font binary is an `rig.media.asset_ref` sidecar, never a schema.
- No outlines on `rig.media.text`; text runs are layout ([layout-story.md](layout-story.md)), glyph outlines are `rig.geometry.path`.
- Font face/layer membership is `rig.spatial.relationship` parentage under the face, not a member list.

## Ids in this slice

`rig.font.face`, `rig.font.glyph`, `rig.font.component`, `rig.font.anchor`, `rig.font.layer`, `rig.font.kern`, `rig.font.group`, `rig.font.axis`, `rig.font.avar`, `rig.font.cell`, `rig.font.master`
