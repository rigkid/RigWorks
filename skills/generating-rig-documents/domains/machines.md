# Machines - circuits, PCB, print, dev, I/O

Load for: KiCad boards, circuits, FGF/pellet print, dev machines, OSC/serial/DMX/sACN, sensors as hardware endpoints, EuroSynth / Eurorack faceplates. Parent slice: [`SKILL.md`](../SKILL.md). Copy: [`examples/kicad-pcb.json`](../../../examples/kicad-pcb.json), [`examples/eurosynth.json`](../../../examples/eurosynth.json), [`examples/print-fgf.json`](../../../examples/print-fgf.json), [`examples/dev-machine.json`](../../../examples/dev-machine.json), [`examples/dev-kvm.json`](../../../examples/dev-kvm.json), [`examples/paint-brush.json`](../../../examples/paint-brush.json), [`examples/show-control.json`](../../../examples/show-control.json), [`examples/esp-radio.json`](../../../examples/esp-radio.json). Mappings: [`docs/kicad.md`](../../../docs/kicad.md), [`docs/eurosynth.md`](../../../docs/eurosynth.md), [`docs/print.md`](../../../docs/print.md), [`docs/dev.md`](../../../docs/dev.md).

## Compose

| Want | Compose |
|---|---|
| A part with terminals | `rig.circuit.part`; each terminal is one entity: `rig.circuit.pin` (+ `rig.pcb.pad` on a board) |
| A net | `rig.circuit.net` marker; members point at it with `net` - the net holds no member list |
| A board | `rig.pcb.board`; layers join through `rig.pcb.layer_set` (`layers`), not `parent`; also `rig.pcb.layer`, `footprint`, `track`, `via`, `zone`, `keepout` |
| A print job | `rig.print.machine` / `material` / `process` / `compression`; the job is `rig.print.job` pointing at `rig.media.asset_ref` entities |
| A dev machine recipe | `rig.dev.machine` with `rig.dev.op` steps |
| Show-control endpoints | `rig.io.osc`, `rig.io.serial`, `rig.io.sacn`, `rig.io.dmx`; a DMX fixture is `rig.dmx.fixture`; an LED map is `rig.led.uv_map` |
| A board radio | `rig.io.wifi` (mode, SSIDs, channel). Password, link, and RSSI stay host cache. ESP-NOW is `rig.io.espnow`; `espnow.send` is the action. Classic Bluetooth audio is `rig.io.bluetooth` plus `rig.meta.named` |
| A live hardware line | `rig.sensor.gpio` (link a part terminal with `terminal`) |
| A module case and faceplate | `rig.modular.case` and `rig.modular.module`; outline is geometry, labels are `rig.media.text` |
| A patch jack | `rig.modular.port`; bushing colour is paint. Draw is `rig.modular.power`; a supply limit is `rig.modular.rail` |
| A power header | `rig.circuit.part` with `rig.circuit.pin` children; `rig.modular.power` `header` names the connector |

## Guards

- No `rig.kicad.*` and no second pin schema. A part terminal is not `rig.sensor.gpio` (a live line) and not `rig.node.pin` (a patcher socket). Zone fills, net numbers, and ratsnest are host caches. Round trip merges onto the source `.kicad_pcb` file.
- No `rig.print.gcode`. No host paths or last-slice status on `rig.print.job`. Print is not envelope `pdfX`, not `rig.dev.machine`, and not a layout page.
- OSC/serial endpoints are authored config; sockets and queues are host runtime. `rig.io.osc` covers UDP, TCP (`tcpListen`/`tcpPort`/`tcpConnect`/`streamFraming`), and multicast (`multicastGroup`/`multicastTtl`).
- Wi-Fi, ESP-NOW, and Classic Bluetooth are authored config. Passwords, link state, RSSI, pending sends, pairing, and PCM stay host cache. ESP32-S3 has no Classic Bluetooth. BLE is not `rig.io.bluetooth`.
- No `rig.eurosynth.*` and no `rig.eurorack.*`. A patch jack is not `rig.circuit.pin`, not `rig.node.pin`, not `rig.sensor.gpio`, and not `rig.mod.trigger`. Live jack voltage stays host cache. Omitted rail current is unset, not 0. Chassis and 0V are two nets. Figures: [`docs/eurosynth.md`](../../../docs/eurosynth.md).

## Ids in this slice

`rig.circuit.part`, `rig.circuit.pin`, `rig.circuit.net`, `rig.pcb.board`, `rig.pcb.layer`, `rig.pcb.layer_set`, `rig.pcb.footprint`, `rig.pcb.pad`, `rig.pcb.track`, `rig.pcb.via`, `rig.pcb.zone`, `rig.pcb.keepout`, `rig.print.machine`, `rig.print.material`, `rig.print.process`, `rig.print.compression`, `rig.print.job`, `rig.dev.machine`, `rig.dev.op`, `rig.io.osc`, `rig.io.wifi`, `rig.io.espnow`, `rig.io.bluetooth`, `rig.io.serial`, `rig.io.sacn`, `rig.io.dmx`, `rig.dmx.fixture`, `rig.led.uv_map`, `rig.sensor.gpio`, `rig.modular.case`, `rig.modular.module`, `rig.modular.port`, `rig.modular.power`, `rig.modular.rail`
