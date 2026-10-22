import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  sha256Hex,
  timingSafeEqual,
  toBase64Url,
  fromBase64Url,
  DEFAULT_PBKDF2_ITERATIONS,
} from './password.js';

describe('WebCrypto Password Module', () => {
  it('generates a self-describing PBKDF2 PHC hash', async () => {
    const raw = 'ChangeMe123!';
    const hash = await hashPassword(raw, { iterations: 1000 }); // lower for faster test execution

    expect(hash).toMatch(/^\$pbkdf2-sha256\$i=1000\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/);
  });

  it('uses default 100,000 iterations when not specified', async () => {
    const raw = 'TestPassword!';
    const hash = await hashPassword(raw);

    expect(hash).toContain(`$pbkdf2-sha256$i=${DEFAULT_PBKDF2_ITERATIONS}$`);
  });

  it('successfully verifies a matching password', async () => {
    const raw = 'SuperSecret123!';
    const hash = await hashPassword(raw, { iterations: 2000 });

    const result = await verifyPassword(hash, raw);
    expect(result.valid).toBe(true);
    expect(result.migrationRequired).toBeUndefined();
  });

  it('rejects an incorrect password', async () => {
    const raw = 'SuperSecret123!';
    const hash = await hashPassword(raw, { iterations: 2000 });

    const result = await verifyPassword(hash, 'WrongPassword!');
    expect(result.valid).toBe(false);
  });

  it('detects legacy Argon2id hashes and indicates migrationRequired without computing Argon2', async () => {
    const legacyArgon2Hash = '$argon2id$v=19$m=65536,t=3,p=4$someSalt$someHash';
    const result = await verifyPassword(legacyArgon2Hash, 'ChangeMe123!');

    expect(result.valid).toBe(false);
    expect(result.migrationRequired).toBe(true);
  });

  it('gracefully handles malformed hashes without throwing', async () => {
    expect((await verifyPassword('', 'pass')).valid).toBe(false);
    expect((await verifyPassword('not-a-hash', 'pass')).valid).toBe(false);
    expect((await verifyPassword('$invalid-algo$i=1000$salt$hash', 'pass')).valid).toBe(false);
    expect((await verifyPassword('$pbkdf2-sha256$invalid$salt$hash', 'pass')).valid).toBe(false);
    expect((await verifyPassword('$pbkdf2-sha256$i=-10$salt$hash', 'pass')).valid).toBe(false);
    expect((await verifyPassword('$pbkdf2-sha256$i=1000$bad!chars$bad!chars', 'pass')).valid).toBe(false);
  });

  it('computes constant-time byte comparison', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    const c = new Uint8Array([1, 2, 3, 5]);
    const d = new Uint8Array([1, 2, 3]);

    expect(timingSafeEqual(a, b)).toBe(true);
    expect(timingSafeEqual(a, c)).toBe(false);
    expect(timingSafeEqual(a, d)).toBe(false);
  });

  it('correctly encodes and decodes base64url without padding', () => {
    const bytes = new Uint8Array([0, 1, 250, 255, 128, 64]);
    const encoded = toBase64Url(bytes);
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');

    const decoded = fromBase64Url(encoded);
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  it('hashes refresh tokens with SHA-256 into a 64-character hex string', async () => {
    const token = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const hash = await sha256Hex(token);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);

    // Deterministic: same token yields identical hash
    const hash2 = await sha256Hex(token);
    expect(hash).toBe(hash2);

    // Different token yields different hash
    const hash3 = await sha256Hex('different-token');
    expect(hash).not.toBe(hash3);
  });
});
