'use strict';

// Summary:
//  Load plugins and export helper modules

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const utils = require('./utils');

const prjRoot = utils.getProjectRoot();
const plugins = [];

function injectExtensionPoints(func, command, targetName) {
  // Summary:
  //  Hook: add/move/remove elements

  function execExtension(hookName, args) {
    plugins.forEach((p) => {
      if (p.hooks && p.hooks[hookName]) {
        p.hooks[hookName].apply(p.hooks, args);
      }
    });
  }

  return function() { // eslint-disable-line
    const beforeHook = `before${_.pascalCase(command)}${_.pascalCase(targetName)}`;
    execExtension(beforeHook, arguments);

    const res = func.apply(null, arguments);

    const afterHook = `after${_.pascalCase(command)}${_.pascalCase(targetName)}`;
    execExtension(afterHook, arguments);

    return res;
  };
}

shell.ls(path.join(prjRoot, 'tools/plugins'))
  .filter(d => shell.test('-d', path.join(prjRoot, 'tools/plugins', d))) // only get dirs
  .forEach((d) => {
    const pluginRoot = path.join(prjRoot, 'tools/plugins', d);
    try {
      const config = require(path.join(pluginRoot, 'config'));
      const item = {
        config,
        commands: {},
        hooks: {},
      };

      if (config.accept) {
        config.accept.forEach(
          (name) => {
            name = _.camelCase(name);
            const commands = require(path.join(pluginRoot, name));
            item.commands[name] = {};
            Object.keys(commands).forEach((key) => {
              item.commands[name][key] = injectExtensionPoints(commands[key], key, name);
            });
          }
        );
      }

      if (shell.test('-e', path.join(pluginRoot, 'hooks.js'))) {
        item.hooks = require(path.join(pluginRoot, 'hooks'));
      }

      plugins.push(item);
    } catch (e) {
      console.log(`Warning: failed to load plugin: ${path.basename(d)}`);
      console.log(e);
    }
  });

function getCommand(command, typeName) {
  for (const p of plugins) {
    const a = _.get(p, `commands.${_.camelCase(typeName)}.${_.camelCase(command)}`);
    if (a) return a;
  }
  return null;
}

module.exports = {
  getCommand,
  plugins,
  injectExtensionPoints,
};
