const fs = require('fs');
const path = require('path');
const rekit = require('rekit-core');
const _ = require('lodash');

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

const originalWrite = process.stdout.write;
function startOutputToClient() {
  console.log('starting output to client');
  const output = [];
  const emit = _.debounce(() => {
    io.emit('output', output.length > 300 ? output.slice(-300) : output); // max to 300 lines flush to client
    output.length = 0;
  }, 100);

  process.stdout.write = function() {
    originalWrite.apply(process.stdout, arguments);
    _.forEach(arguments, text => {
      text.split('\n').forEach(s => output.push(s));
      emit();
    });
  };
}
function stopOutputToClient() {
  process.stdout.write = originalWrite;
}
module.exports = {
  forceRequire(modulePath) {
    // Avoid cache for require.
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath); // eslint-disable-line
  },

  usingYarn,
  startOutputToClient,
  stopOutputToClient,
};
