/* eslint no-cond-assign: 0*/
'use strict';

const args = require('./lib/args');
const rekit = require('./lib/rekit');
const vio = require('./lib/vio');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;

switch (args.type) {
  case 'feature':
    rekit.addFeature(feature);
    vio.flush();
    vio.reset();

    // Add sample page and sample action.
    rekit.addPage(feature, 'default-page');
    rekit.addAction(feature, 'sample-action');
    break;

  case 'component':
    rekit.addComponent(feature, name);
    break;

  case 'page':
    rekit.addPage(feature, name, args.urlPath);
    break;

  case 'action':
    rekit.addAction(feature, name, args.actionType);
    break;

  case 'async-action':
    rekit.addAsyncAction(feature, name);
    break;

  default:
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
