/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Remove a Rekit element.

const args = require('./lib/args');
const vio = require('./lib/vio');
const rekit = require('./lib/rekit');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;

switch (args.type) {
  case 'feature':
    rekit.removeFeature(feature);
    break;

  case 'component':
    rekit.removeComponent(feature, name);
    break;

  case 'page':
    rekit.removePage(feature, name, args.urlPath);
    break;

  case 'action':
    rekit.removeAction(feature, name, args.actionType);
    break;

  case 'async-action':
    rekit.removeAsyncAction(feature, name);
    break;

  default:
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
