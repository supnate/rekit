'use strict';

const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const refactor = require('./refactor');
const template = require('./template');

module.exports = {
  add(feature, component, args) {
    args = args || {};
    template.create(helpers.getTestFile(feature, component), Object.assign({}, args, {
      templateFile: args.templateFile || 'Component.test.js',
      context: Object.assign({ feature, component }, args.context || {}),
    }));
  },

  remove(feature, component) {
    vio.del(helpers.getTestFile(feature, component));
  },

  move(source, dest) {
    source.feature = _.kebabCase(source.feature);
    source.name = _.pascalCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.pascalCase(dest.name);

    const srcPath = helpers.getTestFile(source.feature, source.name);
    const destPath = helpers.getTestFile(dest.feature, dest.name);
    vio.mv(srcPath, destPath);

    const oldCssClass = `.${_.kebabCase(source.feature)}-${_.kebabCase(source.name)}`;
    const newCssClass = `.${_.kebabCase(dest.feature)}-${_.kebabCase(dest.name)}`;

    // Note: below string pattern binds to the test template, update here if template is changed.
    // Two styles of imports for component and high order component like page.
    const oldImportPath1 = `src/features/${_.kebabCase(source.feature)}`;
    const newImportPath1 = `src/features/${_.kebabCase(dest.feature)}`;

    const oldImportPath2 = `src/features/${_.kebabCase(source.feature)}/${_.pascalCase(source.name)}`;
    const newImportPath2 = `src/features/${_.kebabCase(dest.feature)}/${_.pascalCase(dest.name)}`;

    // Try to update describe('xxx')
    const oldDescribe = `${_.kebabCase(source.feature)}/${_.pascalCase(source.name)}`;
    const newDescribe = `${_.kebabCase(dest.feature)}/${_.pascalCase(dest.name)}`;

    const ast = vio.getAst(destPath);
    const changes = [].concat(
      refactor.renameImportSpecifier(ast, source.name, dest.name),
      refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
      refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
      refactor.renameStringLiteral(ast, oldDescribe, newDescribe),
      refactor.renameStringLiteral(ast, oldCssClass, newCssClass)
    );
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);
  },

  addAction(feature, name, args) {
    args = args || {};
    const context = {
      feature,
      action: name,
      actionType: args.actionType || name,
    };
    if (args.isAsync) {
      const upperSnakeActionName = _.upperSnakeCase(name);
      context.CAMEL_ACTION_NAME = _.camelCase(name);
      context.BEGIN_ACTION_TYPE = `${upperSnakeActionName}_BEGIN`;
      context.SUCCESS_ACTION_TYPE = `${upperSnakeActionName}_SUCCESS`;
      context.FAILURE_ACTION_TYPE = `${upperSnakeActionName}_FAILURE`;
      context.DISMISS_ERROR_ACTION_TYPE = `${upperSnakeActionName}_DISMISS_ERROR`;
    }
    template.create(helpers.getReduxTestFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || (args.isAsync ? 'async_action.test.js' : 'action.test.js'),
      context: Object.assign(context, args.context || {}),
    }));
  },

  removeAction(feature, name) {
    vio.del(helpers.getReduxTestFile(feature, name));
  },

  moveAction(source, dest, isAsync) {
    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = helpers.getReduxTestFile(source.feature, source.name);
    const destPath = helpers.getReduxTestFile(dest.feature, dest.name);
    vio.mv(srcPath, destPath);

    // Note: below string pattern binds to the test template, update here if template is changed.
    // For action/reducer import
    const oldImportPath1 = `src/features/${source.feature}/redux/${source.name}`;
    const newImportPath1 = `src/features/${dest.feature}/redux/${dest.name}`;

    // For constant import
    const oldImportPath2 = `src/features/${source.feature}/redux/constants`;
    const newImportPath2 = `src/features/${dest.feature}/redux/constants`;

    // Try to update describe('xxx')
    const oldDescribe = `${source.feature}/redux/${source.name}`;
    const newDescribe = `${dest.feature}/redux/${dest.name}`;

    const ast = vio.getAst(destPath);
    let changes = [].concat(
      refactor.renameImportSpecifier(ast, source.name, dest.name),
      refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
      refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
      refactor.renameStringLiteral(ast, oldDescribe, newDescribe)
    );

    const oldUpperSnakeName = _.upperSnakeCase(source.name);
    const newUpperSnakeName = _.upperSnakeCase(dest.name);
    if (isAsync) {
      changes = changes.concat(
        refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_BEGIN`, `${newUpperSnakeName}_BEGIN`),
        refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_SUCCESS`, `${newUpperSnakeName}_SUCCESS`),
        refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_FAILURE`, `${newUpperSnakeName}_FAILURE`),
        refactor.renameImportSpecifier(ast, `${oldUpperSnakeName}_DISMISS_ERROR`, `${newUpperSnakeName}_DISMISS_ERROR`)
      );
    } else {
      changes = changes.concat(
        refactor.renameImportSpecifier(ast, oldUpperSnakeName, newUpperSnakeName)
      );
    }
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);
  },
};
