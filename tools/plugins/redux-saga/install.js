'use strict';

// Summary:
//  Execute when the plugin is installed.

const path = require('path');
const shell = require('shelljs');
const vio = require('../../lib/vio');
const helpers = require('../../lib/helpers');
const refactor = require('../../lib/refactor');

function install(prjRoot, pluginRoot) {
  const rootSagaPath = path.join(prjRoot, 'src/common/rootSaga.js');

  // Check if saga plugin is already installed
  if (shell.test('-e', rootSagaPath)) {
    // helpers.fatalError('src/common/rootSaga.js already exists.');
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

  vio.save(configStorePath, lines);
}

const prjRoot = helpers.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

install(prjRoot, pluginRoot);
vio.flush();
module.exports = install;
