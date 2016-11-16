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
};
