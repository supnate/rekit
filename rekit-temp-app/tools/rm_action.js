'use strict';
const path = require('path');
const _ = require('lodash');
const helpers = require('./helpers');

const args = process.argv;
const arr = (args[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.kebabCase(arr[1]);
const actionType = _.snakeCase(args[3] || actionName).toUpperCase();
const camelActionName = _.camelCase(actionName);

if (!actionName) {
  throw new Error('Please specify the action name.');
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(__dirname, `../src/features/${featureName}`);

let targetPath;
let lines;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `export const ${actionType} = '${actionType}';`);
toSave(targetPath, lines);

/* Update actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${actionType},`);
helpers.removeExportFunction(lines, camelActionName);
toSave(targetPath, lines);

/* Update reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${actionType},`);
helpers.removeSwitchCase(lines, actionType);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Remove action success: ', actionName);
