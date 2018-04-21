'use strict';

const runTask = require('../taskRunner');
const helpers = require('../helpers');

function removePackage(io, name) {
  let cmd;
  if (helpers.usingYarn) cmd = `yarn remove ${name} --colors`;
  else cmd = `npm remove ${name} --colors`;
  return runTask(io, cmd, 'remove-package');
}

module.exports = removePackage;
