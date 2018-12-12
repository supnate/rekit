'use strict';

// Summary:
//  Load plugins

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const os = require('os');
const paths = require('./paths');
const config = require('./config');

const plugins = [];
let loaded = false;

const DEFAULT_PLUGIN_DIR = path.join(os.homeDir(), '.rekit/plugins');

function getPluginsDir() {
  return DEFAULT_PLUGIN_DIR;
}

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

function isPluginValidForProject(plugin) {
  // Detect if folder structure is for the plugin
  if (
    _.isArray(plugin.featureFiles) &&
    !plugin.featureFiles.every(
      f => (f.startsWith('!') ? !fs.existsSync(paths.map(f.replace('!', ''))) : fs.existsSync(paths.map(f)))
    )
  ) {
    return false;
  }
  const rekitConfig = config.getRekitConfig();
  const appType = rekitConfig.appType;

  // If no appType configured, set it to the first matched plugin.
  // Pure folder plugin is always loaded.
  if (
    !appType &&
    plugin.isAppPlugin &&
    plugin.appType
  ) {
    config.setAppType(appType);
    return true;
  }

  // Detect if plugin supports the current appType
  if (!appType || !plugin.appType || (appType && _.castArray(plugin.appType).includes(appType))) {
    return true;
  }
  return false;
}

// Load plugin instance, plugin depends on project config
function loadPlugin(pluginRoot) {
  console.log('Loading plugin: ' + pluginRoot);
  try {
    const pkgJson = require(paths.join(pluginRoot, 'package.json'));
    const pluginInstance = {};
    // Core part
    const coreIndex = paths.join(pluginRoot, 'core/index.js');
    if (fs.existsSync(coreIndex)) {
      Object.assign(pluginInstance, require(coreIndex));
    }

    // UI part
    if (fs.existsSync(path.join(pluginRoot, 'build/main.js'))) {
      pluginInstance.ui = {
        root: path.join(pluginRoot, 'build'),
        mainJs: path.join(pluginRoot, 'build/main.js'),
      };
    }

    // Plugin meta
    Object.assgin(pluginInstance, _.pick(pkgJson, ['appType', 'name', 'isAppPlugin', 'featureFiles']));

    if (!isPluginValidForProject(pluginInstance)) return null;
    return pluginInstance;
  } catch (e) {
    console.warn(`Failed to load plugin: ${pluginRoot}, ${e}\n${e.stack}`);
  }

  return null;
}

function loadPlugins() {
  if (loaded) return;
  const localPluginRoot = paths.getLocalPluginRoot();

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
  pluginFolders.forEach(addPluginByPath);
  loaded = true;
}

// Dynamically add an plugin
function addPlugin(plugin) {
  if (!plugin.name) throw new Error('Each plugin should have a name.');
  if (_.find(plugins, { name: plugin.name })) {
    console.warn('You should not add a plugin with same name: ' + plugin.name);
    return;
  }
  plugins.push(plugin);
}

function addPluginByPath(pluginRoot) {
  const p = loadPlugin(pluginRoot);
  if (p) plugins.push(p);
}

function removePlugin(pluginName) {
  const removed = _.remove(plugins, { name: pluginName });
  if (!removed.length) console.warn('No plugin was removed: ' + pluginName);
}

module.exports = {
  getPlugins,
  loadPlugins,
  addPlugin,
  addPluginByPath,
  removePlugin,
  getPluginsDir,
};
