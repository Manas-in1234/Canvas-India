declare module 'potrace' {
  export interface PotraceParams {
    threshold?: number;
    blackOnWhite?: boolean;
    optCurve?: boolean;
    [key: string]: unknown;
  }

  export function trace(
    source: Buffer | string,
    params: PotraceParams,
    callback: (err: Error | null, svg: string) => void,
  ): void;

  const potrace: { trace: typeof trace };
  export default potrace;
}
