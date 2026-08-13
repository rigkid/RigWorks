# `rig.paint.solid`

Shared solid paint (optional library entity).

| Field | Type | Meaning |
|-------|------|---------|
| `rgba` | vec4 | 0–1 |
| `cmyk` | vec4 | Optional print quad; (0,0,0,0) = unused |
| `ink` | string | Optional Separation colorant name. Empty / absent = process (or RGB-only) paint. Non-empty = named ink for print; `rgba` / `cmyk` stay the AlternateSpace preview. |
| `overprintFill` | bool | Optional. Non-stroking overprint (`op`); absent = false |
| `overprintStroke` | bool | Optional. Stroking overprint (`OP`); absent = false |

Display labels stay on [`rig.meta.named`](../meta/named.md) — compose it; do not put `name` here. `ink` is the press colorant id (may match the display name). When either overprint flag is true, emitters should also set overprint mode (`OPM` 1).

Inline draw colour also lives on [`rig.paint.fill_stroke`](fill-stroke.md). Use this schema when several entities share one paint entity — drawables point at it with [`rig.paint.fill`](fill.md) / [`rig.paint.stroke`](stroke.md), and [`rig.paint.library`](library.md) lists it as a swatch.
