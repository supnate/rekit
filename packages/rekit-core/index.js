const app = require('./core/app');
const plugin = require('./core/plugin');
const paths = require('./core/paths');

const projectFiles = require('./common/projectFiles');

paths.setProjectRoot('/Users/pwang7/workspace/app-next/');

global.rekit = {
  core: {
    app,
    paths,
    plugin,
  },
  common: {
    projectFiles,
  },
};

plugin.loadPlugins();

module.exports = global.rekit;
