'use strict';

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
const constant = require('./constant');
const refactor = require('./refactor');
const template = require('./template');
const entry = require('./entry');

module.exports = {
  add(feature, name, args) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(name, 'action name');
    utils.assertFeatureExist(feature);

    // create component from template
    args = args || {};
    const actionType = args.actionType || utils.getActionType(feature, name);
    template.create(utils.getReduxFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'action.js',
      context: Object.assign({
        feature,
        actionType,
        action: name,
      }, args.context || {}),
    }));

    constant.add(feature, actionType);
    entry.addToReducer(feature, name);
    entry.addToActions(feature, name);
  },

  remove(feature, name, actionType) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(name, 'action name');
    utils.assertFeatureExist(feature);

    actionType = actionType || utils.getActionType(feature, name);
    vio.del(utils.getReduxFile(feature, name));
    constant.remove(feature, actionType);
    entry.removeFromReducer(feature, name);
    entry.removeFromActions(feature, name);
  },

  move(source, dest) {
    utils.assertNotEmpty(source.feature, 'feature');
    utils.assertNotEmpty(source.name, 'action name');
    utils.assertFeatureExist(source.feature);
    utils.assertNotEmpty(dest.feature, 'feature');
    utils.assertNotEmpty(dest.name, 'action name');
    utils.assertFeatureExist(dest.feature);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = utils.getReduxFile(source.feature, source.name);
    const destPath = utils.getReduxFile(dest.feature, dest.name);
    vio.move(srcPath, destPath);

    const oldActionType = utils.getActionType(source.feature, source.name);
    const newActionType = utils.getActionType(dest.feature, dest.name);

    refactor.updateFile(destPath, ast => [].concat(
      refactor.renameFunctionName(ast, source.name, dest.name),
      refactor.renameImportSpecifier(ast, oldActionType, newActionType)
    ));

    if (source.feature === dest.feature) {
      entry.renameInActions(source.feature, source.name, dest.name);
      // update the import path in actions.js
      const targetPath = utils.getReduxFile(source.feature, 'actions');
      utils.replaceStringLiteral(targetPath, `./${source.name}`, `./${dest.name}`);

      entry.renameInReducer(source.feature, source.name, dest.name);
      constant.rename(source.feature, oldActionType, newActionType);
    } else {
      entry.removeFromActions(source.feature, source.name);
      entry.addToActions(dest.feature, dest.name);

      entry.removeFromReducer(source.feature, source.name);
      entry.addToReducer(dest.feature, dest.name);

      constant.remove(source.feature, oldActionType);
      constant.add(dest.feature, newActionType);
    }
  },

  addAsync(feature, name, args) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(name, 'action name');
    utils.assertFeatureExist(feature);

    // const upperSnakeActionName = _.upperSnakeCase(name);
    const actionTypes = utils.getAsyncActionTypes(feature, name);

    args = args || {};
    template.create(utils.getReduxFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'async_action.js',
      context: Object.assign({
        feature,
        actionTypes,
        action: name,
      }, args.context || {}),
    }));

    constant.add(feature, actionTypes.begin);
    constant.add(feature, actionTypes.success);
    constant.add(feature, actionTypes.failure);
    constant.add(feature, actionTypes.dismissError);

    entry.addToActions(feature, name);
    entry.addToActions(feature, `dismiss${_.pascalCase(name)}Error`, name);
    entry.addToReducer(feature, name);
    entry.addToInitialState(feature, `${_.camelCase(name)}Pending`, 'false');
    entry.addToInitialState(feature, `${_.camelCase(name)}Error`, 'null');
  },

  removeAsync(feature, name) {
    utils.assertNotEmpty(feature, 'feature');
    utils.assertNotEmpty(name, 'action name');
    utils.assertFeatureExist(feature);

    // const upperSnakeActionName = _.upperSnakeCase(name);
    const actionTypes = utils.getAsyncActionTypes(feature, name);

    vio.del(utils.getReduxFile(feature, name));
    constant.remove(feature, actionTypes.begin);
    constant.remove(feature, actionTypes.success);
    constant.remove(feature, actionTypes.failure);
    constant.remove(feature, actionTypes.dismissError);

    entry.removeFromActions(feature, null, name);
    entry.removeFromReducer(feature, name);
    entry.removeFromInitialState(feature, `${_.camelCase(name)}Pending`, 'false');
    entry.removeFromInitialState(feature, `${_.camelCase(name)}Error`, 'null');
  },

  moveAsync(source, dest) {
    utils.assertNotEmpty(source.feature, 'feature');
    utils.assertNotEmpty(source.name, 'action name');
    utils.assertFeatureExist(source.feature);
    utils.assertNotEmpty(dest.feature, 'feature');
    utils.assertNotEmpty(dest.name, 'action name');
    utils.assertFeatureExist(dest.feature);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = utils.getReduxFile(source.feature, source.name);
    const destPath = utils.getReduxFile(dest.feature, dest.name);
    vio.move(srcPath, destPath);

    const oldActionTypes = utils.getAsyncActionTypes(source.feature, source.name);
    const newActionTypes = utils.getAsyncActionTypes(dest.feature, dest.name);

    // Update the action file: rename function name and action types
    refactor.updateFile(destPath, ast => [].concat(
      refactor.renameFunctionName(ast, source.name, dest.name),
      refactor.renameFunctionName(ast, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(dest.name)}Error`),
      refactor.renameImportSpecifier(ast, oldActionTypes.begin, newActionTypes.begin),
      refactor.renameImportSpecifier(ast, oldActionTypes.success, newActionTypes.success),
      refactor.renameImportSpecifier(ast, oldActionTypes.failure, newActionTypes.failure),
      refactor.renameImportSpecifier(ast, oldActionTypes.dismissError, newActionTypes.dismissError)
    ));

    if (source.feature === dest.feature) {
      // If in same feature, update entries
      entry.renameInActions(source.feature, source.name, dest.name);
      entry.renameInActions(source.feature, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(dest.name)}Error`);
      entry.renameInReducer(source.feature, source.name, dest.name);

      entry.renameInInitialState(source.feature, `${source.name}Pending`, `${dest.name}Pending`);
      entry.renameInInitialState(source.feature, `${source.name}Error`, `${dest.name}Error`);

      // Update the import path in actions.js
      const targetPath = utils.getReduxFile(source.feature, 'actions');
      refactor.updateFile(targetPath, ast => refactor.renameStringLiteral(ast, `./${source.name}`, `./${dest.name}`));

      constant.rename(source.feature, oldActionTypes.begin, newActionTypes.begin);
      constant.rename(source.feature, oldActionTypes.success, newActionTypes.success);
      constant.rename(source.feature, oldActionTypes.failure, newActionTypes.failure);
      constant.rename(source.feature, oldActionTypes.dismissError, newActionTypes.dismissError);
    } else {
      // If moved to another feature, remove from entries first, then add to the new entry files
      entry.removeFromActions(source.feature, null, source.name);
      entry.removeFromReducer(source.feature, source.name);
      entry.removeFromInitialState(source.feature, `${source.name}Pending`, 'false');
      entry.removeFromInitialState(source.feature, `${source.name}Error`, 'null');

      entry.addToActions(dest.feature, dest.name);
      entry.addToActions(dest.feature, `dismiss${_.pascalCase(dest.name)}Error`, dest.name);
      entry.addToReducer(dest.feature, dest.name);
      entry.addToInitialState(dest.feature, `${dest.name}Pending`, 'false');
      entry.addToInitialState(dest.feature, `${dest.name}Error`, 'null');

      constant.remove(source.feature, oldActionTypes.begin);
      constant.remove(source.feature, oldActionTypes.success);
      constant.remove(source.feature, oldActionTypes.failure);
      constant.remove(source.feature, oldActionTypes.dismissError);

      constant.add(dest.feature, newActionTypes.begin);
      constant.add(dest.feature, newActionTypes.success);
      constant.add(dest.feature, newActionTypes.failure);
      constant.add(dest.feature, newActionTypes.dismissError);
    }
  },
};
