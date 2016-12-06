'use strict';

// Summary:
//  Execute when the plugin is installed.

const path = require('path');
const shell = require('shelljs');
const vio = require('../../lib/vio');
const utils = require('../../lib/utils');
const refactor = require('../../lib/refactor');
const afterAddFeature = require('./hooks').afterAddFeature;

function install(prjRoot, pluginRoot) {
  const rootSagaPath = path.join(prjRoot, 'src/common/rootSaga.js');

  // Check if saga plugin is already installed
  if (shell.test('-e', rootSagaPath)) {
    // utils.fatalError('src/common/rootSaga.js already exists.');
  }

  // Create src/common/rootSaga.js
  const content = vio.getContent(path.join(pluginRoot, 'templates/rootSaga.js'));
  vio.save(rootSagaPath, content);

  // Apply redux-saga middleware
  const configStorePath = path.join(prjRoot, 'src/common/configStore.js');

  // Import saga modules
  const lines = vio.getLines(configStorePath);
  refactor.addImportLine(lines, 'import createSagaMiddleware from \'redux-saga\';');
  refactor.addImportLine(lines, 'import rootSaga from \'./rootSaga\';');

  // Add const sagaMiddleWare = createSagaMiddleware();
  let i = refactor.lineIndex(lines, 'const middlewares = ');
  lines.splice(i, 0, 'const sagaMiddleWare = createSagaMiddleware();');

  // Add to middlewares
  i = refactor.lineIndex(lines, '];', i);
  lines.splice(i, 0, '  sagaMiddleWare,');

  // Add sagaMiddleWare.run(rootSaga);
  i = refactor.lineIndex(lines, 'return store;');
  lines.splice(i, 0, '  sagaMiddleWare.run(rootSaga);');

  // Init existing features
  // NOTE: sagas folder will not be deleted from features folders to avoid accident deletion
  utils.getFeatures().forEach(afterAddFeature);

  vio.save(configStorePath, lines);
}

const prjRoot = utils.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

install(prjRoot, pluginRoot);
vio.flush();
module.exports = install;
