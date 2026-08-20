/**
 * Read a .rigz package: ZIP with one root .rig and a data/ folder.
 * Layout: docs/interchange.md#package
 */
import zlib from "node:zlib";

const SIG_EOCD = 0x06054b50;
const SIG_CD = 0x02014b50;
const SIG_LOCAL = 0x04034b50;

export function isRigzPath(filePath) {
  return filePath.toLowerCase().endsWith(".rigz");
}

export function openRigz(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  const eocd = findEocd(buf);
  if (eocd < 0) {
    throw new Error("not a ZIP archive");
  }
  const count = buf.readUInt16LE(eocd + 10);
  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOff = buf.readUInt32LE(eocd + 16);
  if (cdOff + cdSize > buf.length) {
    throw new Error("ZIP central directory is truncated");
  }

  const entries = [];
  let p = cdOff;
  for (let i = 0; i < count; i++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== SIG_CD) {
      throw new Error("ZIP central directory is corrupt");
    }
    const flags = buf.readUInt16LE(p + 8);
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const uncompSize = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = normalizeZipPath(buf.subarray(p + 46, p + 46 + nameLen).toString("utf8"));
    p += 46 + nameLen + extraLen + commentLen;
    entries.push({ name, flags, method, compSize, uncompSize, localOff });
  }

  const docs = entries.filter((e) => isRootRig(e.name));
  if (docs.length === 0) {
    const nested = entries.filter((e) => e.name.toLowerCase().endsWith(".rig") && !isIgnored(e.name));
    if (nested.length) {
      throw new Error("ZIP must have exactly one .rig at the archive root (no wrapping folder)");
    }
    throw new Error("ZIP has no .rig at the archive root");
  }
  if (docs.length > 1) {
    throw new Error(`ZIP has ${docs.length} root .rig files; there must be exactly one`);
  }

  const hasData = entries.some((e) => isDataPath(e.name));
  const jsonText = inflateEntry(buf, docs[0]).toString("utf8");
  return { documentName: docs[0].name, jsonText, hasData };
}

function isIgnored(name) {
  return name.startsWith("__MACOSX/") || name.split("/").includes(".DS_Store");
}

function isRootRig(name) {
  return !name.includes("/") && name.toLowerCase().endsWith(".rig") && name.length > 4;
}

function isDataPath(name) {
  return name === "data" || name === "data/" || name.startsWith("data/");
}

function normalizeZipPath(name) {
  const n = name.replace(/\\/g, "/").replace(/^\.\//, "");
  if (!n || n.startsWith("/") || n.split("/").includes("..")) {
    throw new Error(`unsafe ZIP path "${name}"`);
  }
  return n;
}

function findEocd(buf) {
  const start = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= start; i--) {
    if (buf.readUInt32LE(i) !== SIG_EOCD) continue;
    const commentLen = buf.readUInt16LE(i + 20);
    if (i + 22 + commentLen === buf.length) return i;
  }
  return -1;
}

function inflateEntry(buf, entry) {
  if (entry.flags & 1) {
    throw new Error("encrypted ZIP entries are not allowed");
  }
  const off = entry.localOff;
  if (off + 30 > buf.length || buf.readUInt32LE(off) !== SIG_LOCAL) {
    throw new Error("ZIP local header is corrupt");
  }
  const nameLen = buf.readUInt16LE(off + 26);
  const extraLen = buf.readUInt16LE(off + 28);
  const dataOff = off + 30 + nameLen + extraLen;
  const raw = buf.subarray(dataOff, dataOff + entry.compSize);
  if (entry.method === 0) {
    return Buffer.from(raw);
  }
  if (entry.method === 8) {
    return zlib.inflateRawSync(raw);
  }
  throw new Error(`unsupported ZIP compression method ${entry.method}`);
}
