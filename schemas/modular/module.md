---
id: "rig.modular.module"
maturity: "draft"
summary: "One modular faceplate. Format when present."
fields:
  - name: "hp"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/int\",\"minimum\":1}"
    required: true
    meaning: "Faceplate width in horizontal-pitch units"
  - name: "pitchMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"exclusiveMinimum\":0}"
    meaning: "Optional. Millimetres per HP. Absent = 5.08 (Eurocard horizontal pitch)"
    absent: "5.08 (Eurocard horizontal pitch)"
  - name: "widthMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Finished faceplate width (mm). Absent = unset. hp times pitchMm is the nominal width, which a host computes"
    absent: "unset"
  - name: "heightMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Finished faceplate height (mm). Absent = unset"
    absent: "unset"
  - name: "thicknessMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Panel thickness (mm). Absent = unset"
    absent: "unset"
  - name: "depthMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Depth from the inside face of the panel to the furthest rear point (mm). Absent = unset"
    absent: "unset"
  - name: "fastener"
    type: "string"
    enum: ["m3","m2-5"]
    meaning: "Optional. Panel thread. m3, m2-5 (M2.5). Absent = unset"
    absent: "unset"
  - name: "spec"
    ref: "entity"
    meaning: "Optional. Named spec this module claims. Absent = no claim"
    absent: "no claim"
---
# `rig.modular.module`

One modular faceplate. Format when present.

The entity is the module a person slides into a [`rig.modular.case`](case.md). Display name is [`rig.meta.named`](../meta/named.md). Pose in the case is [`rig.spatial.transform`](../spatial/transform.md). A drawn outline is geometry in the document unit; labels are [`rig.media.text`](../media/text.md).

| Field | Type | Meaning |
|-------|------|---------|
| `hp` | int | Faceplate width in horizontal-pitch units |
| `pitchMm` | float | Optional. Millimetres per HP. Absent = 5.08 (Eurocard horizontal pitch) |
| `widthMm` | float | Optional. Finished faceplate width (mm). Absent = unset. `hp` times `pitchMm` is the nominal width, which a host computes |
| `heightMm` | float | Optional. Finished faceplate height (mm). Absent = unset |
| `thicknessMm` | float | Optional. Panel thickness (mm). Absent = unset |
| `depthMm` | float | Optional. Depth from the inside face of the panel to the furthest rear point (mm). Absent = unset |
| `fastener` | enum | Optional. Panel thread. `m3`, `m2-5` (M2.5). Absent = unset |
| `spec` | entity | Optional. Named spec this module claims. Absent = no claim |

Required: `hp`.

`widthMm` is the manufactured width, after the clearance a spec cuts out of `hp * pitchMm`. Store it when the spec or the calipers give it. Do not also store the nominal product.

Jacks are children carrying [`rig.modular.port`](port.md). Current draw is [`rig.modular.power`](power.md) on this entity. The header that draw comes through is a [`rig.circuit.part`](../circuit/part.md) child; each contact is a [`rig.circuit.pin`](../circuit/pin.md). A PCB behind the panel is [`rig.pcb.board`](../pcb/board.md) when the author is describing copper.

`spec` is the same kind of pointer as on the case: a named entity, not a brand baked into the schema id. Published EuroSynth figures: [eurosynth.md](../../docs/eurosynth.md).
