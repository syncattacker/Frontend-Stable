// Hybrid RSA-OAEP + AES-256-GCM encryption for the /user/analyze payload.
//
// RSA can't directly encrypt an arbitrary-size JSON document, so the
// payload is encrypted with a fresh, random AES-256-GCM key, and only that
// (32-byte) key is wrapped with RSA-OAEP-SHA256 using the project's existing
// public key (the same NEXT_PUBLIC_KEY / node-forge RSA-OAEP-SHA256
// convention already used to encrypt login/signup passwords — see
// src/components/auth/Login.jsx). AES-GCM itself uses the native Web Crypto
// API rather than a userland library.
//
// IMPORTANT WIRE FORMAT NOTE: Web Crypto's SubtleCrypto.encrypt("AES-GCM")
// returns ciphertext with the 16-byte GCM authentication tag appended to the
// end of the buffer (not returned separately). The backend decryptor must
// split the last 16 bytes off as the tag before calling
// decipher.setAuthTag(...). This module never reuses an AES key or IV.
import forge from "node-forge";

const AES_KEY_LENGTH_BITS = 256;
const GCM_IV_LENGTH_BYTES = 12;
const ENVELOPE_VERSION = 1;
const ALG = "RSA-OAEP-256";
const ENC = "A256GCM";

function bufferToBinaryString(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return binary;
}

function bufferToBase64(buffer) {
  return btoa(bufferToBinaryString(buffer));
}

// Wraps a raw AES key with RSA-OAEP-SHA256, mirroring the RSA-OAEP-SHA256
// password-encryption pattern already used elsewhere in this codebase.
function wrapAesKey(rawKeyBuffer, publicKeyPem) {
  const rsa = forge.pki.publicKeyFromPem(publicKeyPem);
  const binaryKey = bufferToBinaryString(rawKeyBuffer);
  const encrypted = rsa.encrypt(binaryKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  return forge.util.encode64(encrypted);
}

// Encrypts `payload` (any JSON-serializable value) for transport, returning
// the envelope described in the module docstring above. Throws if Web
// Crypto is unavailable (no secure context) or `publicKeyPem` is missing —
// callers should treat that as "skip sending" rather than a fatal error.
export async function encryptPayload(payload, publicKeyPem) {
  if (!publicKeyPem) {
    throw new Error("Missing RSA public key for client-intelligence encryption");
  }
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is unavailable in this browser");
  }

  const plaintext = new TextEncoder().encode(JSON.stringify(payload));

  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: AES_KEY_LENGTH_BITS },
    true,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH_BYTES));

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plaintext,
  );
  const rawKeyBuffer = await crypto.subtle.exportKey("raw", aesKey);

  return {
    version: ENVELOPE_VERSION,
    alg: ALG,
    enc: ENC,
    encryptedKey: wrapAesKey(rawKeyBuffer, publicKeyPem),
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(ciphertextBuffer),
  };
}
