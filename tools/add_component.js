'use strict';
// Summary:
//  Add a component
// Usage:
//  node add_component.js [feature-name] ComponentName

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
  throw new Error('Please specify the component name');
}

featureName = _.kebabCase(featureName);
componentName = _.upperFirst(_.camelCase(componentName));

let targetDir = `${__dirname}/../src/components`;
if (featureName) {
  targetDir = `${__dirname}/../src/features/${featureName}`;
}

const context = {
  COMPONENT_NAME: componentName,
  KEBAB_FEATURE_NAME: _.kebabCase(featureName || 'components'),
  KEBAB_COMPONENT_NAME: _.kebabCase(componentName),
  CSS_PREFIX: featureName || 'component',
  CSS_MIXINS_PATH: featureName ? '../../styles/mixins.less' : '../styles/mixins.less',
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

let lines;
let i;
let tpl;
let targetPath;

/* ==== Generate component class ==== */
console.log('Create component class');
targetPath = `${targetDir}/${componentName}.js`;
tpl = helpers.readTemplate('Component.js');
if (!shell.test('-e', targetPath)) {
  toSave(targetPath, helpers.processTemplate(tpl, context));
}

/* ==== Generate component less ==== */
console.log('Create component less');
targetPath = `${targetDir}/${componentName}.less`;
tpl = helpers.readTemplate('Component.less');
if (!shell.test('-e', targetPath)) {
  toSave(targetPath, helpers.processTemplate(tpl, context));
}

/* ==== Add to index.js ===== */
targetPath = path.join(targetDir, 'index.js');
lines = helpers.getLines(targetPath);
i = helpers.lineIndex(lines, 'export {');
if (i > 0 && !lines[i - 1]) {
  i -= 1;
}
if (i === -1) {
  i = 0;
}
lines.splice(i, 0, `import ${componentName} from './${componentName}';`);
if (i === 0) {
  lines.splice(1, 0, '');
}
i = helpers.lineIndex(lines, /^\};$/);
lines.splice(i, 0, `  ${componentName},`);
toSave(targetPath, lines);

/* ==== Add to style.less ==== */
console.log('Add entry to style.less');
targetPath = path.join(targetDir, 'style.less');
lines = helpers.getLines(targetPath);
i = helpers.lastLineIndex(lines, '@import ');
lines.splice(i + 1, 0, `@import './${componentName}.less';`);
toSave(targetPath, lines);

helpers.saveFiles(filesToSave);
console.log('Add component success: ', componentName);
