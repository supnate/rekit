'use strict';

const runTask = require('../taskRunner');
const helpers = require('../helpers');

function updatePackage(io, name) {
  let cmd;
  if (helpers.usingYarn) cmd = `yarn upgrade ${name}@latest --colors`;
  else cmd = `npm update ${name}@latest --colors`;
  return runTask(io, cmd, 'update-package');
}

module.exports = updatePackage;
