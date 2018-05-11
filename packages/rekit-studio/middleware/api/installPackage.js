'use strict';

const runTask = require('../taskRunner');
const helpers = require('../helpers');

function installPackage(io, name) {
  let cmd;
  if (helpers.usingYarn) cmd = `yarn add ${name}@latest --colors`;
  else cmd = `npm install ${name}@latest --colors --save`;
  return runTask(io, cmd, 'install-package', { name });
}

module.exports = installPackage;
