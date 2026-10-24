# BIM and CAD

Load for: buildings, IFC/BCF/IDS, solids, datums. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/bim-model.json`](../../../examples/bim-model.json), [`examples/bim-bcf.json`](../../../examples/bim-bcf.json), [`examples/bim-ids.json`](../../../examples/bim-ids.json), [`examples/cad-boolean.json`](../../../examples/cad-boolean.json), [`examples/cad-dimension.json`](../../../examples/cad-dimension.json), [`examples/cad-reference.json`](../../../examples/cad-reference.json), [`examples/cad-solids.json`](../../../examples/cad-solids.json). OpenBIM mapping: [`docs/openbim.md`](../../../docs/openbim.md).

## Compose

| Want | Compose |
|---|---|
| An IFC class on an element | `rig.bim.classify` (`ifcClass` is a string field here) |
| Element type vs occurrence | `rig.bim.type` and `rig.bim.occurrence` (`type` points at the type) |
| Typed property sets | `rig.bim.pset` |
| Site / building / storey / space | `rig.bim.site`, `rig.bim.building`, `rig.bim.storey`, `rig.bim.space`; containment is `rig.spatial.relationship` parentage |
| A BIM relation (voids/fills/connects) | `rig.bim.relation` (`a` / `b`) |
| A BCF thread | `rig.bim.topic` with `rig.bim.comment` / `rig.bim.viewpoint` pointing at it (`topic`) |
| An IDS spec | `rig.bim.spec` with `rig.bim.facet` (`applicability` / `requirements`) |
| A solid primitive | Split `rig.cad.*`: `cuboid`, `cylinder`, `sphere`, `extrude`, `revolve`; combine with `rig.cad.boolean` (`operands`) |
| Edge treatments | `rig.cad.fillet`, `rig.cad.chamfer` - edges are `{a,b}` vertex pairs into mesh `positions` |
| A numeric datum | `rig.cad.dimension`; datum geometry is `rig.cad.reference_line` / `rig.cad.reference_plane` |

## Guards

- No `rig.bim.wall`, `rig.bim.door`, or one schema per IFC class. Geometry lives on cad/mesh; classification is a string.
- No tagged-union CSG and no `rig.cad.constraint` tagged union. Coincident/parallel constraints wait for their own ids. Mesh on a CAD entity is an optional bake, never the source of truth beside a solid.
- Keep datums off solid entities and out of `boolean.operands`.

## Ids in this slice

`rig.bim.classify`, `rig.bim.type`, `rig.bim.occurrence`, `rig.bim.pset`, `rig.bim.site`, `rig.bim.building`, `rig.bim.storey`, `rig.bim.space`, `rig.bim.relation`, `rig.bim.topic`, `rig.bim.comment`, `rig.bim.viewpoint`, `rig.bim.spec`, `rig.bim.facet`, `rig.cad.cuboid`, `rig.cad.cylinder`, `rig.cad.sphere`, `rig.cad.extrude`, `rig.cad.revolve`, `rig.cad.boolean`, `rig.cad.fillet`, `rig.cad.chamfer`, `rig.cad.dimension`, `rig.cad.reference_line`, `rig.cad.reference_plane`
