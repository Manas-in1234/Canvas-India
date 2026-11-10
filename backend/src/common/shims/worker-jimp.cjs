// Only the codecs and transforms needed for bounded shape tracing. Loading
// Jimp's GIF/font stack at module scope is incompatible with Workers.
const configure = require('@jimp/custom');
const unwrap = (module) => module.default || module;
module.exports = unwrap(configure)({
  types: [unwrap(require('@jimp/png')), unwrap(require('@jimp/jpeg'))],
  plugins: [unwrap(require('@jimp/plugin-resize')), unwrap(require('@jimp/plugin-scale'))],
});
