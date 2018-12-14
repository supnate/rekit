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

let plugins = [];
let loaded = false;
let needFilterPlugin = true;

const DEFAULT_PLUGIN_DIR = path.join(os.homedir(), '.rekit/plugins');
console.log(DEFAULT_PLUGIN_DIR)

function getPluginsDir() {
  return DEFAULT_PLUGIN_DIR;
}

function filterPlugins() {
  const rekitConfig = config.getRekitConfig();
  let appType = rekitConfig.appType;

  // If no appType configured, set it to the first matched plugin except common.
  // Pure folder plugin is always loaded.
  if (
    !appType
  ) {
    const appPlugin = _.find(plugins, p => p.isAppPlugin && p.appType !== 'common');
    appType = appPlugin.appType;
  }

  if (!appType) appType = 'common';
  config.setAppType(appType);

  plugins = plugins.filter(p => {
    return !p.appType || _.castArray(p.appType).includes(appType);
  });

  plugins.forEach(p => console.log('Plugin applied: ', p.name, p.ui ? p.ui.root : ''))

  needFilterPlugin = false;
}
function getPlugins(prop) {
  if (!loaded) {
    loadPlugins();
  }

  if (needFilterPlugin) {
    filterPlugins();
  }

  return prop ? plugins.filter(_.property(prop)) : plugins;
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
  return true;
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
      };
    }

    // Plugin meta
    Object.assign(pluginInstance, _.pick(pkgJson, ['appType', 'name', 'isAppPlugin', 'featureFiles']));
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
  if (!needFilterPlugin) {
    console.warn('You are adding a plugin after getPlugins is called.');
  }
  needFilterPlugin = true;
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
