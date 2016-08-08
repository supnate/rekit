'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = arr[0];
const actionName = _.upperFirst(_.camelCase(arr[1]));
const upperSnakeActionName = _.snakeCase(arr[1]).toUpperCase();

if (!actionName) {
  throw new Error('Please specify the action name.');
}

const context = {
  ACTION_NAME: actionName,
  CAMEL_ACTION_NAME: _.camelCase(actionName),
  UPPER_SNAKE_ACTION_NAME: upperSnakeActionName,

  BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
  SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
  FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
  DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(__dirname, `../src/features/${featureName}`);

let targetPath;
let lines;
let i;
let tpl;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
if (!shell.test('-e', targetPath)) {
  shell.ShellString('').to(targetPath);
}
lines = helpers.getLines(targetPath);
if (lines.length && !lines[lines.length - 1]) lines.pop();

lines.push(`export const ${context.BEGIN_ACTION_TYPE} = '${context.BEGIN_ACTION_TYPE}';`);
lines.push(`export const ${context.SUCCESS_ACTION_TYPE} = '${context.SUCCESS_ACTION_TYPE}';`);
lines.push(`export const ${context.FAILURE_ACTION_TYPE} = '${context.FAILURE_ACTION_TYPE}';`);
lines.push(`export const ${context.DISMISS_ERROR_ACTION_TYPE} = '${context.DISMISS_ERROR_ACTION_TYPE}';`);
lines.push('');
toSave(targetPath, lines);

/* Update actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
if (!shell.test('-e', targetPath)) {
  shell.ShellString('').to(targetPath);
}
lines = helpers.getLines(targetPath);
if (!lines.map(line => _.trim(line)).join('')) {
  // if it's empty
  if (lines.length && !lines[lines.length - 1]) lines.pop();
  lines.push('import {');
  lines.push('} from \'./constants\';');
  lines.push('');
}
i = helpers.lineIndex(lines, '} from \'./constants\';');
lines.splice(i, 0,
  `  ${context.BEGIN_ACTION_TYPE},`,
  `  ${context.SUCCESS_ACTION_TYPE},`,
  `  ${context.FAILURE_ACTION_TYPE},`,
  `  ${context.DISMISS_ERROR_ACTION_TYPE},`
);

tpl = shell.cat(path.join(__dirname, './feature_template/async_action.js'));
tpl = helpers.processTemplate(tpl, context);
lines.push(tpl);
lines.push('');
toSave(targetPath, lines);

/* Update reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
if (!shell.test('-e', targetPath)) {
  shell.ShellString('').to(targetPath);
}
lines = helpers.getLines(targetPath);
if (!lines.map(line => _.trim(line)).join('')) {
  // if it's empty
  if (lines.length && !lines[lines.length - 1]) lines.pop();
  lines = lines.concat(helpers.getLines(path.join(__dirname, './feature_template/reducer.js')));
}
i = helpers.lineIndex(lines, '} from \'./constants\';');
lines.splice(i, 0,
  `  ${context.BEGIN_ACTION_TYPE},`,
  `  ${context.SUCCESS_ACTION_TYPE},`,
  `  ${context.FAILURE_ACTION_TYPE},`,
  `  ${context.DISMISS_ERROR_ACTION_TYPE},`
);

i = helpers.lineIndex(lines, 'const initialState = {');
i = helpers.lineIndex(lines, '};', i);
lines.splice(i, 0, `  ${context.CAMEL_ACTION_NAME}Pending: false,`);
lines.splice(i, 0, `  ${context.CAMEL_ACTION_NAME}Error: null,`);

i = helpers.lineIndex(lines, '    default:');
tpl = shell.cat(path.join(__dirname, './feature_template/async_reducer.js'));
tpl = helpers.processTemplate(tpl, context);
lines.splice(i, 0, tpl);
toSave(targetPath, lines);

// Save files
helpers.saveFiles(filesToSave);
console.log('Add async action success: ', actionName);
