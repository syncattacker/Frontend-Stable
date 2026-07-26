import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import forge from "node-forge";
import { encryptPayload } from "../hybridCrypto.js";

function generateRsaKeyPairPem() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

// Mirrors E:\Production-Backend\utils\hybridDecrypt.js exactly, so this test
// proves the frontend envelope is actually decryptable by that backend
// logic (RSA-OAEP-SHA256 unwrap via node-forge, then AES-256-GCM with the
// tag split off the end of the ciphertext buffer, per Web Crypto's format).
function decryptEnvelopeLikeBackend(envelope, privateKeyPem) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(envelope.encryptedKey);
  const rawKeyBinary = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  const aesKey = Buffer.from(rawKeyBinary, "binary");

  const iv = Buffer.from(envelope.iv, "base64");
  const combined = Buffer.from(envelope.ciphertext, "base64");
  const tag = combined.subarray(combined.length - 16);
  const ciphertext = combined.subarray(0, combined.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  return JSON.parse(plaintext);
}

test("encryptPayload produces the documented envelope shape", async () => {
  const { publicKey } = generateRsaKeyPairPem();
  const envelope = await encryptPayload({ fingerprintId: "abc123" }, publicKey);

  assert.equal(envelope.version, 1);
  assert.equal(envelope.alg, "RSA-OAEP-256");
  assert.equal(envelope.enc, "A256GCM");
  assert.equal(typeof envelope.encryptedKey, "string");
  assert.equal(typeof envelope.iv, "string");
  assert.equal(typeof envelope.ciphertext, "string");

  // 96-bit GCM IV per spec.
  assert.equal(Buffer.from(envelope.iv, "base64").length, 12);
});

test("encryptPayload round-trips through a backend-equivalent RSA-OAEP + AES-GCM decrypt", async () => {
  const { publicKey, privateKey } = generateRsaKeyPairPem();
  const payload = {
    version: "1.0",
    fingerprintId: "abc123",
    device: { platform: "Win32", languages: ["en-US", "en"] },
    network: { clientObservedIp: null, ipVersion: null },
  };

  const envelope = await encryptPayload(payload, publicKey);
  const decrypted = decryptEnvelopeLikeBackend(envelope, privateKey);

  assert.deepEqual(decrypted, payload);
});

test("encryptPayload never reuses an IV or ciphertext across calls", async () => {
  const { publicKey } = generateRsaKeyPairPem();
  const envelopeA = await encryptPayload({ x: 1 }, publicKey);
  const envelopeB = await encryptPayload({ x: 1 }, publicKey);

  assert.notEqual(envelopeA.iv, envelopeB.iv);
  assert.notEqual(envelopeA.ciphertext, envelopeB.ciphertext);
  assert.notEqual(envelopeA.encryptedKey, envelopeB.encryptedKey);
});

test("encryptPayload rejects when no public key is configured", async () => {
  await assert.rejects(() => encryptPayload({ x: 1 }, undefined));
});

test("tampering with the ciphertext is detected by GCM's auth tag (fails closed)", async () => {
  const { publicKey, privateKey } = generateRsaKeyPairPem();
  const envelope = await encryptPayload({ fingerprintId: "abc123" }, publicKey);

  const tampered = Buffer.from(envelope.ciphertext, "base64");
  tampered[0] ^= 0xff; // flip a bit in the ciphertext
  const tamperedEnvelope = { ...envelope, ciphertext: tampered.toString("base64") };

  assert.throws(() => decryptEnvelopeLikeBackend(tamperedEnvelope, privateKey));
});
