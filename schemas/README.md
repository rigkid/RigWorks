# Schemas

Agreed POD field layouts. **Formats when present** - ship what you support.

Being Rig does not require implementing this catalog. If two hosts both speak a schema id, they share fields and units.

- **Prose** (this tree) - field meaning and units for humans.
- **JSON Schema** - [`json/`](json/) machine grammar for tools and AI emission.
- **Documents** - [`document.md`](document.md) envelope; examples under [`../examples/`](../examples/); validate with [`../tools/rig-validate/`](../tools/rig-validate/).

## Rules

- Field **meaning and units** are the contract; C++ type names are host-specific.
- One type per field. No dual representations. No dual-field legacy aliases until 1.0.
- Authored fields only. Anything a host can recompute from those fields stays in the host - [Host cache](../docs/terms.md). Do not add it to a schema for convenience (polygon winding from `points`, world matrix from local pose + parent, bar/beat from `positionBeats`).
- No device handles, GPU objects, UI toolkit types, callbacks, dirty flags, or ephemeral edge state in portable fields.
- Runtime caches and queues (last sample, pending MIDI, hover) stay in the host.
- Ids are `rig.<domain>.<name>` (snake_case multi-word segments). Enum literals are kebab-case (`top-left`, `color-dodge`) - they are user-facing choice labels, not field names.
- Display names live on [`rig.meta.named`](meta/named.md) - compose it; do not re-declare `name` on every schema.
- File identity lives on [`rig.media.asset_ref`](media/asset-ref.md) - other schemas reference it by `entity` id when they need a path. Sidecars that travel with the document live in the package `data/` folder - [interchange](../docs/interchange.md#package).
- `rgba` / `rgb` / `clearRgba` are floats 0-1. Colour space is the envelope's `document.colorSpace` key (default: srgb) - see [document.md](document.md).
- Domain meaning lives in field names - not extra property datatype ids. See [properties.md](../docs/properties.md).

### Measurements

One home per quantity class. Convert once at the host edge (cm / in / display units on import).

| Kind | Store |
|------|--------|
| Ratio | 0-1. Colour, gain, opacity, UV, phase, metallic, gate, occupancy - and a length authored as a fraction of a **named** extent (page, parent, em). |
| Scene length | `document.defaultUnit`. A page may override with [`rig.layout.page`](layout/page.md) `unit`. Transform `position`, geometry, stroke width, page size. |
| Catalog fact | SI in the field name: [`rig.art.dimensions`](art/dimensions.md) millimetres, [`rig.plant.habit`](plant/habit.md) metres, [`rig.place.geo`](place/geo.md) `altitudeMetres`. |
| Protocol / clock | Native scale. MIDI 0-127, wall-clock `startMinutes` 0-1439, WGS84 degrees. |
| Commerce percent | 0-100 on [`rig.commerce.discount`](commerce/discount.md) (`10` is 10%). |

### Field naming

Fields are **lowerCamelCase** and spelled out. Prefer `radiusX` over `rx`, `centerX` over `cx`, `position` over `pos`, `interpolation` over `interp`.

| Pattern | Use |
|---------|-----|
| Spelled words | `innerRadius`, `rotationDegrees`, `startAngleDegrees` |
| Axis suffix | Split scalars get `X` / `Y` / `Z` - `centerX`, `radiusY`, `originX`, `fovYDegrees` |
| Angles | `*Degrees` (not radians) |
| Domain acronyms | Keep the common short form when it *is* the name: `bpm`, `rgb`, `rgba`, `uv` |
| Indexed edges | Bare `x` / `y` / `x1` / `y1` for rectangle corners and line endpoints |
| Tagged-union slots | Only [`rig.node.param`](node/param.md) uses `f` / `i` / `s` / `v` - do not invent more single-letter fields |

Do not copy SVG attribute abbreviations into schema fields. SVG (or any other wire format) is a host fulfillment mapping, not the Contract vocabulary.

### Enum literals

Enum values are **kebab-case** because they show up as choices in UI and authored JSON. Split on word boundaries: `top-left`, `ease-in-out`, `cc-by-sa`. A single lowercase token stays as it is (`linear`, `evenodd`, `ifc4x3`, `cc0`). Do not invent a second case. Field names stay lowerCamelCase (`blendMode`); schema ids stay snake_case (`rig.render.blend`).

## Catalog

### Document

| Id | Doc |
|----|-----|
| `rig.document` | [document.md](document.md) |

### Spatial / scene

A scene is a root (unparented) [`rig.spatial.vertex`](spatial/vertex.md). [`rig.spatial.anchor`](spatial/anchor.md) is a bounds cell, not [`rig.font.anchor`](font/anchor.md) (a glyph point).

| Id | Doc |
|----|-----|
| `rig.spatial.transform` | [spatial/transform.md](spatial/transform.md) |
| `rig.spatial.anchor` | [spatial/anchor.md](spatial/anchor.md) |
| `rig.spatial.relationship` | [spatial/relationship.md](spatial/relationship.md) |
| `rig.spatial.vertex` | [spatial/vertex.md](spatial/vertex.md) |
| `rig.spatial.group` | [spatial/group.md](spatial/group.md) |
| `rig.spatial.camera` | [spatial/camera.md](spatial/camera.md) |
| `rig.spatial.layer` | [spatial/layer.md](spatial/layer.md) |

### Layout

Print spread - pages, masters, facing, visual style maps, text frames and threads. `.idml` is a host encoding - [idml.md](../docs/idml.md).

| Id | Doc |
|----|-----|
| `rig.layout.page` | [layout/page.md](layout/page.md) |
| `rig.layout.master` | [layout/master.md](layout/master.md) |
| `rig.layout.applied_master` | [layout/applied-master.md](layout/applied-master.md) |
| `rig.layout.facing` | [layout/facing.md](layout/facing.md) |
| `rig.layout.section` | [layout/section.md](layout/section.md) |
| `rig.layout.paragraph_style` | [layout/paragraph-style.md](layout/paragraph-style.md) |
| `rig.layout.character_style` | [layout/character-style.md](layout/character-style.md) |
| `rig.layout.table_style` | [layout/table-style.md](layout/table-style.md) |
| `rig.layout.frame` | [layout/frame.md](layout/frame.md) |
| `rig.layout.frame_chain` | [layout/frame-chain.md](layout/frame-chain.md) |

### Place (civic / postal)

| Id | Doc |
|----|-----|
| `rig.place.address` | [place/address.md](place/address.md) |
| `rig.place.geo` | [place/geo.md](place/geo.md) |

### Person / organisation / party

| Id | Doc |
|----|-----|
| `rig.person.name` | [person/name.md](person/name.md) |
| `rig.person.vital` | [person/vital.md](person/vital.md) |
| `rig.person.contact` | [person/contact.md](person/contact.md) |
| `rig.person.employment` | [person/employment.md](person/employment.md) |
| `rig.person.portrait` | [person/portrait.md](person/portrait.md) |
| `rig.person.identifier` | [person/identifier.md](person/identifier.md) |
| `rig.organisation.identity` | [organisation/identity.md](organisation/identity.md) |
| `rig.party.account` | [party/account.md](party/account.md) |

### Commerce

| Id | Doc |
|----|-----|
| `rig.commerce.price` | [commerce/price.md](commerce/price.md) |
| `rig.commerce.offer` | [commerce/offer.md](commerce/offer.md) |
| `rig.commerce.discount` | [commerce/discount.md](commerce/discount.md) |
| `rig.commerce.product` | [commerce/product.md](commerce/product.md) |
| `rig.commerce.stock` | [commerce/stock.md](commerce/stock.md) |
| `rig.commerce.order` | [commerce/order.md](commerce/order.md) |
| `rig.commerce.order_line` | [commerce/order-line.md](commerce/order-line.md) |
| `rig.commerce.invoice` | [commerce/invoice.md](commerce/invoice.md) |
| `rig.commerce.invoice_line` | [commerce/invoice-line.md](commerce/invoice-line.md) |
| `rig.commerce.shipment` | [commerce/shipment.md](commerce/shipment.md) |
| `rig.commerce.shipment_line` | [commerce/shipment-line.md](commerce/shipment-line.md) |

### Plant (botanica)

| Id | Doc |
|----|-----|
| `rig.plant.taxon` | [plant/taxon.md](plant/taxon.md) |
| `rig.plant.cultivar` | [plant/cultivar.md](plant/cultivar.md) |
| `rig.plant.habit` | [plant/habit.md](plant/habit.md) |
| `rig.plant.occurrence` | [plant/occurrence.md](plant/occurrence.md) |
| `rig.plant.portrait` | [plant/portrait.md](plant/portrait.md) |

### Book

| Id | Doc |
|----|-----|
| `rig.book.identifier` | [book/identifier.md](book/identifier.md) |
| `rig.book.title` | [book/title.md](book/title.md) |
| `rig.book.publication` | [book/publication.md](book/publication.md) |
| `rig.book.contribution` | [book/contribution.md](book/contribution.md) |
| `rig.book.cover` | [book/cover.md](book/cover.md) |
| `rig.book.subject` | [book/subject.md](book/subject.md) |

### Paper (articles / citations)

| Id | Doc |
|----|-----|
| `rig.paper.identifier` | [paper/identifier.md](paper/identifier.md) |
| `rig.paper.article` | [paper/article.md](paper/article.md) |
| `rig.paper.issue` | [paper/issue.md](paper/issue.md) |
| `rig.paper.citation` | [paper/citation.md](paper/citation.md) |

### Rights

| Id | Doc |
|----|-----|
| `rig.rights.statement` | [rights/statement.md](rights/statement.md) |

### Legal (agreements)

Deals between parties - not the Rig Contract, and not copyright of a work ([`rig.rights.statement`](rights/statement.md)).

| Id | Doc |
|----|-----|
| `rig.legal.agreement` | [legal/agreement.md](legal/agreement.md) |
| `rig.legal.party` | [legal/party.md](legal/party.md) |

### Record

Classification, assertion, consent, and the file a fact belongs to. FHIR, pacs/camt, DICOM, and GS1 files stay host mappings - [records.md](../docs/records.md).

| Id | Doc |
|----|-----|
| `rig.record.mark` | [record/mark.md](record/mark.md) |
| `rig.record.assertion` | [record/assertion.md](record/assertion.md) |
| `rig.record.event` | [record/event.md](record/event.md) |
| `rig.record.consent` | [record/consent.md](record/consent.md) |
| `rig.record.case` | [record/case.md](record/case.md) |
| `rig.record.incident` | [record/incident.md](record/incident.md) |
| `rig.record.concerns` | [record/concerns.md](record/concerns.md) |
| `rig.record.note` | [record/note.md](record/note.md) |

### Finance

Payments, positions, and claims. Amounts compose [`rig.commerce.price`](commerce/price.md). MX messages stay fulfillment.

| Id | Doc |
|----|-----|
| `rig.finance.payment` | [finance/payment.md](finance/payment.md) |
| `rig.finance.position` | [finance/position.md](finance/position.md) |
| `rig.finance.claim` | [finance/claim.md](finance/claim.md) |

### Clinic

Encounters, observations, imaging studies, and trials. FHIR and DICOM files stay fulfillment.

| Id | Doc |
|----|-----|
| `rig.clinic.encounter` | [clinic/encounter.md](clinic/encounter.md) |
| `rig.clinic.observation` | [clinic/observation.md](clinic/observation.md) |
| `rig.clinic.study` | [clinic/study.md](clinic/study.md) |
| `rig.clinic.trial` | [clinic/trial.md](clinic/trial.md) |
| `rig.clinic.criterion` | [clinic/criterion.md](clinic/criterion.md) |

### Law

| Id | Doc |
|----|-----|
| `rig.law.statute` | [law/statute.md](law/statute.md) |

### Art (CDWA core)

| Id | Doc |
|----|-----|
| `rig.art.object` | [art/object.md](art/object.md) |
| `rig.art.creation` | [art/creation.md](art/creation.md) |
| `rig.art.attribution` | [art/attribution.md](art/attribution.md) |
| `rig.art.dimensions` | [art/dimensions.md](art/dimensions.md) |
| `rig.art.material` | [art/material.md](art/material.md) |
| `rig.art.location` | [art/location.md](art/location.md) |
| `rig.art.subject` | [art/subject.md](art/subject.md) |
| `rig.art.image` | [art/image.md](art/image.md) |

### Geometry / paint

| Id | Doc |
|----|-----|
| `rig.geometry.mesh` | [geometry/mesh.md](geometry/mesh.md) |
| `rig.geometry.path` | [geometry/path.md](geometry/path.md) |
| `rig.geometry.path3d` | [geometry/path3d.md](geometry/path3d.md) |
| `rig.geometry.rectangle` | [geometry/rectangle.md](geometry/rectangle.md) |
| `rig.geometry.ellipse` | [geometry/ellipse.md](geometry/ellipse.md) |
| `rig.geometry.line` | [geometry/line.md](geometry/line.md) |
| `rig.geometry.polygon` | [geometry/polygon.md](geometry/polygon.md) |
| `rig.geometry.regular_polygon` | [geometry/regular-polygon.md](geometry/regular-polygon.md) |
| `rig.geometry.star` | [geometry/star.md](geometry/star.md) |
| `rig.geometry.arc` | [geometry/arc.md](geometry/arc.md) |
| `rig.geometry.spline` | [geometry/spline.md](geometry/spline.md) |
| `rig.geometry.spline3d` | [geometry/spline3d.md](geometry/spline3d.md) |
| `rig.geometry.nurbs_surface` | [geometry/nurbs-surface.md](geometry/nurbs-surface.md) |
| `rig.geometry.ring` | [geometry/ring.md](geometry/ring.md) |
| `rig.paint.solid` | [paint/solid.md](paint/solid.md) |
| `rig.paint.gradient` | [paint/gradient.md](paint/gradient.md) |
| `rig.paint.fill_stroke` | [paint/fill-stroke.md](paint/fill-stroke.md) |
| `rig.paint.fill` | [paint/fill.md](paint/fill.md) |
| `rig.paint.stroke` | [paint/stroke.md](paint/stroke.md) |
| `rig.paint.stroke_style` | [paint/stroke-style.md](paint/stroke-style.md) |
| `rig.paint.library` | [paint/library.md](paint/library.md) |
| `rig.paint.brush` | [paint/brush.md](paint/brush.md) |

### CAD / solids

CSG tree as split primitives. When a solid `rig.cad.*` is present it is the source of truth; mesh on the same entity is an optional bake. Edges for fillet/chamfer are `{a,b}` pairs into mesh `positions` - see [geometry/mesh.md](geometry/mesh.md#edges). [`rig.cad.dimension`](cad/dimension.md), [`reference_line`](cad/reference-line.md), and [`reference_plane`](cad/reference-plane.md) are datums, not solids - keep them off solid entities and out of `boolean.operands`.

| Id | Doc |
|----|-----|
| `rig.cad.cuboid` | [cad/cuboid.md](cad/cuboid.md) |
| `rig.cad.cylinder` | [cad/cylinder.md](cad/cylinder.md) |
| `rig.cad.sphere` | [cad/sphere.md](cad/sphere.md) |
| `rig.cad.extrude` | [cad/extrude.md](cad/extrude.md) |
| `rig.cad.revolve` | [cad/revolve.md](cad/revolve.md) |
| `rig.cad.boolean` | [cad/boolean.md](cad/boolean.md) |
| `rig.cad.fillet` | [cad/fillet.md](cad/fillet.md) |
| `rig.cad.chamfer` | [cad/chamfer.md](cad/chamfer.md) |
| `rig.cad.dimension` | [cad/dimension.md](cad/dimension.md) |
| `rig.cad.reference_line` | [cad/reference-line.md](cad/reference-line.md) |
| `rig.cad.reference_plane` | [cad/reference-plane.md](cad/reference-plane.md) |

### BIM / OpenBIM

Thin OpenBIM layer - IFC class is a string on `classify`, not one schema per `IfcWall`. `.ifc` / `.bcfzip` / `.ids` are host encodings - [openbim.md](../docs/openbim.md).

| Id | Doc |
|----|-----|
| `rig.bim.classify` | [bim/classify.md](bim/classify.md) |
| `rig.bim.type` | [bim/type.md](bim/type.md) |
| `rig.bim.occurrence` | [bim/occurrence.md](bim/occurrence.md) |
| `rig.bim.pset` | [bim/pset.md](bim/pset.md) |
| `rig.bim.site` | [bim/site.md](bim/site.md) |
| `rig.bim.building` | [bim/building.md](bim/building.md) |
| `rig.bim.storey` | [bim/storey.md](bim/storey.md) |
| `rig.bim.space` | [bim/space.md](bim/space.md) |
| `rig.bim.relation` | [bim/relation.md](bim/relation.md) |
| `rig.bim.topic` | [bim/topic.md](bim/topic.md) |
| `rig.bim.comment` | [bim/comment.md](bim/comment.md) |
| `rig.bim.viewpoint` | [bim/viewpoint.md](bim/viewpoint.md) |
| `rig.bim.spec` | [bim/spec.md](bim/spec.md) |
| `rig.bim.facet` | [bim/facet.md](bim/facet.md) |

### Meta / render

| Id | Doc |
|----|-----|
| `rig.meta.named` | [meta/named.md](meta/named.md) |
| `rig.meta.tags` | [meta/tags.md](meta/tags.md) |
| `rig.render.light` | [render/light.md](render/light.md) |
| `rig.render.material` | [render/material.md](render/material.md) |
| `rig.render.visibility` | [render/visibility.md](render/visibility.md) |
| `rig.render.blend` | [render/blend.md](render/blend.md) |
| `rig.render.sprite` | [render/sprite.md](render/sprite.md) |

### Animation / modulators

| Id | Doc |
|----|-----|
| `rig.anim.tween` | [anim/tween.md](anim/tween.md) |
| `rig.anim.curve` | [anim/curve.md](anim/curve.md) |
| `rig.anim.skeleton` | [anim/skeleton.md](anim/skeleton.md) |
| `rig.anim.skin` | [anim/skin.md](anim/skin.md) |
| `rig.anim.clip` | [anim/clip.md](anim/clip.md) |
| `rig.anim.bind` | [anim/bind.md](anim/bind.md) |
| `rig.anim.track` | [anim/track.md](anim/track.md) |
| `rig.anim.blend` | [anim/blend.md](anim/blend.md) |
| `rig.mod.lfo` | [mod/lfo.md](mod/lfo.md) |
| `rig.mod.binding` | [mod/binding.md](mod/binding.md) |
| `rig.mod.trigger` | [mod/trigger.md](mod/trigger.md) |

### Music

| Id | Doc |
|----|-----|
| `rig.music.transport` | [music/transport.md](music/transport.md) |
| `rig.music.clock` | [music/clock.md](music/clock.md) |
| `rig.music.sequencer` | [music/sequencer.md](music/sequencer.md) |
| `rig.music.pattern` | [music/pattern.md](music/pattern.md) |
| `rig.music.step` | [music/step.md](music/step.md) |
| `rig.music.arrangement` | [music/arrangement.md](music/arrangement.md) |
| `rig.music.note` | [music/note.md](music/note.md) |
| `rig.music.midi_output` | [music/midi-output.md](music/midi-output.md) |
| `rig.music.midi_input` | [music/midi-input.md](music/midi-input.md) |

### Audio

| Id | Doc |
|----|-----|
| `rig.audio.analysis` | [audio/analysis.md](audio/analysis.md) |
| `rig.audio.bus` | [audio/bus.md](audio/bus.md) |
| `rig.audio.voice` | [audio/voice.md](audio/voice.md) |
| `rig.picture.analysis` | [picture/analysis.md](picture/analysis.md) |
| `rig.visualizer.deck` | [visualizer.md](visualizer.md) |

### Media

| Id | Doc |
|----|-----|
| `rig.media.asset_ref` | [media/asset-ref.md](media/asset-ref.md) |
| `rig.media.text` | [media/text.md](media/text.md) |
| `rig.media.code` | [media/code.md](media/code.md) |

### Font (UFO / variable)

Editable face - outlines on [`rig.geometry.path`](geometry/path.md), features on [`rig.media.code`](media/code.md). Design axes and live lattice cells for variable hosts. `.ufo` / `.ufoz` are host encodings - [ufo.md](../docs/ufo.md). Not a compiled TTF; not [`rig.media.text`](media/text.md).

| Id | Doc |
|----|-----|
| `rig.font.face` | [font/face.md](font/face.md) |
| `rig.font.glyph` | [font/glyph.md](font/glyph.md) |
| `rig.font.component` | [font/component.md](font/component.md) |
| `rig.font.anchor` | [font/anchor.md](font/anchor.md) |
| `rig.font.layer` | [font/layer.md](font/layer.md) |
| `rig.font.kern` | [font/kern.md](font/kern.md) |
| `rig.font.group` | [font/group.md](font/group.md) |
| `rig.font.axis` | [font/axis.md](font/axis.md) |
| `rig.font.avar` | [font/avar.md](font/avar.md) |
| `rig.font.cell` | [font/cell.md](font/cell.md) |

### Story (semantic copy)

Editorial flow - named styles, paragraphs, runs, tables. Semantics only (style identity, not face/size/colour or local bold flags). Canvas type stays on [`rig.media.text`](media/text.md).

| Id | Doc |
|----|-----|
| `rig.story.flow` | [story/flow.md](story/flow.md) |
| `rig.story.paragraph` | [story/paragraph.md](story/paragraph.md) |
| `rig.story.paragraph_style` | [story/paragraph-style.md](story/paragraph-style.md) |
| `rig.story.character_style` | [story/character-style.md](story/character-style.md) |
| `rig.story.table` | [story/table.md](story/table.md) |

### Pixel / raster

| Id | Doc |
|----|-----|
| `rig.pixel.canvas` | [pixel/canvas.md](pixel/canvas.md) |
| `rig.pixel.source` | [pixel/source.md](pixel/source.md) |
| `rig.pixel.layer` | [pixel/layer.md](pixel/layer.md) |
| `rig.pixel.raster` | [pixel/raster.md](pixel/raster.md) |
| `rig.pixel.palette` | [pixel/palette.md](pixel/palette.md) |
| `rig.pixel.tile_set` | [pixel/tile-set.md](pixel/tile-set.md) |
| `rig.pixel.tile_map` | [pixel/tile-map.md](pixel/tile-map.md) |
| `rig.pixel.effect_chain` | [pixel/effect-chain.md](pixel/effect-chain.md) |
| `rig.pixel.region` | [pixel/region.md](pixel/region.md) |
| `rig.pixel.mask_path` | [pixel/mask-path.md](pixel/mask-path.md) |
| `rig.pixel.composite` | [pixel/composite.md](pixel/composite.md) |

### Print / FGF

Pellet / FGF machine, grade, process, sag, and a job that points at asset entities. Not envelope `pdfX`, not a layout page, not [`rig.dev.machine`](dev/machine.md), not plotter G-code ([`rigGCode`](https://github.com/rigkid/rigGCode) is `CPaths`). Not authored CSG (`rig.cad.*`). Paths compose [`rig.media.asset_ref`](media/asset-ref.md) - [print.md](../docs/print.md).

| Id | Doc |
|----|-----|
| `rig.print.machine` | [print/machine.md](print/machine.md) |
| `rig.print.material` | [print/material.md](print/material.md) |
| `rig.print.process` | [print/process.md](print/process.md) |
| `rig.print.compression` | [print/compression.md](print/compression.md) |
| `rig.print.job` | [print/job.md](print/job.md) |

### Circuit / PCB

Electrical meaning - parts, physical terminals, nets - is `rig.circuit.*`, shared by schematic, board, and live hardware. Board fabrication is `rig.pcb.*`. A pad is a drawing of a terminal, so `rig.pcb.pad` composes on the `rig.circuit.pin` entity. Drawing primitives stay on geometry and paint; layers are joined through `rig.pcb.layer_set`, not `parent`. Zone fills and ratsnest are host caches. `.kicad_pcb` is a host encoding - [kicad.md](../docs/kicad.md).

| Id | Doc |
|----|-----|
| `rig.circuit.part` | [circuit/part.md](circuit/part.md) |
| `rig.circuit.pin` | [circuit/pin.md](circuit/pin.md) |
| `rig.circuit.net` | [circuit/net.md](circuit/net.md) |
| `rig.pcb.board` | [pcb/board.md](pcb/board.md) |
| `rig.pcb.layer` | [pcb/layer.md](pcb/layer.md) |
| `rig.pcb.layer_set` | [pcb/layer-set.md](pcb/layer-set.md) |
| `rig.pcb.footprint` | [pcb/footprint.md](pcb/footprint.md) |
| `rig.pcb.pad` | [pcb/pad.md](pcb/pad.md) |
| `rig.pcb.track` | [pcb/track.md](pcb/track.md) |
| `rig.pcb.via` | [pcb/via.md](pcb/via.md) |
| `rig.pcb.zone` | [pcb/zone.md](pcb/zone.md) |
| `rig.pcb.keepout` | [pcb/keepout.md](pcb/keepout.md) |

### I/O

| Id | Doc |
|----|-----|
| `rig.io.osc` | [io/osc.md](io/osc.md) |
| `rig.io.serial` | [io/serial.md](io/serial.md) |
| `rig.io.sacn` | [io/sacn.md](io/sacn.md) |
| `rig.io.dmx` | [io/dmx.md](io/dmx.md) |
| `rig.dmx.fixture` | [dmx/fixture.md](dmx/fixture.md) |
| `rig.led.uv_map` | [led/uv-map.md](led/uv-map.md) |
| `rig.sensor.gpio` | [sensor/gpio.md](sensor/gpio.md) |
| `rig.sensor.presence` | [sensor/presence.md](sensor/presence.md) |
| `rig.sensor.depth` | [sensor/depth.md](sensor/depth.md) |
| `rig.sensor.lidar` | [sensor/lidar.md](sensor/lidar.md) |
| `rig.sensor.imu` | [sensor/imu.md](sensor/imu.md) |
| `rig.sensor.wrench` | [sensor/wrench.md](sensor/wrench.md) |
| `rig.sensor.range` | [sensor/range.md](sensor/range.md) |
| `rig.sensor.gnss` | [sensor/gnss.md](sensor/gnss.md) |
| `rig.sensor.label` | [sensor/label.md](sensor/label.md) |
| `rig.sensor.class` | [sensor/class.md](sensor/class.md) |
| `rig.input.buttons` | [input/buttons.md](input/buttons.md) |
| `rig.input.axes` | [input/axes.md](input/axes.md) |
| `rig.input.pointer` | [input/pointer.md](input/pointer.md) |
| `rig.input.binding` | [input/binding.md](input/binding.md) |
| `rig.light.look` | [light/look.md](light/look.md) |
| `rig.calendar.weekly` | [calendar/weekly.md](calendar/weekly.md) |
| `rig.calendar.span` | [calendar/span.md](calendar/span.md) |
| `rig.calendar.exception` | [calendar/exception.md](calendar/exception.md) |
| `rig.calendar.event` | [calendar/event.md](calendar/event.md) |
| `rig.calendar.recurrence` | [calendar/recurrence.md](calendar/recurrence.md) |
| `rig.calendar.attendee` | [calendar/attendee.md](calendar/attendee.md) |

### VR

Stereo views, tracked poses, and room bounds. Pose is [`rig.spatial.transform`](spatial/transform.md). Projection is [`rig.spatial.camera`](spatial/camera.md). Triggers and grips stay [`rig.input.axes`](input/axes.md). OpenXR, WebXR, and other runtimes are fulfillments - [vr.md](../docs/vr.md).

| Id | Doc |
|----|-----|
| `rig.vr.space` | [vr/space.md](vr/space.md) |
| `rig.vr.headset` | [vr/headset.md](vr/headset.md) |
| `rig.vr.eye` | [vr/eye.md](vr/eye.md) |
| `rig.vr.tracker` | [vr/tracker.md](vr/tracker.md) |
| `rig.vr.controller` | [vr/controller.md](vr/controller.md) |
| `rig.vr.pose` | [vr/pose.md](vr/pose.md) |
| `rig.vr.hand` | [vr/hand.md](vr/hand.md) |
| `rig.vr.joint` | [vr/joint.md](vr/joint.md) |
| `rig.vr.haptic` | [vr/haptic.md](vr/haptic.md) |
| `rig.vr.anchor` | [vr/anchor.md](vr/anchor.md) |

### Dev environments

Portable development-machine recipes - not a media-show AV bus or gated trigger, not UI docks. Cache fingerprints and credentials stay host-only - [dev.md](../docs/dev.md).

| Id | Doc |
|----|-----|
| `rig.dev.machine` | [dev/machine.md](dev/machine.md) |
| `rig.dev.op` | [dev/op.md](dev/op.md) |

### Simulation

Bodies, contact, drives, and walkable surfaces. A recorded take is [`rig.sim.episode`](sim/episode.md). Live contact manifolds, particle buffers, point clouds, and solved paths stay in the host. Design, simulation, test, and training: [robot.md](../docs/robot.md). ROS 2 middleware: [ros.md](../docs/ros.md).

| Id | Doc |
|----|-----|
| `rig.sim.rigidbody` | [sim/rigidbody.md](sim/rigidbody.md) |
| `rig.sim.particle_emitter` | [sim/particle-emitter.md](sim/particle-emitter.md) |
| `rig.sim.collider` | [sim/collider.md](sim/collider.md) |
| `rig.sim.joint` | [sim/joint.md](sim/joint.md) |
| `rig.sim.actuator` | [sim/actuator.md](sim/actuator.md) |
| `rig.sim.episode` | [sim/episode.md](sim/episode.md) |
| `rig.sim.character` | [sim/character.md](sim/character.md) |
| `rig.sim.navmesh` | [sim/navmesh.md](sim/navmesh.md) |
| `rig.sim.agent` | [sim/agent.md](sim/agent.md) |
| `rig.sim.world` | [sim/world.md](sim/world.md) |
| `rig.sim.articulation` | [sim/articulation.md](sim/articulation.md) |
| `rig.sim.domain` | [sim/domain.md](sim/domain.md) |

### Play

Hit points, items, spawn, and a save slot. Rules that change them stay in the host.

| Id | Doc |
|----|-----|
| `rig.play.health` | [play/health.md](play/health.md) |
| `rig.play.script` | [play/script.md](play/script.md) |
| `rig.play.item` | [play/item.md](play/item.md) |
| `rig.play.inventory` | [play/inventory.md](play/inventory.md) |
| `rig.play.spawner` | [play/spawner.md](play/spawner.md) |
| `rig.play.save` | [play/save.md](play/save.md) |

### AI

| Id | Doc |
|----|-----|
| `rig.ai.behavior` | [ai/behavior.md](ai/behavior.md) |
| `rig.ai.policy` | [ai/policy.md](ai/policy.md) |

### Net

| Id | Doc |
|----|-----|
| `rig.net.replica` | [net/replica.md](net/replica.md) |

### Interaction

| Id | Doc |
|----|-----|
| `rig.interact.selectable` | [interact/selectable.md](interact/selectable.md) |
| `rig.interact.selected` | [interact/selected.md](interact/selected.md) |

### UI (control surfaces)

| Id | Doc |
|----|-----|
| `rig.ui.panel` | [ui/panel.md](ui/panel.md) |
| `rig.ui.group` | [ui/group.md](ui/group.md) |
| `rig.ui.control` | [ui/control.md](ui/control.md) |
| `rig.ui.action` | [ui/action.md](ui/action.md) |

### Node graph

| Id | Doc |
|----|-----|
| `rig.node.graph` | [node/graph.md](node/graph.md) |
| `rig.node.node` | [node/node.md](node/node.md) |
| `rig.node.pin` | [node/pin.md](node/pin.md) |
| `rig.node.link` | [node/link.md](node/link.md) |
| `rig.node.bus` | [node/bus.md](node/bus.md) |
| `rig.node.param` | [node/param.md](node/param.md) |
| `rig.node.publish` | [node/publish.md](node/publish.md) |

### Grouping graphs (do not merge)

| Graph | Parent / nest | Schema |
|-------|---------------|--------|
| Scene pose | `parent` | [`spatial.relationship`](spatial/relationship.md) + optional [`spatial.vertex`](spatial/vertex.md) / [`spatial.group`](spatial/group.md) markers |
| TF / URDF frame | `parent` | [`spatial.relationship`](spatial/relationship.md) - same graph as scene pose; not a new graph ([ros.md](../docs/ros.md)) |
| Compositor stack | `groupParent` | [`pixel.layer`](pixel/layer.md) (`kind=group`) |
| Effect chain | `parentStep` | [`pixel.effect_chain`](pixel/effect-chain.md) (step `id`) |
| Tile map | `tileSet` | [`pixel.tile_map`](pixel/tile-map.md) via [`pixel.tile_set`](pixel/tile-set.md) via [`pixel.palette`](pixel/palette.md) |
| Node editor | `nested` on a node | [`node.node`](node/node.md) + [`node.publish`](node/publish.md) |
| Song arrangement | frame `patterns` | [`music.arrangement`](music/arrangement.md) via [`music.pattern`](music/pattern.md) (by `lane`) |
| Control surface | `panel` / optional `group` | [`ui.panel`](ui/panel.md) + [`ui.group`](ui/group.md) + [`ui.control`](ui/control.md) / [`ui.action`](ui/action.md) |
| CSG tree | `operands` | [`cad.boolean`](cad/boolean.md) via cad primitives / mesh solids (not `spatial.relationship`) |
| Story flow | `blocks` | [`story.flow`](story/flow.md) via [`story.paragraph`](story/paragraph.md) / [`story.table`](story/table.md) |
| Story thread | `frames` | [`layout.frame_chain`](layout/frame-chain.md) via [`layout.frame`](layout/frame.md) |
| FGF job | `input` / `output` | [`print.job`](print/job.md) via [`media.asset_ref`](media/asset-ref.md) |
| Circuit part | `parent` | [`spatial.relationship`](spatial/relationship.md): terminals ([`circuit.pin`](circuit/pin.md)) and footprint drawings under a [`circuit.part`](circuit/part.md) |
| Net membership | `net` | [`circuit.pin`](circuit/pin.md) / [`pcb.track`](pcb/track.md) / [`pcb.via`](pcb/via.md) / [`pcb.zone`](pcb/zone.md) via [`circuit.net`](circuit/net.md) - the net holds no member list |
| Board layers | `layers` | [`pcb.layer_set`](pcb/layer-set.md) via [`pcb.layer`](pcb/layer.md) (not `spatial.relationship`) |
| GPIO terminal | `terminal` | [`sensor.gpio`](sensor/gpio.md) via [`circuit.pin`](circuit/pin.md) |
| Table cell | `blocks` | [`story.table`](story/table.md) cell via nested paragraphs / tables (not listed on the parent flow) |
| BIM containment | `parent` | [`spatial.relationship`](spatial/relationship.md) under site / building / storey groups ([`bim.site`](bim/site.md) / [`building`](bim/building.md) / [`storey`](bim/storey.md)) |
| BIM relation | `a` / `b` | [`bim.relation`](bim/relation.md) (`voids` / `fills` / `connects` / `aggregates` / `services`) |
| BIM type | `type` | [`bim.occurrence`](bim/occurrence.md) via [`bim.type`](bim/type.md) |
| BCF thread | `topic` | [`bim.comment`](bim/comment.md) / [`bim.viewpoint`](bim/viewpoint.md) via [`bim.topic`](bim/topic.md) |
| IDS spec | `applicability` / `requirements` | [`bim.spec`](bim/spec.md) via [`bim.facet`](bim/facet.md) |
| Font face | `parent` | [`spatial.relationship`](spatial/relationship.md) under [`font.face`](font/face.md) / [`font.layer`](font/layer.md) |
| Font composite | `parent` | [`font.component`](font/component.md) child of [`font.glyph`](font/glyph.md); `glyph` is the source |
| Font kern | `left` / `right` | [`font.kern`](font/kern.md) - names (`stableId`), not entity ids |
| Commerce offer | `item` / `seller` | [`commerce.offer`](commerce/offer.md) via item + seller; price / discount compose on the offer |
| Legal party | `agreement` / `party` | [`legal.party`](legal/party.md) via [`legal.agreement`](legal/agreement.md) |
| Calendar attendee | `event` | [`calendar.attendee`](calendar/attendee.md) via [`calendar.event`](calendar/event.md) |
| Calendar recurrence | same entity | [`calendar.recurrence`](calendar/recurrence.md) on the event; not an `RRULE` string |
| Contact | same entity | [`sim.collider`](sim/collider.md) on the body. A compound is child entities |
| Joint | `a` / `b` | [`sim.joint`](sim/joint.md). `mimic` follows another joint |
| Actuator | `joint` | [`sim.actuator`](sim/actuator.md) via [`sim.joint`](sim/joint.md) |
| Episode | `clip` | [`sim.episode`](sim/episode.md) via [`anim.clip`](anim/clip.md); `actions` / `observations` are [`anim.track`](anim/track.md) |
| Depth / lidar / imu | same entity | [`sensor.depth`](sensor/depth.md) composes [`spatial.camera`](spatial/camera.md). [`sensor.lidar`](sensor/lidar.md) and [`sensor.imu`](sensor/imu.md) compose transform. Clouds and covariance stay host |
| Physics world | same entity | [`sim.world`](sim/world.md) on the scene vertex. A body's `gravity` replaces it |
| Articulation | `parent` | [`sim.articulation`](sim/articulation.md) on the root link. Links use [`spatial.relationship`](spatial/relationship.md). Joints are [`sim.joint`](sim/joint.md) |
| Domain draw | `target` | [`sim.domain`](sim/domain.md) varies one property at reset |
| Policy | `actions` / `observations` | [`ai.policy`](ai/policy.md) via actuators and sensors. `weights` is an [`media.asset_ref`](media/asset-ref.md) |
| Label image | same entity | [`sensor.label`](sensor/label.md) on a camera. A mesh's class is [`sensor.class`](sensor/class.md) |
| GNSS fix | same entity | [`sensor.gnss`](sensor/gnss.md) plus [`place.geo`](place/geo.md) |
| Skeleton | `parent` | [`spatial.relationship`](spatial/relationship.md) under [`anim.skeleton`](anim/skeleton.md) bones |
| Skin | `joints` | [`anim.skin`](anim/skin.md) via [`anim.skeleton`](anim/skeleton.md) |
| Clip samples | `clip` | [`anim.track`](anim/track.md) via [`anim.clip`](anim/clip.md) |
| Blend tree | `a` / `b` | [`anim.blend`](anim/blend.md) node ids |
| Behavior tree | `parent` | [`ai.behavior`](ai/behavior.md) node ids. `action` is a host name |
| Walker | `navmesh` | [`sim.agent`](sim/agent.md) via [`sim.navmesh`](sim/navmesh.md) on a mesh |
| Voice | `asset` / `bus` | [`audio.voice`](audio/voice.md) via [`media.asset_ref`](media/asset-ref.md) and [`audio.bus`](audio/bus.md) |
| Inventory | `item` | [`play.inventory`](play/inventory.md) slot via [`play.item`](play/item.md) |
| Spawner | `prototype` | [`play.spawner`](play/spawner.md) |
| HUD | `surface` | [`ui.panel`](ui/panel.md) `hud` - same controls as a tool |
| VR space | `parent` | [`vr.space`](vr/space.md). `bounds` is the floor polygon (x, z) |
| VR eye | `headset` | [`vr.eye`](vr/eye.md) composes [`spatial.camera`](spatial/camera.md). Parent is the head [`vr.tracker`](vr/tracker.md) |
| VR pose | `parent` | [`vr.pose`](vr/pose.md) grip / aim under a [`vr.controller`](vr/controller.md) or tracker |
| VR hand | `parent` | [`vr.joint`](vr/joint.md) under [`vr.hand`](vr/hand.md). Wrist parents to the hand |
| VR anchor | `parent` | [`vr.anchor`](vr/anchor.md) pin. `persistentId` when it outlives the session |

Hosts and packs fulfill subsets - see [RigKit port-map](https://github.com/rigkid/RigKit/blob/main/docs/contract/port-map.md).
