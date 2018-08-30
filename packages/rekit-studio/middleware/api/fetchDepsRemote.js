'use strict';

const rekitCore = require('rekit-core');
const packageJson = require('package-json');
const helpers = require('../helpers');

// const tils = rekitCore.utils;

let latestVersionCache = {};
// Clear cache every 2 hours.
setInterval(() => {
  latestVersionCache = {};
}, 7200000);

function fetchDepsRemote() {
  return new Promise((resolve, reject) => {
    const prjRoot = rekitCore.utils.getProjectRoot();
    const prjPkgJson = helpers.forceRequire(rekitCore.utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
    const allDeps = Object.assign({}, prjPkgJson.dependencies, prjPkgJson.devDependencies);
    Object.keys(allDeps).forEach(key => {
      let installedVersion = '--';
      try {
        installedVersion = helpers.forceRequire(`${key}/package.json`).version; // eslint-disable-line
      } catch (e) {} // eslint-disable-line
      allDeps[key] = {
        requiredVersion: allDeps[key],
        installedVersion,
        latestVersion: 'TODO',
      };
    });
    Promise.all(
      Object.keys(allDeps).map(name => {
        if (latestVersionCache[name]) {
          allDeps[name].latestVersion = latestVersionCache[name];
          return Promise.resolve();
        }
        return packageJson(name).then(json => {
          allDeps[json.name].latestVersion = json.version;
          latestVersionCache[name] = json.version;
        });
      })
    )
      .then(() => {
        resolve({
          deps: Object.keys(prjPkgJson.dependencies || {}),
          devDeps: Object.keys(prjPkgJson.devDependencies || {}),
          allDeps,
        });
      })
      .catch(() => {
        resolve({
          deps: Object.keys(prjPkgJson.dependencies || {}),
          devDeps: Object.keys(prjPkgJson.devDependencies || {}),
          allDeps,
          hasError: true,
        });
      });
  });
}

module.exports = fetchDepsRemote;
