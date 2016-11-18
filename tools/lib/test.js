'use strict';

const shell = require('shelljs');
const helpers = require('./helpers');
const inout = require('./inout');
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
    inout.del(helpers.getTestFile(feature, component));
  },

  move(source, dest) {
    const content = shell.cat(helpers.getTestFile(source.feature, source.component));
    this.remove(source.feature, source.component);
    this.add(dest.feature, dest.component, { content });
  },

  addAction(feature, name, args) {
    args = args || {};
    template.create(helpers.getReduxTestFile(feature, name), Object.assign({}, args, {
      templateFile: args.templateFile || 'action.test.js',
      context: Object.assign({ feature, action: name, actionType: args.actionType || name }, args.context || {}),
    }));
  },

  removeAction(feature, name) {
    inout.del(helpers.getReduxTestFile(feature, name));
  },

  moveAction(source, dest) {

  },
};
