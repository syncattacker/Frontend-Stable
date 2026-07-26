// Compact, in-memory fingerprint state shared between the client-intelligence
// engine (writer) and the HTTP client's request interceptor (reader). Only a
// short identifier + version are ever exposed here — never the full
// intelligence payload — per the "don't put the full payload in headers"
// requirement.

let fingerprintId = null;
let engineVersion = null;

export function setFingerprintId(id, version) {
  fingerprintId = id || null;
  engineVersion = version || null;
}

// Returns the headers to attach to a normal API request. Returns {} until
// the engine has produced a fingerprint (e.g. very first requests on a cold
// load), so callers must merge rather than assume presence.
export function getFingerprintHeaders() {
  if (!fingerprintId) return {};

  const headers = { "X-Client-Fingerprint": fingerprintId };
  if (engineVersion) headers["X-Client-Version"] = engineVersion;
  return headers;
}

export function _resetForTests() {
  fingerprintId = null;
  engineVersion = null;
}
