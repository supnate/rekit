const app = require('./core/app');
const element = require('./core/element');
const plugin = require('./core/plugin');
const paths = require('./core/paths');
const ast = require('./core/ast');

const projectFiles = require('./common/projectFiles');

paths.setProjectRoot('/Users/pwang7/workspace/app-next/');

global.rekit = {
  core: {
    app,
    paths,
    plugin,
    element,
    ast,
  },
  common: {
    projectFiles,
  },
};

plugin.loadPlugins();

module.exports = global.rekit;
