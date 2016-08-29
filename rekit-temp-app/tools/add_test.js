/*
  Add test file for page, component, action or reducer.
  Usage:
  node add_test.js feature-name/target-name
*/
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const arr = (process.argv[2] || '').split('/');
let featureName = _.kebabCase(arr[0]);
let targetName = arr[1];

if (!targetName) {
  targetName = featureName;
  featureName = '';
}

if (!targetName) {
  throw new Error('Please specify the target name');
}

// Check what's the type of target: page|component|action|reducer


