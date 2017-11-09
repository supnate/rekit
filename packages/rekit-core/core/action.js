'use strict';

/**
 * Action manager. Exports APIs to create/move/rename/remove actions or async actions.
 * @module
**/

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
const constant = require('./constant');
const refactor = require('./refactor');
const template = require('./template');
const entry = require('./entry');
const assert = require('./assert');

/**
 * Add an async action
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.
 * @param {object} args - Other arguments.
 * @alias module:action.addAsync
**/
function addAsync(feature, name, args) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(name, 'action name');
  assert.featureExist(feature);

  const actionTypes = utils.getAsyncActionTypes(feature, name);

  args = args || {};
  template.generate(utils.mapReduxFile(feature, name), Object.assign({}, args, {
    templateFile: args.templateFile || 'redux/async_action.js',
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
}

/**
 * Remove an async action
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.
 * @alias module:action.removeAsync
**/
function removeAsync(feature, name) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(name, 'action name');
  assert.featureExist(feature);

  // const upperSnakeActionName = _.upperSnakeCase(name);
  const actionTypes = utils.getAsyncActionTypes(feature, name);

  vio.del(utils.mapReduxFile(feature, name));
  constant.remove(feature, actionTypes.begin);
  constant.remove(feature, actionTypes.success);
  constant.remove(feature, actionTypes.failure);
  constant.remove(feature, actionTypes.dismissError);

  entry.removeFromActions(feature, null, name);
  entry.removeFromReducer(feature, name);
  entry.removeFromInitialState(feature, `${_.camelCase(name)}Pending`, 'false');
  entry.removeFromInitialState(feature, `${_.camelCase(name)}Error`, 'null');
}

/**
 * Move/rename an async action
 * @param {ElementArg} source - Which async action to move.
 * @param {ElementArg} target - The target place of the async action.
 * @alias module:action.moveAsync
**/
function moveAsync(source, target) {
  assert.notEmpty(source.feature, 'feature');
  assert.notEmpty(source.name, 'action name');
  assert.featureExist(source.feature);
  assert.notEmpty(target.feature, 'feature');
  assert.notEmpty(target.name, 'action name');
  assert.featureExist(target.feature);

  source.feature = _.kebabCase(source.feature);
  source.name = _.camelCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.camelCase(target.name);

  const srcPath = utils.mapReduxFile(source.feature, source.name);
  const destPath = utils.mapReduxFile(target.feature, target.name);
  vio.move(srcPath, destPath);

  const oldActionTypes = utils.getAsyncActionTypes(source.feature, source.name);
  const newActionTypes = utils.getAsyncActionTypes(target.feature, target.name);

  // Update the action file: rename function name and action types
  refactor.updateFile(destPath, ast => [].concat(
    refactor.renameFunctionName(ast, source.name, target.name),
    refactor.renameFunctionName(ast, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(target.name)}Error`),
    refactor.renameImportSpecifier(ast, oldActionTypes.begin, newActionTypes.begin),
    refactor.renameImportSpecifier(ast, oldActionTypes.success, newActionTypes.success),
    refactor.renameImportSpecifier(ast, oldActionTypes.failure, newActionTypes.failure),
    refactor.renameImportSpecifier(ast, oldActionTypes.dismissError, newActionTypes.dismissError)
  ));
  if (source.feature === target.feature) {
    // Update names in actions.js
    entry.renameInActions(source.feature, source.name, target.name);
    entry.renameInActions(source.feature, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(target.name)}Error`, target.name);

    // Update names in reducer.js
    entry.renameInReducer(source.feature, source.name, target.name);

    // Update names in initialState.js
    entry.renameInInitialState(source.feature, `${source.name}Pending`, `${target.name}Pending`);
    entry.renameInInitialState(source.feature, `${source.name}Error`, `${target.name}Error`);

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

    entry.addToActions(target.feature, target.name);
    entry.addToActions(target.feature, `dismiss${_.pascalCase(target.name)}Error`, target.name);
    entry.addToReducer(target.feature, target.name);
    entry.addToInitialState(target.feature, `${target.name}Pending`, 'false');
    entry.addToInitialState(target.feature, `${target.name}Error`, 'null');

    constant.remove(source.feature, oldActionTypes.begin);
    constant.remove(source.feature, oldActionTypes.success);
    constant.remove(source.feature, oldActionTypes.failure);
    constant.remove(source.feature, oldActionTypes.dismissError);

    constant.add(target.feature, newActionTypes.begin);
    constant.add(target.feature, newActionTypes.success);
    constant.add(target.feature, newActionTypes.failure);
    constant.add(target.feature, newActionTypes.dismissError);
  }
}

/**
 * Add an action
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.
 * @param {object} args - Other arguments.
 * @alias module:action.add
**/
function add(feature, name, args) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(name, 'action name');
  assert.featureExist(feature);

  args = args || {};
  if (args.async) {
    addAsync(feature, name, args);
    return;
  }
  feature = _.kebabCase(feature);
  name = _.camelCase(name);
  // create component from template
  const actionType = utils.getActionType(feature, name);
  template.generate(utils.mapReduxFile(feature, name), Object.assign({}, args, {
    templateFile: args.templateFile || 'redux/action.js',
    context: Object.assign({
      feature,
      actionType,
      action: name,
    }, args.context || {}),
  }));

  constant.add(feature, actionType);
  entry.addToReducer(feature, name);
  entry.addToActions(feature, name);
}

