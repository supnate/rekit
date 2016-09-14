/*
  Add test file for page
  Usage:
    node add_page_test.js feature-name/page-name
*/
'use strict';
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const testPath = path.join(helpers.getProjectRoot(), 'test/app');

const arr = (process.argv[2] || '').split('/');
const featureName = _.kebabCase(arr[0]);
const pageName = arr[1];

if (!pageName) {
  console.log('Error: Please specify the page name');
  process.exit(1);
}

const context = {
  KEBAB_FEATURE_NAME: _.kebabCase(featureName || 'components'),
  CAMEL_FEATURE_NAME: _.camelCase(featureName),
  PAGE_NAME: helpers.pascalCase(pageName),
  KEBAB_PAGE_NAME: _.kebabCase(pageName),
};

const targetPath = path.join(testPath, `features/${featureName}/${context.PAGE_NAME}.test.js`);
helpers.ensurePathDir(targetPath);
if (!shell.test('-e', targetPath)) {
  const res = helpers.handleTemplate('page_test.js', context);
  shell.ShellString(res).to(targetPath);
}

console.log('Add page test success: ', process.argv[2]);
