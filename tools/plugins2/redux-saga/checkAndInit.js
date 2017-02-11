'use strict';

// Summary:
//  Execute when the plugin is installed.

const path = require('path');
const shell = require('shelljs');
const rekitCore = require('rekit-core');
const afterAddFeature = require('./hooks').afterAddFeature;

const vio = rekitCore.vio;
const utils = rekitCore.utils;
const refactor = rekitCore.refactor;

function checkAndInit() {
  const rootSagaPath = utils.mapSrcFile('common/rootSaga.js');

  // Check if saga plugin is already installed
  if (shell.test('-e', rootSagaPath)) {
    return;
  }

  // Create src/common/rootSaga.js
  const content = vio.getContent(path.join(__dirname, 'templates/rootSaga.js'));
  vio.save(rootSagaPath, content);

  // Apply redux-saga middleware
  const configStorePath = utils.mapSrcFile('common/configStore.js');

  // Import saga modulesinit
  refactor.updateFile(configStorePath, ast => [].concat(
    refactor.addImportFrom(ast, 'redux-saga', 'createSagaMiddleware'),
    refactor.addImportFrom(ast, './rootSaga', 'rootSaga'),
    refactor.addToArray(ast, 'middlewares', 'sagaMiddleware')
  ));

  // Add const sagaMiddleWare = createSagaMiddleware();
  const lines = vio.getLines(configStorePath);
  let i = refactor.lastLineIndex(lines, /^import/);
  lines.splice(i + 1, 0, '', 'const sagaMiddleware = createSagaMiddleware();');

  // Add sagaMiddleWare.run(rootSaga);
  i = refactor.lineIndex(lines, 'return store;');
  lines.splice(i, 0, '  sagaMiddleware.run(rootSaga);');

  // Init existing features
  utils.getFeatures().forEach(afterAddFeature);

  vio.save(configStorePath, lines);
}

checkAndInit();

module.exports = checkAndInit;
