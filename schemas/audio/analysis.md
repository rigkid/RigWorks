---
id: "rig.audio.analysis"
maturity: "draft"
summary: "Request for spectral analysis of an audio stream. Format when present."
fields:
  - name: "source"
    type: "string"
    enum: ["input","asset"]
    required: true
    meaning: "input (live capture) or asset"
  - name: "asset"
    ref: "entity"
    meaning: "Required when source is asset; an entity carrying rig.media.asset_ref"
  - name: "bandCount"
    ref: "int"
    required: true
    meaning: "Number of frequency bands to produce"
  - name: "smoothing"
    type: "number"
    minimum: 0
    maximum: 1
    meaning: "Optional. 0-1; 0 = no smoothing between frames"
  - name: "onsetThreshold"
    ref: "float"
    meaning: "Optional. Absent disables onset detection"
    absent: "disables onset detection"
  - name: "features"
    type: "array"
    itemsType: "string"
    itemsEnum: ["onset","note","beat","color","temperature","centroid","spread","rolloff","flatness","flux","chroma","key","chord"]
    meaning: "Optional. Which live signals to publish: onset, note, beat, color, temperature, centroid, spread, rolloff, flatness, flux, chroma, key, chord. Absent = host default set"
    absent: "host default set"
---
# `rig.audio.analysis`

Request for spectral analysis of an audio stream. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `source` | enum | `input` (live capture) or `asset` |
| `asset` | entity | Required when `source` is `asset`; an entity carrying [`rig.media.asset_ref`](../media/asset-ref.md) |
| `bandCount` | int | Number of frequency bands to produce |
| `smoothing` | float | Optional. 0-1; 0 = no smoothing between frames |
| `onsetThreshold` | float | Optional. Absent disables onset detection |
| `features` | string[] | Optional. Which live signals to publish: `onset`, `note`, `beat`, `color`, `temperature`, `centroid`, `spread`, `rolloff`, `flatness`, `flux`, `chroma`, `key`, `chord`. Absent = host default set |

This describes the analysis to perform, not its results. Band magnitudes, onset flags, MIDI, chroma, `color`, `temperature`, `key`, and `chord` change every frame and are host state - writing them into a document would make every save differ.

`key` is a tonic pitch class (0-11, C = 0, the same numbering as `chroma`) plus a mode. The mode uses the [`rig.music.pattern`](../music/pattern.md) `scale` words: `chromatic`, `major`, `minor`, `dorian`, `pentatonic`.

`chord` is a root pitch class plus `intervals`, semitone offsets from that root. A major triad is `[4, 7]`; a minor triad is `[3, 7]`. Omit `0`. The same `intervals` field is authored on [`rig.music.step`](../music/step.md) and [`rig.music.note`](../music/note.md).

`color` is rgba feedback derived from the spectrum (hue + energy). `temperature` is 0 = cold, 1 = warm (bass vs treble). The same two names are used by [`rig.picture.analysis`](../picture/analysis.md).

Band layout is deliberately unspecified beyond the count. Linear and logarithmic spacing both occur in the wild and neither is right for every use, so two hosts will agree on the request and may disagree on the bands. Do not build a document that depends on an exact band centre frequency.

To drive a property from a band, use [`rig.mod.binding`](../mod/binding.md).
