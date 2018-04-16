'use strict';

const rekitCore = require('rekit-core');
const packageJson = require('package-json');
const utils = require('../utils');

// const tils = rekitCore.utils;

function fetchDeps() {
  return new Promise((resolve, reject) => {
    const prjRoot = rekitCore.utils.getProjectRoot();
    const prjPkgJson = utils.forceRequire(rekitCore.utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
    const allDeps = Object.assign({}, prjPkgJson.dependencies, prjPkgJson.devDependencies);
    Object.keys(allDeps).forEach(key => {
      allDeps[key] = {
        requiredVersion: allDeps[key],
        installedVersion: require(`${key}/package.json`).version, // eslint-disable-line
        latestVersion: 'TODO',
      };
    });
    Promise.all(
      Object.keys(allDeps).map(name => packageJson(name).then((json) => {
        allDeps[json.name].latestVersion = json.version;
      }))
    ).then(() => {
      resolve({
        deps: Object.keys(prjPkgJson.dependencies || {}),
        devDeps: Object.keys(prjPkgJson.devDependencies || {}),
        allDeps,
      });
    }).catch(() => {
      resolve({
        deps: Object.keys(prjPkgJson.dependencies || {}),
        devDeps: Object.keys(prjPkgJson.devDependencies || {}),
        allDeps,
        hasError: true,
      });
    });
  });
}

module.exports = fetchDeps;
