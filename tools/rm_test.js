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
let targetPath;
switch (testType) {
  case 'c':
  case 'p': {
    targetName = helpers.pascalCase(targetName);
    targetPath = path.join(testPath, featureName ? `features/${featureName}/${targetName}.test.js`
      : `components/${targetName}.test.js`);
    shell.rm(targetPath);
    break;
  }
  case 'a':
    targetName = _.camelCase(targetName);
    targetPath = path.join(testPath, `features/${featureName}/actions.test.js`);
    break;
  case 'aa':
    break;
  default:
    throw new Error('Unknown target type: ', testType);
}

console.log('Remove test success: ', process.argv[3]);
