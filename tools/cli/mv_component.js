'use strict';

// Summary:
//  Move/rename a component
// Usage:
//  node mv_component.js [feature-name]/ComponentName [feature-name-2]/ComponentName2

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const program = require('commander');
const helpers = require('./lib/helpers');
const inout = require('./lib/inout');
const component = require('./lib/component');
const style = require('./lib/style');
const test = require('./lib/test');

const source = {};
const dest = {};

program
  .arguments('<source> <dest>')
  .action((arg1, arg2) => {
    helpers.splitName(arg1, source);
    helpers.splitName(arg2, dest);
    if (!source.name) {
      source.name = source.feature;
      source.feature = null;
    }
  })
  .parse(process.argv);

component.move(source, dest);
style.move(source, dest);
test.move(source, dest);

inout.flush();
