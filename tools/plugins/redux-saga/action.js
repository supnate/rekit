'use strict';

// Summary:
//  This plugin allows to use saga for redux async actions rather than
//  redux-thunk by default. It overrides the action management provided by rekit-core.

const path = require('path');
const _ = require('lodash');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
const refactor = rekitCore.refactor;
const test = rekitCore.test;
const action = rekitCore.action;

_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

function add(feature, name, args) {
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
  feature = _.kebabCase(feature);
  name = _.camelCase(name);

  // Saga action is similar with default async action except the template.
  rekitCore.removeAction(feature, name);

  // Remove from sagas.js
  const sagasEntry = utils.mapFeatureFile(feature, 'redux/sagas.js');
  refactor.removeImportBySource(sagasEntry, `./${name}`);
}

function move(source, target) {
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

module.exports = {
  add,
  remove,
  move,
};
