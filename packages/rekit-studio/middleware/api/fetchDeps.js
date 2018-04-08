'use strict';

const rekitCore = require('rekit-core');

const utils = rekitCore.utils;

function fetchDeps() {
  const prjRoot = utils.getProjectRoot();
  const prjPkgJson = require(utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
  return {
    deps: prjPkgJson.depencencies || {},
    devDeps: prjPkgJson.devDependencies || {},
  };
}

module.exports = fetchDeps;
