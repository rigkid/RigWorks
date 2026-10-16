# `rig.circuit.part`

One placed electronic part - a resistor, an IC, a connector, a Raspberry Pi header. Format when present.

Its terminals are child entities ([`rig.spatial.relationship`](../spatial/relationship.md) `parent`) carrying [`rig.circuit.pin`](pin.md). On a board the same entity composes [`rig.pcb.footprint`](../pcb/footprint.md) and a [`rig.spatial.transform`](../spatial/transform.md); a schematic drawing of the part is another drawing of the same entity, not a second part.

| Field | Type | Meaning |
|-------|------|---------|
| `reference` | string | Reference designator (`R1`, `U3`, `J2`). Unique per design |
| `value` | string | Optional. Value or part name (`10k`, `ESP32-S3-WROOM-1`); absent = none |
| `datasheet` | entity | Optional. [`rig.media.asset_ref`](../media/asset-ref.md) (`kind` `document`) for the datasheet; absent = none |
| `inBom` | bool | Optional. Listed on a bill of materials; absent = true |

Required: `reference`.

A [`rig.media.text`](../media/text.md) child of a part may contain `{{reference}}` and `{{value}}`; hosts substitute this component's fields when they draw. A rename then updates every label instead of leaving stale copies.

Do not put the footprint library, board side, or pad geometry here - those are [`rig.pcb.footprint`](../pcb/footprint.md) and [`rig.pcb.pad`](../pcb/pad.md). Supplier, price, and stock are [`rig.commerce.offer`](../commerce/offer.md) with this entity as `item`.
