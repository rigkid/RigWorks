# Schemas

Agreed POD field layouts. **Formats when present** — ship what you support.

Being Rig does not require implementing this catalog. If two hosts both speak a schema id, they share fields and units.

- **Prose** (this tree) — field meaning and units for humans.
- **JSON Schema** — [`json/`](json/) machine grammar for tools and AI emission.
- **Documents** — [`document.md`](document.md) envelope; examples under [`../examples/`](../examples/); validate with [`../tools/rig-validate/`](../tools/rig-validate/).

## Rules

- Field **meaning and units** are the contract; C++ type names are host-specific.
- One type per field. No dual representations. No dual-field legacy aliases until 1.0.
- Authored fields only. Anything a host can recompute from those fields stays in the host — [Host cache](../docs/terms.md). Do not add it to a schema for convenience (polygon winding from `points`, world matrix from local pose + parent, bar/beat from `positionBeats`).
- No device handles, GPU objects, UI toolkit types, callbacks, dirty flags, or ephemeral edge state in portable fields.
- Runtime caches and queues (last sample, pending MIDI, hover) stay in the host.
- Ids are `rig.<domain>.<name>` (snake_case multi-word segments). Enum literals are kebab-case (`top-left`, `color-dodge`) — they are user-facing choice labels, not field names.
- Display names live on [`rig.meta.named`](meta/named.md) — compose it; do not re-declare `name` on every schema.
- File identity lives on [`rig.media.asset_ref`](media/asset-ref.md) — other schemas reference it by `entity` id when they need a path.
- `rgba` / `rgb` / `clearRgba` are floats 0–1. Colour space is the envelope's `document.colorSpace` key (default: srgb) — see [document.md](document.md).
- Domain meaning lives in field names — not extra property datatype ids. See [properties.md](../docs/properties.md).

### Measurements

One home per quantity class. Convert once at the host edge (cm / in / display units on import).

| Kind | Store |
|------|--------|
| Ratio | 0–1. Colour, gain, opacity, UV, phase, metallic, gate, occupancy — and a length authored as a fraction of a **named** extent (page, parent, em). |
| Scene length | `document.defaultUnit`. A page may override with [`rig.layout.page`](layout/page.md) `unit`. Transform `position`, geometry, stroke width, page size. |
| Catalog fact | SI in the field name: [`rig.art.dimensions`](art/dimensions.md) millimetres, [`rig.plant.habit`](plant/habit.md) metres, [`rig.place.geo`](place/geo.md) `altitudeMetres`. |
| Protocol / clock | Native scale. MIDI 0–127, wall-clock `startMinutes` 0–1439, WGS84 degrees. |
| Commerce percent | 0–100 on [`rig.commerce.discount`](commerce/discount.md) (`10` is 10%). |

### Field naming

Fields are **lowerCamelCase** and spelled out. Prefer `radiusX` over `rx`, `centerX` over `cx`, `position` over `pos`, `interpolation` over `interp`.

| Pattern | Use |
|---------|-----|
| Spelled words | `innerRadius`, `rotationDegrees`, `startAngleDegrees` |
| Axis suffix | Split scalars get `X` / `Y` / `Z` — `centerX`, `radiusY`, `originX`, `fovYDegrees` |
| Angles | `*Degrees` (not radians) |
| Domain acronyms | Keep the common short form when it *is* the name: `bpm`, `rgb`, `rgba`, `uv` |
| Indexed edges | Bare `x` / `y` / `x1` / `y1` for rectangle corners and line endpoints |
| Tagged-union slots | Only [`rig.node.param`](node/param.md) uses `f` / `i` / `s` / `v` — do not invent more single-letter fields |

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
| `rig.layout.page` | [layout/page.md](layout/page.md) |

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
| `rig.organisation.identity` | [organisation/identity.md](organisation/identity.md) |
| `rig.party.account` | [party/account.md](party/account.md) |

### Commerce

