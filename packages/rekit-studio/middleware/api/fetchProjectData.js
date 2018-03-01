'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const rekitCore = require('rekit-core');

const app = rekitCore.app;
const utils = rekitCore.utils;

function mapRelPathForDepsByArr(arr) {
  arr.forEach((item) => {
    // Check if it has test
    if (item.file) {
      item.file = utils.getRelativePath(item.file);
      const testFile = item.file.replace(/^src\//, 'tests/').replace(/\.js$/, '.test.js');
      item.hasTest = /^src\//.test(item.file) && /\.js$/.test(item.file) && fs.existsSync(path.join(utils.getProjectRoot(), testFile));
    }
    if (item.children) mapRelPathForDepsByArr(item.children);
    if (item.deps) {
      mapRelPathForDepsByArr([].concat(
        item.deps.components,
        item.deps.actions,
        item.deps.misc,
        item.deps.constants
      ));
    }
  });
}

function fetchProjectData() {
  const fids = app.getFeatures();

  const features = fids.map(f => (Object.assign({
    key: f,
    type: 'feature',
    name: _.flow(_.lowerCase, _.upperFirst)(f),
  }, app.getFeatureStructure(f))));

  features.forEach((f) => {
    f.components.forEach((item) => {
      item.deps = app.getDeps(item.file);
    });
    mapRelPathForDepsByArr(f.components);

    f.actions.forEach((item) => {
      item.deps = app.getDeps(item.file);
    });

    f.misc.forEach((item) => {
      if (!item.children && /\.js$/.test(item.file)) item.deps = app.getDeps(item.file);
    });

    mapRelPathForDepsByArr(f.components);
    mapRelPathForDepsByArr(f.actions);
    mapRelPathForDepsByArr(f.misc);
  });

  const prjRoot = utils.getProjectRoot();
  const srcFiles = app.getSrcFiles(); // readDir(utils.joinPath(prjRoot, 'src'));
  mapRelPathForDepsByArr(srcFiles);

  const prjPkgJson = require(utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line
  const corePkg = utils.joinPath(prjRoot, 'node_modules/rekit-core/package.json');
  return {
    features,
    srcFiles,
    testCoverage: fs.existsSync(utils.joinPath(prjRoot, 'coverage/lcov-report/index.html')),
    projectRoot: prjRoot,
    projectName: prjPkgJson.name,
    rekit: Object.assign({}, prjPkgJson.rekit, {
      coreVersion: fs.existsSync(corePkg) ? require(corePkg).version : 'UNKNOWN', // eslint-disable-line
      studioVersion: require(utils.joinPath(__dirname, '../../package.json')).version, // eslint-disable-line
    }),
    cssExt: utils.getCssExt(),
  };
}

module.exports = fetchProjectData;
