const fs = require('fs');
const path = require('path');
const rekit = require('rekit-core');

// const utils = rekitCore.utils;
let usingYarn = false;
let prjRoot = rekit.core.paths.getProjectRoot();
let lastDir;
while (prjRoot && prjRoot !== lastDir && fs.existsSync(prjRoot)) {
  if (fs.existsSync(rekit.core.paths.join(prjRoot, 'yarn.lock'))) {
    usingYarn = true;
    break;
  }
  lastDir = prjRoot;
  prjRoot = path.join(prjRoot, '..');
}
module.exports = {
  forceRequire(modulePath) {
    // Avoid cache for require.
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath); // eslint-disable-line
  },

  usingYarn,
};
