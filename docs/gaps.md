# Known gaps

Places the Contract is silent, ambiguous, or wrong. Published deliberately: a vocabulary is only as good as its prose, and [the honest price](why-no-code.md#the-honest-price) of a data framework is that nothing fails to build when the words are unclear.

Items marked **found by** were hit while writing a fulfillment against these documents, not imagined. That is the useful way to generate this list — implement from the prose, and treat every peek at a reference implementation as a bug filed here.

## Music

### No song arrangement

Patterns, lanes, and a sequencer exist, but nothing orders patterns into a song. PICO-8's `__music__` section routes four channels of sfx through ordered frames with loop flags; every tracker has an equivalent. The Contract has no shape for it, so [rigPico8's `p8-to-rig`](https://github.com/rigkid/rigPico8) drops the routing with a warning and re-export emits a fixed single frame.

*Candidate resolution:* a `rig.music.arrangement` (ordered pattern references per channel) once a second sequencer host shows which fields generalize.

**Found by** [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8).

## Contract–host mismatches

Writing a native `.rig` writer for an existing openFrameworks host surfaced schemas whose fields the host could not honestly emit. In each case the component travels as an `x.ofkitty.*` extension instead — no data loss, but no portability either. Listed because each is either a schema smell or a host smell, and the next fulfillment will tell us which.

| Schema | Mismatch |
|--------|----------|
| [`rig.music.pattern`](../schemas/music/pattern.md) | Requires `steps` inline; the host keeps step data outside its pattern component, and its trigger grid packs lanes × steps into one component — mapping it would mean synthesizing one entity per lane. |
| [`rig.music.note`](../schemas/music/note.md) | `start` / `duration` are beats; the host's are clock ticks, and the conversion needs another entity's `ticksPerQuarter`. A per-component codec cannot see it. |
| [`rig.anim.tween`](../schemas/anim/tween.md) | Requires `target` and `propertyKey`; the host binds tweens through callbacks, which do not serialize. The Contract's spelling is the more durable one — this is a host smell. |

Two earlier rows resolved in 0.8.0: `rig.sim.rigidbody` (gravity is now an optional per-body override, so a host with one ambient vector and a `useGravity` bool maps honestly) and `rig.music.midi_input` (`portIndex` joins `portName` — ship whichever identifier the host API exposes).

**Found by** the ofxDocumentKit RigCodec (openFrameworks host, first non-RigKit fulfillment).

## Naming drift

No known drift right now. The table is kept because it keeps refilling: [`why-no-code.md`](why-no-code.md) once carried `timeSigNumerator` against a schema requiring `timeSigNum`, and [`ecs.md`](ecs.md) said `orientation` where [`rig.spatial.transform`](../schemas/spatial/transform.md) says `rotation`. Prose that names a field differently from the grammar teaches readers and models something false.

*Candidate resolution:* extend [`check-schema-parity`](../tools/check-schema-parity/) to flag `rig.*` field names appearing in prose that do not exist in the grammar.

## Resolved

Kept because the fix is the point — each of these was found by implementing, not by review.

| Gap | Found by | Resolved in |
|-----|----------|-------------|
| Union schemas require meaningless fields — a rectangle had to carry `sides` and `innerRadius` | Surveying an ECS host that models each primitive as its own component | 0.5.0 — `rig.geometry.shape` split into eight primitives |
| Sibling order is not portable, so draw order did not survive a round trip | Surveying a vector editor | 0.5.0 — optional `order` on [`rig.spatial.relationship`](../schemas/spatial/relationship.md) |
| A pattern cannot hold more than one lane | Surveying a step sequencer whose pattern component is a 2D grid | 0.5.0 — optional `lane` on [`rig.music.pattern`](../schemas/music/pattern.md) |
| No per-entity visibility — hiding an object was lost on save | Surveying an ECS host's render component | 0.5.0 — [`rig.render.visibility`](../schemas/render/visibility.md) |
| Prose said `timeSigNumerator` where the grammar said `timeSigNum` | Reading the schemas cold | Fixed in [`why-no-code.md`](why-no-code.md) |
| A host could not carry its own components, so adopting `.rig` natively meant dropping data on every save | Planning a native `.rig` writer for an existing ECS host | 0.6.0 — [`x.<vendor>.<name>` extension components](../schemas/document.md#extension-components) |
| The prose promised shared paint entities but nothing could reference one — `fill_stroke` is inline-only | Mapping a host whose fills point at paint entities | 0.7.0 — [`rig.paint.fill`](../schemas/paint/fill.md), [`rig.paint.stroke`](../schemas/paint/stroke.md), [`rig.paint.library`](../schemas/paint/library.md) |
| Pages, artboards, and frames had no id, so multi-page documents flattened on export | Mapping a print-layout host | 0.7.0 — [`rig.layout.page`](../schemas/layout/page.md) |
| Every field was required, so importers invented values (a PICO-8 cart has no note gate) and invented values are indistinguishable from measured ones | [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8) | 0.8.0 — required-field audit: genuinely optional fields are optional with documented defaults, across every schema |
| Colour space was "host-documented" with no field to document it in | Reading the schemas cold | 0.8.0 — `colorSpace` on the [document envelope](../schemas/document.md) |
| A pattern had no playback rate, so per-sfx tracker speeds could not survive | [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8) | 0.8.0 — optional `stepsPerBeat` on [`rig.music.pattern`](../schemas/music/pattern.md) |
| A pattern had no loop range; the importer recovered step counts from a tooling convention | [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8) | 0.8.0 — optional `loopStartStep` / `loopEndStep` on [`rig.music.pattern`](../schemas/music/pattern.md) |
| `waveform` was capped at 7 — one console's limit written into a portable field | [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8) — instrument nibbles were clamped | 0.8.0 — 0–255 on [`rig.music.step`](../schemas/music/step.md); 0–7 stay the portable shapes, 8+ are host instrument slots |
| A tile map could not say where its region sits in a larger host map, so intent was padded away with zeros | [rigPico8 `p8-to-rig`](https://github.com/rigkid/rigPico8) | 0.8.0 — optional `originX` / `originY` on [`rig.pixel.tile_map`](../schemas/pixel/tile-map.md) |
| What happens to a palette index past the end of the palette was not written down | Reading the schemas cold | 0.8.0 — document error; lenient readers render the last entry ([palette.md](../schemas/pixel/palette.md)) |
| `rig.sim.rigidbody` required a per-body gravity vector most engines keep as one ambient constant | The ofxDocumentKit RigCodec | 0.8.0 — `gravity` is an optional per-body override |
| MIDI ports could only be named, but some host APIs number them | The ofxDocumentKit RigCodec | 0.8.0 — `portIndex` on [`rig.music.midi_input`](../schemas/music/midi-input.md) / [`midi_output`](../schemas/music/midi-output.md) |

Sorting that host's inventory is worth recording, because the raw counts overstated the problem. Of roughly 124 components, about 40 already had a Rig id and about 45 were host state the Contract refuses to carry. Growing the catalog in 0.5.0 answered the genuine gaps; the escape hatch in 0.6.0 covers what remains — decorative primitives nobody else would implement, and editor furniture. Two different fixes for two different problems, and taking them in that order kept the vocabulary from absorbing one host's private shapes. 0.7.0 then pulled two things back out of the escape hatch — pages and referenced paints turned out to be Illustrator-and-SVG territory, not one host's furniture — which is how the split is supposed to work: extensions are a holding pen, not a verdict. 0.8.0 pulled out two more (rigidbody and MIDI input, above) and retired the oldest structural complaint on this page by auditing every required list, which is the pattern settling in: each fulfillment empties part of the pen.

## How to add to this list

Implement a host from the prose alone. Every time you cannot answer a question without reading someone else's code, that is an entry.
