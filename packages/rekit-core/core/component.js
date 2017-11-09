'use strict';

/**
 * Component manager. Create component boilerplate for React. Note that it only creates React component except style files and unit test.
 * @module
**/

const _ = require('lodash');
const utils = require('./utils');
const vio = require('./vio');
const refactor = require('./refactor');
const template = require('./template');
const entry = require('./entry');
const assert = require('./assert');

/**
 * Add a component.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @param {object} args - Other arguments.
 * @alias module:component.add
**/
function add(feature, component, args) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(component, 'component name');
  assert.featureExist(feature);

  feature = _.kebabCase(feature);
  component = _.pascalCase(component);

  // create component from template
  args = args || {};
  template.generate(utils.mapComponent(feature, component) + '.js', Object.assign({}, args, {
    templateFile: args.templateFile || 'Component.js',
    context: Object.assign({ feature, component }, args.context || {}),
  }));

  // add to index.js
  entry.addToIndex(feature, component);
}

/**
 * Remove a component.
 * @param {string} feature - The feature name.
 * @param {string} name - The component name.
 * @param {object} args - Other arguments.
 * @alias module:component.remove
**/
function remove(feature, component) {
  assert.notEmpty(feature, 'feature');
  assert.notEmpty(component, 'component name');
  assert.featureExist(feature);

  feature = _.kebabCase(feature);
  component = _.pascalCase(component);

  vio.del(utils.mapComponent(feature, component) + '.js');
  entry.removeFromIndex(feature, component);
}

/**
 * Move/rename a component.
 * @param {ElementArg} source - Which component to move/rename.
 * @param {ElementArg} target - The target of the old component.
 * @alias module:component.remove
**/
function move(source, target) {
  // 1. Move File.js to the targetination
  // 2. Rename module name
  source.feature = _.kebabCase(source.feature);
  source.name = _.pascalCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.pascalCase(target.name);

  const srcPath = utils.mapComponent(source.feature, source.name) + '.js';
  const targetPath = utils.mapComponent(target.feature, target.name) + '.js';
  vio.move(srcPath, targetPath);

  const oldCssClass = `${source.feature}-${_.kebabCase(source.name)}`;
  const newCssClass = `${target.feature}-${_.kebabCase(target.name)}`;

  refactor.updateFile(targetPath, ast => [].concat(
    refactor.renameClassName(ast, source.name, target.name),
    refactor.renameCssClassName(ast, oldCssClass, newCssClass)
  ));

  if (source.feature === target.feature) {
    entry.renameInIndex(source.feature, source.name, target.name);
  } else {
    entry.removeFromIndex(source.feature, source.name);
    entry.addToIndex(target.feature, target.name);
  }
}

module.exports = {
  add,
  remove,
  move,
};
