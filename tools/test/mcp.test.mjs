import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const server = path.join(root, "tools", "rig-mcp", "server.mjs");

function startServer() {
  const proc = spawn(process.execPath, [server], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
  const pending = new Map();
  let buffer = "";
  proc.stdout.on("data", (chunk) => {
    buffer += chunk;
    for (;;) {
      const at = buffer.indexOf("\n");
      if (at === -1) break;
      const line = buffer.slice(0, at);
      buffer = buffer.slice(at + 1);
      if (!line.trim()) continue;
      const msg = JSON.parse(line);
      if (msg.id !== undefined && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    }
  });
  let nextId = 1;
  const call = (method, params) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, resolve);
      proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 15000);
    });
  return { proc, call };
}

describe("rig-mcp", () => {
  it("answers initialize and lists tools", async () => {
    const { proc, call } = startServer();
    try {
      const init = await call("initialize", {});
      assert.equal(init.result.serverInfo.name, "rig-mcp");
      const list = await call("tools/list", {});
      const names = list.result.tools.map((t) => t.name);
      assert.deepEqual(names, ["list_schemas", "get_schema", "find_examples", "validate_document", "get_skill"]);
    } finally {
      proc.kill();
    }
  });

  it("lists stable schemas and fetches one schema", async () => {
    const { proc, call } = startServer();
    try {
      const list = await call("tools/call", { name: "list_schemas", arguments: { maturity: "stable", query: "rectangle" } });
      const text = list.result.content[0].text;
      assert.match(text, /rig\.geometry\.rectangle \[stable\]/);
      const schema = await call("tools/call", { name: "get_schema", arguments: { id: "rig.geometry.rectangle" } });
      assert.match(schema.result.content[0].text, /width/);
    } finally {
      proc.kill();
    }
  });

  it("validates a document through rig-validate", async () => {
    const { proc, call } = startServer();
    try {
      const good = await call("tools/call", {
        name: "validate_document",
        arguments: { document: { rig: "1.0.0", entities: [{ id: "a", components: { "rig.spatial.vertex": {} } }] } },
      });
      assert.match(good.result.content[0].text, /^exit 0/);
      const bad = await call("tools/call", {
        name: "validate_document",
        arguments: { document: { rig: "1.0.0", entities: [{ id: "a", components: { "rig.geometry.rectangle": { x: 0, y: 0, width: -2, height: 5 } } }] }, strict: true },
      });
      assert.match(bad.result.content[0].text, /^exit 1/);
    } finally {
      proc.kill();
    }
  });
});
