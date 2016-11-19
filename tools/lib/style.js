'use strict';

const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const template = require('./template');
const entry = require('./entry');

module.exports = {
  add(feature, component, args) {
    // Create style file for a component
    args = args || {};
    template.create(helpers.mapName(feature, component) + '.less', Object.assign({}, args, {
      templateFile: args.templateFile || 'Component.less',
      context: Object.assign({ feature, component, depth: 2 }, args.context || {}),
    }));

    entry.addToStyle(feature, component);
  },

  remove(feature, component) {
    // Remove style file of a component
    vio.del(helpers.mapName(feature, component) + '.less');
    entry.removeFromStyle(feature, component);
  },

  move(source, dest) {
    const content = shell.cat(helpers.mapName(source.feature, source.component) + '.less');
    this.remove(source.feature, source.component);
    this.add(dest.feature, dest.component, { content });
  },
};
