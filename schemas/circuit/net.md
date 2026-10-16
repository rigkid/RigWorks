# `rig.circuit.net`

Electrical net marker. Format when present - presence means this entity is one net (a set of things at the same potential).

No fields. Compose [`rig.meta.named`](../meta/named.md) for the net name (`GND`, `/SDA`). Members point at the net through their own `net` field: [`rig.circuit.pin`](pin.md), [`rig.pcb.track`](../pcb/track.md), [`rig.pcb.via`](../pcb/via.md), [`rig.pcb.zone`](../pcb/zone.md).

Do not store a member list here - that would be a second copy of the `net` fields. Net numbers in a file encoding (KiCad `(net 3 "GND")`) are encoding, renumbered on write; they are not portable. Connectivity islands and ratsnest lines are host caches.
