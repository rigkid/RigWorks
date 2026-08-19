# `rig.document`

JSON document envelope for Rig interchange. Format when present as a file or payload.

This is the **Contract wire format** (JSON). Field meaning remains POD; vectors and quats are JSON number arrays. Hosts may use other encodings internally — portable emission targets this envelope.

## Root

| Field | Type | Meaning |
|-------|------|---------|
| `rig` | string | Contract version this document targets (`MAJOR.MINOR.PATCH`) |
| `document` | object | Optional metadata (`title`, `author`, `createdAt`, `modifiedAt`, `defaultUnit`, `colorSpace`, `timeZone`, `ifcSchema`, `pdfX`, `outputCondition`, `trapped`, …) |
| `entities` | entity[] | Scene / graph contents |

`colorSpace` names the colour space every `rgba` / `rgb` value in the file is expressed in; absent = `srgb`. One key for the whole document — per-component colour spaces do not exist.

`defaultUnit` is the scene length unit (`"mm"`, `"px"`, `"in"`, …) for transform, geometry, and stroke. A [`rig.layout.page`](layout/page.md) may override with `unit`. Ratios stay 0–1 — [Measurements](README.md#measurements).

## Axes

One convention for the file. A host with another convention converts at the edge — same bargain as `colorSpace`.

- **2D page / geometry:** +X right, +Y down. Rectangle `y` is the top edge.
- **3D:** right-handed, +Y up. Camera and directional / spot light look along local −Z.

`timeZone` is an IANA id (e.g. `Australia/Sydney`) for wall-clock calendar fields ([`rig.calendar.*`](calendar/weekly.md)). Absent = host local. Do not put NTP hour offsets here — those are a host cache of “now” and break across DST.

`ifcSchema` is the IFC release this document was derived from (`ifc2x3` / `ifc4` / `ifc4x3`). Absent = not an IFC-derived document. Portable BIM meaning lives on [`rig.bim.*`](bim/classify.md); `.ifc` files are a host mapping — [openbim.md](../docs/openbim.md).

Print-job keys (optional):

| Field | Meaning |
|-------|---------|
| `pdfX` | PDF/X identification string (e.g. `PDF/X-4`). Empty / absent = not a PDF/X job. |
| `outputCondition` | OutputIntent `OutputConditionIdentifier` (e.g. `FOGRA39`). |
| `trapped` | `unknown` / `true` / `false` — PDF Info `Trapped`; absent = `unknown`. |

An ICC `DestOutputProfile` is a host file / asset path at emit time — not a portable envelope blob.

## Entity

| Field | Type | Meaning |
|-------|------|---------|
| `id` | string | Stable within this file. Fields typed `entity` reference these ids (or `null` for none). |
| `components` | map | Keys are schema ids `rig.<domain>.<name>`, or `x.<vendor>.<name>` for host components — see below. Values match that schema’s serializable fields. |

## Rules

- Component keys **must** be catalog schema ids — not host type names (`Transform`) and not C++ class names.
- Serialize only portable fields listed on each schema. Omit host caches (Euler, world matrix, selection state, dirty flags, GPU handles).
- Unknown `rig.*` schema ids: validators **warn** by default; fail with `--strict`.
- Being Rig means speaking this envelope: entities with POD components keyed by schema ids — see [honors.md](../docs/honors.md). The envelope *is* the portable composition. Live hosts also honor [SUDE](../docs/sude.md) and runtime [ECS](../docs/ecs.md) conventions.

## Extension components

A key matching `x.<vendor>.<name>` carries a component the Contract has not named. Validators pass the payload through unchecked and report it — including under `--strict`, where it is a note rather than a failure.

```json
"components": {
  "rig.spatial.transform": { "position": [0, 0, 0], "rotation": [0, 0, 0, 1], "scale": [1, 1, 1] },
  "x.acme.flower_of_life": { "radius": 40, "rings": 3 }
}
```

This exists because "ship what you support" previously worked in one direction only: a host could implement part of Rig, but could not carry anything Rig had not named. A real host has more component types than the catalog has ids, so without an escape hatch it keeps a private format alongside `.rig` — the outcome the Contract exists to prevent.

The bargain is explicit. Extensions **travel**; they do not **port**. Another host will preserve them across a round trip if it is careful, and will not understand them. Nothing in the Contract gives `x.*` meaning, and no validator will ever check one.

So the namespace is a place to put what is genuinely yours, not a way to avoid the catalog:

- Reach for a `rig.*` id first. If a concept is portable, it belongs in the vocabulary, and the catalog grows when a real host needs it.
- `<vendor>` should identify who owns the meaning — an app, an org, a pack.
- Do not mirror a Contract component under `x.*` to add one field. That splits the meaning across two keys and no reader will merge them.
- Runtime state stays out. An extension is still POD you meant to save, not a cache with a new prefix.

Machine grammar: [`schemas/json/rig.document.schema.json`](json/rig.document.schema.json).

See [docs/interchange.md](../docs/interchange.md) for RigKit `.rig` key mapping.
