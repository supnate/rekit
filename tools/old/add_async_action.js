'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.camelCase(arr[1]);
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();
const camelActionName = _.camelCase(actionName);
const pascalActionName = helpers.pascalCase(actionName);
if (!actionName) {
  console.log('Error: Please specify the action name.');
  process.exit(1);
}

const context = {
  PASCAL_ACTION_NAME: pascalActionName,
  CAMEL_ACTION_NAME: _.camelCase(actionName),
  UPPER_SNAKE_ACTION_NAME: upperSnakeActionName,

  BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
  SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
  FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
  DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
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
let i;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
helpers.ensureFile(targetPath);
lines = helpers.getLines(targetPath);
helpers.addConstant(lines, context.BEGIN_ACTION_TYPE);
helpers.addConstant(lines, context.SUCCESS_ACTION_TYPE);
helpers.addConstant(lines, context.FAILURE_ACTION_TYPE);
helpers.addConstant(lines, context.DISMISS_ERROR_ACTION_TYPE);
toSave(targetPath, lines);

/* Create action file */
console.log('Creating action file');
targetPath = path.join(targetDir, `${camelActionName}.js`);
const res = helpers.handleTemplate('async_action.js', context);
toSave(targetPath, res);

/* Updating actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
lines = helpers.getLines(targetPath);
helpers.appendImportLine(lines, `import { ${camelActionName}, dismiss${pascalActionName}Error } from './${camelActionName}';`);
helpers.addNamedExport(lines, camelActionName);
helpers.addNamedExport(lines, `dismiss${pascalActionName}Error`);
toSave(targetPath, lines);

/* Updating reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
lines = helpers.getLines(targetPath);
helpers.appendImportLine(lines, `import { reducer as ${camelActionName} } from './${camelActionName}';`);
i = helpers.lineIndex(lines, /^\];/);
lines.splice(i, 0, `  ${camelActionName},`);
toSave(targetPath, lines);

/* Update initialState.js */
console.log('Updating initialState.js');
targetPath = path.join(targetDir, 'initialState.js');
lines = helpers.getLines(targetPath);
i = helpers.lineIndex(lines, /^\};/);
lines.splice(i, 0, `  ${context.CAMEL_ACTION_NAME}Pending: false,`, `  ${context.CAMEL_ACTION_NAME}Error: null,`);
toSave(targetPath, lines);

// Save files
helpers.saveFiles(filesToSave);
console.log('Add async action success: ', actionName);

shell.exec(`"${process.execPath}" "${path.join(__dirname, 'add_async_action_test.js')}" ${featureName}/${actionName}`);
