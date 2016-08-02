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
let featureName = arr[0];
let componentName = arr[1];

if (!componentName) {
  componentName = featureName;
  featureName = '';
}


if (!componentName) {
  throw new Error('Please set the component name');
}
featureName = _.kebabCase(featureName);
componentName = _.upperFirst(_.camelCase(componentName));

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

let targetDir = `${__dirname}/../src/components`;
if (featureName) {
  targetDir = `${__dirname}/../src/features/${featureName}`;
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

// Save files
helpers.saveFiles(filesToSave);
console.log('Remove component success: ', componentName);
