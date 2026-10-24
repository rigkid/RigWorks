# Scene - spatial, geometry, paint, render

Load for: scenes, shapes, drawings, meshes, lights, cameras. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/minimal-scene.json`](../../../examples/minimal-scene.json), [`examples/lights.json`](../../../examples/lights.json), [`examples/environment.json`](../../../examples/environment.json), [`examples/path3d-spline3d.json`](../../../examples/path3d-spline3d.json).

## Compose

| Want | Compose |
|---|---|
| A scene root | One unparented `rig.spatial.vertex` entity |
| A placed thing | `rig.spatial.transform` + `rig.spatial.relationship` (`parent`) + a geometry |
| A label | `rig.meta.named` (never re-declare `name` on other schemas) |
| A group / folder | `rig.spatial.group` marker; children point at it with `parent` |
| A reused drawing | `rig.spatial.instance` (`source`) - the `<use>` spelling |
| Which bounds cell sits at `position` | `rig.spatial.anchor` (`point` 3x3, optional `height`); never axis inversion, never a pivot field on transform |
| Show / hide | `rig.render.visibility` on the entity (not a field on `rig.spatial.layer`) |
| Blend / opacity | `rig.render.blend` (not on `rig.pixel.layer`) |
| A light | `rig.render.light`; image-based light is `rig.render.environment` (`hdri` is a `rig.media.asset_ref`) |
| A material | `rig.render.material`; a sprite is `rig.render.sprite` |
| Inline colour on a drawable | `rig.paint.fill_stroke` (`fillRgba` / `strokeRgba` / `strokeWidth`) |
| Shared paint several drawables use | `rig.paint.solid` or `rig.paint.gradient` on its own entity, referenced by `rig.paint.fill` / `rig.paint.stroke`; a swatch list is `rig.paint.library` |
| Caps, joins, dash | `rig.paint.stroke_style` (not fields on `fill_stroke`) |
| Clip, mask, markers, pattern, filter | `rig.paint.clip` / `mask` / `markers` + `marker` / `pattern` / `filter` + `filter_step`, on the drawable |
| Layer list chrome | `rig.spatial.layer` (`order` is list order; sibling order is `order` on `relationship`) |
| Pickable thing | `rig.interact.selectable`; current pick is `rig.interact.selected` |
| Tags | `rig.meta.tags` |

Shapes: `rig.geometry.rectangle`, `ellipse`, `line`, `polygon`, `regular_polygon`, `star`, `arc`, `ring`, `path`, `path3d`, `spline`, `spline3d`, `mesh`, `nurbs_surface`. Text colour is paint, not `rig.media.text`; a canvas text run is `rig.media.text`, on a contour `rig.media.text_path`, and `@font-face` is `rig.media.font_face` (see [layout-story.md](layout-story.md)).

## Guards

- Never carry both spellings for one slot: `rig.paint.fill` + `fill_stroke.fillRgba` on one entity is a validator error. Same for stroke.
- Rotation lives on `rig.spatial.transform` only; there is no angle field on geometry. Rectangle `y` is the top edge; do not dual-author from the centre.
- Mesh corners stay packed arrays. No `rig.geometry.vertex`, no edge table on `rig.geometry.mesh`, no `rig.spatial.scene`, no `kind` on `vertex`.
- `rig.spatial.vertex` has no `x`/`y`/`z`; pose is always `transform`.
- Extents are non-negative where the schema says so (`rectangle` width/height fail validation below 0). A forgiving host may repair on import; never emit the negative form.

## Ids in this slice

`rig.spatial.transform`, `rig.spatial.anchor`, `rig.spatial.relationship`, `rig.spatial.vertex`, `rig.spatial.group`, `rig.spatial.instance`, `rig.spatial.camera`, `rig.spatial.layer`, `rig.geometry.mesh`, `rig.geometry.path`, `rig.geometry.path3d`, `rig.geometry.rectangle`, `rig.geometry.ellipse`, `rig.geometry.line`, `rig.geometry.polygon`, `rig.geometry.regular_polygon`, `rig.geometry.star`, `rig.geometry.arc`, `rig.geometry.spline`, `rig.geometry.spline3d`, `rig.geometry.nurbs_surface`, `rig.geometry.ring`, `rig.paint.solid`, `rig.paint.gradient`, `rig.paint.fill_stroke`, `rig.paint.fill`, `rig.paint.stroke`, `rig.paint.stroke_style`, `rig.paint.library`, `rig.paint.brush`, `rig.paint.order`, `rig.paint.clip`, `rig.paint.mask`, `rig.paint.markers`, `rig.paint.marker`, `rig.paint.pattern`, `rig.paint.filter`, `rig.paint.filter_step`, `rig.meta.named`, `rig.meta.tags`, `rig.render.light`, `rig.render.environment`, `rig.render.material`, `rig.render.visibility`, `rig.render.blend`, `rig.render.sprite`, `rig.interact.selectable`, `rig.interact.selected`, `rig.media.asset_ref`, `rig.light.look`, `rig.pixel.canvas`, `rig.pixel.source`, `rig.pixel.layer`, `rig.pixel.raster`, `rig.pixel.palette`, `rig.pixel.tile_set`, `rig.pixel.tile_map`, `rig.pixel.effect_chain`, `rig.pixel.region`, `rig.pixel.mask_path`, `rig.pixel.composite`
