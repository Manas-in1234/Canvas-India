
function sharp(input?: any) {
  return {
    metadata: async () => ({ width: 1000, height: 1000, format: 'jpeg' }),
    resize: () => sharp(),
    jpeg: () => sharp(),
    png: () => sharp(),
    toBuffer: async () => Buffer.from(''),
  };
}

export default sharp;
