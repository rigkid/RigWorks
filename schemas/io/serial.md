---
id: "rig.io.serial"
maturity: "draft"
summary: "Byte buffers and device handles stay in code packs."
fields:
  - name: "port"
    ref: "string"
    required: true
    meaning: "Device path / name"
  - name: "baud"
    ref: "int"
    meaning: "Optional. Baud rate; absent = 9600"
    absent: "9600"
  - name: "enabled"
    ref: "bool"
    meaning: "Optional. Open when true; absent = false"
    absent: "false"
---
# `rig.io.serial`

| Field | Type | Meaning |
|-------|------|---------|
| `port` | string | Device path / name |
| `baud` | int | Optional. Baud rate; absent = 9600 |
| `enabled` | bool | Optional. Open when true; absent = false |

Byte buffers and device handles stay in code packs.
