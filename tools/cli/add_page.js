'use strict';
// Summary:
//  Add a page
// Usage:
//  node add_page.js featureName/pageName [urlPath]
// Example:
//  node add_page.js employee/ListView [list]

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const args = process.argv;
const arr = (args[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
let pageName = arr[1];
const urlPath = args[3] || _.kebabCase(pageName);

if (!featureName || !pageName) {
  console.log('Error: Please set the feature name and page name');
  process.exit(1);
}

pageName = _.upperFirst(_.camelCase(pageName));

const targetDir = path.join(helpers.getProjectRoot(), `src/features/${featureName}`);
if (shell.test('-e', path.join(targetDir, `${pageName}.js`))) {
  console.log(`Error: Page has been existed: ${pageName}`);
  process.exit(1);
}

const context = {
  FEATURE_NAME: featureName,
  PAGE_NAME: pageName,
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  KEBAB_PAGE_NAME: _.kebabCase(pageName),
  KEBAB_FEATURE_NAME: _.kebabCase(featureName),
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

let lines;
let i;
let tpl;
let targetPath;

/* ==== Generate page class ==== */
console.log('Create page class');
targetPath = `${targetDir}/${pageName}.js`;
tpl = helpers.readTemplate('Page.js');
toSave(targetPath, helpers.processTemplate(tpl, context));

/* ==== Generate page less ==== */
console.log('Create page less');
targetPath = `${targetDir}/${pageName}.less`;
tpl = helpers.readTemplate('Page.less');
toSave(targetPath, helpers.processTemplate(tpl, context));

/* ==== Add to style.less ==== */
console.log('Add entry to style.less');
targetPath = path.join(targetDir, 'style.less');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, '@import ');
lines.splice(i + 1, 0, `@import './${pageName}.less';`);
toSave(targetPath, lines);

/* ==== Add to index.js ==== */
console.log('Add entry to index.js');
targetPath = path.join(targetDir, 'index.js');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, /^import /);
lines.splice(i + 1, 0, `import ${pageName} from './${pageName}';`);
i = helpers.lineIndex(lines, /^\};$/);
lines.splice(i, 0, `  ${pageName},`);
toSave(targetPath, lines);

/* ==== Add to route.js ==== */
console.log('Add route to route.js');
targetPath = path.join(targetDir, 'route.js');
lines = helpers.getLines(targetPath);
i = helpers.lineIndex(lines, '} from \'./index\';');
lines.splice(i, 0, `  ${context.PAGE_NAME},`);
i = helpers.lineIndex(lines, 'path: \'*\'');
// istanbul ignore else
if (i === -1) {
  i = helpers.lastLineIndex(lines, /^ {2}\]/);
}
lines.splice(i, 0, `    { path: '${urlPath}', component: ${context.PAGE_NAME} },`);
toSave(targetPath, lines);

helpers.saveFiles(filesToSave);
console.log('Add page success: ', pageName);

shell.exec(`"${process.execPath}" "${path.join(__dirname, 'add_page_test.js')}" ${featureName}/${pageName}`);
