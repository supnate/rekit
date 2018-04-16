'use strict';

const runTask = require('../taskRunner');

function updatePackage(io, name) {
  return runTask(io, `yarn add ${name}@latest --colors`, 'update-package');
}

module.exports = updatePackage;
