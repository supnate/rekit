'use strict';

// Summary:
//  This plugin allows to use redux-saga for redux async actions rather than
//  redux-thunk by default. It overrides the action management provided by rekit-core.
//  And it delegates action mgmt to rekit-core if it's sync.

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

module.exports = function(rekitCore) {
  const app = rekitCore.app;
  const utils = rekitCore.utils;
  const refactor = rekitCore.refactor;
  const test = rekitCore.test;
  const action = rekitCore.action;
  const vio = rekitCore.vio;

  const afterAddFeature = require('./hooks')(rekitCore).afterAddFeature;

  function ensureInit() {
    // Summary
    //  Init the project to be ready for redux-saga
    const rootSagaPath = utils.mapSrcFile('common/rootSaga.js');

    // Check if saga plugin is already installed
    if (fs.existsSync(rootSagaPath)) {
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
    console.log(app.getFeatures().forEach);
    app.getFeatures().forEach(afterAddFeature);

    vio.save(configStorePath, lines);
  }

  function add(feature, name, args) {
    ensureInit();
    feature = _.kebabCase(feature);
    name = _.camelCase(name);

    args = args || {};
    if (!args.async || args.thunk) {
      // Use default behavior if it's a sync action or asyn action with thunk by default.
      rekitCore.addAction(feature, name, args);
      return;
    }

    // Saga action is similar with async action except the template.
    action.addAsync(feature, name, {
      templateFile: path.join(__dirname, 'templates/async_action_saga.js'),
    });

    // Add to redux/sagas.js
    const sagasEntry = utils.mapFeatureFile(feature, 'redux/sagas.js');
    refactor.addExportFrom(sagasEntry, `./${name}`, null, `watch${_.pascalCase(name)}`);

    // Add saga test
    test.addAction(feature, name, {
      templateFile: path.join(__dirname, 'templates/async_action_saga.test.js'),
      isAsync: true,
    });
  }

  function remove(feature, name) {
    ensureInit();
    feature = _.kebabCase(feature);
    name = _.camelCase(name);

    // Saga action is similar with default async action except the template.
    rekitCore.removeAction(feature, name);

    // Remove from sagas.js
    const sagasEntry = utils.mapFeatureFile(feature, 'redux/sagas.js');
    refactor.removeImportBySource(sagasEntry, `./${name}`);
  }

  function move(source, target) {
    ensureInit();
    rekitCore.moveAction(source, target);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    target.feature = _.kebabCase(target.feature);
    target.name = _.camelCase(target.name);

    let targetPath;
    // rename saga function name
    targetPath = utils.mapFeatureFile(target.feature, `redux/${target.name}.js`);
    refactor.updateFile(targetPath, ast => [].concat(
      refactor.renameFunctionName(ast, `do${_.pascalCase(source.name)}`, `do${_.pascalCase(target.name)}`),
      refactor.renameFunctionName(ast, `watch${_.pascalCase(source.name)}`, `watch${_.pascalCase(target.name)}`)
    ));

    // rename saga function name in test.js
    targetPath = utils.mapTestFile(target.feature, `redux/${target.name}.test.js`);
    refactor.renameImportSpecifier(targetPath, `do${_.pascalCase(source.name)}`, `do${_.pascalCase(target.name)}`);

    if (source.feature === target.feature) {
      targetPath = utils.mapFeatureFile(target.feature, 'redux/sagas.js');
      refactor.updateFile(targetPath, ast => [].concat(
        refactor.renameExportSpecifier(ast, `watch${_.pascalCase(source.name)}`, `watch${_.pascalCase(target.name)}`),
        refactor.renameModuleSource(ast, `./${source.name}`, `./${target.name}`)
      ));
    } else {
      targetPath = utils.mapFeatureFile(source.feature, 'redux/sagas.js');
      refactor.removeImportBySource(targetPath, `./${source.name}`);
      targetPath = utils.mapFeatureFile(target.feature, 'redux/sagas.js');
      refactor.addExportFrom(targetPath, `./${target.name}`, null, `watch${_.pascalCase(target.name)}`);
    }
  }

  return {
    add,
    remove,
    move,
  };
}
