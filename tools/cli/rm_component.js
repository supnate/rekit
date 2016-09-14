'use strict';
// Summary:
//  Remove a component
// Usage:
//  node remove_component.js feature-name componentName

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
let featureName = _.kebabCase(arr[0]);

let componentName = arr[1];

if (!componentName) {
  componentName = featureName;
  featureName = '';
}

if (!componentName) {
  console.log('Error: Please set the component name');
  process.exit(1);
}
componentName = helpers.pascalCase(componentName);

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

let targetDir = path.join(helpers.getProjectRoot(), 'src/components');
if (featureName) {
  targetDir = path.join(helpers.getProjectRoot(), `src/features/${featureName}`);
}

let lines;
let targetPath;

// Remove files
shell.rm(`${targetDir}/${componentName}.js`);
shell.rm(`${targetDir}/${componentName}.less`);

/* ===== Remove from index.js ===== */
console.log('Remove entry from index.js');
targetPath = path.join(targetDir, 'index.js');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `import ${componentName} from './${componentName}';`);
helpers.removeLines(lines, `  ${componentName},`);
toSave(targetPath, lines);

/* ===== Remove from style.less ===== */
console.log('Remove entry from style.less');
targetPath = path.join(targetDir, 'style.less');
lines = helpers.getLines(targetPath);
helpers.removeLines(lines, `@import './${componentName}.less';`);
toSave(targetPath, lines);


// remove test file
console.log('Removing test file');
const testFile = path.join(
  helpers.getProjectRoot(),
  'test/app',
  featureName ? `features/${featureName}/${componentName}.test.js` : `components/${componentName}.test.js`
);
shell.rm(testFile);

// Save files
helpers.saveFiles(filesToSave);
console.log('Remove component success: ', componentName);
