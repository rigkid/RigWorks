# `rig.visualizer.deck`

Preset deck: which assets play, where they draw, and what may advance them. Format when present.

| Field | Type | Meaning |
|-------|------|---------|
| `presets` | entity[] | Optional. Playlist of [`rig.media.asset_ref`](media/asset-ref.md) entities (`kind` `preset`). Path and file format live on the asset |
| `index` | int | Optional. Current playlist entry; 0 if absent |
| `playing` | bool | Optional. Advance the deck; absent = true |
| `shuffle` | bool | Optional. Pick the next preset at random; absent = true |
| `lockPreset` | bool | Optional. Hold `index`; absent = false |
| `presetDuration` | float | Optional. Seconds on one preset when `switchOn` is `time` |
| `transitionDuration` | float | Optional. Crossfade seconds |
| `switchOn` | enum | Optional. What may advance the deck: `time`, `onset`, `beat`, `note`. Absent = `time` |
| `analysis` | entity | Optional. [`rig.audio.analysis`](audio/analysis.md) to read. Absent = the host audio bus |
| `output` | entity | Optional. [`rig.pixel.canvas`](pixel/canvas.md) (or raster) the present pack draws into |

A present pack claims playlist entries it understands and ignores the rest. MilkDrop mesh size and hardcut stay in that leaf - they are not fields here.

Live main color and temperature of `output` are host cache from [`rig.picture.analysis`](picture/analysis.md) pointed at that canvas. Do not store them on this component.
