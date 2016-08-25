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
  throw new Error('Please set the feature name');
}

const context = {
  FEATURE_NAME: _.upperFirst(_.camelCase(featureName)),
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  KEBAB_FEATURE_NAME: _.kebabCase(featureName),
  UPPER_SNAKE_FEATURE_NAME: _.kebabCase(featureName).toUpperCase(),
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = `${__dirname}/../src/features/${context.KEBAB_FEATURE_NAME}`;
if (shell.test('-e', targetDir)) {
  throw new Error(`feature name existed: ${context.KEBAB_FEATURE_NAME}`);
}

// templated files
[
  'index.js',
  'route.js',
  'style.less',
].forEach(fileName => {
  console.log('processing file: ', fileName);
  const filePath = `${targetDir}/${fileName}`;
  const tpl = helpers.readTemplate(fileName);
  toSave(filePath, helpers.processTemplate(tpl, context));
});

// empty files
[
  'actions.js',
  'constants.js',
  'reducer.js',
  'selectors.js'
].forEach(fileName => {
  console.log('creating file: ', fileName);
  const filePath = path.join(targetDir, fileName);
  toSave(filePath, '');
});

let lines;
let i;
let targetPath;

/* ===== Add reducer to rootReducer.js ===== */
console.log('Add to root reducer.');
targetPath = path.join(__dirname, '../src/common/rootReducer.js');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^import /);
lines.splice(i + 1, 0, `import ${context.CAMEL_FEATURE_NAME}Reducer from '../features/${context.KEBAB_FEATURE_NAME}/reducer';`);
i = helpers.lastLineIndex(lines, /^\}\);$/);
lines.splice(i, 0, `  ${context.CAMEL_FEATURE_NAME}: ${context.CAMEL_FEATURE_NAME}Reducer,`);
toSave(targetPath, lines);

/* ===== Add route to routeConfig.js ===== */
console.log('Register route');
targetPath = path.join(__dirname, '../src/common/routeConfig.js');
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
targetPath = path.join(__dirname, '../src/styles/index.less');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^@import/);
lines.splice(i + 1, 0, `@import '../features/${context.KEBAB_FEATURE_NAME}/style.less';`);
toSave(targetPath, lines);

shell.mkdir(targetDir);
helpers.saveFiles(filesToSave);
console.log('Add feature done: ', featureName);

/* ==== Add sample page and test action ===== */
shell.exec(`node ${__dirname}/add_action.js ${context.KEBAB_FEATURE_NAME}/${context.KEBAB_FEATURE_NAME}-test-action`);
shell.exec(`node ${__dirname}/add_page.js ${context.KEBAB_FEATURE_NAME}/default-page`);
