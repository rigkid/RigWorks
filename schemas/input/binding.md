# `rig.input.binding`

One device control mapped onto a logical input. Format when present.

The logical fields live on [`rig.input.buttons`](buttons.md), [`rig.input.axes`](axes.md), and [`rig.input.pointer`](pointer.md) for the same `player`. This component only names the source.

| Field | Type | Meaning |
|-------|------|---------|
| `player` | int | Optional. Player index (0-based); absent = 0 |
| `control` | string | Logical control or action name |
| `device` | enum | `key`, `mouse`, `pad`, `touch` |
| `index` | int | Optional. Device index; absent = 0 |
| `code` | string | Name of the control on that device (`a`, `space`, `left`, `button-0`, `axis-0`, `primary`) |
| `deadzone` | float | Optional. 0-1 axis deadzone; absent = the host default |

Well-known `control` tokens, for the fields on buttons, axes, and pointer: `left`, `right`, `up`, `down`, `o`, `x`, `move-x`, `move-y`, `look-x`, `look-y`, `left-trigger`, `right-trigger`, `pointer-x`, `pointer-y`, `primary`, `secondary`. Any other string is a named action the host implements (`jump`). An unknown action is skipped.

`code` is a token the host understands for `device`. An unknown code is skipped. Several bindings may drive one `control`; the host ORs buttons and takes the latest axis.
