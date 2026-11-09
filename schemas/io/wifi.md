---
id: "rig.io.wifi"
maturity: "draft"
summary: "Wi-Fi radio mode for one interface. Format when present. The join password is host-only."
fields:
  - name: "mode"
    type: "string"
    enum: ["off", "ap", "sta", "ap-sta"]
    meaning: "Optional. off, ap, sta, or ap-sta. Absent = off"
    absent: "off"
  - name: "apSsid"
    ref: "string"
    meaning: "Optional. Access-point name. Absent = the host default"
    absent: "the host default"
  - name: "staSsid"
    ref: "string"
    meaning: "Optional. Network to join when mode is sta or ap-sta. Absent = none"
    absent: "none"
  - name: "channel"
    type: "integer"
    minimum: 1
    maximum: 14
    meaning: "Optional. 2.4 GHz channel 1-14. Absent = the interface default"
    absent: "the interface default"
---
# `rig.io.wifi`

Wi-Fi radio mode for one interface. Format when present. The join password is host-only.

| Field | Type | Meaning |
|-------|------|---------|
| `mode` | enum | Optional. `off`, `ap`, `sta`, or `ap-sta`. Absent = `off` |
| `apSsid` | string | Optional. Access-point name. Absent = the host default |
| `staSsid` | string | Optional. Network to join when `mode` is `sta` or `ap-sta`. Absent = none |
| `channel` | int | Optional. 2.4 GHz channel 1-14. Absent = the interface default |

`connected`, the address, and RSSI are host cache. The STA password is not a field: a host may keep it in local storage and must not write it into the document.
