---
id: "rig.paint.mask"
maturity: "stable"
summary: "Mask a drawable with another graphic. Format when present."
fields:
  - name: "source"
    ref: "entity"
    required: true
    meaning: "Path, group, or image used as the mask"
  - name: "channel"
    type: "string"
    enum: ["luminance","alpha"]
    meaning: "Optional. luminance or alpha. Absent = luminance"
    absent: "luminance"
---
# `rig.paint.mask`

Mask a drawable with another graphic. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | entity | Path, group, or image used as the mask |
| `channel` | enum | Optional. `luminance` or `alpha`. Absent = `luminance` |

Compose on the drawable. The source stays on its own entity. A path clip (hard inside / outside) is [`rig.paint.clip`](clip.md).
