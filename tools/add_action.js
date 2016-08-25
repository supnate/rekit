'use strict';
const path = require('path');
const shell = require('shelljs');
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

const context = {
  CAMEL_ACTION_NAME: camelActionName,
  ACTION_TYPE: actionType,
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

// istanbul ignore else
if (lines.length && !lines[lines.length - 1]) lines.pop();
lines.push(`export const ${actionType} = '${actionType}';`);
lines.push('');
toSave(targetPath, lines);

/* Update actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
if (!shell.test('-e', targetPath)) {
  shell.ShellString('').to(targetPath);
}
lines = helpers.getLines(targetPath);

// if it's empty
if (!lines.map(line => _.trim(line)).join('')) {
  lines.length = 0;
  lines.push('import {');
  lines.push('} from \'./constants\';');
  lines.push('');
}
i = helpers.lineIndex(lines, '} from \'./constants\';');
lines.splice(i, 0, `  ${actionType},`);
tpl = helpers.readTemplate('actions.js');
tpl = helpers.processTemplate(tpl, context);
lines.push(tpl);
toSave(targetPath, lines);

/* Update reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
if (!shell.test('-e', targetPath)) {
  shell.ShellString('').to(targetPath);
}
lines = helpers.getLines(targetPath);

// if it's empty
if (!lines.map(line => _.trim(line)).join('')) {
  lines.length = 0;
  lines = lines.concat(helpers.getLines(path.join(__dirname, './feature_template/reducer.js')));
  lines.push('');
}
i = helpers.lineIndex(lines, '} from \'./constants\';');
lines.splice(i, 0, `  ${actionType},`);
tpl = `    case ${actionType}:
      return {
        ...state,
      };
`;
i = helpers.lineIndex(lines, '    default:');
lines.splice(i, 0, tpl);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Add action success: ', actionName);
