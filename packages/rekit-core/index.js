const app = require('./core/app');
const element = require('./core/element');
const plugin = require('./core/plugin');
const paths = require('./core/paths');
const vio = require('./core/vio');
const template = require('./core/template');
const config = require('./core/config');
const ast = require('./core/ast');
const refactor = require('./core/refactor');
const projectFiles = require('./common/projectFiles');
const utils = require('./common/utils');

paths.setProjectRoot('/Users/pwang7/workspace/app-next/');
// paths.setProjectRoot('/Users/pwang7/workspace/rekit/packages/rekit-studio');

global.rekit = {
  core: {
    app,
    paths,
    plugin,
    element,
    vio,
    template,
    config,
    refactor,
    ast,
  },
  common: {
    projectFiles,
    utils,
  },
};

plugin.loadPlugins();

module.exports = global.rekit;
