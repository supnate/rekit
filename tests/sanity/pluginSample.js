'use strict';

// public plugin test
const _ = require('lodash');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
const vio = rekitCore.vio;
const template = rekitCore.template;

function add(feature, name) {
  // Create a test class
  const targetPath = utils.mapFeatureFile(feature, `${_.pascalCase(name)}.js`);
  template.generate(targetPath, {
    template: `export default class ${_.pascalCase(name)} {}`,
    context: { name },
  });
}

function remove(feature, name) {
  const targetPath = utils.mapFeatureFile(feature, `${_.pascalCase(name)}.js`);
  vio.del(targetPath);
}

function move(source, target) {
  // Move the selector file
  const oldPath = utils.mapFeatureFile(source.feature, `${_.pascalCase(source.name)}.js`);
  const newPath = utils.mapFeatureFile(target.feature, `${_.pascalCase(target.name)}.js`);
  vio.move(oldPath, newPath);
}

module.exports = {
  add,
  remove,
  move,
};
