'use strict';

// Summary:
//  Load plugins and export helper modules

const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const utils = require('./utils');
// const template = require('./template');

let plugins = null;
function getPlugins(rekitCore) {
  if (!plugins) {
    loadPlugins(rekitCore); // eslint-disable-line
    // utils.fatal('Plugins have not been loaded.');
  }
  return plugins;
}

function injectExtensionPoints(func, command, targetName) {
  // Summary:
  //  Hook: add/move/remove elements

  function execExtension(hookName, args) {
    getPlugins().forEach((p) => {
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

function loadPlugins(rekitCore) {
  const prjRoot = utils.getProjectRoot();

  const prjPkgJson = require(utils.joinPath(prjRoot, 'package.json')); // eslint-disable-line

  // Find local plugins, all local plugins are loaded
  const localPluginsFolder = utils.joinPath(prjRoot, 'tools/plugins');
  plugins = [];
  if (shell.test('-e', localPluginsFolder)) {
    plugins = plugins.concat(shell.ls(localPluginsFolder)
      .filter(d => shell.test('-d', utils.joinPath(prjRoot, 'tools/plugins', d)))
      .map(d => utils.joinPath(prjRoot, 'tools/plugins', d)));
  }

  // Find installed plugins, only those defined in package.rekit.plugins are loaded.
  if (prjPkgJson.rekit && prjPkgJson.rekit.plugins) {
    plugins = plugins.concat(prjPkgJson.rekit.plugins.map(p => (
      path.isAbsolute(p)
      ? p
      : utils.joinPath(
          prjRoot,
          'node_modules',
          /^rekit-plugin-/.test(p) ? p : ('rekit-plugin-' + p)
        )
      )
    )); // rekit plugin should be prefixed with 'rekit-plugin'.
  }

  // Create plugin instances
  plugins = plugins.map((pluginRoot) => {
    try {
      const config = require(utils.joinPath(pluginRoot, 'config')); // eslint-disable-line
      const item = {
        config,
        commands: {},
        hooks: {},
      };

      if (config.accept) {
        config.accept.forEach(
          (name) => {
            name = _.camelCase(name);
            const commands = require(utils.joinPath(pluginRoot, name))(rekitCore);
            item.commands[name] = {};
            Object.keys(commands).forEach((key) => {
              item.commands[name][key] = injectExtensionPoints(commands[key], key, name);
            });
          }
        );
      }

      if (shell.test('-e', utils.joinPath(pluginRoot, 'hooks.js'))) {
        item.hooks = require(utils.joinPath(pluginRoot, 'hooks'))(rekitCore); // eslint-disable-line
      }
      return item;
    } catch (e) {
      const pluginName = path.basename(pluginRoot).replace(/^rekit-plugin-/, '');
      let err = '';
      if (/node_modules/.test(pluginRoot) && shell.test('-e', utils.joinPath(prjRoot, 'tools/plugins', pluginName))) {
        err = `\nTip: plugin ${pluginName} seems to be a local plugin, it shouldn't be registered in rekit section of package.json.`;
      }
      utils.warn(`Failed to load plugin: ${pluginName}, ${e}.${err}\n${e.stack}`);
    }

    return null;
  });
}

// Get the first matched command provided by some plugin
// Local plugin first, then installed plugin.
function getCommand(command, elementName) {
  // example: commands.asyncActionSaga.add
  const keyPath = `commands.${_.camelCase(elementName)}.${_.camelCase(command)}`;
  const found = getPlugins().find(item => _.has(item, keyPath));
  if (found) {
    return _.get(found, keyPath);
  }
  return null;
}

// function add(name) {
//   // Summary:
//   //  Add a local plugin.
//   name = _.kebabCase(name);

//   const pluginDir = utils.joinPath(utils.getProjectRoot(), 'tools/plugins', name);
//   shell.mkdir(pluginDir);
//   const configPath = utils.joinPath(pluginDir, name, 'config.js');
//   template.generate(configPath, {
//     templateFile: 'plugin/config.js',
//     context: {
//       pluginName: name,
//     },
//   });
// }

module.exports = {
  // add,
  getCommand,
  loadPlugins,
  getPlugins,
  injectExtensionPoints,
};
