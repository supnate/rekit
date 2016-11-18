/* eslint no-cond-assign: 0*/
'use strict';
// usage: add [-h] [-v] [-u urlPath] [-t actionType] type name

// Create component, page, action, or test for a Rekit project.

// Positional arguments:
//   type                  Type of element to create: one of [component, page,
//                         action, async-action, test]
//   name                  Name of the element.

// Optional arguments:
//   -h, --help            Show this help message and exit.
//   -v, --version         Show program's version number and exit.
//   -u urlPath, --url-path urlPath
//                         Url path for page, defaults to kebab case of the page
//                         name, e.g., page-name.
//   -t actionType, --action-type actionType
//                         Action type for sync action, defaults to upper snake
//                         case of the action name, e.g., ACTION_NAME.

const args = require('./lib/args');
const inout = require('./lib/inout');
const component = require('./lib/component');
const route = require('./lib/route');
const style = require('./lib/style');
const test = require('./lib/test');
const action = require('./lib/action');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;

switch (args.type) {
  case 'component':
    component.add(feature, name);
    style.add(feature, name);
    test.add(feature, name);
    break;

  case 'page':
    component.add(feature, name, { templateFile: 'Page.js' });
    route.add(feature, name, args.urlPath);
    style.add(feature, name);
    test.add(feature, name, { templateFile: 'Page.test.js' });
    break;

  case 'action':
    action.add(feature, name, { actionType: args.actionType });
    test.addAction(feature, name, { actionType: args.actionType });
    break;

  case 'async-action':
    action.addAsync(feature, name);
    // test.addAction(feature, name);
    break;

  default:
    break;
}

inout.flush();

console.timeEnd('✨  Done');
console.log('');
