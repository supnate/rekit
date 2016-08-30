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

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.camelCase(arr[1]);
const actionType = _.snakeCase(process.argv[3] || actionName).toUpperCase();

if (!actionName) {
  throw new Error('Please specify the action name');
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const context = {
  KEBAB_FEATURE_NAME: featureName,
  ACTION_NAME: _.camelCase(actionName),
  ACTION_TYPE: actionType,
};

let lines;
let i;
let targetPath;

// Update actions.test.js
console.log('Update actions.test.js');
targetPath = path.join(testPath, `features/${featureName}/actions.test.js`);
if (!shell.test('-e', targetPath)) {
  helpers.ensurePathDir(targetPath);
  const text = helpers.processTemplate(helpers.readTemplate('actions_test.js'), context);
  shell.ShellString(text).to(targetPath);
}
lines = helpers.getLines(targetPath);
i = helpers.lineIndex(lines, `} from 'features/${context.KEBAB_FEATURE_NAME}/actions';`);
lines.splice(i, 0, `  ${context.ACTION_NAME},`);
i = helpers.lineIndex(lines, `} from 'features/${context.KEBAB_FEATURE_NAME}/constants';`);
lines.splice(i, 0, `  ${context.ACTION_TYPE},`);
i = helpers.lastLineIndex(lines, /^\}\);/);
const it = helpers.processTemplate(helpers.readTemplate('action_it_test.js'), context);
lines.splice(i, 0, it);
i = helpers.lineIndex(lines, /^describe\(/);
if (lines[i + 1] === it) {
  lines[i + 1] = it.replace(/^\n/, ''); // remove the first empty line
}
toSave(targetPath, lines);

// Update reducer.test.js
console.log('Update reducer.test.js');
targetPath = path.join(testPath, `features/${featureName}/reducer.test.js`);
if (!shell.test('-e', targetPath)) {
  helpers.ensurePathDir(targetPath);
  const text = helpers.processTemplate(helpers.readTemplate('reducer_test.js'), context);
  shell.ShellString(text).to(targetPath);
}
lines = helpers.getLines(targetPath);
i = helpers.lineIndex(lines, `} from 'features/${context.KEBAB_FEATURE_NAME}/constants';`);
lines.splice(i, 0, `  ${context.ACTION_TYPE},`);
i = helpers.lastLineIndex(lines, /^\}\);/);
lines.splice(i, 0, helpers.processTemplate(helpers.readTemplate('reducer_it_test.js'), context));
toSave(targetPath, lines);

helpers.saveFiles(filesToSave);
console.log('Add action test success: ', process.argv[2]);
