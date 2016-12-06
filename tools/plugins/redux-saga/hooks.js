'use strict';

const path = require('path');
const utils = require('../../lib/utils');
const vio = require('../../lib/vio');
const refactor = require('../../lib/refactor');

const prjRoot = utils.getProjectRoot();

function afterAddFeature(featureName) {
  // Summary:
  //  Called after a feature is added. Add sagas folder and add entry in rootSaga.js

  let targetPath;
  // Add sagas folder to the feature, and add index.js in it.
  targetPath = utils.mapFile(featureName, 'redux/sagas/index.js');
  vio.save(targetPath, '\n');

  // Add entry to src/common/rootSaga.js
  targetPath = path.join(prjRoot, 'src/common/rootSaga.js');
  refactor.addImportLine(targetPath, `import * as ${featureName}Sagas from '../features/${featureName}/redux/sagas';`);
  const lines = vio.getLines(targetPath);
  const i = refactor.lineIndex(lines, '].reduce', 'const sagas = [');
  lines.splice(i, 0, `  ${featureName}Sagas,`);
}

function afterRemoveFeature(featureName) {
  // Summary:
  //  Called after a feature is removed. Remove entry from rootSaga.js

  // Remove from common/rootSaga.js
  const targetPath = path.join(prjRoot, 'src/common/rootSaga.js');
  refactor.removeImportLine(targetPath, `../features/${featureName}/redux/sagas`);
  const lines = vio.getLines(targetPath);
  refactor.removeLines(lines, `  ${featureName}Sagas,`);

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
