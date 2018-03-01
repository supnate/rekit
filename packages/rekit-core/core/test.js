'use strict';

/**
 * Unit test manager. Manages tests for actions/reducers and components. Usually used with action/component manager.
 * @module
**/

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
const refactor = require('./refactor');
const template = require('./template');

/**
 * Add the unit test boilerplate file for a component.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @param {Object} [args] - The args passed to rekit-core/template.
 * @param {string} [args.templateFile=Component.test.js] - The template file to create test file.

 * @alias module:test.add
 *
 * @example
 * const test = require('rekit-core').test;
 * test.add('home', 'Hello');
 *
 * // Result => Create the unit test boilerplate file at: 'tests/features/home/Hello.test.js'.
**/
function add(feature, component, args) {
  args = args || {};
  template.generate(utils.mapComponentTestFile(feature, component), Object.assign({}, args, {
    templateFile: args.templateFile || 'Component.test.js',
    context: Object.assign({ feature, component }, args.context || {}),
  }));
}

/**
 * Remove the unit test file for a component.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.

 * @alias module:test.remove
 *
 * @example
 * const test = require('rekit-core').test;
 * test.remove('home', 'Hello');
 *
 * // Result => Delete the test file of: 'tests/features/home/Hello.test.js'.
**/
function remove(feature, component) {
  vio.del(utils.mapComponentTestFile(feature, component));
}

/**
 * Move/rename the unit test file for a component.
 * @param {ElementArg} source - Which component test to move.
 * @param {ElementArg} target - The target location of the component test.

 * @alias module:test.move
**/
function move(source, target) {
  source.feature = _.kebabCase(source.feature);
  source.name = _.pascalCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.pascalCase(target.name);

  const srcPath = utils.mapComponentTestFile(source.feature, source.name);
  const targetPath = utils.mapComponentTestFile(target.feature, target.name);
  vio.move(srcPath, targetPath);

  const oldCssClass = `.${_.kebabCase(source.feature)}-${_.kebabCase(source.name)}`;
  const newCssClass = `.${_.kebabCase(target.feature)}-${_.kebabCase(target.name)}`;

  // Note: below string pattern binds to the test template, update here if template is changed.
  // Two styles of imports for component and high order component like page.
  const oldImportPath1 = `src/features/${_.kebabCase(source.feature)}`;
  const newImportPath1 = `src/features/${_.kebabCase(target.feature)}`;

  const oldImportPath2 = `src/features/${_.kebabCase(source.feature)}/${_.pascalCase(source.name)}`;
  const newImportPath2 = `src/features/${_.kebabCase(target.feature)}/${_.pascalCase(target.name)}`;

  // Try to update describe('xxx')
  const oldDescribe = `${_.kebabCase(source.feature)}/${_.pascalCase(source.name)}`;
  const newDescribe = `${_.kebabCase(target.feature)}/${_.pascalCase(target.name)}`;

  refactor.updateFile(targetPath, ast => [].concat(
    refactor.renameImportSpecifier(ast, source.name, target.name),
    refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
    refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
    refactor.renameStringLiteral(ast, oldDescribe, newDescribe),
    refactor.renameStringLiteral(ast, oldCssClass, newCssClass)
  ));
}

/**
 * Add the unit test boilerplate file for an action (using different templates for sync or async).
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.
 * @param {Object} [args] - The args passed to rekit-core/template.
 * @param {string} [args.templateFile=Component.test.js] - The template file to create test file.
 * @param {string} [args.isAsync=false] - Whether the action is async.

 * @alias module:test.addAction
 *
 * @example
 * const test = require('rekit-core').test;
 * test.addAction('home', 'doSomething', { isAsync: true });
 *
 * // Result => Create the unit test boilerplate file at: 'tests/features/home/redux/doSomething.test.js'.
**/
function addAction(feature, name, args) {
  args = args || {};
  const context = {
    feature,
    action: name,
  };
  if (args.isAsync) {
    context.actionTypes = utils.getAsyncActionTypes(feature, name);
  } else {
    context.actionType = args.actionType || utils.getActionType(feature, name);
  }
  template.generate(utils.mapReduxTestFile(feature, name), Object.assign({}, args, {
    templateFile: args.templateFile || (args.isAsync ? 'redux/async_action.test.js' : 'redux/action.test.js'),
    context: Object.assign(context, args.context || {}),
  }));
}

/**
 * Remove the unit test file for an action (either sync or async).
 * @param {string} feature - The feature name.
 * @param {string} name - The action name.

 * @alias module:test.removeAction
 *
**/
function removeAction(feature, name) {
  vio.del(utils.mapReduxTestFile(feature, name));
}

