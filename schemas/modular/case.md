---
id: "rig.modular.case"
maturity: "draft"
summary: "Rails a modular faceplate mounts in. Format when present."
fields:
  - name: "hp"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/int\",\"minimum\":1}"
    required: true
    meaning: "Rail capacity in horizontal-pitch units"
  - name: "pitchMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"exclusiveMinimum\":0}"
    meaning: "Optional. Millimetres per HP. Absent = 5.08 (Eurocard horizontal pitch)"
    absent: "5.08 (Eurocard horizontal pitch)"
  - name: "widthMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Finished opening width (mm). Absent = unset. hp times pitchMm is the nominal width, which a host computes"
    absent: "unset"
  - name: "rows"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/int\",\"minimum\":1}"
    meaning: "Optional. Module rows. Absent = 1"
    absent: "1"
  - name: "rowHeightMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Clear height of one row (mm). Absent = unset"
    absent: "unset"
  - name: "depthMm"
    schemaJson: "{\"$ref\":\"./_defs.schema.json#/$defs/float\",\"minimum\":0}"
    meaning: "Optional. Usable depth behind the rails (mm). Absent = unset"
    absent: "unset"
  - name: "fastener"
    type: "string"
    enum: ["m3","m2-5"]
    meaning: "Optional. Rail thread. m3, m2-5 (M2.5). Absent = unset"
    absent: "unset"
  - name: "spec"
    ref: "entity"
    meaning: "Optional. Named spec this case claims. Absent = no claim"
    absent: "no claim"
---
# `rig.modular.case`

Rails a modular faceplate mounts in. Format when present.

This is the chassis opening: how many HP it holds, which thread the rails use, and how deep a module may be. It is not [`rig.print.machine`](../print/machine.md), not [`rig.dev.machine`](../dev/machine.md), and not [`rig.pcb.board`](../pcb/board.md).

| Field | Type | Meaning |
|-------|------|---------|
| `hp` | int | Rail capacity in horizontal-pitch units |
| `pitchMm` | float | Optional. Millimetres per HP. Absent = 5.08 (Eurocard horizontal pitch) |
| `widthMm` | float | Optional. Finished opening width (mm). Absent = unset. `hp` times `pitchMm` is the nominal width, which a host computes |
| `rows` | int | Optional. Module rows. Absent = 1 |
| `rowHeightMm` | float | Optional. Clear height of one row (mm). Absent = unset |
| `depthMm` | float | Optional. Usable depth behind the rails (mm). Absent = unset |
| `fastener` | enum | Optional. Rail thread. `m3`, `m2-5` (M2.5). Absent = unset |
| `spec` | entity | Optional. Named spec this case claims. Absent = no claim |

Required: `hp`.

`spec` points at an entity whose [`rig.meta.named`](../meta/named.md) `stableId` names the published spec (`eurosynth`). The electrical and mechanical numbers still live on this case, its rails, and its modules. Two hosts compare those numbers. EuroSynth and Eurorack both use a 5.08 mm HP; the difference is which numbers an author writes - [eurosynth.md](../../docs/eurosynth.md).

A module is a child ([`rig.spatial.relationship`](../spatial/relationship.md)) carrying [`rig.modular.module`](module.md). A supply rail is a child carrying [`rig.modular.rail`](rail.md).
