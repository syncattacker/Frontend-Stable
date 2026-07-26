// Orchestrates the client-intelligence lifecycle: collect signals once per
// browser session, derive a deterministic fingerprintId, encrypt the full
// payload, and submit it to the backend — without blocking rendering and
// without ever taking the app down if any step fails or an API is missing.
import API from "@/utils/axios";
import { collectDeviceSignals } from "./collector";
import { canonicalize, sha256Hex } from "./canonical";
import { encryptPayload } from "./hybridCrypto";
import { setFingerprintId } from "./headers";

const ENGINE_VERSION = "1.0";
const ANALYZE_ENDPOINT = `${process.env.NEXT_PUBLIC_USER_API}/analyze`;
const SESSION_SENT_KEY = "gopwnit.clientIntelligence.sent";
const INIT_TIMEOUT_MS = 8000;

// Module-level singleton: guards against duplicate work within the same
// page load, including React Strict Mode's double-invoked effects (the
// second call just returns the same in-flight promise).
let initPromise = null;

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("client-intelligence timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function readSessionFlag() {
  try {
    return window.sessionStorage.getItem(SESSION_SENT_KEY) === "1";
  } catch {
    return false; // sessionStorage unavailable (private mode, etc.) — never block on it
  }
}

function writeSessionFlag() {
  try {
    window.sessionStorage.setItem(SESSION_SENT_KEY, "1");
  } catch {
    // best-effort only
  }
}

// Signals that describe the physical device/browser (hashed into the
// fingerprintId). `network` is deliberately excluded: connection quality
// (effectiveType/downlink/rtt) is volatile and, per spec, the current IP
// must never be baked into a device fingerprint (IPs churn on mobile
// networks, CGNAT, VPNs, Wi-Fi changes, etc. — see collector.js).
async function buildPayload(signals) {
  const { network, ...stableSignals } = signals;
  const fingerprintId = await sha256Hex(canonicalize(stableSignals));
  return {
    version: ENGINE_VERSION,
    timestamp: Date.now(),
    fingerprintId,
    ...stableSignals,
    network,
  };
}

async function submit(payload) {
  const publicKey = process.env.NEXT_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("Client intelligence: NEXT_PUBLIC_KEY not configured, skipping submission.");
    return;
  }
  const envelope = await encryptPayload(payload, publicKey);
  await API.post(ANALYZE_ENDPOINT, envelope);
}

async function run(alreadySentThisSession) {
  const signals = collectDeviceSignals();
  if (!signals) return; // SSR or non-browser environment

  const payload = await buildPayload(signals);

  // The fingerprintId is cheap to (re)compute and safe to expose in normal
  // request headers even if we skip re-submitting the full payload below.
  setFingerprintId(payload.fingerprintId, ENGINE_VERSION);

  if (alreadySentThisSession) return;

  await submit(payload);
  writeSessionFlag();
}

// Call once, as early as convenient (e.g. a top-level layout effect). Safe
// to call multiple times — subsequent calls reuse the first call's promise.
export function initClientIntelligence() {
  if (initPromise) return initPromise;
  if (typeof window === "undefined") return Promise.resolve();

  const alreadySentThisSession = readSessionFlag();

  initPromise = withTimeout(run(alreadySentThisSession), INIT_TIMEOUT_MS).catch((err) => {
    console.warn("Client intelligence initialization failed:", err.message);
  });

  return initPromise;
}

export function _resetForTests() {
  initPromise = null;
}
