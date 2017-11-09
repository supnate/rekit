'use strict';

/**
 * Style manager. It manage style files for components. Usually used with component manage.
 * @module
**/

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
// const refactor = require('./refactor');
const template = require('./template');
const entry = require('./entry');

/**
 * Add a style file for a component. It create the style file with the extension 'cssExt' configured in 'rekit' section of package.json.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.add
 *
 * @example
 * const style = require('rekit-core').style;
 *
 * // create a file named 'Hello.less' in feature 'home'.
 * style.add('home', 'Hello');
**/
function add(feature, component, args) {
  // Create style file for a component
  args = args || {};
  template.generate(utils.mapComponent(feature, component) + '.' + utils.getCssExt(), Object.assign({}, args, {
    templateFile: args.templateFile || 'Component.less',
    context: Object.assign({
      feature,
      component,
      depth: 2,
      cssExt: utils.getCssExt(),
    }, args.context || {}),
  }));

  entry.addToStyle(feature, component);
}

/**
 * Remove a style file for a component.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.remove
 *
**/
function remove(feature, component) {
  // Remove style file of a component
  vio.del(utils.mapComponent(feature, component) + '.' + utils.getCssExt());
  entry.removeFromStyle(feature, component);
}

/**
 * Move/rename a style file for a component.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.remove
 *
**/
function move(source, target) {
  // 1. Move File.less to the destination
  // 2. Rename css class name
  // 3. Update references in the style.less

  source.feature = _.kebabCase(source.feature);
  source.name = _.pascalCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.pascalCase(target.name);

  const srcPath = utils.mapComponent(source.feature, source.name) + '.' + utils.getCssExt();
  const targetPath = utils.mapComponent(target.feature, target.name) + '.' + utils.getCssExt();
  vio.move(srcPath, targetPath);

  let lines = vio.getLines(targetPath);
  const oldCssClass = `${_.kebabCase(source.feature)}-${_.kebabCase(source.name)}`;
  const newCssClass = `${_.kebabCase(target.feature)}-${_.kebabCase(target.name)}`;

  lines = lines.map(line => line.replace(`.${oldCssClass}`, `.${newCssClass}`));
  vio.save(targetPath, lines);

  if (source.feature === target.feature) {
    entry.renameInStyle(source.feature, source.name, target.name);
  } else {
    entry.removeFromStyle(source.feature, source.name);
    entry.addToStyle(target.feature, target.name);
  }
}

module.exports = {
  add,
  move,
  remove,
};

