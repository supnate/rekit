const shell = require('shelljs');
const { files, paths } = rekit.core;

function create() {}
function getProjectData() {
  console.log('prj root: ', paths.getProjectRoot());
  return files.readDir(paths.getProjectRoot());
}

function canOpen(prjDir) {
  return true;
}

module.exports = {
  getProjectData,
  canOpen,
};
