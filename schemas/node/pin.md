# `rig.node.pin`

Pin on a [`rig.node.node`](node.md).

| Field | Type | Meaning |
|-------|------|---------|
| `id` | uint | Stable id within the node |
| `name` | string | Pin label (may carry domain hint, e.g. `rgba`) |
| `kind` | enum | `in`, `out` |
| `type` | string | **Property datatype id** - see [properties](../../docs/properties.md) |
| `bus` | uint | Optional. [`rig.node.bus`](bus.md) this pin taps; absent = none. An `out` pin drives the bus; an `in` pin reads it |

## `type` vocabulary

Same table as portable property descriptors:

`bool`, `int`, `uint`, `float`, `double`, `string`, `vec2`, `vec3`, `vec4`, `quat`, `entity`, `enum`

Colour is **`vec4`**, not a separate type - domain lives in `name` (e.g. `rgba`) or the catalog node id. Hosts may draw a colour control for a `vec4` pin named `rgba`.

Empty `type` = untyped wildcard (link to anything). Prefer concrete types.

Hosts may add **prefixed** ids (`host.foo`). Do not invent unprefixed extras (`color`, `any`, ...).

## Linking

Exact `type` match always links. Hosts may allow documented coercions at eval (e.g. `float` to `vec2` / `vec4`) - that is fulfillment, not Contract.

A pin that taps a [`bus`](bus.md) follows the same rules: pin `type` matches bus `type`, coercions are host policy, and an `in` pin with a bus is not also a link target - one source per input.
