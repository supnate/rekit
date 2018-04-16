'use strict';

const runTask = require('../taskRunner');

function installPackage(io, name) {
  return runTask(io, `yarn add ${name}@latest --colors`, 'install-package');
}

module.exports = installPackage;
