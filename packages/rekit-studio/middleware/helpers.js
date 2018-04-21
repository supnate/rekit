const fs = require('fs');
const rekitCore = require('rekit-core');

module.exports = {
  forceRequire(path) {
    // Avoid cache for require.
    delete require.cache[path];
    return require(path); // eslint-disable-line
  },

  usingYarn: fs.existsSync(rekitCore.utils.joinPath(rekitCore.getProjectRoot(), 'yarn.lock')),
};
