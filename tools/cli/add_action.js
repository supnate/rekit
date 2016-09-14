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
  console.log('Error: Please specify the action name.');
  process.exit(1);
}

const context = {
  CAMEL_ACTION_NAME: camelActionName,
  ACTION_TYPE: actionType,
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(helpers.getProjectRoot(), `src/features/${featureName}/redux`);
const actionFile = path.join(targetDir, `${camelActionName}.js`);
if (shell.test('-e', actionFile)) {
  console.log(`Error: Action '${camelActionName}'has been existed.`);
  process.exit(1);
}

let targetPath;
let lines;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
helpers.ensureFile(targetPath);
lines = helpers.getLines(targetPath);
helpers.addConstant(lines, actionType);
toSave(targetPath, lines);

/* Create action file */
console.log('Creating action file');
targetPath = path.join(targetDir, `${camelActionName}.js`);
const res = helpers.handleTemplate('action.js', context);
toSave(targetPath, res);

/* Updating actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
lines = helpers.getLines(targetPath);
helpers.appendImportLine(lines, `import { ${camelActionName} } from './${camelActionName}';`);
helpers.addNamedExport(lines, camelActionName);
toSave(targetPath, lines);

/* Updating reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
lines = helpers.getLines(targetPath);
helpers.appendImportLine(lines, `import { reducer as ${camelActionName} } from './${camelActionName}';`);
const i = helpers.lineIndex(lines, /^\];/);
lines.splice(i, 0, `  ${camelActionName},`);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Add action success: ', actionName);

shell.exec(`"${process.execPath}" "${path.join(__dirname, 'add_action_test.js')}" ${featureName}/${actionName}`);
