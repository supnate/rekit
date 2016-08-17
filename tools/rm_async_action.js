'use strict';
const path = require('path');
const _ = require('lodash');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.kebabCase(arr[1]);
const camelActionName = _.camelCase(actionName);
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();
const ACTION_NAME = _.upperFirst(camelActionName);

const BEGIN_ACTION_TYPE = `${upperSnakeActionName}_BEGIN`;
const SUCCESS_ACTION_TYPE = `${upperSnakeActionName}_SUCCESS`;
const FAILURE_ACTION_TYPE = `${upperSnakeActionName}_FAILURE`;
const DISMISS_ERROR_ACTION_TYPE = `${upperSnakeActionName}_DISMISS_ERROR`;

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(__dirname, `../src/features/${featureName}`);

let targetPath;
let lines;

/* Update constants.js */
console.log('Updating constants.js');
targetPath = path.join(targetDir, 'constants.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `export const ${BEGIN_ACTION_TYPE} = '${BEGIN_ACTION_TYPE}';`);
helpers.removeLines(lines, `export const ${SUCCESS_ACTION_TYPE} = '${SUCCESS_ACTION_TYPE}';`);
helpers.removeLines(lines, `export const ${FAILURE_ACTION_TYPE} = '${FAILURE_ACTION_TYPE}';`);
helpers.removeLines(lines, `export const ${DISMISS_ERROR_ACTION_TYPE} = '${DISMISS_ERROR_ACTION_TYPE}';`);
toSave(targetPath, lines);

/* Update actions.js */
console.log('Updating actions.js');
targetPath = path.join(targetDir, 'actions.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${BEGIN_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${SUCCESS_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${FAILURE_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${DISMISS_ERROR_ACTION_TYPE}`);
helpers.removeLines(lines, `/* ===== ${ACTION_NAME} ===== */`);
helpers.removeExportFunction(lines, camelActionName);
helpers.removeExportFunction(lines, `dismiss${ACTION_NAME}Error`);
toSave(targetPath, lines);

/* Update reducer.js */
console.log('Updating reducer.js');
targetPath = path.join(targetDir, 'reducer.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${BEGIN_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${SUCCESS_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${FAILURE_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${DISMISS_ERROR_ACTION_TYPE}`);
helpers.removeLines(lines, `  ${camelActionName}Error:`);
helpers.removeLines(lines, `  ${camelActionName}Pending:`);
helpers.removeLines(lines, `    /* ===== ${ACTION_NAME} ===== */`);

helpers.removeSwitchCase(lines, BEGIN_ACTION_TYPE);
helpers.removeSwitchCase(lines, SUCCESS_ACTION_TYPE);
helpers.removeSwitchCase(lines, FAILURE_ACTION_TYPE);
helpers.removeSwitchCase(lines, DISMISS_ERROR_ACTION_TYPE);
toSave(targetPath, lines);

// save files
helpers.saveFiles(filesToSave);
console.log('Remove async action success: ', actionName);
