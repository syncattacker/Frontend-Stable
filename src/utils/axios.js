import axios from "axios";
import { getFingerprintHeaders } from "@/lib/client-intelligence/headers";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Replay protection: every authenticated request needs a fresh nonce and a
// counter that never decreases for this session (replayProtection.middleware.js
// accepts incoming >= last-seen, so equal values are fine — e.g. concurrent
// tabs). Date.now() (epoch ms) satisfies this on its own: it only moves
// forward with wall-clock time, so it stays monotonic across page reloads
// and across multiple tabs sharing a session with no persisted state needed.
function nextNonce() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function nextCounter() {
  return Date.now();
}

// CSRF double-submit cookie: the backend sets a non-HttpOnly cookie and
// expects the same value echoed back as a header on state-changing requests
// (GET/HEAD/OPTIONS are exempt on the backend, so we skip them here too).
const CSRF_COOKIE_NAME = "csrf_token";
const SAFE_METHODS = new Set(["get", "head", "options"]);

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

API.interceptors.request.use((config) => {
  // The instance defaults Content-Type to application/json for every request,
  // but axios's own transformRequest checks that header before deciding
  // whether to send FormData as-is: if it sees application/json, it
  // JSON-stringifies the FormData instead of sending it, silently breaking
  // multipart uploads. Drop the header so axios (and the browser) can set
  // the correct multipart/form-data boundary themselves.
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  config.headers["X-Nonce"] = nextNonce();
  config.headers["X-Counter"] = String(nextCounter());

  const method = (config.method || "get").toLowerCase();
  if (!SAFE_METHODS.has(method)) {
    const csrfToken = getCookie(CSRF_COOKIE_NAME);
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  // Compact identifier only — never the full client-intelligence payload
  // (that goes exclusively to POST /user/analyze, encrypted).
  Object.assign(config.headers, getFingerprintHeaders());

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("User not authenticated");
    }
    return Promise.reject(error);
  }
);

// Coalesce identical concurrent GET requests into a single network call.
// Two components (or a React Strict Mode double-invoked effect) firing the
// same read at once would otherwise become two physical requests — wasted,
// redundant network/backend work for an identical GET. Never dedupe
// mutating methods.
//
// Note: axios binds get/post/request/etc. to its own internal context object
// when the instance is created, so overriding API.request has no effect on
// calls made via API.get(...) — they never go through instance.request at
// all. API.get itself must be the thing we override.
const pendingGetRequests = new Map();
const rawGet = API.get.bind(API);

function dedupeKey(url, config) {
  // Callers that pass their own AbortController/signal already manage
  // cancellation (e.g. Strict Mode cleanup) — don't coalesce those, since
  // aborting one would incorrectly abort every caller sharing the promise.
  if (config?.signal) return null;
  const params = config?.params ? JSON.stringify(config.params) : "";
  return `${url}?${params}`;
}

API.get = (url, config) => {
  const key = dedupeKey(url, config);
  if (!key) return rawGet(url, config);

  const inFlight = pendingGetRequests.get(key);
  if (inFlight) return inFlight;

  const promise = rawGet(url, config).finally(() => {
    pendingGetRequests.delete(key);
  });
  pendingGetRequests.set(key, promise);
  return promise;
};

export default API;