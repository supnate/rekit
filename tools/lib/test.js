'use strict';

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
const refactor = require('./refactor');
const template = require('./template');

module.exports = {
  add(feature, component, args) {
    args = args || {};
    template.create(utils.getTestFile(feature, component), Object.assign({}, args, {
      templateFile: args.templateFile || 'Component.test.js',
      context: Object.assign({ feature, component }, args.context || {}),
    }));
  },

  remove(feature, component) {
    vio.del(utils.getTestFile(feature, component));
  },

  move(source, dest) {
    source.feature = _.kebabCase(source.feature);
    source.name = _.pascalCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.pascalCase(dest.name);

    const srcPath = utils.getTestFile(source.feature, source.name);
    const destPath = utils.getTestFile(dest.feature, dest.name);
    vio.move(srcPath, destPath);

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

    refactor.udpateFile(destPath, ast => [].concat(
      refactor.renameImportSpecifier(ast, source.name, dest.name),
      refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
      refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
      refactor.renameStringLiteral(ast, oldDescribe, newDescribe),
      refactor.renameStringLiteral(ast, oldCssClass, newCssClass)
    ));
  },

  addAction(feature, name, args) {
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
    template.create(utils.getReduxTestFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || (args.isAsync ? 'async_action.test.js' : 'action.test.js'),
      context: Object.assign(context, args.context || {}),
    }));
  },

  removeAction(feature, name) {
    vio.del(utils.getReduxTestFile(feature, name));
  },

  moveAction(source, dest, isAsync) {
    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.camelCase(dest.name);

    const srcPath = utils.getReduxTestFile(source.feature, source.name);
    const destPath = utils.getReduxTestFile(dest.feature, dest.name);
    vio.move(srcPath, destPath);

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

    // const oldUpperSnakeName = _.upperSnakeCase(source.name);
    // const newUpperSnakeName = _.upperSnakeCase(dest.name);
    if (isAsync) {
      const oldActionTypes = utils.getAsyncActionTypes(source.feature, source.name);
      const newActionTypes = utils.getAsyncActionTypes(dest.feature, dest.name);

      const oldIt1 = `dispatches success action when ${_.camelCase(source.name)} succeeds`;
      const newIt1 = `dispatches success action when ${_.camelCase(dest.name)} succeeds`;

      const oldIt2 = `dispatches failure action when ${_.camelCase(source.name)} fails`;
      const newIt2 = `dispatches failure action when ${_.camelCase(dest.name)} fails`;

      const oldIt3 = `returns correct action by dismiss${_.pascalCase(source.name)}Error`;
      const newIt3 = `returns correct action by dismiss${_.pascalCase(dest.name)}Error`;

      const oldIt4 = `handles action type ${oldActionTypes.begin} correctly`;
      const newIt4 = `handles action type ${newActionTypes.begin} correctly`;

      const oldIt5 = `handles action type ${oldActionTypes.success} correctly`;
      const newIt5 = `handles action type ${newActionTypes.success} correctly`;

      const oldIt6 = `handles action type ${oldActionTypes.failure} correctly`;
      const newIt6 = `handles action type ${newActionTypes.failure} correctly`;

      const oldIt7 = `handles action type ${oldActionTypes.dismissError} correctly`;
      const newIt7 = `handles action type ${newActionTypes.dismissError} correctly`;

      changes = changes.concat(
        refactor.renameImportSpecifier(ast, `dismiss${_.pascalCase(source.name)}Error`, `dismiss${_.pascalCase(dest.name)}Error`),
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
      const newActionType = utils.getActionType(dest.feature, dest.name);
      const oldIt1 = `returns correct action by ${source.name}`;
      const newIt1 = `returns correct action by ${dest.name}`;

      const oldIt2 = `handles action type ${oldActionType} correctly`;
      const newIt2 = `handles action type ${newActionType} correctly`;
      changes = changes.concat(
        refactor.renameStringLiteral(ast, oldIt1, newIt1),
        refactor.renameStringLiteral(ast, oldIt2, newIt2),
        refactor.renameImportSpecifier(ast, oldActionType, newActionType)
      );
    }
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);
  },
};
