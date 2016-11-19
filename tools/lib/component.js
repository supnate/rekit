'use strict';

const shell = require('shelljs');
const helpers = require('./helpers');
const vio = require('./vio');
const template = require('./template');
const entry = require('./entry');

module.exports = {
  add(feature, component, args) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(component, 'component name');
    helpers.assertFeatureExist(feature);

    // create component from template
    args = args || {};
    template.create(helpers.mapComponent(feature, component) + '.js', Object.assign({}, args, {
      templateFile: args.templateFile || 'Component.js',
      context: Object.assign({ feature, component }, args.context || {}),
    }));

    // add to index.js
    entry.addToIndex(feature, component);
  },

  remove(feature, component) {
    helpers.assertNotEmpty(feature, 'feature');
    helpers.assertNotEmpty(component, 'component name');
    helpers.assertFeatureExist(feature);

    vio.del(helpers.mapComponent(feature, component) + '.js');
    entry.removeFromIndex(feature, component);
  },

  move(source, dest) {
    // 1. Move the File.js
    // 2. Update the path in index.js
    // 3. Search all reference in the project features project.

    const content = shell.cat(helpers.mapComponent(source.feature, source.component) + '.js');
    this.remove(source.feature, source.component);
    this.add(dest.feature, dest.component, { content });
  },
};
