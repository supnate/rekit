'use strict';
const path = require('path');
const _ = require('lodash');
const helpers = require('./helpers');

const args = process.argv;
const arr = (args[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.kebabCase(arr[1]);
const camelActionName = _.camelCase(actionName);
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();

const context = {
  KEBAB_FEATURE_NAME: featureName,
  ACTION_NAME: _.camelCase(actionName),
  PASCAL_ACTION_NAME: helpers.pascalCase(actionName),
  BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
  SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
  FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
  DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
};

if (!actionName) {
  throw new Error('Please specify the action name.');
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(__dirname, `../test/app/features/${featureName}`);

let targetPath;
let lines;

const actionTypeRegExp = new RegExp(`${context.BEGIN_ACTION_TYPE}|${context.SUCCESS_ACTION_TYPE}|${context.FAILURE_ACTION_TYPE}|${context.DISMISS_ERROR_ACTION_TYPE}`);

/* Update actions.test.js */
console.log('Updating actions.test.js');
targetPath = path.join(targetDir, 'actions.test.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${camelActionName},`);
helpers.removeLines(lines, `  dismiss${context.PASCAL_ACTION_NAME}Error,`);
helpers.removeLines(lines, `  ${context.BEGIN_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.SUCCESS_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.FAILURE_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.DISMISS_ERROR_ACTION_TYPE},`);
helpers.removeItTest(lines, actionTypeRegExp);
toSave(targetPath, lines);

/* Update reducer.test.js */
console.log('Updating reducer.test.js');
targetPath = path.join(targetDir, 'reducer.test.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${context.BEGIN_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.SUCCESS_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.FAILURE_ACTION_TYPE},`);
helpers.removeLines(lines, `  ${context.DISMISS_ERROR_ACTION_TYPE},`);
helpers.removeItTest(lines, actionTypeRegExp);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Remove async action success: ', actionName);
