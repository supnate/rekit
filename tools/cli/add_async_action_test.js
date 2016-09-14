/*
  Add test file for async action.
  Usage:
  node add_async_action_test.js feature-name/action-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.camelCase(arr[1]);
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();

if (!actionName) {
  console.log('Error: Please specify the action name');
  process.exit(1);
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const context = {
  KEBAB_FEATURE_NAME: featureName,
  CAMEL_ACTION_NAME: _.camelCase(actionName),
  PASCAL_ACTION_NAME: helpers.pascalCase(actionName),
  BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
  SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
  FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
  DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
};

const targetDir = path.join(helpers.getProjectRoot(), `test/app/features/${featureName}/redux`);
helpers.ensureDir(targetDir);
const targetPath = path.join(targetDir, `${context.CAMEL_ACTION_NAME}.test.js`);

if (shell.test('-e', targetPath)) {
  console.log(`Test file has existed: ${targetPath}`);
}
const res = helpers.handleTemplate('async_action_test.js', context);
toSave(targetPath, res);

helpers.saveFiles(filesToSave);
console.log('Add async action test success: ', process.argv[2]);
