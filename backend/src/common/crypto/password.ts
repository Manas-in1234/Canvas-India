/**
 * Production WebCrypto-Native Password Hashing & Verification
 *
 * Implements PBKDF2-HMAC-SHA256 according to NIST SP 800-132 / RFC 8018 and
 * self-describing PHC string format:
 *   $pbkdf2-sha256$i=<iterations>$<salt_b64url>$<hash_b64url>
 *
 * Designed to execute within Cloudflare Workers Free plan CPU limits (<50 ms).
 * NEVER executes Argon2 in the Worker environment.
 */

export const DEFAULT_PBKDF2_ITERATIONS = 100_000;
export const SALT_BYTES = 16;
export const HASH_BYTES = 32;

export class LegacyPasswordMigrationError extends Error {
  readonly code = 'PASSWORD_MIGRATION_REQUIRED';
  constructor(message = 'Your account requires a one-time password update for the upgraded authentication engine.') {
    super(message);
    this.name = 'LegacyPasswordMigrationError';
  }
}

export interface VerifyPasswordResult {
  valid: boolean;
  migrationRequired?: boolean;
}

function getSubtleCrypto(): SubtleCrypto {
  if (typeof globalThis.crypto?.subtle !== 'undefined') {
    return globalThis.crypto.subtle;
  }
  throw new Error('WebCrypto subtle is not available in the current runtime environment');
}

function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof globalThis.crypto?.getRandomValues !== 'undefined') {
    return globalThis.crypto.getRandomValues(bytes);
  }
  throw new Error('WebCrypto getRandomValues is not available in the current runtime environment');
}

export function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBase64Url(str: string): Uint8Array {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Derives a PBKDF2-HMAC-SHA256 hash using native WebCrypto.
 */
export async function hashPassword(
  password: string,
  options?: { iterations?: number; salt?: Uint8Array },
): Promise<string> {
  const subtle = getSubtleCrypto();
  const iterations = options?.iterations ?? DEFAULT_PBKDF2_ITERATIONS;
  const salt = options?.salt ?? getRandomBytes(SALT_BYTES);

  const key = await subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const derivedBuffer = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    key,
    HASH_BYTES * 8,
  );

  const derivedBytes = new Uint8Array(derivedBuffer);
  const saltB64 = toBase64Url(salt);
  const hashB64 = toBase64Url(derivedBytes);

  return `$pbkdf2-sha256$i=${iterations}$${saltB64}$${hashB64}`;
}

/**
 * Verifies a password against a stored PHC hash.
 *
 * If the stored hash is a legacy Argon2 hash ($argon2id$), this function
 * deliberately DOES NOT attempt Argon2 computation (which exceeds Worker CPU limits)
 * and returns { valid: false, migrationRequired: true }.
 */
export async function verifyPassword(
  storedHash: string,
  password: string,
): Promise<VerifyPasswordResult> {
  if (!storedHash || typeof storedHash !== 'string') {
    return { valid: false };
  }

  // Detect legacy Argon2 hashes safely without running expensive Argon2 computation
  if (storedHash.startsWith('$argon2id$') || storedHash.startsWith('$argon2i$') || storedHash.startsWith('$argon2d$')) {
    return { valid: false, migrationRequired: true };
  }

  // Expect $pbkdf2-sha256$i=<iterations>$<salt>$<hash>
  const parts = storedHash.split('$').filter(Boolean);
  if (parts.length !== 4) {
    return { valid: false };
  }

  const [algorithm, iterParam, saltB64, hashB64] = parts;
  if (algorithm !== 'pbkdf2-sha256') {
    return { valid: false };
  }

  const iterMatch = /^i=(\d+)$/.exec(iterParam);
  if (!iterMatch) {
    return { valid: false };
  }

  const iterations = parseInt(iterMatch[1], 10);
  if (!Number.isFinite(iterations) || iterations < 1) {
    return { valid: false };
  }

  let saltBytes: Uint8Array;
  let expectedHashBytes: Uint8Array;
  try {
    saltBytes = fromBase64Url(saltB64);
    expectedHashBytes = fromBase64Url(hashB64);
  } catch {
    return { valid: false };
  }

  if (saltBytes.length === 0 || expectedHashBytes.length !== HASH_BYTES) {
    return { valid: false };
  }

  const subtle = getSubtleCrypto();
  const key = await subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const derivedBuffer = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    key,
    expectedHashBytes.length * 8,
  );

  const derivedBytes = new Uint8Array(derivedBuffer);
  const valid = timingSafeEqual(derivedBytes, expectedHashBytes);

  return { valid };
}

/**
 * Computes a deterministic SHA-256 hexadecimal hash of a high-entropy token (e.g. refresh token).
 * Executes in <0.05 ms using native WebCrypto and allows direct database indexing.
 */
export async function sha256Hex(token: string): Promise<string> {
  const subtle = getSubtleCrypto();
  const data = new TextEncoder().encode(token);
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashBytes = new Uint8Array(hashBuffer);

  let hex = '';
  for (let i = 0; i < hashBytes.length; i++) {
    hex += hashBytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}
