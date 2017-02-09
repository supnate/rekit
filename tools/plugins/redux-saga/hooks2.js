'use strict';

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
const vio = rekitCore.vio;
const refactor = rekitCore.refactor;


function afterAddFeature(featureName) {
  // Summary:
  //  Called after a feature is added. Add sagas folder and add entry in rootSaga.js
  const prjRoot = utils.getProjectRoot();

  // Add entry to src/common/rootSaga.js
  const rootSaga = path.join(prjRoot, 'src/common/rootSaga.js');

  refactor.addImportLine(targetPath, `import * as ${_.camelCase(featureName)}Sagas from '../features/${_.kebabCase(featureName)}/redux/sagas';`);
  const lines = vio.getLines(targetPath);
  const i = refactor.lineIndex(lines, '].reduce', 'const sagas = [');
  lines.splice(i, 0, `  ${_.camelCase(featureName)}Sagas,`);
}

function afterRemoveFeature(featureName) {
  // Summary:
  //  Called after a feature is removed. Remove entry from rootSaga.js
  const prjRoot = utils.getProjectRoot();

  // Remove from common/rootSaga.js
  const targetPath = path.join(prjRoot, 'src/common/rootSaga.js');
  refactor.removeImportLine(targetPath, `../features/${_.kebabCase(featureName)}/redux/sagas`);
  const lines = vio.getLines(targetPath);
  refactor.removeLines(lines, `  ${_.camelCase(featureName)}Sagas,`);

  vio.save(targetPath, lines);
}

function afterMoveFeature() {
  // Summary:
  //  Called after a feature is renamed.
}

module.exports = {
  afterAddFeature,
  afterRemoveFeature,
  afterMoveFeature,
};
Contact GitHub API Training Shop Blog About
