const files = require('./files');
const plugin = require('./plugin');

const app = {};

function getProjectData(args = {}) {
  const plugins = plugin.getPlugins('app.getProjectData');
  const prjData = {};
  if (plugins.length) {
    plugins.forEach(p => Object.assign(prjData, p.app.getProjectData(args)));
  }

  app.lastGetProjectDataTimestamp = files.lastChangeTime;
  return prjData;
}

Object.assign(app, {
  getProjectData,
});

module.exports = app;
