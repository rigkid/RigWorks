# `rig.clinic.study`

One imaging study or series. Format when present.

Field meanings follow DICOM Study / Series Instance UID. This schema is those identifiers - not a DICOM file, and not the pixels.

| Field | Type | Meaning |
|-------|------|---------|
| `subject` | entity | Person (or other) the images are of |
| `studyUid` | string | Study Instance UID |
| `seriesUid` | string | Optional. Series Instance UID |
| `modality` | string | Optional. DICOM modality as written (`CT`, `MR`) |
| `asset` | entity | Optional. Image or document [`rig.media.asset_ref`](../media/asset-ref.md) |

`subject` and `studyUid` are required.

Another series is another entity with the same `studyUid`. Pixels stay on the asset file. Do not invent a pixel buffer here.
