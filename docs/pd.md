# Pure Data

A Pure Data patch, and a Max patch, are encodings. A host **is Rig** when it emits entities with POD components keyed by schema ids it supports ([honors](honors.md)). There is no `rig.pd.*` layer and no `rig.max.*` layer. Portable meaning is the [node graph](../schemas/node/graph.md), plus [`rig.music.*`](../schemas/music/transport.md) and [`rig.audio.*`](../schemas/audio/voice.md) when the patch is about time or sound. A subtractive voice inside the patch is [`rig.synth.*`](../schemas/synth/oscillator.md) - [music.md](music.md). Product names stay out of schema ids (same rule as [`rig.music.clock`](../schemas/music/clock.md)). Patcher-only fields travel as `x.pd.*` or `x.max.*`.

`.pd` and `.maxpat` stay the source files. The Contract does not inline either language.

## Map

| Patch | Rig |
|-------|-----|
| Object box | [`rig.node.node`](../schemas/node/node.md). `typeId` is the host catalog key. `title` may carry the box text. Creation arguments are [`rig.node.param`](../schemas/node/param.md) |
| Inlet / outlet | [`rig.node.pin`](../schemas/node/pin.md). `kind` is `in` or `out`. `type` is a property datatype (`float`, `vec2`, ...), which is the value, not the rate |
| Cord | [`rig.node.link`](../schemas/node/link.md) |
| Signal cord and message cord | The same link. The rate belongs to the catalog entry for `typeId` (in Pure Data the tilde is part of the object). Do not add a rate field on the pin |
| Bang | A message with no stored payload. The firing stays in the host, with the other live cord values |
| send / receive, throw~ / catch~ | [`rig.node.bus`](../schemas/node/bus.md) |
| Subpatch | A node with `nested`, and [`rig.node.publish`](../schemas/node/publish.md) for the inlets that show on the outside |
| Abstraction file | [`rig.media.asset_ref`](../schemas/media/asset-ref.md) the host loads |
| Box on the canvas | `position` on the node. It travels. It is not a world transform |
| Selection, cord readouts | Host state |
| metro, tempo, transport | [`rig.music.transport`](../schemas/music/transport.md) and [`rig.music.clock`](../schemas/music/clock.md). One `bpm`. Do not keep a second tempo in a node param |
| notein / noteout / ctlin | [`rig.music.midi_input`](../schemas/music/midi-input.md) / [`midi_output`](../schemas/music/midi-output.md) are endpoints. Authored notes are [`rig.music.note`](../schemas/music/note.md). The queue this instant stays in the host |
| dac~ / adc~ | A node the host binds to [`rig.audio.voice`](../schemas/audio/voice.md), [`rig.audio.bus`](../schemas/audio/bus.md), or capture. The device is not a schema |
| osc~ | [`rig.synth.oscillator`](../schemas/synth/oscillator.md) when it is the tone. The Hz argument stays on the node. An LFO stays [`rig.mod.lfo`](../schemas/mod/lfo.md). A box that is only a patcher object keeps a catalog `typeId` |
| lop~ / hip~ / bp~ / vcf~ | [`rig.synth.filter`](../schemas/synth/filter.md). The cutoff argument stays on the node |
| *~ | [`rig.synth.amplifier`](../schemas/synth/amplifier.md) when that multiply is the level stage. The right-hand argument stays on the node |
| line~ / vline~ | The ramps a patch uses to open a level. Four times written as a voice stay [`rig.synth.envelope`](../schemas/synth/envelope.md) |

How a player names a key or a chord is [music.md](music.md). That page is the part. This page is the patch.

## Round trip

A `.pd` file makes the trip a KiCad board makes. The text stays the source. The document a host loads is the graph.

1. Import `voice.pd` to a `.rigz`. The original file sits at `data/voice.pd`. The graph entity carries a [`rig.media.asset_ref`](../schemas/media/asset-ref.md) (`kind` `document`) whose `path` is `voice.pd`.
2. The patch is one [`rig.node.graph`](../schemas/node/graph.md). Each `#X obj`, `#X msg`, atom, and comment is a node, in file order. `typeId` is the first token (`osc~`, `*~`, `lop~`). `title` is the box text from that token through the arguments (`osc~ 65.41`). `position` is the box x y. Node `id` is that canvas index, the number `#X connect` writes, counting every box on the canvas. A nested canvas is a node with `nested`, and its indices start again at 0.
3. Pin `id` is unique on that node. Pin `name` is the inlet or outlet number (`"0"`, `"1"`). `kind` says which. A link stores those pin ids. `#X connect a b c d` is node `a` outlet `b` to node `c` inlet `d`.
4. Edit in any Rig host. Move a box, change `title`, rewire a cord, add a node.
5. Export by merging onto `voice.pd`:
   - A node whose id is still a canvas index rewrites that box's position and `title`. Colors, fonts, labels, and the other tokens on a GUI box stay as they were.
   - An index with no node was deleted. Drop that box.
   - A node whose id is not an index yet is new. Append it.
   - Write `#X connect` from the links. After a deletion the file's indices are dense again. The document keeps its node ids. The writer maps id to the emitted index.
   - `#N canvas` size and font, arrays, and graph-on-parent stay in the source file.

Without the original file, a writer still emits a valid `.pd` from the graph. Canvas size, font, and GUI chrome use Pure Data's defaults.

A voice authored as [`rig.synth.*`](../schemas/synth/oscillator.md) loads without a patch ([`examples/synth-voice.json`](../examples/synth-voice.json)). A writer can print a fresh `.pd` from those blocks: `osc~`, `lop~` or `vcf~`, `*~`, and `line~` for the ramps. The writer prints Hz on the box, converted from the oscillator's MIDI `pitch`. The document keeps the MIDI number.

A worked patch, cosine into a low-pass into a level into `dac~`: [`examples/pd-voice.json`](../examples/pd-voice.json).

Max is the same graph. A `.maxpat` writer merges onto that JSON, matching the box id the file already stores.

## Other graphs

Do not merge these into `rig.node.*`. See [Grouping graphs](../schemas/README.md#grouping-graphs-do-not-merge).

| Idea | Rig |
|------|-----|
| Eurorack / EuroSynth jack | [`rig.modular.port`](../schemas/modular/port.md) - [eurosynth.md](eurosynth.md) |
| Subtractive voice | [`rig.synth.oscillator`](../schemas/synth/oscillator.md), [`filter`](../schemas/synth/filter.md), [`amplifier`](../schemas/synth/amplifier.md), [`envelope`](../schemas/synth/envelope.md) - [music.md](music.md) |
| ROS 2 node | A named entity. Not a patcher node - [ros.md](ros.md) |
| Circuit terminal | [`rig.circuit.pin`](../schemas/circuit/pin.md) |

A worked graph, two boxes and one cord: [`examples/node-graph.json`](../examples/node-graph.json). A worked `.pd` voice: [`examples/pd-voice.json`](../examples/pd-voice.json).
