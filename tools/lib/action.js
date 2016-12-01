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

    if (source.feature === dest.feature) {
      constant.rename(source.feature, oldActionType, newActionType);
    } else {
      constant.remove(source.feature, oldActionType);
      constant.add(dest.feature, newActionType);
    }

    vio.save(destPath, code);
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
};
