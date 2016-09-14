'use strict';
// Summary:
//  Add a page
// Usage:
//  node remove_page.js featureName pageName
// Example:
//  node remove_page.js employee ListView

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
let pageName = arr[1];

if (!featureName || !pageName) {
  console.log('Error: Please set the feature name and page name');
  process.exit(1);
}

pageName = helpers.pascalCase(pageName);
const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

const targetDir = path.join(helpers.getProjectRoot(), `src/features/${featureName}`);

let lines;
let targetPath;

// Remove files
shell.rm(`${targetDir}/${pageName}.js`);
shell.rm(`${targetDir}/${pageName}.less`);

/* ==== Remove from style.less ==== */
console.log('Remove entry from style.less');
targetPath = path.join(targetDir, 'style.less');
lines = helpers.getLines(targetPath);
_.pull(lines, `@import './${pageName}.less';`);
toSave(targetPath, lines);

/* ==== Remove entry from index.js ==== */
console.log('Remove entry from index.js');
targetPath = path.join(targetDir, 'index.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `import ${pageName} from './${pageName}';`);
helpers.removeLines(lines, `  ${pageName},`);
toSave(targetPath, lines);

/* ==== Remove from route.js ==== */
console.log('Remove from route.js');
targetPath = path.join(targetDir, 'route.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `  ${pageName},`);
helpers.removeLines(lines, `component: ${pageName} }`);
toSave(targetPath, lines);

// Remove test file
console.log('Removing test file');
const testFile = path.join(helpers.getProjectRoot(), `test/app/features/${featureName}/${pageName}.test.js`);
shell.rm(testFile);

// Save files
helpers.saveFiles(filesToSave);
console.log('Remove page success: ', pageName);
