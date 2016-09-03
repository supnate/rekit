'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.kebabCase(arr[1]);
const camelActionName = _.camelCase(actionName);
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();
const pascalActionName = helpers.pascalCase(actionName);

if (!actionName) {
  throw new Error('Please specify the action name.');
}

const BEGIN_ACTION_TYPE = `${upperSnakeActionName}_BEGIN`;
const SUCCESS_ACTION_TYPE = `${upperSnakeActionName}_SUCCESS`;
const FAILURE_ACTION_TYPE = `${upperSnakeActionName}_FAILURE`;
const DISMISS_ERROR_ACTION_TYPE = `${upperSnakeActionName}_DISMISS_ERROR`;

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(__dirname, `../src/features/${featureName}/redux`);

let targetPath;
let lines;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
lines = helpers.getLines(targetPath);
helpers.removeConstant(lines, BEGIN_ACTION_TYPE);
helpers.removeConstant(lines, SUCCESS_ACTION_TYPE);
helpers.removeConstant(lines, FAILURE_ACTION_TYPE);
helpers.removeConstant(lines, DISMISS_ERROR_ACTION_TYPE);
toSave(targetPath, lines);

/* Remove action file */
console.log('Removing action file');
targetPath = path.join(targetDir, `${camelActionName}.js`);
shell.rm(targetPath);

/* Update actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
lines = helpers.getLines(targetPath);
helpers.removeImportLine(lines, `./${camelActionName}`);
helpers.removeNamedExport(lines, camelActionName);
helpers.removeNamedExport(lines, `dismiss${pascalActionName}Error`);
toSave(targetPath, lines);

/* Updating reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
lines = helpers.getLines(targetPath);
helpers.removeImportLine(lines, `./${camelActionName}`);
helpers.removeNamedExport(lines, camelActionName);
toSave(targetPath, lines);

/* Update initialState.js */
console.log('Updating initialState.js');
targetPath = path.join(targetDir, 'initialState.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${camelActionName}Pending`);
helpers.removeLines(lines, `  ${camelActionName}Error`);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Remove async action success: ', actionName);

shell.exec(`"${process.execPath}" ${path.join(__dirname, 'rm_async_action_test.js')} ${featureName}/${actionName}`);
