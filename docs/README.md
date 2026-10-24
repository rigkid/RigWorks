# Docs

The reading order, grouped. Same order as the root [README](../README.md), [llms.txt](../llms.txt), and the site nav - start at the top of a group, not in the middle.

## Why Rig

| Doc | What it settles |
|-----|-----------------|
| [design-philosophy.md](design-philosophy.md) | Future-proof, host-independent, human-readable - the tablet |
| [why-no-code.md](why-no-code.md) | Why a framework with no code, and what it costs |
| [ai-collaboration.md](ai-collaboration.md) | Why shared concepts beat private prompts when models author work |

## Contract

| Doc | What it settles |
|-----|-----------------|
| [terms.md](terms.md) | Contract, fulfillment, host, pack, POD |
| [honors.md](honors.md) | The minimum bar - is it Rig? |
| [ecs.md](ecs.md) | Entity-component conventions |
| [sude.md](sude.md) | Setup / Update / Draw / Exit |
| [ui.md](ui.md) | Optional UI layer over the same data |
| [versioning.md](versioning.md) | SemVer, maturity tiers, and the 1.0 freeze |
| [history.md](history.md) | Release notes, one row per version |
| [gaps.md](gaps.md) | Where the Contract is silent, ambiguous, or wrong |

## Data and exchange

| Doc | What it settles |
|-----|-----------------|
| [interchange.md](interchange.md) | Wire format and the `.rig` / `.rigz` package |
| [properties.md](properties.md) | Portable datatypes |

Schemas live in [`../schemas/`](../schemas/); worked documents in [`../examples/`](../examples/).

## Format mappings

| Doc | Mapping |
|-----|---------|
| [idml.md](idml.md) | IDML to `rig.layout.frame` + layout / story |
| [kicad.md](kicad.md) | KiCad board to `rig.circuit.*` / `rig.pcb.*` |
| [openbim.md](openbim.md) | OpenBIM (IFC / BCF / IDS) to `rig.bim.*` |
| [print.md](print.md) | FGF / pellet to `rig.print.*` |
| [ufo.md](ufo.md) | UFO / GLIF to `rig.font.*` |

## Domain mappings

| Doc | Mapping |
|-----|---------|
| [dev.md](dev.md) | Dev machines to `rig.dev.machine` / `rig.dev.op` |
| [records.md](records.md) | Payments, encounters, catalog rows, and case files |
| [robot.md](robot.md) | Design, simulate, test, and train robots |
| [ros.md](ros.md) | ROS 2 to existing schemas; no `rig.ros2.*` |
| [vr.md](vr.md) | VR to `rig.vr.*` plus camera, transform, and input |

In every mapping, encodings, solvers, and runtimes are fulfillment - the portable side is the schema ids.
