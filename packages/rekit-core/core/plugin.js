'use strict';

// Summary:
//  Load plugins

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const paths = require('./paths');

const plugins = [];
let loaded = false;
function getPlugins(prop) {
  if (!loaded) {
    loadPlugins();
  }
  return prop ? plugins.filter(_.property(prop)) : plugins;
}

// Load plugin instance
function loadPlugin(pluginRoot) {
  try {
    return require(paths.join(pluginRoot, 'core'));
  } catch (e) {
    const pluginName = path.basename(pluginRoot).replace(/^rekit-plugin-/, '');
    console.warn(`Failed to load plugin: ${pluginName}, ${e}\n${e.stack}`);
  }

  return null;
}

function loadPlugins() {
  if (loaded) return;
  const localPluginRoot = paths.localPluginRoot;

  const prjPkgJson = require(paths.map('package.json'));

  // Find local plugins, all local plugins are loaded
  let pluginFolders = [];
  if (fs.existsSync(localPluginRoot)) {
    pluginFolders = pluginFolders.concat(
      shell
        .ls(localPluginRoot)
        .filter(d => fs.existsSync(paths.join(localPluginRoot, d)))
        .map(d => paths.join(localPluginRoot, d))
    );
  }

  // Find installed plugins, only those defined in package.rekit.plugins are loaded.
  if (prjPkgJson.rekit && prjPkgJson.rekit.plugins) {
    pluginFolders = pluginFolders.concat(
      prjPkgJson.rekit.plugins.map(
        p => (path.isAbsolute(p) ? p : require.resolve(/^rekit-plugin-/.test(p) ? p : 'rekit-plugin-' + p))
      )
    );
  }

  // Create plugin instances
  pluginFolders.map(loadPlugin).forEach(addPlugin);
  loaded = true;
}

// Dynamically add an plugin
function addPlugin(plugin) {
  if (!plugin.name) throw new Error('Each plugin should have a name.');
  if (_.find(plugins, { name: plugin.name })) {
    console.warn('You should not add a plugin again with name: ' + plugin.name);
    return;
  }
  plugins.push(plugin);
}

function removePlugin(pluginName) {
  const removed = _.remove(plugins, { name: pluginName });
  if (!removed.length) console.warn('No plugin was removed: ' + pluginName);
}

module.exports = {
  getPlugins,
  loadPlugins,
  addPlugin,
  removePlugin,
};
