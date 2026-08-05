import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
});
