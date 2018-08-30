'use strict';

// Summary:
//  Load plugins

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const paths = require('./paths');

let plugins = null;

function getPlugins(prop) {
  if (!plugins) {
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
  const localPluginRoot = paths.localPluginRoot;

  const prjPkgJson = require(paths.map('package.json'));

  // Find local plugins, all local plugins are loaded
  plugins = [];
  if (fs.existsSync(localPluginRoot)) {
    plugins = plugins.concat(
      shell
        .ls(localPluginRoot)
        .filter(d => fs.existsSync(paths.join(localPluginRoot, d)))
        .map(d => paths.join(localPluginRoot, d))
    );
  }

  // Find installed plugins, only those defined in package.rekit.plugins are loaded.
  if (prjPkgJson.rekit && prjPkgJson.rekit.plugins) {
    plugins = plugins.concat(
      prjPkgJson.rekit.plugins.map(
        p => (path.isAbsolute(p) ? p : require.resolve(/^rekit-plugin-/.test(p) ? p : 'rekit-plugin-' + p))
      )
    );
  }

  // Create plugin instances
  plugins = plugins.map(loadPlugin);
}

module.exports = {
  getPlugins,
  loadPlugins,
};
