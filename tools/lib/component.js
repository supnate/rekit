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
    source.feature = _.kebabCase(source.feature);
    source.name = _.pascalCase(source.name);
    dest.feature = _.kebabCase(dest.feature);
    dest.name = _.pascalCase(dest.name);

    const srcPath = helpers.mapName(source.feature, source.name) + '.js';
    const destPath = helpers.mapName(dest.feature, dest.name) + '.js';
    vio.mv(srcPath, destPath);

    const oldCssClass = `${_.kebabCase(source.feature)}-${_.kebabCase(source.name)}`;
    const newCssClass = `${_.kebabCase(dest.feature)}-${_.kebabCase(dest.name)}`;

    const ast = vio.getAst(destPath);
    const changes = [].concat(
      refactor.renameClassName(ast, source.name, dest.name),
      refactor.renameCssClassName(ast, oldCssClass, newCssClass)
    );
    let code = vio.getContent(destPath);
    code = refactor.updateSourceCode(code, changes);
    vio.save(destPath, code);

    if (source.feature === dest.feature) {
      entry.renameInIndex(source.feature, source.name, dest.name);
    } else {
      entry.removeFromIndex(source.feature, source.name);
      entry.addToIndex(dest.feature, dest.name);
    }

    // 1. Move the File.js
    // 2. Update the path in index.js
    // 3. Search all reference in the project features project.

    // const content = vio.getLines(helpers.mapComponent(source.feature, source.component) + '.js').join('\n');
    // this.remove(source.feature, source.component);
    // this.add(dest.feature, dest.component, { content });
  },
};
