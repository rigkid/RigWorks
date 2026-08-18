# `rig.art.material`

Materials and techniques of a work. Format when present.

Field meanings follow CDWA Materials/Techniques and VRA Core `material` / `technique`.

| Field | Type | Meaning | CDWA / VRA |
|-------|------|---------|------------|
| `medium` | string | Medium (`oil`, `bronze`) | Materials |
| `technique` | string | How it was made (`painting`, `carved`) | Techniques |
| `support` | string | Support (`canvas`, `panel`, `paper`) | Materials — support |

All fields optional. Emit what the source has. An empty component is invalid — attach at least one field.

A combined phrase (`oil on canvas`) may be mapped into `medium` + `support`. Do not dual-author the phrase and the parts.
