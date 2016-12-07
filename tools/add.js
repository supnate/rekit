/* eslint no-cond-assign: 0*/
'use strict';

const args = require('./lib/args');
const utils = require('./lib/utils');
const rekit = require('./lib/rekit');
const vio = require('./lib/vio');
const plugin = require('./lib/plugin');

console.time('✨  Done');

const feature = args.feature;
const name = args.name;

const pluginAction = plugin.getAction('add', args.type);
if (pluginAction) {
  // Try exec command from plugin first
  pluginAction(feature, name);
} else {
  // If no command from plugin, exec standard Rekit commands.
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
      utils.error('Invalid arguments.');
      break;
  }
}

vio.flush();

console.timeEnd('✨  Done');
console.log('');
