/*
  Remove test file for page or component
  Usage:
  node rm_test.js feature-name/target-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const testPath = path.join(__dirname, '../test/app');

const arr = (process.argv[2] || '').split('/');
let featureName = _.kebabCase(arr[0]);
let targetName = arr[1];

if (!targetName) {
  targetName = featureName;
  featureName = '';
}

if (!targetName) {
  throw new Error('Please specify the target name');
}

targetName = helpers.pascalCase(targetName);
const targetPath = path.join(testPath, featureName ? `features/${featureName}/${targetName}.test.js`
  : `components/${targetName}.test.js`);
shell.rm(targetPath);

console.log('Remove test success: ', process.argv[3]);
