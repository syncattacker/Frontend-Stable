// Collects privacy-conscious, browser-observable signals only. Deliberately
// excludes invasive techniques (canvas/audio hashing, font enumeration,
// WebRTC/ICE candidate probing) that aren't already part of this project.
//
// Every signal is read defensively: browsers vary in what they expose (and
// privacy modes/extensions can make normally-safe APIs throw), so a failure
// reading one signal must never take down the rest.

function safeStorageCheck(getStorage) {
  try {
    const storage = getStorage();
    const testKey = "__gopwnit_ci_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function collectWebGLInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { webgl: false, vendor: null, renderer: null };

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      webgl: true,
      vendor: ext ? String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)) : null,
      renderer: ext
        ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
        : null,
    };
  } catch {
    return { webgl: false, vendor: null, renderer: null };
  }
}

function normalizeDoNotTrack(value) {
  if (value === "1" || value === "yes" || value === true) return true;
  if (value === "0" || value === "no" || value === false) return false;
  return null;
}

// The browser cannot reliably learn its own authoritative public IP without
// a trusted first-party mechanism, and no such mechanism exists in this
// project today (and WebRTC/STUN-based local-IP leaks are intentionally not
// used here). clientObservedIp/ipVersion are therefore always reported as
// null from the client; the backend fills in the authoritative value from
// its own trusted request path (CF-Connecting-IP).
function collectNetworkSignals() {
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null;

  return {
    clientObservedIp: null,
    ipVersion: null,
    effectiveType: conn?.effectiveType ?? null,
    downlink: typeof conn?.downlink === "number" ? conn.downlink : null,
    rtt: typeof conn?.rtt === "number" ? conn.rtt : null,
  };
}

// Returns null when not running in a browser (SSR) so callers can no-op.
export function collectDeviceSignals() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  const nav = navigator;
  const scr = window.screen;

  return {
    device: {
      userAgent: nav.userAgent || null,
      vendor: nav.vendor || null,
      platform: nav.platform || null,
      language: nav.language || null,
      languages: Array.isArray(nav.languages) ? [...nav.languages] : [],
      hardwareConcurrency:
        typeof nav.hardwareConcurrency === "number"
          ? nav.hardwareConcurrency
          : null,
      deviceMemory:
        typeof nav.deviceMemory === "number" ? nav.deviceMemory : null,
      touchPoints:
        typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : 0,
    },
    display: {
      width: scr?.width ?? null,
      height: scr?.height ?? null,
      availableWidth: scr?.availWidth ?? null,
      availableHeight: scr?.availHeight ?? null,
      colorDepth: scr?.colorDepth ?? null,
      pixelRatio: window.devicePixelRatio ?? null,
    },
    browser: {
      cookiesEnabled: !!nav.cookieEnabled,
      localStorage: safeStorageCheck(() => window.localStorage),
      sessionStorage: safeStorageCheck(() => window.sessionStorage),
      indexedDB: typeof window.indexedDB !== "undefined",
    },
    timezone: {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      offset: new Date().getTimezoneOffset(),
    },
    graphics: collectWebGLInfo(),
    network: collectNetworkSignals(),
    privacy: {
      doNotTrack: normalizeDoNotTrack(nav.doNotTrack),
      globalPrivacyControl:
        typeof nav.globalPrivacyControl === "boolean"
          ? nav.globalPrivacyControl
          : null,
    },
  };
}
