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
const featureName = arr[0];
let pageName = arr[1];
const urlPath = args[3] || _.kebabCase(pageName);

if (!featureName || !pageName) {
  throw new Error('Please set the feature name and page name');
}

pageName = _.upperFirst(_.camelCase(pageName));

const targetDir = `${__dirname}/../src/features/${featureName}`;

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
tpl = shell.cat(`${__dirname}/feature_template/Page.js`);
if (!shell.test('-e', targetPath)) {
  toSave(targetPath, helpers.processTemplate(tpl, context));
}

/* ==== Generate page less ==== */
console.log('Create page less');
targetPath = `${targetDir}/${pageName}.less`;
tpl = shell.cat(`${__dirname}/feature_template/Page.less`);
if (!shell.test('-e', targetPath)) {
  toSave(targetPath, helpers.processTemplate(tpl, context));
}

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
i = helpers.lineIndex(lines, 'export {');
if (i > 0 && !lines[i - 1]) {
  i -= 1;
}
lines.splice(i, 0, `import ${pageName} from './${pageName}';`);
if (i === 0) {
  lines.splice(1, 0, '');
}
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
if (i === -1) {
  i = helpers.lastLineIndex(lines, /^ {2}\]/);
}
lines.splice(i, 0, `    { path: '${urlPath}', component: ${context.PAGE_NAME} },`);
toSave(targetPath, lines);

helpers.saveFiles(filesToSave);
console.log('Add page success: ', pageName);
