const app = require('./app');
const plugin = require('./plugin');
const paths = require('./paths');

paths.setProjectRoot('/Users/pwang7/workspace/cra2');

module.exports = Object.assign({
  app,
  plugin,
});

global.rekit = {
  core: {
    app,
    paths,
    plugin,
  },
};

plugin.loadPlugins();

console.log('project data: ', app.getProjectData());
