'use strict';

// Summary:
//  Execute when the plugin is uninstall

const path = require('path');
const vio = require('../../lib/vio');
const utils = require('../../lib/utils');
const refactor = require('../../lib/refactor');

function uninstall(prjRoot) {
  // Delete src/common/rootSaga.js
  const rootSagaPath = path.join(prjRoot, 'src/common/rootSaga.js');
  vio.del(rootSagaPath);

  const configStorePath = path.join(prjRoot, 'src/common/configStore.js');
  const lines = vio.getLines(configStorePath);

  // Remove import saga modules
  refactor.removeLines(lines, 'import createSagaMiddleware from \'redux-saga\';');
  refactor.removeLines(lines, 'import rootSaga from \'./rootSaga\';');

  // Remove const sagaMiddleWare = createSagaMiddleware();
  refactor.removeLines(lines, 'const sagaMiddleWare = createSagaMiddleware();');

  // Remove from middlewares
  refactor.removeLines(lines, '  sagaMiddleWare,');

  // Remove sagaMiddleWare.run(rootSaga);
  refactor.removeLines(lines, '  sagaMiddleWare.run(rootSaga);');

  vio.save(configStorePath, lines);
}

const prjRoot = utils.getProjectRoot();
const pluginRoot = path.join(prjRoot, 'tools/plugins/redux-saga');

uninstall(prjRoot, pluginRoot);
vio.flush();

module.exports = uninstall;
