'use strict';

// Summary:
//  Load plugins

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const paths = require('./paths');
const config = require('./config');

const plugins = [];
let loaded = false;

function getPlugins(prop) {
  if (!loaded) {
    loadPlugins();
  }

  const appType = config.getRekitConfig().appType || 'common';
  // get plugins support current app type, like React, Vue etc
  const appPlugins = plugins.filter(
    p => !p.appType || _.castArray(p.appType).includes(appType) // default app type is common
  );
  if (!_.find(appPlugins, p => p.isAppPlugin)) {
    console.log('all plugins: ', plugins.map(p => p.name));

    console.log('current plugins: ', appPlugins.map(p => p.name));
    throw new Error(`No plugin to support current project type: ${appType}`);
  }
  return prop ? appPlugins.filter(_.property(prop)) : appPlugins;
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
