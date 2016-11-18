/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Remove a Rekit element.

const args = require('./lib/args');
const vio = require('./lib/vio');
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
    component.remove(feature, name);
    style.remove(feature, name);
    test.remove(feature, name);
    break;

  case 'page':
    component.remove(feature, name);
    route.remove(feature, name, args.urlPath);
    style.remove(feature, name);
    test.remove(feature, name);
    break;

  case 'action':
    action.remove(feature, name, args.actionType);
    test.removeAction(feature, name);
    break;

  case 'async-action':
    action.removeAsync(feature, name);
    test.removeAction(feature, name);
    break;

  default:
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
