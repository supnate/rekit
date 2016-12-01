'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const vio = require('./vio');
const constant = require('./constant');
const refactor = require('./refactor');
const template = require('./template');
const entry = require('./entry');

module.exports = {
  add(feature, name, args) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    // create component from template
    args = args || {};
    const actionType = args.actionType || name;
    template.create(helpers.getReduxFile(feature, name), Object.assign({}, args, {
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
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    actionType = actionType || name;
    vio.del(helpers.getReduxFile(feature, name));
    constant.remove(feature, actionType);
    entry.removeFromReducer(feature, name);
    entry.removeFromActions(feature, name);
  },

  move(source, dest) {
    helpers.assertNotEmpty(source.feature, 'feature');
    helpers.assertNotEmpty(source.name, 'action name');
    helpers.assertFeatureExist(source.feature);
    helpers.assertNotEmpty(dest.feature, 'feature');
    helpers.assertNotEmpty(dest.name, 'action name');
    helpers.assertFeatureExist(dest.feature);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = helpers.getReduxFile(source.feature, source.name);
    const destPath = helpers.getReduxFile(dest.feature, dest.name);
    vio.mv(srcPath, destPath);

    const oldActionType = _.upperSnakeCase(source.name);
    const newActionType = _.upperSnakeCase(dest.name);
    const ast = vio.getAst(destPath);
    const changes = [].concat(
      refactor.renameFunctionName(ast, source.name, dest.name),
      refactor.renameImportSpecifier(ast, oldActionType, newActionType)
    );
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);

    if (source.feature === dest.feature) {
      entry.renameInActions(source.feature, source.name, dest.name);
      // update the import path in actions.js
      const targetPath = helpers.getReduxFile(source.feature, 'actions');
      helpers.replaceStringLiteral(targetPath, `./${source.name}`, `./${dest.name}`);

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
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    const upperSnakeActionName = _.upperSnakeCase(name);

    args = args || {};
    template.create(helpers.getReduxFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'async_action.js',
      context: Object.assign({
        feature,
        action: name,
        CAMEL_ACTION_NAME: _.camelCase(name),
        BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
        SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
        FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
        DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
      }, args.context || {}),
    }));

    constant.add(feature, `${upperSnakeActionName}_BEGIN`);
    constant.add(feature, `${upperSnakeActionName}_SUCCESS`);
    constant.add(feature, `${upperSnakeActionName}_FAILURE`);
    constant.add(feature, `${upperSnakeActionName}_DISMISS_ERROR`);

    entry.addToActions(feature, name);
    entry.addToActions(feature, `dismiss${_.pascalCase(name)}Error`, name);
    entry.addToReducer(feature, name);
    entry.addToInitialState(feature, `${_.camelCase(name)}Pending`, 'false');
    entry.addToInitialState(feature, `${_.camelCase(name)}Error`, 'null');
  },

  removeAsync(feature, name) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(name, 'action name');
    helpers.assertFeatureExist(feature);

    const upperSnakeActionName = _.upperSnakeCase(name);

    vio.del(helpers.getReduxFile(feature, name));
    constant.remove(feature, `${upperSnakeActionName}_BEGIN`);
    constant.remove(feature, `${upperSnakeActionName}_SUCCESS`);
    constant.remove(feature, `${upperSnakeActionName}_FAILURE`);
    constant.remove(feature, `${upperSnakeActionName}_DISMISS_ERROR`);

    entry.removeFromActions(feature, null, name);
    entry.removeFromReducer(feature, name);
    entry.removeFromInitialState(feature, `${_.camelCase(name)}Pending`, 'false');
    entry.removeFromInitialState(feature, `${_.camelCase(name)}Error`, 'null');
  },

  moveAsync(source, dest) {
    helpers.assertNotEmpty(source.feature, 'feature');
    helpers.assertNotEmpty(source.name, 'action name');
    helpers.assertFeatureExist(source.feature);
    helpers.assertNotEmpty(dest.feature, 'feature');
    helpers.assertNotEmpty(dest.name, 'action name');
    helpers.assertFeatureExist(dest.feature);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = helpers.getReduxFile(source.feature, source.name);
    const destPath = helpers.getReduxFile(dest.feature, dest.name);
    vio.mv(srcPath, destPath);

    const oldUpperSnakeName = _.upperSnakeCase(source.name);
    const newUpperSnakeName = _.upperSnakeCase(dest.name);

    const ast = vio.getAst(destPath);
    const changes = [].concat(
      refactor.renameFunctionName(ast, source.name, dest.name),
      refactor.renameFunctionName(ast, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(dest.name)}Error`),
      refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_BEGIN`, `${newUpperSnakeName}_BEGIN`),
      refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_SUCCESS`, `${newUpperSnakeName}_SUCCESS`),
      refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_FAILURE`, `${newUpperSnakeName}_FAILURE`),
      refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_DISMISS_ERROR`, `${newUpperSnakeName}_DISMISS_ERROR`)
    );
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);

    if (source.feature === dest.feature) {
      entry.renameInActions(source.feature, source.name, dest.name);
      entry.renameInActions(source.feature, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(dest.name)}Error`);
      entry.renameInReducer(source.feature, source.name, dest.name);

      entry.renameInInitialState(source.feature, `${source.name}Pending`, `${dest.name}Pending`);
      entry.renameInInitialState(source.feature, `${source.name}Error`, `${dest.name}Error`);

      // update the import path in actions.js
      const targetPath = helpers.getReduxFile(source.feature, 'actions');
      helpers.replaceStringLiteral(targetPath, `./${source.name}`, `./${dest.name}`);

      constant.rename(source.feature, `${oldUpperSnakeName}_BEGIN`, `${newUpperSnakeName}_BEGIN`);
      constant.rename(source.feature, `${oldUpperSnakeName}_SUCCESS`, `${newUpperSnakeName}_SUCCESS`);
      constant.rename(source.feature, `${oldUpperSnakeName}_FAILURE`, `${newUpperSnakeName}_FAILURE`);
      constant.rename(source.feature, `${oldUpperSnakeName}_DISMISS_ERROR`, `${newUpperSnakeName}_DISMISS_ERROR`);
    } else {
      entry.removeFromActions(source.feature, null, source.name);
      entry.removeFromReducer(source.feature, source.name);
      entry.removeFromInitialState(source.feature, `${source.name}Pending`, 'false');
      entry.removeFromInitialState(source.feature, `${source.name}Error`, 'null');

      entry.addToActions(dest.feature, dest.name);
      entry.addToActions(dest.feature, `dismiss${_.pascalCase(dest.name)}Error`, dest.name);
      entry.addToReducer(dest.feature, dest.name);
      entry.addToInitialState(dest.feature, `${dest.name}Pending`, 'false');
      entry.addToInitialState(dest.feature, `${dest.name}Error`, 'null');

      constant.remove(source.feature, `${oldUpperSnakeName}_BEGIN`);
      constant.remove(source.feature, `${oldUpperSnakeName}_SUCCESS`);
      constant.remove(source.feature, `${oldUpperSnakeName}_FAILURE`);
      constant.remove(source.feature, `${oldUpperSnakeName}_DISMISS_ERROR`);
      constant.add(dest.feature, `${newUpperSnakeName}_BEGIN`);
      constant.add(dest.feature, `${newUpperSnakeName}_SUCCESS`);
      constant.add(dest.feature, `${newUpperSnakeName}_FAILURE`);
      constant.add(dest.feature, `${newUpperSnakeName}_DISMISS_ERROR`);
    }
  },
};
