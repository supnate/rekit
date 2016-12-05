/* eslint no-cond-assign: 0*/
'use strict';
// Summary:
//   Remove a Rekit element.

const args = require('./lib/args');
const vio = require('./lib/vio');
const rekit = require('./lib/rekit');
const plugin = require('./lib/plugin');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;

function callPlugin() {
  const pluginAction = plugin.getAction('remove', args.type);
  if (pluginAction) {
    // console.log('calling: ', pluginAction, feature, name);
    pluginAction(feature, name);
    return true;
  }
  return false;
}

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
    callPlugin();
    break;
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
