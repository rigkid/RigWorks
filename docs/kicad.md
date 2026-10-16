# KiCad

Rig names electronics meaning as [`rig.circuit.*`](../schemas/circuit/part.md) (parts, terminals, nets - shared by schematic, board, and live hardware) and board fabrication as [`rig.pcb.*`](../schemas/pcb/board.md). KiCad **files** stay host mappings at the boundary - same rule as IFC in [openbim.md](openbim.md) and UFO in [ufo.md](ufo.md).

The Contract job is entities, POD components, and schema ids. A `.kicad_pcb` reader / writer (an openFrameworks addon, a RigKit pack, a script) is fulfillment, not this catalog.

## Thin layer

Do **not** invent `rig.kicad.*` - product names stay out of schema ids. KiCad uuids land on [`rig.meta.named`](../schemas/meta/named.md) `stableId`. Drawing primitives reuse geometry and paint; only what has no home elsewhere is new.

| KiCad idea | Rig |
|------------|-----|
| Board file | Root entity with [`rig.pcb.board`](../schemas/pcb/board.md) |
| `(layers ...)` entry | Child entity: [`rig.pcb.layer`](../schemas/pcb/layer.md) + [`rig.spatial.layer`](../schemas/spatial/layer.md) `order` + `meta.named` (`stableId` canonical name, `name` user name) |
| `(layer ...)` / `(layers ...)` on an item | [`rig.pcb.layer_set`](../schemas/pcb/layer-set.md); `*.Cu` / `*.Mask` expand to explicit layers |
| `(net N "NAME")` | Entity with [`rig.circuit.net`](../schemas/circuit/net.md) + `meta.named` (`name` and `stableId` = net name). Net 0 (`""`) is no net - `null` |
| `footprint` | Entity with [`rig.circuit.part`](../schemas/circuit/part.md) (`Reference` / `Value` / `Datasheet` properties) + [`rig.pcb.footprint`](../schemas/pcb/footprint.md) + transform |
| `pad` | Child terminal entity: [`rig.circuit.pin`](../schemas/circuit/pin.md) (`number`, `pinfunction` as `function`, `pintype` as `electricalType`, `net`) + [`rig.pcb.pad`](../schemas/pcb/pad.md) + transform + layer_set |
| `segment` | [`rig.pcb.track`](../schemas/pcb/track.md) + [`rig.geometry.line`](../schemas/geometry/line.md) |
| `arc` (track) | [`rig.pcb.track`](../schemas/pcb/track.md) + [`rig.geometry.arc`](../schemas/geometry/arc.md) |
| `via` | [`rig.pcb.via`](../schemas/pcb/via.md) + transform + layer_set |
| `zone` | [`rig.pcb.zone`](../schemas/pcb/zone.md) + [`rig.geometry.polygon`](../schemas/geometry/polygon.md) + layer_set; `(keepout ...)` adds [`rig.pcb.keepout`](../schemas/pcb/keepout.md) |
| `gr_line` / `fp_line` | [`rig.geometry.line`](../schemas/geometry/line.md) |
| `gr_rect` / `fp_rect` | [`rig.geometry.rectangle`](../schemas/geometry/rectangle.md) (`start` / `end` become corner + size) |
| `gr_circle` / `fp_circle` | [`rig.geometry.ellipse`](../schemas/geometry/ellipse.md), equal radii |
| `gr_arc` / `fp_arc` | [`rig.geometry.arc`](../schemas/geometry/arc.md), equal radii |
| `gr_poly` / `fp_poly` | [`rig.geometry.polygon`](../schemas/geometry/polygon.md) `closed` true |
| `bezier` / `fp_curve` | [`rig.geometry.path`](../schemas/geometry/path.md) `move-to` + `cubic-to` |
| Stroke `width` / `(fill yes)` | [`rig.paint.fill_stroke`](../schemas/paint/fill-stroke.md) `strokeWidth` / `hasStroke` / `hasFill`; colour comes from the layer |
| `gr_text` / `fp_text` / footprint property text | [`rig.media.text`](../schemas/media/text.md) (`fontSize` = glyph height) + `fill_stroke` `strokeWidth` (pen thickness) + transform + layer_set |
| `(justify left top ...)` | [`rig.spatial.anchor`](../schemas/spatial/anchor.md) `point` - KiCad's default is `center` |
| `(justify mirror)` | transform `scale` x = -1 |
| `${REFERENCE}` / `${VALUE}` | `{{reference}}` / `{{value}}` in the text - [`rig.circuit.part`](../schemas/circuit/part.md) |
| `(group ...)` | [`rig.spatial.group`](../schemas/spatial/group.md); members parent to it |
| `(general (thickness T))` | board `thickness` |
| Containment | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent`: board, then layers / nets / parts / board items; part, then pads and footprint drawings |

## Coordinates

- **Units:** millimetres. Set `document.defaultUnit` to `"mm"`. Lengths are floats in that unit.
- **Axes:** Rig 2D is +X right, +Y down - the same as KiCad. No flip.
- **Angles:** KiCad angles turn counter-clockwise on screen. Rig turns +X toward +Y ([`rig.geometry.arc`](../schemas/geometry/arc.md), a rotation about +Z), which is clockwise on screen. A KiCad angle `a` becomes a rotation of `-a` about +Z, and back.
- **Footprint children:** KiCad stores footprint drawings in footprint-local coordinates, and Rig does too. KiCad stores pad and footprint-text angles as **board** angles (they include the footprint's rotation). Subtract the footprint angle on import and add it back on export.
- **Arcs:** KiCad uses start / mid / end points. Rig uses centre, radius, and start / end angles in increasing sweep. Convert on the edge; sweep direction is not meaningful on a board.

## Round trip

A KiCad board makes a full trip through Rig without losing what Rig does not name yet.

1. **Import** `board.kicad_pcb` to a `.rigz`: the document, plus the original file at `data/board.kicad_pcb`. An entity with [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `document`) points at it, and [`rig.pcb.board`](../schemas/pcb/board.md) `source` points at that entity. Every item with a KiCad uuid carries it as `stableId`.
2. **Edit** in any Rig host. Move parts, reroute tracks, rename nets, add vias, delete graphics.
3. **Export** by merging the document onto `source`:
   - An item whose uuid matches an entity `stableId` takes the mapped fields from the entity. Its other tokens (margins, stroke type, hatch settings, 3D model, property visibility) stay as they were.
   - An item with no matching entity was deleted in Rig - drop it.
   - An entity with no matching item is new - write it with KiCad defaults for whatever Rig did not say, and generate a uuid.
   - Write `filled_polygon` back only for zones whose outline, layers, and net are unchanged. Otherwise drop the fill and let KiCad refill.
   - Header, `setup`, `title_block`, and `generator` come from the source.

Without `source` (a loose `.rig`, or a board drawn from scratch) a writer emits a valid board from the portable fields alone, using KiCad defaults for the rest. That works, but board setup, rules, and anything else Rig does not name are lost.

## Encodings (fulfillment)

| File | Role |
|------|------|
| `.kicad_pcb` | Board - map into / out of `rig.pcb.*` + `rig.circuit.*` + geometry |
| `.kicad_mod` | One footprint - same mapping as a board footprint, part at the origin |
| `.kicad_sch` / `.kicad_sym` | Schematic / symbol library - parts, pins, and nets are `rig.circuit.*`; drawings not catalogued yet |
| `.kicad_pro` / `.kicad_prl` | Project settings, net classes - host |
| `fp-lib-table` / `sym-lib-table` | Library tables - host |
| Gerber / drill / position files | Fabrication output - export from KiCad, not a source |

Do not put parser trees, net numbers, render caches, zone fills on new entities, ratsnest, or DRC markers in portable components.

## Honest limit

Two hosts that speak `rig.circuit.*` + `rig.pcb.*` + geometry can exchange a placed and routed board as `.rig`. With `source` in a `.rigz`, KiCad gets the rest of its file back. Without it, round-tripping every KiCad token is **not required**.

Example: [`examples/kicad-pcb.json`](../examples/kicad-pcb.json).
