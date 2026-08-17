# OpenBIM

Rig names OpenBIM meaning as [`rig.bim.*`](../schemas/bim/classify.md). IFC, BCF, and IDS **files** stay host mappings at the boundary — same rule as SVG ([design philosophy](design-philosophy.md#encoding)).

OpenBIM (buildingSMART) is IFC + BCF + IDS + bSDD. The Contract job is entities, POD components, and schema ids. A converter or Revit/IFC pack is fulfillment ([RigKit](https://github.com/rigkid/RigKit) or a sibling tool), not this catalog.

## Thin layer

Do **not** invent `rig.bim.wall` / `rig.bim.door`. One wall and one door use the same components; [`rig.bim.classify`](../schemas/bim/classify.md) `ifcClass` is `"IfcWall"` vs `"IfcDoor"`. Geometry stays on [`rig.cad.*`](../schemas/cad/cuboid.md) / [`rig.geometry.mesh`](../schemas/geometry/mesh.md). Type-specific numbers that are not solids (fire rating, `IsExternal`) live in [`rig.bim.pset`](../schemas/bim/pset.md).

| OpenBIM idea | Rig |
|--------------|-----|
| Element GlobalId / name | [`rig.meta.named`](../schemas/meta/named.md) |
| IFC class + predefined type + bSDD / Uniclass | [`rig.bim.classify`](../schemas/bim/classify.md) |
| Type vs occurrence | [`rig.bim.type`](../schemas/bim/type.md) + [`rig.bim.occurrence`](../schemas/bim/occurrence.md) |
| Property sets | [`rig.bim.pset`](../schemas/bim/pset.md) |
| Site / building / storey / space | [`rig.bim.site`](../schemas/bim/site.md) / [`building`](../schemas/bim/building.md) / [`storey`](../schemas/bim/storey.md) / [`space`](../schemas/bim/space.md) + [`rig.spatial.group`](../schemas/spatial/group.md) |
| Containment (on storey) | [`rig.spatial.relationship`](../schemas/spatial/relationship.md) `parent` |
| Voids / fills / connects / aggregates / services | [`rig.bim.relation`](../schemas/bim/relation.md) (own entity) |
| Extrusion / mesh bake | [`rig.cad.extrude`](../schemas/cad/extrude.md) / [`rig.geometry.mesh`](../schemas/geometry/mesh.md) |
| BCF topic / comment / viewpoint | [`rig.bim.topic`](../schemas/bim/topic.md) / [`comment`](../schemas/bim/comment.md) / [`viewpoint`](../schemas/bim/viewpoint.md) |
| IDS specification / facet | [`rig.bim.spec`](../schemas/bim/spec.md) / [`facet`](../schemas/bim/facet.md) |
| Source IFC release | optional `document.ifcSchema` (`ifc2x3` / `ifc4` / `ifc4x3`) |

## Encodings (fulfillment)

| File | Role |
|------|------|
| `.ifc` / `.ifczip` / ifcXML / ifcJSON | Map into / out of `rig.bim.*` + spatial / cad |
| `.bcfzip` / BCF-XML | Map topics, comments, viewpoints |
| `.ids` | Map specifications and facets |
| `.rvt` | Autodesk private database — read via API or export IFC first |

Do not put OwnerHistory, Representation item trees, or ObjectPlacement graphs in portable components — those are encoding / host cache.

## Honest limit

Two hosts that speak `rig.bim.classify` + `pset` + `relation` can exchange a building and a BCF thread as `.rig`. Round-tripping every IFC representation item is not required — CAD + optional mesh bake covers the portable subset. A host that needs the rest keeps it in the IFC file and maps what it understands.

Examples: [`examples/bim-model.json`](../examples/bim-model.json), [`bim-bcf.json`](../examples/bim-bcf.json), [`bim-ids.json`](../examples/bim-ids.json).
