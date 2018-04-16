'use strict';

const runTask = require('../taskRunner');

function removePackage(io, name) {
  return runTask(io, `yarn remove ${name} --colors`, 'remove-package');
}

module.exports = removePackage;
