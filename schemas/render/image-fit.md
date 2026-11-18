---
id: "rig.render.image_fit"
maturity: "draft"
summary: "Fit a sprite's texture into the entity's shape - CSS object-fit and object-position. Format when present."
fields:
  - name: "fit"
    type: "string"
    enum: ["fill","contain","cover","none","scale-down"]
    meaning: "Optional. fill, contain, cover, none, or scale-down - the CSS object-fit values. Absent = fill"
    absent: "fill"
  - name: "positionX"
    ref: "float"
    meaning: "Optional. Horizontal alignment as a ratio of the free space; 0 = left, 0.5 = centre, 1 = right. Absent = 0.5"
    absent: "0.5"
  - name: "positionY"
    ref: "float"
    meaning: "Optional. Vertical alignment as a ratio of the free space; 0 = top, 0.5 = centre, 1 = bottom. Absent = 0.5"
    absent: "0.5"
  - name: "offsetX"
    ref: "float"
    meaning: "Optional. Shift toward the right face in local units, after positionX. Absent = 0"
    absent: "0"
  - name: "offsetY"
    ref: "float"
    meaning: "Optional. Shift toward the bottom face in local units, after positionY. Absent = 0"
    absent: "0"
  - name: "scale"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"exclusiveMinimum\":0}"
    meaning: "Optional. Multiplies the fitted content size before alignment. Absent = 1"
    absent: "1"
  - name: "insets"
    ref: "faceInsets"
    meaning: "number[1..6]"
---
# `rig.render.image_fit`

Fit a sprite's texture into the entity's shape - CSS `object-fit` and `object-position`. Format when present.

Compose on an entity that carries [`rig.render.sprite`](sprite.md). The **box** is the bounds of the entity's geometry ([`rig.geometry.rectangle`](../geometry/rectangle.md), [`ellipse`](../geometry/ellipse.md), [`polygon`](../geometry/polygon.md), or [`path`](../geometry/path.md)), moved inward by `insets`; with no geometry, it is the sprite's quad. This is an image frame: the geometry is the frame, the texture is its content.

| Field | Type | Meaning |
|-------|------|---------|
| `fit` | enum | Optional. `fill`, `contain`, `cover`, `none`, or `scale-down` - the CSS `object-fit` values. Absent = `fill` |
| `positionX` | float | Optional. Horizontal alignment as a ratio of the free space; 0 = left, 0.5 = centre, 1 = right. Absent = 0.5 |
| `positionY` | float | Optional. Vertical alignment as a ratio of the free space; 0 = top, 0.5 = centre, 1 = bottom. Absent = 0.5 |
| `offsetX` | float | Optional. Shift toward the right face in local units, after `positionX`. Absent = 0 |
| `offsetY` | float | Optional. Shift toward the bottom face in local units, after `positionY`. Absent = 0 |
| `scale` | float | Optional. Multiplies the fitted content size before alignment. Absent = 1 |
| `insets` | number \| number[1..6] | Optional. Face insets **inward** from the geometry bounds, in local units (same channels as page `margins`; floor and ceiling are unused). Absent = none |

Absent component and absent fields both mean CSS's initial values: the texture stretches over the box, centred. A sprite without this component already does that, so adding it with no fields changes nothing.

## Placement

The **natural size** is the texture's pixel size (one sheet cell when `columns` / `rows` are set) at the resolution the file states; a file that states none is 96 pixels per inch, the CSS reference pixel. Convert it to the entity's local units.

| `fit` | Content size |
|-------|--------------|
| `fill` | The box. Aspect is not kept |
| `contain` | Natural size, aspect kept, scaled to the largest size that fits inside the box |
| `cover` | Natural size, aspect kept, scaled to the smallest size that covers the box |
| `none` | Natural size |
| `scale-down` | The smaller of `none` and `contain` |

Multiply the content size by `scale`. Free space is box size minus content size, per axis; it is negative when the content overflows. The content's left edge sits at `positionX` times the horizontal free space, plus `offsetX`, from the box's left edge; the top edge the same way with `positionY` and `offsetY`. That is CSS `object-position` with `calc(<percent> + <length>)`.

Left, right, top, and bottom are the box faces of [`rig.spatial.anchor`](../spatial/anchor.md); offsets keep that direction whichever way the host's Y axis points.

- The texture never paints outside the geometry's contour (corner radius, ellipse, or path included), moved inward by `insets`; a rectangle's corner radius shrinks by the inset on each side, never below 0. A [`rig.paint.clip`](../paint/clip.md) on the entity clips further.
- The frame's own paint draws around the content: [`rig.paint.fill`](../paint/fill.md) first, then the texture, then [`rig.paint.stroke`](../paint/stroke.md). [`rig.render.blend`](blend.md) applies to the three together.
- Sprite `flipX` / `flipY` mirror the content inside its own rectangle before alignment. Do not compose this component with a sprite `tiling` other than 1, 1.
- Content rotation is not a field. Rotate the entity, or bake the rotated picture.
- "Fit frame to content" is an operation that resizes the geometry; it is not stored.

Mappings: CSS in [css.md](../../docs/css.md); InDesign frame fitting in [idml.md](../../docs/idml.md).
