const app = require('./core/app');
const element = require('./core/element');
const plugin = require('./core/plugin');
const paths = require('./core/paths');
const vio = require('./core/vio');
const template = require('./core/template');
const config = require('./core/config');
const ast = require('./core/ast');
const refactor = require('./core/refactor');
const deps = require('./core/deps');
const handleCommand = require('./core/handleCommand');

// paths.setProjectRoot('/Users/pwang7/workspace/app-next/');
// if (process.env.NODE_ENV !== 'production') paths.setProjectRoot('/Users/pwang7/workspace/rekitebaynode/');

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
    deps,
    handleCommand,
  },
};

// plugin.loadPlugins();

plugin.addPlugin(require('../rekit-studio/src/features/plugin-default/core'));
plugin.addPlugin(require('../rekit-studio/src/features/plugin-terminal/core'));
// if (process.env.NODE_ENV !== 'production') plugin.addPlugin(require('../rekit-studio/src/features/plugin-cra/core'));

module.exports = global.rekit;
