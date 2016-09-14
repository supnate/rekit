'use strict';
// Summary:
//  Add a feature: create foler structure and generate corresponding files.
// Example:
//  node add_feature.js employee

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
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
if (shell.test('-e', targetDir)) {
  console.log(`Error: feature name existed: ${context.KEBAB_FEATURE_NAME}`);
  process.exit(1);
}

// templated files
[
  'index.js',
  'route.js',
  'selectors.js',
  'style.less',
  'redux/actions.js',
  'redux/reducer.js',
  'redux/constants.js',
  'redux/initialState.js',
].forEach(fileName => {
  console.log('processing file: ', fileName);
  const filePath = `${targetDir}/${fileName}`;
  const res = helpers.handleTemplate(fileName, context);
  toSave(filePath, res);
});

// // redux files
// [
//   'actions.js',
//   'constants.js',
//   'reducer.js',
// ].forEach(fileName => {
//   console.log('creating file: ', fileName);
//   const filePath = path.join(targetDir, fileName);
//   toSave(filePath, '');
// });

let lines;
let i;
let targetPath;

/* ===== Add reducer to rootReducer.js ===== */
console.log('Add to root reducer.');
targetPath = path.join(helpers.getProjectRoot(), 'src/common/rootReducer.js');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^import /);
lines.splice(i + 1, 0, `import ${context.CAMEL_FEATURE_NAME}Reducer from '../features/${context.KEBAB_FEATURE_NAME}/redux/reducer';`);
i = helpers.lastLineIndex(lines, /^\}\);$/);
lines.splice(i, 0, `  ${context.CAMEL_FEATURE_NAME}: ${context.CAMEL_FEATURE_NAME}Reducer,`);
toSave(targetPath, lines);

/* ===== Add route to routeConfig.js ===== */
console.log('Register route');
targetPath = path.join(helpers.getProjectRoot(), 'src/common/routeConfig.js');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^import /);
lines.splice(i + 1, 0, `import ${context.CAMEL_FEATURE_NAME}Route from '../features/${context.KEBAB_FEATURE_NAME}/route';`);
i = helpers.lineIndex(lines, 'path: \'*\'');
// istanbul ignore if
if (i === -1) {
  i = helpers.lastLineIndex(lines, /^ {2}\]/);
}
lines.splice(i, 0, `    ${context.CAMEL_FEATURE_NAME}Route,`);
toSave(targetPath, lines);

/* ===== Add entry to styles/index.less ===== */
console.log('Add entry to styles/index.less');
targetPath = path.join(helpers.getProjectRoot(), 'src/styles/index.less');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^@import/);
lines.splice(i + 1, 0, `@import '../features/${context.KEBAB_FEATURE_NAME}/style.less';`);
toSave(targetPath, lines);

shell.mkdir(targetDir);
shell.mkdir(path.join(targetDir, 'redux'));

helpers.saveFiles(filesToSave);
console.log('Add feature done: ', featureName);

// Add feature reducer test
shell.exec(`"${process.execPath}" ${__dirname}/add_reducer_test.js ${context.KEBAB_FEATURE_NAME}`);

/* ==== Add sample page and test action ===== */
shell.exec(`"${process.execPath}" "${__dirname}/add_action.js" ${context.KEBAB_FEATURE_NAME}/${context.KEBAB_FEATURE_NAME}-test-action`);
shell.exec(`"${process.execPath}" "${__dirname}/add_page.js" ${context.KEBAB_FEATURE_NAME}/default-page`);
