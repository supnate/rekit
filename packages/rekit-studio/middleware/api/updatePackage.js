'use strict';

const runTask = require('../taskRunner');

function updatePackage(io, name) {
  return runTask(io, `yarn upgrade ${name} --colors`, 'update-package');
}

module.exports = updatePackage;
