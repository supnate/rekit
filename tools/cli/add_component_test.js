/*
  Add test file for component
  Usage:
    node add_component_test.js feature-name/component-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const testPath = path.join(helpers.getProjectRoot(), 'test/app');

const arr = (process.argv[2] || '').split('/');
let featureName = _.kebabCase(arr[0]);
let componentName = arr[1];

if (!componentName) {
  componentName = featureName;
  featureName = '';
}

if (!componentName) {
  console.log('Error: Please specify the component name');
  process.exit(1);
}

const context = {
  KEBAB_FEATURE_NAME: _.kebabCase(featureName || 'components'),
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  COMPONENT_NAME: helpers.pascalCase(componentName),
  KEBAB_COMPONENT_NAME: _.kebabCase(componentName),
  FOLDER_PATH: featureName ? `features/${_.kebabCase(featureName)}` : 'components',
  CLASS_PREFIX: featureName ? _.kebabCase(featureName) : 'component',
};

const targetPath = path.join(testPath, featureName ? `features/${featureName}/${context.COMPONENT_NAME}.test.js`
  : `components/${context.COMPONENT_NAME}.test.js`);
helpers.ensurePathDir(targetPath);
if (!shell.test('-e', targetPath)) {
  const res = helpers.handleTemplate('component_test.js', context);
  shell.ShellString(res).to(targetPath);
}

console.log('Add component test success: ', process.argv[2]);
