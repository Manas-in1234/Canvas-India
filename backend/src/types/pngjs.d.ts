declare module 'pngjs' {
  export class PNG {
    width: number;
    height: number;
    data: Buffer;
    parse(bytes: Buffer, callback: (error: Error | null, image: PNG) => void): PNG;
  }
}
