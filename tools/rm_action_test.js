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

const targetDir = path.join(__dirname, `../test/app/features/${featureName}`);

let targetPath;
let lines;

/* Update actions.test.js */
console.log('Updating actions.test.js');
targetPath = path.join(targetDir, 'actions.test.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${camelActionName},`);
helpers.removeLines(lines, `  ${actionType},`);
helpers.removeItTest(lines, actionType);
toSave(targetPath, lines);

/* Update reducer.test.js */
console.log('Updating reducer.test.js');
targetPath = path.join(targetDir, 'reducer.test.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${actionType},`);
helpers.removeItTest(lines, actionType);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Remove action success: ', actionName);
