/*
  Add test file for feature root reducer
  Usage:
    node add_reducer_test.js feature-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const featureName = _.kebabCase(process.argv[2] || '');
if (!featureName) {
  console.log('Error: Please specify the feature name');
  process.exit(1);
}

const testPath = path.join(helpers.getProjectRoot(), 'test/app');
const context = {
  KEBAB_FEATURE_NAME: featureName,
};

const targetPath = path.join(testPath, `features/${context.KEBAB_FEATURE_NAME}/redux/reducer.test.js`);
helpers.ensurePathDir(targetPath);
if (!shell.test('-e', targetPath)) {
  const res = helpers.handleTemplate('reducer_test.js', context);
  shell.ShellString(res).to(targetPath);
}

console.log('Add reducer test success: ', process.argv[2]);
