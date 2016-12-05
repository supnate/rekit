/* eslint no-cond-assign: 0*/
'use strict';

const args = require('./lib/args');
const rekit = require('./lib/rekit');
const vio = require('./lib/vio');
const plugin = require('./lib/plugin');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;


function callPlugin() {
  const pluginAction = plugin.getAction('add', args.type);
  if (pluginAction) {
    // console.log('calling: ', pluginAction, feature, name);
    pluginAction(feature, name);
    return true;
  }
  return false;
}

switch (args.type) {
  case 'feature':
    rekit.addFeature(feature);
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
    callPlugin();
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
