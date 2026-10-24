import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "tools/rig-validate/cli.js");
const fix = (...parts) => path.join(root, "tools/test/fixtures/validate", ...parts);

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    cwd: root,
  });
}

describe("rig-validate", () => {
  it("accepts a valid document", () => {
    const r = run([fix("ok.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /^ok /m);
  });

  it("errors on dangling entity refs", () => {
    const r = run([fix("dangling-ref.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /entity reference "missing"/);
  });

  it("allows null entity refs", () => {
    const r = run([fix("null-parent.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
  });

  it("errors on duplicate entity ids", () => {
    const r = run([fix("duplicate-id.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /duplicate entity id/);
  });

  it("warns on unknown schema ids without --strict", () => {
    const r = run([fix("unknown-schema.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\[warn\].*unknown schema id/);
  });

  it("errors on unknown schema ids with --strict", () => {
    const r = run(["--strict", fix("unknown-schema.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /\[error\].*unknown schema id/);
  });

  it("carries x.<vendor>.<name> extension components without failing", () => {
    const r = run([fix("extension-component.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\[note\].*extension component "x\.acme\.flower_of_life"/);
  });

  // The point of the namespace is that a host can adopt .rig natively, which
  // only works if --strict stays clean.
  it("still passes --strict with extension components present", () => {
    const r = run(["--strict", fix("extension-component.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\[note\].*not portable/);
  });

  it("rejects a malformed extension key", () => {
    const r = run([fix("bad-extension-key.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /property name must be valid/);
  });

  it("warns when document targets a newer version", () => {
    const r = run([fix("future-version.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\[warn\].*9\.9\.9/);
  });

  it("fails on malformed JSON", () => {
    const r = run([fix("bad.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stderr + r.stdout, /cannot parse JSON/);
  });

  it("prints help", () => {
    const r = run(["--help"]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /init <name>/);
  });

  it("init writes a valid scene.rig", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rig-init-"));
    const name = path.join(dir, "my-scene");
    try {
      const r = run(["init", name]);
      assert.equal(r.status, 0, r.stderr + r.stdout);
      const dest = path.join(name, "scene.rig");
      assert.equal(fs.existsSync(dest), true);
      const v = run(["--strict", dest]);
      assert.equal(v.status, 0, v.stderr + v.stdout);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("init refuses to overwrite", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rig-init-"));
    const name = path.join(dir, "my-scene");
    try {
      assert.equal(run(["init", name]).status, 0);
      const r = run(["init", name]);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /refusing to overwrite/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("suggests corrections for unknown schema ids", () => {
    const r = run(["--strict", fix("unknown-typo.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /did you mean "rig\.paint\.fill"/);
  });

  it("reports each fault once (envelope and per-component passes dedupe)", () => {
    const r = run([fix("semantic-rectangle-negative.json")]);
    assert.equal(r.status, 1);
    const widthErrors = r.stdout.split("\n").filter((l) => l.includes("rig.geometry.rectangle/width"));
    assert.equal(widthErrors.length, 1, r.stdout);
  });

  it("errors on a negative rectangle width", () => {
    const r = run([fix("semantic-rectangle-negative.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /must be >= 0/);
  });

  it("errors when inline and referenced fill are both carried", () => {
    const r = run([fix("semantic-paint-conflict.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /choose one spelling/);
  });

  it("errors on a parent cycle", () => {
    const r = run([fix("semantic-parent-cycle.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /parent cycle detected: a -> b -> a/);
  });

  it("errors on duplicate stableId values", () => {
    const r = run([fix("semantic-duplicate-stableid.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /duplicate stableId "same"/);
  });

  it("errors on a non-unit quaternion", () => {
    const r = run([fix("semantic-nonunit-quat.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /unit quaternion/);
  });

  it("errors when a required composition is missing", () => {
    const r = run([fix("semantic-depth-no-camera.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /rig\.sensor\.depth composes rig\.spatial\.camera/);
  });

  it("errors on an inverted ring", () => {
    const r = run([fix("semantic-ring-inverted.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /innerRadius \(40\) must be smaller than outerRadius \(30\)/);
  });

  it("errors on an axis whose min is not below its max", () => {
    const r = run([fix("semantic-axis-range.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /axis min \(900\) must be smaller than max \(100\)/);
  });

  it("errors on a span that ends before it starts", () => {
    const r = run([fix("semantic-span-reversed.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /endDate \(2026-05-01\) is before startDate \(2026-05-10\)/);
  });

  it("errors on decreasing spline knots", () => {
    const r = run([fix("semantic-knots.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /spline knots must be non-decreasing/);
  });

  it("errors on out-of-order gradient stops", () => {
    const r = run([fix("semantic-gradient-stops.json")]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /gradient stop offsets must be non-decreasing/);
  });

  it("notes experimental schema ids without failing", () => {
    const r = run(["--strict", fix("experimental-id.json")]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\[note\].*experimental schema id "rig\.pcb\.keepout"/);
  });

  it("validates a .rigz package", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rigz-"));
    try {
      const dest = path.join(dir, "scene.rigz");
      fs.writeFileSync(
        dest,
        writeStoreZip([
          { name: "document.rig", data: fs.readFileSync(fix("ok.json")) },
          { name: "data/", data: Buffer.alloc(0) },
          { name: "data/note.txt", data: Buffer.from("sidecar") },
        ])
      );
      const r = run(["--strict", dest]);
      assert.equal(r.status, 0, r.stderr + r.stdout);
      assert.match(r.stdout, /^ok /m);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("warns when .rigz has no data/ folder", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rigz-"));
    try {
      const dest = path.join(dir, "scene.rigz");
      fs.writeFileSync(
        dest,
        writeStoreZip([{ name: "document.rig", data: fs.readFileSync(fix("ok.json")) }])
      );
      const r = run([dest]);
      assert.equal(r.status, 0, r.stderr + r.stdout);
      assert.match(r.stdout, /\[warn\].*data\/ folder/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects a .rigz with no root .rig", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rigz-"));
    try {
      const dest = path.join(dir, "scene.rigz");
      fs.writeFileSync(
        dest,
        writeStoreZip([{ name: "data/note.txt", data: Buffer.from("x") }])
      );
      const r = run([dest]);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /cannot open \.rigz/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

function crc32(u8) {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) {
    c ^= u8[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeStoreZip(files) {
  const localParts = [];
  const cdParts = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(f.name, "utf8");
    const data = Buffer.from(f.data);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(name.length, 28);
    cd.writeUInt32LE(offset, 42);
    localParts.push(local, name, data);
    cdParts.push(cd, name);
    offset += 30 + name.length + data.length;
  }
  const cdBuf = Buffer.concat(cdParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, cdBuf, eocd]);
}
