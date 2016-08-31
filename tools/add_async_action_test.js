/*
  Add test file for async action.
  Usage:
  node add_async_action_test.js feature-name/action-name
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
const upperSnakeActionName = _.snakeCase(actionName).toUpperCase();

if (!actionName) {
  throw new Error('Please specify the action name');
}

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const context = {
  KEBAB_FEATURE_NAME: featureName,
  ACTION_NAME: _.camelCase(actionName),
  PASCAL_ACTION_NAME: helpers.pascalCase(actionName),
  BEGIN_ACTION_TYPE: `${upperSnakeActionName}_BEGIN`,
  SUCCESS_ACTION_TYPE: `${upperSnakeActionName}_SUCCESS`,
  FAILURE_ACTION_TYPE: `${upperSnakeActionName}_FAILURE`,
  DISMISS_ERROR_ACTION_TYPE: `${upperSnakeActionName}_DISMISS_ERROR`,
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
if (helpers.lineIndex(lines, 'import thunk from \'redux-thunk\';') === -1) {
  lines.unshift('import thunk from \'redux-thunk\';');
}
if (helpers.lineIndex(lines, 'import configureMockStore from \'redux-mock-store\';') === -1) {
  lines.unshift('import configureMockStore from \'redux-mock-store\';');
}

if (helpers.lineIndex(lines, 'const middlewares = [thunk];') === -1) {
  i = helpers.lineIndex(lines, /^describe\(/);
  lines.splice(i - 1, 0,
    'const middlewares = [thunk];',
    'const mockStore = configureMockStore(middlewares);',
    ''
  );
}

i = helpers.lineIndex(lines, `} from 'features/${context.KEBAB_FEATURE_NAME}/actions';`);
lines.splice(i, 0,
  `  ${actionName},`,
  `  dismiss${context.PASCAL_ACTION_NAME}Error,`
);
i = helpers.lineIndex(lines, `} from 'features/${context.KEBAB_FEATURE_NAME}/constants';`);
lines.splice(i, 0,
  `  ${context.BEGIN_ACTION_TYPE},`,
  `  ${context.SUCCESS_ACTION_TYPE},`,
  `  ${context.FAILURE_ACTION_TYPE},`,
  `  ${context.DISMISS_ERROR_ACTION_TYPE},`
);
i = helpers.lastLineIndex(lines, /^\}\);/);
const it = helpers.processTemplate(helpers.readTemplate('async_action_it_test.js'), context);
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
lines.splice(i, 0,
  `  ${context.BEGIN_ACTION_TYPE},`,
  `  ${context.SUCCESS_ACTION_TYPE},`,
  `  ${context.FAILURE_ACTION_TYPE},`,
  `  ${context.DISMISS_ERROR_ACTION_TYPE},`
);
i = helpers.lastLineIndex(lines, /^\}\);/);
lines.splice(i, 0, helpers.processTemplate(helpers.readTemplate('async_reducer_it_test.js'), context));
toSave(targetPath, lines);

helpers.saveFiles(filesToSave);
console.log('Add async action test success: ', process.argv[2]);
