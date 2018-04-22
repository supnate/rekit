'use strict';

const rekitCore = require('rekit-core');
const helpers = require('../helpers');

function fetchDeps() {
  // return new Promise((resolve, reject) => {
  const prjRoot = rekitCore.utils.getProjectRoot();
  const prjPkgJson = helpers.forceRequire(rekitCore.utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
  const allDeps = Object.assign({}, prjPkgJson.dependencies, prjPkgJson.devDependencies);
  Object.keys(allDeps).forEach(key => {
    allDeps[key] = {
      requiredVersion: allDeps[key],
      installedVersion: require(`${key}/package.json`).version, // eslint-disable-line
    };
  });
  return {
    deps: Object.keys(prjPkgJson.dependencies || {}),
    devDeps: Object.keys(prjPkgJson.devDependencies || {}),
    allDeps,
  };
}

module.exports = fetchDeps;
