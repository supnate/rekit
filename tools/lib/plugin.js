'use strict';

// Summary:
//  Load plugins and export helper modules

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const helpers = require('./helpers');

const prjRoot = helpers.getProjectRoot();
const plugins = [];

shell.ls(path.join(prjRoot, 'tools/plugins'))
  .filter(d => shell.test('-d', path.join(prjRoot, 'tools/plugins', d)))
  .forEach((d) => {
    const pluginRoot = path.join(prjRoot, 'tools/plugins', d);
    try {
      const index = require(path.join(pluginRoot, 'index'));
      const item = {
        index,
        actions: {},
      };

      if (index.accept) {
        index.accept.forEach(
          (name) => {
            name = _.camelCase(name);
            item.actions[name] = require(path.join(pluginRoot, name));
          }
        );
      }

      plugins.push(item);
    } catch (e) {
      console.log(`Warning: failed to load plugin: ${path.basename(d)}`);
      console.log(e);
    }
  });

function getAction(action, typeName) {
  for (const p of plugins) {
    const a = _.get(p, `actions.${_.camelCase(typeName)}.${_.camelCase(action)}`);
    if (a) return a;
  }
  return null;
}

module.exports = {
  getAction,
  plugins,
};
