const app = require('./core/app');
const element = require('./core/element');
const plugin = require('./core/plugin');
const paths = require('./core/paths');
const vio = require('./core/vio');
const ast = require('./common/ast');
const projectFiles = require('./common/projectFiles');

paths.setProjectRoot('/Users/pwang7/workspace/app-next/');
// paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-studio');

global.rekit = {
  core: {
    app,
    paths,
    plugin,
    element,
    vio,
  },
  common: {
    projectFiles,
    ast,
  },
};

plugin.loadPlugins();

module.exports = global.rekit;
