import { test } from "node:test";
import assert from "node:assert/strict";
import { getFingerprintHeaders, setFingerprintId, _resetForTests } from "../headers.js";

// These exercise exactly the logic src/utils/axios.js's request interceptor
// calls via `Object.assign(config.headers, getFingerprintHeaders())` — i.e.
// what actually rides along on every normal API request.

test("getFingerprintHeaders returns no headers before the engine has produced a fingerprint", () => {
  _resetForTests();
  assert.deepEqual(getFingerprintHeaders(), {});
});

test("getFingerprintHeaders attaches only the compact id + version, never a full payload", () => {
  _resetForTests();
  setFingerprintId("deadbeefcafe", "1.0");

  const headers = getFingerprintHeaders();
  assert.deepEqual(headers, {
    "X-Client-Fingerprint": "deadbeefcafe",
    "X-Client-Version": "1.0",
  });
});

test("getFingerprintHeaders omits X-Client-Version when no engine version was set", () => {
  _resetForTests();
  setFingerprintId("deadbeefcafe", null);

  assert.deepEqual(getFingerprintHeaders(), { "X-Client-Fingerprint": "deadbeefcafe" });
});

test("setFingerprintId(null) clears any previously attached header", () => {
  _resetForTests();
  setFingerprintId("deadbeefcafe", "1.0");
  setFingerprintId(null, null);

  assert.deepEqual(getFingerprintHeaders(), {});
});
