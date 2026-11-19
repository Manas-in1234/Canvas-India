import { hashPassword, verifyPassword } from './password.js';

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

export async function hash(plain: string, _options?: Options): Promise<string> {
  return hashPassword(plain);
}

export async function verify(digest: string, plain: string): Promise<boolean> {
  const result = await verifyPassword(digest, plain);
  return result.valid;
}

export default {
  hash,
  verify,
  argon2d: 0,
  argon2i: 1,
  argon2id: 2,
};
