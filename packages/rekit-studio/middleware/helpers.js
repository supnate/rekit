const fs = require('fs');
const path = require('path');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
let usingYarn = false;
let prjRoot = utils.getProjectRoot();
let lastDir;
while (prjRoot && prjRoot !== lastDir && fs.existsSync(prjRoot)) {
  if (fs.existsSync(utils.joinPath(prjRoot, 'yarn.lock'))) {
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
