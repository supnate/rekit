const _ = require('lodash');
const plugin = require('./plugin');

function getProjectData() {
  const plugins = plugin.getPlugins();
  let prjData = { elementById: {}, elements: [] };
  plugins.filter(p => p.app && p.app.getProjectData).forEach(p => {
    prjData = _.merge(prjData, p.app.getProjectData());
  });
  return prjData;
}

module.exports = {
  getProjectData,
};
