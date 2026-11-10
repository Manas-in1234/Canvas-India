import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

let sequence = 0;
async function client() {
  const source = await readFile(new URL('./api-client.ts', import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output + `\n// ${sequence++}`).toString('base64')}`);
}

test('invalid login reports the server error without refreshing an old session', async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({message:'Invalid credentials'}, {status:401});
  const {apiClient, ApiError, setRefreshHandler} = await client();
  let refreshes = 0;
  setRefreshHandler(async () => { refreshes++; return false; });
  await assert.rejects(apiClient.post('/auth/login', {email:'test@example.invalid',password:'wrong'}),
    error => error instanceof ApiError && error.status === 401 && error.message === 'Invalid credentials');
  assert.equal(refreshes, 0);
});

test('an expired refresh token does not recursively try to refresh itself', async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({message:'Invalid refresh token'}, {status:401});
  const {apiClient, setRefreshHandler} = await client();
  let refreshes = 0;
  setRefreshHandler(async () => { refreshes++; return false; });
  await assert.rejects(apiClient.post('/auth/refresh', {refreshToken:'expired'}), /Invalid refresh token/);
  assert.equal(refreshes, 0);
});

test('an expired protected request retries once after a successful refresh', async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  let calls=0, refreshes=0;
  globalThis.fetch = async () => ++calls === 1 ? Response.json({}, {status:401}) : Response.json({id:'admin'});
  const {apiClient, setRefreshHandler} = await client();
  setRefreshHandler(async () => { refreshes++; return true; });
  assert.deepEqual(await apiClient.get('/auth/me'), {id:'admin'});
  assert.equal(calls, 2);
  assert.equal(refreshes, 1);
});
