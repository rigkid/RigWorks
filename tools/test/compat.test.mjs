import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "tools/rig-validate/cli.js");
const compatDir = path.join(root, "tools/test/fixtures/compat");

// Compatibility corpus: documents frozen at the Contract version they were
// authored against. The additive-release promise ("a 0.39.0 document is a
// valid 0.40.0 document") is tested here, not just asserted in
// docs/versioning.md. When examples/ copies move on, these do not.
describe("compat corpus", () => {
  const files = fs.readdirSync(compatDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.length >= 3, "compat corpus should hold several frozen documents");

  for (const file of files) {
    it(`still validates a document frozen at ${file}`, () => {
      const doc = JSON.parse(fs.readFileSync(path.join(compatDir, file), "utf8"));
      assert.match(doc.rig, /^[0-9]+\.[0-9]+\.[0-9]+$/, `${file} should name its Contract version`);
      const r = spawnSync(process.execPath, [cli, "--strict", path.join(compatDir, file)], {
        encoding: "utf8",
        cwd: root,
      });
      assert.equal(r.status, 0, r.stderr + r.stdout);
      assert.match(r.stdout, /^ok /m);
    });
  }
});
