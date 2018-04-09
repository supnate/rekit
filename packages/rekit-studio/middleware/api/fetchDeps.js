'use strict';

const rekitCore = require('rekit-core');
const _ = require('lodash');

const utils = rekitCore.utils;

function fetchDeps() {
  const prjRoot = utils.getProjectRoot();
  const prjPkgJson = require(utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
  const allDeps = Object.assign({}, prjPkgJson.dependencies, prjPkgJson.devDependencies);
  Object.keys(allDeps).forEach(key => {
    allDeps[key] = {
      requiredVersion: allDeps[key],
      installedVersion: require(`${key}/package.json`).version, // eslint-disable-line
      lastestVersion: 'TODO',
    };
  });

  return {
    deps: Object.keys(prjPkgJson.dependencies || {}),
    devDeps: Object.keys(prjPkgJson.devDependencies || {}),
    allDeps,
  };
}

module.exports = fetchDeps;