| Id | Doc |
|----|-----|
| `rig.commerce.price` | [commerce/price.md](commerce/price.md) |
| `rig.commerce.offer` | [commerce/offer.md](commerce/offer.md) |
| `rig.commerce.discount` | [commerce/discount.md](commerce/discount.md) |

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

Deals between parties — not the Rig Contract, and not copyright of a work ([`rig.rights.statement`](rights/statement.md)).

| Id | Doc |
|----|-----|
| `rig.legal.agreement` | [legal/agreement.md](legal/agreement.md) |
| `rig.legal.party` | [legal/party.md](legal/party.md) |

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

### CAD / solids

CSG tree as split primitives. When `rig.cad.*` is present it is the solid source of truth; mesh on the same entity is an optional bake. Edges for fillet/chamfer are `{a,b}` pairs into mesh `positions` — see [geometry/mesh.md](geometry/mesh.md#edges).

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

### BIM / OpenBIM

Thin OpenBIM layer — IFC class is a string on `classify`, not one schema per `IfcWall`. `.ifc` / `.bcfzip` / `.ids` are host encodings — [openbim.md](../docs/openbim.md).

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

### Animation / modulators

| Id | Doc |
|----|-----|
| `rig.anim.tween` | [anim/tween.md](anim/tween.md) |
| `rig.anim.curve` | [anim/curve.md](anim/curve.md) |
| `rig.mod.lfo` | [mod/lfo.md](mod/lfo.md) |
| `rig.mod.binding` | [mod/binding.md](mod/binding.md) |

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

### Media

| Id | Doc |
|----|-----|
| `rig.media.asset_ref` | [media/asset-ref.md](media/asset-ref.md) |
| `rig.media.text` | [media/text.md](media/text.md) |
| `rig.media.code` | [media/code.md](media/code.md) |

### Font (UFO source)

Editable face — outlines on [`rig.geometry.path`](geometry/path.md), features on [`rig.media.code`](media/code.md). `.ufo` / `.ufoz` are host encodings — [ufo.md](../docs/ufo.md). Not a compiled TTF; not [`rig.media.text`](media/text.md).

| Id | Doc |
|----|-----|
| `rig.font.face` | [font/face.md](font/face.md) |
| `rig.font.glyph` | [font/glyph.md](font/glyph.md) |
| `rig.font.component` | [font/component.md](font/component.md) |
| `rig.font.anchor` | [font/anchor.md](font/anchor.md) |
| `rig.font.layer` | [font/layer.md](font/layer.md) |
| `rig.font.kern` | [font/kern.md](font/kern.md) |
| `rig.font.group` | [font/group.md](font/group.md) |

### Story (semantic copy)

Editorial flow — named styles, paragraphs, runs, tables. Semantics only (style identity, not face/size/colour or local bold flags). Canvas type stays on [`rig.media.text`](media/text.md).

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

### Install / I/O

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
| `rig.input.buttons` | [input/buttons.md](input/buttons.md) |
| `rig.light.look` | [light/look.md](light/look.md) |
| `rig.calendar.weekly` | [calendar/weekly.md](calendar/weekly.md) |
| `rig.calendar.span` | [calendar/span.md](calendar/span.md) |
| `rig.calendar.exception` | [calendar/exception.md](calendar/exception.md) |
| `rig.calendar.event` | [calendar/event.md](calendar/event.md) |
| `rig.calendar.recurrence` | [calendar/recurrence.md](calendar/recurrence.md) |
| `rig.calendar.attendee` | [calendar/attendee.md](calendar/attendee.md) |
| `rig.install.av_bus` | [install/av-bus.md](install/av-bus.md) |
| `rig.install.trigger` | [install/trigger.md](install/trigger.md) |

### Simulation

| Id | Doc |
|----|-----|
| `rig.sim.rigidbody` | [sim/rigidbody.md](sim/rigidbody.md) |
| `rig.sim.particle_emitter` | [sim/particle-emitter.md](sim/particle-emitter.md) |

### Interaction

| Id | Doc |
|----|-----|
| `rig.interact.selectable` | [interact/selectable.md](interact/selectable.md) |

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
| `rig.node.param` | [node/param.md](node/param.md) |
| `rig.node.publish` | [node/publish.md](node/publish.md) |

### Grouping graphs (do not merge)

| Graph | Parent / nest | Schema |
|-------|---------------|--------|
| Scene pose | `parent` | [`spatial.relationship`](spatial/relationship.md) + optional [`spatial.vertex`](spatial/vertex.md) / [`spatial.group`](spatial/group.md) markers |
| TF / URDF frame | `parent` | [`spatial.relationship`](spatial/relationship.md) — same graph as scene pose; not a new graph ([ros.md](../docs/ros.md)) |
| Compositor stack | `groupParent` | [`pixel.layer`](pixel/layer.md) (`kind=group`) |
| Effect chain | `parentStep` | [`pixel.effect_chain`](pixel/effect-chain.md) (step `id`) |
| Tile map | `tileSet` | [`pixel.tile_map`](pixel/tile-map.md) → [`pixel.tile_set`](pixel/tile-set.md) → [`pixel.palette`](pixel/palette.md) |
| Node editor | `nested` on a node | [`node.node`](node/node.md) + [`node.publish`](node/publish.md) |
| Song arrangement | frame `patterns` | [`music.arrangement`](music/arrangement.md) → [`music.pattern`](music/pattern.md) (by `lane`) |
| Control surface | `panel` / optional `group` | [`ui.panel`](ui/panel.md) + [`ui.group`](ui/group.md) + [`ui.control`](ui/control.md) / [`ui.action`](ui/action.md) |
| CSG tree | `operands` | [`cad.boolean`](cad/boolean.md) → cad primitives / mesh solids (not `spatial.relationship`) |
| Story flow | `blocks` | [`story.flow`](story/flow.md) → [`story.paragraph`](story/paragraph.md) / [`story.table`](story/table.md) |
| Table cell | `blocks` | [`story.table`](story/table.md) cell → nested paragraphs / tables (not listed on the parent flow) |
| BIM containment | `parent` | [`spatial.relationship`](spatial/relationship.md) under site / building / storey groups ([`bim.site`](bim/site.md) / [`building`](bim/building.md) / [`storey`](bim/storey.md)) |
| BIM relation | `a` / `b` | [`bim.relation`](bim/relation.md) (`voids` / `fills` / `connects` / `aggregates` / `services`) |
| BIM type | `type` | [`bim.occurrence`](bim/occurrence.md) → [`bim.type`](bim/type.md) |
| BCF thread | `topic` | [`bim.comment`](bim/comment.md) / [`bim.viewpoint`](bim/viewpoint.md) → [`bim.topic`](bim/topic.md) |
| IDS spec | `applicability` / `requirements` | [`bim.spec`](bim/spec.md) → [`bim.facet`](bim/facet.md) |
| Font face | `parent` | [`spatial.relationship`](spatial/relationship.md) under [`font.face`](font/face.md) / [`font.layer`](font/layer.md) |
| Font composite | `parent` | [`font.component`](font/component.md) child of [`font.glyph`](font/glyph.md); `glyph` is the source |
| Font kern | `left` / `right` | [`font.kern`](font/kern.md) — names (`stableId`), not entity ids |
| Commerce offer | `item` / `seller` | [`commerce.offer`](commerce/offer.md) → item + seller; price / discount compose on the offer |
| Legal party | `agreement` / `party` | [`legal.party`](legal/party.md) → [`legal.agreement`](legal/agreement.md) |
| Calendar attendee | `event` | [`calendar.attendee`](calendar/attendee.md) → [`calendar.event`](calendar/event.md) |
| Calendar recurrence | same entity | [`calendar.recurrence`](calendar/recurrence.md) on the event; not an `RRULE` string |

Hosts and packs fulfill subsets — see [RigKit port-map](https://github.com/rigkid/RigKit/blob/main/docs/contract/port-map.md).
