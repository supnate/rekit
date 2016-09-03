'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');

const args = process.argv;
const arr = (args[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const actionName = _.kebabCase(arr[1]);
const camelActionName = _.camelCase(actionName);

if (!actionName) {
  throw new Error('Please specify the action name.');
}

const targetDir = path.join(__dirname, `../test/app/features/${featureName}/redux`);
const targetPath = path.join(targetDir, `${camelActionName}.test.js`);
shell.rm(targetPath);

console.log('Remove action test success: ', actionName);
