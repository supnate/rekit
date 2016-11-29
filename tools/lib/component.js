'use strict';

const _ = require('lodash');
const helpers = require('./helpers');
const vio = require('./vio');
const refactor = require('./refactor');
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
    // 1. Move File.js to the destination
    // 2. Rename module name
    // 3. Update references in the features folder
    source.feature = _.kebabCase(source.feature);
    source.name = _.pascalCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.pascalCase(dest.name);

    const srcPath = helpers.mapName(source.feature, source.name) + '.js';
    const destPath = helpers.mapName(dest.feature, dest.name) + '.js';
    vio.mv(srcPath, destPath);

    const ast = vio.getAst(destPath);
    refactor.renameClassName(ast, source.name, dest.name);
    vio.saveAst(destPath, ast);


    // 1. Move the File.js
    // 2. Update the path in index.js
    // 3. Search all reference in the project features project.

    // const content = vio.getLines(helpers.mapComponent(source.feature, source.component) + '.js').join('\n');
    // this.remove(source.feature, source.component);
    // this.add(dest.feature, dest.component, { content });
  },
};
