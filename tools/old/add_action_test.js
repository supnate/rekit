/*
  Add test file for action and reducer.
  Usage:
  node add_action_test.js feature-name/target-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.camelCase(arr[1]);
const actionType = _.snakeCase(process.argv[3] || actionName).toUpperCase();

if (!actionName) {
  console.log('Error: Please specify the action name');
  process.exit(1);
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const context = {
  KEBAB_FEATURE_NAME: featureName,
  CAMEL_ACTION_NAME: _.camelCase(actionName),
  ACTION_TYPE: actionType,
};

const targetDir = path.join(helpers.getProjectRoot(), `test/app/features/${featureName}/redux`);
helpers.ensureDir(targetDir);
const targetPath = path.join(targetDir, `${context.CAMEL_ACTION_NAME}.test.js`);
if (shell.test('-e', targetPath)) {
  console.log(`Test file has existed: ${targetPath}`);
}
const res = helpers.handleTemplate('action_test.js', context);
toSave(targetPath, res);

// save files
helpers.saveFiles(filesToSave);
console.log('Add action test success: ', process.argv[2]);
