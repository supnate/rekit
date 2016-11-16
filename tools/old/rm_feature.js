'use strict';
// Summary:
//  Remove a feature: remove foler structure and files. If the feature folder contains
//  more than 20 files, nothing will happen, it should be deleted manually.
// Example:
//  node remove_feature.js employee

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const trash = require('trash');
const helpers = require('./helpers');

const args = process.argv;
const featureName = _.kebabCase(args[2]);

if (!featureName) {
  console.log('Error: Please set the feature name');
  process.exit(1);
}

const context = {
  FEATURE_NAME: _.upperFirst(_.camelCase(featureName)),
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  KEBAB_FEATURE_NAME: _.kebabCase(featureName),
  UPPER_SNAKE_FEATURE_NAME: _.kebabCase(featureName).toUpperCase(),
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(helpers.getProjectRoot(), `src/features/${context.KEBAB_FEATURE_NAME}`);

let lines;
let targetPath;

/* ===== Remove reducer from rootReducer.js ===== */
console.log('Remove from root reducer.');
targetPath = path.join(helpers.getProjectRoot(), 'src/common/rootReducer.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `import ${context.CAMEL_FEATURE_NAME}Reducer from '../features/${context.KEBAB_FEATURE_NAME}/redux/reducer';`);
helpers.removeLines(lines, `  ${context.CAMEL_FEATURE_NAME}: ${context.CAMEL_FEATURE_NAME}Reducer,`);
toSave(targetPath, lines);

/* ===== Remove route from routeConfig.js ===== */
console.log('Un-register route');
targetPath = path.join(helpers.getProjectRoot(), 'src/common/routeConfig.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `import ${context.CAMEL_FEATURE_NAME}Route from '../features/${context.KEBAB_FEATURE_NAME}/route';`);
helpers.removeLines(lines, `    ${context.CAMEL_FEATURE_NAME}Route,`);
toSave(targetPath, lines);

/* ===== Remove entry from styles/index.less ===== */
console.log('Remove entry from styles/index.less');
targetPath = path.join(helpers.getProjectRoot(), 'src/styles/index.less');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `@import '../features/${context.KEBAB_FEATURE_NAME}/style.less';`);
toSave(targetPath, lines);

// Save files
helpers.saveFiles(filesToSave);
console.log('Remove feature success: ', context.KEBAB_FEATURE_NAME);

// Remove feature folder
if (shell.test('-e', targetDir)) {
  // deleting a feature is dangerous, move it to trash.
  trash([targetDir]);
}

// Removing test folder
shell.rm('-rf', path.join(helpers.getProjectRoot(), 'test/app/features', _.kebabCase(featureName)));
