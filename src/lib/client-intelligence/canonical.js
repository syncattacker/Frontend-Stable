// Deterministic canonicalization + SHA-256 hashing for fingerprint signals.
// Pure functions only — no DOM/browser globals — so this file is directly
// unit-testable under plain Node (see __tests__/canonical.test.js).

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

// Recursively sorts object keys so that two logically-identical signal
// objects always serialize to the same string, regardless of collection
// order (property enumeration order isn't guaranteed across browsers/runs).
export function canonicalize(value) {
  return JSON.stringify(sortKeysDeep(value));
}

export async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
