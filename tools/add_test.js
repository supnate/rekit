/*
  Add test file for page, component, action or reducer.
  Usage:
  node add_test.js -[a|c|p|s] feature-name/target-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const testPath = path.join(__dirname, '../test/app');

const testType = (process.argv[2] || '').replace('-', '').toLowerCase();
const arr = (process.argv[3] || '').split('/');
let featureName = _.kebabCase(arr[0]);
let targetName = arr[1];

if (!targetName) {
  targetName = featureName;
  featureName = '';
}

if (!targetName) {
  throw new Error('Please specify the target name');
}

const context = {
  KEBAB_FEATURE_NAME: _.kebabCase(featureName || 'components'),
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  COMPONENT_NAME: helpers.pascalCase(targetName),
  PAGE_NAME: helpers.pascalCase(targetName),
  KEBAB_PAGE_NAME: _.kebabCase(targetName),
  KEBAB_COMPONENT_NAME: _.kebabCase(targetName),
  ACTION_NAME: _.camelCase(targetName),
  FOLDER_PATH: featureName ? `features/${_.kebabCase(featureName)}` : 'components',
  CLASS_PREFIX: featureName ? _.kebabCase(featureName) : 'component',
};


let targetPath;
let template;
switch (testType) {
  case 'c':
  case 'p': {
    targetName = helpers.pascalCase(targetName);
    targetPath = path.join(testPath, featureName ? `features/${featureName}/${targetName}.test.js`
      : `components/${targetName}.test.js`);
    template = helpers.readTemplate(testType === 'p' ? 'page_test.js' : 'component_test.js');
    helpers.ensurePathDir(targetPath);
    if (!shell.test('-e', targetPath)) {
      shell.ShellString(helpers.processTemplate(template, context)).to(targetPath);
    }
    break;
  }
  case 'a': {
    targetName = _.camelCase(targetName);
    targetPath = path.join(testPath, `features/${featureName}/actions.test.js`);
    
    break;
  }
  case 'aa':
    break;
  default:
    throw new Error('Unknown target type: ', testType);
}

console.log('Add test success: ', process.argv[3]);
