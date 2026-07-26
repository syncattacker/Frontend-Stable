import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalize, sha256Hex } from "../canonical.js";

test("canonicalize is independent of key insertion order", () => {
  const a = { b: 1, a: 2, nested: { y: 1, x: 2 } };
  const b = { a: 2, nested: { x: 2, y: 1 }, b: 1 };
  assert.equal(canonicalize(a), canonicalize(b));
});

test("canonicalize distinguishes objects with different content", () => {
  assert.notEqual(canonicalize({ a: 1 }), canonicalize({ a: 2 }));
});

test("canonicalize sorts keys inside array elements too", () => {
  const a = [{ b: 1, a: 2 }];
  const b = [{ a: 2, b: 1 }];
  assert.equal(canonicalize(a), canonicalize(b));
});

test("sha256Hex is deterministic and produces a 64-char lowercase hex digest", async () => {
  const input = canonicalize({ a: 1, b: [1, 2, 3] });
  const first = await sha256Hex(input);
  const second = await sha256Hex(input);

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
});

test("sha256Hex differs when canonical input differs (fingerprint determinism)", async () => {
  const hashA = await sha256Hex(canonicalize({ device: { platform: "Win32" } }));
  const hashB = await sha256Hex(canonicalize({ device: { platform: "MacIntel" } }));
  assert.notEqual(hashA, hashB);
});

test("sha256Hex is stable regardless of key order in the source object (real fingerprintId flow)", async () => {
  const signalsA = { device: { platform: "Win32", language: "en-US" }, display: { width: 1920 } };
  const signalsB = { display: { width: 1920 }, device: { language: "en-US", platform: "Win32" } };

  const idA = await sha256Hex(canonicalize(signalsA));
  const idB = await sha256Hex(canonicalize(signalsB));
  assert.equal(idA, idB);
});