/**
 * Remove an action
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.
 * @alias module:action.remove
**/
function remove(feature, name, actionType) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(name, 'action name');
  assert.featureExist(feature);

  const targetPath = utils.mapReduxFile(feature, name);
  // if (_.get(refactor.getRekitProps(targetPath), 'action.isAsync')) {
  //   removeAsync(feature, name);
  //   return;
  // }

  feature = _.kebabCase(feature);
  name = _.camelCase(name);

  actionType = utils.getActionType(feature, name);
  vio.del(targetPath);
  constant.remove(feature, actionType);
  entry.removeFromReducer(feature, name);
  entry.removeFromActions(feature, name);
}

/**
 * Move/rename an action
 * @param {ElementArg} source - Which async action to move.
 * @param {ElementArg} target - The target place of the async action.
 * @alias module:action.move
**/
function move(source, target) {
  assert.notEmpty(source.feature, 'feature');
  assert.notEmpty(source.name, 'action name');
  assert.featureExist(source.feature);
  assert.notEmpty(target.feature, 'feature');
  assert.notEmpty(target.name, 'action name');
  assert.featureExist(target.feature);

  // const targetPath = utils.mapReduxFile(source.feature, source.name);
  // if (_.get(refactor.getRekitProps(targetPath), 'action.isAsync')) {
  //   moveAsync(source, target);
  //   return;
  // }

  source.feature = _.kebabCase(source.feature);
  source.name = _.camelCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.camelCase(target.name);

  const srcPath = utils.mapReduxFile(source.feature, source.name);
  const destPath = utils.mapReduxFile(target.feature, target.name);
  vio.move(srcPath, destPath);

  const oldActionType = utils.getActionType(source.feature, source.name);
  const newActionType = utils.getActionType(target.feature, target.name);

  refactor.updateFile(destPath, ast => [].concat(
    refactor.renameFunctionName(ast, source.name, target.name),
    refactor.renameImportSpecifier(ast, oldActionType, newActionType)
  ));

  if (source.feature === target.feature) {
    entry.renameInActions(source.feature, source.name, target.name);
    // update the import path in actions.js
    // const targetPath = utils.mapReduxFile(source.feature, 'actions');
    // refactor.renameModuleSource(targetPath, `./${source.name}`, `./${target.name}`);

    entry.renameInReducer(source.feature, source.name, target.name);
    constant.rename(source.feature, oldActionType, newActionType);
  } else {
    entry.removeFromActions(source.feature, source.name);
    entry.addToActions(target.feature, target.name);

    entry.removeFromReducer(source.feature, source.name);
    entry.addToReducer(target.feature, target.name);

    constant.remove(source.feature, oldActionType);
    constant.add(target.feature, newActionType);
  }
}

module.exports = {
  add,
  remove,
  move,
  addAsync,
  removeAsync,
  moveAsync,
};