/**
 * Move/rename the unit test file for an action.
 * @param {ElementArg} source - Which action test to move.
 * @param {ElementArg} target - The target location of the action test.
 * @param {Object} [args] - Only used to indicates if it's async.
 * @param {Object} [args.isAsync=false] - Whether it's an async action.

 * @alias module:test.moveAction
**/
function moveAction(source, target, args) {
  args = args || {};
  source.feature = _.kebabCase(source.feature);
  source.name = _.camelCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.camelCase(target.name);

  const srcPath = utils.mapReduxTestFile(source.feature, source.name);
  const targetPath = utils.mapReduxTestFile(target.feature, target.name);
  vio.move(srcPath, targetPath);

  // Note: below string pattern binds to the test template, update here if template is changed.
  // For action/reducer import
  const oldImportPath1 = `src/features/${source.feature}/redux/${source.name}`;
  const newImportPath1 = `src/features/${target.feature}/redux/${target.name}`;

  // For constant import
  const oldImportPath2 = `src/features/${source.feature}/redux/constants`;
  const newImportPath2 = `src/features/${target.feature}/redux/constants`;

  // Try to update describe('xxx')
  const oldDescribe = `${source.feature}/redux/${source.name}`;
  const newDescribe = `${target.feature}/redux/${target.name}`;

  const ast = vio.getAst(targetPath);
  vio.assertAst(ast, targetPath);
  let changes = [].concat(
    refactor.renameImportSpecifier(ast, source.name, target.name),
    refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
    refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
    refactor.renameStringLiteral(ast, oldDescribe, newDescribe)
  );

  if (args.isAsync) {
    const oldActionTypes = utils.getAsyncActionTypes(source.feature, source.name);
    const newActionTypes = utils.getAsyncActionTypes(target.feature, target.name);

    const oldIt1 = `dispatches success action when ${_.camelCase(source.name)} succeeds`;
    const newIt1 = `dispatches success action when ${_.camelCase(target.name)} succeeds`;

    const oldIt2 = `dispatches failure action when ${_.camelCase(source.name)} fails`;
    const newIt2 = `dispatches failure action when ${_.camelCase(target.name)} fails`;

    const oldIt3 = `returns correct action by dismiss${_.pascalCase(source.name)}Error`;
    const newIt3 = `returns correct action by dismiss${_.pascalCase(target.name)}Error`;

    const oldIt4 = `handles action type ${oldActionTypes.begin} correctly`;
    const newIt4 = `handles action type ${newActionTypes.begin} correctly`;

    const oldIt5 = `handles action type ${oldActionTypes.success} correctly`;
    const newIt5 = `handles action type ${newActionTypes.success} correctly`;

    const oldIt6 = `handles action type ${oldActionTypes.failure} correctly`;
    const newIt6 = `handles action type ${newActionTypes.failure} correctly`;

    const oldIt7 = `handles action type ${oldActionTypes.dismissError} correctly`;
    const newIt7 = `handles action type ${newActionTypes.dismissError} correctly`;

    changes = changes.concat(
      refactor.renameImportSpecifier(ast, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(target.name)}Error`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.begin}`, `${newActionTypes.begin}`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.success}`, `${newActionTypes.success}`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.failure}`, `${newActionTypes.failure}`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.dismissError}`, `${newActionTypes.dismissError}`),
      refactor.renameStringLiteral(ast, oldIt1, newIt1),
      refactor.renameStringLiteral(ast, oldIt2, newIt2),
      refactor.renameStringLiteral(ast, oldIt3, newIt3),
      refactor.renameStringLiteral(ast, oldIt4, newIt4),
      refactor.renameStringLiteral(ast, oldIt5, newIt5),
      refactor.renameStringLiteral(ast, oldIt6, newIt6),
      refactor.renameStringLiteral(ast, oldIt7, newIt7)
    );
  } else {
    // Try to update it('xxx') for sync action, bound to the templates

    const oldActionType = utils.getActionType(source.feature, source.name);
    const newActionType = utils.getActionType(target.feature, target.name);
    const oldIt1 = `returns correct action by ${source.name}`;
    const newIt1 = `returns correct action by ${target.name}`;

    const oldIt2 = `handles action type ${oldActionType} correctly`;
    const newIt2 = `handles action type ${newActionType} correctly`;
    changes = changes.concat(
      refactor.renameStringLiteral(ast, oldIt1, newIt1),
      refactor.renameStringLiteral(ast, oldIt2, newIt2),
      refactor.renameImportSpecifier(ast, oldActionType, newActionType)
    );
  }
  let code = vio.getContent(targetPath);
  code = refactor.updateSourceCode(code, changes);
  vio.save(targetPath, code);
}

module.exports = {
  add,
  remove,
  move,
  addAction,
  removeAction,
  moveAction,
};
