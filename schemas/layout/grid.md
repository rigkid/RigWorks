# `rig.layout.grid`

Document baseline grid and column defaults. Format when present. One entity per document.

The grid is anchored to each page: `baselineStart` measures down from the page's top margin, then baselines repeat every `baselineIncrement`. The grid alone moves nothing - text opts in per [`rig.layout.paragraph_style`](paragraph-style.md) via `alignToBaselineGrid` (and `baselineGridFirstLineOnly` for headings that register only their first line).

| Field | Type | Meaning |
|-------|------|---------|
| `baselineEnabled` | bool | Optional. Absent = `true` |
| `baselineStart` | float | Optional. Offset from the top margin to the first baseline, in points. Absent = `0` |
| `baselineIncrement` | float | Optional. Baseline spacing in points. Absent = host default (typically the body leading) |
| `baselineViewThreshold` | float | Optional. Advisory: minimum zoom before a host draws the grid on screen. Not print data |
| `columns` | int | Optional. Default column count for page text areas. Absent = `1` |
| `gutter` | float | Optional. Column gutter in points |

Snapping quantises line positions to the next grid slot, so `spaceBefore` / `spaceAfter` round up rather than land exactly. Frames and masters do not carry their own grids - one rhythm per document.
