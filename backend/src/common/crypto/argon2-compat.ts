
import { argon2id, argon2Verify } from 'hash-wasm';
import { randomBytes } from 'node:crypto';

export enum argon2d {
  argon2d = 0,
  argon2i = 1,
  argon2id = 2,
}

export interface Options {
  hashLength?: number;
  timeCost?: number;
  memoryCost?: number;
  parallelism?: number;
  type?: number;
  raw?: boolean;
  salt?: Buffer;
}

export async function hash(plain: string, options?: Options): Promise<string> {
  const salt = options?.salt ?? randomBytes(16);
  const timeCost = options?.timeCost ?? 3;
  const memoryCost = options?.memoryCost ?? 65536;
  const parallelism = options?.parallelism ?? 4;
  const hashLength = options?.hashLength ?? 32;

  return argon2id({
    password: plain,
    salt: new Uint8Array(salt),
    parallelism,
    iterations: timeCost,
    memorySize: memoryCost,
    hashLength,
    outputType: 'encoded',
  });
}

export async function verify(digest: string, plain: string): Promise<boolean> {
  return argon2Verify({
    password: plain,
    hash: digest,
  });
}

export default {
  hash,
  verify,
  argon2d: 0,
  argon2i: 1,
  argon2id: 2,
};
