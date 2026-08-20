# Dev environments

A development-environment host **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). Provider SDKs, interactive login UX, cache stores, and CLI chrome are fulfillment — the Contract still **names** the portable fields those fulfillments read.

Portable meaning lives on [`rig.dev.machine`](../schemas/dev/machine.md) and [`rig.dev.op`](../schemas/dev/op.md). TypeScript workflow graphs, Dockerfiles, and install scripts stay in the host (or as `x.<vendor>.*` until a second speaker needs the same meaning in the catalog).

## Not these

| Nearby id | Why it is different |
|-----------|---------------------|
| [`rig.audio.bus`](../schemas/audio/bus.md) / [`rig.mod.trigger`](../schemas/mod/trigger.md) | House mute and gated show fires — not a developer machine |
| UI docks / tabs / “workspaces” | Layout chrome — [ui.md](ui.md); fulfillment, not POD |
| Rig **host** | Live program that loads documents ([terms](terms.md)) — not a cloud VM |

## Map

| Idea | Rig field / schema |
|------|--------------------|
| Environment recipe | Entity + [`rig.meta.named`](../schemas/meta/named.md) + [`rig.dev.machine`](../schemas/dev/machine.md) |
| Target class | `kind` — `local` / `vm` / `ci` / `container` |
| Which fulfillment | `provider` — `hyper-v`, `kvm`, `freestyle`, `docker`, `local`, … |
| Stack / guest label | `base` — string hint, not an image digest |
| Auth required | `requiresAuth` — kebab ids; **never** tokens |
| Prepared state pointer | `snapshotRef` — opaque id / URI; blob stays host-side |
| Size hints | `memoryBytes`, `diskBytes`, `cpus` |
| Named ops | [`rig.dev.op`](../schemas/dev/op.md) (`ssh`, `open-editor`, `start`, …) |
| Cache fingerprints | Host only — do not invent `rig.dev.cache` |
| Credentials / login UI | Host only — fulfill `requiresAuth` |

## Fulfillments

| Fulfillment | Role |
|-------------|------|
| **[RigDev](https://github.com/rigkid/RigDev)** | Applies `rig.dev.*` recipes — `hyper-v` and `kvm` (libvirt / **virt-manager**) via `rigdev plan` / `rigdev apply` |
| Freestyle [Rigkit](https://github.com/freestyle-sh/rigkit) | TypeScript workflow / VM providers — another speaker of the same domain when mapped |

Contract examples: [`examples/dev-machine.json`](../examples/dev-machine.json), [`examples/dev-hyperv.json`](../examples/dev-hyperv.json), [`examples/dev-kvm.json`](../examples/dev-kvm.json). Run with RigDev (do not add provider tools to this Contract repo):

```bash
git clone https://github.com/rigkid/RigDev
cd RigDev
node cli.js plan path/to/dev-hyperv.json
node cli.js plan path/to/dev-kvm.json
node cli.js apply path/to/dev-kvm.json --iso /path/to/ubuntu.iso
```

## Sketch

```json
{
  "entities": [
    {
      "id": "agent-smoke",
      "components": {
        "rig.meta.named": { "name": "Agent smoke", "stableId": "agent-smoke" },
        "rig.dev.machine": {
          "kind": "vm",
          "provider": "freestyle",
          "base": "node-22",
          "requiresAuth": ["github"],
          "memoryBytes": 4294967296,
          "cpus": 2
        }
      }
    },
    {
      "id": "op-ssh",
      "components": {
        "rig.meta.named": { "name": "SSH", "stableId": "op-ssh" },
        "rig.dev.op": { "machine": "agent-smoke", "order": 0, "opId": "ssh" }
      }
    }
  ]
}
```

A host that speaks these schemas and ignores the rest of the catalog is fully Rig for this domain — ship what you support.
