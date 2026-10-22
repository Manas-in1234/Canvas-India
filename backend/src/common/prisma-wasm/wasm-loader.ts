export async function getQueryCompilerWasm(): Promise<any> {
  try {
    // @ts-ignore
    const wasm = await import('./query_compiler.wasm');
    return wasm.default || wasm;
  } catch {
    return null;
  }
}
