'use strict';

const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
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
    const content = shell.cat(helpers.getTestFile(source.feature, source.component));
    this.remove(source.feature, source.component);
    this.add(dest.feature, dest.component, { content });
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

  // addAsyncAction(feature, name, args) {
  //   args = args || {};
  //   template.create(helpers.getReduxTestFile(feature, name), Object.assign({}, args, {
  //     templateFile: args.templateFile || 'async_action.test.js',
  //     context: Object.assign({ feature, action: name, actionType: args.actionType || name }, args.context || {}),
  //   }));
  // },

  // removeAsyncAction(feature, name) {
  //   this.removeAction(feature, name);
  // },

  moveAction(source, dest) {

  },
};
