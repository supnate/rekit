const paths = require('./paths');
const files = require('./files');
const plugin = require('./plugin');

const app = {};

function getProjectData() {
  const plugins = plugin.getPlugins('app.getProjectData');
  const prjData = {};
  if (plugins.length) {
    plugins.forEach(p => Object.assign(prjData, p.app.getProjectData()));
  }
  if (!prjData.elements || !prjData.elementById) Object.assign(prjData, files.readDir(paths.map('src')));
  app.lastGetProjectDataTimestamp = files.lastChangeTime;
  return prjData;
}

Object.assign(app, {
  getProjectData,
});

module.exports = app;
